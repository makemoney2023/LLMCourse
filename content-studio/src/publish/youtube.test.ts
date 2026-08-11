import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { stringify as stringifyYaml } from "yaml";
import type { ScriptPack } from "../schema/script-pack";
import { buildDescription } from "./description";
import { publishBatch } from "./youtube";

function makeBatchDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "shorts-publish-"));
}

function writePack(batchDir: string, pack: ScriptPack): void {
  const scriptsDir = path.join(batchDir, "scripts");
  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.writeFileSync(
    path.join(scriptsDir, `${pack.id}.yaml`),
    stringifyYaml(pack),
    "utf8",
  );
}

function samplePack(id: string, hook: string): ScriptPack {
  return {
    id,
    module: "01-mental-model",
    anchor: "Context window = desk space",
    format: "voice",
    hook,
    beats: [{ text: "Beat", visual: "title_card" }],
    cta: "Free LLM Leverage course — link in bio",
    duration_target_sec: 45,
  };
}

describe("publishBatch", () => {
  it("throws /no approved/i when every id is unapproved", async () => {
    const batchDir = makeBatchDir();
    const pack = samplePack("a-01", "Hook A");
    writePack(batchDir, pack);
    fs.writeFileSync(
      path.join(batchDir, "approval.yaml"),
      stringifyYaml({ items: [{ id: pack.id, approve: false }] }),
      "utf8",
    );

    await expect(
      publishBatch(batchDir, { dryRun: true, startDate: "2026-08-12" }),
    ).rejects.toThrow(/no approved/i);
  });

  it("skips unapproved ids and dry-runs only approved", async () => {
    const batchDir = makeBatchDir();
    const approved = samplePack("approved-01", "Approved hook");
    const skipped = samplePack("skipped-01", "Skipped hook");
    writePack(batchDir, approved);
    writePack(batchDir, skipped);
    fs.writeFileSync(
      path.join(batchDir, "approval.yaml"),
      stringifyYaml({
        items: [
          { id: approved.id, approve: true },
          { id: skipped.id, approve: false },
        ],
      }),
      "utf8",
    );

    const result = await publishBatch(batchDir, {
      dryRun: true,
      startDate: "2026-08-12",
    });

    expect(result.skipped).toEqual([skipped.id]);
    expect(result.planned).toHaveLength(1);
    expect(result.planned[0]!.id).toBe(approved.id);
    expect(result.planned[0]!.title).toBe(approved.hook);
    expect(result.planned[0]!.description).toBe(buildDescription(approved));
  });

  it("writes publish-plan.json with daily 9:00 America/New_York publishAt", async () => {
    const batchDir = makeBatchDir();
    const a = samplePack("day-a", "Day A");
    const b = samplePack("day-b", "Day B");
    writePack(batchDir, a);
    writePack(batchDir, b);
    fs.writeFileSync(
      path.join(batchDir, "approval.yaml"),
      stringifyYaml({
        items: [
          { id: a.id, approve: true },
          { id: b.id, approve: true },
        ],
      }),
      "utf8",
    );

    const result = await publishBatch(batchDir, {
      dryRun: true,
      startDate: "2026-08-12",
    });

    const planPath = path.join(batchDir, "publish-plan.json");
    expect(result.planPath).toBe(planPath);
    expect(fs.existsSync(planPath)).toBe(true);

    const plan = JSON.parse(fs.readFileSync(planPath, "utf8")) as {
      items: Array<{
        id: string;
        title: string;
        description: string;
        publishAt: string;
      }>;
    };

    expect(plan.items).toHaveLength(2);
    expect(plan.items[0]!.publishAt).toBe("2026-08-12T13:00:00.000Z"); // EDT
    expect(plan.items[1]!.publishAt).toBe("2026-08-13T13:00:00.000Z");
    expect(plan.items[0]!.description).toContain(
      "utm_campaign=day-a",
    );
    expect(plan.items[1]!.title).toBe(b.hook);
  });
});
