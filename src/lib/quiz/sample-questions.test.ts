import { describe, expect, it } from "vitest";
import { QUIZ_SAMPLE_SIZE, sampleQuizQuestions } from "./sample-questions";

const bank = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"].map((id) => ({
  id,
}));

describe("sampleQuizQuestions", () => {
  it("returns everything when the bank is small", () => {
    const small = bank.slice(0, 3);
    expect(sampleQuizQuestions(small, 5, "s")).toEqual(small);
  });

  it("samples exactly the requested count without duplicates", () => {
    const sampled = sampleQuizQuestions(bank, 5, "seed");
    expect(sampled.length).toBe(5);
    expect(new Set(sampled.map((q) => q.id)).size).toBe(5);
  });

  it("keeps the authored question order within the sample", () => {
    const sampled = sampleQuizQuestions(bank, 5, "seed");
    const indices = sampled.map((q) => bank.findIndex((b) => b.id === q.id));
    expect([...indices].sort((a, b) => a - b)).toEqual(indices);
  });

  it("is deterministic per seed and varies across seeds", () => {
    expect(sampleQuizQuestions(bank, 5, "s1")).toEqual(
      sampleQuizQuestions(bank, 5, "s1"),
    );
    const picks = ["s1", "s2", "s3", "s4", "s5", "s6"].map((seed) =>
      sampleQuizQuestions(bank, 5, seed)
        .map((q) => q.id)
        .join(","),
    );
    expect(new Set(picks).size).toBeGreaterThan(1);
  });

  it("exports a sample size of five", () => {
    expect(QUIZ_SAMPLE_SIZE).toBe(5);
  });
});
