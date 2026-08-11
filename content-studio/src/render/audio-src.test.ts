import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { resolveAudioSrc } from "./audio-src";

const tmpRoots: string[] = [];

afterEach(() => {
  for (const root of tmpRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function makeStudioRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "shorts-studio-"));
  tmpRoots.push(root);
  return root;
}

describe("resolveAudioSrc", () => {
  it("copies a filesystem wav into public/batch-audio and returns a public-relative path", () => {
    const studioRoot = makeStudioRoot();
    const source = path.join(studioRoot, "out", "batch-x", "audio", "clip.wav");
    fs.mkdirSync(path.dirname(source), { recursive: true });
    fs.writeFileSync(source, "RIFF");

    const src = resolveAudioSrc(source, studioRoot);

    expect(src).toBe("batch-audio/clip.wav");
    expect(src.startsWith("/Users")).toBe(false);
    expect(src.includes(studioRoot)).toBe(false);

    const staged = path.join(studioRoot, "public", "batch-audio", "clip.wav");
    expect(fs.existsSync(staged)).toBe(true);
    expect(fs.readFileSync(staged, "utf8")).toBe("RIFF");
  });

  it("passes through http(s) URLs unchanged", () => {
    const studioRoot = makeStudioRoot();
    expect(resolveAudioSrc("https://cdn.example/a.mp3", studioRoot)).toBe(
      "https://cdn.example/a.mp3",
    );
  });

  it("normalizes an already-staged public relative path", () => {
    const studioRoot = makeStudioRoot();
    const staged = path.join(studioRoot, "public", "batch-audio", "ready.wav");
    fs.mkdirSync(path.dirname(staged), { recursive: true });
    fs.writeFileSync(staged, "ok");

    expect(resolveAudioSrc("/batch-audio/ready.wav", studioRoot)).toBe(
      "batch-audio/ready.wav",
    );
  });

});
