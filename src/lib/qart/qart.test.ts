import { describe, expect, it } from "vitest";
import { ALL_BANKS, QCM_BANKS } from "./banks";
import { createCase, createCycle } from "./factory";
import { BOARDS, RUBRIC_KEYS, RUBRIC_META } from "./rubrics";
import { SOCRATE_TREE, rubricNodeId } from "./question-tree";
import { LOCALES, type LocalizedText, type RubricKey } from "./types";

function localizedComplete(t: LocalizedText): boolean {
  return LOCALES.every((l) => typeof t[l] === "string" && t[l].trim().length > 0);
}

describe("rubrics & boards", () => {
  it("has exactly the 10 canonical rubrics with metadata", () => {
    expect(RUBRIC_KEYS).toHaveLength(10);
    expect(new Set(RUBRIC_KEYS).size).toBe(10);
    for (const key of RUBRIC_KEYS) {
      expect(RUBRIC_META[key].key).toBe(key);
    }
  });

  it("packs every rubric into exactly one board", () => {
    const packed = BOARDS.flatMap((b) => b.rubrics);
    expect(new Set(packed)).toEqual(new Set(RUBRIC_KEYS));
    expect(packed).toHaveLength(RUBRIC_KEYS.length); // no rubric appears twice
  });

  it("hosts the spine question on board 1 and the action plan on board 7", () => {
    expect(BOARDS.find((b) => b.includesQuestion)?.id).toBe("b1");
    expect(BOARDS.find((b) => b.includesActionPlan)?.id).toBe("b7");
    expect(BOARDS.find((b) => b.isSynthesis)?.id).toBe("synthesis");
  });
});

describe("banks", () => {
  it("provides a bank for every rubric", () => {
    for (const key of RUBRIC_KEYS) {
      expect(QCM_BANKS[key].rubric).toBe(key);
      expect(QCM_BANKS[key].items.length).toBeGreaterThan(0);
    }
  });

  it("uses globally-unique item ids", () => {
    const ids = ALL_BANKS.flatMap((b) => b.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only references real rubrics in sharedWith", () => {
    const valid = new Set<RubricKey>(RUBRIC_KEYS);
    for (const bank of ALL_BANKS) {
      for (const item of bank.items) {
        for (const r of item.sharedWith ?? []) expect(valid.has(r)).toBe(true);
      }
    }
  });

  it("keeps the ids the canonical worked example relies on", () => {
    const riskIds = QCM_BANKS.risks.items.map((i) => i.id);
    expect(riskIds).toEqual(
      expect.arrayContaining(["risk_self_legal", "risk_family_marital", "risk_self_income"]),
    );
  });

  it("every item is bilingual (non-empty EN and FR)", () => {
    for (const bank of ALL_BANKS) {
      for (const item of bank.items) {
        expect(item.label.en.trim().length).toBeGreaterThan(0);
        expect(item.label.fr.trim().length).toBeGreaterThan(0);
        // A common authoring slip: FR field left identical to EN.
        expect(item.label.fr).not.toBe(item.label.en);
      }
    }
  });

  it("every reading insight-set id exists in the banks", () => {
    // Guards the reading (insights.ts) against silent bank renames/removals.
    const ids = new Set(ALL_BANKS.flatMap((b) => b.items.map((i) => i.id)));
    for (const id of READING_ANCHOR_IDS) expect(ids.has(id)).toBe(true);
  });
});

/**
 * Bank ids the deterministic reading (insights.ts) keys off. Kept here as a
 * cross-module contract: if a bank edit drops one, this test fails loudly
 * instead of the reading quietly going thinner.
 */
const READING_ANCHOR_IDS = [
  // roles (drama triangle)
  "role_overhelp",
  "role_control",
  "role_silent",
  "role_waiting",
  "role_victim",
  // beliefs to test
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
  // more-of-the-same
  "try_harder",
  "try_wait",
  "try_avoid",
  "try_nothing_changed",
  "try_worse",
  "try_control_more",
  "try_same_person",
  "try_ultimatum",
  "try_delegate_takeback",
  // quiet payoff of the status quo
  "obs_avoid_conversation",
  "obs_comfortable",
  "obs_not_ready",
  "obs_avoid_responsibility",
  "obs_loyalty",
  "obs_sunk_cost",
  // the exception where it already works
  "ideal_exceptions",
  "ideal_clear_terms",
  "ideal_borrow",
];

describe("Socrate question-tree (v1, deterministic)", () => {
  it("starts at intro, ends at summary, and is a valid linear chain", () => {
    const { order, nodes, rootId } = SOCRATE_TREE;
    expect(rootId).toBe("intro");
    expect(order[0]).toBe("intro");
    expect(order[order.length - 1]).toBe("summary");
    for (let i = 0; i < order.length - 1; i++) {
      expect(nodes[order[i]].next).toBe(order[i + 1]);
    }
    expect(nodes.summary.next).toBeUndefined();
  });

  it("has one rubric node per rubric, each bound to a real rubric", () => {
    for (const key of RUBRIC_KEYS) {
      const node = SOCRATE_TREE.nodes[rubricNodeId(key)];
      expect(node).toBeDefined();
      expect(node.kind).toBe("rubric");
      expect(node.rubric).toBe(key);
    }
  });
});

describe("factory", () => {
  it("creates a versioned case and a cycle whose synthesis mirrors the question", () => {
    const c = createCase("u_anon", { title: "Test" });
    expect(c.schemaVersion).toBeGreaterThanOrEqual(1);
    expect(c.cycleIds).toEqual([]);

    const cy = createCycle(c.id, { mode: "atlas", question: "Should I resign?" });
    expect(cy.caseId).toBe(c.id);
    expect(cy.mode).toBe("atlas");
    expect(cy.synthesis.initialQuestion).toBe("Should I resign?");
    expect(cy.rubrics).toEqual({});
  });

  it("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 50 }, () => createCase("u").id));
    expect(ids.size).toBe(50);
  });
});

describe("bilingual completeness (FR/EN non-negotiable)", () => {
  it("has EN and FR for all rubric, board, bank, and question-tree strings", () => {
    for (const key of RUBRIC_KEYS) {
      const m = RUBRIC_META[key];
      expect(localizedComplete(m.label), `${key} label`).toBe(true);
      expect(localizedComplete(m.intent), `${key} intent`).toBe(true);
      if (m.motto) expect(localizedComplete(m.motto), `${key} motto`).toBe(true);
      for (const p of m.openPrompts) expect(localizedComplete(p), `${key} prompt`).toBe(true);
    }
    for (const b of BOARDS) expect(localizedComplete(b.title), `board ${b.id}`).toBe(true);
    for (const bank of ALL_BANKS) {
      for (const item of bank.items) {
        expect(localizedComplete(item.label), `item ${item.id}`).toBe(true);
      }
    }
    for (const node of Object.values(SOCRATE_TREE.nodes)) {
      expect(localizedComplete(node.prompt), `node ${node.id} prompt`).toBe(true);
      if (node.help) expect(localizedComplete(node.help), `node ${node.id} help`).toBe(true);
    }
  });
});
