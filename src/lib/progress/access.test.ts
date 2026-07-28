import { describe, expect, it } from "vitest";
import type { ModuleMeta } from "@/lib/curriculum/types";
import {
  getContinueTarget,
  isModuleUnlocked,
  isPracticeUnlocked,
  isQuizUnlocked,
  isStepUnlocked,
  LESSON_STEP_IDS,
  PRACTICE_STEP_ID,
  recordQuizAndCompleteModule,
} from "./access";
import {
  emptyProgress,
  markExerciseComplete,
  markModuleComplete,
  markStepComplete,
} from "./progress";

const STEPS = [
  {
    id: "orient",
    title: "Get oriented",
    headings: ["In plain words", "What this is", "Why it matters"],
  },
  { id: "ideas", title: "Big ideas", headings: ["Big ideas"] },
  {
    id: "apply",
    title: "Put it to work",
    headings: [
      "Where this sits in the loop",
      "What goes wrong if you skip it",
      "Where this shows up in tools",
      "Tips",
    ],
  },
] as const;

function mod(
  partial: Pick<ModuleMeta, "id" | "order" | "slug" | "title">,
): ModuleMeta {
  return {
    subtitle: "",
    durationMinutes: 20,
    workshopSession: 1,
    prerequisites: [],
    objectives: [],
    loopPlacement: "",
    skipConsequence: "",
    exerciseTitles: ["A", "B"],
    toolMapping: [],
    quizCount: 2,
    dirName: `0${partial.order}-${partial.slug}`,
    steps: [...STEPS],
    ...partial,
  };
}

const modules: ModuleMeta[] = [
  mod({ id: "mental-model", order: 1, slug: "mental-model", title: "Mental model" }),
  mod({
    id: "deep-research",
    order: 2,
    slug: "deep-research",
    title: "Deep research",
  }),
  mod({
    id: "system-instructions",
    order: 3,
    slug: "system-instructions",
    title: "System instructions",
  }),
];

const exerciseIds = ["ex-1", "ex-2"];

describe("access helpers", () => {
  it("unlocks module 1 always; locks later modules until prior complete", () => {
    let p = emptyProgress();
    expect(isModuleUnlocked(p, modules, "mental-model")).toBe(true);
    expect(isModuleUnlocked(p, modules, "deep-research")).toBe(false);

    p = markModuleComplete(p, "mental-model");
    expect(isModuleUnlocked(p, modules, "deep-research")).toBe(true);
    expect(isModuleUnlocked(p, modules, "system-instructions")).toBe(false);
  });

  it("unlocks lesson steps in order", () => {
    const p = emptyProgress();
    const m = modules[0]!;
    expect(isStepUnlocked(p, m, "orient")).toBe(true);
    expect(isStepUnlocked(p, m, "ideas")).toBe(false);
    expect(isStepUnlocked(p, m, "apply")).toBe(false);

    const afterOrient = markStepComplete(p, m.id, "orient");
    expect(isStepUnlocked(afterOrient, m, "ideas")).toBe(true);
    expect(isStepUnlocked(afterOrient, m, "apply")).toBe(false);
  });

  it("unlocks practice after all lesson steps; quiz after all exercises", () => {
    let p = emptyProgress();
    const m = modules[0]!;
    expect(isPracticeUnlocked(p, m)).toBe(false);
    expect(isQuizUnlocked(p, m, exerciseIds)).toBe(false);

    for (const id of LESSON_STEP_IDS) {
      p = markStepComplete(p, m.id, id);
    }
    expect(isPracticeUnlocked(p, m)).toBe(true);
    expect(isQuizUnlocked(p, m, exerciseIds)).toBe(false);

    p = markExerciseComplete(p, m.id, "ex-1");
    p = markExerciseComplete(p, m.id, "ex-2");
    expect(isQuizUnlocked(p, m, exerciseIds)).toBe(true);
  });

  it("quiz submit records score and completes the module", () => {
    let p = emptyProgress();
    p = recordQuizAndCompleteModule(p, "mental-model", 80);
    expect(p.quizScores["mental-model"]).toBe(80);
    expect(p.completedModules).toContain("mental-model");
  });

  it("continue target points at first incomplete step or next module", () => {
    let p = emptyProgress();
    expect(getContinueTarget(p, modules, { "mental-model": exerciseIds })).toEqual(
      {
        moduleSlug: "mental-model",
        stepId: "orient",
      },
    );

    p = markStepComplete(p, "mental-model", "orient");
    expect(getContinueTarget(p, modules, { "mental-model": exerciseIds })?.stepId).toBe(
      "ideas",
    );

    for (const id of LESSON_STEP_IDS) {
      p = markStepComplete(p, "mental-model", id);
    }
    expect(getContinueTarget(p, modules, { "mental-model": exerciseIds })?.stepId).toBe(
      PRACTICE_STEP_ID,
    );

    p = markExerciseComplete(p, "mental-model", "ex-1");
    p = markExerciseComplete(p, "mental-model", "ex-2");
    expect(getContinueTarget(p, modules, { "mental-model": exerciseIds })?.stepId).toBe(
      "quiz",
    );

    p = recordQuizAndCompleteModule(p, "mental-model", 100);
    expect(getContinueTarget(p, modules, { "mental-model": exerciseIds })).toEqual({
      moduleSlug: "deep-research",
      stepId: "orient",
    });
  });
});
