import fs from "node:fs";
import { parse as parseYaml } from "yaml";
import type { HookCandidate } from "../extract/extract-hooks";
import {
  parseScriptPack,
  type ScriptBeat,
  type ScriptFormat,
  type ScriptPack,
} from "../schema/script-pack";

const CTA = "Free LLM Leverage course — link in bio";

const BEAT_VISUALS = ["title_card", "kinetic_list", "kinetic_list", "punchline"] as const;

function slugify(text: string): string {
  const focus = text.includes("=") ? text.split("=")[1]!.trim() : text;
  return focus
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildId(moduleSlug: string, anchor: string): string {
  const id = `${moduleSlug}-${slugify(anchor)}-01`;
  return id.length > 64 ? id.slice(0, 64) : id;
}

function punchyHook(anchor: string): string {
  if (anchor.toLowerCase().includes("desk space")) {
    return "Your AI isn't dumb — your desk is crowded.";
  }

  const eqIndex = anchor.indexOf("=");
  if (eqIndex !== -1) {
    const metaphor = anchor.slice(eqIndex + 1).trim().toLowerCase();
    return `Stop ignoring ${metaphor} — it changes everything.`;
  }

  return anchor.endsWith(".") ? anchor : `${anchor}.`;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function fallbackBeats(anchor: string, source: string): string[] {
  const teaching = source.endsWith(".") ? source : `${source}.`;
  return [
    anchor,
    teaching,
    "Keep the goal and the facts in focus.",
    "That's the lever.",
  ];
}

function buildBeatTexts(anchor: string, source: string): string[] {
  const sentences = splitSentences(source);
  if (sentences.length >= 2 && sentences.length <= 4) {
    return sentences;
  }
  return fallbackBeats(anchor, source).slice(0, 4);
}

function assignVisuals(beatCount: number): string[] {
  if (beatCount === 2) {
    return ["title_card", "punchline"];
  }
  if (beatCount === 3) {
    return ["title_card", "kinetic_list", "punchline"];
  }
  return [...BEAT_VISUALS];
}

function estimateDuration(beats: ScriptBeat[]): number {
  const words = beats.reduce(
    (total, beat) => total + beat.text.split(/\s+/).filter(Boolean).length,
    0,
  );
  return Math.min(55, Math.max(30, Math.round(words * 2.2)));
}

export function buildScriptFromHook(
  hook: HookCandidate,
  opts?: { format?: ScriptFormat },
): ScriptPack {
  const format = opts?.format ?? "voice";
  const beatTexts = buildBeatTexts(hook.anchor, hook.source);
  const visuals = assignVisuals(beatTexts.length);
  const beats: ScriptBeat[] = beatTexts.map((text, index) => ({
    text,
    visual: visuals[index] ?? "kinetic_list",
  }));

  const pack: ScriptPack = {
    id: buildId(hook.moduleSlug, hook.anchor),
    module: hook.moduleDir,
    anchor: hook.anchor,
    format,
    hook: punchyHook(hook.anchor),
    beats,
    cta: CTA,
    duration_target_sec: estimateDuration(beats),
  };

  return parseScriptPack(pack);
}

export function loadScriptPackFile(filePath: string): ScriptPack {
  const raw = parseYaml(fs.readFileSync(filePath, "utf8"));
  return parseScriptPack(raw);
}
