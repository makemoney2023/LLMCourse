"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ContinueCourseButton } from "@/components/continue-course-button";
import { ExerciseList } from "@/components/exercise-list";
import type { GlossaryTermView } from "@/components/glossary-prose";
import { GlossaryProse } from "@/components/glossary-prose";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { ModuleCompleteStatus } from "@/components/module-complete-button";
import { ModuleQuiz } from "@/components/module-quiz";
import { ModuleStepper, type StepperItem } from "@/components/module-stepper";
import { WorkedDemo } from "@/components/worked-demo";
import { useProgress } from "@/components/progress-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ModuleDemo } from "@/lib/curriculum/load-demo";
import type { ModuleMeta, Quiz } from "@/lib/curriculum/types";
import type { ParsedExercise } from "@/lib/markdown";
import {
  isModuleUnlocked,
  isPracticeUnlocked,
  isQuizUnlocked,
  isStepUnlocked,
  PRACTICE_STEP_ID,
  QUIZ_STEP_ID,
  unlockReason,
} from "@/lib/progress/access";

export type StepChunkView = {
  stepId: string;
  title: string;
  html: string;
};

export function ModuleLearnerFlow({
  modules,
  meta,
  stepChunks,
  demo,
  loopPlacement,
  skipConsequence,
  diagramSource,
  exercises,
  quiz,
  termsById,
  exerciseIdsByModule,
  prev,
  next,
}: {
  modules: ModuleMeta[];
  meta: ModuleMeta;
  stepChunks: StepChunkView[];
  demo: ModuleDemo | null;
  loopPlacement: string;
  skipConsequence: string;
  diagramSource: string;
  exercises: ParsedExercise[];
  quiz: Quiz | null;
  termsById: Record<string, GlossaryTermView>;
  exerciseIdsByModule: Record<string, string[]>;
  prev: ModuleMeta | null;
  next: ModuleMeta | null;
}) {
  const { progress, completeStep } = useProgress();
  const exerciseIds = exercises.map((e) => e.id);
  const moduleUnlocked = isModuleUnlocked(progress, modules, meta.id);
  const practiceUnlocked = isPracticeUnlocked(progress, meta);
  const quizUnlocked = isQuizUnlocked(progress, meta, exerciseIds);
  const doneSteps = progress.completedSteps[meta.id] ?? [];
  const exercisesDone = progress.completedExercises[meta.id] ?? [];
  const practiceDone =
    practiceUnlocked &&
    exerciseIds.every((id) => exercisesDone.includes(id));
  const moduleDone = progress.completedModules.includes(meta.id);

  const [focusStep, setFocusStep] = useState<string | null>(null);

  const defaultFocus = useMemo(() => {
    for (const step of meta.steps) {
      if (!doneSteps.includes(step.id)) return step.id;
    }
    if (!practiceDone) return PRACTICE_STEP_ID;
    if (!moduleDone) return QUIZ_STEP_ID;
    return meta.steps[0]?.id ?? PRACTICE_STEP_ID;
  }, [meta.steps, doneSteps, practiceDone, moduleDone]);

  useEffect(() => {
    if (!moduleUnlocked) return;
    setFocusStep((prev) => prev ?? defaultFocus);
  }, [moduleUnlocked, defaultFocus]);

  const stepperItems: StepperItem[] = meta.steps.map((step) => {
    const done = doneSteps.includes(step.id);
    const unlocked = isStepUnlocked(progress, meta, step.id);
    if (!unlocked) return { id: step.id, title: step.title, status: "locked" };
    if (done) return { id: step.id, title: step.title, status: "done" };
    return {
      id: step.id,
      title: step.title,
      status: focusStep === step.id ? "current" : "current",
    };
  });

  stepperItems.push({
    id: PRACTICE_STEP_ID,
    title: "Practice",
    status: !practiceUnlocked
      ? "locked"
      : practiceDone
        ? "done"
        : "current",
  });
  stepperItems.push({
    id: QUIZ_STEP_ID,
    title: "Quiz",
    status: !quizUnlocked
      ? "locked"
      : moduleDone || progress.quizScores[meta.id] != null
        ? "done"
        : "current",
  });

  const normalizedStepper = normalizeCurrent(
    stepperItems,
    focusStep ?? defaultFocus,
  );

  if (!moduleUnlocked) {
    const reason = unlockReason(progress, modules, meta.id);
    return (
      <div className="space-y-6 rounded-2xl border border-border/70 bg-card/40 p-6">
        <p className="font-heading text-xl">This module is locked</p>
        <p className="text-sm text-muted-foreground">
          {reason ?? "Finish the previous module first."}
        </p>
        <ContinueCourseButton
          modules={modules}
          exerciseIdsByModule={exerciseIdsByModule}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <ModuleStepper
        items={normalizedStepper}
        onSelect={(id) => {
          if (id === PRACTICE_STEP_ID && practiceUnlocked) setFocusStep(id);
          else if (id === QUIZ_STEP_ID && quizUnlocked) setFocusStep(id);
          else if (isStepUnlocked(progress, meta, id)) setFocusStep(id);
          const el = document.getElementById(`step-${id}`);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      <div className="flex flex-wrap gap-2">
        <ContinueCourseButton
          modules={modules}
          exerciseIdsByModule={exerciseIdsByModule}
          label="Continue"
        />
      </div>

      {stepChunks.map((chunk) => {
        const unlocked = isStepUnlocked(progress, meta, chunk.stepId);
        const done = doneSteps.includes(chunk.stepId);
        if (!unlocked) {
          return (
            <section
              key={chunk.stepId}
              id={`step-${chunk.stepId}`}
              className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-5"
            >
              <h2 className="font-heading text-2xl tracking-tight">
                {chunk.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete the previous step to unlock this section.
              </p>
            </section>
          );
        }
        return (
          <section
            key={chunk.stepId}
            id={`step-${chunk.stepId}`}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-heading text-2xl tracking-tight">
                {chunk.title}
              </h2>
              {done ? (
                <span className="text-xs font-medium text-emerald-800">
                  Step done
                </span>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    completeStep(meta.id, chunk.stepId);
                    const ids = meta.steps.map((s) => s.id);
                    const idx = ids.indexOf(chunk.stepId);
                    const nextId = ids[idx + 1];
                    setFocusStep(nextId ?? PRACTICE_STEP_ID);
                  }}
                >
                  Mark step done
                </Button>
              )}
            </div>
            <GlossaryProse html={chunk.html} termsById={termsById} />
            {chunk.stepId === "ideas" && demo ? (
              <WorkedDemo demo={demo} />
            ) : null}
            {chunk.stepId === "apply" ? (
              <div className="space-y-3 rounded-2xl border border-border/60 bg-card/30 p-4">
                <h3 className="font-heading text-xl">In the loop</h3>
                <p className="text-sm text-muted-foreground">{loopPlacement}</p>
                <p className="text-sm">
                  <span className="font-medium">If you skip this: </span>
                  {skipConsequence}
                </p>
                {diagramSource ? (
                  <MermaidDiagram chart={diagramSource} />
                ) : null}
              </div>
            ) : null}
          </section>
        );
      })}

      <Separator />

      <section
        id={`step-${PRACTICE_STEP_ID}`}
        aria-labelledby="exercises-heading"
        className="space-y-4"
      >
        <h2 id="exercises-heading" className="font-heading text-2xl">
          Practice
        </h2>
        {!practiceUnlocked ? (
          <p className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-5 text-sm text-muted-foreground">
            Finish Get oriented, Big ideas, and Put it to work to unlock
            exercises.
          </p>
        ) : (
          <ExerciseList
            moduleId={meta.id}
            exercises={exercises}
            termsById={termsById}
          />
        )}
      </section>

      {quiz ? (
        <>
          <Separator />
          <div id={`step-${QUIZ_STEP_ID}`}>
            {quizUnlocked ? (
              <ModuleQuiz quiz={quiz} moduleSlug={meta.slug} />
            ) : (
              <section className="space-y-3 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-5">
                <h2 className="font-heading text-2xl tracking-tight">
                  Check for understanding
                </h2>
                <p className="text-sm text-muted-foreground">
                  Mark every practice exercise done to unlock the quiz.
                </p>
              </section>
            )}
          </div>
        </>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <ModuleCompleteStatus moduleId={meta.id} />
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
          isModuleUnlocked(progress, modules, next.id) ? (
            <Button asChild variant="ghost">
              <Link href={`/modules/${next.slug}`}>{next.title} →</Link>
            </Button>
          ) : (
            <Button type="button" variant="ghost" disabled>
              {next.title} → (locked)
            </Button>
          )
        ) : null}
      </nav>
    </div>
  );
}

function normalizeCurrent(
  items: StepperItem[],
  focusStep: string,
): StepperItem[] {
  const focus =
    items.some((i) => i.id === focusStep && i.status !== "locked")
      ? focusStep
      : (items.find((i) => i.status !== "locked" && i.status !== "done")?.id ??
        focusStep);

  return items.map((item) => {
    if (item.status === "locked") return item;
    if (item.id === focus) return { ...item, status: "current" };
    if (item.status === "done") return item;
    return { ...item, status: "available" };
  });
}
