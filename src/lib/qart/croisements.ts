/**
 * Croisements engine (docs/schema.md §2, concept.md §3) — pure & deterministic.
 *
 * A *croisement* is a theme that recurs across rubrics. The engine tokenizes the
 * user's checked-item labels, retained keywords, and free text per rubric, finds
 * tokens that surface in two or more rubrics, and sums the contributing weights —
 * surfacing what quietly pulls on the decision from several directions at once
 * (the canonical "fear of the boss" spanning emotions + obstacles + stakeholders).
 *
 * Content-free by construction at the diagnostics layer: callers log only counts.
 */
import type { Cycle, CrossLink, RubricKey, Weight } from "./types";

/** Short, bilingual (EN/FR) stop-word set for tokens of length ≥ 3. */
const STOPWORDS = new Set([
  // EN
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "your",
  "you",
  "are",
  "was",
  "not",
  "but",
  "all",
  "any",
  "can",
  "has",
  "have",
  "from",
  "what",
  "who",
  "how",
  "why",
  "when",
  "will",
  "would",
  "should",
  "could",
  "its",
  "them",
  "they",
  "their",
  "about",
  "into",
  "more",
  "most",
  "some",
  "just",
  "like",
  "only",
  "over",
  "than",
  "then",
  "there",
  "these",
  "those",
  "very",
  "also",
  "been",
  "being",
  "does",
  "done",
  "each",
  "here",
  "much",
  "must",
  "need",
  "same",
  "such",
  "want",
  "well",
  "were",
  // FR
  "les",
  "des",
  "une",
  "est",
  "pas",
  "que",
  "qui",
  "quoi",
  "pour",
  "avec",
  "dans",
  "sur",
  "mes",
  "mon",
  "ses",
  "son",
  "leur",
  "nous",
  "vous",
  "ils",
  "elle",
  "elles",
  "cela",
  "ceci",
  "mais",
  "tout",
  "tous",
  "toute",
  "toutes",
  "plus",
  "moins",
  "très",
  "aussi",
  "être",
  "avoir",
  "fait",
  "faire",
  "par",
  "cet",
  "cette",
  "comme",
  "donc",
  "sans",
  "sous",
  "entre",
  "déjà",
  "encore",
  "même",
  "aux",
  "ont",
  "été",
]);

const tokenize = (s: string): string[] =>
  s
    .toLowerCase()
    .split(/[^\p{L}]+/u)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));

export interface PriorityItem {
  label: string;
  weight: Weight;
  rubric: RubricKey;
}

/** All checked items across the cycle, highest weight first (text-first synthesis). */
export function rankedPriorities(cycle: Cycle, limit?: number): PriorityItem[] {
  const items: PriorityItem[] = [];
  for (const [rubric, entry] of Object.entries(cycle.rubrics)) {
    for (const ci of entry?.checkedItems ?? []) {
      items.push({ label: ci.label, weight: ci.weight, rubric: rubric as RubricKey });
    }
  }
  items.sort((a, b) => b.weight - a.weight);
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

interface Acc {
  rubrics: Set<RubricKey>;
  weightSum: number;
}

/**
 * Detect themes (tokens) recurring across ≥ 2 rubrics and sum their contributing
 * weights. The token *is* the theme — faithful to the user's own words and stable
 * across locales. Sorted by breadth (how many rubrics) then by summed weight.
 */
export function computeCrossLinks(cycle: Cycle, limit = 8): CrossLink[] {
  const byToken = new Map<string, Acc>();

  const contribute = (rubric: RubricKey, text: string, weight: number) => {
    for (const tok of new Set(tokenize(text))) {
      const acc = byToken.get(tok) ?? { rubrics: new Set<RubricKey>(), weightSum: 0 };
      acc.rubrics.add(rubric);
      acc.weightSum += weight;
      byToken.set(tok, acc);
    }
  };

  for (const [key, entry] of Object.entries(cycle.rubrics)) {
    if (!entry) continue;
    const rubric = key as RubricKey;
    for (const ci of entry.checkedItems) contribute(rubric, ci.label, ci.weight);
    for (const kw of entry.keywords) contribute(rubric, kw, 1);
    if (entry.freeText) contribute(rubric, entry.freeText, 1);
  }

  const links: CrossLink[] = [];
  for (const [token, acc] of byToken) {
    if (acc.rubrics.size < 2) continue;
    links.push({ theme: token, rubrics: [...acc.rubrics], weightSum: acc.weightSum });
  }

  return links
    .sort((a, b) => b.rubrics.length - a.rubrics.length || (b.weightSum ?? 0) - (a.weightSum ?? 0))
    .slice(0, limit);
}

/** Top retained tokens per rubric (feeds Synthesis.keywordsByRubric). */
export function topKeywordsByRubric(
  cycle: Cycle,
  perRubric = 4,
): Partial<Record<RubricKey, string[]>> {
  const out: Partial<Record<RubricKey, string[]>> = {};
  for (const [key, entry] of Object.entries(cycle.rubrics)) {
    if (!entry) continue;
    const counts = new Map<string, number>();
    const add = (text: string) => {
      for (const tok of tokenize(text)) counts.set(tok, (counts.get(tok) ?? 0) + 1);
    };
    for (const ci of entry.checkedItems) add(ci.label);
    for (const kw of entry.keywords) add(kw);
    if (entry.freeText) add(entry.freeText);
    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, perRubric)
      .map(([t]) => t);
    if (top.length) out[key as RubricKey] = top;
  }
  return out;
}
