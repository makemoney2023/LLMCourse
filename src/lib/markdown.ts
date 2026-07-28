import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

export type ParsedExercise = {
  id: string;
  title: string;
  bodyHtml: string;
  answerHtml: string;
};

/** Split exercises.md into exercise blocks with gated answer keys. */
export function parseExercises(markdown: string): ParsedExercise[] {
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

    return {
      id,
      title,
      bodyHtml: renderMarkdown(bodyMarkdown),
      answerHtml: renderMarkdown(answerMarkdown),
    };
  });
}
