"""Project CRUD routes."""

from fastapi import APIRouter, HTTPException, Request, status

from app.schemas import Project, ProjectCreateRequest
from app.store import get_store

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[Project])
async def list_projects() -> list[Project]:
    return get_store().list()


@router.post("", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(body: ProjectCreateRequest) -> Project:
    return get_store().create(body.params, body.start_date)


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str) -> Project:
    project = get_store().get(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail=f"No project with id '{project_id}'")
    return project


@router.post("/{project_id}/publish", response_model=Project)
async def publish_project(project_id: str, _request: Request) -> Project:
    project = get_store().publish(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail=f"No project with id '{project_id}'")
    return project
