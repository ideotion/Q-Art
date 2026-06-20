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
});
