import Link from "next/link";
import type { Metadata } from "next";
import { loadCapstoneGallery } from "@/lib/curriculum/load-gallery";

export const metadata: Metadata = {
  title: "Capstone gallery",
  description: "Anonymized before/after runs from the LLM Leverage course.",
};

export default function GalleryPage() {
  const examples = loadCapstoneGallery();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">Capstone gallery</h1>
      <p className="mt-2 text-muted-foreground">
        Anonymized before/after stories. Use them to scope your Module 12 run.
      </p>
      <ul className="mt-8 space-y-4">
        {examples.map((ex) => (
          <li
            key={ex.id}
            id={ex.id}
            className="scroll-mt-28 rounded-2xl border border-border/70 bg-card/40 p-5"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {ex.role}
            </p>
            <h2 className="font-heading text-2xl tracking-tight">
              {ex.workflow}
            </h2>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <p>
                <span className="font-medium">Before: </span>
                {ex.before}
              </p>
              <p>
                <span className="font-medium">After: </span>
                {ex.after}
              </p>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {ex.configured.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-medium">Lesson: {ex.lesson}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm">
        <Link
          href="/modules/capstone-lab"
          className="text-primary underline underline-offset-2"
        >
          Go to Module 12 capstone
        </Link>
      </p>
    </div>
  );
}
