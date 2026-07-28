import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { GlossaryTermView } from "@/components/glossary-prose";
import { ModuleLearnerFlow } from "@/components/module-learner-flow";
import { ModuleNav } from "@/components/module-nav";
import { RoleExampleCallout } from "@/components/role-example-callout";
import { RoleTrackPicker } from "@/components/role-track-picker";
import { Badge } from "@/components/ui/badge";
import { loadGlossary } from "@/lib/curriculum/glossary";
import { loadModuleDemo } from "@/lib/curriculum/load-demo";
import {
  getModuleBySlug,
  listModuleExerciseIds,
  listModules,
  loadModuleContent,
} from "@/lib/curriculum/load-curriculum";
import { linkGlossaryTerms } from "@/lib/curriculum/link-glossary";
import { splitLessonIntoSteps } from "@/lib/curriculum/split-lesson-steps";
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
  const stepChunks = splitLessonIntoSteps(lessonMarkdown, meta.steps).map(
    (chunk) => ({
      stepId: chunk.stepId,
      title: chunk.title,
      html: renderLearnerMarkdown(chunk.markdown, glossary.terms),
    }),
  );
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
  const prev = index > 0 ? modules[index - 1]! : null;
  const next =
    index >= 0 && index < modules.length - 1 ? modules[index + 1]! : null;
  const exerciseIdsByModule = listModuleExerciseIds();

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6">
      <ModuleNav
        modules={modules}
        currentSlug={slug}
        exerciseIdsByModule={exerciseIdsByModule}
      />
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
              <a
                className="text-primary underline underline-offset-2"
                href="/templates/BRIEF.md"
                download
              >
                BRIEF.md
              </a>
              {" · "}
              <a
                className="text-primary underline underline-offset-2"
                href="/templates/SOURCES.md"
                download
              >
                SOURCES.md
              </a>
            </p>
          ) : null}
          {slug === "capstone-lab" ? (
            <p className="text-sm">
              Templates:{" "}
              <a
                className="text-primary underline underline-offset-2"
                href="/templates/BRIEF.md"
                download
              >
                BRIEF.md
              </a>
              {" · "}
              <a
                className="text-primary underline underline-offset-2"
                href="/templates/SOURCES.md"
                download
              >
                SOURCES.md
              </a>
              {" · "}
              <a
                className="text-primary underline underline-offset-2"
                href="/templates/HANDOFF.md"
                download
              >
                HANDOFF.md
              </a>
              {" · "}
              <Link
                href="/gallery"
                className="text-primary underline underline-offset-2"
              >
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

        <ModuleLearnerFlow
          modules={modules}
          meta={meta}
          stepChunks={stepChunks}
          demo={demo}
          loopPlacement={meta.loopPlacement}
          skipConsequence={meta.skipConsequence}
          diagramSource={content.diagramSource}
          exercises={exercises}
          quiz={quiz}
          termsById={termsById}
          exerciseIdsByModule={exerciseIdsByModule}
          prev={prev}
          next={next}
        />
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
