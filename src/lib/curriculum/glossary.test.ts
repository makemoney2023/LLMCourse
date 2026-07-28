import { describe, expect, it } from "vitest";
import { loadGlossary, validateGlossary } from "./glossary";

describe("loadGlossary", () => {
  it("loads terms from curriculum/glossary.yaml", () => {
    const glossary = loadGlossary();
    expect(glossary.terms.length).toBeGreaterThanOrEqual(12);
    const first = glossary.terms[0];
    expect(first.id).toBeTruthy();
    expect(first.term).toBeTruthy();
    expect(first.shortDefinition.length).toBeGreaterThan(10);
    expect(first.longDefinition.length).toBeGreaterThan(20);
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
