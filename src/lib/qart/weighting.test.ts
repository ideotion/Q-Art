import { describe, expect, it } from "vitest";
import {
  DEFAULT_WEIGHT_METHOD,
  MARBLE_POOL,
  WEIGHT_METHODS,
  allocationToWeights,
  maxdiffScores,
  maxdiffSets,
  maxdiffWeights,
  normalizeToWeights,
  weightsToAllocation,
} from "./weighting";
import type { Weight } from "./types";

describe("weighting — methods registry", () => {
  it("ships all three selectable methods with stepper as default", () => {
    expect(WEIGHT_METHODS).toEqual(["stepper", "maxdiff", "marbles"]);
    expect(WEIGHT_METHODS).toContain(DEFAULT_WEIGHT_METHOD);
    expect(DEFAULT_WEIGHT_METHOD).toBe("stepper");
  });
});

describe("normalizeToWeights", () => {
  it("maps min→1, max→5 and is empty-safe", () => {
    expect(normalizeToWeights(new Map()).size).toBe(0);
    const w = normalizeToWeights(
      new Map([
        ["a", 0],
        ["b", 10],
        ["c", 5],
      ]),
    );
    expect(w.get("a")).toBe(1);
    expect(w.get("b")).toBe(5);
    expect(w.get("c")).toBe(3);
  });

  it("maps all-equal values to the neutral 3", () => {
    const w = normalizeToWeights(
      new Map([
        ["a", 4],
        ["b", 4],
      ]),
    );
    expect([...w.values()]).toEqual([3, 3]);
  });

  it("never emits a weight outside 1..5", () => {
    const w = normalizeToWeights(
      new Map([
        ["a", -50],
        ["b", 999],
        ["c", 3],
      ]),
    );
    for (const v of w.values()) expect(v).toBeGreaterThanOrEqual(1);
    for (const v of w.values()) expect(v).toBeLessThanOrEqual(5);
  });
});

describe("MaxDiff (best-worst scaling)", () => {
  it("returns a single screen when items fit the set size", () => {
    expect(maxdiffSets(["a", "b", "c"], 4)).toEqual([["a", "b", "c"]]);
  });

  it("builds balanced, de-duplicated, capped screens for larger sets", () => {
    const ids = ["a", "b", "c", "d", "e", "f"];
    const sets = maxdiffSets(ids, 3, 4);
    expect(sets.length).toBeLessThanOrEqual(4);
    for (const s of sets) expect(s).toHaveLength(3);
    const sigs = sets.map((s) => [...s].sort().join("|"));
    expect(new Set(sigs).size).toBe(sigs.length); // no duplicate screens
  });

  it("scores best (+1) and worst (−1); unjudged stay 0", () => {
    const scores = maxdiffScores(
      ["a", "b", "c"],
      [
        { bestId: "a", worstId: "c" },
        { bestId: "a", worstId: "b" },
      ],
    );
    expect(scores.get("a")).toBe(2);
    expect(scores.get("b")).toBe(-1);
    expect(scores.get("c")).toBe(-1);
  });

  it("turns responses into 1..5 weights with the winner highest", () => {
    const w = maxdiffWeights(
      ["a", "b", "c"],
      [
        { bestId: "a", worstId: "c" },
        { bestId: "a", worstId: "b" },
      ],
    );
    expect(w.get("a")).toBe(5);
    expect(w.get("c")).toBeLessThan(w.get("a") as Weight);
  });
});

describe("marbles (constant-sum)", () => {
  it("turns an allocation into 1..5 weights", () => {
    const w = allocationToWeights(
      new Map([
        ["a", 6],
        ["b", 0],
        ["c", 4],
      ]),
    );
    expect(w.get("a")).toBe(5);
    expect(w.get("b")).toBe(1);
  });

  it("round-trips weights → allocation within the pool budget", () => {
    const alloc = weightsToAllocation(
      new Map<string, Weight>([
        ["a", 5],
        ["b", 1],
      ]),
    );
    const total = [...alloc.values()].reduce((a, b) => a + b, 0);
    expect(total).toBeLessThanOrEqual(MARBLE_POOL); // never overdraws (clamped seed)
    expect(alloc.get("a")).toBeGreaterThan(alloc.get("b") as number);
  });
});
