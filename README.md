# Nirmaan

Stage 1 of a two-stage construction tool: a norm-aware design, compliance and
planning workspace for Indian building projects, with a hand-off path to a
multilingual site voice agent (Stage 2, built on Sarvam Voice Agents).

**What it does today**

- Define a project through a guided wizard (site, environment, structure).
- Run it against a catalogue of Indian building-norm entries (IS 456, IS 875,
  IS 1893, IS 13920, IS 1904, NBC 2016 — sample set).
- Generate a preliminary structural design summary and member schedule.
- Generate a WBS with dated schedule, Gantt view and progress tracking.
- **Edit the plan by speaking** — a conversational voice editor powered by the
  Sarvam AI stack (Saaras v3 STT → Sarvam-105B → Bulbul TTS), with follow-ups
  and reversions.
- Publish a project package for the Stage 2 site voice agent.

> The norms data and generated designs are educational samples. Real projects
> require the actual BIS codes and a licensed structural engineer's sign-off.

## Quick start (two terminals)

Backend — FastAPI + Sarvam voice editing:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # add your SARVAM_API_KEY (dashboard.sarvam.ai)
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
npm install
cp .env.example .env        # VITE_API_BASE=http://localhost:8000
npm run dev
```

## Repository layout

```
backend/   FastAPI app: engines (ported), store, Sarvam client, voice sessions
docs/      ground rules, architecture decisions
src/
  components/  reusable UI, grouped by domain (incl. voice)
  pages/       route views
  services/   API seam + voice service (frontend keeps engine ports for the
              wizard's instant preview; the backend is authoritative)
  data/       norms catalogue, WBS template, sample data
  utils/      pure formatting and schedule helpers
```

See `docs/GROUND_RULES.md` before contributing — it is short and it is law.

## Roadmap

- [x] Stage 1: backend API (FastAPI) behind `projectService`
- [x] Stage 1: conversational voice plan editing (Sarvam STT/LLM/TTS)
- [ ] Stage 1: Postgres persistence behind the store
- [ ] Stage 1: real norms catalogue with clause-level provenance
- [ ] Stage 2: agent on Sarvam Voice Agents, knowledge base publishing
- [ ] Stage 2: nightly manager check-in calls + webhook progress reports
