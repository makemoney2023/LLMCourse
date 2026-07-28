import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getModuleBySlug } from "./load-curriculum";
import { splitLessonIntoSteps } from "./split-lesson-steps";

describe("splitLessonIntoSteps", () => {
  it("maps Module 1 headings into orient / ideas / apply chunks", () => {
    const meta = getModuleBySlug("mental-model");
    expect(meta).not.toBeNull();
    const lesson = readFileSync(
      path.join(
        process.cwd(),
        "curriculum/modules",
        meta!.dirName,
        "lesson.mdx",
      ),
      "utf8",
    );
    const chunks = splitLessonIntoSteps(lesson, meta!.steps);
    expect(chunks.map((c) => c.stepId)).toEqual(["orient", "ideas", "apply"]);
    expect(chunks[0]!.markdown).toContain("## In plain words");
    expect(chunks[0]!.markdown).toContain("## Why it matters");
    expect(chunks[1]!.markdown).toContain("## Big ideas");
    expect(chunks[2]!.markdown).toContain("## Tips");
    expect(chunks[0]!.markdown).not.toContain("## Big ideas");
  });
});
