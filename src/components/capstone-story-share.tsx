"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";
import {
  buildGalleryStory,
  storyIsComplete,
  type CapstoneStory,
} from "@/lib/capstone/story";
const STORY_STORAGE_KEY = "llm-course-capstone-story";

type StoryFields = Omit<CapstoneStory, "workflow">;

const EMPTY_STORY: StoryFields = { role: "", before: "", after: "", lesson: "" };

const FIELDS: { id: keyof StoryFields; label: string; placeholder: string }[] = [
  { id: "role", label: "Your role (optional)", placeholder: "e.g. Ops lead" },
  {
    id: "before",
    label: "Before — the old habit",
    placeholder: "e.g. 45 minutes of copy-paste, two guessed numbers",
  },
  {
    id: "after",
    label: "After — this run",
    placeholder: "e.g. 18 minutes to first draft, zero source errors",
  },
  {
    id: "lesson",
    label: "The default you are keeping",
    placeholder: "e.g. always attach BRIEF.md before status drafts",
  },
];

/** Turn the look-back into a gallery-format story the learner can send in. */
export function CapstoneStoryShare({ workflow }: { workflow: string }) {
  const [fields, setFields, loaded] = useLocalStorageState<StoryFields>(
    STORY_STORAGE_KEY,
    EMPTY_STORY,
  );
  const [copied, setCopied] = useState(false);

  const story: CapstoneStory = { ...fields, workflow };
  const complete = storyIsComplete(story);

  const copyStory = async () => {
    await navigator.clipboard.writeText(buildGalleryStory(story));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      className="space-y-4 rounded-2xl border border-border/70 bg-card/40 p-5"
      aria-label="Share your capstone story"
    >
      <div>
        <h2 className="font-heading text-2xl tracking-tight">
          5. Share your story
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Before/after stories like yours are what the capstone gallery is made
          of. The workflow comes from your scope above; fill in the arc from
          your look-back, then copy and send it to whoever runs your rollout.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.id} className="block text-sm">
            <span className="font-medium">{field.label}</span>
            <input
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              value={fields[field.id]}
              disabled={!loaded}
              placeholder={field.placeholder}
              onChange={(event) =>
                setFields({ ...fields, [field.id]: event.target.value })
              }
            />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" disabled={!complete} onClick={copyStory}>
          {copied ? "Copied" : "Copy story"}
        </Button>
        {!complete ? (
          <p className="text-xs text-muted-foreground">
            Needs the workflow (in Scope above), before, after, and the default
            you are keeping.
          </p>
        ) : null}
      </div>
    </section>
  );
}
