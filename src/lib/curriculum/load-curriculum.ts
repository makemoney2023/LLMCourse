import { parse as parseYaml } from "yaml";
import {
  listProjectEntries,
  projectFileExists,
  readProjectText,
} from "@/lib/files/project-files";
import { parseExercises } from "@/lib/markdown";
import type {
  ModuleContent,
  ModuleMeta,
  Quiz,
  WorkshopSession,
  WorkshopSlide,
} from "./types";

const WORKSHOP_MODULE_MAP: Record<string, string[]> = {
  "session-01": ["mental-model", "deep-research", "system-instructions"],
  "session-02": [
    "standing-playbooks",
    "tools-and-mcp",
    "retrieval-and-grounding",
  ],
  "session-03": [
    "conversation-and-compaction",
    "memory-systems",
    "delegation",
  ],
  "session-04": ["human-craft", "verify-and-harden", "capstone-lab"],
};

const CURRICULUM = "curriculum";
const MODULES = `${CURRICULUM}/modules`;

function readOptional(relativePath: string): string {
  return readProjectText(relativePath) ?? "";
}

function parseModuleYaml(dirName: string): ModuleMeta {
  const raw = readProjectText(`${MODULES}/${dirName}/module.yaml`);
  if (!raw) throw new Error(`Missing module.yaml for ${dirName}`);
  const data = parseYaml(raw) as Omit<ModuleMeta, "dirName">;
  return {
    ...data,
    steps: Array.isArray(data.steps) ? data.steps : [],
    dirName,
  };
}

export function listModules(): ModuleMeta[] {
  const dirs = listProjectEntries(MODULES)
    .filter((entry) => entry.isDirectory)
    .map((entry) => entry.name)
    .filter((name) => projectFileExists(`${MODULES}/${name}/module.yaml`));

  return dirs
    .map(parseModuleYaml)
    .sort((a, b) => a.order - b.order);
}

export function getModuleBySlug(slug: string): ModuleMeta | null {
  return listModules().find((m) => m.slug === slug) ?? null;
}

function loadQuiz(dirName: string, moduleId: string): Quiz | null {
  const raw = readProjectText(`${MODULES}/${dirName}/quiz.yaml`);
  if (!raw) return null;
  const data = parseYaml(raw) as Quiz;
  return { ...data, moduleId: data.moduleId ?? moduleId };
}

export function loadModuleContent(slug: string): ModuleContent | null {
  const meta = getModuleBySlug(slug);
  if (!meta) return null;

  const dir = `${MODULES}/${meta.dirName}`;
  return {
    meta,
    lessonMarkdown: readOptional(`${dir}/lesson.mdx`),
    exercisesMarkdown: readOptional(`${dir}/exercises.md`),
    workshopMarkdown: readOptional(`${dir}/workshop.md`),
    diagramSource: readOptional(`${dir}/diagram.mmd`),
    quiz: loadQuiz(meta.dirName, meta.id),
  };
}

/** Exercise ids keyed by module id — for continue/unlock helpers. */
export function listModuleExerciseIds(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const meta of listModules()) {
    const content = loadModuleContent(meta.slug);
    out[meta.id] = parseExercises(content?.exercisesMarkdown ?? "").map(
      (e) => e.id,
    );
  }
  return out;
}

type WorkshopDeckYaml = {
  id: string;
  title: string;
  subtitle?: string;
  durationMinutes?: number;
  outcome?: string;
  moduleSlugs?: string[];
  slides: WorkshopSlide[];
};

function loadWorkshopDeckFile(id: string): WorkshopDeckYaml | null {
  const raw = readProjectText(`${CURRICULUM}/workshops/${id}.slides.yaml`);
  if (!raw) return null;
  return parseYaml(raw) as WorkshopDeckYaml;
}

export function getWorkshopDeck(id: string): WorkshopSession | null {
  return listWorkshopSessions().find((s) => s.id === id) ?? null;
}

export function listWorkshopSessions(): WorkshopSession[] {
  const root = `${CURRICULUM}/workshops`;
  const ids = new Set<string>();
  for (const entry of listProjectEntries(root)) {
    const name = entry.name;
    const slidesMatch = name.match(/^(session-\d+)\.slides\.yaml$/);
    const mdMatch = name.match(/^(session-\d+)\.md$/);
    if (slidesMatch) ids.add(slidesMatch[1]!);
    if (mdMatch) ids.add(mdMatch[1]!);
  }

  return [...ids]
    .sort()
    .map((id) => {
      const deck = loadWorkshopDeckFile(id);
      const markdown = readOptional(`${root}/${id}.md`);
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      const order = Number(id.split("-")[1] ?? "0");

      return {
        id,
        order,
        title: deck?.title
          ? `Workshop Session ${order} — ${deck.title}`
          : (titleMatch?.[1] ?? id),
        subtitle: deck?.subtitle ?? "",
        durationMinutes: deck?.durationMinutes ?? 90,
        outcome: deck?.outcome ?? "",
        markdown,
        moduleSlugs: deck?.moduleSlugs ?? WORKSHOP_MODULE_MAP[id] ?? [],
        slides: deck?.slides ?? [],
      };
    })
    .filter((session) => session.slides.length > 0 || session.markdown.length > 0);
}
