import type { CourseProgress, ModuleMeta } from "@/lib/curriculum/types";
import { markModuleComplete, markQuizScore } from "@/lib/progress/progress";

export const LESSON_STEP_IDS = ["orient", "ideas", "apply"] as const;
export type LessonStepId = (typeof LESSON_STEP_IDS)[number];
export const PRACTICE_STEP_ID = "practice";
export const QUIZ_STEP_ID = "quiz";

export type ContinueTarget = {
  moduleSlug: string;
  stepId: string;
};

function lessonStepIds(module: ModuleMeta): string[] {
  return module.steps.map((s) => s.id);
}

function stepsDone(progress: CourseProgress, moduleId: string): string[] {
  return progress.completedSteps[moduleId] ?? [];
}

export function isModuleUnlocked(
  progress: CourseProgress,
  modules: ModuleMeta[],
  moduleId: string,
): boolean {
  const ordered = [...modules].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((m) => m.id === moduleId);
  if (index <= 0) return index === 0;
  const prev = ordered[index - 1];
  if (!prev) return false;
  return progress.completedModules.includes(prev.id);
}

export function isStepUnlocked(
  progress: CourseProgress,
  module: ModuleMeta,
  stepId: string,
): boolean {
  const ids = lessonStepIds(module);
  const idx = ids.indexOf(stepId);
  if (idx < 0) return false;
  if (idx === 0) return true;
  const prevId = ids[idx - 1]!;
  return stepsDone(progress, module.id).includes(prevId);
}

export function isPracticeUnlocked(
  progress: CourseProgress,
  module: ModuleMeta,
): boolean {
  const ids = lessonStepIds(module);
  const done = stepsDone(progress, module.id);
  return ids.length > 0 && ids.every((id) => done.includes(id));
}

export function isQuizUnlocked(
  progress: CourseProgress,
  module: ModuleMeta,
  exerciseIds: string[],
): boolean {
  if (!isPracticeUnlocked(progress, module)) return false;
  if (exerciseIds.length === 0) return true;
  const done = progress.completedExercises[module.id] ?? [];
  return exerciseIds.every((id) => done.includes(id));
}

export function recordQuizAndCompleteModule(
  progress: CourseProgress,
  moduleId: string,
  score: number,
): CourseProgress {
  return markModuleComplete(markQuizScore(progress, moduleId, score), moduleId);
}

export function getContinueTarget(
  progress: CourseProgress,
  modules: ModuleMeta[],
  exerciseIdsByModule: Record<string, string[]>,
): ContinueTarget | null {
  const ordered = [...modules].sort((a, b) => a.order - b.order);
  for (const mod of ordered) {
    if (!isModuleUnlocked(progress, ordered, mod.id)) {
      return null;
    }
    if (progress.completedModules.includes(mod.id)) continue;

    for (const step of mod.steps) {
      if (!stepsDone(progress, mod.id).includes(step.id)) {
        return { moduleSlug: mod.slug, stepId: step.id };
      }
    }

    if (!isPracticeUnlocked(progress, mod)) {
      return { moduleSlug: mod.slug, stepId: PRACTICE_STEP_ID };
    }

    const exerciseIds = exerciseIdsByModule[mod.id] ?? [];
    const exercisesDone = progress.completedExercises[mod.id] ?? [];
    const practiceFinished =
      exerciseIds.length === 0 ||
      exerciseIds.every((id) => exercisesDone.includes(id));

    if (!practiceFinished) {
      return { moduleSlug: mod.slug, stepId: PRACTICE_STEP_ID };
    }

    if (progress.quizScores[mod.id] == null) {
      return { moduleSlug: mod.slug, stepId: QUIZ_STEP_ID };
    }

    // Quiz scored but module not marked complete — still send to quiz
    return { moduleSlug: mod.slug, stepId: QUIZ_STEP_ID };
  }
  return null;
}

export function unlockReason(
  progress: CourseProgress,
  modules: ModuleMeta[],
  moduleId: string,
): string | null {
  if (isModuleUnlocked(progress, modules, moduleId)) return null;
  const ordered = [...modules].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((m) => m.id === moduleId);
  const prev = ordered[index - 1];
  if (!prev) return "Finish the previous module first.";
  return `Finish Module ${prev.order}: ${prev.title} first.`;
}
