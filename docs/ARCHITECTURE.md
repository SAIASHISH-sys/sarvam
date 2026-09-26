# Nirmaan — Architecture

Two-stage system for norm-aware building design and site execution.

## Stage 1 (this repo) — Design & Planning Workspace

Web application where a construction manager defines a project, checks it
against a catalogue of Indian building norms, generates a preliminary
structural design, and produces a WBS + schedule.

```
src/
  components/   UI building blocks, grouped by domain (layout, ui, projects,
                compliance, schedule, agent)
  pages/        Route-level views; one folder concept per route
  services/     The application's real logic: compliance engine, design
                generator, project factory, project service (data access)
  data/         Static reference data: norms catalogue, WBS template,
                sample projects, agent call log
  utils/        Pure helpers: formatting, date/schedule math
```

### Data flow

```
Wizard params ──▶ projectFactory ──▶ Project record
                      │
                      ├─▶ complianceEngine (params × normsCatalog → checks)
                      ├─▶ designEngine     (params → system + members)
                      └─▶ wbsTemplate       (params → dated task list)

UI ⇄ projectService ⇄ (today: in-memory store · later: REST backend)
```

`projectService` is the single seam between UI and data. The backend will
replace its method bodies with `fetch()` calls; signatures and every consumer
stay untouched. Engines and utils are pure functions — no React, no network —
so they can be lifted into the backend unchanged and unit-tested there.

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
