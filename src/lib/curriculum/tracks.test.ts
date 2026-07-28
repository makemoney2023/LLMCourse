import { describe, expect, it } from "vitest";
import { getTrackOverlay, listRoleTracks } from "./tracks";

describe("role tracks", () => {
  it("loads all five tracks", () => {
    expect(listRoleTracks().map((t) => t.id).sort()).toEqual(
      ["eng", "general", "marketing", "ops", "sales"].sort(),
    );
  });

  it("returns sales overlay for deep-research and null for unknown", () => {
    expect(getTrackOverlay("sales", "deep-research")?.exampleAsk).toMatch(
      /BRIEF/i,
    );
    expect(getTrackOverlay("general", "deep-research")).toBeNull();
  });
});
