# Q‑Art — Project Context (for AI sessions)

Q‑Art is a **strategic decision‑making tool**. One method, **two doors**, over one shared decision object (`docs/schema.md`):
- **Atlas** — structured, deterministic board flow.
- **Socrate** — guided maieutic flow. **v1 = a deterministic, pre‑authored question‑tree (NO LLM).** LLM enrichment (via **Mistral**) is a **v2** upgrade.

v1 = **Solo**, **bilingual FR/EN**, and — critically — **fully local, no LLM, no backend.**

## Current status
- **Phase:** pre‑alpha, **`0.0.1`**. Strategy **and** UI/architecture are **locked** (consolidated from a 5‑pass research review in `docs/design.md`). The **scaffold has not been run yet** — that is the immediate next task.
- Read, in order: **`docs/design.md`**, **`docs/decisions.md`** (ADRs), `docs/data-policy.md`, `docs/roadmap.md`, `docs/concept.md`, `docs/schema.md`, `docs/question-banks.md`, `docs/diagnostics.md`, `docs/research/ui-research-summary.md`.

## Stack (decided — see `design.md`/ADR‑003)
Next.js (App Router) + TypeScript, PWA, mobile‑first · **Tailwind** · **shadcn/ui on Radix** (Base UI = upgrade path; React Aria = a11y escape hatch) · **Paraglide** i18n (compile‑time) + CSS logical properties · **Serwist** (PWA) · **RxDB** (IndexedDB, **encrypted at rest**) behind a **storage repository abstraction** · **Zustand** (UI) **+ XState** (guided flow) · motion = **CSS/View Transitions first, Motion only for physics/gestures** · **Lucide** · **react‑textarea‑autosize** · **Vitest**+**Playwright**+**GitHub Actions**. Single‑app repo.
- **v1 has no backend.** Backend (Mistral proxy + optional EU sync) = **v2**.
- **Platform hedge:** keep storage abstracted so a **Capacitor** shell (native SQLite) is a drop‑in; **export/backup first‑class**.

## AI provider (v2)
**Mistral** (sovereign EU) — the chosen LLM provider **when LLM lands in v2** (EU endpoint, no‑training, structured output, self‑host roadmap; `MISTRAL_API_KEY` server‑only). **Not** Anthropic/Claude — **do not add Anthropic SDK code.**

## Non‑negotiable rules
- **v1 is local & LLM‑free:** decision content **never leaves the device**; **encryption at rest** (RxDB) from day one.
- **Weighting:** prototype **MaxDiff vs constant‑sum marbles**, decide by test; a **non‑drag/stepper path is required** (WCAG 2.2 SC 2.5.7); billes = visual identity; per‑item 1–5 deprecated.
- **Synthesis:** **text/ranked‑list first**; no node‑graph in v1; always a text restatement.
- **Design:** "**calm, but discoverable**" — reject extreme minimalism; progressive disclosure + clear affordances. **WCAG 2.2 AA** is a release gate.
- **Privacy/legal:** one unified data policy (`data-policy.md`); anonymous, content‑free analytics only; **DPIA/Article‑9/consent/retention is a gating workstream** (counsel owns legal text; we build the affordances). Safeguarding: "not therapy/medical/legal advice" + crisis signposting.
- **IP:** the question‑tree + banks ship to the client (**visible IP**); the secret server‑side LLM prompts are a v2 concern. Secrets server‑side only when the backend arrives.
- **Versioning** (`roadmap.md`): `0.0.x` private grind → `0.1.0` public alpha (core loop, **no‑LLM**) → … → `1.0.0`. Bumps are earned.

## Git / workflow
- Develop on branch **`claude/charming-darwin-9cv8kz`**; tracked in the PR. Conventional commits. Commit + push when changes are complete.

## Open questions (ask the user)
- Weighting method + reflection serif‑vs‑sans (resolve by test) · beachhead persona/wedge · monetization · concrete EU host · v2 LLM + sync details.

## Immediate next step
Run the scaffold at **`0.0.1`** per `docs/design.md` + `docs/decisions.md`: Next.js + TS PWA, the library set above, the diagnostics fabric, `src/lib/qart/` (schema types + seeded banks + the Socrate question‑tree), the one shared store (Zustand + XState) written by **both** deterministic doors, SessionStart hook. Then iterate **Atlas UI → weighting A/B → synthesis → Socrate question‑tree**.
