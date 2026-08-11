import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import type { TitlePunchProps } from "../render/props";
import { goldenTitlePunchProps } from "./golden-defaults";
import { TitlePunch } from "./TitlePunch";

const calculateMetadata: CalculateMetadataFunction<TitlePunchProps> = ({
  props,
}) => {
  // Prefer input --props; fall back to golden fixture defaults.
  const resolved = {
    ...goldenTitlePunchProps,
    ...props,
    brand: props.brand ?? goldenTitlePunchProps.brand,
    beats: props.beats?.length ? props.beats : goldenTitlePunchProps.beats,
  };

  return {
    props: resolved,
    durationInFrames: resolved.durationInFrames,
    fps: resolved.fps,
    width: 1080,
    height: 1920,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TitlePunch"
      component={TitlePunch}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={goldenTitlePunchProps.durationInFrames}
      defaultProps={goldenTitlePunchProps}
      calculateMetadata={calculateMetadata}
    />
  );
};
