import { describe, expect, it } from "vitest";
import { listModules, loadModuleContent } from "./load-curriculum";

describe("quiz remediation", () => {
  it("every quiz question includes remediation links", () => {
    for (const meta of listModules()) {
      const content = loadModuleContent(meta.slug);
      expect(content?.quiz, meta.slug).not.toBeNull();
      for (const q of content!.quiz!.questions) {
        expect(
          q.remediation,
          `${meta.slug} ${q.id} missing remediation`,
        ).toBeTruthy();
        expect(
          (q.remediation!.glossaryIds?.length ?? 0) +
            (q.remediation!.lessonHeading ? 1 : 0),
          `${meta.slug} ${q.id} empty remediation`,
        ).toBeGreaterThan(0);
      }
    }
  });
});
