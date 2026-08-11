import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type HookSeries = "one_idea" | "myth_fix" | "loop_moment";

export type HookCandidate = {
  moduleDir: string;
  moduleSlug: string;
  anchor: string;
  source: string;
  series: HookSeries;
};

type ToolMappingEntry = {
  abstraction: string;
  surfaces: string;
};

type ModuleYaml = {
  slug: string;
  objectives?: string[];
  loopPlacement?: string;
  toolMapping?: ToolMappingEntry[];
};

export function extractHooks(moduleDirPath: string): HookCandidate[] {
  const moduleDir = path.basename(moduleDirPath);
  const yamlPath = path.join(moduleDirPath, "module.yaml");
  const raw = parseYaml(fs.readFileSync(yamlPath, "utf8")) as ModuleYaml;
  const moduleSlug = raw.slug;

  const hooks: HookCandidate[] = [];

  for (const objective of raw.objectives ?? []) {
    hooks.push({
      moduleDir,
      moduleSlug,
      anchor: objective,
      source: objective,
      series: "one_idea",
    });
  }

  for (const entry of raw.toolMapping ?? []) {
    const anchor = `${entry.abstraction}: ${entry.surfaces}`;
    hooks.push({
      moduleDir,
      moduleSlug,
      anchor,
      source: anchor,
      series: "one_idea",
    });
  }

  if (raw.loopPlacement) {
    hooks.push({
      moduleDir,
      moduleSlug,
      anchor: raw.loopPlacement,
      source: raw.loopPlacement,
      series: "loop_moment",
    });
  }

  return hooks;
}
