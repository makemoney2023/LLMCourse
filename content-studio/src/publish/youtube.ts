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

export type UploadedShort = {
  id: string;
  videoId: string;
  publishAt: string;
};

export type PublishResult = {
  planned: PublishPlanItem[];
  skipped: string[];
  planPath?: string;
  uploaded?: UploadedShort[];
};

export type PublishBatchOptions = {
  dryRun: boolean;
  startDate: string;
  /** Injected fetch for tests; defaults to global fetch. */
  fetchFn?: typeof fetch;
};

export type YoutubeOAuthCredentials = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

export type VideoInsertBody = {
  snippet: {
    title: string;
    description: string;
    categoryId: string;
  };
  status: {
    privacyStatus: "private";
    publishAt: string;
    selfDeclaredMadeForKids: boolean;
  };
};

const NY_TZ = "America/New_York";
const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const RESUMABLE_UPLOAD_URL =
  "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";

/** People & Blogs — reasonable default for educational Shorts. */
const DEFAULT_CATEGORY_ID = "22";

/** YouTube title hard limit. */
export const YOUTUBE_TITLE_MAX_CHARS = 100;

export function clampYoutubeTitle(title: string): string {
  if (title.length <= YOUTUBE_TITLE_MAX_CHARS) return title;
  return title.slice(0, YOUTUBE_TITLE_MAX_CHARS);
}

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

/**
 * YouTube Data API videos.insert body for a scheduled Short.
 * `privacyStatus` must stay `private` when `publishAt` is set; YouTube
 * flips visibility at the scheduled time.
 */
export function buildVideoInsertBody(item: PublishPlanItem): VideoInsertBody {
  return {
    snippet: {
      title: item.title,
      description: item.description,
      categoryId: DEFAULT_CATEGORY_ID,
    },
    status: {
      privacyStatus: "private",
      publishAt: item.publishAt,
      selfDeclaredMadeForKids: false,
    },
  };
}

export function readYoutubeCredentialsFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): YoutubeOAuthCredentials {
  const clientId = env.YOUTUBE_CLIENT_ID?.trim();
  const clientSecret = env.YOUTUBE_CLIENT_SECRET?.trim();
  const refreshToken = env.YOUTUBE_REFRESH_TOKEN?.trim();
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Live publish requires YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN",
    );
  }
  return { clientId, clientSecret, refreshToken };
}

export async function refreshAccessToken(
  creds: YoutubeOAuthCredentials,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  const body = new URLSearchParams({
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    refresh_token: creds.refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetchFn(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube OAuth refresh failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error("YouTube OAuth refresh response missing access_token");
  }
  return json.access_token;
}

export async function uploadScheduledShort(args: {
  accessToken: string;
  filePath: string;
  item: PublishPlanItem;
  fetchFn?: typeof fetch;
}): Promise<{ videoId: string }> {
  const fetchFn = args.fetchFn ?? fetch;
  if (!fs.existsSync(args.filePath)) {
    throw new Error(`Missing render for upload: ${args.filePath}`);
  }

  const fileBytes = fs.readFileSync(args.filePath);
  const insertBody = buildVideoInsertBody(args.item);

  const initRes = await fetchFn(RESUMABLE_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Length": String(fileBytes.byteLength),
      "X-Upload-Content-Type": "video/mp4",
    },
    body: JSON.stringify(insertBody),
  });

  if (!initRes.ok) {
    const text = await initRes.text();
    throw new Error(
      `YouTube resumable session failed (${initRes.status}): ${text}`,
    );
  }

  const uploadUrl = initRes.headers.get("Location");
  if (!uploadUrl) {
    throw new Error("YouTube resumable session missing Location header");
  }

  const putRes = await fetchFn(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${args.accessToken}`,
      "Content-Type": "video/mp4",
      "Content-Length": String(fileBytes.byteLength),
    },
    body: fileBytes,
  });

  if (!putRes.ok) {
    const text = await putRes.text();
    throw new Error(`YouTube upload failed (${putRes.status}): ${text}`);
  }

  const json = (await putRes.json()) as { id?: string };
  if (!json.id) {
    throw new Error("YouTube upload response missing video id");
  }
  return { videoId: json.id };
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

function renderPathFor(batchDir: string, id: string): string {
  return path.join(batchDir, "renders", `${id}.mp4`);
}

function publishResultPath(batchDir: string): string {
  return path.join(batchDir, "publish-result.json");
}

function loadPriorUploads(batchDir: string): UploadedShort[] {
  const resultPath = publishResultPath(batchDir);
  if (!fs.existsSync(resultPath)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(resultPath, "utf8")) as {
      uploaded?: UploadedShort[];
    };
    return (raw.uploaded ?? []).filter(
      (entry) =>
        typeof entry?.id === "string" &&
        typeof entry?.videoId === "string" &&
        entry.videoId.length > 0,
    );
  } catch {
    return [];
  }
}

function writePublishResult(batchDir: string, uploaded: UploadedShort[]): void {
  fs.writeFileSync(
    publishResultPath(batchDir),
    JSON.stringify({ uploaded }, null, 2),
    "utf8",
  );
}

/** Fail before any network upload if approved renders are missing. */
export function assertRendersPresent(
  batchDir: string,
  approvedIds: readonly string[],
): void {
  const missing = approvedIds.filter(
    (id) => !fs.existsSync(renderPathFor(batchDir, id)),
  );
  if (missing.length === 0) return;
  const listed = missing
    .map((id) => path.join("renders", `${id}.mp4`))
    .join(", ");
  throw new Error(`Missing render(s) for approved id(s): ${listed}`);
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
      title: clampYoutubeTitle(pack.hook),
      description: buildDescription(pack),
      publishAt: nineAmEasternIso(opts.startDate, index),
    };
  });

  const planPath = path.join(batchDir, "publish-plan.json");
  fs.writeFileSync(
    planPath,
    JSON.stringify({ items: planned }, null, 2),
    "utf8",
  );

  if (opts.dryRun) {
    return { planned, skipped, planPath };
  }

  assertRendersPresent(batchDir, approvedIds);

  const prior = loadPriorUploads(batchDir);
  const priorById = new Map(prior.map((entry) => [entry.id, entry]));
  const uploaded: UploadedShort[] = [...prior];
  const pending = planned.filter((item) => !priorById.has(item.id));

  if (pending.length === 0) {
    writePublishResult(batchDir, uploaded);
    return { planned, skipped, planPath, uploaded };
  }

  const fetchFn = opts.fetchFn ?? fetch;
  const creds = readYoutubeCredentialsFromEnv();
  const accessToken = await refreshAccessToken(creds, fetchFn);

  for (const item of pending) {
    const filePath = renderPathFor(batchDir, item.id);
    const { videoId } = await uploadScheduledShort({
      accessToken,
      filePath,
      item,
      fetchFn,
    });
    uploaded.push({ id: item.id, videoId, publishAt: item.publishAt });
    writePublishResult(batchDir, uploaded);
  }

  return { planned, skipped, planPath, uploaded };
}
