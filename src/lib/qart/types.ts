/**
 * Q-Art canonical decision-object schema (TypeScript).
 *
 * Mirrors `docs/schema.md` §2. Both doors — Atlas (structured) and Socrate
 * (the v1 deterministic question-tree) — produce and edit the *same* object;
 * nothing here knows which door was used beyond the `mode` tag.
 *
 * i18n note: the curated banks (IP content) are localized (`LocalizedText`),
 * but the decision object itself stores plain strings — the user's own words,
 * in whatever language they wrote them.
 */

/** Bump when the persisted shape changes; drives export/import migrations. */
export const SCHEMA_VERSION = 1;

// ---------- i18n primitives ----------
export type Locale = "en" | "fr";
export const LOCALES = ["en", "fr"] as const satisfies readonly Locale[];
export const DEFAULT_LOCALE: Locale = "en";
/** A string available in *every* supported locale — enforces "bilingual from day one". */
export type LocalizedText = { [L in Locale]: string };

// ---------- primitives ----------
export type ID = string; // opaque unique id (uuid)
export type ISODate = string; // ISO-8601 timestamp
export type Weight = 1 | 2 | 3 | 4 | 5; // relative importance ("billes"): 1 minor … 5 major
/**
 * Which GUI produced/edited this — the schema's only nod to presentation. The
 * three GUIs are views over ONE object (ADR-018); extending this enum is additive
 * and backward compatible (old atlas/socrate data stays valid), so it does not
 * change the persisted shape (SCHEMA_VERSION unchanged).
 */
export type Mode = "atlas" | "socrate" | "cartes";

/**
 * Weighting method (ADR-005, "decide by test"). All three ship and are
 * selectable; the canonical importance stays the 1–5 billes (`CheckedItem.weight`),
 * which any method derives — the schema stays method-agnostic. This records which
 * method the user reached for (content-free, for later A/B analysis).
 */
export type WeightMethod = "stepper" | "maxdiff" | "marbles";

// ---------- the 10 exploration rubrics ----------
// (The spine `question` and the `action plan` are modelled separately, not as rubrics.)
export type RubricKey =
  | "framing_beliefs"
  | "stakeholders"
  | "emotions"
  | "ideal_scene"
  | "objective_benefits"
  | "resources"
  | "tried"
  | "obstacles"
  | "risks"
  | "timing";

// ---------- a Case = a chain of cycles ----------
export interface Case {
  id: ID;
  schemaVersion: number;
  ownerId: ID; // pseudonymous owner
  title?: string;
  cycleIds: ID[]; // ordered; [0] first pass, last is most recent
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ---------- a Cycle = one Q-Art pass over one question (the "dossier") ----------
export interface Cycle {
  id: ID;
  caseId: ID;
  parentCycleId?: ID; // the cycle whose reformulation produced this one
  mode: Mode;
  question: string; // "Ma question" — what this cycle works on
  rubrics: Partial<Record<RubricKey, RubricEntry>>;
  weightMethod?: WeightMethod; // which weighting UI was used (default: stepper)
  synthesis: Synthesis;
  actionPlan?: ActionPlan; // typically built in a later cycle
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface RubricEntry {
  key: RubricKey;
  checkedItems: CheckedItem[]; // from the curated bank, or user-added
  freeText?: string;
  keywords: string[]; // retained ("bold") words that feed the synthesis
}

export interface CheckedItem {
  itemId?: ID; // ref into the bank; absent if custom
  label: string; // denormalized snapshot for display/export
  weight: Weight;
  custom?: boolean; // true if user-authored
}

// ---------- the deliverable ----------
export interface Synthesis {
  initialQuestion: string;
  reformulatedQuestion?: string; // empty until the pass yields a reframing
  keywordsByRubric: Partial<Record<RubricKey, string[]>>;
  crossLinks: CrossLink[]; // "croisements": themes recurring across rubrics
}

export interface CrossLink {
  theme: string;
  rubrics: RubricKey[];
  weightSum?: number;
}

export interface ActionPlan {
  steps: ActionStep[];
}

export type ActionStepStatus = "ready" | "to_refine" | "to_build";

export interface ActionStep {
  action: string;
  withWhom?: string; // "avec le concours de"
  when?: string;
  resources?: string;
  indicator?: string; // how I'll know it worked
  status?: ActionStepStatus;
  sabotageWatch?: string;
}

// ---------- curated question banks (IP content) ----------
export interface QcmItem {
  id: ID;
  label: LocalizedText;
  sharedWith?: RubricKey[]; // deliberate cross-rubric recurrence (feeds croisements)
  tags?: string[]; // e.g. risk buckets: "org" | "family" | "self"
}
export interface QcmBank {
  rubric: RubricKey;
  items: QcmItem[];
}

// ---------- 7-board packaging (presentation layer; the schema stays flat) ----------
export type BoardId = "b1" | "b2" | "b3" | "b4" | "b5" | "b6" | "b7" | "synthesis";
export interface Board {
  id: BoardId;
  title: LocalizedText;
  rubrics: RubricKey[];
  includesQuestion?: boolean; // board 1 hosts the spine question
  includesActionPlan?: boolean; // board 7 hosts the action plan
  isSynthesis?: boolean;
}
