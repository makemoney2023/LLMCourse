# Faceless YouTube Shorts Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an in-repo `content-studio/` that turns LLM Leverage curriculum into weekly faceless YouTube Shorts (kinetic text + Remotion), with batch output, human approval, and scheduled publish.

**Architecture:** Curriculum under `curriculum/` stays source of truth. A sibling `content-studio/` package owns script schema, extract/write/tts/render/publish CLIs, Remotion compositions (1080×1920), and gitignored `out/` batches. The Next.js learner app is unchanged except docs and root npm scripts.

**Tech Stack:** TypeScript, Vitest, `yaml`, Remotion (`remotion` + `@remotion/cli`), Node CLI (`tsx`), ElevenLabs (P1), YouTube Data API (P2). Prefer Vercel AI Gateway-style model strings when LLM script writing is enabled.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-11-faceless-youtube-shorts-design.md`
- Curriculum remains the only syllabus; every Short has `module` + `anchor`
- Visual default: kinetic text + motion on branded backgrounds (no talking avatar)
- Formats: `voice` (~80%) and `music_caption` (~20%)
- Weekly batch default: 7 Shorts; publisher requires `approve: true`
- CTA + UTM on every Short description
- Secrets via env only; never commit `.env*` or `content-studio/out/`
- TDD: write failing tests before implementation for each library unit
- Update `docs/COURSE_OPERATIONS.md` when studio ops land
- Do not modify learner routes under `src/app/` for this feature

## Locked defaults (no TBD)

| Decision | Choice | Why |
|----------|--------|-----|
| Package layout | `content-studio/` with own `package.json` | Isolates Remotion deps from Next app |
| P0 script generation | Heuristic extract + **hand golden YAML** + template beat builder; LLM writer behind interface stub | Deterministic tests; golden mp4 without API keys |
| P1 LLM scripts | Optional `--llm` flag using AI Gateway / `AI_GATEWAY_API_KEY` | Cost control; offline batch still works |
| Remotion entry | `content-studio/src/remotion/index.ts` → Root compositions | Standard Remotion layout |
| FPS / size | 30 fps, 1080×1920 | YouTube Shorts |
| Approval file | `approval.yaml` (machine) + `APPROVAL.md` (human checklist copy) | Publisher parses YAML |
| Course URL | `https://llm-leverage-course.vercel.app` + UTM query | Matches live deploy |
| Vitest | Extend root `vitest.config.ts` include to `content-studio/**/*.test.ts` | One `npm test` |

## File structure

| Path | Responsibility |
|------|----------------|
| `content-studio/package.json` | Remotion + studio deps/scripts |
| `content-studio/tsconfig.json` | Studio TS config |
| `content-studio/brand/tokens.ts` | Slate/teal + font tokens |
| `content-studio/prompts/*.md` | Extract/script/image prompts (P1+) |
| `content-studio/scripts/*.yaml` | Durable approved script packs |
| `content-studio/audio/beds/.gitkeep` | Cleared music beds (P1) |
| `content-studio/out/` | Gitignored batch outputs |
| `content-studio/src/schema/script-pack.ts` | Types + Zod/manual validation |
| `content-studio/src/schema/script-pack.test.ts` | Schema tests |
| `content-studio/src/extract/extract-hooks.ts` | Curriculum → candidate hooks |
| `content-studio/src/extract/extract-hooks.test.ts` | Extractor tests |
| `content-studio/src/write/build-script.ts` | Hook → script pack |
| `content-studio/src/write/build-script.test.ts` | Writer tests |
| `content-studio/src/render/props.ts` | Script → Remotion props |
| `content-studio/src/render/props.test.ts` | Prop builder tests |
| `content-studio/src/remotion/Root.tsx` | Register compositions |
| `content-studio/src/remotion/TitlePunch.tsx` | P0 template |
| `content-studio/src/remotion/ListReveal.tsx` | P1 |
| `content-studio/src/remotion/LoopSnippet.tsx` | P1 |
| `content-studio/src/cli/batch.ts` | Weekly batch orchestrator |
| `content-studio/src/cli/publish.ts` | YouTube publish (P2) |
| `content-studio/src/audio/tts.ts` | ElevenLabs + cache (P1) |
| `content-studio/src/publish/youtube.ts` | Upload + schedule (P2) |
| `content-studio/src/publish/approval.ts` | Load/verify approval.yaml |
| `content-studio/fixtures/mental-model-desk-space-01.yaml` | Golden Module-1 pack |
| `docs/COURSE_OPERATIONS.md` | Shorts ops section |

---

## Phase P0 — Golden Short

### Task 1: Script pack schema + validation

**Files:**
- Create: `content-studio/package.json`
- Create: `content-studio/tsconfig.json`
- Create: `content-studio/src/schema/script-pack.ts`
- Create: `content-studio/src/schema/script-pack.test.ts`
- Modify: `vitest.config.ts` (include studio tests)
- Modify: `.gitignore` (add `content-studio/out/`)

**Interfaces:**
- Consumes: nothing
- Produces: `ScriptPack`, `parseScriptPack(raw: unknown): ScriptPack`, `assertScriptPack(raw: unknown): asserts raw is ScriptPack`

- [ ] **Step 1: Write the failing test**

```ts
// content-studio/src/schema/script-pack.test.ts
import { describe, expect, it } from "vitest";
import { parseScriptPack } from "./script-pack";

describe("parseScriptPack", () => {
  it("accepts a valid voice pack", () => {
    const pack = parseScriptPack({
      id: "mental-model-desk-space-01",
      module: "01-mental-model",
      anchor: "Context window = desk space",
      format: "voice",
      hook: "Your AI isn't dumb — your desk is crowded.",
      beats: [
        { text: "Think of the context window as desk space.", visual: "title_card" },
        { text: "Too many sticky notes → worse answers.", visual: "kinetic_list" },
        { text: "Clear the desk. Keep the goal and the facts.", visual: "punchline" },
      ],
      cta: "Free LLM Leverage course — link in bio",
      duration_target_sec: 45,
      tags: ["context-window", "beginners"],
    });
    expect(pack.id).toBe("mental-model-desk-space-01");
    expect(pack.beats).toHaveLength(3);
  });

  it("rejects missing cta", () => {
    expect(() =>
      parseScriptPack({
        id: "x",
        module: "01-mental-model",
        anchor: "a",
        format: "voice",
        hook: "h",
        beats: [{ text: "t", visual: "title_card" }],
        duration_target_sec: 40,
      }),
    ).toThrow(/cta/i);
  });

  it("rejects empty beats", () => {
    expect(() =>
      parseScriptPack({
        id: "x",
        module: "01-mental-model",
        anchor: "a",
        format: "music_caption",
        hook: "h",
        beats: [],
        cta: "cta",
        duration_target_sec: 40,
      }),
    ).toThrow(/beats/i);
  });

  it("rejects duration outside 30–55", () => {
    expect(() =>
      parseScriptPack({
        id: "x",
        module: "01-mental-model",
        anchor: "a",
        format: "voice",
        hook: "h",
        beats: [{ text: "t", visual: "title_card" }],
        cta: "cta",
        duration_target_sec: 20,
      }),
    ).toThrow(/duration/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run content-studio/src/schema/script-pack.test.ts`  
Expected: FAIL (module not found / cannot resolve)

- [ ] **Step 3: Scaffold package + implement schema**

`content-studio/package.json`:

```json
{
  "name": "content-studio",
  "private": true,
  "type": "module",
  "scripts": {
    "studio": "remotion studio src/remotion/index.ts",
    "render": "remotion render src/remotion/index.ts",
    "batch": "tsx src/cli/batch.ts",
    "publish": "tsx src/cli/publish.ts",
    "test": "cd .. && npx vitest run content-studio"
  },
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "remotion": "^4.0.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "yaml": "^2.9.0"
  },
  "devDependencies": {
    "tsx": "^4.20.0",
    "typescript": "^5"
  }
}
```

Pin exact Remotion versions at install time with `npm install` inside `content-studio` (use latest stable 4.x from npm).

`content-studio/src/schema/script-pack.ts` — implement types and `parseScriptPack` that throws on missing `module`/`anchor`/`cta`, empty `beats`, invalid `format`, or `duration_target_sec` not in 30–55.

Update `vitest.config.ts`:

```ts
include: ["src/**/*.test.ts", "content-studio/**/*.test.ts"],
```

Add to `.gitignore`:

```
/content-studio/out/
/content-studio/node_modules/
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run content-studio/src/schema/script-pack.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add content-studio/package.json content-studio/tsconfig.json content-studio/src/schema vitest.config.ts .gitignore
git commit -m "$(cat <<'EOF'
feat(shorts): add content-studio script pack schema and validation

EOF
)"
```

---

### Task 2: Curriculum hook extractor

**Files:**
- Create: `content-studio/src/extract/extract-hooks.ts`
- Create: `content-studio/src/extract/extract-hooks.test.ts`

**Interfaces:**
- Consumes: filesystem paths to `curriculum/modules/<dir>/module.yaml` + `lesson.mdx`
- Produces: `extractHooks(moduleDir: string): HookCandidate[]` where  
  `HookCandidate = { moduleDir: string; moduleSlug: string; anchor: string; source: string; series: "one_idea" | "myth_fix" | "loop_moment" }`

- [ ] **Step 1: Write the failing test**

```ts
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractHooks } from "./extract-hooks";

const moduleDir = path.resolve(
  __dirname,
  "../../../curriculum/modules/01-mental-model",
);

describe("extractHooks", () => {
  it("returns at least one candidate from Module 1 objectives/toolMapping", () => {
    const hooks = extractHooks(moduleDir);
    expect(hooks.length).toBeGreaterThan(0);
    expect(hooks[0]?.moduleSlug).toBe("mental-model");
    expect(hooks[0]?.anchor.length).toBeGreaterThan(3);
    expect(hooks.every((h) => h.moduleDir.includes("01-mental-model"))).toBe(true);
  });

  it("includes a context-window / desk-space style anchor when present in curriculum", () => {
    const hooks = extractHooks(moduleDir);
    const joined = hooks.map((h) => h.anchor.toLowerCase()).join(" ");
    expect(joined).toMatch(/desk|context|window|loop/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run content-studio/src/extract/extract-hooks.test.ts`  
Expected: FAIL

- [ ] **Step 3: Implement extractor**

Read `module.yaml` via `yaml` parse. Build candidates from:

1. Each `objectives[]` string → `series: "one_idea"`
2. Each `toolMapping[].abstraction` + `surfaces` → `series: "one_idea"`
3. `loopPlacement` → `series: "loop_moment"`

Set `moduleDir` to the folder name (`01-mental-model`), `moduleSlug` from yaml `slug`.

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add content-studio/src/extract
git commit -m "$(cat <<'EOF'
feat(shorts): extract Short hook candidates from module curriculum

EOF
)"
```

---

### Task 3: Template script builder + golden fixture

**Files:**
- Create: `content-studio/src/write/build-script.ts`
- Create: `content-studio/src/write/build-script.test.ts`
- Create: `content-studio/fixtures/mental-model-desk-space-01.yaml`
- Create: `content-studio/scripts/mental-model-desk-space-01.yaml` (same content; durable pack)

**Interfaces:**
- Consumes: `HookCandidate`
- Produces: `buildScriptFromHook(hook: HookCandidate, opts?: { format?: "voice" | "music_caption" }): ScriptPack`  
- Produces: `loadScriptPackFile(path: string): ScriptPack`

- [ ] **Step 1: Write the failing test**

```ts
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseScriptPack } from "../schema/script-pack";
import { buildScriptFromHook, loadScriptPackFile } from "./build-script";
import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";

describe("buildScriptFromHook", () => {
  it("builds a valid pack with cta and 2–4 beats", () => {
    const pack = buildScriptFromHook({
      moduleDir: "01-mental-model",
      moduleSlug: "mental-model",
      anchor: "Context window = desk space",
      source: "Explain the context window like desk space that can fill up.",
      series: "one_idea",
    });
    expect(pack.module).toBe("01-mental-model");
    expect(pack.cta.toLowerCase()).toMatch(/llm leverage|course/);
    expect(pack.beats.length).toBeGreaterThanOrEqual(2);
    expect(pack.beats.length).toBeLessThanOrEqual(4);
    expect(pack.duration_target_sec).toBeGreaterThanOrEqual(30);
    expect(pack.duration_target_sec).toBeLessThanOrEqual(55);
  });
});

describe("golden fixture", () => {
  it("parses mental-model-desk-space-01.yaml", () => {
    const file = path.resolve(
      __dirname,
      "../../fixtures/mental-model-desk-space-01.yaml",
    );
    const pack = loadScriptPackFile(file);
    expect(pack.id).toBe("mental-model-desk-space-01");
    expect(pack.anchor.toLowerCase()).toMatch(/desk|context/);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement builder + golden YAML**

Golden YAML content (exact):

```yaml
id: mental-model-desk-space-01
module: 01-mental-model
anchor: "Context window = desk space"
format: voice
hook: "Your AI isn't dumb — your desk is crowded."
beats:
  - text: "Think of the context window as desk space."
    visual: title_card
  - text: "Too many sticky notes → worse answers."
    visual: kinetic_list
  - text: "Clear the desk. Keep the goal and the facts."
    visual: punchline
cta: "Free LLM Leverage course — link in bio"
duration_target_sec: 45
tags: [context-window, beginners]
```

`buildScriptFromHook` must produce packs that pass `parseScriptPack`. Hook line = punchy rewrite of `anchor`; beats from `source` split into short sentences (fallback: anchor + two teaching lines + punchline). CTA constant: `"Free LLM Leverage course — link in bio"`.

`id` slug: `${moduleSlug}-${slugify(anchor)}-01` truncated to 64 chars.

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add content-studio/src/write content-studio/fixtures content-studio/scripts
git commit -m "$(cat <<'EOF'
feat(shorts): add template script builder and Module 1 golden pack

EOF
)"
```

---

### Task 4: Remotion props builder + caption timing

**Files:**
- Create: `content-studio/src/render/props.ts`
- Create: `content-studio/src/render/props.test.ts`
- Create: `content-studio/brand/tokens.ts`

**Interfaces:**
- Consumes: `ScriptPack`
- Produces: `TitlePunchProps` and `scriptPackToTitlePunchProps(pack: ScriptPack): TitlePunchProps`

```ts
export type TitlePunchProps = {
  courseName: string;
  hook: string;
  beats: { text: string; startFrame: number; durationFrames: number }[];
  cta: string;
  brand: { bg: string; fg: string; accent: string };
  fps: 30;
  durationInFrames: number;
};
```

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { scriptPackToTitlePunchProps } from "./props";
import { parseScriptPack } from "../schema/script-pack";

describe("scriptPackToTitlePunchProps", () => {
  it("allocates frames that sum to duration and keeps captions short", () => {
    const pack = parseScriptPack({
      id: "mental-model-desk-space-01",
      module: "01-mental-model",
      anchor: "Context window = desk space",
      format: "voice",
      hook: "Your AI isn't dumb — your desk is crowded.",
      beats: [
        { text: "Think of the context window as desk space.", visual: "title_card" },
        { text: "Too many sticky notes → worse answers.", visual: "kinetic_list" },
        { text: "Clear the desk. Keep the goal and the facts.", visual: "punchline" },
      ],
      cta: "Free LLM Leverage course — link in bio",
      duration_target_sec: 45,
      tags: ["context-window"],
    });
    const props = scriptPackToTitlePunchProps(pack);
    expect(props.fps).toBe(30);
    expect(props.durationInFrames).toBe(45 * 30);
    expect(props.courseName).toBe("LLM Leverage");
    expect(props.beats.every((b) => b.text.length <= 80)).toBe(true);
    const last = props.beats[props.beats.length - 1]!;
    expect(last.startFrame + last.durationFrames).toBeLessThanOrEqual(
      props.durationInFrames,
    );
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

Brand tokens (align marketing):

```ts
export const brandTokens = {
  bg: "#0f172a", // slate-900
  fg: "#f8fafc",
  accent: "#14b8a6", // teal
  courseName: "LLM Leverage",
};
```

Timing: reserve ~2s hook, ~3s CTA; split remaining frames evenly across beats (min 45 frames each). Truncate beat text > 80 chars with ellipsis for on-screen safety.

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add content-studio/src/render content-studio/brand
git commit -m "$(cat <<'EOF'
feat(shorts): map script packs to TitlePunch Remotion props

EOF
)"
```

---

### Task 5: Remotion TitlePunch composition + golden render

**Files:**
- Create: `content-studio/src/remotion/index.ts`
- Create: `content-studio/src/remotion/Root.tsx`
- Create: `content-studio/src/remotion/TitlePunch.tsx`
- Create: `content-studio/src/cli/render-one.ts`
- Modify: root `package.json` scripts
- Modify: `docs/COURSE_OPERATIONS.md` (Shorts P0 section)

**Interfaces:**
- Consumes: `TitlePunchProps`
- Produces: mp4 at `content-studio/out/golden/mental-model-desk-space-01.mp4`

- [ ] **Step 1: Write a smoke test for composition props wiring**

```ts
// content-studio/src/remotion/TitlePunch.test.ts
import { describe, expect, it } from "vitest";
import { scriptPackToTitlePunchProps } from "../render/props";
import { loadScriptPackFile } from "../write/build-script";
import path from "node:path";

describe("TitlePunch wiring", () => {
  it("golden fixture yields renderable duration", () => {
    const pack = loadScriptPackFile(
      path.resolve(__dirname, "../../fixtures/mental-model-desk-space-01.yaml"),
    );
    const props = scriptPackToTitlePunchProps(pack);
    expect(props.durationInFrames).toBeGreaterThan(30 * 30);
    expect(props.hook.length).toBeGreaterThan(0);
  });
});
```

(Full pixel render is a manual/CLI exit criterion, not a Vitest assertion.)

- [ ] **Step 2: Run — expect FAIL until files exist; then implement composition**

`TitlePunch.tsx`: full-bleed branded background; large hook for first ~60 frames; then `Sequence` per beat with kinetic opacity/translateY; end card with **LLM Leverage** as dominant text + CTA. Use `AbsoluteFill`, `Sequence`, `interpolate`, `useCurrentFrame` from `remotion`. Width 1080 height 1920 fps 30.

`Root.tsx`: register `<Composition id="TitlePunch" width={1080} height={1920} fps={30} ... calculateMetadata />` reading default props from golden fixture via `calculateMetadata`.

`render-one.ts`:

```ts
// Pseudocode contract — implement with @remotion/renderer or CLI spawn:
// npx remotion render src/remotion/index.ts TitlePunch out/golden/mental-model-desk-space-01.mp4 --props=...
```

Prefer spawning:

```bash
cd content-studio && npx remotion render src/remotion/index.ts TitlePunch out/golden/mental-model-desk-space-01.mp4
```

with props file written from `scriptPackToTitlePunchProps(loadScriptPackFile(...))`.

Root `package.json` scripts:

```json
"shorts:studio": "npm run studio --prefix content-studio",
"shorts:render:golden": "npm run render --prefix content-studio -- TitlePunch out/golden/mental-model-desk-space-01.mp4",
"shorts:batch": "npm run batch --prefix content-studio",
"shorts:publish": "npm run publish --prefix content-studio"
```

- [ ] **Step 3: Install Remotion deps and render golden**

```bash
cd content-studio && npm install
cd .. && npm run shorts:render:golden
```

Expected: mp4 exists at `content-studio/out/golden/mental-model-desk-space-01.mp4`

- [ ] **Step 4: Document in COURSE_OPERATIONS.md**

Add section **YouTube Shorts studio (P0)**:

- Curriculum source of truth unchanged
- Golden render command
- Schema location
- `out/` gitignored

- [ ] **Step 5: Commit** (do not commit mp4)

```bash
git add content-studio/src/remotion content-studio/src/cli/render-one.ts package.json docs/COURSE_OPERATIONS.md content-studio/package-lock.json
git commit -m "$(cat <<'EOF'
feat(shorts): add TitlePunch Remotion composition and golden render path

EOF
)"
```

**P0 exit:** golden mp4 renders locally; schema/extract/write/props tests green.

---

## Phase P1 — Weekly batch + audio + templates

### Task 6: Batch orchestrator + APPROVAL artifacts

**Files:**
- Create: `content-studio/src/cli/batch.ts`
- Create: `content-studio/src/batch/run-batch.ts`
- Create: `content-studio/src/batch/run-batch.test.ts`
- Create: `content-studio/src/publish/approval.ts`
- Create: `content-studio/src/publish/approval.test.ts`

**Interfaces:**
- `runBatch(opts: { date: string; count: number; curriculumRoot: string }): BatchResult`
- `BatchResult = { dir: string; ids: string[]; errors: { id: string; error: string }[] }`
- Writes:
  - `out/batch-YYYY-MM-DD/scripts/*.yaml`
  - `out/batch-YYYY-MM-DD/renders/*.mp4` (best-effort)
  - `out/batch-YYYY-MM-DD/errors.json`
  - `out/batch-YYYY-MM-DD/approval.yaml` (all `approve: false`)
  - `out/batch-YYYY-MM-DD/APPROVAL.md` (checklist)

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import { parseApproval, isApproved } from "../publish/approval";

describe("approval", () => {
  it("denies by default", () => {
    const a = parseApproval({
      items: [{ id: "mental-model-desk-space-01", approve: false }],
    });
    expect(isApproved(a, "mental-model-desk-space-01")).toBe(false);
  });

  it("allows only approve true", () => {
    const a = parseApproval({
      items: [{ id: "mental-model-desk-space-01", approve: true }],
    });
    expect(isApproved(a, "mental-model-desk-space-01")).toBe(true);
  });
});
```

Also test `runBatch` with `count: 2` using temp dir and stub renderer that writes empty files — assert `approval.yaml` exists and errors array is defined.

- [ ] **Step 2–4:** Implement; on render failure push to `errors.json` and continue; PASS tests; commit

```bash
git commit -m "$(cat <<'EOF'
feat(shorts): weekly batch runner with approval gate artifacts

EOF
)"
```

---

### Task 7: TTS + music_caption audio

**Files:**
- Create: `content-studio/src/audio/tts.ts`
- Create: `content-studio/src/audio/tts.test.ts`
- Create: `content-studio/src/audio/music.ts`
- Create: `content-studio/audio/beds/.gitkeep`
- Create: `content-studio/audio/beds/README.md` (license note: add cleared beds before production)

**Interfaces:**
- `synthesizeVoice(pack: ScriptPack, outPath: string): Promise<string>` — requires `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID`
- Cache key: sha256 of `${voiceId}:${hook}:${beats text}` under `out/.audio-cache/`
- `resolveMusicBed(pack: ScriptPack): string` — pick bed file; throw if missing in production mode
- Dry mode: if no API key, write silent wav stub **only when** `SHORTS_DRY_AUDIO=1`

- [ ] **Step 1:** Test cache key stability + dry mode writes file  
- [ ] **Step 2–4:** Implement; wire into batch for `format: voice` vs `music_caption`; Remotion `Audio` component; commit

```bash
git commit -m "$(cat <<'EOF'
feat(shorts): add TTS and music-caption audio paths with cache

EOF
)"
```

---

### Task 8: ListReveal + LoopSnippet templates

**Files:**
- Create: `content-studio/src/remotion/ListReveal.tsx`
- Create: `content-studio/src/remotion/LoopSnippet.tsx`
- Modify: `Root.tsx` to register both
- Modify: `props.ts` with `scriptPackToListRevealProps` / `scriptPackToLoopSnippetProps`
- Create: matching `*.test.ts`

**Selection rule in batch:**

- `series === "myth_fix"` → `ListReveal`
- `series === "loop_moment"` → `LoopSnippet`
- else → `TitlePunch`

- [ ] TDD prop builders → implement compositions → register → commit

```bash
git commit -m "$(cat <<'EOF'
feat(shorts): add ListReveal and LoopSnippet Remotion templates

EOF
)"
```

**P1 exit:** `npm run shorts:batch` produces 7-pack folder with renders (or errors.json partial), approval files, mixed formats.

---

## Phase P2 — YouTube schedule

### Task 9: Description/UTM builder + dry-run publish

**Files:**
- Create: `content-studio/src/publish/description.ts`
- Create: `content-studio/src/publish/description.test.ts`
- Create: `content-studio/src/publish/youtube.ts`
- Create: `content-studio/src/publish/youtube.test.ts`
- Create: `content-studio/src/cli/publish.ts`

**Interfaces:**
- `buildDescription(pack: ScriptPack): string` must include  
  `https://llm-leverage-course.vercel.app?utm_source=youtube&utm_medium=shorts&utm_campaign=${pack.id}`
- `publishBatch(batchDir: string, opts: { dryRun: boolean; startDate: string }): Promise<PublishResult>`
- Refuses IDs where `isApproved` is false
- Dry-run writes `publish-plan.json` with titles, descriptions, `publishAt` ISO times (daily 9:00 America/New_York from `startDate`) without calling YouTube

- [ ] **Step 1: Failing tests for UTM + refuse unapproved**

```ts
it("refuses unapproved ids", async () => {
  await expect(
    publishBatch(batchDir, { dryRun: true, startDate: "2026-08-12" }),
  ).rejects.toThrow(/approv/i); // when approval all false and --require-approval default
});
```

Actually: publish should **skip** unapproved and publish approved only; if zero approved, throw `/no approved/i`.

- [ ] **Step 2–4:** Implement dry-run; commit

```bash
git commit -m "$(cat <<'EOF'
feat(shorts): dry-run publish plan with UTM descriptions and approval gate

EOF
)"
```

---

### Task 10: YouTube Data API upload + schedule

**Files:**
- Modify: `content-studio/src/publish/youtube.ts`
- Create: `content-studio/docs/YOUTUBE_OAUTH.md` (setup steps)
- Modify: `docs/COURSE_OPERATIONS.md` (P2 publish ops)

**Env:** `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`

- [ ] **Step 1:** Unit-test request body builder (snippet.title, status.publishAt, status.privacyStatus=`private` until publishAt) with mocked `fetch`
- [ ] **Step 2:** Implement OAuth refresh + resumable upload for Shorts (`shorts://` / vertical mp4)
- [ ] **Step 3:** `npm run shorts:publish -- --batch out/batch-YYYY-MM-DD` live path; `--dry-run` default unless `--live`
- [ ] **Step 4:** Document OAuth setup; commit

```bash
git commit -m "$(cat <<'EOF'
feat(shorts): YouTube upload and schedule for approved Shorts

EOF
)"
```

**P2 exit:** dry-run plan works in CI; live upload documented and runnable with secrets.

---

## Phase P3 (deferred plan note)

Not in this plan’s execution checklist. When ready: CSV of `shortId,module,utm_campaign,postedAt` + retention notes file. No new product UI required.

---

## Docs touchpoints

After P0 and again after P2, ensure `docs/COURSE_OPERATIONS.md` covers:

1. `content-studio/` layout  
2. Commands: `shorts:studio`, `shorts:render:golden`, `shorts:batch`, `shorts:publish`  
3. Approval workflow  
4. Env vars list (names only)

Update spec status line to **Approved** when implementation starts (optional one-line edit).

---

## Self-review vs spec

| Spec requirement | Task |
|------------------|------|
| Script schema + curriculum anchor | Task 1–3 |
| Kinetic TitlePunch Remotion | Task 5 |
| Extractor + script packs | Task 2–3 |
| Weekly batch + errors.json + approval | Task 6 |
| voice + music_caption | Task 7 |
| ListReveal + LoopSnippet | Task 8 |
| YouTube schedule + UTM | Task 9–10 |
| Human QA gate | Task 6 + 9 |
| TDD | Every task |
| COURSE_OPERATIONS docs | Task 5, 10 |
| Analytics P3 | Deferred (explicit) |

Placeholder scan: none intentional beyond P3 deferral.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-11-faceless-youtube-shorts.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  

**2. Inline Execution** — execute tasks in this session with `executing-plans`, checkpoints between tasks  

Which approach?
