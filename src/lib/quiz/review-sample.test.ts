import { describe, expect, it } from "vitest";
import type { Quiz } from "@/lib/curriculum/types";
import { sampleReviewQuestions } from "./review-sample";

function makeQuiz(moduleId: string, count: number): Quiz {
  return {
    moduleId,
    questions: Array.from({ length: count }, (_, i) => ({
      id: `${moduleId}-q${i + 1}`,
      prompt: `Question ${i + 1} of ${moduleId}`,
      options: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
      ],
      correctOptionId: "b",
      explanation: "Because B.",
    })),
  };
}

const quizzes = [makeQuiz("m1", 4), makeQuiz("m2", 4), makeQuiz("m3", 4)];

describe("sampleReviewQuestions", () => {
  it("only draws from completed modules", () => {
    const sample = sampleReviewQuestions(quizzes, ["m1"], 10, "seed");
    expect(sample.length).toBe(4);
    expect(sample.every((q) => q.moduleId === "m1")).toBe(true);
  });

  it("caps the sample at the requested count", () => {
    const sample = sampleReviewQuestions(quizzes, ["m1", "m2", "m3"], 5, "s");
    expect(sample.length).toBe(5);
  });

  it("returns empty when nothing is complete", () => {
    expect(sampleReviewQuestions(quizzes, [], 10, "s")).toEqual([]);
  });

  it("is deterministic for the same seed", () => {
    const a = sampleReviewQuestions(quizzes, ["m1", "m2"], 5, "same");
    const b = sampleReviewQuestions(quizzes, ["m1", "m2"], 5, "same");
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
  });

  it("varies with the seed", () => {
    const seeds = ["s1", "s2", "s3", "s4", "s5"];
    const orders = seeds.map((seed) =>
      sampleReviewQuestions(quizzes, ["m1", "m2", "m3"], 8, seed)
        .map((q) => q.id)
        .join(","),
    );
    expect(new Set(orders).size).toBeGreaterThan(1);
  });

  it("keeps question ids unique across modules", () => {
    const sample = sampleReviewQuestions(quizzes, ["m1", "m2", "m3"], 12, "s");
    expect(new Set(sample.map((q) => q.id)).size).toBe(sample.length);
  });
});
