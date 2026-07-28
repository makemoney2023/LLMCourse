import type { Metadata } from "next";
import { CheckpointBanner } from "@/components/checkpoint-banner";
import { ContinueCourseButton } from "@/components/continue-course-button";
import { ModuleList } from "@/components/module-list";
import { RoleTrackPicker } from "@/components/role-track-picker";
import {
  listModuleExerciseIds,
  listModules,
} from "@/lib/curriculum/load-curriculum";

export const metadata: Metadata = {
  title: "Modules",
};

export default function ModulesPage() {
  const modules = listModules();
  const exerciseIdsByModule = listModuleExerciseIds();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-4xl tracking-tight">Modules</h1>
          <p className="mt-2 text-muted-foreground">
            Work in order. Finish each module&apos;s steps, practice, and quiz
            before the next module unlocks.
          </p>
        </div>
        <RoleTrackPicker />
      </div>
      <div className="mt-6 space-y-4">
        <ContinueCourseButton
          modules={modules}
          exerciseIdsByModule={exerciseIdsByModule}
        />
        <CheckpointBanner />
      </div>
      <div className="mt-8">
        <ModuleList modules={modules} />
      </div>
    </div>
  );
}
