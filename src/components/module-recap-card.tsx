"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ModuleMeta } from "@/lib/curriculum/types";

/** Shown once a module is complete: what you can now do, and where to go next. */
export function ModuleRecapCard({
  meta,
  next,
}: {
  meta: ModuleMeta;
  next: ModuleMeta | null;
}) {
  return (
    <section
      className="space-y-4 rounded-[var(--ui-r-card)] border border-phosphor/30 bg-phosphor/5 p-5"
      aria-label="Module recap"
    >
      <div>
        <p className="kicker text-phosphor">
          Module {meta.order} complete
        </p>
        <h2 className="mt-1 font-heading text-2xl tracking-tight">
          What you can do now
        </h2>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
        {meta.objectives.map((objective) => (
          <li key={objective}>{objective}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 pt-1">
        {next ? (
          <Button asChild>
            <Link href={`/modules/${next.slug}`}>
              Next: Module {next.order} — {next.title}
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/gallery">Browse the capstone gallery</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/review">Review what you learned</Link>
        </Button>
      </div>
    </section>
  );
}
