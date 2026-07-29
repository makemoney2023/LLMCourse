"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";

const CHECKLIST_STORAGE_KEY = "llm-course-capstone-checklist";

const ITEMS: { id: string; label: string }[] = [
  { id: "scope", label: "One artifact, a time box under 90 minutes, and a not-do line" },
  { id: "files", label: "All eight pack files exist, even if short" },
  { id: "facts", label: "Facts live in BRIEF.md and SOURCES.md, not in long wall text" },
  { id: "rules", label: "Wall rules fit in ten lines or fewer" },
  { id: "playbook", label: "The playbook names a trigger, steps, and done-when checks" },
  { id: "tools", label: "The tool list names what is allowed and what needs a person" },
  { id: "handoff", label: "The handoff works without reading any private chat" },
  { id: "owners", label: "Ownership names a pack owner and a merge owner" },
];

/** The exercise answer key as a self-check before the timed run. */
export function CapstoneChecklist() {
  const [checked, setChecked, loaded] = useLocalStorageState<string[]>(
    CHECKLIST_STORAGE_KEY,
    [],
  );

  const toggle = (id: string) => {
    setChecked(
      checked.includes(id)
        ? checked.filter((item) => item !== id)
        : [...checked, id],
    );
  };

  return (
    <section
      className="space-y-4 rounded-2xl border border-border/70 bg-card/40 p-5"
      aria-label="Pack readiness checklist"
    >
      <div>
        <h2 className="font-heading text-2xl tracking-tight">
          3. Ready to run?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {checked.length} of {ITEMS.length} checks done. Configure through
          verify before you run the timer.
        </p>
      </div>
      <ul className="space-y-2">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-start gap-2 text-sm leading-relaxed">
              <Checkbox
                className="mt-0.5"
                checked={checked.includes(item.id)}
                disabled={!loaded}
                onCheckedChange={() => toggle(item.id)}
                aria-label={item.label}
              />
              {item.label}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
