import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseScriptPack } from "../schema/script-pack";
import { resolveMusicBed } from "./music";

function samplePack() {
  return parseScriptPack({
    id: "mental-model-desk-space-01",
    module: "01-mental-model",
    anchor: "Context window = desk space",
    format: "music_caption",
    hook: "Your AI isn't dumb — your desk is crowded.",
    beats: [{ text: "Clear the desk.", visual: "punchline" }],
    cta: "Free LLM Leverage course — link in bio",
    duration_target_sec: 40,
  });
}

describe("resolveMusicBed", () => {
  const prevDry = process.env.SHORTS_DRY_AUDIO;

  afterEach(() => {
    if (prevDry === undefined) delete process.env.SHORTS_DRY_AUDIO;
    else process.env.SHORTS_DRY_AUDIO = prevDry;
  });

  it("picks a bed file from the beds directory", () => {
    const bedsDir = fs.mkdtempSync(path.join(os.tmpdir(), "shorts-beds-"));
    const bedPath = path.join(bedsDir, "cleared-bed-a.mp3");
    fs.writeFileSync(bedPath, "fake-mp3");

    const resolved = resolveMusicBed(samplePack(), { bedsDir });
    expect(resolved).toBe(bedPath);
  });

  it("throws when beds are missing in production mode", () => {
    delete process.env.SHORTS_DRY_AUDIO;
    const bedsDir = fs.mkdtempSync(path.join(os.tmpdir(), "shorts-beds-empty-"));
    expect(() => resolveMusicBed(samplePack(), { bedsDir })).toThrow(
      /music beds|cleared/i,
    );
  });

  it("returns a silent wav stub path when beds missing and SHORTS_DRY_AUDIO=1", () => {
    process.env.SHORTS_DRY_AUDIO = "1";
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "shorts-music-dry-"));
    const bedsDir = path.join(root, "audio", "beds");
    fs.mkdirSync(bedsDir, { recursive: true });

    const resolved = resolveMusicBed(samplePack(), {
      bedsDir,
      studioRoot: root,
    });
    expect(fs.existsSync(resolved)).toBe(true);
    expect(path.extname(resolved)).toBe(".wav");
    const buf = fs.readFileSync(resolved);
    expect(buf.subarray(0, 4).toString("ascii")).toBe("RIFF");
  });
});
