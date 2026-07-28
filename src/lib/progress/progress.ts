import type { CourseProgress, RoleTrackId } from "@/lib/curriculum/types";

export const PROGRESS_STORAGE_KEY = "llm-course-progress-v2";
export const PROGRESS_STORAGE_KEY_V1 = "llm-course-progress-v1";

export function emptyProgress(): CourseProgress {
  return {
    completedModules: [],
    completedExercises: {},
    quizScores: {},
    revealedAnswers: {},
    roleTrack: "general",
    checkpoints: [],
    sandboxAttempts: {},
    certificateClaims: [],
    packSavedAck: false,
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

export function setRoleTrack(
  progress: CourseProgress,
  roleTrack: RoleTrackId,
): CourseProgress {
  return { ...progress, roleTrack };
}

export function acknowledgePackSaved(progress: CourseProgress): CourseProgress {
  return { ...progress, packSavedAck: true };
}

export function recordSandboxCompare(
  progress: CourseProgress,
  sandboxId: string,
): CourseProgress {
  return {
    ...progress,
    sandboxAttempts: {
      ...progress.sandboxAttempts,
      [sandboxId]: { comparedAt: new Date().toISOString() },
    },
  };
}

export function claimCertificate(
  progress: CourseProgress,
  claimId: string,
): CourseProgress {
  if (progress.certificateClaims.includes(claimId)) return progress;
  return {
    ...progress,
    certificateClaims: [...progress.certificateClaims, claimId],
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

export function deserializeProgress(
  raw: string | null | undefined,
): CourseProgress {
  if (!raw) return emptyProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<CourseProgress>;
    return {
      ...emptyProgress(),
      completedModules: parsed.completedModules ?? [],
      completedExercises: parsed.completedExercises ?? {},
      quizScores: parsed.quizScores ?? {},
      revealedAnswers: parsed.revealedAnswers ?? {},
      roleTrack: parsed.roleTrack ?? "general",
      checkpoints: parsed.checkpoints ?? [],
      sandboxAttempts: parsed.sandboxAttempts ?? {},
      certificateClaims: parsed.certificateClaims ?? [],
      packSavedAck: parsed.packSavedAck ?? false,
    };
  } catch {
    return emptyProgress();
  }
}

/** Load v2, or migrate from v1 once. */
export function loadProgressFromStorage(): CourseProgress {
  if (typeof window === "undefined") return emptyProgress();
  const v2 = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (v2) return deserializeProgress(v2);
  const v1 = window.localStorage.getItem(PROGRESS_STORAGE_KEY_V1);
  if (!v1) return emptyProgress();
  const migrated = deserializeProgress(v1);
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(migrated));
  return migrated;
}
