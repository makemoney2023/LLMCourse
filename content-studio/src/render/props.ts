import { brandTokens } from "../../brand/tokens";
import type { ScriptPack } from "../schema/script-pack";

const FPS = 30 as const;
const HOOK_FRAMES = 2 * FPS;
const CTA_FRAMES = 3 * FPS;
const MAX_CAPTION_LENGTH = 80;

export type TitlePunchProps = {
  courseName: string;
  hook: string;
  beats: { text: string; startFrame: number; durationFrames: number }[];
  cta: string;
  brand: { bg: string; fg: string; accent: string };
  fps: 30;
  durationInFrames: number;
};

function truncateCaption(text: string, maxLength = MAX_CAPTION_LENGTH): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
}

export function scriptPackToTitlePunchProps(pack: ScriptPack): TitlePunchProps {
  const durationInFrames = pack.duration_target_sec * FPS;
  const beatCount = pack.beats.length;
  const remainingFrames = Math.max(0, durationInFrames - HOOK_FRAMES - CTA_FRAMES);
  // Even split of the hook→CTA window. Prefer ~45 frames/beat when room allows
  // (remaining/n ≥ 45); drop below 45 rather than overflowing durationInFrames.
  const durationFramesPerBeat = Math.max(
    1,
    Math.floor(remainingFrames / beatCount),
  );

  let startFrame = HOOK_FRAMES;
  const beats = pack.beats.map((beat) => {
    const timedBeat = {
      text: truncateCaption(beat.text),
      startFrame,
      durationFrames: durationFramesPerBeat,
    };
    startFrame += durationFramesPerBeat;
    return timedBeat;
  });

  return {
    courseName: brandTokens.courseName,
    hook: pack.hook,
    beats,
    cta: pack.cta,
    brand: {
      bg: brandTokens.bg,
      fg: brandTokens.fg,
      accent: brandTokens.accent,
    },
    fps: FPS,
    durationInFrames,
  };
}
