# Corporate marketing home — design spec

**Date:** 2026-07-28  
**Status:** Draft for user review  
**Product:** LLM Leverage Course (https://llm-leverage-course.vercel.app)

## Problem

`/` currently doubles as a learner dashboard (Module 1 CTA, checkpoints, module grid, workshops). Buyers (C-suite and managers evaluating employee training) need a benefit-led entry page. Learners still need a clear place to continue progress.

## Goals

1. Make `/` a corporate marketing site that speaks to training ROI and organizational benefits.
2. Offer three CTAs: preview the course, plan a team rollout, talk to us (placeholder).
3. Move learner progress UX to `/modules` (no new `/learn` route).
4. Keep tool-agnostic positioning and existing brand system (slate/teal, Fraunces + Source Sans).

## Non-goals

- Live contact form backend, CRM, or analytics pixels
- Pricing, SSO, or multi-tenant team admin
- Rewriting curriculum content or changing sequential locking
- Dark-mode marketing theme or purple/cream “AI default” redesign

## Audience

Primary: C-suite and managers deciding whether to train employees.  
Secondary: Learners who arrive via “Preview” / “Continue” and land on `/modules` or Module 1.

## Information architecture

| Route | Role |
|-------|------|
| `/` | Marketing only (benefit narrative) |
| `/modules` | Learner entry: Continue, checkpoints, module list |
| `/modules/[slug]` | Sequenced learning (unchanged) |
| `/workshops`, `/resources` | Team rollout destinations |
| `#rollout`, `#contact` | In-page anchors on `/` |

Nav label: **Home** (was Overview). Progress bar hidden on `/`; shown on other routes.

## Page structure (`/`)

### 1. Hero (first viewport)

- Brand: **LLM Leverage** (hero-level)
- Headline: **Train teams to get reliable AI output—not longer prompts.**
- Support: Tool-agnostic course for managers who need consistent quality, fewer invented facts, and a shared way of working across ChatGPT, Claude, Cursor, and similar tools.
- CTAs:
  1. **Preview the course** → `/modules/mental-model`
  2. **Plan a team rollout** → `#rollout`
  3. **Talk to us** → `#contact`
- Visual: full-bleed atmospheric plane (gradient/mesh + subtle loop/desk motif). No stats strip, floating badges, or card grid in the hero.

### 2. Problem

- Headline: **Tool access isn’t the same as capability.**
- Body: Licenses without a shared standard → reinvented prompts, swinging quality, invented facts. Prompt-only training doesn’t stick when tools change.

### 3. Outcomes

- Headline: **What your organization gets.**
- List (scan-friendly, not a dashboard of cards unless layout needs separation):
  1. Shared operating model (context loop)
  2. Fewer ungrounded answers (BRIEF/SOURCES habits)
  3. Role-relevant practice (ops / sales / eng / marketing overlays)
  4. Measurable completion (sequenced modules, quizzes, checkpoints, certificates)

### 4. What’s included

- Headline: **Built for class and self-paced.**
- Inventory: 12 modules · 4 workshop decks · static sandboxes · templates · glossary · capstone gallery.
- Note: Tool-agnostic on purpose—habits transfer when the vendor stack changes.

### 5. How it works

- Headline: **One map. Every tool.**
- Short loop explanation + existing `LoopMap` as visual support.
- Line: Managers get a common language; employees can finish without a facilitator in the room.

### 6. Team rollout (`id="rollout"`)

- Headline: **How teams usually run it.**
- Steps: Pilot → Facilitate (4 sessions) → Scale (tracks, templates, sandboxes, certificates).
- CTAs: Workshops · Modules · Resources.

### 7. Contact (`id="contact"`)

- Headline: **Talk to us about a rollout.**
- Placeholder UI: name, work email, company, note + disabled/non-submitting primary action.
- Copy: email address placeholder (“reach us at [your address]”) until a real channel is provided.

### 8. Footer strip

Brand + Preview / Workshops / Contact links.

## Learner route changes

- Remove from `/`: CheckpointBanner, ModuleList, workshop catalog, Continue (except as needed inside marketing CTAs that deep-link).
- Ensure `/modules` remains the progress hub (Continue + CheckpointBanner already present).
- Header: progress + reset only when `pathname !== "/"`.

## Motion

2–3 intentional motions: hero fade/slide-in, subtle LoopMap or section reveal, CTA hover/focus. No decorative noise.

## Copy tone

Executive-clear, concrete, short. Avoid grade-5 learner analogies on the marketing page (those stay in modules). No hype about “AI transformation.” Emphasize reliability, shared standards, and transferable habits.

## Success criteria

- Cold manager can state the benefit in one sentence after the hero.
- Three CTAs visible without scrolling past the fold on desktop.
- Learner Continue/checkpoints still reachable via `/modules` in one click from nav.
- Contact section exists and is honest that submission is not wired yet.
- Existing unit/e2e suite updated only where home assertions change.

## Open items (post-ship)

- Real contact email or Cal.com URL replacing placeholder.
- Optional case study / metric once available (not required for v1).

---

## Spec self-review

- [x] No TBD placeholders for approved decisions (contact is explicitly placeholder).
- [x] No contradiction with sequential locking or curriculum spine.
- [x] Scope limited to marketing home + header/learner IA; no auth/pricing.
- [x] CTAs and anchors named consistently (`#rollout`, `#contact`).
