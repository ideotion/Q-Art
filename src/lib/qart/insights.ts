/**
 * The reading engine (concept.md §3.6 "intelligence layer", deterministic slice).
 *
 * Q-Art works on the *question*, not the answer — it never advises. This engine
 * reads the decision object and surfaces what the reflex shortcut hid: the knot
 * that recurs, the pull between what you want and what you fear, your own part in
 * keeping it going, the "more of the same", the quiet payoff of the status quo, an
 * untested belief, the exception where it already works — and then *offers*
 * sharper questions (the pivot) and a small first step.
 *
 * Pure & deterministic (no LLM, no I/O, no locale): it returns structured findings
 * keyed off the user's own words; the UI renders the prose, bilingually.
 */
import { computeCrossLinks } from "./croisements";
import type { Cycle, RubricKey } from "./types";

export type InsightKind =
  | "knot"
  | "tension"
  | "role"
  | "sameness"
  | "payoff"
  | "belief"
  | "exception"
  | "gap";

export interface InsightItem {
  itemId?: string; // bank id when present — lets the UI re-localize live
  label: string;
  rubric: RubricKey;
}

export interface Insight {
  kind: InsightKind;
  /** the user's own phrase this insight is built from */
  primary?: InsightItem;
  /** the opposing phrase (tension only) */
  secondary?: InsightItem;
  /** recurring theme (knot only) */
  theme?: string;
  /** rubrics involved (knot / gap) */
  rubrics?: RubricKey[];
}

export type ReframeKind = "overcome" | "need" | "belief" | "role" | "clarify" | "smallest_step";

export interface ReframeSuggestion {
  kind: ReframeKind;
  /** a short slice of the user's own words to fold into the question */
  theme?: string;
  /** bank id of the item the theme came from — lets the UI re-localize live */
  itemId?: string;
}

export interface Reading {
  insights: Insight[];
  reframes: ReframeSuggestion[];
  /** true once there's enough on the map to say something */
  hasMap: boolean;
}

// Semantic groupings of bank items (mirror docs/question-banks.md). Kept here so
// the engine reads meaning, not just text; extend alongside the banks.
const ROLE_IDS = new Set([
  "role_overhelp",
  "role_control",
  "role_silent",
  "role_waiting",
  "role_victim",
]);
const BELIEF_IDS = new Set([
  "belief_handle_alone",
  "belief_perfect",
  "belief_all_or_nothing",
  "belief_emotion_weak",
  "belief_trust_earned",
  "belief_please",
  "belief_mistake_authority",
  "belief_not_contradict",
  "belief_speak_certain",
  "belief_always_never",
]);
const SAMENESS_IDS = new Set([
  "try_harder",
  "try_wait",
  "try_avoid",
  "try_nothing_changed",
  "try_worse",
  "try_control_more",
  "try_same_person",
  "try_ultimatum",
  "try_delegate_takeback",
]);
const PAYOFF_IDS = new Set([
  "obs_avoid_conversation",
  "obs_comfortable",
  "obs_not_ready",
  "obs_avoid_responsibility",
  "obs_loyalty",
  "obs_sunk_cost",
]);
const EXCEPTION_IDS = new Set(["ideal_exceptions", "ideal_clear_terms", "ideal_borrow"]);

const WANT_RUBRICS: RubricKey[] = ["ideal_scene", "objective_benefits"];
const FEAR_RUBRICS: RubricKey[] = ["obstacles", "risks", "emotions"];
/** Facets people most often skip — a gentle nudge if left blank. */
const GAP_RUBRICS: RubricKey[] = ["stakeholders", "ideal_scene", "resources", "tried"];

interface Checked extends InsightItem {
  itemId?: string;
  weight: number;
}

function allChecked(cycle: Cycle): Checked[] {
  const out: Checked[] = [];
  for (const [rubric, entry] of Object.entries(cycle.rubrics)) {
    for (const ci of entry?.checkedItems ?? []) {
      out.push({
        itemId: ci.itemId,
        label: ci.label,
        weight: ci.weight,
        rubric: rubric as RubricKey,
      });
    }
  }
  return out;
}

const heaviest = (xs: Checked[]): Checked | undefined =>
  xs.length ? [...xs].sort((a, b) => b.weight - a.weight)[0] : undefined;

const taggedHeaviest = (xs: Checked[], ids: Set<string>): Checked | undefined =>
  heaviest(xs.filter((c) => c.itemId !== undefined && ids.has(c.itemId)));

/** Trim a checklist label to a short, quotable phrase for a reframed question. */
export function shortPhrase(label: string): string {
  return label
    .split(/\s+[—/]\s+|\s+\(/)[0]
    .replace(/[.…]+$/, "")
    .trim();
}

const STARTS_BINARY = /^\s*(should|shall|ought|must|do i|can i|is it|dois|devrais|faut-il|est-ce)/i;

export function readCycle(cycle: Cycle): Reading {
  const checked = allChecked(cycle);
  const insights: Insight[] = [];
  const item = (c: Checked): InsightItem => ({
    itemId: c.itemId,
    label: c.label,
    rubric: c.rubric,
  });

  // The knot — the heaviest theme recurring across ≥2 rubrics.
  const links = computeCrossLinks(cycle);
  if (links[0]) insights.push({ kind: "knot", theme: links[0].theme, rubrics: links[0].rubrics });

  // The pull — heaviest "what I want" against heaviest "what I fear/cost".
  const want = heaviest(checked.filter((c) => WANT_RUBRICS.includes(c.rubric)));
  const fear = heaviest(checked.filter((c) => FEAR_RUBRICS.includes(c.rubric)));
  if (want && fear) insights.push({ kind: "tension", primary: item(want), secondary: item(fear) });

  const role = taggedHeaviest(checked, ROLE_IDS);
  if (role) insights.push({ kind: "role", primary: item(role) });

  const same = taggedHeaviest(checked, SAMENESS_IDS);
  if (same) insights.push({ kind: "sameness", primary: item(same) });

  const payoff = taggedHeaviest(checked, PAYOFF_IDS);
  if (payoff) insights.push({ kind: "payoff", primary: item(payoff) });

  const belief = taggedHeaviest(checked, BELIEF_IDS);
  if (belief) insights.push({ kind: "belief", primary: item(belief) });

  const exception = taggedHeaviest(checked, EXCEPTION_IDS);
  if (exception) insights.push({ kind: "exception", primary: item(exception) });

  // Gaps — important facets left untouched (only worth saying if there's a map).
  if (checked.length >= 3) {
    const gaps = GAP_RUBRICS.filter((r) => {
      const e = cycle.rubrics[r];
      return !e || (e.checkedItems.length === 0 && !e.freeText?.trim());
    });
    if (gaps.length) insights.push({ kind: "gap", rubrics: gaps.slice(0, 3) });
  }

  // Offered reframes — the pivot. Ranked by leverage, capped to keep it calm.
  const reframes: ReframeSuggestion[] = [];
  const blocker = heaviest(checked.filter((c) => c.rubric === "obstacles"));
  const emotion = heaviest(checked.filter((c) => c.rubric === "emotions"));
  if (blocker)
    reframes.push({ kind: "overcome", theme: shortPhrase(blocker.label), itemId: blocker.itemId });
  if (belief)
    reframes.push({ kind: "belief", theme: shortPhrase(belief.label), itemId: belief.itemId });
  if (role) reframes.push({ kind: "role" });
  if (emotion && !blocker)
    reframes.push({ kind: "need", theme: shortPhrase(emotion.label), itemId: emotion.itemId });
  if (STARTS_BINARY.test(cycle.question)) reframes.push({ kind: "clarify" });
  reframes.push({ kind: "smallest_step" });

  return {
    insights: insights.slice(0, 5),
    reframes: reframes.slice(0, 3),
    hasMap: checked.length > 0,
  };
}
