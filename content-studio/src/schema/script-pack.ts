export type ScriptFormat = "voice" | "music_caption";

export type ScriptBeat = {
  text: string;
  visual: string;
};

export type ScriptPack = {
  id: string;
  module: string;
  anchor: string;
  format: ScriptFormat;
  hook: string;
  beats: ScriptBeat[];
  cta: string;
  duration_target_sec: number;
  tags?: string[];
};

const VALID_FORMATS: ScriptFormat[] = ["voice", "music_caption"];
const MIN_DURATION_SEC = 30;
const MAX_DURATION_SEC = 55;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireNonEmptyString(
  record: Record<string, unknown>,
  field: string,
  context = "Script pack",
): string {
  const value = record[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${context} missing or invalid ${field}`);
  }
  return value;
}

function parseBeat(raw: unknown, index: number): ScriptBeat {
  if (!isRecord(raw)) {
    throw new Error(`Script pack beat ${index} must be an object`);
  }

  const context = `Script pack beat ${index}`;
  return {
    text: requireNonEmptyString(raw, "text", context),
    visual: requireNonEmptyString(raw, "visual", context),
  };
}

function parseBeats(raw: unknown): ScriptBeat[] {
  if (!Array.isArray(raw)) {
    throw new Error("Script pack beats must be an array");
  }

  if (raw.length === 0) {
    throw new Error("Script pack beats must not be empty");
  }

  return raw.map((beat, index) => parseBeat(beat, index));
}

function parseFormat(raw: unknown): ScriptFormat {
  if (typeof raw !== "string" || !VALID_FORMATS.includes(raw as ScriptFormat)) {
    throw new Error(
      `Script pack format must be one of: ${VALID_FORMATS.join(", ")}`,
    );
  }
  return raw as ScriptFormat;
}

function parseDuration(raw: unknown): number {
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    throw new Error("Script pack duration_target_sec must be a number");
  }

  if (raw < MIN_DURATION_SEC || raw > MAX_DURATION_SEC) {
    throw new Error(
      `Script pack duration_target_sec must be between ${MIN_DURATION_SEC} and ${MAX_DURATION_SEC}`,
    );
  }

  return raw;
}

function parseTags(raw: unknown): string[] | undefined {
  if (raw === undefined) {
    return undefined;
  }

  if (!Array.isArray(raw) || raw.some((tag) => typeof tag !== "string")) {
    throw new Error("Script pack tags must be an array of strings");
  }

  return raw;
}

export function parseScriptPack(raw: unknown): ScriptPack {
  if (!isRecord(raw)) {
    throw new Error("Script pack must be an object");
  }

  const pack: ScriptPack = {
    id: requireNonEmptyString(raw, "id"),
    module: requireNonEmptyString(raw, "module"),
    anchor: requireNonEmptyString(raw, "anchor"),
    format: parseFormat(raw.format),
    hook: requireNonEmptyString(raw, "hook"),
    beats: parseBeats(raw.beats),
    cta: requireNonEmptyString(raw, "cta"),
    duration_target_sec: parseDuration(raw.duration_target_sec),
    tags: parseTags(raw.tags),
  };

  return pack;
}

export function assertScriptPack(raw: unknown): asserts raw is ScriptPack {
  parseScriptPack(raw);
}
