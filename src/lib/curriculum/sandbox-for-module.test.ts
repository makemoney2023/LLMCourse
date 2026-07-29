import { describe, expect, it } from "vitest";
import { listModules } from "./load-curriculum";
import { listSandboxes, loadSandbox } from "./load-sandboxes";
import { sandboxIdForModule } from "./sandbox-for-module";

describe("sandboxIdForModule", () => {
  it("prefers a module-specific sandbox when one exists", () => {
    const mental = listModules().find((m) => m.slug === "mental-model");
    expect(mental).toBeTruthy();
    expect(sandboxIdForModule(mental!)).toBe("module-mental-model");
    expect(loadSandbox("module-mental-model")).not.toBeNull();
  });

  it("resolves a loadable sandbox for every module", () => {
    for (const mod of listModules()) {
      const id = sandboxIdForModule(mod);
      expect(loadSandbox(id), `${mod.slug} → ${id}`).not.toBeNull();
    }
  });

  it("keeps session sandboxes available for workshops", () => {
    const ids = listSandboxes().map((s) => s.id);
    for (const session of [
      "session-01",
      "session-02",
      "session-03",
      "session-04",
    ]) {
      expect(ids).toContain(session);
    }
  });
});
