import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  LOOP_NODE_FRAMES,
  scriptPackToLoopSnippetProps,
} from "../render/props";
import { loadScriptPackFile } from "../write/build-script";

const HOOK_FRAMES = 60;

describe("LoopSnippet wiring", () => {
  it("golden fixture yields nodeLabel from anchor and renderable duration", () => {
    const pack = loadScriptPackFile(
      path.resolve(__dirname, "../../fixtures/mental-model-desk-space-01.yaml"),
    );
    const props = scriptPackToLoopSnippetProps(pack);
    expect(props.durationInFrames).toBeGreaterThan(30 * 30);
    expect(props.nodeLabel).toBe(pack.anchor);
    expect(props.beats.length).toBeGreaterThan(0);
  });

  it("keeps a multi-frame node window before the first beat", () => {
    const pack = loadScriptPackFile(
      path.resolve(__dirname, "../../fixtures/mental-model-desk-space-01.yaml"),
    );
    const props = scriptPackToLoopSnippetProps(pack);
    const nodeWindowDuration = props.beats[0]!.startFrame - HOOK_FRAMES;
    expect(nodeWindowDuration).toBeGreaterThan(1);
    expect(props.beats[0]!.startFrame).toBe(HOOK_FRAMES + LOOP_NODE_FRAMES);
  });
});
