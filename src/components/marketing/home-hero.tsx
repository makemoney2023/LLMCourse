import Link from "next/link";

import { Button } from "@/components/ui/button";

const HERO_SUBHEAD =
  "A 12-module course that gives managers one shared standard for quality, accuracy, and workflow—across ChatGPT, Claude, Cursor, and whatever tool comes next.";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden border-b border-border/70">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_18%,color-mix(in_oklab,var(--accent)_75%,transparent),transparent_36%),radial-gradient(circle_at_82%_28%,color-mix(in_oklab,var(--secondary)_90%,transparent),transparent_40%),linear-gradient(145deg,var(--background),color-mix(in_oklab,var(--background)_72%,var(--primary)_8%))]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 top-1/3 -z-10 h-96 w-96 rounded-full border border-primary/15 shadow-[0_0_0_4rem_color-mix(in_oklab,var(--primary)_3%,transparent),0_0_0_8rem_color-mix(in_oklab,var(--primary)_2%,transparent)]"
      />
      <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl items-center px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-700">
          <p className="font-heading text-6xl leading-none tracking-[-0.045em] text-primary sm:text-7xl lg:text-8xl">
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
