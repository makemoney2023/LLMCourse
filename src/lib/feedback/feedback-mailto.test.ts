import { describe, expect, it } from "vitest";
import { buildFeedbackMailto } from "./feedback-mailto";

describe("buildFeedbackMailto", () => {
  it("addresses the contact inbox with module and step in the subject", () => {
    const url = buildFeedbackMailto(
      "team@example.com",
      "Module 1: The mental model",
      "Big ideas",
    );
    expect(url.startsWith("mailto:team@example.com?")).toBe(true);
    expect(url).toContain(
      encodeURIComponent("Course feedback: Module 1: The mental model — Big ideas"),
    );
  });

  it("seeds the body with prompts for what was confusing", () => {
    const url = buildFeedbackMailto("team@example.com", "Module 2", "Sources");
    const body = decodeURIComponent(url.split("body=")[1] ?? "");
    expect(body).toContain("What was confusing or wrong");
    expect(body).toContain("What you expected");
  });

  it("omits the step segment when no step is given", () => {
    const url = buildFeedbackMailto("team@example.com", "Glossary", null);
    expect(url).toContain(encodeURIComponent("Course feedback: Glossary"));
    expect(url).not.toContain(encodeURIComponent("—"));
  });
});
