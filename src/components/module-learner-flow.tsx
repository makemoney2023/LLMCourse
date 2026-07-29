"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ContinueCourseButton } from "@/components/continue-course-button";
import { ExerciseList } from "@/components/exercise-list";
import { ModuleRecapCard } from "@/components/module-recap-card";
import type { GlossaryTermView } from "@/components/glossary-prose";
import { GlossaryProse } from "@/components/glossary-prose";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { ModuleCompleteStatus } from "@/components/module-complete-button";
import { ModuleQuiz } from "@/components/module-quiz";
import { ModuleStepper, type StepperItem } from "@/components/module-stepper";
import { StepFeedbackLink } from "@/components/step-feedback-link";
import { WorkedDemo } from "@/components/worked-demo";
import { useProgress } from "@/components/progress-provider";
import { Button } from "@/components/ui/button";
import type { ModuleDemo } from "@/lib/curriculum/load-demo";
import type { ModuleMeta, Quiz } from "@/lib/curriculum/types";
import type { ParsedExercise } from "@/lib/markdown";
import {
  isPracticeUnlocked,
  isQuizUnlocked,
  isStepUnlocked,
  PRACTICE_STEP_ID,
  QUIZ_STEP_ID,
  unlockReason,
} from "@/lib/progress/access";
import { parseStepHash } from "@/lib/progress/step-hash";

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
  sandboxId,
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
  sandboxId: string;
}) {
  const { progress, hydrated, completeStep } = useProgress();
  const exerciseIds = exercises.map((e) => e.id);
  const practiceUnlocked = isPracticeUnlocked(progress, meta);
  const quizUnlocked = isQuizUnlocked(progress, meta, exerciseIds);
  const doneSteps = progress.completedSteps[meta.id] ?? [];
  const exercisesDone = progress.completedExercises[meta.id] ?? [];
  const practiceDone =
    practiceUnlocked &&
    exerciseIds.every((id) => exercisesDone.includes(id));
  const moduleDone = progress.completedModules.includes(meta.id);
  const jumpAheadReason = unlockReason(progress, modules, meta.id);

  const [focusStep, setFocusStep] = useState<string | null>(null);
  const appliedHashRef = useRef(false);

  const defaultFocus = useMemo(() => {
    for (const step of meta.steps) {
      if (!doneSteps.includes(step.id)) return step.id;
    }
    if (!practiceDone) return PRACTICE_STEP_ID;
    if (!moduleDone) return QUIZ_STEP_ID;
    return QUIZ_STEP_ID;
  }, [meta.steps, doneSteps, practiceDone, moduleDone]);

  const canFocusStep = (stepId: string) => {
    if (stepId === PRACTICE_STEP_ID) return practiceUnlocked;
    if (stepId === QUIZ_STEP_ID) return quizUnlocked;
    return isStepUnlocked(progress, meta, stepId);
  };
  // Ref keeps the focus effect below from re-running on every progress change,
  // which would stomp a manually selected step.
  const canFocusStepRef = useRef(canFocusStep);
  canFocusStepRef.current = canFocusStep;

  // Wait for stored progress, then honor a Continue deep-link once;
  // afterwards follow progress as steps get completed.
  useEffect(() => {
    if (!hydrated) return;
    if (!appliedHashRef.current) {
      appliedHashRef.current = true;
      const fromHash = parseStepHash(window.location.hash);
      if (fromHash && canFocusStepRef.current(fromHash)) {
        setFocusStep(fromHash);
        return;
      }
    }
    setFocusStep(defaultFocus);
  }, [hydrated, defaultFocus]);

  const activeStep = focusStep ?? defaultFocus;

  const stepperItems: StepperItem[] = meta.steps.map((step) => {
    const done = doneSteps.includes(step.id);
    const unlocked = isStepUnlocked(progress, meta, step.id);
    if (!unlocked) return { id: step.id, title: step.title, status: "locked" };
    if (done && step.id !== activeStep)
      return { id: step.id, title: step.title, status: "done" };
    if (step.id === activeStep)
      return { id: step.id, title: step.title, status: "current" };
    return { id: step.id, title: step.title, status: "available" };
  });

  stepperItems.push({
    id: PRACTICE_STEP_ID,
    title: "Practice",
    status: !practiceUnlocked
      ? "locked"
      : practiceDone && activeStep !== PRACTICE_STEP_ID
        ? "done"
        : activeStep === PRACTICE_STEP_ID
          ? "current"
          : "available",
  });
  stepperItems.push({
    id: QUIZ_STEP_ID,
    title: "Quiz",
    status: !quizUnlocked
      ? "locked"
      : moduleDone || progress.quizScores[meta.id] != null
        ? activeStep === QUIZ_STEP_ID
          ? "current"
          : "done"
        : activeStep === QUIZ_STEP_ID
          ? "current"
          : "available",
  });

  const activeChunk = stepChunks.find((c) => c.stepId === activeStep);
  const isLessonStep = Boolean(activeChunk);
  const lessonDone = activeChunk
    ? doneSteps.includes(activeChunk.stepId)
    : false;
  const activeStepTitle =
    activeChunk?.title ??
    (activeStep === PRACTICE_STEP_ID ? "Practice" : "Quiz");

  function goNextFromLesson(stepId: string) {
    completeStep(meta.id, stepId);
    const ids = meta.steps.map((s) => s.id);
    const idx = ids.indexOf(stepId);
    setFocusStep(ids[idx + 1] ?? PRACTICE_STEP_ID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-4">
      {/* Announce step changes to screen readers; the visual swap is silent otherwise. */}
      <div role="status" aria-live="polite" className="sr-only">
        Now on: {activeStepTitle}
      </div>
      {jumpAheadReason ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3">
          <div>
            <p className="font-heading text-base tracking-tight">
              Jumping ahead
            </p>
            <p className="text-sm text-muted-foreground">{jumpAheadReason}</p>
          </div>
          <ContinueCourseButton
            modules={modules}
            exerciseIdsByModule={exerciseIdsByModule}
            label="Back to recommended path"
          />
        </div>
      ) : null}

      <ModuleStepper
        items={stepperItems}
        onSelect={(id) => {
          if (id === PRACTICE_STEP_ID && practiceUnlocked) setFocusStep(id);
          else if (id === QUIZ_STEP_ID && quizUnlocked) setFocusStep(id);
          else if (isStepUnlocked(progress, meta, id)) setFocusStep(id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <div className="flex-1 space-y-6 pb-36">
        {isLessonStep && activeChunk ? (
          <section
            id={`step-${activeChunk.stepId}`}
            className="space-y-5"
            aria-labelledby={`step-title-${activeChunk.stepId}`}
          >
            <h2
              id={`step-title-${activeChunk.stepId}`}
              className="font-heading text-3xl tracking-tight"
            >
              {activeChunk.title}
            </h2>
            <GlossaryProse html={activeChunk.html} termsById={termsById} />
            {activeChunk.stepId === "ideas" && demo ? (
              <WorkedDemo demo={demo} />
            ) : null}
            {activeChunk.stepId === "apply" ? (
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
        ) : null}

        {activeStep === PRACTICE_STEP_ID ? (
          <section
            id={`step-${PRACTICE_STEP_ID}`}
            aria-labelledby="exercises-heading"
            className="space-y-4"
          >
            <h2
              id="exercises-heading"
              className="font-heading text-3xl tracking-tight"
            >
              Practice
            </h2>
            <p className="text-sm text-muted-foreground">
              Mark each exercise Done. Then continue to the quiz.
            </p>
            <ExerciseList
              moduleId={meta.id}
              exercises={exercises}
              termsById={termsById}
            />
          </section>
        ) : null}

        {activeStep === QUIZ_STEP_ID ? (
          <div id={`step-${QUIZ_STEP_ID}`} className="space-y-6">
            {moduleDone ? <ModuleRecapCard meta={meta} next={next} /> : null}
            {quizUnlocked && quiz ? (
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
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ModuleCompleteStatus moduleId={meta.id} />
              <Button asChild variant="outline">
                <Link href={`/workshops/session-0${meta.workshopSession}`}>
                  Facilitator notes (Workshop {meta.workshopSession})
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={`/try/${sandboxId}`}>Try-it sandbox</Link>
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
          </div>
        ) : null}

        <StepFeedbackLink
          context={`Module ${meta.order}: ${meta.title}`}
          step={activeStepTitle}
        />
      </div>

      {/* Sticky primary action — always findable */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 lg:pl-64">
          <p className="text-sm text-muted-foreground">
            {isLessonStep
              ? lessonDone
                ? "Step complete"
                : "Read this section, then mark it done to continue."
              : activeStep === PRACTICE_STEP_ID
                ? practiceDone
                  ? "Practice complete — continue to the quiz."
                  : "Check Done on every exercise below."
                : moduleDone
                  ? "Module complete"
                  : "Score 75% or higher on the quiz to finish this module."}
          </p>
          <div className="flex flex-wrap gap-2">
            {isLessonStep && activeChunk && !lessonDone ? (
              <Button
                type="button"
                size="lg"
                className="min-w-[12rem]"
                onClick={() => goNextFromLesson(activeChunk.stepId)}
              >
                Mark step done
              </Button>
            ) : null}
            {isLessonStep && activeChunk && lessonDone ? (
              <Button
                type="button"
                size="lg"
                className="min-w-[12rem]"
                onClick={() => {
                  const ids = meta.steps.map((s) => s.id);
                  const idx = ids.indexOf(activeChunk.stepId);
                  setFocusStep(ids[idx + 1] ?? PRACTICE_STEP_ID);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Next step
              </Button>
            ) : null}
            {activeStep === PRACTICE_STEP_ID ? (
              <Button
                type="button"
                size="lg"
                className="min-w-[12rem]"
                disabled={!practiceDone || !quizUnlocked}
                onClick={() => {
                  setFocusStep(QUIZ_STEP_ID);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Continue to quiz
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
