import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stringify as stringifyYaml } from "yaml";
import type { HookCandidate } from "../extract/extract-hooks";
import { extractHooks } from "../extract/extract-hooks";
import { scriptPackToTitlePunchProps } from "../render/props";
import type { ScriptFormat, ScriptPack } from "../schema/script-pack";
import { buildScriptFromHook } from "../write/build-script";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioRoot = path.resolve(__dirname, "../..");

export type BatchError = { id: string; error: string };

export type BatchResult = {
  dir: string;
  ids: string[];
  errors: BatchError[];
};

export type RenderShortFn = (args: {
  pack: ScriptPack;
  outputPath: string;
}) => void;

export type RunBatchOptions = {
  date: string;
  count: number;
  curriculumRoot: string;
  /** Override batch output root (default: content-studio/out). */
  outRoot?: string;
  /** Injected renderer for tests; production uses Remotion CLI. */
  render?: RenderShortFn;
};

const CHECKLIST = `# Batch approval checklist

Flip \`approve: true\` in \`approval.yaml\` only after reviewing each Short.

- [ ] Factual vs curriculum anchor
- [ ] No overclaim (legal/medical/guaranteed income)
- [ ] CTA present and link correct
- [ ] Captions readable on mobile
- [ ] Not a near-duplicate of last week
- [ ] Description includes course URL + UTM (and AI disclosure if channel policy requires it)

Publisher refuses any id that is not \`approve: true\`.
`;

function resolveModulesRoot(curriculumRoot: string): string {
  const withModules = path.join(curriculumRoot, "modules");
  if (fs.existsSync(withModules) && fs.statSync(withModules).isDirectory()) {
    return withModules;
  }
  return curriculumRoot;
}

function listModuleDirs(modulesRoot: string): string[] {
  return fs
    .readdirSync(modulesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(modulesRoot, entry.name))
    .filter((dir) => fs.existsSync(path.join(dir, "module.yaml")))
    .sort();
}

/** Round-robin across modules so week one does not exhaust Module 1. */
export function selectHooks(
  modulesRoot: string,
  count: number,
): HookCandidate[] {
  const moduleDirs = listModuleDirs(modulesRoot);
  const perModule = moduleDirs.map((dir) => extractHooks(dir));
  const selected: HookCandidate[] = [];
  let round = 0;

  while (selected.length < count) {
    let added = false;
    for (const hooks of perModule) {
      if (selected.length >= count) break;
      const hook = hooks[round];
      if (hook) {
        selected.push(hook);
        added = true;
      }
    }
    if (!added) break;
    round += 1;
  }

  return selected;
}

function formatForIndex(index: number): ScriptFormat {
  // ~20% music_caption: every 5th short (indices 4, 9, ...)
  return index % 5 === 4 ? "music_caption" : "voice";
}

function writeScriptYaml(pack: ScriptPack, filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, stringifyYaml(pack), "utf8");
}

/** When buildId always ends in -01, collisions overwrite batch files — bump. */
export function allocateUniqueScriptId(
  id: string,
  used: ReadonlySet<string>,
): string {
  if (!used.has(id)) return id;
  const base = id.replace(/-\d+$/, "");
  let n = 2;
  while (true) {
    const candidate = `${base}-${String(n).padStart(2, "0")}`;
    if (!used.has(candidate)) return candidate;
    n += 1;
  }
}

function writeApprovalArtifacts(dir: string, ids: string[]): void {
  const approval = {
    items: ids.map((id) => ({ id, approve: false })),
  };
  fs.writeFileSync(
    path.join(dir, "approval.yaml"),
    stringifyYaml(approval),
    "utf8",
  );
  fs.writeFileSync(path.join(dir, "APPROVAL.md"), CHECKLIST, "utf8");
}

export function defaultRenderShort({
  pack,
  outputPath,
}: {
  pack: ScriptPack;
  outputPath: string;
}): void {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const props = scriptPackToTitlePunchProps(pack);
  const propsPath = path.join(
    path.dirname(outputPath),
    `${pack.id}-props.json`,
  );
  fs.writeFileSync(propsPath, JSON.stringify(props, null, 2), "utf8");

  const entry = path.join(studioRoot, "src/remotion/index.ts");
  const result = spawnSync(
    "npx",
    [
      "remotion",
      "render",
      entry,
      "TitlePunch",
      outputPath,
      `--props=${propsPath}`,
    ],
    {
      cwd: studioRoot,
      encoding: "utf8",
      shell: process.platform === "win32",
    },
  );

  if (result.status !== 0) {
    const detail =
      result.stderr?.trim() ||
      result.stdout?.trim() ||
      `remotion exited ${result.status ?? "unknown"}`;
    throw new Error(detail);
  }

  if (!fs.existsSync(outputPath)) {
    throw new Error(`Render finished but output missing: ${outputPath}`);
  }
}

export function runBatch(opts: RunBatchOptions): BatchResult {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(opts.date)) {
    throw new Error(`Invalid date (expected YYYY-MM-DD): ${opts.date}`);
  }
  if (!Number.isInteger(opts.count) || opts.count < 1) {
    throw new Error(`count must be a positive integer, got ${opts.count}`);
  }

  const outRoot = opts.outRoot ?? path.join(studioRoot, "out");
  const dir = path.join(outRoot, `batch-${opts.date}`);
  const scriptsDir = path.join(dir, "scripts");
  const rendersDir = path.join(dir, "renders");
  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.mkdirSync(rendersDir, { recursive: true });

  const modulesRoot = resolveModulesRoot(opts.curriculumRoot);
  const hooks = selectHooks(modulesRoot, opts.count);
  if (hooks.length < opts.count) {
    throw new Error(
      `Only found ${hooks.length} hooks under ${modulesRoot}, need ${opts.count}`,
    );
  }

  const render = opts.render ?? defaultRenderShort;
  const ids: string[] = [];
  const usedIds = new Set<string>();
  const errors: BatchError[] = [];

  for (let i = 0; i < hooks.length; i += 1) {
    const hook = hooks[i]!;
    const built = buildScriptFromHook(hook, { format: formatForIndex(i) });
    const id = allocateUniqueScriptId(built.id, usedIds);
    const pack: ScriptPack = id === built.id ? built : { ...built, id };
    usedIds.add(id);
    ids.push(id);
    writeScriptYaml(pack, path.join(scriptsDir, `${id}.yaml`));

    const outputPath = path.join(rendersDir, `${id}.mp4`);
    try {
      render({ pack, outputPath });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ id, error: message });
    }
  }

  fs.writeFileSync(
    path.join(dir, "errors.json"),
    JSON.stringify(errors, null, 2),
    "utf8",
  );
  writeApprovalArtifacts(dir, ids);

  return { dir, ids, errors };
}
