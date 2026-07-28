"use client";

import { useProgress } from "@/components/progress-provider";
import type { RoleTrackId } from "@/lib/curriculum/types";

const OPTIONS: { id: RoleTrackId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "ops", label: "Ops" },
  { id: "sales", label: "Sales" },
  { id: "eng", label: "Eng" },
  { id: "marketing", label: "Marketing" },
];

export function RoleTrackPicker({ className }: { className?: string }) {
  const { progress, chooseRoleTrack } = useProgress();

  return (
    <label className={className}>
      <span className="sr-only">Role track</span>
      <select
        className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
        value={progress.roleTrack}
        onChange={(e) => chooseRoleTrack(e.target.value as RoleTrackId)}
        aria-label="Examples for your role"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            Examples: {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
