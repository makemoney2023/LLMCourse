import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import type { ListRevealProps } from "../render/props";
import { toRemotionAudioSrc } from "./remotion-audio-src";

const HOOK_FRAMES = 60;

function HookLine({
  text,
  color,
  accent,
}: {
  text: string;
  color: string;
  accent: string;
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
        fontSize: 64,
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

function NumberedItem({
  n,
  text,
  color,
  accent,
}: {
  n: number;
  text: string;
  color: string;
  accent: string;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateX = interpolate(frame, [0, 10], [48, 0], {
    extrapolateRight: "clamp",
  });
  const badgeScale = interpolate(frame, [0, 12], [0.7, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: "flex",
        alignItems: "center",
        gap: 28,
        maxWidth: 920,
        padding: "0 48px",
      }}
    >
      <div
        style={{
          transform: `scale(${badgeScale})`,
          width: 88,
          height: 88,
          borderRadius: 22,
          backgroundColor: accent,
          color: "#0f172a",
          fontSize: 44,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        {n}
      </div>
      <div
        style={{
          color,
          fontSize: 48,
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        {text}
      </div>
    </div>
  );
}

function EndCard({
  courseName,
  cta,
  brand,
}: {
  courseName: string;
  cta: string;
  brand: ListRevealProps["brand"];
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

export const ListReveal: React.FC<ListRevealProps> = ({
  courseName,
  hook,
  items,
  cta,
  brand,
  durationInFrames,
  audioSrc,
}) => {
  const lastItemEnd =
    items.length > 0
      ? items[items.length - 1]!.startFrame +
        items[items.length - 1]!.durationFrames
      : HOOK_FRAMES;
  const ctaStart = Math.min(lastItemEnd, durationInFrames - 1);
  const ctaDuration = Math.max(1, durationInFrames - ctaStart);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg }}>
      {audioSrc ? <Audio src={toRemotionAudioSrc(audioSrc)} /> : null}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 30% 15%, ${brand.accent}28 0%, transparent 50%), linear-gradient(180deg, ${brand.bg} 0%, #020617 100%)`,
        }}
      />

      <Sequence from={0} durationInFrames={HOOK_FRAMES} premountFor={15}>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <HookLine text={hook} color={brand.fg} accent={brand.accent} />
        </AbsoluteFill>
      </Sequence>

      {items.map((item) => (
        <Sequence
          key={`${item.n}-${item.startFrame}`}
          from={item.startFrame}
          durationInFrames={item.durationFrames}
          premountFor={10}
        >
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <NumberedItem
              n={item.n}
              text={item.text}
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
