import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { parseScriptPack } from "../schema/script-pack";
import { synthesizeVoice, voiceCacheKey } from "./tts";

function samplePack(overrides: Partial<ReturnType<typeof parseScriptPack>> = {}) {
  return parseScriptPack({
    id: "mental-model-desk-space-01",
    module: "01-mental-model",
    anchor: "Context window = desk space",
    format: "voice",
    hook: "Your AI isn't dumb — your desk is crowded.",
    beats: [
      { text: "Think of the context window as desk space.", visual: "title_card" },
      { text: "Too many sticky notes → worse answers.", visual: "kinetic_list" },
    ],
    cta: "Free LLM Leverage course — link in bio",
    duration_target_sec: 45,
    ...overrides,
  });
}

describe("voiceCacheKey", () => {
  it("is stable for same voiceId + hook + beats text + cta", () => {
    const pack = samplePack();
    const a = voiceCacheKey(pack, "voice-abc");
    const b = voiceCacheKey(pack, "voice-abc");
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);

    const beatsText = pack.beats.map((beat) => beat.text).join("\n");
    const expected = createHash("sha256")
      .update(`voice-abc:${pack.hook}:${beatsText}:${pack.cta}`)
      .digest("hex");
    expect(a).toBe(expected);
  });

  it("changes when hook, beats text, or cta change", () => {
    const base = samplePack();
    const key = voiceCacheKey(base, "voice-abc");
    expect(voiceCacheKey(samplePack({ hook: "Different hook." }), "voice-abc")).not.toBe(
      key,
    );
    expect(
      voiceCacheKey(
        samplePack({
          beats: [{ text: "Different beat text.", visual: "title_card" }],
        }),
        "voice-abc",
      ),
    ).not.toBe(key);
    expect(
      voiceCacheKey(samplePack({ cta: "Different CTA — different link" }), "voice-abc"),
    ).not.toBe(key);
    expect(voiceCacheKey(base, "other-voice")).not.toBe(key);
  });
});

describe("synthesizeVoice dry mode", () => {
  const prev = {
    dry: process.env.SHORTS_DRY_AUDIO,
    key: process.env.ELEVENLABS_API_KEY,
    voice: process.env.ELEVENLABS_VOICE_ID,
  };

  beforeEach(() => {
    delete process.env.ELEVENLABS_API_KEY;
    delete process.env.ELEVENLABS_VOICE_ID;
    process.env.SHORTS_DRY_AUDIO = "1";
  });

  afterEach(() => {
    if (prev.dry === undefined) delete process.env.SHORTS_DRY_AUDIO;
    else process.env.SHORTS_DRY_AUDIO = prev.dry;
    if (prev.key === undefined) delete process.env.ELEVENLABS_API_KEY;
    else process.env.ELEVENLABS_API_KEY = prev.key;
    if (prev.voice === undefined) delete process.env.ELEVENLABS_VOICE_ID;
    else process.env.ELEVENLABS_VOICE_ID = prev.voice;
  });

  it("writes a silent wav stub to outPath without API keys", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "shorts-tts-"));
    const outPath = path.join(dir, "voice.wav");
    const pack = samplePack();

    const result = await synthesizeVoice(pack, outPath);

    expect(result).toBe(outPath);
    expect(fs.existsSync(outPath)).toBe(true);
    const buf = fs.readFileSync(outPath);
    expect(buf.byteLength).toBeGreaterThan(44);
    expect(buf.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(buf.subarray(8, 12).toString("ascii")).toBe("WAVE");
  });

  it("reuses cache under out/.audio-cache for the same cache key", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "shorts-tts-"));
    const outA = path.join(dir, "a.wav");
    const outB = path.join(dir, "b.wav");
    const pack = samplePack();
    const key = voiceCacheKey(pack, "dry");

    await synthesizeVoice(pack, outA, { studioRoot: dir });
    await synthesizeVoice(pack, outB, { studioRoot: dir });

    const cachePath = path.join(dir, "out", ".audio-cache", `${key}.wav`);
    expect(fs.existsSync(cachePath)).toBe(true);
    expect(fs.readFileSync(outA)).toEqual(fs.readFileSync(cachePath));
    expect(fs.readFileSync(outB)).toEqual(fs.readFileSync(cachePath));
  });

  it("throws without API keys when SHORTS_DRY_AUDIO is not set", async () => {
    delete process.env.SHORTS_DRY_AUDIO;
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "shorts-tts-"));
    await expect(
      synthesizeVoice(samplePack(), path.join(dir, "voice.wav")),
    ).rejects.toThrow(/ELEVENLABS_API_KEY|ELEVENLABS_VOICE_ID|SHORTS_DRY_AUDIO/);
  });
});
