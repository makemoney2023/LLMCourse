import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractHooks } from "./extract-hooks";

const moduleDir = path.resolve(
  __dirname,
  "../../../curriculum/modules/01-mental-model",
);

describe("extractHooks", () => {
  it("returns at least one candidate from Module 1 objectives/toolMapping", () => {
    const hooks = extractHooks(moduleDir);
    expect(hooks.length).toBeGreaterThan(0);
    expect(hooks[0]?.moduleSlug).toBe("mental-model");
    expect(hooks[0]?.anchor.length).toBeGreaterThan(3);
    expect(hooks.every((h) => h.moduleDir.includes("01-mental-model"))).toBe(true);
  });

  it("includes a context-window / desk-space style anchor when present in curriculum", () => {
    const hooks = extractHooks(moduleDir);
    const joined = hooks.map((h) => h.anchor.toLowerCase()).join(" ");
    expect(joined).toMatch(/desk|context|window|loop/);
  });
});
