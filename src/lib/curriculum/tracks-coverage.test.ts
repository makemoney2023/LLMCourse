import { describe, expect, it } from "vitest";
import { listModules } from "./load-curriculum";
import { getTrackOverlay, listRoleTracks } from "./tracks";

const ROLE_TRACKS = ["ops", "sales", "eng", "marketing"] as const;

describe("role track coverage", () => {
  it("covers every module for ops, sales, eng, and marketing", () => {
    const slugs = listModules().map((m) => m.slug);
    expect(slugs).toHaveLength(12);

    for (const trackId of ROLE_TRACKS) {
      for (const slug of slugs) {
        const overlay = getTrackOverlay(trackId, slug);
        expect(overlay, `${trackId}/${slug}`).not.toBeNull();
        expect(overlay!.story.length).toBeGreaterThan(20);
        expect(overlay!.exampleAsk.length).toBeGreaterThan(20);
        expect(overlay!.watchOut.length).toBeGreaterThan(10);
      }
    }
  });

  it("gives the general track overlays for every module", () => {
    const slugs = listModules().map((m) => m.slug);
    for (const slug of slugs) {
      expect(getTrackOverlay("general", slug), `general/${slug}`).not.toBeNull();
    }
  });

  it("keeps overlay copy free of colon-labeled fragments", () => {
    for (const track of listRoleTracks()) {
      for (const [slug, overlay] of Object.entries(track.modules)) {
        for (const field of ["story", "exampleAsk", "watchOut"] as const) {
          expect(overlay[field], `${track.id}/${slug}/${field}`).not.toMatch(
            /\b(Audience|Done|Outcome):\s/,
          );
        }
      }
    }
  });
});
