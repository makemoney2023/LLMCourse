import path from "node:path";
import { describe, expect, it } from "vitest";
import { scriptPackToTitlePunchProps } from "../render/props";
import { loadScriptPackFile } from "../write/build-script";

describe("TitlePunch wiring", () => {
  it("golden fixture yields renderable duration", () => {
    const pack = loadScriptPackFile(
      path.resolve(__dirname, "../../fixtures/mental-model-desk-space-01.yaml"),
    );
    const props = scriptPackToTitlePunchProps(pack);
    expect(props.durationInFrames).toBeGreaterThan(30 * 30);
    expect(props.hook.length).toBeGreaterThan(0);
  });
});
