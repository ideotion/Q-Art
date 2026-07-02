import { describe, expect, it } from "vitest";
import { createCase, createCycle, isPristineCycle } from "./factory";

const fresh = () => createCycle("case_1", { mode: "atlas" });

describe("isPristineCycle (autosave guard)", () => {
  it("a fresh startCase cycle is pristine", () => {
    expect(isPristineCycle(fresh())).toBe(true);
    const c = createCase("u");
    expect(c.cycleIds).toEqual([]);
  });

  it("whitespace-only content stays pristine", () => {
    const cy = fresh();
    cy.question = "   ";
    cy.rubrics.emotions = { key: "emotions", checkedItems: [], freeText: "  \n ", keywords: [] };
    expect(isPristineCycle(cy)).toBe(true);
  });

  it("any real content makes it persistable", () => {
    const q = fresh();
    q.question = "Should I resign?";
    expect(isPristineCycle(q)).toBe(false);

    const item = fresh();
    item.rubrics.risks = {
      key: "risks",
      checkedItems: [{ label: "legal risk", weight: 3 }],
      keywords: [],
    };
    expect(isPristineCycle(item)).toBe(false);

    const text = fresh();
    text.rubrics.emotions = { key: "emotions", checkedItems: [], freeText: "fear", keywords: [] };
    expect(isPristineCycle(text)).toBe(false);

    const kw = fresh();
    kw.rubrics.emotions = { key: "emotions", checkedItems: [], keywords: ["fear"] };
    expect(isPristineCycle(kw)).toBe(false);

    const reframe = fresh();
    reframe.synthesis.reformulatedQuestion = "How do I…?";
    expect(isPristineCycle(reframe)).toBe(false);

    const step = fresh();
    step.actionPlan = { steps: [{ action: "call X" }] };
    expect(isPristineCycle(step)).toBe(false);
  });
});
