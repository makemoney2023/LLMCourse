import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import type {
  ListRevealProps,
  LoopSnippetProps,
  TitlePunchProps,
} from "../render/props";
import {
  goldenListRevealProps,
  goldenLoopSnippetProps,
  goldenTitlePunchProps,
} from "./golden-defaults";
import { ListReveal } from "./ListReveal";
import { LoopSnippet } from "./LoopSnippet";
import { TitlePunch } from "./TitlePunch";

const calculateTitlePunchMetadata: CalculateMetadataFunction<
  TitlePunchProps
> = ({ props }) => {
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

const calculateListRevealMetadata: CalculateMetadataFunction<
  ListRevealProps
> = ({ props }) => {
  const resolved = {
    ...goldenListRevealProps,
    ...props,
    brand: props.brand ?? goldenListRevealProps.brand,
    items: props.items?.length ? props.items : goldenListRevealProps.items,
  };

  return {
    props: resolved,
    durationInFrames: resolved.durationInFrames,
    fps: resolved.fps,
    width: 1080,
    height: 1920,
  };
};

const calculateLoopSnippetMetadata: CalculateMetadataFunction<
  LoopSnippetProps
> = ({ props }) => {
  const resolved = {
    ...goldenLoopSnippetProps,
    ...props,
    brand: props.brand ?? goldenLoopSnippetProps.brand,
    beats: props.beats?.length ? props.beats : goldenLoopSnippetProps.beats,
    nodeLabel: props.nodeLabel || goldenLoopSnippetProps.nodeLabel,
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
    <>
      <Composition
        id="TitlePunch"
        component={TitlePunch}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={goldenTitlePunchProps.durationInFrames}
        defaultProps={goldenTitlePunchProps}
        calculateMetadata={calculateTitlePunchMetadata}
      />
      <Composition
        id="ListReveal"
        component={ListReveal}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={goldenListRevealProps.durationInFrames}
        defaultProps={goldenListRevealProps}
        calculateMetadata={calculateListRevealMetadata}
      />
      <Composition
        id="LoopSnippet"
        component={LoopSnippet}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={goldenLoopSnippetProps.durationInFrames}
        defaultProps={goldenLoopSnippetProps}
        calculateMetadata={calculateLoopSnippetMetadata}
      />
    </>
  );
};
