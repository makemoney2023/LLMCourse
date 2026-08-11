import fs from "node:fs";
import path from "node:path";

/** Remotion serves only `public/`; batch audio is staged here for `<Audio>`. */
export const PUBLIC_AUDIO_SUBDIR = "batch-audio";

/**
 * Convert a local filesystem audio path into a public-relative path for Remotion.
 *
 * Absolute paths like `/Users/.../clip.wav` are requested as
 * `http://localhost:3000/Users/...` and 404. Copy into `public/batch-audio/`
 * and return `batch-audio/clip.wav` for composition-side `toRemotionAudioSrc`.
 *
 * Do not call `staticFile()` here — Node has no `window.remotion_staticBase`,
 * so a baked `/batch-audio/...` URL misses the bundle's `/public` prefix.
 */
export function resolveAudioSrc(
  audioPath: string,
  studioRoot: string,
): string {
  if (
    audioPath.startsWith("http://") ||
    audioPath.startsWith("https://") ||
    audioPath.startsWith("data:")
  ) {
    return audioPath;
  }

  const trimmed = audioPath.replace(/^\.\//, "");
  const alreadyPublic =
    trimmed === PUBLIC_AUDIO_SUBDIR ||
    trimmed.startsWith(`${PUBLIC_AUDIO_SUBDIR}/`) ||
    trimmed.startsWith(`/${PUBLIC_AUDIO_SUBDIR}/`);

  if (alreadyPublic) {
    return trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  }

  const abs = path.resolve(audioPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Audio file not found: ${abs}`);
  }

  const basename = path.basename(abs);
  const publicDir = path.join(studioRoot, "public", PUBLIC_AUDIO_SUBDIR);
  fs.mkdirSync(publicDir, { recursive: true });
  const dest = path.join(publicDir, basename);

  if (path.resolve(dest) !== abs) {
    fs.copyFileSync(abs, dest);
  }

  return `${PUBLIC_AUDIO_SUBDIR}/${basename}`;
}
