import type { ScriptPack } from "../schema/script-pack";

const COURSE_ORIGIN = "https://llm-leverage-course.vercel.app";

export function courseUrlWithUtm(packId: string): string {
  return `${COURSE_ORIGIN}?utm_source=youtube&utm_medium=shorts&utm_campaign=${packId}`;
}

/** YouTube description: CTA + course URL with per-short UTM campaign. */
export function buildDescription(pack: ScriptPack): string {
  return `${pack.cta}\n\n${courseUrlWithUtm(pack.id)}`;
}
