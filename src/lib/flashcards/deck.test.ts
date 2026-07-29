import { describe, expect, it } from "vitest";
import { answerCard, createDeck, deckProgress } from "./deck";

const ids = ["a", "b", "c", "d"];

describe("createDeck", () => {
  it("contains every card exactly once", () => {
    const deck = createDeck(ids, "seed");
    expect([...deck.queue].sort()).toEqual([...ids].sort());
    expect(deck.learned).toEqual([]);
  });

  it("is deterministic per seed and varies across seeds", () => {
    expect(createDeck(ids, "s1").queue).toEqual(createDeck(ids, "s1").queue);
    const orders = ["s1", "s2", "s3", "s4", "s5"].map((s) =>
      createDeck(ids, s).queue.join(","),
    );
    expect(new Set(orders).size).toBeGreaterThan(1);
  });
});

describe("answerCard", () => {
  it("moves a known card to learned", () => {
    const deck = createDeck(ids, "s");
    const first = deck.queue[0]!;
    const next = answerCard(deck, true);
    expect(next.learned).toContain(first);
    expect(next.queue).not.toContain(first);
    expect(next.queue.length).toBe(3);
  });

  it("re-queues an unknown card at the end", () => {
    const deck = createDeck(ids, "s");
    const first = deck.queue[0]!;
    const next = answerCard(deck, false);
    expect(next.queue[next.queue.length - 1]).toBe(first);
    expect(next.queue.length).toBe(4);
    expect(next.learned).toEqual([]);
  });

  it("finishes after every card is known", () => {
    let deck = createDeck(ids, "s");
    deck = answerCard(deck, false);
    for (let i = 0; i < 5; i++) deck = answerCard(deck, true);
    expect(deck.queue).toEqual([]);
    expect(deck.learned.length).toBe(4);
  });

  it("does nothing on an empty deck", () => {
    let deck = createDeck([], "s");
    deck = answerCard(deck, true);
    expect(deck.queue).toEqual([]);
  });
});

describe("deckProgress", () => {
  it("reports learned count against the total", () => {
    let deck = createDeck(ids, "s");
    deck = answerCard(deck, true);
    expect(deckProgress(deck)).toEqual({ learned: 1, total: 4 });
  });

  it("keeps the total stable when cards are re-queued", () => {
    let deck = createDeck(ids, "s");
    deck = answerCard(deck, false);
    expect(deckProgress(deck)).toEqual({ learned: 0, total: 4 });
  });
});
