import { describe, expect, it } from "vitest";
import { parseScriptPack } from "./script-pack";

describe("parseScriptPack", () => {
  it("accepts a valid voice pack", () => {
    const pack = parseScriptPack({
      id: "mental-model-desk-space-01",
      module: "01-mental-model",
      anchor: "Context window = desk space",
      format: "voice",
      hook: "Your AI isn't dumb — your desk is crowded.",
      beats: [
        { text: "Think of the context window as desk space.", visual: "title_card" },
        { text: "Too many sticky notes → worse answers.", visual: "kinetic_list" },
        { text: "Clear the desk. Keep the goal and the facts.", visual: "punchline" },
      ],
      cta: "Free LLM Leverage course — link in bio",
      duration_target_sec: 45,
      tags: ["context-window", "beginners"],
    });
    expect(pack.id).toBe("mental-model-desk-space-01");
    expect(pack.beats).toHaveLength(3);
  });

  it("rejects missing cta", () => {
    expect(() =>
      parseScriptPack({
        id: "x",
        module: "01-mental-model",
        anchor: "a",
        format: "voice",
        hook: "h",
        beats: [{ text: "t", visual: "title_card" }],
        duration_target_sec: 40,
      }),
    ).toThrow(/cta/i);
  });

  it("rejects empty beats", () => {
    expect(() =>
      parseScriptPack({
        id: "x",
        module: "01-mental-model",
        anchor: "a",
        format: "music_caption",
        hook: "h",
        beats: [],
        cta: "cta",
        duration_target_sec: 40,
      }),
    ).toThrow(/beats/i);
  });

  it("rejects duration outside 30–55", () => {
    expect(() =>
      parseScriptPack({
        id: "x",
        module: "01-mental-model",
        anchor: "a",
        format: "voice",
        hook: "h",
        beats: [{ text: "t", visual: "title_card" }],
        cta: "cta",
        duration_target_sec: 20,
      }),
    ).toThrow(/duration/i);
  });
});
