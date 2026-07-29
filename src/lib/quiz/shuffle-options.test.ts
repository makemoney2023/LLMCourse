import { describe, expect, it } from "vitest";
import { seededShuffle, shuffleQuestionOptions } from "./shuffle-options";

describe("seededShuffle", () => {
  it("returns the same permutation for the same seed", () => {
    const items = ["a", "b", "c", "d"];
    expect(seededShuffle(items, "q1")).toEqual(seededShuffle(items, "q1"));
  });

  it("returns a permutation and reorders for common question seeds", () => {
    const items = ["a", "b", "c", "d"];
    const seeds = ["q1", "q2", "q3", "q4", "mental-model:q1"];
    const permutations = seeds.map((seed) => seededShuffle(items, seed));
    for (const shuffled of permutations) {
      expect(shuffled).toHaveLength(4);
      expect(new Set(shuffled)).toEqual(new Set(items));
    }
    expect(permutations.some((p) => p.join("") !== "abcd")).toBe(true);
  });

  it("does not mutate the input array", () => {
    const items = ["a", "b", "c", "d"];
    const copy = [...items];
    seededShuffle(items, "seed");
    expect(items).toEqual(copy);
  });
});

describe("shuffleQuestionOptions", () => {
  it("keeps option ids and labels paired and preserves the correct id", () => {
    const question = {
      id: "q1",
      prompt: "Pick one",
      options: [
        { id: "a", label: "Correct" },
        { id: "b", label: "Wrong B" },
        { id: "c", label: "Wrong C" },
        { id: "d", label: "Wrong D" },
      ],
      correctOptionId: "a",
      explanation: "Because A",
    };

    const shuffled = shuffleQuestionOptions(question);
    expect(shuffled.correctOptionId).toBe("a");
    expect(shuffled.options.map((o) => o.id).sort()).toEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
    expect(shuffled.options.find((o) => o.id === "a")?.label).toBe("Correct");
    expect(shuffled.options.map((o) => o.id)).not.toEqual(["a", "b", "c", "d"]);
  });
});
