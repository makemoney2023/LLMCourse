import type { Metadata } from "next";
import { FlashcardDeck } from "@/components/flashcard-deck";
import { loadGlossary } from "@/lib/curriculum/glossary";

export const metadata: Metadata = {
  title: "Flashcards",
  description: "Flip-card practice for every glossary term in the course.",
};

export default function FlashcardsPage() {
  const terms = loadGlossary().terms.map((t) => ({
    id: t.id,
    term: t.term,
    shortDefinition: t.shortDefinition,
    longDefinition: t.longDefinition,
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">Flashcards</h1>
      <p className="mt-2 text-muted-foreground">
        Every glossary term as a flip card. Cards you miss come back around
        until you know the whole deck.
      </p>
      <div className="mt-8">
        <FlashcardDeck terms={terms} />
      </div>
    </div>
  );
}
