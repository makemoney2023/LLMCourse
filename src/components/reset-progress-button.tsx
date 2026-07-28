"use client";

import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";

export function ResetProgressButton() {
  const { resetProgress, percent } = useProgress();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-muted-foreground"
      disabled={percent === 0}
      onClick={() => {
        if (
          window.confirm(
            "Reset all local course progress on this device? This cannot be undone.",
          )
        ) {
          resetProgress();
        }
      }}
    >
      Reset progress
    </Button>
  );
}
