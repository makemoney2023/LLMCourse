import { afterEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "./site-url";

const ORIGINAL_SITE = process.env.NEXT_PUBLIC_SITE_URL;
const ORIGINAL_VERCEL = process.env.VERCEL_URL;

afterEach(() => {
  process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_SITE;
  process.env.VERCEL_URL = ORIGINAL_VERCEL;
});

describe("getSiteUrl", () => {
  it("prefers the explicit site url and strips trailing slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://course.example.com/";
    expect(getSiteUrl()).toBe("https://course.example.com");
  });

  it("falls back to the Vercel deployment url", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_URL = "llm-course.vercel.app";
    expect(getSiteUrl()).toBe("https://llm-course.vercel.app");
  });

  it("defaults to localhost for local dev", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
