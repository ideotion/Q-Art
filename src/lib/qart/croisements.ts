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
import { BANK_ITEM_INDEX } from "./banks";
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

/**
 * Matching key for a token: diacritics-insensitive with a naive FR/EN plural
 * fold ("peurs"→"peur", "risques"→"risque"), so inflections of the same theme
 * merge. Display keeps the user's original form (see computeCrossLinks).
 */
const fold = (w: string): string => {
  let t = w.normalize("NFD").replace(/\p{M}+/gu, "");
  if (t.length > 3 && (t.endsWith("s") || t.endsWith("x"))) t = t.slice(0, -1);
  return t;
};

export interface PriorityItem {
  itemId?: string; // bank id when present — lets the UI re-localize live
  label: string;
  weight: Weight;
  rubric: RubricKey;
}

/** All checked items across the cycle, highest weight first (text-first synthesis). */
export function rankedPriorities(cycle: Cycle, limit?: number): PriorityItem[] {
  const items: PriorityItem[] = [];
  for (const [rubric, entry] of Object.entries(cycle.rubrics)) {
    for (const ci of entry?.checkedItems ?? []) {
      items.push({
        itemId: ci.itemId,
        label: ci.label,
        weight: ci.weight,
        rubric: rubric as RubricKey,
      });
    }
  }
  items.sort((a, b) => b.weight - a.weight);
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

interface Acc {
  rubrics: Set<RubricKey>;
  weightSum: number;
  /** original surface forms → occurrences, to pick the best display form */
  forms: Map<string, number>;
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
      const key = fold(tok);
      const acc =
        byToken.get(key) ??
        ({ rubrics: new Set<RubricKey>(), weightSum: 0, forms: new Map() } as Acc);
      acc.rubrics.add(rubric);
      acc.weightSum += weight;
      acc.forms.set(tok, (acc.forms.get(tok) ?? 0) + 1);
      byToken.set(key, acc);
    }
  };

  /** Rubrics the user actually engaged — a designed echo only counts there. */
  const engaged = new Set<RubricKey>();
  for (const [key, entry] of Object.entries(cycle.rubrics)) {
    if (!entry) continue;
    if (entry.checkedItems.length > 0 || entry.freeText?.trim() || entry.keywords.length > 0)
      engaged.add(key as RubricKey);
  }

  for (const [key, entry] of Object.entries(cycle.rubrics)) {
    if (!entry) continue;
    const rubric = key as RubricKey;
    for (const ci of entry.checkedItems) {
      contribute(rubric, ci.label, ci.weight);
      // Designed recurrence (`sharedWith`, question-banks.md): a checked bank
      // item whose concept deliberately echoes in other rubrics contributes its
      // tokens there too — but only into rubrics the user actually engaged.
      const bankItem = ci.itemId ? BANK_ITEM_INDEX.get(ci.itemId) : undefined;
      for (const echo of bankItem?.sharedWith ?? []) {
        if (echo !== rubric && engaged.has(echo)) contribute(echo, ci.label, ci.weight);
      }
    }
    for (const kw of entry.keywords) contribute(rubric, kw, 1);
    if (entry.freeText) contribute(rubric, entry.freeText, 1);
  }

  const links: CrossLink[] = [];
  for (const [, acc] of byToken) {
    if (acc.rubrics.size < 2) continue;
    // Display the user's most frequent surface form, not the folded key.
    const theme = [...acc.forms.entries()].sort((a, b) => b[1] - a[1])[0][0];
    links.push({ theme, rubrics: [...acc.rubrics], weightSum: acc.weightSum });
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
    const counts = new Map<string, { n: number; forms: Map<string, number> }>();
    const add = (text: string) => {
      for (const tok of tokenize(text)) {
        const key = fold(tok);
        const acc = counts.get(key) ?? { n: 0, forms: new Map<string, number>() };
        acc.n += 1;
        acc.forms.set(tok, (acc.forms.get(tok) ?? 0) + 1);
        counts.set(key, acc);
      }
    };
    for (const ci of entry.checkedItems) add(ci.label);
    for (const kw of entry.keywords) add(kw);
    if (entry.freeText) add(entry.freeText);
    const top = [...counts.values()]
      .sort((a, b) => b.n - a.n)
      .slice(0, perRubric)
      .map((acc) => [...acc.forms.entries()].sort((x, y) => y[1] - x[1])[0][0]);
    if (top.length) out[key as RubricKey] = top;
  }
  return out;
}
