export type QuizOptionLike = { id: string; label: string };

export type QuizQuestionLike = {
  id: string;
  prompt: string;
  options: QuizOptionLike[];
  correctOptionId: string;
  explanation: string;
  promptHtml?: string;
  remediation?: {
    lessonHeading?: string;
    glossaryIds?: string[];
    moduleSlug?: string;
  };
};

/** Deterministic 32-bit hash for seeded shuffles (hydration-safe). */
function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates with a mulberry32 PRNG so the same seed always yields the same order. */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const result = [...items];
  const rand = mulberry32(hashSeed(seed) || 1);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = result[i]!;
    result[i] = result[j]!;
    result[j] = tmp;
  }
  return result;
}

export function shuffleQuestionOptions<T extends QuizQuestionLike>(
  question: T,
): T {
  return {
    ...question,
    options: seededShuffle(question.options, question.id),
  };
}
