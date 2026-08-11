import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse as parseYaml } from "yaml";
import { isApproved, parseApproval } from "../publish/approval";
import { runBatch } from "./run-batch";

const curriculumRoot = path.resolve(__dirname, "../../../curriculum");

function makeOutRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "shorts-batch-"));
}

describe("runBatch", () => {
  it("writes scripts, stub renders, approval.yaml, and errors array", () => {
    const outRoot = makeOutRoot();
    const result = runBatch({
      date: "2026-08-11",
      count: 2,
      curriculumRoot,
      outRoot,
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

    for (const id of result.ids) {
      expect(fs.existsSync(path.join(result.dir, "scripts", `${id}.yaml`))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(result.dir, "renders", `${id}.mp4`))).toBe(
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

  it("records render failures in errors.json and continues", () => {
    const outRoot = makeOutRoot();
    let calls = 0;
    const result = runBatch({
      date: "2026-08-12",
      count: 2,
      curriculumRoot,
      outRoot,
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
});
