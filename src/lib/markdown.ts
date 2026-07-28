import { marked } from "marked";
import type { GlossaryTerm } from "@/lib/curriculum/glossary";
import { linkGlossaryTerms } from "@/lib/curriculum/link-glossary";

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

/** Markdown → HTML with first-occurrence glossary links. */
export function renderLearnerMarkdown(
  markdown: string,
  terms: GlossaryTerm[],
): string {
  return linkGlossaryTerms(renderMarkdown(markdown), terms);
}

export type ParsedExercise = {
  id: string;
  title: string;
  bodyHtml: string;
  answerHtml: string;
};

/** Split exercises.md into exercise blocks with gated answer keys. */
export function parseExercises(
  markdown: string,
  terms: GlossaryTerm[] = [],
): ParsedExercise[] {
  const chunks = markdown.split(/^##\s+Exercise\s+/m).slice(1);
  return chunks.map((chunk, index) => {
    const lines = chunk.trim().split("\n");
    const heading = lines[0]?.trim() ?? `Exercise ${index + 1}`;
    const title = heading.replace(/^\d+:\s*/, "").trim();
    const rest = lines.slice(1).join("\n");
    const idMatch = rest.match(/\*\*id:\*\*\s*(\S+)/i);
    const id = idMatch?.[1] ?? `ex-${index + 1}`;
    const detailsMatch = rest.match(
      /<details>\s*<summary>\s*Answer key\s*<\/summary>([\s\S]*?)<\/details>/i,
    );
    const answerMarkdown = detailsMatch?.[1]?.trim() ?? "";
    const bodyMarkdown = rest
      .replace(/\*\*id:\*\*\s*\S+\s*/i, "")
      .replace(
        /<details>\s*<summary>\s*Answer key\s*<\/summary>[\s\S]*?<\/details>/i,
        "",
      )
      .trim();

    const render = (md: string) =>
      terms.length > 0
        ? renderLearnerMarkdown(md, terms)
        : renderMarkdown(md);

    return {
      id,
      title,
      bodyHtml: render(bodyMarkdown),
      answerHtml: render(answerMarkdown),
    };
  });
}
