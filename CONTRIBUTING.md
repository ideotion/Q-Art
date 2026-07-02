# Contributing to Q‑Art

> **Proprietary** · © 2026 Ideotion · personal, non-commercial use permitted; all other rights reserved (`LICENSE`).
> Read `CLAUDE.md`, `docs/design.md`, and `docs/decisions.md` first — the strategy and architecture
> are locked, and several rules are **non‑negotiable**.

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
```

Node ≥ 20. Single Next.js app (App Router) + TypeScript + Tailwind v4.

## Scripts

| Script | What |
|---|---|
| `npm run dev` | Dev server. |
| `npm run check` | **typecheck + lint + unit tests** (run before every commit). |
| `npm run build` | Production build. |
| `npm run test` / `test:watch` | Vitest unit tests. |
| `npm run test:e2e` | Playwright e2e (needs a browser: `npx playwright install chromium`). |
| `npm run format` / `format:check` | Prettier. |

## The bar (all are CI gates)

- **TypeScript strict**, no `any` escapes. **Prettier** + **ESLint** clean.
- **Unit + e2e green.** e2e covers the core loop in **each** GUI, the language toggle, export, and
  cross‑GUI data preservation.
- **Accessibility — WCAG 2.2 AA.** `@axe-core/playwright` scans every GUI in light/dark and FR/EN;
  CI fails on serious/critical violations. Every interaction must be **keyboard‑operable with a
  non‑drag path** (SC 2.5.7); targets ≥ 48px; visible focus; respect `prefers-reduced-motion`.
- **Bilingual FR/EN parity.** Every user‑facing string exists in both locales; parity tests enforce
  it for the dictionary, the domain content, the GUI registry, and the About copy.
- **Privacy.** No LLM, no backend, no off‑device telemetry, no secrets. Decision content stays on
  device, encrypted at rest. Diagnostics stay **content‑free** — the typed sink makes a raw content
  string unrepresentable in a log; keep that guarantee (there's a test for it).
- **Shell.** `install.sh` / `uninstall.sh` must pass `shellcheck` and `--dry-run`.

## Conventions

- **One object, three views.** GUIs are presentation only; never fork the schema or the store.
  New GUI code lives under `src/app/<gui>` + `src/components/<gui>`; shared primitives in
  `src/components`. Keep the `lib/qart | lib/gui | lib/diag | lib/storage | lib/i18n | store`
  separation.
- **Motion:** CSS + View Transitions first; **Motion (JS) only** for physics/gestures. No `tldraw`,
  no `GSAP` (proprietary). Prefer MIT/Apache deps; record every new dep + license in the PR.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` …). Small, green, and often.
- **Decisions** become ADRs in `docs/decisions.md`; genuine ambiguity goes to `docs/OPEN-QUESTIONS.md`.

## Pull requests

Keep PRs focused and green. Update docs and the relevant ADRs. Note any new dependency and its
license. Never commit secrets.
