# Q‑Art — Project Context (for AI sessions)

Q‑Art is a **strategic decision‑making tool**. One method, **three GUIs** (ADR‑018), over one shared decision object (`docs/schema.md`):
- **Atlas** — structured, deterministic board flow.
- **Socrate** — guided maieutic flow. **v1 = a deterministic, pre‑authored question‑tree (NO LLM).** LLM enrichment (via **Mistral**) is a **v2** upgrade.
- **Cartes** — tactile card‑deck flow (keep/skip/weigh), keyboard‑complete (ADR‑019).

v1 = **Solo**, **bilingual FR/EN**, and — critically — **fully local, no LLM, no backend.**

## Current status
- **Phase:** release‑candidate hardening, **`0.1.0-rc.1`**. Strategy **and** UI/architecture are **locked** (`docs/design.md`). The RC is green (typecheck · lint · unit · e2e · a11y · shell · build · format): Next 16 + TS + Tailwind PWA, the `qart` domain layer + pure engines (weighting · croisements · reading), the shared Zustand+XState store, the diagnostics fabric, encrypted‑at‑rest persistence + versioned export/import, the offline service worker, and **all three GUIs** writing one store.
- **Wired vs deferred:** *wired* = domain layer + engines, store, diagnostics, **encrypted IndexedDB** persistence behind the repository abstraction (ADR‑020), FR/EN dictionary seam (fully bilingual banks), all three GUIs, hand‑authored SW (ADR‑021), CI (verify · e2e · a11y · shell) + SessionStart hook. *Deferred by decision (ADR‑026), with triggers:* **RxDB** → v2/sync (our WebCrypto adapter is stronger than RxDB's CryptoJS default), **Serwist** → `@serwist/next@10` GA (Turbopack), **Paraglide** → owner‑gated (feasible but a large refactor for tree‑shaking only), **Motion** → deck physics.
- **Layout:** `src/lib/qart` (domain) · `src/lib/diag` (diagnostics) · `src/lib/storage` (repo) · `src/lib/i18n` (FR/EN) · `src/store` (Zustand+XState) · `src/app` + `src/components` (UI).
- Read, in order: **`docs/design.md`**, **`docs/decisions.md`** (ADRs), `docs/data-policy.md`, `docs/roadmap.md`, `docs/concept.md`, `docs/schema.md`, `docs/question-banks.md`, `docs/diagnostics.md`, `docs/research/ui-research-summary.md`.

## Stack (decided — see `design.md`/ADR‑003)
Next.js (App Router) + TypeScript, PWA, mobile‑first · **Tailwind** · **shadcn/ui on Radix** (Base UI = upgrade path; React Aria = a11y escape hatch) · **Paraglide** i18n (compile‑time) + CSS logical properties · **Serwist** (PWA) · **RxDB** (IndexedDB, **encrypted at rest**) behind a **storage repository abstraction** · **Zustand** (UI) **+ XState** (guided flow) · motion = **CSS/View Transitions first, Motion only for physics/gestures** · **Lucide** · **react‑textarea‑autosize** · **Vitest**+**Playwright**+**GitHub Actions**. Single‑app repo.
- **v1 has no backend.** Backend (Mistral proxy + optional EU sync) = **v2**.
- **Platform hedge:** keep storage abstracted so a **Capacitor** shell (native SQLite) is a drop‑in; **export/backup first‑class**.

## AI provider (v2)
**Mistral** (sovereign EU) — the chosen LLM provider **when LLM lands in v2** (EU endpoint, no‑training, structured output, self‑host roadmap; `MISTRAL_API_KEY` server‑only). **Not** Anthropic/Claude — **do not add Anthropic SDK code.**

## Non‑negotiable rules
- **v1 is local & LLM‑free:** decision content **never leaves the device**; **encryption at rest** from day one (shipped: WebCrypto encrypted IndexedDB, ADR‑020; RxDB is a **v2/sync‑time** swap, not v1 — ADR‑026).
- **Weighting:** prototype **MaxDiff vs constant‑sum marbles**, decide by test; a **non‑drag/stepper path is required** (WCAG 2.2 SC 2.5.7); billes = visual identity; per‑item 1–5 deprecated.
- **Synthesis:** **text/ranked‑list first**; no node‑graph in v1; always a text restatement.
- **Design:** "**calm, but discoverable**" — reject extreme minimalism; progressive disclosure + clear affordances. **WCAG 2.2 AA** is a release gate.
- **Privacy/legal:** one unified data policy (`data-policy.md`); anonymous, content‑free analytics only; **DPIA/Article‑9/consent/retention is a gating workstream** (counsel owns legal text; we build the affordances). Safeguarding: "not therapy/medical/legal advice" + crisis signposting.
- **IP:** the question‑tree + banks ship to the client (**visible IP**); the secret server‑side LLM prompts are a v2 concern. Secrets server‑side only when the backend arrives.
- **Versioning** (`roadmap.md`): `0.0.x` private grind → `0.1.0` public alpha (core loop, **no‑LLM**) → … → `1.0.0`. Bumps are earned.

## Git / workflow
- Develop on a dedicated feature branch (e.g. `claude/<name>`), tracked in its PR — never commit straight to `main`. Conventional commits. Commit + push when changes are complete.

## Decisions made (owner, this cycle)
- **Beachhead:** broad — **all three personas** (independent operators · coaches/therapists B2B2C · boards/governance). Bank content spans personal/professional/governance.
- **Delivery:** **self‑host for v1** (the `curl | bash` installer); treat v1 as a technical preview. Hosted PWA / Capacitor packaging deferred until later — the user guide is written against localhost and generalizes when this is revisited.

## Open questions (still owner‑gated)
- **Team/governance mode** — needed for the boards persona; a real post‑v1 workstream (anonymous‑pooling data model in `schema.md §5` + an anonymity threat model). Design/ADR is the proposed next build.
- **Paraglide** migration — feasible but owner‑gated (ADR‑026); recommendation is "not yet".
- **Cut `0.1.0`** — the roadmap gate is essentially met; the version bump + release is a human act (`docs/release.md`).
- Counsel: **LICENSE grant + DPIA** sign‑off · **monetization** · **concrete EU host** (only when hosting) · weighting‑method + serif‑vs‑sans A/B (resolve by test) · v2 LLM + sync details.

## Immediate next step
Method depth (recursion · action plan · keywords), the a11y/i18n claims, the non‑negotiable tests, the bilingual user guide (`docs/guide/`, regenerate images with `scripts/capture-guide-screenshots.mjs`), and the deepened banks (147 items) have shipped. Deferred‑lib swaps are **evidence‑gated** (ADR‑026). The highest‑leverage buildable item left is **Team/governance mode** (design‑first). Run: `npm install` → `npm run dev`; gate with `npm run check` + `npm run build`.
