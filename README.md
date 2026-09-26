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
- Publish a project package for the Stage 2 site voice agent.

> The norms data and generated designs are educational samples. Real projects
> require the actual BIS codes and a licensed structural engineer's sign-off.

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

## Repository layout

```
docs/      ground rules, architecture decisions
src/
  components/  reusable UI, grouped by domain
  pages/       route views
  services/   engines + project service (the backend seam)
  data/       norms catalogue, WBS template, sample data
  utils/      pure formatting and schedule helpers
```

See `docs/GROUND_RULES.md` before contributing — it is short and it is law.

## Roadmap

- [ ] Stage 1: backend API (FastAPI + Postgres) behind `projectService`
- [ ] Stage 1: real norms catalogue with clause-level provenance
- [ ] Stage 2: agent on Sarvam Voice Agents, knowledge base publishing
- [ ] Stage 2: nightly manager check-in calls + webhook progress reports
