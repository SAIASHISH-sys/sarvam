# Ground Rules

Non-negotiable standards for this repository. A PR that breaks any of these does
not get merged — no exceptions, no "I'll clean it up later".

## 1. No sloppy or useless code

- Every file, function and component must earn its place. If it can be deleted
  without anything breaking, delete it.
- No dead code, no commented-out blocks, no `console.log` left in commits.
- No placeholder features that look functional but do nothing (fake search
  boxes, dead buttons). Either wire it up or leave it out.
- Name things for what they do. `ComplianceTable`, not `Table2`.
- Errors are handled, not swallowed. No empty `catch {}`.

## 2. No "AI-generated purple slop" UI

- The palette is deliberate: light neutral surfaces (`slate`), one strong
  accent (construction orange `orange-600`), semantic status colours only
  (emerald / amber / red / slate).
- No purple, no violet, no indigo, no gradients used as decoration, no
  glassmorphism, no glow effects.
- Colour carries meaning (status, emphasis) — it is never ornament.
- Data-dense views use `tabular-nums`, hairline `slate-200` borders, and
  restrained spacing. The reference aesthetic is a drafting sheet, not a
  landing page.

## 3. Modular, properly maintained code

- One responsibility per file. React components live in `src/components/<domain>/`,
  route pages in `src/pages/`, pure business logic in `src/services/`,
  static reference data in `src/data/`, pure helpers in `src/utils/`.
- Components stay under ~150 lines. When one grows past that, split it.
- The UI never imports mock data directly — it goes through `src/services/`,
  so the backend can replace the service bodies without touching a single
  component.
- Pure functions (engines, date math) are kept separate from React and are
  written to be unit-testable.
- Commits are small and described in the imperative ("Add compliance status
  filter", not "updates").
- Reusable primitives (`Button`, `Badge`, `Card`, …) are the only place styling
  decisions get repeated. Feature components compose them; they do not
  re-style the same things inline in five places.

## Domain-specific rule

- Code clauses and norm values in `src/data/` are sample/educational entries
  for architecture purposes. They must never be presented as a substitute for
  the actual BIS codes or a licensed engineer's sign-off.
