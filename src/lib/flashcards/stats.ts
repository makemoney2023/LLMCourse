import { seededShuffle } from "@/lib/quiz/shuffle-options";

/** Lifetime per-card record, persisted across sessions. */
export type CardStats = Record<string, { misses: number; streak: number }>;

export function recordAnswer(
  stats: CardStats,
  cardId: string,
  gotIt: boolean,
): CardStats {
  const prev = stats[cardId] ?? { misses: 0, streak: 0 };
  return {
    ...stats,
    [cardId]: gotIt
      ? { misses: prev.misses, streak: prev.streak + 1 }
      : { misses: prev.misses + 1, streak: 0 },
  };
}

/**
 * Leitner-lite ordering: cards the learner has missed and not yet recovered
 * come first, unseen cards next, cards with a running streak last.
 */
export function orderByPriority(
  cardIds: string[],
  stats: CardStats,
  seed: string,
): string[] {
  const struggling: string[] = [];
  const unseen: string[] = [];
  const solid: string[] = [];
  for (const id of cardIds) {
    const record = stats[id];
    if (!record) unseen.push(id);
    else if (record.misses > 0 && record.streak < 2) struggling.push(id);
    else solid.push(id);
  }
  return [
    ...seededShuffle(struggling, `${seed}-struggling`),
    ...seededShuffle(unseen, `${seed}-unseen`),
    ...seededShuffle(solid, `${seed}-solid`),
  ];
}
