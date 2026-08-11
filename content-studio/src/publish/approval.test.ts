import { describe, expect, it } from "vitest";
import { isApproved, parseApproval } from "./approval";

describe("approval", () => {
  it("denies by default", () => {
    const a = parseApproval({
      items: [{ id: "mental-model-desk-space-01", approve: false }],
    });
    expect(isApproved(a, "mental-model-desk-space-01")).toBe(false);
  });

  it("allows only approve true", () => {
    const a = parseApproval({
      items: [{ id: "mental-model-desk-space-01", approve: true }],
    });
    expect(isApproved(a, "mental-model-desk-space-01")).toBe(true);
  });

  it("denies unknown ids", () => {
    const a = parseApproval({
      items: [{ id: "mental-model-desk-space-01", approve: true }],
    });
    expect(isApproved(a, "missing-id")).toBe(false);
  });
});
