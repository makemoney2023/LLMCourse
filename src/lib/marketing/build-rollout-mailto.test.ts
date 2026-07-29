import { describe, expect, it } from "vitest";
import { buildRolloutMailto } from "./build-rollout-mailto";

describe("buildRolloutMailto", () => {
  it("includes subject and form fields in the mailto body", () => {
    const href = buildRolloutMailto({
      to: "chrisb@superpatch.com",
      subject: "LLM Leverage team rollout",
      name: "Ada Lovelace",
      workEmail: "ada@example.com",
      company: "Analytical Engines",
      note: "Team of 12, Claude + Cursor",
    });

    expect(href.startsWith("mailto:chrisb@superpatch.com?")).toBe(true);
    expect(href).toContain("subject=LLM%20Leverage%20team%20rollout");
    expect(decodeURIComponent(href)).toContain("Name: Ada Lovelace");
    expect(decodeURIComponent(href)).toContain("Work email: ada@example.com");
    expect(decodeURIComponent(href)).toContain("Company: Analytical Engines");
    expect(decodeURIComponent(href)).toContain(
      "Note: Team of 12, Claude + Cursor",
    );
  });

  it("omits empty optional lines from the body", () => {
    const href = buildRolloutMailto({
      to: "chrisb@superpatch.com",
      subject: "LLM Leverage team rollout",
      name: "Ada",
      workEmail: "",
      company: "",
      note: "",
    });
    const body = decodeURIComponent(href.split("body=")[1] ?? "");
    expect(body).toContain("Name: Ada");
    expect(body).not.toContain("Work email:");
    expect(body).not.toContain("Company:");
    expect(body).not.toContain("Note:");
  });
});
