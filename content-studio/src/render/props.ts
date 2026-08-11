import { brandTokens } from "../../brand/tokens";
import type { HookSeries } from "../extract/extract-hooks";
import type { ScriptPack } from "../schema/script-pack";

const FPS = 30 as const;
const HOOK_FRAMES = 2 * FPS;
/** Post-hook window reserved for LoopSnippet node card before beats. */
export const LOOP_NODE_FRAMES = 2 * FPS;
const CTA_FRAMES = 3 * FPS;
const MAX_CAPTION_LENGTH = 80;

export type CompositionId = "TitlePunch" | "ListReveal" | "LoopSnippet";

export type BrandProps = { bg: string; fg: string; accent: string };

export type TimedBeat = {
  text: string;
  startFrame: number;
  durationFrames: number;
};

export type TitlePunchProps = {
  courseName: string;
  hook: string;
  beats: TimedBeat[];
  cta: string;
  brand: BrandProps;
  fps: 30;
  durationInFrames: number;
  /** Optional voiceover or music bed path/URL for Remotion <Audio>. */
  audioSrc?: string;
};

export type ListRevealProps = {
  courseName: string;
  hook: string;
  items: { n: number; text: string; startFrame: number; durationFrames: number }[];
  cta: string;
  brand: BrandProps;
  fps: 30;
  durationInFrames: number;
  audioSrc?: string;
};

export type LoopSnippetProps = {
  courseName: string;
  hook: string;
  /** Highlighted context-loop node (from pack.anchor). */
  nodeLabel: string;
  beats: TimedBeat[];
  cta: string;
  brand: BrandProps;
  fps: 30;
  durationInFrames: number;
  audioSrc?: string;
};

export type PropAudioOpts = { audioSrc?: string };

function truncateCaption(text: string, maxLength = MAX_CAPTION_LENGTH): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
}

function brandFromTokens(): BrandProps {
  return {
    bg: brandTokens.bg,
    fg: brandTokens.fg,
    accent: brandTokens.accent,
  };
}

function allocateTimedBeats(
  pack: ScriptPack,
  reservedAfterHook = 0,
): {
  beats: TimedBeat[];
  durationInFrames: number;
} {
  const durationInFrames = pack.duration_target_sec * FPS;
  const beatCount = pack.beats.length;
  const remainingFrames = Math.max(
    0,
    durationInFrames - HOOK_FRAMES - reservedAfterHook - CTA_FRAMES,
  );
  // Even split of the post-hook (and optional node) → CTA window.
  // Prefer ~45 frames/beat when room allows; drop below 45 rather than
  // overflowing durationInFrames.
  const durationFramesPerBeat = Math.max(
    1,
    Math.floor(remainingFrames / beatCount),
  );

  let startFrame = HOOK_FRAMES + reservedAfterHook;
  const beats = pack.beats.map((beat) => {
    const timedBeat = {
      text: truncateCaption(beat.text),
      startFrame,
      durationFrames: durationFramesPerBeat,
    };
    startFrame += durationFramesPerBeat;
    return timedBeat;
  });

  return { beats, durationInFrames };
}

export function compositionForSeries(series: HookSeries): CompositionId {
  if (series === "myth_fix") return "ListReveal";
  if (series === "loop_moment") return "LoopSnippet";
  return "TitlePunch";
}

export function scriptPackToTitlePunchProps(
  pack: ScriptPack,
  opts?: PropAudioOpts,
): TitlePunchProps {
  const { beats, durationInFrames } = allocateTimedBeats(pack);

  return {
    courseName: brandTokens.courseName,
    hook: pack.hook,
    beats,
    cta: pack.cta,
    brand: brandFromTokens(),
    fps: FPS,
    durationInFrames,
    ...(opts?.audioSrc ? { audioSrc: opts.audioSrc } : {}),
  };
}

export function scriptPackToListRevealProps(
  pack: ScriptPack,
  opts?: PropAudioOpts,
): ListRevealProps {
  const { beats, durationInFrames } = allocateTimedBeats(pack);

  return {
    courseName: brandTokens.courseName,
    hook: pack.hook,
    items: beats.map((beat, index) => ({
      n: index + 1,
      text: beat.text,
      startFrame: beat.startFrame,
      durationFrames: beat.durationFrames,
    })),
    cta: pack.cta,
    brand: brandFromTokens(),
    fps: FPS,
    durationInFrames,
    ...(opts?.audioSrc ? { audioSrc: opts.audioSrc } : {}),
  };
}

export function scriptPackToLoopSnippetProps(
  pack: ScriptPack,
  opts?: PropAudioOpts,
): LoopSnippetProps {
  const { beats, durationInFrames } = allocateTimedBeats(
    pack,
    LOOP_NODE_FRAMES,
  );

  return {
    courseName: brandTokens.courseName,
    hook: pack.hook,
    nodeLabel: pack.anchor,
    beats,
    cta: pack.cta,
    brand: brandFromTokens(),
    fps: FPS,
    durationInFrames,
    ...(opts?.audioSrc ? { audioSrc: opts.audioSrc } : {}),
  };
}

/** Pick the Remotion prop builder for a composition id. */
export function scriptPackToCompositionProps(
  pack: ScriptPack,
  compositionId: CompositionId,
  opts?: PropAudioOpts,
): TitlePunchProps | ListRevealProps | LoopSnippetProps {
  if (compositionId === "ListReveal") {
    return scriptPackToListRevealProps(pack, opts);
  }
  if (compositionId === "LoopSnippet") {
    return scriptPackToLoopSnippetProps(pack, opts);
  }
  return scriptPackToTitlePunchProps(pack, opts);
}
