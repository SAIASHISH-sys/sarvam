"""Conversational plan editing.

A session keeps the dialogue history so follow-ups work ("make it three
floors" … "and increase the cover a bit"). Each turn: transcribe → LLM parses
edits against the current plan → apply → rebuild the project → speak the
confirmation. Edits are absolute values, which makes corrections and
reversions ("no, back to G+4") natural.
"""

import json
import re
import uuid
from dataclasses import dataclass, field

from pydantic import ValidationError

from app.project_factory import build_project
from app.sarvam_client import SarvamClient, SarvamUnavailableError
from app.schemas import Project, ProjectParams
from app.store import ProjectStore

MAX_HISTORY_MESSAGES = 20

# Wire (camelCase) key -> ProjectParams field. The whitelist is the LLM's
# contract: nothing outside it can be edited by voice.
EDITABLE_FIELDS = {
    "floors": "floors",
    "plotArea": "plot_area",
    "floorHeight": "floor_height",
    "seismicZone": "seismic_zone",
    "basicWindSpeed": "basic_wind_speed",
    "soilType": "soil_type",
    "buildingType": "building_type",
    "concreteGrade": "concrete_grade",
    "slabSpan": "slab_span",
    "slabThickness": "slab_thickness",
    "nominalCover": "nominal_cover",
}

SYSTEM_PROMPT_TEMPLATE = """You are the voice plan editor inside Nirmaan, a building design and \
construction planning tool. The user is speaking to you about their project plan.

CURRENT PLAN PARAMETERS (JSON):
{params}

You may change only these fields, with these constraints:
- floors: one of "G+1", "G+2", "G+3", "G+4", "G+5"
- plotArea: plot area in m², number between 50 and 100000
- floorHeight: floor height in metres, 2.4 to 6.0
- seismicZone: "II", "III", "IV" or "V"
- basicWindSpeed: one of 39, 44, 47, 50 (m/s)
- soilType: "hard", "medium" or "soft"
- buildingType: "Residential", "Commercial" or "Institutional"
- concreteGrade: "M20", "M25", "M30" or "M35"
- slabSpan: typical slab span in metres, 1.0 to 12.0
- slabThickness: slab thickness in mm, 75 to 400
- nominalCover: nominal cover in mm, 15 to 75

Respond with ONLY a JSON object, no other text:
{{"edits": {{<field>: <absolute new value>, ...}}, "reply": "<one or two short sentences>", \
"reply_language": "<BCP-47 code of your reply, e.g. hi-IN or en-IN>"}}

Rules:
- Edits are ABSOLUTE target values, never deltas. If the user says "one more \
floor", compute the new value from the current parameters.
- If the user asks a question about the plan, return empty edits and answer \
briefly in "reply".
- If the request is ambiguous, ask one short clarifying question and return \
empty edits.
- If the user wants to revert something, set the field back to its earlier value.
- Reply in the language the user is speaking. Keep replies short — they are \
spoken aloud.
- Never invent fields outside the list above. Never output markdown or code fences."""


@dataclass
class VoiceSession:
    id: str
    project_id: str
    history: list[dict] = field(default_factory=list)


_sessions: dict[str, VoiceSession] = {}


def create_session(project_id: str) -> VoiceSession:
    session = VoiceSession(id=uuid.uuid4().hex[:12], project_id=project_id)
    _sessions[session.id] = session
    return session


def get_session(session_id: str) -> VoiceSession | None:
    return _sessions.get(session_id)


def build_system_prompt(params: ProjectParams) -> str:
    return SYSTEM_PROMPT_TEMPLATE.format(params=params.model_dump_json(by_alias=True))


def _extract_json(content: str) -> dict | None:
    """Pull the JSON object out of an LLM reply, tolerating code fences."""
    fence = re.search(r"```(?:json)?\s*(.*?)```", content, re.DOTALL)
    text = fence.group(1) if fence else content
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end <= start:
        return None
    try:
        return json.loads(text[start : end + 1])
    except json.JSONDecodeError:
        return None


def apply_edits(
    current: ProjectParams, edits: dict
) -> tuple[ProjectParams, list[str], list[str]]:
    """Apply LLM edits one field at a time; invalid values are rejected, not fatal.

    Returns (new_params, applied_wire_keys, rejected_wire_keys).
    """
    applied: list[str] = []
    rejected: list[str] = []
    data = current.model_dump()
    for wire_key, value in (edits or {}).items():
        field_name = EDITABLE_FIELDS.get(wire_key)
        if field_name is None:
            rejected.append(wire_key)
            continue
        candidate = dict(data)
        candidate[field_name] = value
        try:
            current = ProjectParams(**candidate)
            data = current.model_dump()
            applied.append(wire_key)
        except ValidationError:
            rejected.append(wire_key)
    return current, applied, rejected


async def process_turn(
    session: VoiceSession,
    transcript: str,
    detected_language: str,
    sarvam: SarvamClient,
    store: ProjectStore,
) -> dict:
    """Run one conversational turn and return the VoiceTurnResponse payload."""
    project = store.get(session.project_id)
    if project is None:
        raise KeyError(f"Project {session.project_id} no longer exists")

    session.history.append({"role": "user", "content": transcript})
    messages = [{"role": "system", "content": build_system_prompt(project.params)}]
    messages.extend(session.history[-MAX_HISTORY_MESSAGES:])

    raw_reply = await sarvam.chat(messages)
    parsed = _extract_json(raw_reply) or {}

    edits = parsed.get("edits") or {}
    reply = str(parsed.get("reply") or "").strip() or (
        "I couldn't update the plan. Could you repeat that?"
    )
    reply_language = str(
        parsed.get("reply_language") or detected_language or "en-IN"
    )

    new_params, applied, rejected = apply_edits(project.params, edits)
    if applied:
        progress_map = {task.key: task.progress for task in project.wbs}
        updated = build_project(
            new_params,
            project_id=project.id,
            created_at=project.created_at,
            status=project.status,
            progress_map=progress_map,
        )
        updated.agent_published_at = project.agent_published_at
        store.save(updated)
        project = updated

    if rejected:
        reply += " (I couldn't apply: " + ", ".join(rejected) + ".)"
    session.history.append({"role": "assistant", "content": reply})

    # Speaking the reply must never lose the edit: TTS failure degrades to text.
    audio_base64 = None
    try:
        audio_base64 = await sarvam.synthesize(reply, reply_language)
    except SarvamUnavailableError:
        pass

    return {
        "transcript": transcript,
        "reply": reply,
        "language_code": reply_language,
        "changed_fields": applied,
        "project": project,
        "audio_base64": audio_base64,
    }
