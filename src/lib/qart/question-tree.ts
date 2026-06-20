/**
 * Socrate v1 — the deterministic, pre-authored maieutic question-tree (NO LLM).
 *
 * Per ADR-016: Socrate v1 walks the user through the same rubrics as Atlas, in a
 * guided one-question-at-a-time flow, and writes the *same* decision object. The
 * prompts are authored content (drawn from RUBRIC_META), so the tree is built
 * deterministically from the canonical rubric order — no model, fully local.
 * LLM enrichment of this flow is a v2 upgrade.
 */
import { RUBRIC_KEYS, RUBRIC_META } from "./rubrics";
import type { LocalizedText, RubricKey } from "./types";

export type QuestionNodeKind = "intro" | "question" | "rubric" | "reframe" | "summary";

export interface QuestionNode {
  id: string;
  kind: QuestionNodeKind;
  prompt: LocalizedText;
  help?: LocalizedText;
  /** present for kind "rubric": which rubric the UI fills at this node */
  rubric?: RubricKey;
  /** next node id; absent at the end of the flow */
  next?: string;
}

export interface QuestionTree {
  id: string;
  version: number;
  rootId: string;
  /** node ids in traversal order (v1 is linear) */
  order: string[];
  nodes: Record<string, QuestionNode>;
}

export const rubricNodeId = (key: RubricKey): string => `r_${key}`;

function buildTree(): QuestionTree {
  const order: string[] = [];
  const nodes: Record<string, QuestionNode> = {};
  const add = (n: QuestionNode) => {
    nodes[n.id] = n;
    order.push(n.id);
  };

  add({
    id: "intro",
    kind: "intro",
    prompt: {
      en: "Let's map your question together — one facet at a time. There are no wrong answers.",
      fr: "Cartographions votre question ensemble — une facette à la fois. Il n'y a pas de mauvaise réponse.",
    },
  });
  add({
    id: "question",
    kind: "question",
    prompt: {
      en: "What's the question you can't resolve? State it in your own words.",
      fr: "Quelle est la question que vous n'arrivez pas à trancher ? Formulez-la avec vos mots.",
    },
  });

  for (const key of RUBRIC_KEYS) {
    const meta = RUBRIC_META[key];
    add({
      id: rubricNodeId(key),
      kind: "rubric",
      rubric: key,
      prompt: meta.openPrompts[0],
      help: meta.motto ?? meta.intent,
    });
  }

  add({
    id: "reframe",
    kind: "reframe",
    prompt: {
      en: "Looking at the whole map, how would you restate your question now? The reframing often begins with “How do I…”.",
      fr: "Au vu de toute la carte, comment reformuleriez-vous votre question maintenant ? La reformulation commence souvent par « Comment faire pour… ».",
    },
  });
  add({
    id: "summary",
    kind: "summary",
    prompt: {
      en: "Here is your map: your initial question, what mattered most, and your reframed question.",
      fr: "Voici votre carte : votre question initiale, ce qui compte le plus, et votre question reformulée.",
    },
  });

  for (let i = 0; i < order.length - 1; i++) {
    nodes[order[i]].next = order[i + 1];
  }

  return { id: "socrate_v1", version: 1, rootId: order[0], order, nodes };
}

export const SOCRATE_TREE: QuestionTree = buildTree();

export function getNode(id: string): QuestionNode | undefined {
  return SOCRATE_TREE.nodes[id];
}
