import { describe, expect, it } from "vitest";
import {
  emptyProgress,
  markExerciseComplete,
  markModuleComplete,
  markQuizScore,
  markStepComplete,
  progressPercent,
  revealAnswer,
  serializeProgress,
  deserializeProgress,
} from "./progress";

describe("progress helpers", () => {
  it("starts empty", () => {
    const p = emptyProgress();
    expect(p.completedModules).toEqual([]);
    expect(p.completedSteps).toEqual({});
    expect(progressPercent(p, 12)).toBe(0);
  });

  it("tracks lesson steps per module", () => {
    let p = emptyProgress();
    p = markStepComplete(p, "mental-model", "orient");
    p = markStepComplete(p, "mental-model", "orient");
    p = markStepComplete(p, "mental-model", "ideas");
    expect(p.completedSteps["mental-model"]).toEqual(["orient", "ideas"]);
  });

  it("marks modules complete without duplicates", () => {
    let p = emptyProgress();
    p = markModuleComplete(p, "mental-model");
    p = markModuleComplete(p, "mental-model");
    expect(p.completedModules).toEqual(["mental-model"]);
    expect(progressPercent(p, 12)).toBeCloseTo(100 / 12, 5);
  });

  it("tracks exercises per module", () => {
    let p = emptyProgress();
    p = markExerciseComplete(p, "mental-model", "ex-1");
    p = markExerciseComplete(p, "mental-model", "ex-2");
    expect(p.completedExercises["mental-model"]).toEqual(["ex-1", "ex-2"]);
  });

  it("records quiz scores and revealed answers", () => {
    let p = emptyProgress();
    p = markQuizScore(p, "mental-model", 75);
    p = revealAnswer(p, "mental-model", "ex-1");
    expect(p.quizScores["mental-model"]).toBe(75);
    expect(p.revealedAnswers["mental-model"]).toEqual(["ex-1"]);
  });

  it("round-trips through serialize/deserialize", () => {
    let p = emptyProgress();
    p = markModuleComplete(p, "human-craft");
    const raw = serializeProgress(p);
    expect(deserializeProgress(raw)).toEqual(p);
    expect(deserializeProgress("not-json")).toEqual(emptyProgress());
  });
});
