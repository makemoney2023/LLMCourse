import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type GlossaryTerm = {
  id: string;
  term: string;
  aliases: string[];
  shortDefinition: string;
  longDefinition: string;
  relatedModules: string[];
};

export type Glossary = {
  terms: GlossaryTerm[];
};

type RawTerm = {
  id?: unknown;
  term?: unknown;
  aliases?: unknown;
  shortDefinition?: unknown;
  longDefinition?: unknown;
  relatedModules?: unknown;
};

function curriculumRoot(): string {
  return path.join(process.cwd(), "curriculum");
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeTerm(raw: RawTerm): GlossaryTerm {
  return {
    id: String(raw.id ?? "").trim(),
    term: String(raw.term ?? "").trim(),
    aliases: asStringArray(raw.aliases).map((a) => a.trim()).filter(Boolean),
    shortDefinition: String(raw.shortDefinition ?? "").trim(),
    longDefinition: String(raw.longDefinition ?? "").trim(),
    relatedModules: asStringArray(raw.relatedModules)
      .map((m) => m.trim())
      .filter(Boolean),
  };
}

export function validateGlossary(glossary: Glossary): void {
  const ids = new Set<string>();
  const phrases = new Set<string>();

  for (const term of glossary.terms) {
    if (!term.id) throw new Error("Glossary term missing id");
    if (!term.term) throw new Error(`Glossary term ${term.id} missing term`);
    if (!term.shortDefinition) {
      throw new Error(`Glossary term ${term.id} missing shortDefinition`);
    }
    if (!term.longDefinition) {
      throw new Error(`Glossary term ${term.id} missing longDefinition`);
    }
    if (ids.has(term.id)) {
      throw new Error(`Duplicate glossary id: ${term.id}`);
    }
    ids.add(term.id);

    const allPhrases = [term.term, ...term.aliases];
    for (const phrase of allPhrases) {
      const key = phrase.toLowerCase();
      if (phrases.has(key)) {
        throw new Error(`Duplicate glossary alias or term: ${phrase}`);
      }
      phrases.add(key);
    }
  }
}

export function loadGlossary(): Glossary {
  const filePath = path.join(curriculumRoot(), "glossary.yaml");
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = parseYaml(raw) as { terms?: RawTerm[] };
  const terms = (parsed.terms ?? []).map(normalizeTerm);
  const glossary = { terms };
  validateGlossary(glossary);
  return glossary;
}

export function getGlossaryTermById(
  glossary: Glossary,
  id: string,
): GlossaryTerm | undefined {
  return glossary.terms.find((t) => t.id === id);
}
