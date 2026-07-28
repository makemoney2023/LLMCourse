import { describe, expect, it } from "vitest";
import { addHeadingIds, slugifyHeading } from "./markdown-ids";

describe("slugifyHeading", () => {
  it("slugifies Big ideas", () => {
    expect(slugifyHeading("Big ideas")).toBe("big-ideas");
  });

  it("handles apostrophes", () => {
    expect(slugifyHeading("You'll know")).toBe("youll-know");
  });
});

describe("addHeadingIds", () => {
  it("adds id to h2 Big ideas", () => {
    const html = addHeadingIds("<h2>Big ideas</h2><p>x</p>");
    expect(html).toContain('<h2 id="big-ideas">Big ideas</h2>');
  });

  it("skips headings that already have ids", () => {
    const html = addHeadingIds('<h2 id="custom">Big ideas</h2>');
    expect(html).toBe('<h2 id="custom">Big ideas</h2>');
  });
});
