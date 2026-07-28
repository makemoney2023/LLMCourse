import { describe, expect, it } from "vitest";
import { getWorkshopDeck, listWorkshopSessions } from "./load-curriculum";

describe("workshop slide decks", () => {
  it("loads four sessions with slide decks", () => {
    const sessions = listWorkshopSessions();
    expect(sessions).toHaveLength(4);
    for (const session of sessions) {
      expect(session.slides.length).toBeGreaterThanOrEqual(8);
      expect(session.slides[0]?.layout).toBe("title");
      expect(session.moduleSlugs.length).toBeGreaterThan(0);
    }
  });

  it("returns a deck with facilitator notes on teaching slides", () => {
    const deck = getWorkshopDeck("session-01");
    expect(deck).not.toBeNull();
    expect(deck!.title).toMatch(/Session 1|research pack|wall rules|Mental model/i);
    const teaching = deck!.slides.filter((s) => s.layout !== "title");
    expect(teaching.some((s) => (s.notes?.length ?? 0) > 20)).toBe(true);
    expect(deck!.slides.some((s) => s.layout === "activity")).toBe(true);
    expect(deck!.slides.some((s) => s.layout === "takeaway")).toBe(true);
  });

  it("keeps linked module slugs aligned to the curriculum map", () => {
    const deck = getWorkshopDeck("session-01");
    expect(deck?.moduleSlugs).toEqual([
      "mental-model",
      "deep-research",
      "system-instructions",
    ]);
    const deck2 = getWorkshopDeck("session-02");
    expect(deck2?.moduleSlugs).toEqual([
      "standing-playbooks",
      "tools-and-mcp",
      "retrieval-and-grounding",
    ]);
  });

  it("keeps every bullet and step as a plain string (YAML colon safety)", () => {
    for (const session of listWorkshopSessions()) {
      for (const slide of session.slides) {
        for (const bullet of slide.bullets ?? []) {
          expect(typeof bullet, `${session.id}/${slide.id} bullet`).toBe(
            "string",
          );
        }
        for (const step of slide.steps ?? []) {
          expect(typeof step, `${session.id}/${slide.id} step`).toBe("string");
        }
      }
    }
  });

  it("gives demo/steps slides detailed facilitator notes", () => {
    for (const session of listWorkshopSessions()) {
      for (const slide of session.slides) {
        if (slide.layout !== "steps") continue;
        expect(
          (slide.notes ?? "").length,
          `${session.id}/${slide.id} demo notes`,
        ).toBeGreaterThan(400);
        expect(slide.notes ?? "").toMatch(/STEP-BY-STEP|1\)|1\./i);
      }
    }
  });
});

