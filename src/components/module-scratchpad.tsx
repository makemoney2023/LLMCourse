"use client";

import { useEffect, useState } from "react";

const NOTES_KEY_PREFIX = "llm-course-notes-";

/**
 * Free-form notes per module, saved locally. Kept out of the progress store
 * so resetting progress never deletes a learner's own writing.
 */
export function ModuleScratchpad({ moduleId }: { moduleId: string }) {
  const storageKey = `${NOTES_KEY_PREFIX}${moduleId}`;
  const [value, setValue] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setValue(window.localStorage.getItem(storageKey) ?? "");
    setLoaded(true);
  }, [storageKey]);

  const handleChange = (next: string) => {
    setValue(next);
    if (next.trim() === "") {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, next);
    }
  };

  return (
    <details className="rounded-2xl border border-border/60 bg-card/30 px-4 py-3">
      <summary className="cursor-pointer font-heading text-lg tracking-tight">
        My notes for this module
      </summary>
      <p className="mt-2 text-xs text-muted-foreground">
        Saved on this device as you type. Handy for drafting wall rules,
        handoff notes, or done-when checks from the exercises.
      </p>
      <textarea
        className="mt-3 min-h-32 w-full rounded-md border border-border bg-background p-3 text-sm leading-relaxed"
        placeholder="Write your notes here…"
        value={value}
        disabled={!loaded}
        onChange={(event) => handleChange(event.target.value)}
        aria-label="Module notes"
      />
    </details>
  );
}
