"use client";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";

/** Status-only: modules complete when the quiz is passed. */
export function ModuleCompleteStatus({ moduleId }: { moduleId: string }) {
  const { progress } = useProgress();
  const done = progress.completedModules.includes(moduleId);
  const quizScore = progress.quizScores[moduleId];

  if (done) {
    return (
      <Badge variant="secondary">
        Module complete
        {quizScore != null ? ` · quiz ${quizScore}%` : ""}
      </Badge>
    );
  }

  return (
    <Badge variant="outline">
      Complete this module by scoring 75% or higher on the quiz
    </Badge>
  );
}
