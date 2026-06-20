import { describe, expect, it } from "vitest";
import { computeCrossLinks, rankedPriorities, topKeywordsByRubric } from "./croisements";
import { createCycle } from "./factory";
import type { Cycle, RubricKey, Weight } from "./types";

/** Build a cycle with a few checked items per rubric for engine tests. */
function cycleWith(
  entries: Partial<Record<RubricKey, { label: string; weight: Weight }[]>>,
): Cycle {
  const cy = createCycle("c1", { mode: "atlas", question: "Should I resign?" });
  for (const [rubric, items] of Object.entries(entries)) {
    cy.rubrics[rubric as RubricKey] = {
      key: rubric as RubricKey,
      checkedItems: (items ?? []).map((i) => ({ label: i.label, weight: i.weight })),
      keywords: [],
    };
  }
  return cy;
}

describe("rankedPriorities", () => {
  it("returns all checked items, heaviest first, respecting an optional limit", () => {
    const cy = cycleWith({
      emotions: [{ label: "fear of the boss", weight: 5 }],
      risks: [{ label: "legal exposure", weight: 3 }],
      timing: [{ label: "two weeks", weight: 4 }],
    });
    const ranked = rankedPriorities(cy);
    expect(ranked.map((r) => r.weight)).toEqual([5, 4, 3]);
    expect(rankedPriorities(cy, 2)).toHaveLength(2);
  });
});

describe("computeCrossLinks", () => {
  it("surfaces a theme recurring across rubrics and sums its weights", () => {
    const cy = cycleWith({
      emotions: [{ label: "fear of the boss", weight: 5 }],
      obstacles: [{ label: "fear of conflict", weight: 4 }],
      stakeholders: [{ label: "my boss", weight: 5 }],
    });
    const links = computeCrossLinks(cy);
    const fear = links.find((l) => l.theme.toLowerCase().includes("fear"));
    expect(fear).toBeDefined();
    expect(fear?.rubrics).toEqual(expect.arrayContaining(["emotions", "obstacles"]));
    expect(fear?.weightSum).toBe(9); // 5 + 4

    const boss = links.find((l) => l.theme.toLowerCase().includes("boss"));
    expect(boss?.rubrics).toEqual(expect.arrayContaining(["emotions", "stakeholders"]));
  });

  it("ignores themes confined to a single rubric", () => {
    const cy = cycleWith({
      emotions: [{ label: "fear of the boss", weight: 5 }],
      risks: [{ label: "legal exposure", weight: 3 }],
    });
    const links = computeCrossLinks(cy);
    expect(links.find((l) => l.theme.toLowerCase().includes("legal"))).toBeUndefined();
  });

  it("ranks broader croisements (more rubrics) first", () => {
    const cy = cycleWith({
      emotions: [{ label: "fear here", weight: 1 }],
      obstacles: [{ label: "fear there", weight: 1 }],
      risks: [{ label: "fear everywhere", weight: 1 }],
      timing: [{ label: "money soon", weight: 5 }],
      resources: [{ label: "money saved", weight: 5 }],
    });
    const links = computeCrossLinks(cy);
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].rubrics.length).toBeGreaterThanOrEqual(links[links.length - 1].rubrics.length);
  });

  it("is empty for an empty cycle", () => {
    expect(computeCrossLinks(createCycle("c", { mode: "atlas" }))).toEqual([]);
  });
});

describe("topKeywordsByRubric", () => {
  it("extracts significant tokens per rubric, skipping stop-words", () => {
    const cy = cycleWith({ emotions: [{ label: "fear of the conversation", weight: 5 }] });
    const kw = topKeywordsByRubric(cy);
    expect(kw.emotions).toContain("fear");
    expect(kw.emotions).not.toContain("the");
  });
});
