# Corporate Marketing Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/` into a C-suite/manager marketing site for LLM Leverage while moving learner progress UX to `/modules`.

**Architecture:** Replace home page content with sectioned marketing components (hero → problem → outcomes → included → loop → rollout → contact → footer). Gate the site-header progress bar to non-home routes. Keep `/modules` as the Continue + checkpoints hub. No backend for contact.

**Tech Stack:** Next.js App Router, React client/server components, existing Tailwind v4 + shadcn Button, Fraunces/Source Sans, Playwright e2e.

**Spec:** [`docs/superpowers/specs/2026-07-28-corporate-marketing-home-design.md`](../specs/2026-07-28-corporate-marketing-home-design.md)

## Global Constraints

- Audience: C-suite and managers evaluating employee training
- Brand: LLM Leverage as hero-level signal; cool slate + deep teal (no purple/cream defaults)
- Hero budget: brand, one headline, one support line, one CTA group, one full-bleed visual plane
- CTAs: Preview → `/modules/mental-model`; Plan rollout → `#rollout`; Talk to us → `#contact`
- Contact is placeholder UI only (no submit backend)
- Learner Continue/checkpoints live on `/modules`, not `/`
- Progress bar hidden on `/` only
- Do not change sequential locking or curriculum YAML

---

### Task 1: E2E contracts for marketing home

**Files:**
- Modify: [`e2e/smoke.spec.ts`](../../e2e/smoke.spec.ts)
- Test: same

**Interfaces:**
- Produces: Playwright coverage for hero CTAs, `#rollout`, `#contact`, and Start Module 1 still reachable from home

- [ ] **Step 1: Update the home e2e test**

Replace `home → module → steps → practice path` opener so it uses the new primary CTA label:

```ts
test("home marketing CTAs and learner entry", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "LLM Leverage" }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Train teams to get reliable AI output/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Preview the course/i })).toBeVisible();
  await page.getByRole("link", { name: /Plan a team rollout/i }).click();
  await expect(page.locator("#rollout")).toBeVisible();
  await page.getByRole("link", { name: /Talk to us/i }).first().click();
  await expect(page.locator("#contact")).toBeVisible();
  await page.getByRole("link", { name: /Preview the course/i }).first().click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Mental model", exact: true }),
  ).toBeVisible();
});
```

Keep the separate steps/practice test but start from `/modules/mental-model` directly (or after Preview).

- [ ] **Step 2: Run e2e and confirm failure on missing headline/anchors**

Run: `npm run test:e2e -- e2e/smoke.spec.ts -g "home marketing"`
Expected: FAIL (headline / `#rollout` not present yet)

- [ ] **Step 3: Commit**

```bash
git add e2e/smoke.spec.ts
git commit -m "test: require marketing home CTAs and anchors"
```

---

### Task 2: Hide progress bar on marketing home

**Files:**
- Modify: [`src/components/site-header.tsx`](../../src/components/site-header.tsx)
- Modify: nav label Overview → Home

**Interfaces:**
- Consumes: `usePathname()`
- Produces: Progress UI only when `pathname !== "/"`

- [ ] **Step 1: Update header**

```tsx
const links = [
  { href: "/", label: "Home" },
  { href: "/modules", label: "Modules" },
  { href: "/resources", label: "Resources" },
  { href: "/glossary", label: "Glossary" },
  { href: "/workshops", label: "Workshops" },
];

// inside SiteHeader:
const showProgress = pathname !== "/";
// wrap Progress + ResetProgressButton:
{showProgress ? (
  <div className="flex items-center gap-3" aria-label="Course progress">
    ...
  </div>
) : null}
```

- [ ] **Step 2: Manual check** — `/` has no progress row; `/modules` still shows it

- [ ] **Step 3: Commit**

```bash
git add src/components/site-header.tsx
git commit -m "Hide course progress bar on marketing home"
```

---

### Task 3: Marketing section components

**Files:**
- Create: `src/components/marketing/home-hero.tsx`
- Create: `src/components/marketing/home-problem.tsx`
- Create: `src/components/marketing/home-outcomes.tsx`
- Create: `src/components/marketing/home-included.tsx`
- Create: `src/components/marketing/home-how-it-works.tsx`
- Create: `src/components/marketing/home-rollout.tsx`
- Create: `src/components/marketing/home-contact.tsx`
- Create: `src/components/marketing/home-footer.tsx`

**Interfaces:**
- Produces: Server-friendly (or client only where needed) section components with exact copy from the spec
- `HomeHowItWorks` embeds existing `LoopMap`
- `HomeRollout` root element `id="rollout"`
- `HomeContact` root element `id="contact"`

- [ ] **Step 1: Implement `HomeHero`**

Exact CTA hrefs: Preview → `/modules/mental-model`, Plan → `#rollout`, Talk → `#contact`.  
Brand text `LLM Leverage` as largest type. Full-bleed section (not inset card). Use existing Button + Link. Motion: `animate-in fade-in slide-in-from-bottom-2` on copy block.

- [ ] **Step 2: Implement Problem, Outcomes, Included**

Use one H2 + short body each. Outcomes as `<ol>` of four items from the spec. Included as a compact inventory line/list (not a stats dashboard).

- [ ] **Step 3: Implement How it works with LoopMap**

```tsx
import { LoopMap } from "@/components/loop-map";
// section with H2 "One map. Every tool." then <LoopMap />
```

- [ ] **Step 4: Implement Rollout (`id="rollout"`)**

Three steps: Pilot / Facilitate / Scale. Links to `/workshops`, `/modules`, `/resources`.

- [ ] **Step 5: Implement Contact (`id="contact"`)**

Visual fields: name, work email, company, note. Primary button `type="button"` disabled or with `aria-disabled` and helper text: `Email coming soon — reach us at [your address].` Do not POST.

- [ ] **Step 6: Implement footer strip** with Preview / Workshops / Contact links

- [ ] **Step 7: Commit**

```bash
git add src/components/marketing/
git commit -m "Add corporate marketing home sections"
```

---

### Task 4: Wire marketing page; strip learner chrome from `/`

**Files:**
- Modify: [`src/app/page.tsx`](../../src/app/page.tsx)
- Modify: [`src/app/modules/page.tsx`](../../src/app/modules/page.tsx) only if Continue/checkpoints need copy tweak for “learner entry”
- Modify: [`curriculum/COURSE.md`](../../curriculum/COURSE.md) — one line that home is for buyers; learners start at Modules
- Modify: [`docs/COURSE_OPERATIONS.md`](../../docs/COURSE_OPERATIONS.md) — note marketing home vs learner hub

**Interfaces:**
- Consumes: all `Home*` section components
- Produces: `/` with no CheckpointBanner, ModuleList, or workshop catalog

- [ ] **Step 1: Rewrite `src/app/page.tsx`**

```tsx
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeProblem } from "@/components/marketing/home-problem";
import { HomeOutcomes } from "@/components/marketing/home-outcomes";
import { HomeIncluded } from "@/components/marketing/home-included";
import { HomeHowItWorks } from "@/components/marketing/home-how-it-works";
import { HomeRollout } from "@/components/marketing/home-rollout";
import { HomeContact } from "@/components/marketing/home-contact";
import { HomeFooter } from "@/components/marketing/home-footer";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HomeHero />
      <HomeProblem />
      <HomeOutcomes />
      <HomeIncluded />
      <HomeHowItWorks />
      <HomeRollout />
      <HomeContact />
      <HomeFooter />
    </div>
  );
}
```

Remove unused imports (`listModules`, `CheckpointBanner`, etc.).

- [ ] **Step 2: Confirm `/modules` still has Continue + CheckpointBanner**

If missing, restore:

```tsx
<ContinueCourseButton modules={modules} exerciseIdsByModule={exerciseIdsByModule} />
<CheckpointBanner />
<ModuleList modules={modules} />
```

- [ ] **Step 3: Update COURSE.md + COURSE_OPERATIONS.md** with buyer home vs `/modules` learner entry

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/modules/page.tsx curriculum/COURSE.md docs/COURSE_OPERATIONS.md
git commit -m "Ship marketing home; keep learner hub on modules"
```

---

### Task 5: Verify and ship

**Files:**
- Modify: e2e if any leftover “Start Module 1” assertions
- No plan-file edits

- [ ] **Step 1: Run unit tests**

Run: `npm test -- --run`  
Expected: all pass

- [ ] **Step 2: Build**

Run: `npm run build`  
Expected: success

- [ ] **Step 3: Run e2e**

Run: `npm run test:e2e`  
Expected: all pass including marketing CTAs

- [ ] **Step 4: Deploy when user requests**

```bash
git push origin HEAD
npx vercel --prod --yes
```

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Hero brand + CTAs | 3, 4 |
| Problem / outcomes / included | 3, 4 |
| LoopMap how-it-works | 3 |
| `#rollout` team path | 3 |
| `#contact` placeholder | 3 |
| Footer | 3 |
| Remove learner chrome from `/` | 4 |
| Progress hidden on `/` | 2 |
| Learner hub `/modules` | 4 |
| E2E | 1, 5 |
| Docs | 4 |

## Placeholder scan

No TBD steps. Contact address remains the literal placeholder string from the spec until the user provides a real channel.
