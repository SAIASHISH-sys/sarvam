"""Project factory: assembles a full project record by running the engines,
mirroring the frontend factory. Pure — same inputs, same outputs."""

from datetime import date, datetime

from app.engines import SOIL_LABELS, evaluate_compliance, generate_design, summarize_compliance
from app.schemas import Project, ProjectParams
from app.wbs import build_wbs, overall_progress

_AUTO_ID = 2


def build_project(
    params: ProjectParams,
    *,
    project_id: str | None = None,
    start_date: date | None = None,
    created_at: datetime | None = None,
    status: str = "active",
    progress_map: dict[str, float] | None = None,
) -> Project:
    floors_count = int(params.floors.replace("G+", ""))
    tasks = build_wbs(start_date or date.today(), floors_count)
    if progress_map:
        tasks = [
            task.model_copy(update={"progress": progress_map.get(task.key, task.progress)})
            for task in tasks
        ]

    compliance = evaluate_compliance(params)
    design = generate_design(params)
    codes: list[str] = []
    for check in compliance:
        if check["code"] not in codes:
            codes.append(check["code"])

    return Project(
        id=project_id or f"prj_{_next_id():03d}",
        name=params.name,
        client=params.client,
        location=f"{params.city}, {params.state}".rstrip(", "),
        status=status,  # type: ignore[arg-type]
        created_at=created_at or datetime.now(),
        params=params,
        soil_label=SOIL_LABELS[params.soil_type],
        codes=codes,
        compliance=compliance,
        compliance_summary=summarize_compliance(compliance),
        design=design,
        wbs=tasks,
        progress=overall_progress(tasks),
        agent_published_at=None,
    )


def _next_id() -> int:
    global _AUTO_ID
    _AUTO_ID += 1
    return _AUTO_ID
