import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ScriptPack } from "../schema/script-pack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultStudioRoot = path.resolve(__dirname, "../..");

const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";

export type SynthesizeVoiceOptions = {
  /** Override content-studio root (cache lives at out/.audio-cache/). */
  studioRoot?: string;
  /** Injected fetch for tests; defaults to global fetch. */
  fetchFn?: typeof fetch;
};

/** sha256 hex of `${voiceId}:${hook}:${beats text}:${cta}`. */
export function voiceCacheKey(pack: ScriptPack, voiceId: string): string {
  const beatsText = pack.beats.map((beat) => beat.text).join("\n");
  return createHash("sha256")
    .update(`${voiceId}:${pack.hook}:${beatsText}:${pack.cta}`)
    .digest("hex");
}

export function audioCacheDir(studioRoot = defaultStudioRoot): string {
  return path.join(studioRoot, "out", ".audio-cache");
}

/** Minimal mono 16-bit PCM WAV (~0.25s of silence at 24kHz). */
export function writeSilentWav(outPath: string, durationSec = 0.25): void {
  const sampleRate = 24_000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = Math.max(1, Math.floor(sampleRate * durationSec));
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  // samples already zeroed → silence

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
}

function packNarrationText(pack: ScriptPack): string {
  return [pack.hook, ...pack.beats.map((b) => b.text), pack.cta].join("\n\n");
}

function copyToOut(cachePath: string, outPath: string): string {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.copyFileSync(cachePath, outPath);
  return outPath;
}

async function callElevenLabs(args: {
  apiKey: string;
  voiceId: string;
  text: string;
  fetchFn: typeof fetch;
}): Promise<Buffer> {
  const url = `${ELEVENLABS_TTS_URL}/${encodeURIComponent(args.voiceId)}`;
  const res = await args.fetchFn(url, {
    method: "POST",
    headers: {
      "xi-api-key": args.apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: args.text,
      model_id: "eleven_multilingual_v2",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `ElevenLabs TTS failed (${res.status}): ${detail.slice(0, 200)}`,
    );
  }

  return Buffer.from(await res.arrayBuffer());
}

/**
 * Synthesize voiceover for a script pack.
 * Uses ElevenLabs when ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID are set.
 * Without keys, writes a silent wav stub only when SHORTS_DRY_AUDIO=1.
 * Caches by voiceCacheKey under out/.audio-cache/.
 */
export async function synthesizeVoice(
  pack: ScriptPack,
  outPath: string,
  opts: SynthesizeVoiceOptions = {},
): Promise<string> {
  const studioRoot = opts.studioRoot ?? defaultStudioRoot;
  const fetchFn = opts.fetchFn ?? fetch;
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim();
  const dry = process.env.SHORTS_DRY_AUDIO === "1";

  if (!apiKey || !voiceId) {
    if (!dry) {
      throw new Error(
        "ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID are required (or set SHORTS_DRY_AUDIO=1 for a silent stub)",
      );
    }

    const key = voiceCacheKey(pack, voiceId || "dry");
    const cachePath = path.join(audioCacheDir(studioRoot), `${key}.wav`);
    if (fs.existsSync(cachePath)) {
      return copyToOut(cachePath, outPath);
    }
    writeSilentWav(cachePath);
    return copyToOut(cachePath, outPath);
  }

  const key = voiceCacheKey(pack, voiceId);
  const cachePath = path.join(audioCacheDir(studioRoot), `${key}.mp3`);
  if (fs.existsSync(cachePath)) {
    return copyToOut(cachePath, outPath);
  }

  const audio = await callElevenLabs({
    apiKey,
    voiceId,
    text: packNarrationText(pack),
    fetchFn,
  });
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, audio);
  return copyToOut(cachePath, outPath);
}
