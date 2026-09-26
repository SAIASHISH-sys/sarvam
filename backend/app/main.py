"""Nirmaan API — Stage 1 backend with conversational voice plan editing.

Run:  uvicorn app.main:app --reload --port 8000   (from backend/)
Docs:  http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import load_settings
from app.routes import projects, voice

settings = load_settings()

app = FastAPI(title="Nirmaan API", version="0.1.0")
app.state.settings = settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(voice.router)


@app.get("/health", tags=["meta"])
async def health() -> dict:
    return {"status": "ok", "sarvam_configured": settings.has_api_key}
