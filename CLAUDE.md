# Q‑Art — Project Context (for AI sessions)

Q‑Art is a **strategic decision‑making tool**. One method, **two doors**, over one shared decision object (`docs/schema.md`):
- **Atlas** — structured, deterministic board flow.
- **Socrate** — guided maieutic flow. **v1 = a deterministic, pre‑authored question‑tree (NO LLM).** LLM enrichment (via **Mistral**) is a **v2** upgrade.

v1 = **Solo**, **bilingual FR/EN**, and — critically — **fully local, no LLM, no backend.**

## Current status
- **Phase:** pre‑alpha, **`0.0.1`**. Strategy **and** UI/architecture are **locked** (`docs/design.md`). The **`0.0.1` scaffold is in place and green** (typecheck · lint · unit · build · format): Next 16 + TS + Tailwind PWA, the `qart` domain layer, the shared Zustand+XState store, the diagnostics fabric, and **both door UIs** (Atlas boards + Socrate question‑tree) writing one store.
- **Wired vs deferred:** *wired* = domain layer, store, diagnostics, in‑memory storage **behind the repository abstraction**, FR/EN dictionary seam, both doors, CI + SessionStart hook. *Deferred (stubbed with clear swap points):* **RxDB + encryption** (`src/lib/storage`), **Paraglide** (`src/lib/i18n`), **Serwist** SW, **Motion**. e2e (Playwright) runs in CI.
- **Layout:** `src/lib/qart` (domain) · `src/lib/diag` (diagnostics) · `src/lib/storage` (repo) · `src/lib/i18n` (FR/EN) · `src/store` (Zustand+XState) · `src/app` + `src/components` (UI).
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
Iterate on the green `0.0.1` scaffold: **Atlas UI polish → weighting A/B (MaxDiff vs marbles) → synthesis depth (croisements) → Socrate question‑tree depth**, then wire the deferred libs at their swap points (**RxDB** in `src/lib/storage`, **Paraglide** in `src/lib/i18n`, **Serwist** SW). Run: `npm install` → `npm run dev`; gate with `npm run check` (typecheck+lint+test) + `npm run build`.
