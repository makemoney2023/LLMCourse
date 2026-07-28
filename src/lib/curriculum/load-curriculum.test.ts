import { describe, expect, it } from "vitest";
import {
  getModuleBySlug,
  listModules,
  listWorkshopSessions,
  loadModuleContent,
} from "./load-curriculum";

describe("listModules", () => {
  it("returns eleven modules sorted by order", () => {
    const modules = listModules();
    expect(modules).toHaveLength(12);
    expect(modules.map((m) => m.order)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(modules[0]?.slug).toBe("mental-model");
    expect(modules[1]?.slug).toBe("deep-research");
    expect(modules[11]?.slug).toBe("capstone-lab");
  });

  it("includes loop placement and workshop session on each module", () => {
    const modules = listModules();
    for (const mod of modules) {
      expect(mod.loopPlacement.length).toBeGreaterThan(10);
      expect(mod.workshopSession).toBeGreaterThanOrEqual(1);
      expect(mod.workshopSession).toBeLessThanOrEqual(4);
      expect(mod.objectives.length).toBeGreaterThan(0);
    }
  });
});

describe("getModuleBySlug", () => {
  it("returns a module for a known slug", () => {
    const mod = getModuleBySlug("tools-and-mcp");
    expect(mod?.title).toBe("Tools & MCP");
    expect(mod?.order).toBe(5);
  });

  it("returns null for an unknown slug", () => {
    expect(getModuleBySlug("does-not-exist")).toBeNull();
  });
});

describe("loadModuleContent", () => {
  it("loads lesson, exercises, workshop, and diagram when present", () => {
    const content = loadModuleContent("mental-model");
    expect(content).not.toBeNull();
    expect(content?.lessonMarkdown.length).toBeGreaterThan(50);
    expect(content?.exercisesMarkdown.length).toBeGreaterThan(20);
    expect(content?.diagramSource).toContain("flowchart");
  });
});

describe("listWorkshopSessions", () => {
  it("returns four workshop sessions", () => {
    const sessions = listWorkshopSessions();
    expect(sessions).toHaveLength(4);
    expect(sessions[0]?.id).toBe("session-01");
    expect(sessions[0]?.moduleSlugs).toEqual([
      "mental-model",
      "deep-research",
      "system-instructions",
    ]);
  });
});
