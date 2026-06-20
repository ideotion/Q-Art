/**
 * The one shared decision store (Zustand). BOTH doors call these writer actions,
 * so an Atlas board and a Socrate question-tree node mutate the *same* object
 * (docs/schema.md). Mutations are immutable (structuredClone) and emit
 * content-free diagnostics (the `store` seam, ADR-013).
 */
import { create } from "zustand";
import {
  computeCrossLinks,
  createCase,
  createCycle,
  emptyRubricEntry,
  nowISO,
  topKeywordsByRubric,
  type Case,
  type Cycle,
  type ID,
  type Mode,
  type RubricEntry,
  type RubricKey,
  type Weight,
  type WeightMethod,
} from "../lib/qart";
import { diag, safe } from "../lib/diag";

const DEFAULT_WEIGHT: Weight = 3;

const SESSION_EVENT: Record<Mode, string> = {
  atlas: "atlas.case.create",
  socrate: "socrate.session.start",
  cartes: "cartes.session.start",
};

export interface ItemRef {
  id?: ID;
  label: string;
}
export interface ToggleItemInput extends ItemRef {
  custom?: boolean;
}
export interface WeightUpdate extends ItemRef {
  rubric: RubricKey;
  weight: Weight;
}

export interface DecisionState {
  activeCase: Case | null;
  activeCycle: Cycle | null;

  startCase(opts: { mode: Mode; ownerId?: ID; question?: string }): void;
  /** Record which GUI is now editing (switching GUIs keeps all data). */
  setMode(mode: Mode): void;
  setQuestion(question: string): void;
  toggleItem(rubric: RubricKey, item: ToggleItemInput): void;
  setItemWeight(rubric: RubricKey, ref: ItemRef, weight: Weight): void;
  /** Apply many weights at once (MaxDiff / marbles fold their result in here). */
  setWeights(updates: WeightUpdate[]): void;
  setWeightMethod(method: WeightMethod): void;
  setFreeText(rubric: RubricKey, text: string): void;
  setReformulation(question: string): void;
  /** Recompute the derived synthesis (croisements + keywords) onto the object. */
  runSynthesis(): void;
  /** Replace the working cycle (e.g. after loading from storage). */
  loadCycle(c: Case, cy: Cycle): void;
  reset(): void;
}

const matches = (entry: RubricEntry, ref: ItemRef): number =>
  entry.checkedItems.findIndex((ci) =>
    ref.id !== undefined ? ci.itemId === ref.id : ci.label === ref.label,
  );

export const useDecisionStore = create<DecisionState>()((set, get) => {
  const update = (fn: (cy: Cycle) => void): void => {
    const current = get().activeCycle;
    if (!current) return;
    const next = structuredClone(current);
    fn(next);
    next.updatedAt = nowISO();
    set({ activeCycle: next });
  };

  const ensureEntry = (cy: Cycle, key: RubricKey): RubricEntry => {
    const existing = cy.rubrics[key];
    if (existing) return existing;
    const created = emptyRubricEntry(key);
    cy.rubrics[key] = created;
    return created;
  };

  return {
    activeCase: null,
    activeCycle: null,

    startCase: ({ mode, ownerId, question }) => {
      const c = createCase(ownerId ?? "u_anon");
      const cy = createCycle(c.id, { mode, question });
      c.cycleIds = [cy.id];
      set({ activeCase: c, activeCycle: cy });
      diag("I", "store", SESSION_EVENT[mode], { mode: safe(mode) });
    },

    loadCycle: (c, cy) => set({ activeCase: c, activeCycle: cy }),

    setMode: (mode) =>
      update((cy) => {
        if (cy.mode !== mode) cy.mode = mode;
      }),

    setQuestion: (question) =>
      update((cy) => {
        cy.question = question;
        cy.synthesis.initialQuestion = question;
      }),

    toggleItem: (rubric, item) =>
      update((cy) => {
        const entry = ensureEntry(cy, rubric);
        const i = matches(entry, item);
        if (i >= 0) entry.checkedItems.splice(i, 1);
        else
          entry.checkedItems.push({
            itemId: item.id,
            label: item.label,
            weight: DEFAULT_WEIGHT,
            custom: item.custom,
          });
        diag("D", "store", "atlas.item.check", {
          rubric: safe(rubric),
          n: entry.checkedItems.length,
        });
      }),

    setItemWeight: (rubric, ref, weight) =>
      update((cy) => {
        const entry = cy.rubrics[rubric];
        if (!entry) return;
        const i = matches(entry, ref);
        if (i < 0) return;
        entry.checkedItems[i].weight = weight;
        diag("D", "store", "atlas.weight.set", { rubric: safe(rubric), w: weight });
      }),

    setWeights: (updates) =>
      update((cy) => {
        for (const u of updates) {
          const entry = cy.rubrics[u.rubric];
          if (!entry) continue;
          const i = matches(entry, u);
          if (i >= 0) entry.checkedItems[i].weight = u.weight;
        }
        diag("D", "store", "atlas.weight.set", { n: updates.length });
      }),

    setWeightMethod: (method) =>
      update((cy) => {
        cy.weightMethod = method;
        diag("I", "store", "weight.method.set", { method: safe(method) });
      }),

    setFreeText: (rubric, text) =>
      update((cy) => {
        ensureEntry(cy, rubric).freeText = text;
      }),

    setReformulation: (question) =>
      update((cy) => {
        cy.synthesis.reformulatedQuestion = question;
      }),

    runSynthesis: () =>
      update((cy) => {
        cy.synthesis.initialQuestion = cy.question;
        cy.synthesis.crossLinks = computeCrossLinks(cy);
        cy.synthesis.keywordsByRubric = topKeywordsByRubric(cy);
        diag("I", "store", "atlas.synthesis.run", {
          links: cy.synthesis.crossLinks.length,
        });
      }),

    reset: () => set({ activeCase: null, activeCycle: null }),
  };
});
