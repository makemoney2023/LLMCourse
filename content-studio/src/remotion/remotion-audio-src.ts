import { staticFile } from "remotion";

/**
 * Resolve `audioSrc` for Remotion `<Audio>` inside a composition (browser/bundle).
 * Remote URLs pass through; public-relative paths go through `staticFile()`.
 *
 * Keep this free of Node builtins — Remotion webpack cannot bundle `node:fs`.
 */
export function toRemotionAudioSrc(audioSrc: string): string {
  if (
    audioSrc.startsWith("http://") ||
    audioSrc.startsWith("https://") ||
    audioSrc.startsWith("data:")
  ) {
    return audioSrc;
  }
  return staticFile(audioSrc.replace(/^\//, ""));
}
