import { describe, expect, it } from "vitest";
import {
  compositionForSeries,
  scriptPackToListRevealProps,
  scriptPackToLoopSnippetProps,
  scriptPackToTitlePunchProps,
} from "./props";
import { parseScriptPack } from "../schema/script-pack";

const basePack = {
  id: "mental-model-desk-space-01",
  module: "01-mental-model",
  anchor: "Context window = desk space",
  format: "voice" as const,
  hook: "Your AI isn't dumb — your desk is crowded.",
  beats: [
    { text: "Think of the context window as desk space.", visual: "title_card" },
    { text: "Too many sticky notes → worse answers.", visual: "kinetic_list" },
    { text: "Clear the desk. Keep the goal and the facts.", visual: "punchline" },
  ],
  cta: "Free LLM Leverage course — link in bio",
  duration_target_sec: 45,
  tags: ["context-window"],
};

describe("compositionForSeries", () => {
  it("maps myth_fix → ListReveal, loop_moment → LoopSnippet, else TitlePunch", () => {
    expect(compositionForSeries("myth_fix")).toBe("ListReveal");
    expect(compositionForSeries("loop_moment")).toBe("LoopSnippet");
    expect(compositionForSeries("one_idea")).toBe("TitlePunch");
  });
});

describe("scriptPackToTitlePunchProps", () => {
  it("allocates frames that sum to duration and keeps captions short", () => {
    const pack = parseScriptPack(basePack);
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

  it("passes optional audioSrc through to TitlePunch props", () => {
    const pack = parseScriptPack({
      id: "audio-prop-pack",
      module: "01-mental-model",
      anchor: "Audio wiring",
      format: "voice",
      hook: "Hook with audio.",
      beats: [{ text: "Beat one.", visual: "title_card" }],
      cta: "Free LLM Leverage course — link in bio",
      duration_target_sec: 30,
    });
    const withAudio = scriptPackToTitlePunchProps(pack, {
      audioSrc: "/tmp/voice.wav",
    });
    expect(withAudio.audioSrc).toBe("/tmp/voice.wav");
    expect(scriptPackToTitlePunchProps(pack).audioSrc).toBeUndefined();
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

describe("scriptPackToListRevealProps", () => {
  it("numbers beats as list items and fits frames within duration", () => {
    const pack = parseScriptPack({
      ...basePack,
      id: "myth-fix-list-01",
      hook: "Myth: more sticky notes always help.",
    });
    const props = scriptPackToListRevealProps(pack);

    expect(props.fps).toBe(30);
    expect(props.durationInFrames).toBe(45 * 30);
    expect(props.courseName).toBe("LLM Leverage");
    expect(props.hook).toBe(pack.hook);
    expect(props.cta).toBe(pack.cta);
    expect(props.brand.accent).toBeTruthy();
    expect(props.items).toHaveLength(3);
    expect(props.items.map((item) => item.n)).toEqual([1, 2, 3]);
    expect(props.items.every((item) => item.text.length <= 80)).toBe(true);
    expect(props.items.every((item) => item.durationFrames > 0)).toBe(true);

    const last = props.items[props.items.length - 1]!;
    expect(last.startFrame + last.durationFrames).toBeLessThanOrEqual(
      props.durationInFrames,
    );
  });

  it("passes optional audioSrc through", () => {
    const pack = parseScriptPack({ ...basePack, id: "list-audio-01" });
    expect(
      scriptPackToListRevealProps(pack, { audioSrc: "/tmp/list.wav" }).audioSrc,
    ).toBe("/tmp/list.wav");
    expect(scriptPackToListRevealProps(pack).audioSrc).toBeUndefined();
  });
});

describe("scriptPackToLoopSnippetProps", () => {
  it("uses pack.anchor as the highlighted loop node and times beats", () => {
    const pack = parseScriptPack({
      ...basePack,
      id: "loop-snippet-01",
      anchor: "Observe → Decide → Act",
      hook: "Zoom in on one node of the loop.",
    });
    const props = scriptPackToLoopSnippetProps(pack);

    expect(props.fps).toBe(30);
    expect(props.durationInFrames).toBe(45 * 30);
    expect(props.courseName).toBe("LLM Leverage");
    expect(props.nodeLabel).toBe("Observe → Decide → Act");
    expect(props.hook).toBe(pack.hook);
    expect(props.beats).toHaveLength(3);
    expect(props.beats.every((b) => b.text.length <= 80)).toBe(true);
    expect(props.beats.every((b) => b.durationFrames > 0)).toBe(true);

    const last = props.beats[props.beats.length - 1]!;
    expect(last.startFrame + last.durationFrames).toBeLessThanOrEqual(
      props.durationInFrames,
    );
  });

  it("passes optional audioSrc through", () => {
    const pack = parseScriptPack({ ...basePack, id: "loop-audio-01" });
    expect(
      scriptPackToLoopSnippetProps(pack, { audioSrc: "/tmp/loop.wav" }).audioSrc,
    ).toBe("/tmp/loop.wav");
    expect(scriptPackToLoopSnippetProps(pack).audioSrc).toBeUndefined();
  });
});
