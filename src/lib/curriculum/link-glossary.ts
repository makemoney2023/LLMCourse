import { JSDOM } from "jsdom";
import type { GlossaryTerm } from "./glossary";

type Phrase = {
  id: string;
  phrase: string;
  tip: string;
};

const SKIP_TAGS = new Set([
  "A",
  "CODE",
  "PRE",
  "SCRIPT",
  "STYLE",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
]);

function buildPhrases(terms: GlossaryTerm[]): Phrase[] {
  const phrases: Phrase[] = [];
  for (const term of terms) {
    const tip = term.shortDefinition;
    phrases.push({ id: term.id, phrase: term.term, tip });
    for (const alias of term.aliases) {
      phrases.push({ id: term.id, phrase: alias, tip });
    }
  }
  // Longest first so "Model Context Protocol" wins over "MCP" substrings, etc.
  phrases.sort((a, b) => b.phrase.length - a.phrase.length);
  return phrases;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isWholeWordMatch(text: string, start: number, length: number): boolean {
  const before = start === 0 ? "" : text[start - 1]!;
  const after = start + length >= text.length ? "" : text[start + length]!;
  const boundary = /[A-Za-z0-9_./-]/;
  if (before && boundary.test(before)) return false;
  if (after && boundary.test(after)) return false;
  return true;
}

function findMatch(
  text: string,
  phrases: Phrase[],
  linkedIds: Set<string>,
): { start: number; end: number; phrase: Phrase } | null {
  let best: { start: number; end: number; phrase: Phrase } | null = null;
  const lower = text.toLowerCase();

  for (const phrase of phrases) {
    if (linkedIds.has(phrase.id)) continue;
    const needle = phrase.phrase.toLowerCase();
    let from = 0;
    while (from < lower.length) {
      const idx = lower.indexOf(needle, from);
      if (idx === -1) break;
      if (isWholeWordMatch(text, idx, needle.length)) {
        const candidate = {
          start: idx,
          end: idx + needle.length,
          phrase,
        };
        if (
          !best ||
          candidate.start < best.start ||
          (candidate.start === best.start &&
            candidate.end - candidate.start > best.end - best.start)
        ) {
          best = candidate;
        }
        break;
      }
      from = idx + 1;
    }
  }
  return best;
}

function shouldSkipTextNode(node: Node): boolean {
  let el = node.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    el = el.parentElement;
  }
  return false;
}

/**
 * Wrap the first occurrence of each glossary term/alias in learner HTML.
 */
export function linkGlossaryTerms(
  html: string,
  terms: GlossaryTerm[],
): string {
  if (!html.trim() || terms.length === 0) return html;

  const phrases = buildPhrases(terms);
  const dom = new JSDOM(`<div id="root">${html}</div>`);
  const root = dom.window.document.getElementById("root");
  if (!root) return html;

  const linkedIds = new Set<string>();
  const walker = dom.window.document.createTreeWalker(
    root,
    dom.window.NodeFilter.SHOW_TEXT,
  );

  const textNodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const textNode of textNodes) {
    if (linkedIds.size === phrases.length) break;
    if (shouldSkipTextNode(textNode)) continue;
    const text = textNode.nodeValue ?? "";
    if (!text.trim()) continue;

    // May need multiple replacements in one node for different term ids.
    let remaining = text;
    const parent = textNode.parentNode;
    if (!parent) continue;

    const frag = dom.window.document.createDocumentFragment();
    let safety = 0;
    while (safety++ < 50) {
      const match = findMatch(remaining, phrases, linkedIds);
      if (!match) {
        if (remaining) frag.append(dom.window.document.createTextNode(remaining));
        break;
      }
      if (match.start > 0) {
        frag.append(
          dom.window.document.createTextNode(remaining.slice(0, match.start)),
        );
      }
      const original = remaining.slice(match.start, match.end);
      const anchor = dom.window.document.createElement("a");
      anchor.className = "glossary-term";
      anchor.href = `/glossary#${match.phrase.id}`;
      anchor.setAttribute("data-glossary-id", match.phrase.id);
      anchor.setAttribute("data-glossary-tip", match.phrase.tip);
      anchor.textContent = original;
      frag.append(anchor);
      linkedIds.add(match.phrase.id);
      remaining = remaining.slice(match.end);
    }

    parent.replaceChild(frag, textNode);
  }

  return root.innerHTML;
}

/** Helper for tests / tooling that need phrase regexes. */
export function glossaryPhrasePattern(phrase: string): RegExp {
  return new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "i");
}
