"""Voice plan-editing routes: session creation and audio/text turns."""

from fastapi import APIRouter, File, HTTPException, Request, UploadFile, status

from app.sarvam_client import SarvamClient, SarvamUnavailableError
from app.schemas import SessionResponse, TextTurnRequest, VoiceTurnResponse
from app.store import get_store
from app import voice_sessions

router = APIRouter(tags=["voice"])


def _get_sarvam(request: Request) -> SarvamClient:
    return SarvamClient(request.app.state.settings)


def _require_project(project_id: str):
    project = get_store().get(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail=f"No project with id '{project_id}'")
    return project


def _require_session(session_id: str) -> voice_sessions.VoiceSession:
    session = voice_sessions.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail=f"No voice session with id '{session_id}'")
    return session


@router.post(
    "/projects/{project_id}/voice/sessions",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def start_voice_session(project_id: str) -> SessionResponse:
    project = _require_project(project_id)
    session = voice_sessions.create_session(project_id)
    return SessionResponse(session_id=session.id, project=project)


@router.post(
    "/voice/sessions/{session_id}/turn/audio",
    response_model=VoiceTurnResponse,
)
async def audio_turn(request: Request, session_id: str, audio: UploadFile = File(...)) -> VoiceTurnResponse:
    session = _require_session(session_id)
    sarvam = _get_sarvam(request)
    try:
        content = await audio.read()
        transcript, language = await sarvam.transcribe(content, audio.filename)
    except SarvamUnavailableError as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(error)) from error
    return await _run_turn(session, transcript, language, sarvam)


@router.post(
    "/voice/sessions/{session_id}/turn/text",
    response_model=VoiceTurnResponse,
)
async def text_turn(request: Request, session_id: str, body: TextTurnRequest) -> VoiceTurnResponse:
    session = _require_session(session_id)
    sarvam = _get_sarvam(request)
    return await _run_turn(session, body.text, "en-IN", sarvam)


async def _run_turn(session, transcript, language, sarvam) -> VoiceTurnResponse:
    try:
        result = await voice_sessions.process_turn(
            session, transcript, language, sarvam, get_store()
        )
    except SarvamUnavailableError as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(error)) from error
    return VoiceTurnResponse(**result)
