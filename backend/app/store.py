"""In-memory project store with the same two seed projects as the frontend
demo had. Postgres replaces this class later — the interface is the contract."""

from datetime import date, datetime

from app.project_factory import build_project
from app.schemas import Project, ProjectParams


def _seed_params_ashray() -> ProjectParams:
    return ProjectParams(
        name="Ashray Residences",
        client="Mishra Family Trust",
        city="Bhubaneswar",
        state="Odisha",
        building_type="Residential",
        plot_area=2400,
        floors="G+4",
        floor_height=3.0,
        seismic_zone="III",
        basic_wind_speed=50,
        soil_type="medium",
        concrete_grade="M25",
        slab_span=3.9,
        slab_thickness=150,
        nominal_cover=25,
    )


def _seed_params_vidya() -> ProjectParams:
    return ProjectParams(
        name="Vidya School Block",
        client="Vidya Charitable Society",
        city="Nagpur",
        state="Maharashtra",
        building_type="Institutional",
        plot_area=5000,
        floors="G+2",
        floor_height=3.6,
        seismic_zone="II",
        basic_wind_speed=44,
        soil_type="hard",
        concrete_grade="M20",
        slab_span=4.5,
        slab_thickness=150,
        nominal_cover=30,
    )


def _seed_projects() -> dict[str, Project]:
    ashray = build_project(
        _seed_params_ashray(),
        project_id="prj_001",
        start_date=date(2026, 6, 1),
        created_at=datetime(2026, 5, 20, 10, 0),
        progress_map={
            "mobilise": 1.0, "layout": 1.0, "excavation": 1.0, "footings": 1.0,
            "floor-cycle-1": 1.0, "floor-cycle-2": 1.0, "floor-cycle-3": 0.75,
        },
    )
    ashray.agent_published_at = datetime(2026, 7, 14, 18, 30)

    vidya = build_project(
        _seed_params_vidya(),
        project_id="prj_002",
        start_date=date(2026, 11, 2),
        created_at=datetime(2026, 9, 18, 9, 15),
        status="draft",
    )
    return {p.id: p for p in (ashray, vidya)}


class ProjectStore:
    """Newest project first, matching the dashboard's expectations."""

    def __init__(self) -> None:
        self._projects = _seed_projects()
        self._order = ["prj_002", "prj_001"]  # newest first

    def list(self) -> list[Project]:
        return [self._projects[pid] for pid in self._order if pid in self._projects]

    def get(self, project_id: str) -> Project | None:
        return self._projects.get(project_id)

    def create(self, params: ProjectParams, start_date: date | None = None) -> Project:
        project = build_project(params, start_date=start_date)
        self._projects[project.id] = project
        self._order.insert(0, project.id)
        return project

    def save(self, project: Project) -> None:
        self._projects[project.id] = project

    def publish(self, project_id: str) -> Project | None:
        project = self.get(project_id)
        if project is None:
            return None
        project.agent_published_at = datetime.now()
        return project


_STORE = ProjectStore()


def get_store() -> ProjectStore:
    return _STORE
