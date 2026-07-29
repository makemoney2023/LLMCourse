import { describe, expect, it } from "vitest";
import { listModules } from "./load-curriculum";
import { loadSandbox } from "./load-sandboxes";
import { sandboxIdForModule } from "./sandbox-for-module";

describe("sandboxIdForModule", () => {
  it("prefers a module-specific sandbox when one exists", () => {
    const mental = listModules().find((m) => m.slug === "mental-model");
    expect(mental).toBeTruthy();
    expect(sandboxIdForModule(mental!)).toBe("module-mental-model");
    expect(loadSandbox("module-mental-model")).not.toBeNull();
  });

  it("falls back to the workshop session sandbox", () => {
    const tools = listModules().find((m) => m.slug === "tools-and-mcp");
    expect(tools).toBeTruthy();
    // Session 2 sandbox remains the default for modules without a module-* file
    // unless a module-specific file exists.
    const id = sandboxIdForModule(tools!);
    expect(loadSandbox(id)).not.toBeNull();
  });
});
