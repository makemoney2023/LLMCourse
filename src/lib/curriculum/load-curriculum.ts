import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
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

function curriculumRoot(): string {
  return path.join(process.cwd(), "curriculum");
}

function modulesRoot(): string {
  return path.join(curriculumRoot(), "modules");
}

function readOptional(filePath: string): string {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8");
}

function parseModuleYaml(dirName: string): ModuleMeta {
  const filePath = path.join(modulesRoot(), dirName, "module.yaml");
  const raw = fs.readFileSync(filePath, "utf8");
  const data = parseYaml(raw) as Omit<ModuleMeta, "dirName">;
  return {
    ...data,
    steps: Array.isArray(data.steps) ? data.steps : [],
    dirName,
  };
}

export function listModules(): ModuleMeta[] {
  const root = modulesRoot();
  if (!fs.existsSync(root)) return [];

  const dirs = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => fs.existsSync(path.join(root, name, "module.yaml")));

  return dirs
    .map(parseModuleYaml)
    .sort((a, b) => a.order - b.order);
}

export function getModuleBySlug(slug: string): ModuleMeta | null {
  return listModules().find((m) => m.slug === slug) ?? null;
}

function loadQuiz(dirName: string, moduleId: string): Quiz | null {
  const quizPath = path.join(modulesRoot(), dirName, "quiz.yaml");
  if (!fs.existsSync(quizPath)) return null;
  const data = parseYaml(fs.readFileSync(quizPath, "utf8")) as Quiz;
  return { ...data, moduleId: data.moduleId ?? moduleId };
}

export function loadModuleContent(slug: string): ModuleContent | null {
  const meta = getModuleBySlug(slug);
  if (!meta) return null;

  const dir = path.join(modulesRoot(), meta.dirName);
  return {
    meta,
    lessonMarkdown: readOptional(path.join(dir, "lesson.mdx")),
    exercisesMarkdown: readOptional(path.join(dir, "exercises.md")),
    workshopMarkdown: readOptional(path.join(dir, "workshop.md")),
    diagramSource: readOptional(path.join(dir, "diagram.mmd")),
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
  const filePath = path.join(
    curriculumRoot(),
    "workshops",
    `${id}.slides.yaml`,
  );
  if (!fs.existsSync(filePath)) return null;
  return parseYaml(fs.readFileSync(filePath, "utf8")) as WorkshopDeckYaml;
}

export function getWorkshopDeck(id: string): WorkshopSession | null {
  return listWorkshopSessions().find((s) => s.id === id) ?? null;
}

export function listWorkshopSessions(): WorkshopSession[] {
  const root = path.join(curriculumRoot(), "workshops");
  if (!fs.existsSync(root)) return [];

  const ids = new Set<string>();
  for (const name of fs.readdirSync(root)) {
    const slidesMatch = name.match(/^(session-\d+)\.slides\.yaml$/);
    const mdMatch = name.match(/^(session-\d+)\.md$/);
    if (slidesMatch) ids.add(slidesMatch[1]!);
    if (mdMatch) ids.add(mdMatch[1]!);
  }

  return [...ids]
    .sort()
    .map((id) => {
      const deck = loadWorkshopDeckFile(id);
      const markdownPath = path.join(root, `${id}.md`);
      const markdown = readOptional(markdownPath);
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
