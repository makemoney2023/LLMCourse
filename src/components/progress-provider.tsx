"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CourseProgress, RoleTrackId } from "@/lib/curriculum/types";
import {
  acknowledgePackSaved,
  claimCertificate,
  emptyProgress,
  loadProgressFromStorage,
  markExerciseComplete,
  markModuleComplete,
  markQuizScore,
  PROGRESS_STORAGE_KEY,
  progressPercent,
  recordSandboxCompare,
  revealAnswer,
  serializeProgress,
  setRoleTrack,
} from "@/lib/progress/progress";

type ProgressContextValue = {
  progress: CourseProgress;
  percent: number;
  completeModule: (moduleId: string) => void;
  completeExercise: (moduleId: string, exerciseId: string) => void;
  setQuizScore: (moduleId: string, score: number) => void;
  revealExerciseAnswer: (moduleId: string, exerciseId: string) => void;
  chooseRoleTrack: (track: RoleTrackId) => void;
  ackPackSaved: () => void;
  markSandboxCompared: (sandboxId: string) => void;
  claimCert: (claimId: string) => void;
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({
  children,
  totalModules,
}: {
  children: React.ReactNode;
  totalModules: number;
}) {
  const [progress, setProgress] = useState<CourseProgress>(emptyProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgressFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      serializeProgress(progress),
    );
  }, [progress, hydrated]);

  const completeModule = useCallback((moduleId: string) => {
    setProgress((p) => markModuleComplete(p, moduleId));
  }, []);

  const completeExercise = useCallback(
    (moduleId: string, exerciseId: string) => {
      setProgress((p) => markExerciseComplete(p, moduleId, exerciseId));
    },
    [],
  );

  const setQuizScore = useCallback((moduleId: string, score: number) => {
    setProgress((p) => markQuizScore(p, moduleId, score));
  }, []);

  const revealExerciseAnswer = useCallback(
    (moduleId: string, exerciseId: string) => {
      setProgress((p) => revealAnswer(p, moduleId, exerciseId));
    },
    [],
  );

  const chooseRoleTrack = useCallback((track: RoleTrackId) => {
    setProgress((p) => setRoleTrack(p, track));
  }, []);

  const ackPackSaved = useCallback(() => {
    setProgress((p) => acknowledgePackSaved(p));
  }, []);

  const markSandboxCompared = useCallback((sandboxId: string) => {
    setProgress((p) => recordSandboxCompare(p, sandboxId));
  }, []);

  const claimCert = useCallback((claimId: string) => {
    setProgress((p) => claimCertificate(p, claimId));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(emptyProgress());
  }, []);

  const value = useMemo(
    () => ({
      progress,
      percent: progressPercent(progress, totalModules),
      completeModule,
      completeExercise,
      setQuizScore,
      revealExerciseAnswer,
      chooseRoleTrack,
      ackPackSaved,
      markSandboxCompared,
      claimCert,
      resetProgress,
    }),
    [
      progress,
      totalModules,
      completeModule,
      completeExercise,
      setQuizScore,
      revealExerciseAnswer,
      chooseRoleTrack,
      ackPackSaved,
      markSandboxCompared,
      claimCert,
      resetProgress,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
}
