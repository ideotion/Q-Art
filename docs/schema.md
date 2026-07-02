# Q-Art — Canonical Decision-Object Schema (v1)

> **Proprietary** · © 2026 Ideotion · personal, non-commercial use permitted; all other rights reserved (`LICENSE`).
> **Reads with:** `concept.md` (method & intent). This file defines the data model that **all three GUIs — Atlas, Socrate, Cartes — fill in** (ADR-018) — the single structure everything else (UI, AI, team pooling, export) builds on.
> **Authoritative mirror:** `src/lib/qart/types.ts` implements this schema; if they ever disagree, the code + its tests win and this file must be updated.
> **Drafting rule:** no living/recent individuals or organizations; only well-known historical figures; no legally-loaded claims.

---

## 1. Design principles

1. **One object, three views.** Atlas (boards), Socrate (guided question-tree), and Cartes (deck) **produce and edit the exact same object** (ADR-018). Each GUI is just another way to fill it; nothing in the model knows or cares which view was used beyond a `mode` tag.
2. **The question is the spine.** The object is organized around a question that **reforms**; the reformulated question can spawn a **new cycle** (recursion). A "Case" is therefore a *chain of cycles*, not a single form.
3. **Every rubric has the same shape:** curated checklist items (from a bank) + per-item importance weight + free text + retained keywords. (See `concept.md` §3.1.)
4. **Privacy by construction.** Owners are pseudonymous; in team mode the number→identity mapping is isolated and the pooled syntheses are anonymized.
5. **The synthesis and action plan are first-class, exportable artifacts.**

---

## 2. Core entities

```ts
// ---------- primitives ----------
type ID = string;                 // opaque unique id (e.g. uuid)
type ISODate = string;            // ISO-8601 timestamp
type Weight = 1 | 2 | 3 | 4 | 5;  // relative importance ("billes"): 1 = minor, 5 = major
type Mode = "atlas" | "socrate" | "cartes"; // which GUI produced/edited this (same object either way)
type WeightMethod = "stepper" | "maxdiff" | "marbles"; // which weighting UI was used (ADR-005/022)

// ---------- the 12 rubrics ----------
// 10 exploration rubrics, plus the question (the spine) and the action plan (the output).
type RubricKey =
  | "framing_beliefs"     // Est-ce un problème ? En quoi ? + postulats / croyances
  | "stakeholders"        // Qui est concerné — including my own role
  | "emotions"            // Ce que j'éprouve
  | "ideal_scene"         // Mon idéal / la scène idéale (+ exceptions)
  | "objective_benefits"  // Objectif visé & bénéfices attendus (+ success indicators)
  | "resources"           // Ressources disponibles / leviers
  | "tried"               // Solutions déjà tentées (+ résultats)
  | "obstacles"           // Freins & obstacles / résistances
  | "risks"               // Risques / le prix de la décision
  | "timing";             // Délais d'action

// ---------- a Case = a chain of cycles ----------
interface Case {
  id: ID;
  schemaVersion: number;  // SCHEMA_VERSION (currently 1); drives export/import migrations
  ownerId: ID;            // pseudonymous owner
  title?: string;         // optional user label
  cycleIds: ID[];         // ordered; [0] is the first pass, last is the most recent
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ---------- a Cycle = one Q-Art pass over one question (the "dossier") ----------
interface Cycle {
  id: ID;
  caseId: ID;
  parentCycleId?: ID;                 // the cycle whose reformulation produced this one
  mode: Mode;
  question: string;                   // "Ma question" — what this cycle works on
  rubrics: { [K in RubricKey]?: RubricEntry };
  weightMethod?: WeightMethod;        // which weighting UI was used (default: stepper)
  synthesis: Synthesis;               // reformulation + retained keywords + croisements
  actionPlan?: ActionPlan;            // typically built in a later cycle
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ---------- a rubric's contents ----------
interface RubricEntry {
  key: RubricKey;
  checkedItems: CheckedItem[];        // from the curated QCM bank (or user-added)
  freeText?: string;                  // the person's own words
  keywords: string[];                 // retained ("bold") words that feed the synthesis
}

interface CheckedItem {
  itemId?: ID;                        // ref into the QCM bank; absent if custom
  label: string;                      // denormalized for display/export
  weight: Weight;                     // relative importance (1–5 "billes")
  custom?: boolean;                   // true if user-authored, not from the bank
}

// ---------- the deliverable ----------
interface Synthesis {
  initialQuestion: string;
  reformulatedQuestion?: string;      // empty until the pass yields a reframing
  keywordsByRubric: { [K in RubricKey]?: string[] };
  crossLinks: CrossLink[];            // "croisements": themes recurring across rubrics
}

interface CrossLink {                  // a croisement
  theme: string;                       // the recurring element
  rubrics: RubricKey[];                // where it appears
  weightSum?: number;                  // summed importance across appearances
}

interface ActionPlan {
  steps: ActionStep[];
}

interface ActionStep {
  action: string;
  withWhom?: string;                   // "avec le concours de"
  when?: string;                       // due / timeframe
  resources?: string;                  // "ressources dispo"
  indicator?: string;                  // "comment j'évalue" — how I'll know it worked
  status?: "ready" | "to_refine" | "to_build";   // triage (see concept.md §3.6)
  sabotageWatch?: string;              // a possible self-sabotage to watch
}
```

**Notes**
- **Recursion** is modelled by `Cycle.parentCycleId` + `Case.cycleIds`. The canonical resignation case (concept.md G.1) is *one Case with two cycles*: cycle 1 ("Should I resign?") whose `reformulatedQuestion` becomes cycle 2's `question` ("How do I overcome my fear of telling my boss?"), and cycle 2 carries the `actionPlan`.
- **Weighting** is **per checked item** (`CheckedItem.weight`) — relative importance, 1–5. *(Decided: per-item only; no rubric-level weight.)*
- **Croisements** (`CrossLink`) are derived, not hand-entered: the engine detects items/keywords recurring across rubrics and sums their weights to surface priorities.

---

## 3. The curated question banks (IP)

```ts
interface QcmBank {
  rubric: RubricKey;
  items: QcmItem[];
}
interface QcmItem {
  id: ID;
  label: LocalizedText;       // { en, fr } — banks ship bilingual (ADR-002)
  sharedWith?: RubricKey[];   // an item may intentionally recur in other rubrics (by design)
  tags?: string[];            // e.g. risk taxonomy buckets: "org" | "family" | "self"
}
```

The banks are the proprietary content (see `concept.md` Appendices B–C for the seed risk taxonomy and beliefs list). `sharedWith` encodes the deliberate cross-rubric recurrence that croisements rely on.

---

## 4. The 7-board packaging

The UI groups the 12 rubrics into **7 boards + a synthesis view** (provisional, from `concept.md` §3.2). The schema stays flat (per-rubric); boards are a presentation layer:

| Board | Rubrics |
|---|---|
| 1 · Question & framing | `question` (Cycle.question) + `framing_beliefs` |
| 2 · Stakeholders & my role | `stakeholders` |
| 3 · Emotions | `emotions` |
| 4 · Direction | `ideal_scene` + `objective_benefits` |
| 5 · Means & history | `resources` + `tried` |
| 6 · Forces against & cost | `obstacles` + `risks` |
| 7 · Commitment | `timing` + `action_plan` (Cycle.actionPlan) |
| Synthesis | `Synthesis` (reformulation + keywords + croisements) |

---

## 5. The team / governance layer

```ts
interface TeamCase {
  id: ID;
  question: string;                       // the shared group question
  facilitatorId: ID;
  participants: Participant[];
  pooled: { [K in RubricKey]?: PooledRubric };
  collectiveActionPlan?: ActionPlan;
  createdAt: ISODate;
  updatedAt: ISODate;
}

interface Participant {
  number: number;                         // the only label others ever see
  cycleId: ID;                            // this participant's own private Cycle
  identityRef?: ID;                       // number→identity link; readable ONLY by facilitator/platform
}

interface PooledRubric {
  rubric: RubricKey;
  contributionsByNumber: { [n: number]: string };  // facilitator view (raw, per number)
  miniSynthesis: string;                  // group view: anonymized compilation, author-unidentifiable
}
```

**Notes**
- Each participant fills a **normal `Cycle`** privately. Pooling is per rubric; the `miniSynthesis` is the anonymized compilation that goes to the group (concept.md §5.2 and Appendix D).
- `identityRef` is the single point where de-anonymization is possible; it must be access-isolated.

---

## 6. Worked instance (condensed — the resignation Case)

```jsonc
{
  "case": { "id": "c_1", "ownerId": "u_anon", "cycleIds": ["cy_1", "cy_2"] },
  "cycles": [
    {
      "id": "cy_1", "caseId": "c_1", "mode": "atlas",
      "question": "Should I resign from my post as corporate officer?",
      "rubrics": {
        "stakeholders": { "key": "stakeholders",
          "checkedItems": [
            { "label": "boss", "weight": 5 },
            { "label": "wife", "weight": 5 },
            { "label": "colleagues", "weight": 2 }
          ], "keywords": ["boss", "wife"] },
        "emotions": { "key": "emotions",
          "checkedItems": [{ "label": "fear of being charged", "weight": 5, "custom": true }],
          "freeText": "Fear of losing my job and of disappointing/losing my spouse.",
          "keywords": ["fear", "responsibility"] },
        "risks": { "key": "risks",
          "checkedItems": [
            { "label": "legal risk", "weight": 5, "itemId": "risk_self_legal" },
            { "label": "divorce", "weight": 4, "itemId": "risk_family_marital" },
            { "label": "loss of income", "weight": 3, "itemId": "risk_self_income" }
          ], "keywords": ["legal", "divorce", "income"] },
        "tried": { "key": "tried",
          "checkedItems": [{ "label": "met the boss; emailed the risks", "weight": 3, "custom": true }],
          "freeText": "Result: status quo, nothing happens.", "keywords": ["status quo"] },
        "timing": { "key": "timing", "checkedItems": [], "freeText": "Two weeks.", "keywords": ["2 weeks"] }
      },
      "synthesis": {
        "initialQuestion": "Should I resign from my post as corporate officer?",
        "reformulatedQuestion": "How do I overcome my fear of telling my boss I'm resigning?",
        "keywordsByRubric": { "emotions": ["fear"], "risks": ["legal"] },
        "crossLinks": [{ "theme": "fear of the boss", "rubrics": ["emotions", "obstacles", "stakeholders"], "weightSum": 13 }]
      }
    },
    {
      "id": "cy_2", "caseId": "c_1", "parentCycleId": "cy_1", "mode": "atlas",
      "question": "How do I overcome my fear of telling my boss I'm resigning?",
      "rubrics": {},
      "synthesis": { "initialQuestion": "How do I overcome my fear of telling my boss I'm resigning?", "keywordsByRubric": {}, "crossLinks": [] },
      "actionPlan": { "steps": [
        { "action": "Prepare and hold the resignation conversation", "when": "within 2 weeks", "status": "to_refine", "sabotageWatch": "delaying again to keep the status quo" }
      ] }
    }
  ]
}
```

This validates the model: the reframing links two cycles, and the action plan lives on the second.

---

## 7. Open questions

1. **Weighting scale:** weighting is **per item** (decided). Open: keep the **1–5 "billes"** scale, or low/med/high?
2. **Croisements:** matched on `itemId`, on normalized keywords, or AI-assisted clustering?
3. **Socrate mapping:** how a free conversation is reliably mapped onto rubric entries (function-calling into this schema vs post-hoc extraction).
4. **Storage & sync:** local-first store + optional encrypted sync; how the team `identityRef` is isolated (separate store / key).
5. **Internationalization:** *resolved* — rubric/bank/question-tree content ships bilingual (`LocalizedText`); the object keys stay language-neutral; the user's own words are stored as written.
6. **Versioning:** *resolved* — `SCHEMA_VERSION` (1) on `Case` + versioned dossier export/import with a migration seam (ADR-020).

---

## 8. Next step

This model is implemented (`src/lib/qart/types.ts`) and all three GUIs write it. What remains open above (weighting scale, croisement matching, Socrate mapping for the v2 LLM) is tracked in `decisions.md` §Open / deferred.
