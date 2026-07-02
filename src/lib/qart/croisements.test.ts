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

describe("croisements — matching upgrades", () => {
  it("folds plural/diacritic inflections into one theme, displaying a surface form", () => {
    const cy = createCycle("c", { mode: "atlas" });
    cy.rubrics.emotions = {
      key: "emotions",
      checkedItems: [{ label: "peurs anciennes", weight: 4, custom: true }],
      keywords: [],
    };
    cy.rubrics.obstacles = {
      key: "obstacles",
      checkedItems: [{ label: "la peur du conflit", weight: 3, custom: true }],
      keywords: [],
    };
    const links = computeCrossLinks(cy);
    const peur = links.find((l) => l.theme === "peur" || l.theme === "peurs");
    expect(peur).toBeDefined();
    expect(peur?.rubrics.sort()).toEqual(["emotions", "obstacles"]);
    expect(peur?.weightSum).toBe(7);
  });

  it("a checked sharedWith item echoes into engaged linked rubrics (designed recurrence)", () => {
    const cy = createCycle("c", { mode: "atlas" });
    // obs_fear_consequences is declared sharedWith: ["risks", "emotions"] in the banks.
    cy.rubrics.obstacles = {
      key: "obstacles",
      checkedItems: [
        { itemId: "obs_fear_consequences", label: "fear of the consequences", weight: 5 },
      ],
      keywords: [],
    };
    // emotions engaged (any content) -> receives the echo; risks untouched -> no echo.
    cy.rubrics.emotions = {
      key: "emotions",
      checkedItems: [{ itemId: "emo_hope", label: "hope / excitement", weight: 2 }],
      keywords: [],
    };
    const links = computeCrossLinks(cy);
    const fear = links.find((l) => l.theme === "fear");
    expect(fear).toBeDefined();
    expect(fear?.rubrics.sort()).toEqual(["emotions", "obstacles"]);
    // The untouched rubric must NOT be claimed as part of the recurrence.
    expect(fear?.rubrics).not.toContain("risks");
  });

  it("does not echo sharedWith into rubrics the user never engaged", () => {
    const cy = createCycle("c", { mode: "atlas" });
    cy.rubrics.obstacles = {
      key: "obstacles",
      checkedItems: [
        { itemId: "obs_fear_consequences", label: "fear of the consequences", weight: 5 },
      ],
      keywords: [],
    };
    const links = computeCrossLinks(cy);
    expect(links.find((l) => l.theme === "fear")).toBeUndefined();
  });
});
