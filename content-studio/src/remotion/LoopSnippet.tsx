import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import {
  LOOP_NODE_FRAMES,
  type LoopSnippetProps,
} from "../render/props";
import { toRemotionAudioSrc } from "./remotion-audio-src";

const HOOK_FRAMES = 60;
const NODE_FRAMES = LOOP_NODE_FRAMES;

function KineticText({
  text,
  color,
  accent,
  large,
}: {
  text: string;
  color: string;
  accent: string;
  large?: boolean;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 12], [36, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        color,
        fontSize: large ? 64 : 50,
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
        textAlign: "center",
        maxWidth: 900,
        padding: "0 48px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <span style={{ boxShadow: `inset 0 -0.15em 0 ${accent}55` }}>{text}</span>
    </div>
  );
}

function LoopNodeCard({
  nodeLabel,
  brand,
}: {
  nodeLabel: string;
  brand: LoopSnippetProps["brand"];
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 14], [0.85, 1], {
    extrapolateRight: "clamp",
  });
  const ring = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
        opacity,
      }}
    >
      <div
        style={{
          color: brand.fg,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.75,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        Loop node
      </div>
      <div
        style={{
          transform: `scale(${scale})`,
          maxWidth: 880,
          padding: "40px 48px",
          borderRadius: 28,
          border: `3px solid ${brand.accent}`,
          boxShadow: `0 0 0 ${Math.round(ring * 14)}px ${brand.accent}33`,
          background: `linear-gradient(160deg, ${brand.accent}22 0%, transparent 70%)`,
        }}
      >
        <div
          style={{
            color: brand.fg,
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            textAlign: "center",
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          }}
        >
          {nodeLabel}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function EndCard({
  courseName,
  cta,
  brand,
}: {
  courseName: string;
  cta: string;
  brand: LoopSnippetProps["brand"];
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 15], [0.92, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          color: brand.fg,
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          textAlign: "center",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        {courseName}
      </div>
      <div
        style={{
          width: 120,
          height: 8,
          borderRadius: 999,
          backgroundColor: brand.accent,
        }}
      />
      <div
        style={{
          color: brand.fg,
          fontSize: 40,
          fontWeight: 600,
          textAlign: "center",
          maxWidth: 820,
          padding: "0 48px",
          opacity: 0.92,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        {cta}
      </div>
    </AbsoluteFill>
  );
}

export const LoopSnippet: React.FC<LoopSnippetProps> = ({
  courseName,
  hook,
  nodeLabel,
  beats,
  cta,
  brand,
  durationInFrames,
  audioSrc,
}) => {
  const lastBeatEnd =
    beats.length > 0
      ? beats[beats.length - 1]!.startFrame +
        beats[beats.length - 1]!.durationFrames
      : HOOK_FRAMES + NODE_FRAMES;
  const ctaStart = Math.min(lastBeatEnd, durationInFrames - 1);
  const ctaDuration = Math.max(1, durationInFrames - ctaStart);
  const nodeStart = HOOK_FRAMES;
  const nodeDuration = Math.min(
    NODE_FRAMES,
    Math.max(1, (beats[0]?.startFrame ?? nodeStart + NODE_FRAMES) - nodeStart),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg }}>
      {audioSrc ? <Audio src={toRemotionAudioSrc(audioSrc)} /> : null}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${brand.accent}30 0%, transparent 45%), linear-gradient(180deg, ${brand.bg} 0%, #020617 100%)`,
        }}
      />

      <Sequence from={0} durationInFrames={HOOK_FRAMES} premountFor={15}>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <KineticText
            text={hook}
            color={brand.fg}
            accent={brand.accent}
            large
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence
        from={nodeStart}
        durationInFrames={nodeDuration}
        premountFor={12}
      >
        <LoopNodeCard nodeLabel={nodeLabel} brand={brand} />
      </Sequence>

      {beats.map((beat, index) => (
        <Sequence
          key={`${beat.startFrame}-${index}`}
          from={beat.startFrame}
          durationInFrames={beat.durationFrames}
          premountFor={10}
        >
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <KineticText
              text={beat.text}
              color={brand.fg}
              accent={brand.accent}
            />
          </AbsoluteFill>
        </Sequence>
      ))}

      <Sequence from={ctaStart} durationInFrames={ctaDuration} premountFor={15}>
        <EndCard courseName={courseName} cta={cta} brand={brand} />
      </Sequence>
    </AbsoluteFill>
  );
};
