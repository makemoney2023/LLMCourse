import { describe, expect, it } from "vitest";
import { orderByPriority, recordAnswer, type CardStats } from "./stats";

describe("recordAnswer", () => {
  it("builds a streak on correct answers", () => {
    let stats: CardStats = {};
    stats = recordAnswer(stats, "a", true);
    stats = recordAnswer(stats, "a", true);
    expect(stats.a).toEqual({ misses: 0, streak: 2 });
  });

  it("resets the streak and counts the miss on a wrong answer", () => {
    let stats: CardStats = {};
    stats = recordAnswer(stats, "a", true);
    stats = recordAnswer(stats, "a", false);
    expect(stats.a).toEqual({ misses: 1, streak: 0 });
  });

  it("does not mutate the previous stats object", () => {
    const before: CardStats = { a: { misses: 0, streak: 1 } };
    recordAnswer(before, "a", true);
    expect(before.a).toEqual({ misses: 0, streak: 1 });
  });
});

describe("orderByPriority", () => {
  const stats: CardStats = {
    missed: { misses: 2, streak: 0 },
    known: { misses: 0, streak: 3 },
    shaky: { misses: 1, streak: 1 },
  };

  it("puts struggling cards first, unseen next, solid cards last", () => {
    const order = orderByPriority(["known", "fresh", "missed", "shaky"], stats, "s");
    expect(order.indexOf("missed")).toBeLessThan(order.indexOf("fresh"));
    expect(order.indexOf("shaky")).toBeLessThan(order.indexOf("fresh"));
    expect(order.indexOf("fresh")).toBeLessThan(order.indexOf("known"));
  });

  it("keeps every card exactly once", () => {
    const ids = ["known", "fresh", "missed", "shaky"];
    expect([...orderByPriority(ids, stats, "s")].sort()).toEqual(
      [...ids].sort(),
    );
  });

  it("is deterministic per seed", () => {
    const ids = ["a", "b", "c", "d", "e"];
    expect(orderByPriority(ids, {}, "s1")).toEqual(
      orderByPriority(ids, {}, "s1"),
    );
  });
});
