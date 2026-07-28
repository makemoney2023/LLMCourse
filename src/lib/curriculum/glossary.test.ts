import { describe, expect, it } from "vitest";
import { loadGlossary, validateGlossary } from "./glossary";
import { HARD_TERMS } from "./readability";

describe("loadGlossary", () => {
  it("loads a comprehensive term bank from curriculum/glossary.yaml", () => {
    const glossary = loadGlossary();
    expect(glossary.terms.length).toBeGreaterThanOrEqual(35);
    const first = glossary.terms[0];
    expect(first.id).toBeTruthy();
    expect(first.term).toBeTruthy();
    expect(first.shortDefinition.length).toBeGreaterThan(10);
    expect(first.shortDefinition.length).toBeLessThanOrEqual(180);
    expect(first.longDefinition.length).toBeGreaterThan(20);
  });

  it("covers every HARD_TERMS entry via term or alias", () => {
    const glossary = loadGlossary();
    const phrases = new Set(
      glossary.terms.flatMap((t) =>
        [t.term, ...t.aliases].map((p) => p.toLowerCase()),
      ),
    );
    for (const hard of HARD_TERMS) {
      expect(
        phrases.has(hard.toLowerCase()),
        `HARD_TERM missing from glossary: ${hard}`,
      ).toBe(true);
    }
  });

  it("requires unique ids, terms, and aliases", () => {
    const glossary = loadGlossary();
    expect(() => validateGlossary(glossary)).not.toThrow();
  });

  it("rejects colliding aliases", () => {
    expect(() =>
      validateGlossary({
        terms: [
          {
            id: "a",
            term: "alpha",
            aliases: ["shared"],
            shortDefinition: "Short alpha definition here.",
            longDefinition: "Longer alpha definition for the glossary page.",
            relatedModules: [],
          },
          {
            id: "b",
            term: "beta",
            aliases: ["shared"],
            shortDefinition: "Short beta definition here.",
            longDefinition: "Longer beta definition for the glossary page.",
            relatedModules: [],
          },
        ],
      }),
    ).toThrow(/alias/i);
  });

  it("requires short and long definitions on every term", () => {
    expect(() =>
      validateGlossary({
        terms: [
          {
            id: "empty",
            term: "empty",
            aliases: [],
            shortDefinition: "",
            longDefinition: "Has long only.",
            relatedModules: [],
          },
        ],
      }),
    ).toThrow(/shortDefinition/i);
  });
});
