import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse as parseYaml } from "yaml";
import { isApproved, parseApproval } from "../publish/approval";
import type { ScriptPack } from "../schema/script-pack";
import { runBatch, selectHooks } from "./run-batch";
import { extractHooks } from "../extract/extract-hooks";

const curriculumRoot = path.resolve(__dirname, "../../../curriculum");
const modulesRoot = path.join(curriculumRoot, "modules");

function makeOutRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "shorts-batch-"));
}

async function stubResolveAudio({
  pack,
  audioDir,
}: {
  pack: ScriptPack;
  audioDir: string;
}): Promise<string> {
  fs.mkdirSync(audioDir, { recursive: true });
  const audioPath = path.join(audioDir, `${pack.id}.wav`);
  fs.writeFileSync(audioPath, "");
  return audioPath;
}

describe("runBatch", () => {
  it("writes scripts, stub renders, approval.yaml, and errors array", async () => {
    const outRoot = makeOutRoot();
    const result = await runBatch({
      date: "2026-08-11",
      count: 2,
      curriculumRoot,
      outRoot,
      resolveAudio: stubResolveAudio,
      render: ({ outputPath }) => {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, "");
      },
    });

    expect(result.ids).toHaveLength(2);
    expect(result.errors).toBeDefined();
    expect(Array.isArray(result.errors)).toBe(true);
    expect(result.dir).toBe(path.join(outRoot, "batch-2026-08-11"));

    expect(fs.existsSync(path.join(result.dir, "approval.yaml"))).toBe(true);
    expect(fs.existsSync(path.join(result.dir, "APPROVAL.md"))).toBe(true);
    expect(fs.existsSync(path.join(result.dir, "errors.json"))).toBe(true);
    expect(fs.existsSync(path.join(result.dir, "audio"))).toBe(true);

    for (const id of result.ids) {
      expect(fs.existsSync(path.join(result.dir, "scripts", `${id}.yaml`))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(result.dir, "renders", `${id}.mp4`))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(result.dir, "audio", `${id}.wav`))).toBe(
        true,
      );
    }

    const approvalRaw = parseYaml(
      fs.readFileSync(path.join(result.dir, "approval.yaml"), "utf8"),
    );
    const approval = parseApproval(approvalRaw);
    for (const id of result.ids) {
      expect(isApproved(approval, id)).toBe(false);
    }

    const checklist = fs.readFileSync(
      path.join(result.dir, "APPROVAL.md"),
      "utf8",
    );
    expect(checklist).toMatch(/Factual vs curriculum anchor/i);
    expect(checklist).toMatch(/approve:\s*true/i);
  });

  it("records render failures in errors.json and continues", async () => {
    const outRoot = makeOutRoot();
    let calls = 0;
    const result = await runBatch({
      date: "2026-08-12",
      count: 2,
      curriculumRoot,
      outRoot,
      resolveAudio: stubResolveAudio,
      render: ({ outputPath }) => {
        calls += 1;
        if (calls === 1) {
          throw new Error("render boom");
        }
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, "");
      },
    });

    expect(result.ids).toHaveLength(2);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.error).toMatch(/render boom/);
    expect(result.errors[0]?.id).toBe(result.ids[0]);

    const errorsOnDisk = JSON.parse(
      fs.readFileSync(path.join(result.dir, "errors.json"), "utf8"),
    ) as { id: string; error: string }[];
    expect(errorsOnDisk).toEqual(result.errors);

    expect(
      fs.existsSync(path.join(result.dir, "renders", `${result.ids[1]}.mp4`)),
    ).toBe(true);
    expect(
      fs.existsSync(path.join(result.dir, "approval.yaml")),
    ).toBe(true);
  });

  it("bumps id suffix when two hooks produce the same base id", async () => {
    const collidingCurriculum = fs.mkdtempSync(
      path.join(os.tmpdir(), "shorts-curriculum-"),
    );
    const moduleDir = path.join(collidingCurriculum, "modules", "01-dup");
    fs.mkdirSync(moduleDir, { recursive: true });
    fs.writeFileSync(
      path.join(moduleDir, "module.yaml"),
      [
        "slug: dup-mod",
        "objectives:",
        "  - Desk Space",
        "  - desk space",
        "",
      ].join("\n"),
      "utf8",
    );

    const outRoot = makeOutRoot();
    const result = await runBatch({
      date: "2026-08-13",
      count: 2,
      curriculumRoot: collidingCurriculum,
      outRoot,
      resolveAudio: stubResolveAudio,
      render: ({ outputPath }) => {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, "");
      },
    });

    expect(result.ids).toEqual([
      "dup-mod-desk-space-01",
      "dup-mod-desk-space-02",
    ]);
    expect(new Set(result.ids).size).toBe(2);

    for (const id of result.ids) {
      const scriptPath = path.join(result.dir, "scripts", `${id}.yaml`);
      expect(fs.existsSync(scriptPath)).toBe(true);
      const pack = parseYaml(fs.readFileSync(scriptPath, "utf8")) as {
        id: string;
      };
      expect(pack.id).toBe(id);
      expect(fs.existsSync(path.join(result.dir, "renders", `${id}.mp4`))).toBe(
        true,
      );
    }
  });

  it("routes voice vs music_caption through resolveAudio", async () => {
    const outRoot = makeOutRoot();
    const formats: string[] = [];
    const result = await runBatch({
      date: "2026-08-14",
      count: 5,
      curriculumRoot,
      outRoot,
      resolveAudio: async ({ pack, audioDir }) => {
        formats.push(pack.format);
        return stubResolveAudio({ pack, audioDir });
      },
      render: ({ outputPath }) => {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, "");
      },
    });

    expect(result.ids).toHaveLength(5);
    expect(formats).toEqual([
      "voice",
      "voice",
      "voice",
      "voice",
      "music_caption",
    ]);
  });

  it("prefers loop_moment and myth_fix in a count-7 curriculum mix when available", () => {
    const moduleDirs = fs
      .readdirSync(modulesRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(modulesRoot, entry.name));
    const pool = moduleDirs.flatMap((dir) => extractHooks(dir));
    const poolSeries = new Set(pool.map((h) => h.series));
    expect(poolSeries.has("loop_moment")).toBe(true);
    expect(poolSeries.has("myth_fix")).toBe(true);

    const selected = selectHooks(modulesRoot, 7);
    expect(selected).toHaveLength(7);
    const selectedSeries = new Set(selected.map((h) => h.series));
    expect(selectedSeries.has("loop_moment")).toBe(true);
    expect(selectedSeries.has("myth_fix")).toBe(true);
  });

  it("selects Remotion composition from hook.series", async () => {
    const seriesCurriculum = fs.mkdtempSync(
      path.join(os.tmpdir(), "shorts-series-curriculum-"),
    );
    const moduleDir = path.join(seriesCurriculum, "modules", "01-series");
    fs.mkdirSync(moduleDir, { recursive: true });
    fs.writeFileSync(
      path.join(moduleDir, "module.yaml"),
      [
        "slug: series-mod",
        "objectives:",
        "  - One clear idea about desks",
        "  - Common myth vs fix for context windows",
        "loopPlacement: Observe node of the agent loop",
        "",
      ].join("\n"),
      "utf8",
    );

    const outRoot = makeOutRoot();
    const compositionIds: string[] = [];
    const result = await runBatch({
      date: "2026-08-15",
      count: 3,
      curriculumRoot: seriesCurriculum,
      outRoot,
      resolveAudio: stubResolveAudio,
      render: ({ outputPath, compositionId }) => {
        compositionIds.push(compositionId);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, "");
      },
    });

    expect(result.ids).toHaveLength(3);
    expect(compositionIds).toEqual([
      "TitlePunch",
      "ListReveal",
      "LoopSnippet",
    ]);
  });
});
