"use client";

import { useMemo, useState } from "react";
import { GlossaryProse } from "@/components/glossary-prose";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";
import type { Quiz } from "@/lib/curriculum/types";
import { cn } from "@/lib/utils";

export function ModuleQuiz({ quiz }: { quiz: Quiz }) {
  const { progress, setQuizScore } = useProgress();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!submitted) return null;
    const correct = quiz.questions.filter(
      (q) => answers[q.id] === q.correctOptionId,
    ).length;
    return Math.round((correct / quiz.questions.length) * 100);
  }, [answers, quiz.questions, submitted]);

  const saved = progress.quizScores[quiz.moduleId];

  if (quiz.questions.length === 0) return null;

  return (
    <section aria-labelledby="quiz-heading" className="space-y-4">
      <div>
        <h2 id="quiz-heading" className="font-heading text-2xl tracking-tight">
          Check for understanding
        </h2>
        <p className="text-sm text-muted-foreground">
          {saved != null
            ? `Best score saved: ${saved}%`
            : "Answer all questions, then submit."}
        </p>
      </div>
      <ol className="space-y-5">
        {quiz.questions.map((question, index) => (
          <li
            key={question.id}
            className="rounded-xl border border-border/80 bg-card/40 p-4"
          >
            <div className="mb-3 font-medium">
              <span className="mr-1">{index + 1}.</span>
              {question.promptHtml ? (
                <GlossaryProse
                  html={question.promptHtml}
                  className="inline [&_p]:mb-0 [&_p]:inline"
                />
              ) : (
                question.prompt
              )}
            </div>
            <fieldset className="space-y-2">
              <legend className="sr-only">{question.prompt}</legend>
              {question.options.map((option) => {
                const selected = answers[question.id] === option.id;
                const isCorrect = option.id === question.correctOptionId;
                const showState = submitted && selected;
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                      selected
                        ? "border-foreground/30 bg-secondary"
                        : "border-border hover:bg-muted/50",
                      submitted && isCorrect && "border-emerald-700/50 bg-emerald-700/10",
                      showState &&
                        !isCorrect &&
                        "border-destructive/40 bg-destructive/5",
                    )}
                  >
                    <input
                      type="radio"
                      className="mt-1"
                      name={question.id}
                      value={option.id}
                      checked={selected}
                      disabled={submitted}
                      onChange={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: option.id,
                        }))
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </fieldset>
            {submitted && (
              <p className="mt-3 text-sm text-muted-foreground">
                {question.explanation}
              </p>
            )}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-3">
        {!submitted ? (
          <Button
            type="button"
            disabled={Object.keys(answers).length < quiz.questions.length}
            onClick={() => {
              const correct = quiz.questions.filter(
                (q) => answers[q.id] === q.correctOptionId,
              ).length;
              const nextScore = Math.round(
                (correct / quiz.questions.length) * 100,
              );
              setQuizScore(quiz.moduleId, nextScore);
              setSubmitted(true);
            }}
          >
            Submit quiz
          </Button>
        ) : (
          <>
            <p className="text-sm font-medium">Score: {score}%</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
            >
              Retry
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
