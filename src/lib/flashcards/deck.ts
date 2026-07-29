import { seededShuffle } from "@/lib/quiz/shuffle-options";

export type Deck = {
  /** Card ids still to answer; the head is the current card. */
  queue: string[];
  /** Card ids answered "got it". */
  learned: string[];
};

export function createDeck(cardIds: string[], seed: string): Deck {
  return { queue: seededShuffle(cardIds, seed), learned: [] };
}

/** Answer the current (head) card. Unknown cards return to the end of the queue. */
export function answerCard(deck: Deck, gotIt: boolean): Deck {
  const [current, ...rest] = deck.queue;
  if (current == null) return deck;
  if (gotIt) {
    return { queue: rest, learned: [...deck.learned, current] };
  }
  return { queue: [...rest, current], learned: deck.learned };
}

export function deckProgress(deck: Deck): { learned: number; total: number } {
  const total = deck.learned.length + new Set(deck.queue).size;
  return { learned: deck.learned.length, total };
}
