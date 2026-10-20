import { parse as parseYaml } from "yaml";
import { readProjectText } from "@/lib/files/project-files";
import type { RoleTrackId } from "./types";

export type TrackModuleOverlay = {
  story: string;
  exampleAsk: string;
  watchOut: string;
};

export type RoleTrack = {
  id: RoleTrackId;
  label: string;
  modules: Record<string, TrackModuleOverlay>;
};

const TRACK_IDS: RoleTrackId[] = [
  "general",
  "ops",
  "sales",
  "eng",
  "marketing",
];

export function listRoleTracks(): RoleTrack[] {
  return TRACK_IDS.map((id) => loadRoleTrack(id)).filter(
    (t): t is RoleTrack => t != null,
  );
}

export function loadRoleTrack(id: RoleTrackId): RoleTrack | null {
  const raw = readProjectText(`curriculum/tracks/${id}.yaml`);
  if (!raw) return null;
  const data = parseYaml(raw) as RoleTrack;
  return {
    id: data.id ?? id,
    label: data.label ?? id,
    modules: data.modules ?? {},
  };
}

export function getTrackOverlay(
  trackId: RoleTrackId,
  moduleSlug: string,
): TrackModuleOverlay | null {
  const track = loadRoleTrack(trackId);
  const general = loadRoleTrack("general");
  return (
    track?.modules[moduleSlug] ?? general?.modules[moduleSlug] ?? null
  );
}
