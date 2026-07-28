import type { CourseProgress } from "@/lib/curriculum/types";

export const PROGRESS_STORAGE_KEY = "llm-course-progress-v1";

export function emptyProgress(): CourseProgress {
  return {
    completedModules: [],
    completedExercises: {},
    quizScores: {},
    revealedAnswers: {},
  };
}

export function markModuleComplete(
  progress: CourseProgress,
  moduleId: string,
): CourseProgress {
  if (progress.completedModules.includes(moduleId)) return progress;
  return {
    ...progress,
    completedModules: [...progress.completedModules, moduleId],
  };
}

export function markExerciseComplete(
  progress: CourseProgress,
  moduleId: string,
  exerciseId: string,
): CourseProgress {
  const existing = progress.completedExercises[moduleId] ?? [];
  if (existing.includes(exerciseId)) return progress;
  return {
    ...progress,
    completedExercises: {
      ...progress.completedExercises,
      [moduleId]: [...existing, exerciseId],
    },
  };
}

export function markQuizScore(
  progress: CourseProgress,
  moduleId: string,
  score: number,
): CourseProgress {
  return {
    ...progress,
    quizScores: {
      ...progress.quizScores,
      [moduleId]: score,
    },
  };
}

export function revealAnswer(
  progress: CourseProgress,
  moduleId: string,
  exerciseId: string,
): CourseProgress {
  const existing = progress.revealedAnswers[moduleId] ?? [];
  if (existing.includes(exerciseId)) return progress;
  return {
    ...progress,
    revealedAnswers: {
      ...progress.revealedAnswers,
      [moduleId]: [...existing, exerciseId],
    },
  };
}

export function progressPercent(
  progress: CourseProgress,
  totalModules: number,
): number {
  if (totalModules <= 0) return 0;
  return (progress.completedModules.length / totalModules) * 100;
}

export function serializeProgress(progress: CourseProgress): string {
  return JSON.stringify(progress);
}

export function deserializeProgress(raw: string | null | undefined): CourseProgress {
  if (!raw) return emptyProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<CourseProgress>;
    return {
      completedModules: parsed.completedModules ?? [],
      completedExercises: parsed.completedExercises ?? {},
      quizScores: parsed.quizScores ?? {},
      revealedAnswers: parsed.revealedAnswers ?? {},
    };
  } catch {
    return emptyProgress();
  }
}
