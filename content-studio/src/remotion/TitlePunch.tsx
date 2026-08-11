import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import type { TitlePunchProps } from "../render/props";

const HOOK_FRAMES = 60;

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
        fontSize: large ? 72 : 54,
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

function EndCard({
  courseName,
  cta,
  brand,
}: {
  courseName: string;
  cta: string;
  brand: TitlePunchProps["brand"];
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

export const TitlePunch: React.FC<TitlePunchProps> = ({
  courseName,
  hook,
  beats,
  cta,
  brand,
  durationInFrames,
}) => {
  const lastBeatEnd =
    beats.length > 0
      ? beats[beats.length - 1]!.startFrame +
        beats[beats.length - 1]!.durationFrames
      : HOOK_FRAMES;
  const ctaStart = Math.min(lastBeatEnd, durationInFrames - 1);
  const ctaDuration = Math.max(1, durationInFrames - ctaStart);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${brand.accent}22 0%, transparent 55%), linear-gradient(180deg, ${brand.bg} 0%, #020617 100%)`,
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
