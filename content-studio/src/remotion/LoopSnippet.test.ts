import path from "node:path";
import { describe, expect, it } from "vitest";
import { scriptPackToLoopSnippetProps } from "../render/props";
import { loadScriptPackFile } from "../write/build-script";

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
});
