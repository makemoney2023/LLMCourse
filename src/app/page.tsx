import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CheckpointBanner } from "@/components/checkpoint-banner";
import { ContinueCourseButton } from "@/components/continue-course-button";
import { LoopMap } from "@/components/loop-map";
import { ModuleList } from "@/components/module-list";
import { Button } from "@/components/ui/button";
import {
  listModuleExerciseIds,
  listModules,
  listWorkshopSessions,
} from "@/lib/curriculum/load-curriculum";

export default function HomePage() {
  const modules = listModules();
  const workshops = listWorkshopSessions();
  const exerciseIdsByModule = listModuleExerciseIds();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="relative min-h-[70vh] overflow-hidden rounded-3xl border border-border/60 bg-card/40 px-6 py-14 sm:px-12 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, oklch(0.75 0.08 200 / 0.25), transparent 45%), radial-gradient(circle at 80% 20%, oklch(0.8 0.06 240 / 0.2), transparent 40%)",
          }}
        />
        <div className="relative max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-700">
          <p className="font-heading text-4xl tracking-tight text-foreground sm:text-6xl">
            LLM Leverage
          </p>
          <h1 className="mt-4 text-xl font-medium text-foreground/90 sm:text-2xl">
            Better AI answers from a clear loop—not longer prompts.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            A plain-language course for many teams. Learn how wall rules, tools,
            lookups, memory, and checks work together in ChatGPT, Claude, Cursor,
            and similar helpers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/modules/mental-model">
                Start Module 1
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <ContinueCourseButton
              modules={modules}
              exerciseIdsByModule={exerciseIdsByModule}
              label="Continue"
            />
            <Button asChild variant="outline" size="lg">
              <Link href="/workshops">Workshop series</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/resources">Resources</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/glossary">Glossary</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-label="Progress checkpoints">
        <CheckpointBanner />
      </section>

      <section className="mt-16 space-y-4" aria-labelledby="loop-heading">
        <div className="max-w-2xl">
          <h2 id="loop-heading" className="font-heading text-3xl tracking-tight">
            The context loop
          </h2>
          <p className="mt-2 text-muted-foreground">
            Every module fits this cycle. Your goal and wall rules fill the desk.
            The helper may open apps. Results come back. You check the work. Then
            the next ask gets sharper.
          </p>
        </div>
        <LoopMap />
      </section>

      <section className="mt-16" aria-labelledby="modules-heading">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2
              id="modules-heading"
              className="font-heading text-3xl tracking-tight"
            >
              Modules
            </h2>
            <p className="mt-1 text-muted-foreground">
              {modules.length} self-paced lessons. Steps unlock in order; the
              next module opens after you finish the quiz.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/modules">View all</Link>
          </Button>
        </div>
        <ModuleList modules={modules} variant="grid" />
      </section>

      <section className="mt-16 mb-8" aria-labelledby="workshops-heading">
        <h2
          id="workshops-heading"
          className="font-heading text-3xl tracking-tight"
        >
          In-class workshops
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Four live class decks. Each one links to the same self-paced modules.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {workshops.map((session) => (
            <li key={session.id}>
              <Link
                href={`/workshops/${session.id}`}
                className="block rounded-2xl border border-border/70 bg-card/50 p-4 transition-colors hover:bg-card"
              >
                <p className="font-heading text-lg tracking-tight">
                  {session.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Modules: {session.moduleSlugs.join(", ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
