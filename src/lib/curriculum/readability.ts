/** Lightweight reading helpers for curriculum plain-language checks. */

const ABBREVIATIONS = /\b(?:e\.g|i\.e|Dr|Mr|Mrs|Ms|U\.S|etc)\./gi;

export function splitSentences(text: string): string[] {
  const normalized = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^\|.*\|$/gm, " ")
    .replace(/^[#>*`-].*$/gm, (line) =>
      line.replace(/^[#>*`\-\s]+/, "").trim(),
    )
    .replace(ABBREVIATIONS, (m) => m.replace(/\./g, ""))
    .replace(/\s+/g, " ")
    .trim();

  return normalized
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /[a-zA-Z]/.test(s));
}

export function wordsIn(sentence: string): string[] {
  return sentence
    .replace(/[^a-zA-Z0-9'\- ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function averageWordsPerSentence(text: string): number {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return 0;
  const total = sentences.reduce((sum, s) => sum + wordsIn(s).length, 0);
  return total / sentences.length;
}

/** Terms that must be followed soon by a plain definition cue. */
export const HARD_TERMS = [
  "context window",
  "standing instructions",
  "retrieval",
  "compaction",
  "mcp",
  "grounding",
  "subagent",
  "playbook",
  "agent harness",
  "agentic framework",
] as const;

const DEFINITION_CUES =
  /\b(means|is when|is like|think of|in plain words|for short|that is|that's|desk|recipe|binder|sticky|classroom|apps? the helper)\b/i;

export function hardTermNeedsDefinition(
  text: string,
  term: string,
): boolean {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(term.toLowerCase());
  if (idx === -1) return false;

  // Definition cues may appear just before or after the term
  // (e.g. "that is **compaction**" or "**compaction** is like…").
  const start = Math.max(0, idx - 160);
  const end = Math.min(text.length, idx + term.length + 220);
  const window = text.slice(start, end);
  return !DEFINITION_CUES.test(window);
}

export function undefinedHardTerms(text: string): string[] {
  return HARD_TERMS.filter((term) => hardTermNeedsDefinition(text, term));
}
