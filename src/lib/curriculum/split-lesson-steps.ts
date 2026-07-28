import type { ModuleLessonStep } from "@/lib/curriculum/types";
import { slugifyHeading } from "@/lib/markdown-ids";

export type LessonStepChunk = {
  stepId: string;
  title: string;
  /** Markdown for this step (includes its H2 headings) */
  markdown: string;
};

/**
 * Split lesson markdown into step chunks by H2 headings listed in module.steps.
 * Content before the first matched H2 is prepended to the first step.
 */
export function splitLessonIntoSteps(
  lessonMarkdown: string,
  steps: ModuleLessonStep[],
): LessonStepChunk[] {
  if (steps.length === 0) return [];

  const sections = splitByH2(lessonMarkdown);
  const used = new Set<number>();

  const chunks: LessonStepChunk[] = steps.map((step) => {
    const parts: string[] = [];
    for (const heading of step.headings) {
      const idx = sections.findIndex(
        (s, i) => !used.has(i) && headingsMatch(s.heading, heading),
      );
      if (idx >= 0) {
        used.add(idx);
        const sec = sections[idx]!;
        parts.push(
          sec.heading ? `## ${sec.heading}\n\n${sec.body}`.trim() : sec.body,
        );
      }
    }
    return {
      stepId: step.id,
      title: step.title,
      markdown: parts.filter(Boolean).join("\n\n").trim(),
    };
  });

  // Prepend preamble (title / text before first H2) to first step
  const preamble = sections
    .filter((s, i) => !used.has(i) && !s.heading)
    .map((s) => s.body.trim())
    .filter(Boolean)
    .join("\n\n");
  if (preamble && chunks[0]) {
    chunks[0] = {
      ...chunks[0],
      markdown: [preamble, chunks[0].markdown].filter(Boolean).join("\n\n"),
    };
  }

  return chunks;
}

type Section = { heading: string | null; body: string };

function splitByH2(markdown: string): Section[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections: Section[] = [];
  let current: Section = { heading: null, body: "" };

  const flush = () => {
    const body = current.body.trim();
    if (current.heading || body) {
      sections.push({ heading: current.heading, body });
    }
  };

  for (const line of lines) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) {
      flush();
      current = { heading: match[1]!.trim(), body: "" };
    } else {
      current.body += (current.body ? "\n" : "") + line;
    }
  }
  flush();
  return sections;
}

function headingsMatch(actual: string | null, expected: string): boolean {
  if (!actual) return false;
  return (
    actual.trim().toLowerCase() === expected.trim().toLowerCase() ||
    slugifyHeading(actual) === slugifyHeading(expected)
  );
}
