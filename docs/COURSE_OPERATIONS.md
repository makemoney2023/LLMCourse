# Course operations

## Content workflow

1. Edit files under `curriculum/` only.
2. Run `npm test` — includes content quality checks for all 12 modules.
3. Run `npm run build` before shipping.
4. Workshop **slide decks** live in `curriculum/workshops/session-XX.slides.yaml` (layouts: title, section, bullets, steps, activity, discussion, takeaway). Optional prose agendas remain in `session-XX.md`. Per-module facilitator notes stay in each module's `workshop.md`.

## Learner experience content

The marketing home (`/`) is the buyer-facing course overview. The learner hub starts at `/modules`, where Continue, checkpoints, and the module list live.

| Path | Purpose |
|------|---------|
| `curriculum/templates/` | BRIEF / SOURCES / HANDOFF starters (also copied to `public/templates/`) |
| `curriculum/tracks/*.yaml` | Role-track example overlays |
| `curriculum/sandboxes/*.yaml` | Static try-it exercises |
| `curriculum/gallery/capstone-examples.yaml` | Capstone before/after stories |
| `curriculum/modules/*/demo.yaml` + `public/course/demos/` | Worked before/after visuals |
| `curriculum/modules/*/module.yaml` `steps:` | Lesson submodules (orient / ideas / apply) mapped to H2 headings |
| `curriculum/glossary.yaml` | Hover/sheet glossary |

After editing templates, copy into `public/templates/` so downloads work.

Progress is stored in `localStorage` under `llm-course-progress-v2` (migrates from v1). Fields include `completedSteps` (per-module lesson steps). A module completes when the learner submits its quiz. Module N+1 unlocks only after Module N is complete.

## Glossary terms

Canonical definitions live in `curriculum/glossary.yaml`.

To add a term:

1. Add an entry with unique `id`, `term`, optional `aliases`, `shortDefinition` (tooltip, keep under ~160 chars), `longDefinition` (2–5 short sentences), and `relatedModules` slugs.
2. Do not reuse an alias that matches another term (matching is case-insensitive).
3. Prefer plain words first; put the jargon label in `term`.
4. Run `npm test` — glossary tests enforce uniqueness, HARD_TERMS coverage, and a minimum term count.
5. Lessons auto-link the first occurrence of each term; no `[[wiki]]` markup required.

## Progress storage

Learner progress is stored in `localStorage` under key `llm-course-progress-v2` (migrates from v1). Tracks completed modules/steps/exercises, quiz scores, role track, checkpoints, sandboxes, and certificates. No server auth — client-trusted localStorage only.

### Sequential locking

1. Lesson steps unlock in order (`orient` → `ideas` → `apply`).
2. Practice unlocks when all three lesson steps are marked done.
3. Quiz unlocks when every exercise in the module is marked done.
4. Submitting the quiz marks the module complete and unlocks the next module.

## Deploy

```bash
npx vercel --yes
```

Or connect the GitHub repo to a Vercel project. Framework: Next.js.

Current production alias: https://llm-leverage-course.vercel.app
