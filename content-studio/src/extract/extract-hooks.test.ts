import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractHooks } from "./extract-hooks";

const moduleDirPath = path.resolve(
  __dirname,
  "../../../curriculum/modules/01-mental-model",
);

describe("extractHooks", () => {
  it("returns at least one candidate from Module 1 objectives/toolMapping", () => {
    const hooks = extractHooks(moduleDirPath);
    expect(hooks.length).toBeGreaterThan(0);
    expect(hooks[0]?.moduleSlug).toBe("mental-model");
    expect(hooks[0]?.anchor.length).toBeGreaterThan(3);
    expect(hooks.every((h) => h.moduleDir === "01-mental-model")).toBe(true);
  });

  it("includes a context-window / desk-space style anchor when present in curriculum", () => {
    const hooks = extractHooks(moduleDirPath);
    const joined = hooks.map((h) => h.anchor.toLowerCase()).join(" ");
    expect(joined).toMatch(/desk|context|window|loop/);
  });

  it("derives one_idea candidates from objectives with source equal to objective text", () => {
    const hooks = extractHooks(moduleDirPath);
    const objectiveHooks = hooks.filter(
      (h) =>
        h.series === "one_idea" &&
        h.source === h.anchor &&
        h.source ===
          "Tell the difference between a simple chat and a helper that uses tools.",
    );
    expect(objectiveHooks.length).toBeGreaterThanOrEqual(1);
  });

  it("derives one_idea candidates from toolMapping abstraction and surfaces", () => {
    const hooks = extractHooks(moduleDirPath);
    const toolMappingHooks = hooks.filter(
      (h) =>
        h.series === "one_idea" &&
        h.anchor.startsWith("Context window:") &&
        h.anchor.includes("Chat history limits") &&
        h.source === h.anchor,
    );
    expect(toolMappingHooks.length).toBeGreaterThanOrEqual(1);

    const agentLoopHooks = hooks.filter(
      (h) =>
        h.series === "one_idea" &&
        h.anchor.startsWith("Agent loop:") &&
        h.anchor.includes("Tool-using assistants"),
    );
    expect(agentLoopHooks.length).toBeGreaterThanOrEqual(1);
  });

  it("derives exactly one loop_moment candidate from loopPlacement", () => {
    const hooks = extractHooks(moduleDirPath);
    const loopMoments = hooks.filter((h) => h.series === "loop_moment");
    expect(loopMoments).toHaveLength(1);
    expect(loopMoments[0]?.anchor).toBe(
      "This map shows the whole loop. Later modules zoom in on each part.",
    );
    expect(loopMoments[0]?.source).toBe(loopMoments[0]?.anchor);
  });

  it("sets moduleDir to folder basename and moduleSlug from yaml slug", () => {
    const hooks = extractHooks(moduleDirPath);
    expect(hooks.length).toBeGreaterThan(0);
    expect(hooks.every((h) => h.moduleDir === "01-mental-model")).toBe(true);
    expect(hooks.every((h) => h.moduleSlug === "mental-model")).toBe(true);
  });
});
