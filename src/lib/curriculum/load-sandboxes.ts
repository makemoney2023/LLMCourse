import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type Sandbox = {
  id: string;
  title: string;
  subtitle?: string;
  starterPrompt: string;
  constraints: string[];
  modelAnswer: string;
  rubric: string[];
};

function sandboxesRoot(): string {
  return path.join(process.cwd(), "curriculum", "sandboxes");
}

export function listSandboxes(): Sandbox[] {
  const root = sandboxesRoot();
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .filter((name) => name.endsWith(".yaml"))
    .map((name) => loadSandbox(name.replace(/\.yaml$/, "")))
    .filter((s): s is Sandbox => s != null)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function loadSandbox(id: string): Sandbox | null {
  const filePath = path.join(sandboxesRoot(), `${id}.yaml`);
  if (!fs.existsSync(filePath)) return null;
  const data = parseYaml(fs.readFileSync(filePath, "utf8")) as Sandbox;
  return {
    ...data,
    constraints: data.constraints ?? [],
    rubric: data.rubric ?? [],
  };
}
