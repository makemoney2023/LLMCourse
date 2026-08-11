import { describe, expect, it } from "vitest";
import { assertScriptPack, parseScriptPack } from "./script-pack";

function validPack(overrides: Record<string, unknown> = {}) {
  return {
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
    ...overrides,
  };
}

describe("parseScriptPack", () => {
  it("accepts a valid voice pack", () => {
    const pack = parseScriptPack(validPack());
    expect(pack.id).toBe("mental-model-desk-space-01");
    expect(pack.beats).toHaveLength(3);
  });

  it("rejects missing module", () => {
    const { module: _module, ...withoutModule } = validPack();
    expect(() => parseScriptPack(withoutModule)).toThrow(/module/i);
  });

  it("rejects missing anchor", () => {
    const { anchor: _anchor, ...withoutAnchor } = validPack();
    expect(() => parseScriptPack(withoutAnchor)).toThrow(/anchor/i);
  });

  it("rejects invalid format", () => {
    expect(() => parseScriptPack(validPack({ format: "slideshow" }))).toThrow(
      /format/i,
    );
  });

  it("rejects missing cta", () => {
    const { cta: _cta, ...withoutCta } = validPack();
    expect(() => parseScriptPack(withoutCta)).toThrow(/cta/i);
  });

  it("rejects empty beats", () => {
    expect(() => parseScriptPack(validPack({ format: "music_caption", beats: [] }))).toThrow(
      /beats/i,
    );
  });

  it("rejects duration outside 30–55", () => {
    expect(() => parseScriptPack(validPack({ duration_target_sec: 20 }))).toThrow(
      /duration/i,
    );
  });

  it("includes beat index in beat field errors", () => {
    expect(() =>
      parseScriptPack(
        validPack({
          beats: [
            { text: "ok", visual: "title_card" },
            { text: "", visual: "kinetic_list" },
          ],
        }),
      ),
    ).toThrow(/beat 1/i);
  });
});

describe("assertScriptPack", () => {
  it("does not throw for a valid pack", () => {
    expect(() => assertScriptPack(validPack())).not.toThrow();
  });

  it("narrows unknown to ScriptPack on success", () => {
    const raw: unknown = validPack();
    assertScriptPack(raw);
    expect(raw.id).toBe("mental-model-desk-space-01");
    expect(raw.beats).toHaveLength(3);
  });

  it("throws for an invalid pack", () => {
    const { cta: _cta, ...invalid } = validPack();
    expect(() => assertScriptPack(invalid)).toThrow(/cta/i);
  });
});
