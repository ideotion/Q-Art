import { describe, expect, it } from "vitest";
import { readCycle, shortPhrase } from "./insights";
import { createCycle } from "./factory";
import type { Cycle, RubricKey, Weight } from "./types";

type Seed = Partial<Record<RubricKey, { id?: string; label: string; weight?: Weight }[]>>;

function cycleWith(entries: Seed, question = "Should I resign?"): Cycle {
  const cy = createCycle("c1", { mode: "atlas", question });
  for (const [rubric, items] of Object.entries(entries)) {
    cy.rubrics[rubric as RubricKey] = {
      key: rubric as RubricKey,
      checkedItems: (items ?? []).map((i) => ({
        itemId: i.id,
        label: i.label,
        weight: i.weight ?? 3,
      })),
      keywords: [],
    };
  }
  return cy;
}

const kinds = (cy: Cycle) => readCycle(cy).insights.map((i) => i.kind);

describe("shortPhrase", () => {
  it("trims a checklist label to a quotable phrase", () => {
    expect(shortPhrase("fear of conflict / disappointing someone")).toBe("fear of conflict");
    expect(shortPhrase("fear of failing — or of succeeding")).toBe("fear of failing");
    expect(shortPhrase("people who can help (family, friends, a mentor)")).toBe(
      "people who can help",
    );
    expect(shortPhrase("I have to handle everything myself.")).toBe(
      "I have to handle everything myself",
    );
  });
});

describe("readCycle — the reading", () => {
  it("names the pull between what you want and what you fear", () => {
    const cy = cycleWith({
      objective_benefits: [{ id: "ben_peace", label: "less stress / more peace", weight: 5 }],
      obstacles: [
        { id: "obs_fear_conflict", label: "fear of conflict / disappointing someone", weight: 5 },
      ],
    });
    const tension = readCycle(cy).insights.find((i) => i.kind === "tension");
    expect(tension?.primary?.label).toContain("peace");
    expect(tension?.secondary?.label).toContain("fear");
  });

  it("names the knot that recurs across rubrics", () => {
    const cy = cycleWith({
      emotions: [{ id: "emo_fear", label: "fear of the boss", weight: 5 }],
      obstacles: [{ id: "obs_fear_conflict", label: "fear of conflict", weight: 4 }],
    });
    const knot = readCycle(cy).insights.find((i) => i.kind === "knot");
    expect(knot?.theme).toBe("fear");
    expect(knot?.rubrics?.length).toBeGreaterThanOrEqual(2);
  });

  it("reflects the user's own part in keeping it going", () => {
    const cy = cycleWith({
      stakeholders: [{ id: "role_silent", label: "I keep it alive by staying silent / avoiding." }],
    });
    expect(kinds(cy)).toContain("role");
  });

  it("spots 'more of the same'", () => {
    const cy = cycleWith({
      tried: [{ id: "try_nothing_changed", label: "Nothing has changed (status quo)." }],
    });
    expect(kinds(cy)).toContain("sameness");
  });

  it("surfaces the quiet payoff of the status quo", () => {
    const cy = cycleWith({
      obstacles: [
        { id: "obs_avoid_conversation", label: "not deciding lets me avoid a hard conversation" },
      ],
    });
    expect(kinds(cy)).toContain("payoff");
  });

  it("questions an untested belief", () => {
    const cy = cycleWith({
      framing_beliefs: [
        { id: "belief_handle_alone", label: "I have to handle everything myself." },
      ],
    });
    expect(kinds(cy)).toContain("belief");
  });

  it("honours the exception where it already works", () => {
    const cy = cycleWith({
      ideal_scene: [
        {
          id: "ideal_exceptions",
          label: "There are already moments when the problem doesn't appear.",
        },
      ],
    });
    expect(kinds(cy)).toContain("exception");
  });

  it("offers a reframe from the top blocker, and clarify for a binary question", () => {
    const cy = cycleWith(
      {
        obstacles: [{ id: "obs_fear_conflict", label: "fear of conflict / disappointing someone" }],
      },
      "Should I resign?",
    );
    const r = readCycle(cy).reframes;
    const overcome = r.find((x) => x.kind === "overcome");
    expect(overcome?.theme).toBe("fear of conflict");
    expect(r.some((x) => x.kind === "clarify")).toBe(true);
  });

  it("flags skipped facets once there's a real map", () => {
    const cy = cycleWith({
      emotions: [
        { id: "emo_fear", label: "fear" },
        { id: "emo_anger", label: "anger" },
      ],
      obstacles: [{ id: "obs_not_ready", label: "I don't feel ready." }],
    });
    const gap = readCycle(cy).insights.find((i) => i.kind === "gap");
    expect(gap?.rubrics).toBeDefined();
    expect(gap?.rubrics).toContain("resources");
  });

  it("is gentle and empty-safe, but still offers a smallest step", () => {
    const cy = createCycle("c", { mode: "atlas", question: "" });
    const reading = readCycle(cy);
    expect(reading.hasMap).toBe(false);
    expect(reading.insights).toEqual([]);
    expect(reading.reframes.some((r) => r.kind === "smallest_step")).toBe(true);
  });

  it("keeps the reading calm — at most five insights", () => {
    const cy = cycleWith({
      emotions: [{ id: "emo_fear", label: "fear" }],
      obstacles: [
        { id: "obs_fear_conflict", label: "fear of conflict" },
        { id: "obs_avoid_conversation", label: "not deciding lets me avoid a hard conversation" },
      ],
      objective_benefits: [{ id: "ben_peace", label: "less stress / more peace" }],
      stakeholders: [{ id: "role_silent", label: "I keep it alive by staying silent." }],
      tried: [{ id: "try_nothing_changed", label: "Nothing has changed." }],
      framing_beliefs: [
        { id: "belief_handle_alone", label: "I have to handle everything myself." },
      ],
      ideal_scene: [
        { id: "ideal_exceptions", label: "There are already moments when it doesn't appear." },
      ],
    });
    expect(readCycle(cy).insights.length).toBeLessThanOrEqual(5);
  });
});
