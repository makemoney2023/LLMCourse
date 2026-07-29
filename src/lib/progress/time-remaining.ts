import type { CourseProgress } from "@/lib/curriculum/types";

export type ModuleDuration = { id: string; durationMinutes: number };

/** Total minutes of modules the learner has not completed yet. */
export function remainingMinutes(
  progress: CourseProgress,
  modules: ModuleDuration[],
): number {
  return modules
    .filter((m) => !progress.completedModules.includes(m.id))
    .reduce((sum, m) => sum + m.durationMinutes, 0);
}

/** "45m", "2h", "2h 35m" */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
}
