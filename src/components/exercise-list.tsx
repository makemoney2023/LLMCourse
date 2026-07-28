"use client";

import {
  GlossaryProse,
  type GlossaryTermView,
} from "@/components/glossary-prose";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useProgress } from "@/components/progress-provider";
import type { ParsedExercise } from "@/lib/markdown";

export function ExerciseList({
  moduleId,
  exercises,
  termsById = {},
}: {
  moduleId: string;
  exercises: ParsedExercise[];
  termsById?: Record<string, GlossaryTermView>;
}) {
  const { progress, completeExercise, revealExerciseAnswer } = useProgress();
  const completed = progress.completedExercises[moduleId] ?? [];
  const revealed = progress.revealedAnswers[moduleId] ?? [];

  if (exercises.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Exercises will appear here once authored.
      </p>
    );
  }

  return (
    <ol className="space-y-6">
      {exercises.map((exercise, index) => {
        const isDone = completed.includes(exercise.id);
        const isRevealed = revealed.includes(exercise.id);
        return (
          <li
            key={exercise.id}
            className="rounded-xl border border-border/80 bg-card/50 p-4 sm:p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="font-heading text-lg tracking-tight">
                <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                {exercise.title}
              </h3>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`${moduleId}-${exercise.id}`}
                  checked={isDone}
                  onCheckedChange={(checked) => {
                    if (checked) completeExercise(moduleId, exercise.id);
                  }}
                  aria-label={`Mark ${exercise.title} complete`}
                />
                <Label
                  htmlFor={`${moduleId}-${exercise.id}`}
                  className="text-xs text-muted-foreground"
                >
                  Done
                </Label>
              </div>
            </div>
            <GlossaryProse
              html={exercise.bodyHtml}
              className="text-sm"
              termsById={termsById}
            />
            <div className="mt-4">
              {isRevealed ? (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Answer key
                  </p>
                  <GlossaryProse
                    html={exercise.answerHtml}
                    className="text-sm"
                    termsById={termsById}
                  />
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => revealExerciseAnswer(moduleId, exercise.id)}
                >
                  Reveal answer key
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
