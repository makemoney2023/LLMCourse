import Link from "next/link";

import { Button } from "@/components/ui/button";

const HERO_SUBHEAD =
  "A 12-module course that gives managers one shared standard for quality, accuracy, and workflow—across ChatGPT, Claude, Cursor, and whatever tool comes next.";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden border-b border-border/70">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_20%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_42%),radial-gradient(circle_at_84%_12%,color-mix(in_oklab,var(--optic)_14%,transparent),transparent_36%)]"
      />
      <div aria-hidden="true" className="brand-grid absolute inset-0 -z-10" />
      <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl items-center px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-700">
          <p className="kicker text-primary">The context loop</p>
          <p className="mt-4 font-heading text-6xl leading-none text-foreground sm:text-7xl lg:text-8xl">
            LLM Leverage
          </p>
          <h1 className="mt-8 max-w-3xl font-heading text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Train teams to get reliable AI output—not longer prompts.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {HERO_SUBHEAD}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/modules/mental-model">Preview the course</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#rollout">Plan a team rollout</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
