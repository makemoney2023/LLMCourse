import fs from "node:fs";
import path from "node:path";

export const TEMPLATE_FILES = [
  "BRIEF.md",
  "SOURCES.md",
  "HANDOFF.md",
  "WALL_RULES.md",
  "PLAYBOOK.md",
  "TOOLS.md",
  "OWNERSHIP.md",
  "VERIFY.md",
  "LOOKBACK.md",
] as const;

export type TemplateName = (typeof TEMPLATE_FILES)[number];

const DEMO_MODULES = [
  "tools-and-mcp",
  "retrieval-and-grounding",
  "verify-and-harden",
] as const;

const DEMO_FILES = ["before.svg", "after.svg"] as const;

export function isTemplateName(name: string): name is TemplateName {
  return (TEMPLATE_FILES as readonly string[]).includes(name);
}

export function readTemplate(name: string): string | null {
  if (!isTemplateName(name)) return null;
  const filePath = path.join(process.cwd(), "curriculum", "templates", name);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

export function isDemoFile(module: string, file: string): boolean {
  return (
    (DEMO_MODULES as readonly string[]).includes(module) &&
    (DEMO_FILES as readonly string[]).includes(file)
  );
}

export function readDemoFile(module: string, file: string): Buffer | null {
  if (!isDemoFile(module, file)) return null;
  const filePath = path.join(
    process.cwd(),
    "curriculum",
    "demos",
    module,
    file,
  );
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

export const PRIVATE_NO_STORE = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
} as const;
