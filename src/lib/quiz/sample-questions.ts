import { seededShuffle } from "@/lib/quiz/shuffle-options";

/** Questions shown per quiz attempt when the bank is larger. */
export const QUIZ_SAMPLE_SIZE = 5;

/**
 * Pick `count` questions from the bank, deterministic per seed, keeping the
 * authored order so the quiz still reads coherently.
 */
export function sampleQuizQuestions<T>(
  questions: readonly T[],
  count: number,
  seed: string,
): T[] {
  if (questions.length <= count) return [...questions];
  const indices = questions.map((_, index) => index);
  const picked = new Set(seededShuffle(indices, seed).slice(0, count));
  return questions.filter((_, index) => picked.has(index));
}
