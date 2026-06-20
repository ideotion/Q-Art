/**
 * The one shared decision store (Zustand). BOTH doors call these writer actions,
 * so an Atlas board and a Socrate question-tree node mutate the *same* object
 * (docs/schema.md). Mutations are immutable (structuredClone) and emit
 * content-free diagnostics (the `store` seam, ADR-013).
 */
import { create } from "zustand";
import {
  createCase,
  createCycle,
  emptyRubricEntry,
  nowISO,
  type Case,
  type Cycle,
  type ID,
  type Mode,
  type RubricEntry,
  type RubricKey,
  type Weight,
} from "../lib/qart";
import { diag, safe } from "../lib/diag";

const DEFAULT_WEIGHT: Weight = 3;

export interface ItemRef {
  id?: ID;
  label: string;
}
export interface ToggleItemInput extends ItemRef {
  custom?: boolean;
}

export interface DecisionState {
  activeCase: Case | null;
  activeCycle: Cycle | null;

  startCase(opts: { mode: Mode; ownerId?: ID; question?: string }): void;
  setQuestion(question: string): void;
  toggleItem(rubric: RubricKey, item: ToggleItemInput): void;
  setItemWeight(rubric: RubricKey, ref: ItemRef, weight: Weight): void;
  setFreeText(rubric: RubricKey, text: string): void;
  setReformulation(question: string): void;
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
      diag("I", "store", mode === "socrate" ? "socrate.session.start" : "atlas.case.create", {
        mode: safe(mode),
      });
    },

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

    setFreeText: (rubric, text) =>
      update((cy) => {
        ensureEntry(cy, rubric).freeText = text;
      }),

    setReformulation: (question) =>
      update((cy) => {
        cy.synthesis.reformulatedQuestion = question;
      }),

    reset: () => set({ activeCase: null, activeCycle: null }),
  };
});
