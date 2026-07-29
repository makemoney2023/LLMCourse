"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";
import { answerCard, deckProgress, type Deck } from "@/lib/flashcards/deck";
import {
  orderByPriority,
  recordAnswer,
  type CardStats,
} from "@/lib/flashcards/stats";

const STATS_STORAGE_KEY = "llm-course-flashcard-stats";

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
  const [stats, setStats, statsLoaded] = useLocalStorageState<CardStats>(
    STATS_STORAGE_KEY,
    {},
  );
  const [deck, setDeck] = useState<Deck | null>(null);
  const [flipped, setFlipped] = useState(false);
  // Order the deck once per session; answering updates stats but must not
  // reshuffle the cards mid-run.
  const dealtRef = useRef(false);
  const statsRef = useRef(stats);
  statsRef.current = stats;

  useEffect(() => {
    if (!statsLoaded || dealtRef.current) return;
    dealtRef.current = true;
    setDeck({
      queue: orderByPriority(
        Object.keys(termsById),
        statsRef.current,
        String(Date.now()),
      ),
      learned: [],
    });
  }, [statsLoaded, termsById]);

  if (!deck) {
    return <p className="text-sm text-muted-foreground">Shuffling cards…</p>;
  }

  const { learned, total } = deckProgress(deck);
  const currentId = deck.queue[0];
  const current = currentId ? termsById[currentId] : undefined;
  const strugglingCount = Object.values(stats).filter(
    (s) => s.misses > 0 && s.streak < 2,
  ).length;

  const restart = () => {
    setDeck({
      queue: orderByPriority(
        Object.keys(termsById),
        statsRef.current,
        String(Date.now()),
      ),
      learned: [],
    });
    setFlipped(false);
  };

  const answer = (gotIt: boolean) => {
    if (currentId) setStats(recordAnswer(stats, currentId, gotIt));
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
          Come back tomorrow for another pass. Spacing beats cramming — and
          next time, the cards you missed will come up first.
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
        {strugglingCount > 0
          ? ` · ${strugglingCount} previously missed up first`
          : ""}
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
