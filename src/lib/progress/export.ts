import type { CourseProgress } from "@/lib/curriculum/types";
import { deserializeProgress } from "./progress";

export const PROGRESS_EXPORT_FILENAME = "llm-leverage-progress.json";

/**
 * Parse a learner-provided progress backup. Unlike `deserializeProgress`
 * (which falls back to empty progress), this returns null for anything that
 * is not recognizably a progress file, so a bad import never wipes progress.
 */
export function parseProgressFile(raw: string): CourseProgress | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed) ||
    !Array.isArray((parsed as { completedModules?: unknown }).completedModules)
  ) {
    return null;
  }
  return deserializeProgress(raw);
}
