import { describe, expect, it } from "vitest";
import { CONTACT_EMAIL } from "./contact-email";
import {
  MARKETING_ORIGIN,
  courseLinks,
  marketingGroups,
  marketingHomeHref,
  marketingTopLinks,
} from "./site-nav";

describe("marketing site nav", () => {
  it("keeps the live top-level order and sends those links to the marketing host", () => {
    expect(marketingTopLinks.map((link) => link.label)).toEqual([
      "Work",
      "Products",
      "Blog",
      "Films",
      "Start a project",
    ]);
    expect(marketingTopLinks.map((link) => link.href)).toEqual([
      `${MARKETING_ORIGIN}/portfolio/`,
      `${MARKETING_ORIGIN}/products/`,
      `${MARKETING_ORIGIN}/blog`,
      `${MARKETING_ORIGIN}/films.html`,
      `${MARKETING_ORIGIN}/start/`,
    ]);
    expect(marketingHomeHref).toBe(`${MARKETING_ORIGIN}/`);
  });

  it("keeps Services groups, headlines, and absolute service URLs", () => {
    expect(marketingGroups.map((group) => group.label)).toEqual([
      "Build",
      "Create",
      "Grow",
      "Learn",
    ]);
    const learn = marketingGroups.find((group) => group.label === "Learn");
    expect(learn?.links.map((link) => link.title)).toEqual([
      "LLM Leverage",
      "Notes",
      "Films",
    ]);
    expect(learn?.links.map((link) => link.href)).toEqual([
      `${MARKETING_ORIGIN}/course/llm-leverage/`,
      `${MARKETING_ORIGIN}/blog`,
      `${MARKETING_ORIGIN}/films.html`,
    ]);
    for (const group of marketingGroups) {
      for (const link of group.links) {
        expect(link.href.startsWith(`${MARKETING_ORIGIN}/`)).toBe(true);
        expect(link.title.length).toBeGreaterThan(0);
        expect(link.description.length).toBeGreaterThan(0);
      }
    }
    expect(marketingGroups[0]?.links[0]).toMatchObject({
      title: "Apps built around your workflow.",
      href: `${MARKETING_ORIGIN}/services/custom-apps/`,
    });
  });

  it("keeps course navigation on this site, including modules and sign-in", () => {
    expect(courseLinks.map((link) => [link.href, link.label])).toEqual([
      ["/", "Home"],
      ["/modules", "Modules"],
      ["/resources", "Resources"],
      ["/glossary", "Glossary"],
      ["/workshops", "Workshops"],
      ["/access", "Sign in"],
    ]);
    expect(CONTACT_EMAIL).toBe("houdini@abra-ca-dabra.app");
  });
});
