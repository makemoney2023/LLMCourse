"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";
import type { Sandbox } from "@/lib/curriculum/load-sandboxes";

export function TryItSandbox({ sandbox }: { sandbox: Sandbox }) {
  const { markSandboxCompared, progress } = useProgress();
  const [draft, setDraft] = useState("");
  const [compared, setCompared] = useState(
    Boolean(progress.sandboxAttempts[sandbox.id]),
  );

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="font-heading text-2xl">Starter prompt</h2>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-border/70 bg-muted/40 p-4 text-sm">
          {sandbox.starterPrompt.trim()}
        </pre>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            navigator.clipboard.writeText(sandbox.starterPrompt.trim())
          }
        >
          Copy starter prompt
        </Button>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-2xl">Your draft</h2>
        <p className="text-sm text-muted-foreground">
          Paste what you would send a helper, or write the artifact this exercise
          asks for.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {sandbox.constraints.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <textarea
          className="min-h-40 w-full rounded-xl border border-border bg-background p-3 text-sm"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write your answer here…"
        />
        <Button
          type="button"
          disabled={draft.trim().length < 20}
          onClick={() => {
            markSandboxCompared(sandbox.id);
            setCompared(true);
          }}
        >
          Compare to model answer
        </Button>
      </section>

      {compared ? (
        <section className="space-y-3 rounded-2xl border border-border/70 bg-card/40 p-4">
          <h2 className="font-heading text-2xl">Model answer</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {sandbox.modelAnswer.trim()}
          </pre>
          <div>
            <p className="font-medium">Self-check</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {sandbox.rubric.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
