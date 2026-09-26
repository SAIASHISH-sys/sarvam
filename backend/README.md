# Nirmaan API — backend

FastAPI backend for the Stage-1 workspace, with conversational voice plan
editing powered by the Sarvam AI stack:

- **Saaras v3** (`/speech-to-text`) transcribes what you say (22 Indian
  languages + English, auto-detected, WebM supported).
- **Sarvam-105B** (`/v1/chat/completions`) turns the transcript into
  structured, validated plan edits — with full dialogue history so follow-ups
  and reversions work.
- **Bulbul** (`/text-to-speech`) speaks the confirmation back in your
  language.

## Setup

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env       # then put your key in SARVAM_API_KEY
uvicorn app.main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs

## Voice session flow

```
POST /projects/{id}/voice/sessions        → { sessionId, project }
POST /voice/sessions/{sid}/turn/audio     → multipart audio → edits + reply + audio
POST /voice/sessions/{sid}/turn/text      → typed fallback, same contract
```

Each turn returns the transcript, the assistant's spoken reply, the base64
WAV audio, the changed field keys, and the freshly rebuilt project — the UI
just swaps it in. Edits are absolute values validated against the schema;
anything the model hallucinates outside the whitelist is rejected, never
applied.
