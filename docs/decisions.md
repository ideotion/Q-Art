# Q‑Art — Decision Records (ADRs)

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (see `LICENSE`).
> **Reads with:** `concept.md`, `schema.md`, `question-banks.md`, `data-policy.md`, `roadmap.md`.
> **Scope note:** the "no third‑party orgs / no legally‑loaded claims" drafting rule governs the **method / concept** content. These ADRs record **engineering** decisions, so they name the chosen tools/vendors — capabilities only, **no legal claims**.

Each entry: **Status · Context · Decision · Consequences.**

---

## ADR‑001 — v1 scope: Solo, both doors
- **Status:** Accepted
- **Context:** The product spans two axes (Solo/Team × LLM‑less/LLM‑enhanced); we need a first shippable slice.
- **Decision:** v1 = **Solo**, shipping **both Atlas (structured) and Socrate (conversational)**. Team/governance deferred.
- **Consequences:** Pulls AI, a backend, and the privacy/cost questions into v1. *Done* = one user runs a full cycle (question → 7 boards → synthesis/reframe → action plan) through either door and exports it.

## ADR‑002 — Bilingual FR/EN from day one
- **Status:** Accepted
- **Decision:** Ship **French and English from the start**, with i18n built in; object keys stay language‑neutral (schema.md §7).
- **Consequences:** Question banks and UI copy are authored/reviewed in both languages from the outset.

## ADR‑003 — Frontend: Next.js + TypeScript
- **Status:** Accepted
- **Decision:** **Next.js (App Router) + TypeScript**, built as a **PWA**, **mobile‑first** and responsive up. `src/` dir, import alias `@/*`. Styling **Tailwind**; i18n **next‑intl**; PWA/SW **Serwist**; local store **Dexie**; state **Zustand**.
- **Consequences:** Server routes/actions available for the backend.

## ADR‑004 — Light backend in v1
- **Status:** Accepted
- **Context:** Socrate needs a server‑side model proxy; secrets and IP prompts must stay off the client.
- **Decision:** Stand up a **light, stateless backend** (a Next route handler) — **no user DB in v1**. **All secrets live in the server environment only** — never in the client bundle or the repo.
- **Consequences:** Atlas must still work fully **without the backend / model** (LLM‑optional).

## ADR‑005 — Weighting per item
- **Status:** Accepted
- **Decision:** Importance weighting is **per checked item** (1–5); no rubric‑level weight.
- **Consequences:** `CheckedItem.weight` only (schema.md §2). *(Scale 1–5 "billes" vs low/med/high — to confirm.)*

## ADR‑006 — AI provider: Mistral (sovereign EU)
- **Status:** Accepted
- **Context:** Privacy‑first product handling intimate decisions; Francophone heritage; no need for a frontier‑scale model (deterministic Atlas backbone + curated banks carry most of the load).
- **Decision:** **Mistral** as the LLM provider. Prefer the **EU‑hosted endpoint** with **no‑training‑on‑inputs and minimal/zero retention** *(terms to verify)*. **Model tiering:** capable mid/large tier for reasoning turns; small/edge tier for cheap turns. **Structured output / function calling** writes the canonical decision object (schema.md). **Roadmap:** self‑host an **open‑weight** Mistral model on EU infra for the governance/enterprise tier.
- **Consequences:** **Not** using Anthropic/Claude (no Anthropic SDK code). Exact model IDs/pricing **to confirm**. Access via `MISTRAL_API_KEY` (server env); a developer/API key (*La Plateforme*) is required — a consumer chat subscription alone is insufficient.

## ADR‑007 — Privacy posture & data handling
- **Status:** Accepted — *supersedes the earlier "local‑first" framing.*
- **Decision:** **Connected PWA, private by contract** — governed by **`docs/data-policy.md`** (single source of truth). Pseudonymous; **redact/minimize** before model calls; **export + delete** from `0.1.0`; **encryption at rest** (client) now, **E2E** for sync (v2); **LLM‑optional** (Atlas needs no model; *offline is a later nice‑to‑have, not a v1 guarantee*); **anonymous, content‑free, EU‑hosted analytics**. Same baseline both doors.
- **Consequences:** Highest‑stakes area — team anonymity threat model required before Team mode (number↔identity isolation).

## ADR‑008 — License / IP
- **Status:** Accepted
- **Decision:** **Proprietary, all rights reserved** (see `LICENSE`); protected at first.
- **Consequences:** Any move to a more open or commercial license is a deliberate, deferred decision.

## ADR‑009 — Unified data policy
- **Status:** Accepted
- **Context:** Privacy‑first, EU‑rooted; need one consistent, honest contract across both doors.
- **Decision:** A single canonical data policy (**`docs/data-policy.md`**) with **three tiers** — *decision content* (never stored/mined/trained), *operational data* (anonymous, content‑free, EU‑hosted — collected to improve the app), *account data* (minimal, v2). Same baseline both doors; Socrate's model call disclosed inside the same policy. EU residency throughout.
- **Consequences:** The public Privacy Policy/ToS (counsel) must mirror this. Anonymous analytics tooling must be content‑/identity‑free and EU‑hosted.

## ADR‑010 — Versioning & release roadmap
- **Status:** Accepted
- **Decision:** See **`docs/roadmap.md`**. Decimal intent → semver: `0.0.x` private pre‑alpha grind (starts `0.0.1`); `0.1.0` public alpha (core loop complete); `0.5.0` production alpha; `0.9.0` beta; `1.0.0` polished full release. Quality bar **ramps** with version.
- **Consequences:** Releases are gated, not vibed; `package.json` starts at `0.0.1`.

## ADR‑011 — Repo shape: single app
- **Status:** Accepted
- **Decision:** **Single Next.js app** (not a monorepo) for now.
- **Consequences:** Extract to a monorepo only if a marketing site / mobile app / shared packages appear.

## ADR‑012 — Quality bar & CI
- **Status:** Accepted
- **Decision:** **TS strict**; **ESLint + Prettier**; **Vitest** (unit); **Playwright** (e2e smoke); **GitHub Actions** CI (lint/typecheck/test/build); a **SessionStart hook** so Claude‑on‑web can run lint/tests. Bar ramps with version (lenient at `0.0.x`, strict by `0.9.0`/`1.0.0`).
- **Consequences:** CI/quality scaffolding lands with the first scaffold.

---

## Open / deferred
- **Data‑policy final wording** sign‑off (working version in `docs/data-policy.md`).
- **Beachhead persona / wedge** use case.
- **Monetization direction** (informs where value‑gates land).
- Concrete **EU host** + EU analytics/error tooling.
- **Team / governance** product + anonymity threat model (post‑v1).
- **ToS / Privacy Policy** legal text (counsel).
- Languages beyond FR/EN; weighting scale (1–5 vs low/med/high).
