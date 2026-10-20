import type { Metadata } from "next";
import { CheckpointBanner } from "@/components/checkpoint-banner";
import { ContinueCourseButton } from "@/components/continue-course-button";
import { ModuleList } from "@/components/module-list";
import { RoleTrackPicker } from "@/components/role-track-picker";
import { getCourseAccess } from "@/lib/access/session";
import {
  listModuleExerciseIds,
  listModules,
} from "@/lib/curriculum/load-curriculum";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Modules",
};

export default async function ModulesPage() {
  const access = await getCourseAccess();
  const modules = listModules();
  const exerciseIdsByModule = listModuleExerciseIds();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-4xl tracking-tight">Modules</h1>
          <p className="mt-2 text-muted-foreground">
            Module 1 is a free preview. Modules 2–12 are part of lifetime
            access. Each module still needs steps, practice, and a 75%+ quiz
            score to count as complete.
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
        <ModuleList modules={modules} entitled={access.entitled} />
      </div>
    </div>
  );
}
