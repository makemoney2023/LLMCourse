import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ScriptPack } from "../schema/script-pack";
import { audioCacheDir, writeSilentWav } from "./tts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultStudioRoot = path.resolve(__dirname, "../..");
const defaultBedsDir = path.join(defaultStudioRoot, "audio", "beds");

const BED_EXT = /\.(mp3|wav|m4a|aac|ogg)$/i;

export type ResolveMusicBedOptions = {
  bedsDir?: string;
  studioRoot?: string;
};

function listBeds(bedsDir: string): string[] {
  if (!fs.existsSync(bedsDir)) return [];
  return fs
    .readdirSync(bedsDir)
    .filter((name) => BED_EXT.test(name) && !name.startsWith("."))
    .sort();
}

function pickBed(pack: ScriptPack, files: string[]): string {
  const digest = createHash("sha256").update(pack.id).digest();
  const idx = digest[0]! % files.length;
  return files[idx]!;
}

/**
 * Resolve a cleared music bed for music_caption packs.
 * Throws when the beds folder is empty unless SHORTS_DRY_AUDIO=1
 * (then writes a silent wav stub under out/.audio-cache/).
 */
export function resolveMusicBed(
  pack: ScriptPack,
  opts: ResolveMusicBedOptions = {},
): string {
  const bedsDir = opts.bedsDir ?? defaultBedsDir;
  const studioRoot = opts.studioRoot ?? defaultStudioRoot;
  const files = listBeds(bedsDir);

  if (files.length === 0) {
    if (process.env.SHORTS_DRY_AUDIO === "1") {
      const stub = path.join(
        audioCacheDir(studioRoot),
        `music-dry-${pack.id}.wav`,
      );
      if (!fs.existsSync(stub)) {
        writeSilentWav(stub, Math.min(pack.duration_target_sec, 2));
      }
      return stub;
    }
    throw new Error(
      `No music beds found in ${bedsDir}. Add cleared licensed beds before production (see audio/beds/README.md).`,
    );
  }

  return path.join(bedsDir, pickBed(pack, files));
}
