"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { answerCard, createDeck, deckProgress, type Deck } from "@/lib/flashcards/deck";

export type FlashcardTerm = {
  id: string;
  term: string;
  shortDefinition: string;
  longDefinition: string;
};

export function FlashcardDeck({ terms }: { terms: FlashcardTerm[] }) {
  const termsById = useMemo(
    () => Object.fromEntries(terms.map((t) => [t.id, t])),
    [terms],
  );
  const [deck, setDeck] = useState<Deck | null>(null);
  const [flipped, setFlipped] = useState(false);

  // Seed after mount so the server-rendered page stays deterministic.
  useEffect(() => {
    setDeck(createDeck(Object.keys(termsById), String(Date.now())));
  }, [termsById]);

  if (!deck) {
    return <p className="text-sm text-muted-foreground">Shuffling cards…</p>;
  }

  const { learned, total } = deckProgress(deck);
  const currentId = deck.queue[0];
  const current = currentId ? termsById[currentId] : undefined;

  const restart = () => {
    setDeck(createDeck(Object.keys(termsById), String(Date.now())));
    setFlipped(false);
  };

  const answer = (gotIt: boolean) => {
    setDeck((prev) => (prev ? answerCard(prev, gotIt) : prev));
    setFlipped(false);
  };

  if (!current) {
    return (
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/40 p-6 text-center">
        <p className="font-heading text-2xl tracking-tight">
          Deck complete — {total} terms reviewed
        </p>
        <p className="text-sm text-muted-foreground">
          Come back tomorrow for another pass. Spacing beats cramming.
        </p>
        <Button type="button" onClick={restart}>
          Shuffle and go again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {learned} of {total} known · {deck.queue.length} to go
      </p>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-expanded={flipped}
        className="block min-h-56 w-full rounded-2xl border border-border/70 bg-card/50 p-8 text-left transition-colors hover:bg-card"
      >
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {flipped ? "Definition" : "Term — select to reveal"}
        </p>
        {flipped ? (
          <div className="mt-3 space-y-3">
            <p className="font-heading text-2xl tracking-tight">
              {current.term}
            </p>
            <p className="font-medium">{current.shortDefinition}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {current.longDefinition}
            </p>
          </div>
        ) : (
          <p className="mt-3 font-heading text-3xl tracking-tight">
            {current.term}
          </p>
        )}
      </button>
      {flipped ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => answer(true)}>
            Got it
          </Button>
          <Button type="button" variant="outline" onClick={() => answer(false)}>
            Review again later
          </Button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Try to say the definition out loud before you flip.
        </p>
      )}
    </div>
  );
}
