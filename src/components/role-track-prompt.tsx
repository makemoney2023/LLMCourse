"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";
import type { RoleTrackId } from "@/lib/curriculum/types";

const DISMISSED_KEY = "llm-course-role-prompt-dismissed";

const ROLES: { id: RoleTrackId; label: string }[] = [
  { id: "ops", label: "Ops" },
  { id: "sales", label: "Sales" },
  { id: "eng", label: "Engineering" },
  { id: "marketing", label: "Marketing" },
  { id: "general", label: "Something else" },
];

/**
 * One-time banner asking the learner to pick a role so lesson examples match
 * their work. The default track is "general", so an explicit choice (or a
 * dismissal) is remembered separately from progress.
 */
export function RoleTrackPrompt() {
  const { hydrated, chooseRoleTrack } = useProgress();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setVisible(window.localStorage.getItem(DISMISSED_KEY) !== "1");
  }, [hydrated]);

  if (!visible) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  };

  const pick = (role: RoleTrackId) => {
    chooseRoleTrack(role);
    dismiss();
  };

  return (
    <div className="relative rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3">
      <button
        type="button"
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss role prompt"
        onClick={dismiss}
      >
        <X className="size-4" />
      </button>
      <p className="font-heading text-base tracking-tight">
        What kind of work do you do?
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Every module includes examples flavored for your role. Pick one — you
        can change it anytime from the selector above the lesson.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {ROLES.map((role) => (
          <Button
            key={role.id}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => pick(role.id)}
          >
            {role.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
