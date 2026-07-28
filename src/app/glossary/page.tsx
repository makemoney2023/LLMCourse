import Link from "next/link";
import type { Metadata } from "next";
import { loadGlossary } from "@/lib/curriculum/glossary";
import { listModules } from "@/lib/curriculum/load-curriculum";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Plain-language definitions for terms used in the LLM Leverage course.",
};

export default function GlossaryPage() {
  const { terms } = loadGlossary();
  const modules = listModules();
  const bySlug = new Map(modules.map((m) => [m.slug, m]));
  const sorted = [...terms].sort((a, b) =>
    a.term.localeCompare(b.term, undefined, { sensitivity: "base" }),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">Glossary</h1>
      <p className="mt-2 text-muted-foreground">
        Plain meanings for course words. In lessons, hover a dotted link for a
        short tip, or click through for the full note.
      </p>

      <nav aria-label="Glossary letters" className="mt-6 flex flex-wrap gap-2">
        {sorted.map((term) => (
          <a
            key={term.id}
            href={`#${term.id}`}
            className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {term.term}
          </a>
        ))}
      </nav>

      <dl className="mt-10 space-y-8">
        {sorted.map((term) => (
          <div
            key={term.id}
            id={term.id}
            className="scroll-mt-28 rounded-2xl border border-border/70 bg-card/40 p-5"
          >
            <dt className="font-heading text-2xl tracking-tight">{term.term}</dt>
            {term.aliases.length > 0 ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Also called: {term.aliases.join(", ")}
              </p>
            ) : null}
            <dd className="mt-3 space-y-3 text-sm leading-relaxed">
              <p className="font-medium text-foreground/90">
                {term.shortDefinition}
              </p>
              <div className="prose-course whitespace-pre-line text-muted-foreground">
                {term.longDefinition.trim()}
              </div>
              {term.relatedModules.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Related modules:{" "}
                  {term.relatedModules.map((slug, index) => {
                    const mod = bySlug.get(slug);
                    const label = mod
                      ? `Module ${mod.order}: ${mod.title}`
                      : slug;
                    return (
                      <span key={slug}>
                        {index > 0 ? ", " : null}
                        <Link
                          href={`/modules/${slug}`}
                          className="text-primary underline underline-offset-2"
                        >
                          {label}
                        </Link>
                      </span>
                    );
                  })}
                </p>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
