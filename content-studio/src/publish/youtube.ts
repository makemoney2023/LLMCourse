import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { parseScriptPack, type ScriptPack } from "../schema/script-pack";
import { isApproved, parseApproval, type ApprovalFile } from "./approval";
import { buildDescription } from "./description";

export type PublishPlanItem = {
  id: string;
  title: string;
  description: string;
  publishAt: string;
};

export type PublishResult = {
  planned: PublishPlanItem[];
  skipped: string[];
  planPath?: string;
};

export type PublishBatchOptions = {
  dryRun: boolean;
  startDate: string;
};

const NY_TZ = "America/New_York";

function addCalendarDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(y!, m! - 1, d! + days));
  const year = utc.getUTCFullYear();
  const month = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function zonedParts(
  date: Date,
  timeZone: string,
): { year: number; month: number; day: number; hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);

  let hour = get("hour");
  // Some engines emit 24 for midnight
  if (hour === 24) hour = 0;

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour,
    minute: get("minute"),
  };
}

/** Instant for `YYYY-MM-DD` at 09:00 in America/New_York, as ISO UTC. */
export function nineAmEasternIso(startDate: string, dayOffset = 0): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    throw new Error(`Invalid startDate (expected YYYY-MM-DD): ${startDate}`);
  }

  const ymd = addCalendarDays(startDate, dayOffset);
  const [year, month, day] = ymd.split("-").map(Number);
  // First guess: treat local wall time as UTC, then correct via Intl offset.
  let utcMs = Date.UTC(year!, month! - 1, day!, 9, 0, 0, 0);

  for (let i = 0; i < 4; i += 1) {
    const parts = zonedParts(new Date(utcMs), NY_TZ);
    const asUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      0,
      0,
    );
    const targetAsUtc = Date.UTC(year!, month! - 1, day!, 9, 0, 0, 0);
    const delta = targetAsUtc - asUtc;
    if (delta === 0) break;
    utcMs += delta;
  }

  return new Date(utcMs).toISOString();
}

function loadApproval(batchDir: string): ApprovalFile {
  const approvalPath = path.join(batchDir, "approval.yaml");
  if (!fs.existsSync(approvalPath)) {
    throw new Error(`Missing approval.yaml in ${batchDir}`);
  }
  return parseApproval(parseYaml(fs.readFileSync(approvalPath, "utf8")));
}

function loadScriptPack(batchDir: string, id: string): ScriptPack {
  const scriptPath = path.join(batchDir, "scripts", `${id}.yaml`);
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Missing script for approved id: ${id}`);
  }
  return parseScriptPack(parseYaml(fs.readFileSync(scriptPath, "utf8")));
}

export async function publishBatch(
  batchDir: string,
  opts: PublishBatchOptions,
): Promise<PublishResult> {
  const approval = loadApproval(batchDir);
  const skipped: string[] = [];
  const approvedIds: string[] = [];

  for (const item of approval.items) {
    if (isApproved(approval, item.id)) {
      approvedIds.push(item.id);
    } else {
      skipped.push(item.id);
    }
  }

  if (approvedIds.length === 0) {
    throw new Error("no approved shorts to publish");
  }

  const planned: PublishPlanItem[] = approvedIds.map((id, index) => {
    const pack = loadScriptPack(batchDir, id);
    return {
      id: pack.id,
      title: pack.hook,
      description: buildDescription(pack),
      publishAt: nineAmEasternIso(opts.startDate, index),
    };
  });

  if (!opts.dryRun) {
    throw new Error(
      "Live YouTube publish is not implemented yet; use dryRun: true",
    );
  }

  const planPath = path.join(batchDir, "publish-plan.json");
  fs.writeFileSync(
    planPath,
    JSON.stringify({ items: planned }, null, 2),
    "utf8",
  );

  return { planned, skipped, planPath };
}
