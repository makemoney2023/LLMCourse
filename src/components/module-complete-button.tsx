"use client";

import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";

export function ModuleCompleteButton({ moduleId }: { moduleId: string }) {
  const { progress, completeModule } = useProgress();
  const done = progress.completedModules.includes(moduleId);

  return (
    <Button
      type="button"
      variant={done ? "secondary" : "default"}
      onClick={() => completeModule(moduleId)}
      disabled={done}
    >
      {done ? "Module marked complete" : "Mark module complete"}
    </Button>
  );
}
