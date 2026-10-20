import { parse as parseYaml } from "yaml";
import {
  listProjectEntries,
  projectFileExists,
  readProjectText,
} from "@/lib/files/project-files";

export type Sandbox = {
  id: string;
  title: string;
  subtitle?: string;
  starterPrompt: string;
  constraints: string[];
  modelAnswer: string;
  rubric: string[];
};

const SANDBOXES = "curriculum/sandboxes";

export function listSandboxes(): Sandbox[] {
  return listProjectEntries(SANDBOXES)
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".yaml"))
    .map((name) => loadSandbox(name.replace(/\.yaml$/, "")))
    .filter((s): s is Sandbox => s != null)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function sandboxExists(id: string): boolean {
  if (!/^[a-z0-9-]+$/.test(id)) return false;
  return projectFileExists(`${SANDBOXES}/${id}.yaml`);
}

export function loadSandbox(id: string): Sandbox | null {
  if (!sandboxExists(id)) return null;
  const raw = readProjectText(`${SANDBOXES}/${id}.yaml`);
  if (!raw) return null;
  const data = parseYaml(raw) as Sandbox;
  return {
    ...data,
    constraints: data.constraints ?? [],
    rubric: data.rubric ?? [],
  };
}
