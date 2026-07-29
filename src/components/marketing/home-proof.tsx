import Link from "next/link";
import { loadCapstoneGallery } from "@/lib/curriculum/load-gallery";

const FEATURED_IDS = ["sales-call-prep", "ops-status"] as const;

export function HomeProof() {
  const examples = loadCapstoneGallery().filter((ex) =>
    FEATURED_IDS.includes(ex.id as (typeof FEATURED_IDS)[number]),
  );

  return (
    <section className="border-b border-border/70 bg-background/70">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
            What changed after one loop run.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            About 5 hours self-paced, or four workshop sessions of 90–120
            minutes. Same syllabus either way.
          </p>
        </div>
        <ul className="mt-10 grid gap-6 lg:grid-cols-2">
          {examples.map((ex) => (
            <li
              key={ex.id}
              className="border-t border-border/70 pt-6"
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {ex.role}
              </p>
              <h3 className="mt-2 font-heading text-2xl tracking-tight">
                {ex.workflow}
              </h3>
              <p className="mt-4 text-sm leading-7 text-foreground/90">
                <span className="font-medium">Before: </span>
                {ex.before}
              </p>
              <p className="mt-2 text-sm leading-7 text-foreground/90">
                <span className="font-medium">After: </span>
                {ex.after}
              </p>
              <p className="mt-3 text-sm font-medium text-primary">
                {ex.lesson}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm">
          <Link
            href="/gallery"
            className="text-primary underline underline-offset-2"
          >
            See more before/after stories
          </Link>
        </p>
      </div>
    </section>
  );
}
