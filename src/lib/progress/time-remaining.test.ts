import { describe, expect, it } from "vitest";
import { emptyProgress, markModuleComplete } from "./progress";
import { formatMinutes, remainingMinutes } from "./time-remaining";

const durations = [
  { id: "a", durationMinutes: 25 },
  { id: "b", durationMinutes: 35 },
  { id: "c", durationMinutes: 30 },
];

describe("remainingMinutes", () => {
  it("sums every module when nothing is complete", () => {
    expect(remainingMinutes(emptyProgress(), durations)).toBe(90);
  });

  it("skips completed modules", () => {
    const p = markModuleComplete(emptyProgress(), "b");
    expect(remainingMinutes(p, durations)).toBe(55);
  });

  it("returns 0 when everything is complete", () => {
    let p = emptyProgress();
    for (const m of durations) p = markModuleComplete(p, m.id);
    expect(remainingMinutes(p, durations)).toBe(0);
  });
});

describe("formatMinutes", () => {
  it("formats minutes under an hour", () => {
    expect(formatMinutes(45)).toBe("45m");
  });

  it("formats whole hours", () => {
    expect(formatMinutes(120)).toBe("2h");
  });

  it("formats hours and minutes", () => {
    expect(formatMinutes(155)).toBe("2h 35m");
  });

  it("formats zero", () => {
    expect(formatMinutes(0)).toBe("0m");
  });
});
