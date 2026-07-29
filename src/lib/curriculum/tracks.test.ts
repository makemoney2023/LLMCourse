import { describe, expect, it } from "vitest";
import { getTrackOverlay, listRoleTracks } from "./tracks";

describe("role tracks", () => {
  it("loads all five tracks", () => {
    expect(listRoleTracks().map((t) => t.id).sort()).toEqual(
      ["eng", "general", "marketing", "ops", "sales"].sort(),
    );
  });

  it("returns sales and general overlays for deep-research", () => {
    expect(getTrackOverlay("sales", "deep-research")?.exampleAsk).toMatch(
      /BRIEF/i,
    );
    expect(getTrackOverlay("general", "deep-research")?.exampleAsk).toMatch(
      /BRIEF|SOURCES/i,
    );
    expect(getTrackOverlay("sales", "not-a-module")).toBeNull();
  });
});
