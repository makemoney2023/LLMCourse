"use client";

import { ContinueCourseButton } from "@/components/continue-course-button";
import { useProgress } from "@/components/progress-provider";
import type { ModuleMeta } from "@/lib/curriculum/types";

/** Shown on the marketing home only when this device has course progress. */
export function HomeResumeBanner({
  modules,
  exerciseIdsByModule,
}: {
  modules: ModuleMeta[];
  exerciseIdsByModule: Record<string, string[]>;
}) {
  const { hydrated, percent } = useProgress();

  if (!hydrated || percent === 0) return null;

  return (
    <section className="border-b border-border/70 bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <p className="text-sm">
          <span className="font-medium">Welcome back.</span> You are{" "}
          {Math.round(percent)}% through the course.
        </p>
        <ContinueCourseButton
          modules={modules}
          exerciseIdsByModule={exerciseIdsByModule}
        />
      </div>
    </section>
  );
}
