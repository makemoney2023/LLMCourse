"use client";

export const SCOPE_STORAGE_KEY = "llm-course-capstone-scope";

export type CapstoneScope = {
  workflow: string;
  artifact: string;
  timebox: string;
  notDo: string;
};

export const EMPTY_SCOPE: CapstoneScope = {
  workflow: "",
  artifact: "",
  timebox: "",
  notDo: "",
};

const FIELDS: { id: keyof CapstoneScope; label: string; placeholder: string }[] =
  [
    {
      id: "workflow",
      label: "Workflow you own",
      placeholder: "e.g. weekly manager status",
    },
    {
      id: "artifact",
      label: "The one artifact you will ship",
      placeholder: "e.g. five-bullet status note",
    },
    {
      id: "timebox",
      label: "Time box (under 90 minutes)",
      placeholder: "e.g. 45 focused minutes",
    },
    {
      id: "notDo",
      label: "Not doing in this run",
      placeholder: "e.g. no slide deck, no new research",
    },
  ];

/** Exercise 1 in form shape: scope before you configure anything. */
export function CapstoneScopeForm({
  scope,
  setScope,
  loaded,
}: {
  scope: CapstoneScope;
  setScope: (next: CapstoneScope) => void;
  loaded: boolean;
}) {
  return (
    <section
      className="space-y-4 rounded-2xl border border-border/70 bg-card/40 p-5"
      aria-label="Capstone scope"
    >
      <div>
        <h2 className="font-heading text-2xl tracking-tight">
          1. Scope it first
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          If it needs a week, cut scope until one artifact fits the time box.
          The not-do line prevents scope creep mid-run.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.id} className="block text-sm">
            <span className="font-medium">{field.label}</span>
            <input
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              value={scope[field.id]}
              disabled={!loaded}
              placeholder={field.placeholder}
              onChange={(event) =>
                setScope({ ...scope, [field.id]: event.target.value })
              }
            />
          </label>
        ))}
      </div>
    </section>
  );
}
