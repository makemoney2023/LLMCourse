import { describe, expect, it } from "vitest";
import type { ScriptPack } from "../schema/script-pack";
import { buildDescription } from "./description";

const pack: ScriptPack = {
  id: "mental-model-desk-space-01",
  module: "01-mental-model",
  anchor: "Context window = desk space",
  format: "voice",
  hook: "Your AI isn't dumb — your desk is crowded.",
  beats: [{ text: "Clear the desk.", visual: "punchline" }],
  cta: "Free LLM Leverage course — link in bio",
  duration_target_sec: 45,
};

describe("buildDescription", () => {
  it("includes course URL with UTM campaign = pack.id", () => {
    const description = buildDescription(pack);
    expect(description).toContain(
      "https://llm-leverage-course.vercel.app?utm_source=youtube&utm_medium=shorts&utm_campaign=mental-model-desk-space-01",
    );
  });

  it("includes the pack CTA", () => {
    expect(buildDescription(pack)).toContain(pack.cta);
  });
});
