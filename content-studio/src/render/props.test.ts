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
});
