import { describe, expect, it } from "vitest";
import { emptyProgress } from "./progress";
import { computeCheckpoints, moduleCertificateUnlocked } from "./checkpoints";

describe("computeCheckpoints", () => {
  it("requires pack ack for session 1", () => {
    const progress = emptyProgress();
    progress.completedModules = [
      "mental-model",
      "deep-research",
      "system-instructions",
    ];
    expect(computeCheckpoints(progress)).not.toContain("session-1-pack");
    progress.packSavedAck = true;
    expect(computeCheckpoints(progress)).toContain("session-1-pack");
  });

  it("unlocks course-complete at 12 modules", () => {
    const progress = emptyProgress();
    progress.completedModules = Array.from({ length: 12 }, (_, i) => `m${i}`);
    expect(computeCheckpoints(progress)).toContain("course-complete");
  });
});

describe("moduleCertificateUnlocked", () => {
  it("needs complete + quiz score", () => {
    const progress = emptyProgress();
    progress.completedModules = ["mental-model"];
    expect(moduleCertificateUnlocked(progress, "mental-model")).toBe(false);
    progress.quizScores["mental-model"] = 75;
    expect(moduleCertificateUnlocked(progress, "mental-model")).toBe(true);
  });
});
