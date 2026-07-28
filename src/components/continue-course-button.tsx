"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";
import type { ModuleMeta } from "@/lib/curriculum/types";
import { getContinueTarget } from "@/lib/progress/access";

export function ContinueCourseButton({
  modules,
  exerciseIdsByModule,
  label = "Continue where you left off",
  className,
}: {
  modules: ModuleMeta[];
  exerciseIdsByModule?: Record<string, string[]>;
  label?: string;
  className?: string;
}) {
  const { progress } = useProgress();
  const target = getContinueTarget(
    progress,
    modules,
    exerciseIdsByModule ?? {},
  );
  if (!target) {
    return (
      <Button asChild variant="secondary" className={className}>
        <Link href="/modules">All modules complete</Link>
      </Button>
    );
  }
  const hash =
    target.stepId === "quiz"
      ? "step-quiz"
      : target.stepId === "practice"
        ? "step-practice"
        : `step-${target.stepId}`;
  return (
    <Button asChild className={className}>
      <Link href={`/modules/${target.moduleSlug}#${hash}`}>{label}</Link>
    </Button>
  );
}
