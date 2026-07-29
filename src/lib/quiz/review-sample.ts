import type { Quiz, QuizQuestion } from "@/lib/curriculum/types";
import { seededShuffle } from "./shuffle-options";

export type ReviewQuestion = QuizQuestion & { moduleId: string };

/**
 * Draw up to `count` questions from the quizzes of completed modules,
 * shuffled by `seed` so a "shuffle again" action gives a fresh mix.
 */
export function sampleReviewQuestions(
  quizzes: Quiz[],
  completedModuleIds: string[],
  count: number,
  seed: string,
): ReviewQuestion[] {
  const pool: ReviewQuestion[] = quizzes
    .filter((quiz) => completedModuleIds.includes(quiz.moduleId))
    .flatMap((quiz) =>
      quiz.questions.map((question) => ({
        ...question,
        moduleId: quiz.moduleId,
      })),
    );
  return seededShuffle(pool, seed).slice(0, count);
}
