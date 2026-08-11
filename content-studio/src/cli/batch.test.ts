import { describe, expect, it } from "vitest";
import { batchExitCode } from "./batch";

describe("batchExitCode", () => {
  it("returns 0 when there are no errors", () => {
    expect(batchExitCode([])).toBe(0);
  });

  it("returns 1 when errors are present", () => {
    expect(batchExitCode([{ id: "a", error: "boom" }])).toBe(1);
  });
});
