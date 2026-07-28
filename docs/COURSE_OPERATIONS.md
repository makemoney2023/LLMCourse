# Course operations

## Content workflow

1. Edit files under `curriculum/` only.
2. Run `npm test` — includes content quality checks for all 12 modules.
3. Run `npm run build` before shipping.
4. Workshop **slide decks** live in `curriculum/workshops/session-XX.slides.yaml` (layouts: title, section, bullets, steps, activity, discussion, takeaway). Optional prose agendas remain in `session-XX.md`. Per-module facilitator notes stay in each module's `workshop.md`.

## Progress storage

Learner progress is stored in `localStorage` under key `llm-course-progress-v1` (completed modules, exercises, quiz scores, revealed answers). No server auth in v1.

## Deploy

```bash
npx vercel --yes
```

Or connect the GitHub repo to a Vercel project. Framework: Next.js.

Current production alias: https://llm-leverage-course.vercel.app
