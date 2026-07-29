import type { ModuleMeta } from "./types";
import { loadSandbox } from "./load-sandboxes";

/** Prefer a module-specific try-it sandbox; fall back to the workshop session sandbox. */
export function sandboxIdForModule(module: ModuleMeta): string {
  const moduleId = `module-${module.slug}`;
  if (loadSandbox(moduleId)) return moduleId;
  return `session-0${module.workshopSession}`;
}
