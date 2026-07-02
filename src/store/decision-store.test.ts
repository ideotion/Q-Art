import { beforeEach, describe, expect, it } from "vitest";
import { useDecisionStore } from "./decision-store";

const store = () => useDecisionStore.getState();
beforeEach(() => store().reset());

describe("decision store (shared by both doors)", () => {
  it("startCase creates a case + cycle and links them", () => {
    store().startCase({ mode: "atlas", question: "Should I resign?" });
    const { activeCase, activeCycle } = store();
    expect(activeCase?.cycleIds).toEqual([activeCycle?.id]);
    expect(activeCycle?.mode).toBe("atlas");
    expect(activeCycle?.synthesis.initialQuestion).toBe("Should I resign?");
  });

  it("toggleItem adds then removes; setItemWeight updates weight", () => {
    store().startCase({ mode: "atlas" });
    store().toggleItem("risks", { id: "risk_self_legal", label: "legal risk" });
    expect(store().activeCycle?.rubrics.risks?.checkedItems).toHaveLength(1);

    store().setItemWeight("risks", { id: "risk_self_legal", label: "legal risk" }, 5);
    expect(store().activeCycle?.rubrics.risks?.checkedItems[0]?.weight).toBe(5);

    store().toggleItem("risks", { id: "risk_self_legal", label: "legal risk" });
    expect(store().activeCycle?.rubrics.risks?.checkedItems).toHaveLength(0);
  });

  it("setFreeText and setReformulation write to the shared object", () => {
    store().startCase({ mode: "atlas" });
    store().setFreeText("emotions", "fear of the conversation");
    expect(store().activeCycle?.rubrics.emotions?.freeText).toBe("fear of the conversation");

    store().setReformulation("How do I tell my boss?");
    expect(store().activeCycle?.synthesis.reformulatedQuestion).toBe("How do I tell my boss?");
  });

  it("both doors produce the same object shape (one map, two doors)", () => {
    store().startCase({ mode: "socrate", question: "Q?" });
    store().toggleItem("emotions", { id: "emo_fear", label: "fear / anxiety" });
    const socrateShape = Object.keys(store().activeCycle ?? {}).sort();

    store().reset();
    store().startCase({ mode: "atlas", question: "Q?" });
    store().toggleItem("emotions", { id: "emo_fear", label: "fear / anxiety" });
    const atlasShape = Object.keys(store().activeCycle ?? {}).sort();

    expect(socrateShape).toEqual(atlasShape);
  });

  it("writer actions are safe no-ops when no cycle is active", () => {
    store().setQuestion("into the void?");
    store().setFreeText("emotions", "x");
    store().setWeights([{ rubric: "risks", label: "x", weight: 5 }]);
    store().runSynthesis();
    expect(store().activeCycle).toBeNull();
  });

  it("setQuestion keeps the synthesis' initial question in sync", () => {
    store().startCase({ mode: "atlas" });
    store().setQuestion("Should I move?");
    expect(store().activeCycle?.question).toBe("Should I move?");
    expect(store().activeCycle?.synthesis.initialQuestion).toBe("Should I move?");
  });

  it("setMode records which GUI is editing without touching data", () => {
    store().startCase({ mode: "atlas", question: "Q?" });
    store().toggleItem("emotions", { id: "emo_fear", label: "fear / anxiety" });
    store().setMode("cartes");
    expect(store().activeCycle?.mode).toBe("cartes");
    expect(store().activeCycle?.rubrics.emotions?.checkedItems).toHaveLength(1);
  });

  it("setWeights batch-applies across rubrics and skips unknown items", () => {
    store().startCase({ mode: "atlas" });
    store().toggleItem("risks", { id: "risk_self_legal", label: "legal risk" });
    store().toggleItem("emotions", { id: "emo_fear", label: "fear / anxiety" });
    store().setWeights([
      { rubric: "risks", id: "risk_self_legal", label: "legal risk", weight: 5 },
      { rubric: "emotions", id: "emo_fear", label: "fear / anxiety", weight: 1 },
      { rubric: "risks", id: "not_checked", label: "ghost", weight: 4 },
      { rubric: "timing", id: "no_entry_here", label: "ghost", weight: 4 },
    ]);
    expect(store().activeCycle?.rubrics.risks?.checkedItems[0]?.weight).toBe(5);
    expect(store().activeCycle?.rubrics.emotions?.checkedItems[0]?.weight).toBe(1);
    expect(store().activeCycle?.rubrics.risks?.checkedItems).toHaveLength(1);
  });

  it("setWeightMethod records the chosen method (content-free A/B)", () => {
    store().startCase({ mode: "atlas" });
    store().setWeightMethod("marbles");
    expect(store().activeCycle?.weightMethod).toBe("marbles");
  });

  it("setFirstStep creates then updates action-plan step 0", () => {
    store().startCase({ mode: "atlas" });
    store().setFirstStep("Hand task ABC to X on Monday");
    expect(store().activeCycle?.actionPlan?.steps).toHaveLength(1);
    store().setFirstStep("Hand task ABC to X on Tuesday");
    expect(store().activeCycle?.actionPlan?.steps).toHaveLength(1);
    expect(store().activeCycle?.actionPlan?.steps[0]?.action).toContain("Tuesday");
  });

  it("runSynthesis persists derived croisements + keywords onto the object", () => {
    store().startCase({ mode: "atlas", question: "Q?" });
    // "trust" recurs across two rubrics → a cross-link must surface it.
    store().toggleItem("obstacles", { label: "I struggle to trust my colleagues", custom: true });
    store().toggleItem("tried", { label: "delegating requires trust", custom: true });
    store().runSynthesis();
    const syn = store().activeCycle?.synthesis;
    expect(syn?.crossLinks.some((l) => l.theme === "trust")).toBe(true);
    expect(Object.keys(syn?.keywordsByRubric ?? {})).toContain("obstacles");
  });

  it("startNextCycle chains a new cycle on the reformulated question (recursion)", () => {
    store().startCase({ mode: "socrate", question: "Should I resign?" });
    store().toggleItem("emotions", { id: "emo_fear", label: "fear / anxiety" });

    store().startNextCycle(); // no reformulation yet -> must be a no-op
    expect(store().activeCase?.cycleIds).toHaveLength(1);

    store().setReformulation("How do I tell my boss?");
    const first = store().activeCycle!;
    store().startNextCycle();

    const { activeCase, activeCycle } = store();
    expect(activeCase?.cycleIds).toHaveLength(2);
    expect(activeCase?.cycleIds[1]).toBe(activeCycle?.id);
    expect(activeCycle?.parentCycleId).toBe(first.id);
    expect(activeCycle?.question).toBe("How do I tell my boss?");
    expect(activeCycle?.synthesis.initialQuestion).toBe("How do I tell my boss?");
    expect(activeCycle?.mode).toBe("socrate"); // same door carries over
    expect(activeCycle?.rubrics).toEqual({}); // the map starts clean
  });

  it("setKeywords stores trimmed retained words on the rubric", () => {
    store().startCase({ mode: "atlas" });
    store().setKeywords("emotions", [" fear ", "trust", ""]);
    expect(store().activeCycle?.rubrics.emotions?.keywords).toEqual(["fear", "trust"]);
  });

  it("action-plan steps: add, update, remove", () => {
    store().startCase({ mode: "atlas" });
    store().addActionStep("Call X");
    store().addActionStep();
    store().updateActionStep(1, { action: "Draft the terms", status: "to_refine", when: "Friday" });
    expect(store().activeCycle?.actionPlan?.steps).toHaveLength(2);
    expect(store().activeCycle?.actionPlan?.steps[1]).toMatchObject({
      action: "Draft the terms",
      status: "to_refine",
      when: "Friday",
    });
    store().removeActionStep(0);
    expect(store().activeCycle?.actionPlan?.steps).toHaveLength(1);
    expect(store().activeCycle?.actionPlan?.steps[0]?.action).toBe("Draft the terms");
  });

  it("loadCycle replaces the working state (storage resume path)", () => {
    store().startCase({ mode: "atlas", question: "old" });
    const { activeCase, activeCycle } = store();
    expect(activeCase && activeCycle).toBeTruthy();
    store().reset();
    store().loadCycle(activeCase!, activeCycle!);
    expect(store().activeCycle?.question).toBe("old");
  });
});
