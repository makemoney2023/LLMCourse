import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseScriptPack } from "../schema/script-pack";
import { buildScriptFromHook, loadScriptPackFile } from "./build-script";
import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";

describe("buildScriptFromHook", () => {
  it("rewrites plain anchors into punchy hooks", () => {
    const anchor = "Standing playbooks";
    const pack = buildScriptFromHook({
      moduleDir: "02-playbooks",
      moduleSlug: "playbooks",
      anchor,
      source: "One sentence only.",
      series: "one_idea",
    });
    expect(pack.hook.trim().toLowerCase()).not.toBe(anchor.trim().toLowerCase());
    expect(pack.hook.replace(/\.$/, "").trim().toLowerCase()).not.toBe(
      anchor.trim().toLowerCase(),
    );
    expect(pack.hook.length).toBeGreaterThan(anchor.length);
    expect(pack.hook.length).toBeLessThanOrEqual(80);
  });

  it("uses the first four sentences when source has five or more", () => {
    const source =
      "First sentence here. Second sentence here. Third sentence here. Fourth sentence here. Fifth sentence should be dropped.";
    const pack = buildScriptFromHook({
      moduleDir: "01-mental-model",
      moduleSlug: "mental-model",
      anchor: "Test anchor",
      source,
      series: "one_idea",
    });
    expect(pack.beats).toHaveLength(4);
    expect(pack.beats.map((beat) => beat.text)).toEqual([
      "First sentence here.",
      "Second sentence here.",
      "Third sentence here.",
      "Fourth sentence here.",
    ]);
  });

  it("builds a valid pack with cta and 2–4 beats", () => {
    const pack = buildScriptFromHook({
      moduleDir: "01-mental-model",
      moduleSlug: "mental-model",
      anchor: "Context window = desk space",
      source: "Explain the context window like desk space that can fill up.",
      series: "one_idea",
    });
    expect(pack.module).toBe("01-mental-model");
    expect(pack.cta.toLowerCase()).toMatch(/llm leverage|course/);
    expect(pack.beats.length).toBeGreaterThanOrEqual(2);
    expect(pack.beats.length).toBeLessThanOrEqual(4);
    expect(pack.duration_target_sec).toBeGreaterThanOrEqual(30);
    expect(pack.duration_target_sec).toBeLessThanOrEqual(55);
  });
});

describe("golden fixture", () => {
  it("parses mental-model-desk-space-01.yaml", () => {
    const file = path.resolve(
      __dirname,
      "../../fixtures/mental-model-desk-space-01.yaml",
    );
    const pack = loadScriptPackFile(file);
    expect(pack.id).toBe("mental-model-desk-space-01");
    expect(pack.anchor.toLowerCase()).toMatch(/desk|context/);
  });
});
