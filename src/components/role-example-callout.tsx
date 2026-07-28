"use client";

import { useProgress } from "@/components/progress-provider";
import type { TrackModuleOverlay } from "@/lib/curriculum/tracks";
import type { RoleTrackId } from "@/lib/curriculum/types";

export function RoleExampleCallout({
  overlaysByTrack,
}: {
  overlaysByTrack: Partial<Record<RoleTrackId, TrackModuleOverlay | null>>;
}) {
  const { progress } = useProgress();
  const overlay =
    overlaysByTrack[progress.roleTrack] ?? overlaysByTrack.general ?? null;
  if (!overlay) return null;

  return (
    <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
      <p className="font-heading text-lg tracking-tight">
        Example for your role
      </p>
      <p className="mt-2 text-muted-foreground">{overlay.story}</p>
      <p className="mt-3">
        <span className="font-medium">Try asking: </span>
        {overlay.exampleAsk}
      </p>
      <p className="mt-2 text-muted-foreground">
        <span className="font-medium text-foreground">Watch out: </span>
        {overlay.watchOut}
      </p>
    </aside>
  );
}
