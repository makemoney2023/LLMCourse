import { describe, expect, it } from "vitest";
import { parseStepHash, stepIdToHash } from "./step-hash";

describe("step hash helpers", () => {
  it("round-trips lesson, practice, and quiz step ids", () => {
    expect(stepIdToHash("orient")).toBe("step-orient");
    expect(stepIdToHash("practice")).toBe("step-practice");
    expect(stepIdToHash("quiz")).toBe("step-quiz");
    expect(parseStepHash("#step-orient")).toBe("orient");
    expect(parseStepHash("#step-practice")).toBe("practice");
    expect(parseStepHash("step-quiz")).toBe("quiz");
  });

  it("returns null for empty or unknown hashes", () => {
    expect(parseStepHash("")).toBeNull();
    expect(parseStepHash("#")).toBeNull();
    expect(parseStepHash("#nope")).toBeNull();
    expect(parseStepHash("#step-")).toBeNull();
  });
});
