"""Pydantic schemas. Fields are snake_case in Python, camelCase on the wire
(the contract the frontend was built against)."""

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

FLOORS = Literal["G+1", "G+2", "G+3", "G+4", "G+5"]
SEISMIC_ZONE = Literal["II", "III", "IV", "V"]
WIND_SPEED = Literal[39, 44, 47, 50]
SOIL_TYPE = Literal["hard", "medium", "soft"]
BUILDING_TYPE = Literal["Residential", "Commercial", "Institutional"]
CONCRETE_GRADE = Literal["M20", "M25", "M30", "M35"]


def _to_camel(name: str) -> str:
    first, *rest = name.split("_")
    return first + "".join(word.capitalize() for word in rest)


class CamelModel(BaseModel):
    """snake_case in Python, camelCase over the API."""

    model_config = ConfigDict(alias_generator=_to_camel, populate_by_name=True)


class ProjectParams(CamelModel):
    name: str = Field(min_length=1, max_length=120)
    client: str = ""
    city: str = Field(min_length=1, max_length=80)
    state: str = ""
    building_type: BUILDING_TYPE = "Residential"
    plot_area: float = Field(gt=0, le=100_000)
    floors: FLOORS = "G+4"
    floor_height: float = Field(default=3.0, ge=2.4, le=6.0)
    seismic_zone: SEISMIC_ZONE = "III"
    basic_wind_speed: WIND_SPEED = 44
    soil_type: SOIL_TYPE = "medium"
    concrete_grade: CONCRETE_GRADE = "M25"
    slab_span: float = Field(gt=0, le=12)
    slab_thickness: int = Field(ge=75, le=400)
    nominal_cover: int = Field(ge=15, le=75)


class WbsTask(CamelModel):
    key: str
    phase: str
    task: str
    duration: int = Field(gt=0)
    start: date
    end: date
    progress: float = Field(default=0.0, ge=0.0, le=1.0)


class Project(CamelModel):
    id: str
    name: str
    client: str
    location: str
    status: Literal["active", "draft"] = "active"
    created_at: datetime
    params: ProjectParams
    soil_label: str
    codes: list[str]
    compliance: list[dict]
    compliance_summary: dict[str, int]
    design: dict
    wbs: list[WbsTask]
    progress: float
    agent_published_at: datetime | None = None


class ProjectCreateRequest(CamelModel):
    params: ProjectParams
    start_date: date | None = None


class TextTurnRequest(CamelModel):
    text: str = Field(min_length=1, max_length=2000)


class VoiceTurnResponse(CamelModel):
    transcript: str
    reply: str
    language_code: str
    changed_fields: list[str]
    project: Project
    audio_base64: str | None = None


class SessionResponse(CamelModel):
    session_id: str
    project: Project


class PublishResponse(CamelModel):
    project: Project
