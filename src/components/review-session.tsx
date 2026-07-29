"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";
import type { Quiz } from "@/lib/curriculum/types";
import { sampleReviewQuestions } from "@/lib/quiz/review-sample";
import { shuffleQuestionOptions } from "@/lib/quiz/shuffle-options";
import { cn } from "@/lib/utils";

const REVIEW_SIZE = 10;

export function ReviewSession({
  quizzes,
  moduleTitles,
}: {
  quizzes: Quiz[];
  moduleTitles: Record<string, string>;
}) {
  const { progress, hydrated } = useProgress();
  const [seed, setSeed] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Seed after mount so the server-rendered page stays deterministic.
  useEffect(() => {
    setSeed(String(Date.now()));
  }, []);

  const questions = useMemo(() => {
    if (!seed) return [];
    return sampleReviewQuestions(
      quizzes,
      progress.completedModules,
      REVIEW_SIZE,
      seed,
    ).map((question) => shuffleQuestionOptions(question));
  }, [quizzes, progress.completedModules, seed]);

  if (!hydrated || !seed) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (progress.completedModules.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6">
        <p className="font-heading text-xl tracking-tight">
          Nothing to review yet
        </p>
        <p className="text-sm text-muted-foreground">
          Review questions come from modules you have completed. Finish your
          first module quiz and come back.
        </p>
        <Button asChild>
          <Link href="/modules">Go to modules</Link>
        </Button>
      </div>
    );
  }

  const answeredAll = questions.every((q) => answers[q.id]);
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctOptionId,
  ).length;

  const reshuffle = () => {
    setSeed(String(Date.now()));
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        {questions.length} questions drawn from the{" "}
        {progress.completedModules.length} module
        {progress.completedModules.length === 1 ? "" : "s"} you have completed.
        Nothing here changes your progress — it is just practice.
      </p>
      <ol className="space-y-8">
        {questions.map((question, index) => {
          const chosen = answers[question.id];
          return (
            <li key={question.id} className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {moduleTitles[question.moduleId] ?? question.moduleId}
              </p>
              <p className="font-medium">
                {index + 1}. {question.prompt}
              </p>
              <div className="space-y-2">
                {question.options.map((option) => {
                  const isChosen = chosen === option.id;
                  const isCorrect = option.id === question.correctOptionId;
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-2 rounded-lg border border-border/70 px-3 py-2 text-sm",
                        submitted &&
                          isCorrect &&
                          "border-emerald-700/50 bg-emerald-700/10",
                        submitted &&
                          isChosen &&
                          !isCorrect &&
                          "border-destructive/50 bg-destructive/10",
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        checked={isChosen}
                        disabled={submitted}
                        onChange={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: option.id,
                          }))
                        }
                        className="mt-0.5"
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
              {submitted ? (
                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        {submitted ? (
          <>
            <p className="text-sm font-medium">
              {correctCount} of {questions.length} correct
            </p>
            <Button type="button" onClick={reshuffle}>
              Try another set
            </Button>
          </>
        ) : (
          <Button
            type="button"
            disabled={!answeredAll}
            onClick={() => setSubmitted(true)}
          >
            Check answers
          </Button>
        )}
      </div>
    </div>
  );
}
