import { describe, expect, it } from "vitest";
import { emptyProgress, markModuleComplete, serializeProgress } from "./progress";
import { parseProgressFile, PROGRESS_EXPORT_FILENAME } from "./export";

describe("parseProgressFile", () => {
  it("round-trips exported progress", () => {
    const progress = markModuleComplete(emptyProgress(), "mental-model");
    const parsed = parseProgressFile(serializeProgress(progress));
    expect(parsed).not.toBeNull();
    expect(parsed?.completedModules).toEqual(["mental-model"]);
    expect(parsed?.roleTrack).toBe("general");
  });

  it("fills defaults for missing fields", () => {
    const parsed = parseProgressFile('{"completedModules":["a"]}');
    expect(parsed?.completedModules).toEqual(["a"]);
    expect(parsed?.quizScores).toEqual({});
    expect(parsed?.certificateClaims).toEqual([]);
  });

  it("rejects non-JSON input", () => {
    expect(parseProgressFile("not json")).toBeNull();
  });

  it("rejects JSON that is not a progress object", () => {
    expect(parseProgressFile("[1,2,3]")).toBeNull();
    expect(parseProgressFile('"hello"')).toBeNull();
    expect(parseProgressFile("null")).toBeNull();
  });

  it("rejects objects without a completedModules array", () => {
    expect(parseProgressFile('{"foo":"bar"}')).toBeNull();
    expect(parseProgressFile('{"completedModules":"nope"}')).toBeNull();
  });

  it("names the export file after the course", () => {
    expect(PROGRESS_EXPORT_FILENAME).toMatch(/\.json$/);
  });
});
