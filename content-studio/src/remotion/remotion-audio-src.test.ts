import { describe, expect, it } from "vitest";
import { toRemotionAudioSrc } from "./remotion-audio-src";

describe("toRemotionAudioSrc", () => {
  it("leaves http(s) URLs unchanged", () => {
    expect(toRemotionAudioSrc("https://cdn.example/a.mp3")).toBe(
      "https://cdn.example/a.mp3",
    );
  });

  it("wraps public-relative paths with staticFile", () => {
    // Node has no remotion_staticBase — staticFile returns a rooted public path.
    expect(toRemotionAudioSrc("batch-audio/clip.wav")).toBe(
      "/batch-audio/clip.wav",
    );
  });
});
