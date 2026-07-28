# Course operations

## Content workflow

1. Edit files under `curriculum/` only.
2. Run `npm test` — includes content quality checks for all 12 modules.
3. Run `npm run build` before shipping.
4. Workshop **slide decks** live in `curriculum/workshops/session-XX.slides.yaml` (layouts: title, section, bullets, steps, activity, discussion, takeaway). Optional prose agendas remain in `session-XX.md`. Per-module facilitator notes stay in each module's `workshop.md`.

## Learner experience content

| Path | Purpose |
|------|---------|
| `curriculum/templates/` | BRIEF / SOURCES / HANDOFF starters (also copied to `public/templates/`) |
| `curriculum/tracks/*.yaml` | Role-track example overlays |
| `curriculum/sandboxes/*.yaml` | Static try-it exercises |
| `curriculum/gallery/capstone-examples.yaml` | Capstone before/after stories |
| `curriculum/modules/*/demo.yaml` + `public/course/demos/` | Worked before/after visuals |
| `curriculum/glossary.yaml` | Hover/sheet glossary |

After editing templates, copy into `public/templates/` so downloads work.

Progress is stored in `localStorage` under `llm-course-progress-v2` (migrates from v1).

## Glossary terms

Canonical definitions live in `curriculum/glossary.yaml`.

To add a term:

1. Add an entry with unique `id`, `term`, optional `aliases`, `shortDefinition` (tooltip, keep under ~160 chars), `longDefinition` (2–5 short sentences), and `relatedModules` slugs.
2. Do not reuse an alias that matches another term (matching is case-insensitive).
3. Prefer plain words first; put the jargon label in `term`.
4. Run `npm test` — glossary tests enforce uniqueness, HARD_TERMS coverage, and a minimum term count.
5. Lessons auto-link the first occurrence of each term; no `[[wiki]]` markup required.

## Progress storage

Learner progress is stored in `localStorage` under key `llm-course-progress-v1` (completed modules, exercises, quiz scores, revealed answers). No server auth in v1.

## Deploy

```bash
npx vercel --yes
```

Or connect the GitHub repo to a Vercel project. Framework: Next.js.

Current production alias: https://llm-leverage-course.vercel.app
