import path from "node:path";
import { describe, expect, it } from "vitest";
import { scriptPackToListRevealProps } from "../render/props";
import { loadScriptPackFile } from "../write/build-script";

describe("ListReveal wiring", () => {
  it("golden fixture yields numbered items and renderable duration", () => {
    const pack = loadScriptPackFile(
      path.resolve(__dirname, "../../fixtures/mental-model-desk-space-01.yaml"),
    );
    const props = scriptPackToListRevealProps(pack);
    expect(props.durationInFrames).toBeGreaterThan(30 * 30);
    expect(props.items.length).toBeGreaterThan(0);
    expect(props.items[0]?.n).toBe(1);
  });
});
