import { describe, expect, it } from "vitest";
import { listModules, loadModuleContent } from "./load-curriculum";
import { parseExercises } from "@/lib/markdown";

describe("authored module content quality", () => {
  it("every module has substantial lesson, exercises, diagram, and quiz", () => {
    const modules = listModules();
    expect(modules.length).toBe(12);

    for (const meta of modules) {
      const content = loadModuleContent(meta.slug);
      expect(content, meta.slug).not.toBeNull();
      expect(
        content!.lessonMarkdown.length,
        `${meta.slug} lesson`,
      ).toBeGreaterThan(500);
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
        2,
      );
      for (const exercise of exercises) {
        expect(exercise.id).toMatch(/^ex-/);
        expect(exercise.answerHtml.length).toBeGreaterThan(10);
      }
    }
  });
});
