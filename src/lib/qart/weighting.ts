/**
 * Weighting engine (ADR-005) — pure, deterministic, framework-free.
 *
 * The canonical importance is always the 1–5 "billes" (`CheckedItem.weight`).
 * Three *methods* set it, and every method has a non-drag, keyboard path
 * (WCAG 2.2 SC 2.5.7):
 *   • stepper  — direct 1–5 per item (the always-available baseline).
 *   • maxdiff  — tap most/least important across small sets (best-worst scaling);
 *                inherently tap-based, so no drag exists to need an alternative.
 *   • marbles  — constant-sum: distribute a pool across items via +/- steppers
 *                (drag is optional progressive enhancement on top).
 *
 * MaxDiff and marbles both reduce to a 1–5 weight via one normalizer, so the
 * decision object stays method-agnostic and the billes remain the visual identity.
 */
import type { ID, Weight, WeightMethod } from "./types";

export const WEIGHT_METHODS = [
  "stepper",
  "maxdiff",
  "marbles",
] as const satisfies readonly WeightMethod[];
export const DEFAULT_WEIGHT_METHOD: WeightMethod = "stepper";

/** Marbles to distribute in the constant-sum method. */
export const MARBLE_POOL = 10;

const clampWeight = (n: number): Weight => Math.max(1, Math.min(5, Math.round(n))) as Weight;

/**
 * Min–max normalize arbitrary per-item values onto the 1–5 billes scale.
 * All-equal (or a single item) maps to the neutral 3. Shared by both derived
 * methods so they agree on how a magnitude becomes a weight.
 */
export function normalizeToWeights<K>(values: Map<K, number>): Map<K, Weight> {
  const out = new Map<K, Weight>();
  if (values.size === 0) return out;
  const nums = [...values.values()];
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  for (const [k, v] of values) {
    out.set(k, max === min ? 3 : clampWeight(1 + ((v - min) / (max - min)) * 4));
  }
  return out;
}

// ---------------- MaxDiff (best-worst scaling) ----------------

export interface MaxDiffResponse {
  /** item judged most important in the set */
  bestId: ID;
  /** item judged least important in the set */
  worstId: ID;
}

/**
 * Deterministically build balanced subsets ("screens") for best-worst judging.
 * Each item appears in roughly `setSize` screens. Small sets (≤ setSize) yield a
 * single screen. Capped so large rubrics don't explode the number of taps.
 */
export function maxdiffSets(itemIds: readonly ID[], setSize = 4, maxScreens = 10): ID[][] {
  const n = itemIds.length;
  if (n === 0) return [];
  if (n <= setSize) return [[...itemIds]];

  const seen = new Set<string>();
  const screens: ID[][] = [];
  for (let start = 0; start < n && screens.length < maxScreens; start++) {
    const set: ID[] = [];
    for (let k = 0; k < setSize; k++) set.push(itemIds[(start + k) % n]);
    const sig = [...set].sort().join("|");
    if (seen.has(sig)) continue;
    seen.add(sig);
    screens.push(set);
  }
  return screens;
}

/** Net best-worst score per item: (#best) − (#worst). Unjudged items score 0. */
export function maxdiffScores(
  itemIds: readonly ID[],
  responses: readonly MaxDiffResponse[],
): Map<ID, number> {
  const scores = new Map<ID, number>(itemIds.map((id) => [id, 0]));
  for (const r of responses) {
    if (scores.has(r.bestId)) scores.set(r.bestId, (scores.get(r.bestId) ?? 0) + 1);
    if (scores.has(r.worstId)) scores.set(r.worstId, (scores.get(r.worstId) ?? 0) - 1);
  }
  return scores;
}

/** Convenience: best-worst responses → 1–5 weights. */
export function maxdiffWeights(
  itemIds: readonly ID[],
  responses: readonly MaxDiffResponse[],
): Map<ID, Weight> {
  return normalizeToWeights(maxdiffScores(itemIds, responses));
}

// ---------------- Marbles (constant-sum) ----------------

/** Constant-sum allocation (marbles per item) → 1–5 weights. */
export function allocationToWeights(allocation: Map<ID, number>): Map<ID, Weight> {
  return normalizeToWeights(allocation);
}

/** Seed a marble allocation from existing 1–5 weights so the panel round-trips. */
export function weightsToAllocation(weights: Map<ID, Weight>, pool = MARBLE_POOL): Map<ID, number> {
  const out = new Map<ID, number>();
  const total = [...weights.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return out;
  for (const [id, w] of weights) out.set(id, Math.round((w / total) * pool));
  // Rounding can overshoot the constant sum; trim from the largest allocations
  // so the seed never exceeds the pool (no "-1 marbles left").
  let used = [...out.values()].reduce((a, b) => a + b, 0);
  while (used > pool) {
    const [maxId] = [...out.entries()].sort((a, b) => b[1] - a[1])[0];
    out.set(maxId, (out.get(maxId) ?? 0) - 1);
    used--;
  }
  return out;
}
