# Nirmaan — Architecture

Two-stage system for norm-aware building design and site execution.

## Stage 1 (this repo) — Design & Planning Workspace

Web application where a construction manager defines a project, checks it
against a catalogue of Indian building norms, generates a preliminary
structural design, produces a WBS + schedule — and edits the whole plan by
speaking, conversationally.

### Backend (`backend/`)

```
app/
  main.py            FastAPI app, CORS, routers
  config.py          env settings (Sarvam key, models)
  schemas.py        pydantic models — snake_case in, camelCase on the wire
  engines.py         compliance + design engines (authoritative port)
  wbs.py             WBS template + schedule math
  project_factory.py params → full project record
  store.py           in-memory store (Postgres replaces it behind the same interface)
  sarvam_client.py   Saaras STT · Bulbul TTS · Sarvam-105B chat
  voice_sessions.py  dialogue state, LLM intent parsing, validated edits
  routes/            projects CRUD · voice session + turns
```

### Frontend (`src/`)

```
src/
  components/   UI building blocks, grouped by domain (layout, ui, projects,
                compliance, schedule, agent, voice)
  pages/        Route-level views; one folder concept per route
  services/    API seam (api.js, projectService, voiceService). The UI never
               builds URLs or parses errors itself.
  hooks/       useProjects, useVoiceSession (conversation + recorder state)
  data/        Static reference data for the wizard's instant local preview
               (the backend engines are authoritative for stored projects)
  utils/       Pure helpers: formatting, date/schedule math
```

### Data flow

```
Wizard / VoiceTab ──REST──▶ FastAPI
                               │
                               ├─▶ engines.py        (params × norms catalogue → checks)
                               ├─▶ project_factory  (checks + design + WBS → project)
                               └─▶ store            (today: memory · later: Postgres)

Voice turn:  audio ─▶ Saaras STT ─▶ Sarvam-105B (JSON edits, validated against
            the schema whitelist) ─▶ rebuild ─▶ Bulbul TTS ─▶ spoken reply
```

`projectService`/`voiceService` on the frontend and `ProjectStore` on the
backend are the two seams. The frontend keeps ports of the engines only for
the wizard's instant preview; the backend is authoritative for everything
stored. Engine logic lives in pure functions on both sides and is written to
stay in sync.

## Stage 2 — Site Voice Agent (external)

Runs on Sarvam Voice Agents (Samvaad), connected to a phone number.

- **Inbound:** site workers call with general construction or project-specific
  questions. Answers come from (a) the knowledge base published from Stage 1
  and (b) API tools that query this app's backend live.
- **Outbound:** a nightly call to the manager collects progress against the
  WBS; a webhook posts the call result back, which lands in the project
  record as a Daily Progress Report.

The Stage 1 "Publish to Site Agent" action is the bridge: it packages the
project brief, compliance sheet, design summary and WBS for the agent's
knowledge base. The publishing target (`services/agentService.js`, future)
will call the Sarvam Deployments API; webhooks will return progress data.

## Reference data honesty

`src/data/normsCatalog.js` contains a small, illustrative set of entries
modeled on IS 456, IS 875, IS 1893, IS 13920, IS 1904 and NBC 2016. It exists
to prove the compliance-check architecture. Production requires a properly
licensed, verified catalogue — and every generated design must be signed off
by a licensed structural engineer.
