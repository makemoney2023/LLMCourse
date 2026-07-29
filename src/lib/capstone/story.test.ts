import { describe, expect, it } from "vitest";
import { buildGalleryStory, storyIsComplete } from "./story";

const full = {
  role: "Ops lead",
  workflow: "Weekly manager status",
  before: "45 minutes of copy-paste, two guessed numbers.",
  after: "18 minutes to first draft, zero source errors.",
  lesson: "Always attach BRIEF.md before status drafts.",
};

describe("buildGalleryStory", () => {
  it("includes every filled field with its label", () => {
    const story = buildGalleryStory(full);
    expect(story).toContain("Role: Ops lead");
    expect(story).toContain("Workflow: Weekly manager status");
    expect(story).toContain("Before: 45 minutes");
    expect(story).toContain("After: 18 minutes");
    expect(story).toContain("Lesson: Always attach BRIEF.md");
  });

  it("skips blank fields and trims whitespace", () => {
    const story = buildGalleryStory({
      ...full,
      role: "  ",
      lesson: "  keep the checklist  ",
    });
    expect(story).not.toContain("Role:");
    expect(story).toContain("Lesson: keep the checklist");
  });

  it("starts with a submission header", () => {
    expect(buildGalleryStory(full)).toMatch(/^Capstone story/);
  });
});

describe("storyIsComplete", () => {
  it("requires workflow, before, after, and lesson", () => {
    expect(storyIsComplete(full)).toBe(true);
    expect(storyIsComplete({ ...full, before: " " })).toBe(false);
    expect(storyIsComplete({ ...full, role: "" })).toBe(true);
  });
});
