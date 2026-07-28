import { describe, expect, it } from "vitest";
import { listModules, loadModuleContent } from "./load-curriculum";
import { parseExercises } from "@/lib/markdown";
import { wordsIn } from "./readability";

const REQUIRED_LESSON_H2 = [
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
});
