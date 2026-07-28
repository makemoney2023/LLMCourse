import { describe, expect, it } from "vitest";
import { listModules, loadModuleContent } from "./load-curriculum";
import {
  averageWordsPerSentence,
  undefinedHardTerms,
} from "./readability";

describe("readability helpers", () => {
  it("computes average words per sentence", () => {
    const text = "This is short. This one is also fairly short too.";
    expect(averageWordsPerSentence(text)).toBeLessThan(12);
  });
});

describe("grade-5 lesson readability", () => {
  it("keeps lesson sentences reasonably short", () => {
    for (const meta of listModules()) {
      const content = loadModuleContent(meta.slug);
      expect(content).not.toBeNull();
      const avg = averageWordsPerSentence(content!.lessonMarkdown);
      expect(avg, `${meta.slug} avg words/sentence=${avg.toFixed(1)}`).toBeLessThan(
        18,
      );
    }
  });

  it("defines hard terms near first use in each lesson", () => {
    for (const meta of listModules()) {
      const content = loadModuleContent(meta.slug);
      const missing = undefinedHardTerms(content!.lessonMarkdown);
      expect(missing, `${meta.slug} undefined: ${missing.join(", ")}`).toEqual(
        [],
      );
    }
  });
});
