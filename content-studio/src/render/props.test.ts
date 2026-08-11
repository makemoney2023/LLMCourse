import { describe, expect, it } from "vitest";
import { scriptPackToTitlePunchProps } from "./props";
import { parseScriptPack } from "../schema/script-pack";

describe("scriptPackToTitlePunchProps", () => {
  it("allocates frames that sum to duration and keeps captions short", () => {
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
      tags: ["context-window"],
    });
    const props = scriptPackToTitlePunchProps(pack);
    expect(props.fps).toBe(30);
    expect(props.durationInFrames).toBe(45 * 30);
    expect(props.courseName).toBe("LLM Leverage");
    expect(props.beats.every((b) => b.text.length <= 80)).toBe(true);
    const last = props.beats[props.beats.length - 1]!;
    expect(last.startFrame + last.durationFrames).toBeLessThanOrEqual(
      props.durationInFrames,
    );
  });

  it("scales beat durations to fit when min-beat would overflow", () => {
    // 30s = 900 frames; hook 60 + CTA 90 → 750 remaining.
    // 19 beats × Math.max(45, …) would end at frame 915 (> 900).
    const pack = parseScriptPack({
      id: "overflow-pack",
      module: "01-mental-model",
      anchor: "Overflow timing",
      format: "voice",
      hook: "Short video, many beats.",
      beats: Array.from({ length: 19 }, (_, i) => ({
        text: `Beat ${i + 1}`,
        visual: "title_card",
      })),
      cta: "Free LLM Leverage course — link in bio",
      duration_target_sec: 30,
    });
    const props = scriptPackToTitlePunchProps(pack);
    const last = props.beats[props.beats.length - 1]!;
    const beatEnd = last.startFrame + last.durationFrames;
    const ctaStart = props.durationInFrames - 3 * 30;

    expect(beatEnd).toBeLessThanOrEqual(props.durationInFrames);
    expect(beatEnd).toBeLessThanOrEqual(ctaStart);
    expect(props.beats.every((b) => b.durationFrames > 0)).toBe(true);
  });

  it("truncates beat captions over 80 chars with ellipsis", () => {
    const longText =
      "This beat caption is intentionally longer than eighty characters so truncation must kick in and append an ellipsis.";
    expect(longText.length).toBeGreaterThan(80);

    const pack = parseScriptPack({
      id: "truncate-pack",
      module: "01-mental-model",
      anchor: "Caption truncation",
      format: "voice",
      hook: "Long captions need cutting.",
      beats: [{ text: longText, visual: "title_card" }],
      cta: "Free LLM Leverage course — link in bio",
      duration_target_sec: 30,
    });
    const props = scriptPackToTitlePunchProps(pack);
    const caption = props.beats[0]!.text;

    expect(caption.length).toBeLessThanOrEqual(80);
    expect(caption.endsWith("...")).toBe(true);
  });
});
