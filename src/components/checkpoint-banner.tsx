"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";
import { computeCheckpoints } from "@/lib/progress/checkpoints";

const LABELS: Record<string, string> = {
  "session-1-pack": "Session 1 pack",
  "session-2-runbook": "Session 2 runbook",
  "session-3-scale": "Session 3 scale",
  "session-4-craft": "Session 4 craft",
  "course-complete": "Course complete",
};

export function CheckpointBanner() {
  const { progress, ackPackSaved } = useProgress();
  const earned = computeCheckpoints(progress);
  const session1Ready =
    ["mental-model", "deep-research", "system-instructions"].every((id) =>
      progress.completedModules.includes(id),
    ) && !progress.packSavedAck;

  return (
    <div className="space-y-3 rounded-2xl border border-border/70 bg-card/40 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-heading text-lg">Checkpoints</p>
        <Button asChild variant="ghost" size="sm">
          <Link href="/certificates/checkpoint-course-complete">Certificates</Link>
        </Button>
      </div>
      {session1Ready ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-muted-foreground">
            Modules 1–3 done. Confirm you saved BRIEF.md + SOURCES.md to unlock
            Session 1.
          </p>
          <Button type="button" size="sm" onClick={() => ackPackSaved()}>
            I saved my pack
          </Button>
        </div>
      ) : null}
      <ul className="flex flex-wrap gap-2">
        {Object.keys(LABELS).map((id) => {
          const on = earned.includes(id);
          return (
            <li key={id}>
              <Link
                href={`/certificates/checkpoint-${id}`}
                className={
                  on
                    ? "rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-foreground"
                    : "rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                }
              >
                {on ? "Unlocked: " : "Locked: "}
                {LABELS[id]}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
