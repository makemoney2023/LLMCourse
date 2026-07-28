import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExerciseList } from "@/components/exercise-list";
import type { GlossaryTermView } from "@/components/glossary-prose";
import { GlossaryProse } from "@/components/glossary-prose";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { ModuleCompleteButton } from "@/components/module-complete-button";
import { ModuleNav } from "@/components/module-nav";
import { ModuleQuiz } from "@/components/module-quiz";
import { RoleExampleCallout } from "@/components/role-example-callout";
import { RoleTrackPicker } from "@/components/role-track-picker";
import { WorkedDemo } from "@/components/worked-demo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { loadGlossary } from "@/lib/curriculum/glossary";
import { loadModuleDemo } from "@/lib/curriculum/load-demo";
import {
  getModuleBySlug,
  listModules,
  loadModuleContent,
} from "@/lib/curriculum/load-curriculum";
import { linkGlossaryTerms } from "@/lib/curriculum/link-glossary";
import {
  getTrackOverlay,
  listRoleTracks,
} from "@/lib/curriculum/tracks";
import type { RoleTrackId } from "@/lib/curriculum/types";
import { parseExercises, renderLearnerMarkdown } from "@/lib/markdown";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listModules().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod) return { title: "Module" };
  return { title: mod.title, description: mod.subtitle };
}

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;
  const modules = listModules();
  const content = loadModuleContent(slug);
  if (!content) notFound();

  const { meta } = content;
  const glossary = loadGlossary();
  const termsById = Object.fromEntries(
    glossary.terms.map((t) => [
      t.id,
      {
        id: t.id,
        term: t.term,
        shortDefinition: t.shortDefinition,
        longDefinition: t.longDefinition,
      } satisfies GlossaryTermView,
    ]),
  );
  const lessonMarkdown = content.lessonMarkdown.replace(/^#\s+.+\n+/, "");
  const lessonHtml = renderLearnerMarkdown(lessonMarkdown, glossary.terms);
  const exercises = parseExercises(content.exercisesMarkdown, glossary.terms);
  const quiz = content.quiz
    ? {
        ...content.quiz,
        questions: content.quiz.questions.map((question) => ({
          ...question,
          promptHtml: linkGlossaryTerms(
            `<span>${escapeHtml(question.prompt)}</span>`,
            glossary.terms,
          ),
        })),
      }
    : null;
  const demo = loadModuleDemo(slug);
  const overlaysByTrack = Object.fromEntries(
    listRoleTracks().map((track) => [
      track.id,
      getTrackOverlay(track.id as RoleTrackId, slug),
    ]),
  ) as Partial<Record<RoleTrackId, ReturnType<typeof getTrackOverlay>>>;

  const index = modules.findIndex((m) => m.slug === slug);
  const prev = index > 0 ? modules[index - 1] : null;
  const next = index >= 0 && index < modules.length - 1 ? modules[index + 1] : null;

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6">
      <ModuleNav modules={modules} currentSlug={slug} />
      <article className="min-w-0 flex-1 space-y-10">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Module {meta.order}</Badge>
            <Badge variant="secondary">Workshop {meta.workshopSession}</Badge>
            <span className="text-xs text-muted-foreground">
              {meta.durationMinutes} minutes
            </span>
            <RoleTrackPicker className="ml-auto" />
          </div>
          <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">
            {meta.title}
          </h1>
          <p className="text-lg text-muted-foreground">{meta.subtitle}</p>
          {slug === "deep-research" ? (
            <p className="text-sm">
              Templates:{" "}
              <a className="text-primary underline underline-offset-2" href="/templates/BRIEF.md" download>
                BRIEF.md
              </a>
              {" · "}
              <a className="text-primary underline underline-offset-2" href="/templates/SOURCES.md" download>
                SOURCES.md
              </a>
            </p>
          ) : null}
          {slug === "capstone-lab" ? (
            <p className="text-sm">
              <Link href="/gallery" className="text-primary underline underline-offset-2">
                Browse capstone gallery
              </Link>
            </p>
          ) : null}
        </header>

        <RoleExampleCallout overlaysByTrack={overlaysByTrack} />

        <section aria-labelledby="objectives-heading">
          <h2 id="objectives-heading" className="font-heading text-2xl">
            Learning objectives
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {meta.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="lesson-heading" className="space-y-3">
          <h2 id="lesson-heading" className="sr-only">
            Lesson
          </h2>
          <GlossaryProse html={lessonHtml} termsById={termsById} />
        </section>

        {demo ? <WorkedDemo demo={demo} /> : null}

        <section aria-labelledby="loop-heading" className="space-y-3">
          <h2 id="loop-heading" className="font-heading text-2xl">
            In the loop
          </h2>
          <p className="text-sm text-muted-foreground">{meta.loopPlacement}</p>
          <p className="text-sm">
            <span className="font-medium">If you skip this: </span>
            {meta.skipConsequence}
          </p>
          {content.diagramSource ? (
            <MermaidDiagram chart={content.diagramSource} />
          ) : null}
        </section>

        <Separator />

        <section aria-labelledby="exercises-heading" className="space-y-4">
          <h2 id="exercises-heading" className="font-heading text-2xl">
            Exercises
          </h2>
          <ExerciseList
            moduleId={meta.id}
            exercises={exercises}
            termsById={termsById}
          />
        </section>

        {quiz ? (
          <>
            <Separator />
            <ModuleQuiz quiz={quiz} moduleSlug={slug} />
          </>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <ModuleCompleteButton moduleId={meta.id} />
          <Button asChild variant="outline">
            <Link href={`/workshops/session-0${meta.workshopSession}`}>
              Facilitator notes (Workshop {meta.workshopSession})
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/try/session-0${meta.workshopSession}`}>
              Try-it sandbox
            </Link>
          </Button>
        </div>

        <nav
          className="flex flex-wrap justify-between gap-3 border-t border-border pt-6"
          aria-label="Module pagination"
        >
          {prev ? (
            <Button asChild variant="ghost">
              <Link href={`/modules/${prev.slug}`}>← {prev.title}</Link>
            </Button>
          ) : (
            <span />
          )}
          {next ? (
            <Button asChild variant="ghost">
              <Link href={`/modules/${next.slug}`}>{next.title} →</Link>
            </Button>
          ) : null}
        </nav>
      </article>
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
