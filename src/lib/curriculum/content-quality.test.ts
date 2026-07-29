import { describe, expect, it } from "vitest";
import { listModules, loadModuleContent } from "./load-curriculum";
import { parseExercises } from "@/lib/markdown";
import { LESSON_STEP_IDS } from "@/lib/progress/access";
import { wordsIn } from "./readability";

const REQUIRED_LESSON_H2 = [
  "## In plain words",
  "## What this is",
  "## Why it matters",
  "## Big ideas",
  "## Where this sits in the loop",
  "## What goes wrong if you skip it",
  "## Where this shows up in tools",
  "## Tips",
] as const;

function wordCount(text: string): number {
  return wordsIn(text.replace(/```[\s\S]*?```/g, " ")).length;
}

describe("authored module content quality", () => {
  it("every module has substantial lesson, exercises, diagram, and quiz", () => {
    const modules = listModules();
    expect(modules.length).toBe(12);

    for (const meta of modules) {
      const content = loadModuleContent(meta.slug);
      expect(content, meta.slug).not.toBeNull();
      const lessonWords = wordCount(content!.lessonMarkdown);
      expect(
        lessonWords,
        `${meta.slug} lesson words=${lessonWords} (want 550–1100)`,
      ).toBeGreaterThanOrEqual(550);
      expect(
        lessonWords,
        `${meta.slug} lesson words=${lessonWords} (want 550–1100)`,
      ).toBeLessThanOrEqual(1100);
      for (const heading of REQUIRED_LESSON_H2) {
        expect(
          content!.lessonMarkdown.includes(heading),
          `${meta.slug} missing ${heading}`,
        ).toBe(true);
      }
      const plainBlock = content!.lessonMarkdown.match(
        /## In plain words\n([\s\S]*?)(?:\n## )/,
      )?.[1] ?? "";
      expect(plainBlock, `${meta.slug} In plain words: Goal`).toMatch(/Goal/i);
      expect(plainBlock, `${meta.slug} In plain words: Do this`).toMatch(
        /Do this/i,
      );
      expect(
        plainBlock,
        `${meta.slug} In plain words: You'll know`,
      ).toMatch(/You.?ll know/i);

      if (meta.order > 1) {
        const moduleColonRefs =
          content!.lessonMarkdown.match(/Module\s+\d+:/g) ?? [];
        expect(
          moduleColonRefs.length,
          `${meta.slug} has module laundry list (${moduleColonRefs.length} "Module N:" refs; max 3)`,
        ).toBeLessThanOrEqual(3);
      }

      expect(
        content!.lessonMarkdown.toLowerCase(),
        `${meta.slug} should not be placeholder`,
      ).not.toContain("content for `");
      expect(content!.diagramSource).toContain("flowchart");
      expect(content!.quiz, `${meta.slug} quiz`).not.toBeNull();
      expect(content!.quiz!.questions.length).toBeGreaterThanOrEqual(
        Math.min(3, meta.quizCount),
      );
      for (const objective of meta.objectives) {
        expect(typeof objective, `${meta.slug} objective`).toBe("string");
      }

      const exercises = parseExercises(content!.exercisesMarkdown);
      expect(exercises.length, `${meta.slug} exercises`).toBeGreaterThanOrEqual(
        3,
      );
      expect(
        wordCount(content!.exercisesMarkdown),
        `${meta.slug} exercises too thin`,
      ).toBeGreaterThanOrEqual(160);
      for (const exercise of exercises) {
        expect(exercise.id).toMatch(/^ex-/);
        expect(exercise.answerHtml.length).toBeGreaterThan(10);
      }
    }
  });

  it("capstone configure list covers the full loop spine", () => {
    const content = loadModuleContent("capstone-lab");
    expect(content).not.toBeNull();
    const lesson = content!.lessonMarkdown.toLowerCase();
    for (const needle of [
      "brief.md",
      "sources.md",
      "wall",
      "recipe",
      "tool",
      "retrieval",
      "compaction",
      "memory",
      "delegat",
      "verify",
    ]) {
      expect(lesson, `capstone missing ${needle}`).toContain(needle);
    }
  });

  it("delegation teaches harnesses, frameworks, and shared workspace ownership", () => {
    const content = loadModuleContent("delegation");
    expect(content).not.toBeNull();
    const lesson = content!.lessonMarkdown.toLowerCase();
    for (const needle of [
      "agent harness",
      "agentic framework",
      "shared workspace",
      "approval",
      "merge owner",
    ]) {
      expect(lesson, `delegation missing ${needle}`).toContain(needle);
    }
  });

  it("capstone produces a reusable shared workspace setup", () => {
    const content = loadModuleContent("capstone-lab");
    expect(content).not.toBeNull();
    const lesson = content!.lessonMarkdown.toLowerCase();
    for (const needle of [
      "workspace starter pack",
      "handoff",
      "ownership",
    ]) {
      expect(lesson, `capstone missing ${needle}`).toContain(needle);
    }
  });

  it("priority modules ship worked demos", async () => {
    const { loadModuleDemo } = await import("./load-demo");
    for (const slug of [
      "tools-and-mcp",
      "retrieval-and-grounding",
      "verify-and-harden",
    ]) {
      const demo = loadModuleDemo(slug);
      expect(demo, slug).not.toBeNull();
      expect(demo!.beforeImage).toMatch(/\.(svg|png|webp)$/);
      expect(demo!.afterImage).toMatch(/\.(svg|png|webp)$/);
    }
  });

  it("every module declares canonical lesson steps with real headings", () => {
    for (const meta of listModules()) {
      expect(
        meta.steps.map((s) => s.id),
        `${meta.slug} step ids`,
      ).toEqual([...LESSON_STEP_IDS]);
      const content = loadModuleContent(meta.slug);
      expect(content).not.toBeNull();
      for (const step of meta.steps) {
        expect(step.title.length, `${meta.slug}.${step.id} title`).toBeGreaterThan(
          0,
        );
        expect(step.headings.length, `${meta.slug}.${step.id} headings`).toBeGreaterThan(
          0,
        );
        for (const heading of step.headings) {
          expect(
            content!.lessonMarkdown.includes(`## ${heading}`),
            `${meta.slug} missing ## ${heading} for step ${step.id}`,
          ).toBe(true);
        }
      }
    }
  });
});
