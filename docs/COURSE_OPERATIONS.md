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
| `curriculum/tracks/*.yaml` | Role-track example overlays (all 12 modules for each track) |
| `curriculum/sandboxes/*.yaml` | Static try-it exercises (`session-*` for workshops; `module-*` preferred on module pages) |
| `curriculum/gallery/capstone-examples.yaml` | Capstone before/after stories |
| `curriculum/modules/*/demo.yaml` + `public/course/demos/` | Worked before/after visuals |
| `curriculum/modules/*/module.yaml` `steps:` | Lesson submodules (orient / ideas / apply) mapped to H2 headings |
| `curriculum/glossary.yaml` | Hover/sheet glossary |

After editing templates, copy into `public/templates/` so downloads work.

Progress is stored in `localStorage` under `llm-course-progress-v2` (migrates from v1). Fields include `completedSteps` (per-module lesson steps). A module completes when the learner scores **75% or higher** on its quiz (best score is kept across retries). Quiz options are shuffled with a deterministic seed per question so the correct choice is not always first. The header notes that progress saves on this device only. Continue links use `#step-*` hashes; the module page focuses that step once it is unlocked.

### Learner-experience features

- **Export / Import** buttons in the header download progress as `llm-leverage-progress.json` and restore it on another device. Imports are validated (`src/lib/progress/export.ts`) so a bad file never wipes progress.
- **Command palette** (`⌘K` or the Search button) jumps to any module, page, or glossary term.
- **Time remaining** shows in the header, summed from incomplete modules' `durationMinutes`.
- **Dark mode** via `next-themes` (`.dark` tokens in `globals.css`); toggle in the header.
- **Mobile module nav**: below the `lg` breakpoint the sidebar is replaced by an "All modules" sheet on module pages.
- **Role prompt**: a one-time banner on module pages asks for the learner's role (dismissal stored under `llm-course-role-prompt-dismissed`).
- **Recap card** appears at the quiz step once a module is complete, listing objectives and linking to the next module and `/review`.
- **Review mode** (`/review`) samples up to 10 quiz questions from completed modules (`src/lib/quiz/review-sample.ts`); it never changes progress.
- **Flashcards** (`/flashcards`) turn every glossary term into a flip card; missed cards re-queue until known (`src/lib/flashcards/deck.ts`).
- **Capstone pack builder** (`/capstone`) seeds BRIEF/SOURCES/HANDOFF from `public/templates/`, saves drafts under `llm-course-capstone-<file>`, and downloads finished markdown files.
- **Scratchpad**: per-module notes saved under `llm-course-notes-<moduleId>`, kept outside the progress store so Reset never deletes them.
- **Returning-learner banner** on the marketing home shows percent complete and a Continue button when the device has progress.
- **Certificates** remember the learner's name (`llm-course-learner-name`) and offer an "Add to LinkedIn" profile link alongside Print/PDF.
- **Accessibility**: step changes announce via an `aria-live` region; global `prefers-reduced-motion` support in `globals.css`.

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
4. Scoring 75%+ on the quiz marks the module complete. Below that, the score is saved (best kept) and the learner can retry.
5. Modules are soft-open: learners may jump ahead. A “recommended after Module N” banner appears when prior modules are incomplete. Continue still follows the recommended path.

## Contact email

Set `NEXT_PUBLIC_CONTACT_EMAIL` in the environment (local `.env.local` or Vercel project settings) to enable the home-page rollout form. Without it, the contact CTA stays disabled and shows a setup hint. Do not hardcode a personal inbox in the source.

## Deploy

```bash
npx vercel --yes
```

Or connect the GitHub repo to a Vercel project. Framework: Next.js.

Current production alias: https://llm-leverage-course.vercel.app
