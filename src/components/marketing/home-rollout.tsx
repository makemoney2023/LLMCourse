import Link from "next/link";

import { Button } from "@/components/ui/button";

const rolloutSteps = [
  {
    title: "Pilot",
    body: "Start with one team and establish the shared context-loop language.",
  },
  {
    title: "Facilitate",
    body: "Run four focused sessions with the workshop decks and linked practice.",
  },
  {
    title: "Scale",
    body: "Expand with role tracks, templates, sandboxes, and certificates.",
  },
] as const;

export function HomeRollout() {
  return (
    <section
      id="rollout"
      className="scroll-mt-24 border-b border-border/70 bg-primary text-primary-foreground"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
          How teams usually run it.
        </h2>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-xl bg-primary-foreground/20 lg:grid-cols-3">
          {rolloutSteps.map((step, index) => (
            <li
              key={step.title}
              className="bg-primary px-6 py-8 sm:px-8"
            >
              <p className="text-sm font-medium tracking-[0.16em] text-primary-foreground/65 uppercase">
                Step {index + 1}
              </p>
              <h3 className="mt-3 font-heading text-2xl tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 leading-7 text-primary-foreground/75">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/workshops">Workshops</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/modules">Modules</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/resources">Resources</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
