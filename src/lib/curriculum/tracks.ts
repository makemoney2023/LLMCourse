import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
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

function tracksRoot(): string {
  return path.join(process.cwd(), "curriculum", "tracks");
}

export function listRoleTracks(): RoleTrack[] {
  return TRACK_IDS.map((id) => loadRoleTrack(id)).filter(
    (t): t is RoleTrack => t != null,
  );
}

export function loadRoleTrack(id: RoleTrackId): RoleTrack | null {
  const filePath = path.join(tracksRoot(), `${id}.yaml`);
  if (!fs.existsSync(filePath)) return null;
  const data = parseYaml(fs.readFileSync(filePath, "utf8")) as RoleTrack;
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
