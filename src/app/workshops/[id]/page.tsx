import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkshopDeck } from "@/components/workshop-deck";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getWorkshopDeck,
  listModules,
  listWorkshopSessions,
} from "@/lib/curriculum/load-curriculum";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return listWorkshopSessions().map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const session = getWorkshopDeck(id);
  return { title: session?.title ?? "Workshop" };
}

export default async function WorkshopSessionPage({ params }: Props) {
  const { id } = await params;
  const session = getWorkshopDeck(id);
  if (!session || session.slides.length === 0) notFound();

  const modules = listModules().filter((m) =>
    session.moduleSlugs.includes(m.slug),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge className="mb-2">Workshop {session.order}</Badge>
          <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
            {session.title.replace(/^Workshop Session \d+\s*[—-]\s*/i, "")}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {session.outcome} · {session.durationMinutes} minutes · Facilitator
            slide deck — use arrow keys or Present mode.
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/workshops">← All workshops</Link>
        </Button>
      </div>

      <WorkshopDeck session={session} />

      <section
        className="mt-12 space-y-3 border-t border-border pt-8"
        aria-labelledby="linked-modules"
      >
        <h2 id="linked-modules" className="font-heading text-2xl tracking-tight">
          Linked self-paced modules
        </h2>
        <p className="text-sm text-muted-foreground">
          After class (or during labs), send learners into the full modules —
          exercises, diagrams, and quizzes live here.
        </p>
        <ul className="space-y-2">
          {modules.map((mod) => (
            <li key={mod.id}>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/modules/${mod.slug}`}>
                  Module {mod.order}: {mod.title}
                  <span className="ml-2 text-muted-foreground">
                    · {mod.durationMinutes} min
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
