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

Progress is stored in `localStorage` under `llm-course-progress-v2` (migrates from v1). Fields include `completedSteps` (per-module lesson steps). A module completes when the learner scores **75% or higher** on its quiz (best score is kept across retries). Each quiz keeps a bank of **8+ questions** and samples **5 per attempt** (`src/lib/quiz/sample-questions.ts`), so retries see different questions; options are shuffled with a deterministic seed per question so the correct choice is not always first. The header notes that progress saves on this device only. Continue links use `#step-*` hashes; the module page focuses that step once it is unlocked.

### Learner-experience features

- **Export / Import** buttons in the header download progress as `llm-leverage-progress.json` and restore it on another device. Imports are validated (`src/lib/progress/export.ts`) so a bad file never wipes progress.
- **Command palette** (`⌘K` or the Search button) jumps to any module, page, or glossary term.
- **Time remaining** shows in the header, summed from incomplete modules' `durationMinutes`.
- **Dark mode** via `next-themes` (`.dark` tokens in `globals.css`); toggle in the header.
- **Mobile module nav**: below the `lg` breakpoint the sidebar is replaced by an "All modules" sheet on module pages.
- **Role prompt**: a one-time banner on module pages asks for the learner's role (dismissal stored under `llm-course-role-prompt-dismissed`).
- **Recap card** appears at the quiz step once a module is complete, listing objectives and linking to the next module and `/review`.
- **Review mode** (`/review`) samples up to 10 quiz questions from completed modules (`src/lib/quiz/review-sample.ts`); it never changes progress.
- **Flashcards** (`/flashcards`) turn every glossary term into a flip card; missed cards re-queue until known (`src/lib/flashcards/deck.ts`). Per-card stats persist under `llm-course-flashcard-stats`, so previously missed cards surface first on the next visit (`src/lib/flashcards/stats.ts`).
- **Feedback link**: every module step shows a "Tell us about this section" mailto prefilled with the module and step (`src/lib/feedback/feedback-mailto.ts`); it requires `NEXT_PUBLIC_CONTACT_EMAIL` and hides otherwise.
- **Print**: printing a module page outputs the full lesson (all steps) with app chrome hidden; certificates keep their own print styles.
- **Capstone pack builder** (`/capstone`) mirrors Module 12 end to end: a scope form (Exercise 1), all eight pack files seeded from `public/templates/` (BRIEF, SOURCES, WALL_RULES, PLAYBOOK, TOOLS, OWNERSHIP, HANDOFF, VERIFY), a readiness checklist from the exercise answer key, a LOOKBACK.md editor for after the run, and a "share your story" section that copies a gallery-format snippet. Drafts save under `llm-course-capstone-*` keys.
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

## SEO and sharing

`src/app/sitemap.ts` and `robots.ts` cover every static page, module, and workshop. OpenGraph/Twitter cards use a generated image (`src/app/opengraph-image.tsx`). Set `NEXT_PUBLIC_SITE_URL` in production so `metadataBase`, the sitemap, and share links use the canonical origin (falls back to `VERCEL_URL`, then localhost). A custom 404 (`src/app/not-found.tsx`) routes lost visitors back to `/modules`.

## YouTube Shorts studio (P0 / P1 batch + P2 publish)

Curriculum under `curriculum/` remains the source of truth. The sibling `content-studio/` package turns Module anchors into faceless Shorts (kinetic text on branded backgrounds) without changing learner routes.

| Path | Purpose |
|------|---------|
| `content-studio/src/schema/script-pack.ts` | Script pack schema + validation |
| `content-studio/fixtures/*.yaml` | Golden / hand packs (e.g. Module 1 desk-space) |
| `content-studio/src/audio/tts.ts` | ElevenLabs TTS + sha256 cache under `out/.audio-cache/` |
| `content-studio/src/audio/music.ts` | `music_caption` bed picker from `audio/beds/` |
| `content-studio/audio/beds/` | Cleared music beds only (see README; empty until licensed) |
| `content-studio/src/remotion/` | Remotion compositions: `TitlePunch` (one_idea), `ListReveal` (myth_fix), `LoopSnippet` (loop_moment); optional `audioSrc` |
| `content-studio/src/batch/run-batch.ts` | Weekly batch orchestrator (extract → script → audio → render) |
| `content-studio/src/publish/approval.ts` | Parse `approval.yaml`; publisher gate helper |
| `content-studio/src/publish/description.ts` | CTA + course URL with UTM (`utm_campaign=<pack.id>`) |
| `content-studio/src/publish/youtube.ts` | Dry-run plan + live OAuth resumable upload / schedule |
| `content-studio/docs/YOUTUBE_OAUTH.md` | One-time OAuth setup for live publish |
| `content-studio/out/` | Rendered mp4 batches (**gitignored** — never commit) |

### Shorts env vars (names only — never commit secrets)

| Variable | Purpose |
|----------|---------|
| `ELEVENLABS_API_KEY` | TTS API key |
| `ELEVENLABS_VOICE_ID` | Voice id for `format: voice` |
| `SHORTS_DRY_AUDIO=1` | Write silent wav stubs without API keys / beds (local dry runs) |
| `YOUTUBE_CLIENT_ID` | OAuth client ID (live publish) |
| `YOUTUBE_CLIENT_SECRET` | OAuth client secret (live publish) |
| `YOUTUBE_REFRESH_TOKEN` | OAuth refresh token (live publish) |

OAuth setup steps: `content-studio/docs/YOUTUBE_OAUTH.md`.

Batch writes per-id files under `out/batch-YYYY-MM-DD/audio/`, then `defaultRenderShort` stages each file into `public/batch-audio/` and passes a public-relative `audioSrc` (e.g. `batch-audio/<id>.wav`). Compositions call `staticFile()` via `toRemotionAudioSrc` so Remotion’s `/public` static base applies (raw absolute FS paths 404 as `http://localhost:3000/Users/...`). Composition is chosen from hook series: `myth_fix` → ListReveal, `loop_moment` → LoopSnippet, else TitlePunch. Extractor tags objectives containing myth / vs / mistake as `myth_fix`. Hook selection round-robins modules and, when the pool allows, prefers at least one `loop_moment` and one `myth_fix` (especially for count≥7).

Golden render (1080×1920, 30fps):

```bash
npm run shorts:render:golden
```

Output: `content-studio/out/golden/mental-model-desk-space-01.mp4`. Preview in Studio with `npm run shorts:studio`.

Weekly batch (default 7 Shorts, round-robin across modules):

```bash
npm run shorts:batch
# optional: npm run shorts:batch -- --date 2026-08-11 --count 7
```

Writes `content-studio/out/batch-YYYY-MM-DD/` with `scripts/`, `audio/`, best-effort `renders/`, `errors.json` (partial failures continue), `approval.yaml` (all `approve: false`), and `APPROVAL.md` checklist. The batch CLI exits non-zero when `errors.json` is non-empty. Flip `approve: true` only after human QA; publish skips unapproved ids and errors if none are approved. For local batches without ElevenLabs/beds, export `SHORTS_DRY_AUDIO=1`.

### Approval → publish workflow

1. Run `npm run shorts:batch` and review renders under `content-studio/out/batch-YYYY-MM-DD/renders/`.
2. Complete `APPROVAL.md` checklist; set `approve: true` in `approval.yaml` only for Shorts that pass QA.
3. Dry-run (default; no YouTube API call — safe for CI):

```bash
npm run shorts:publish -- --batch content-studio/out/batch-YYYY-MM-DD --start-date 2026-08-12
# equivalent: ... --dry-run
```

Writes `publish-plan.json` with title (hook clamped to 100 chars), UTM description, and `publishAt` ISO times (daily 09:00 America/New_York from `--start-date`). Skips unapproved ids; errors if none are approved.

4. Live upload + schedule (requires YouTube OAuth env vars):

```bash
npm run shorts:publish -- --batch content-studio/out/batch-YYYY-MM-DD --start-date 2026-08-12 --live
```

Preflight: every approved id must have `renders/<id>.mp4` or live publish throws listing missing files. Uploads via YouTube resumable upload with `privacyStatus=private` and `publishAt` from the plan. Appends `publish-result.json` after each success (crash-safe); re-runs skip ids that already have a `videoId`. Course link in every description: `https://llm-leverage-course.vercel.app?utm_source=youtube&utm_medium=shorts&utm_campaign=<id>`.

### Shorts commands

| Command | Purpose |
|---------|---------|
| `npm run shorts:studio` | Remotion Studio preview |
| `npm run shorts:render:golden` | Golden 1080×1920 fixture render |
| `npm run shorts:batch` | Weekly batch (scripts, audio, renders, approval) |
| `npm run shorts:publish` | Dry-run plan (default) or `--live` upload/schedule |

Schema/extract/write/props/audio/batch/approval/publish unit tests live under `content-studio/**/*.test.ts` and run with root `npm test`.

## Deploy

```bash
npx vercel --yes
```

Or connect the GitHub repo to a Vercel project. Framework: Next.js.

Current production alias: https://llm-leverage-course.vercel.app
