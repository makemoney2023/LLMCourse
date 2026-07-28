import type { CourseProgress, ModuleMeta } from "@/lib/curriculum/types";

export const SESSION_MODULE_IDS: Record<string, string[]> = {
  "session-1-pack": ["mental-model", "deep-research", "system-instructions"],
  "session-2-runbook": [
    "standing-playbooks",
    "tools-and-mcp",
    "retrieval-and-grounding",
  ],
  "session-3-scale": [
    "conversation-and-compaction",
    "memory-systems",
    "delegation",
  ],
  "session-4-craft": ["human-craft", "verify-and-harden", "capstone-lab"],
};

export function modulesComplete(
  progress: CourseProgress,
  moduleIds: string[],
): boolean {
  return moduleIds.every((id) => progress.completedModules.includes(id));
}

export function computeCheckpoints(progress: CourseProgress): string[] {
  const earned: string[] = [];
  if (
    modulesComplete(progress, SESSION_MODULE_IDS["session-1-pack"]!) &&
    progress.packSavedAck
  ) {
    earned.push("session-1-pack");
  }
  if (modulesComplete(progress, SESSION_MODULE_IDS["session-2-runbook"]!)) {
    earned.push("session-2-runbook");
  }
  if (modulesComplete(progress, SESSION_MODULE_IDS["session-3-scale"]!)) {
    earned.push("session-3-scale");
  }
  if (modulesComplete(progress, SESSION_MODULE_IDS["session-4-craft"]!)) {
    earned.push("session-4-craft");
  }
  if (progress.completedModules.length >= 12) {
    earned.push("course-complete");
  }
  return earned;
}

export function moduleCertificateUnlocked(
  progress: CourseProgress,
  moduleId: string,
): boolean {
  return (
    progress.completedModules.includes(moduleId) &&
    progress.quizScores[moduleId] != null
  );
}

export function listCertificateIds(
  progress: CourseProgress,
  modules: ModuleMeta[],
): string[] {
  const ids: string[] = [];
  for (const mod of modules) {
    if (moduleCertificateUnlocked(progress, mod.id)) {
      ids.push(`module-${mod.id}`);
    }
  }
  ids.push(...computeCheckpoints(progress).map((c) => `checkpoint-${c}`));
  return ids;
}
