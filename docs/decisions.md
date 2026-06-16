# Q‑Art — Decision Records (ADRs)

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (see `LICENSE`).
> **Reads with:** `concept.md`, `schema.md`, `question-banks.md`.
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
- **Context:** French heritage and likely beachhead; broad ambition.
- **Decision:** Ship **French and English from the start**, with i18n built in; object keys stay language‑neutral (schema.md §7).
- **Consequences:** Question banks and UI copy are authored/reviewed in both languages from the outset.

## ADR‑003 — Frontend: Next.js + TypeScript
- **Status:** Accepted
- **Decision:** **Next.js + TypeScript**, built as a **PWA**, **mobile‑first** and responsive up.
- **Consequences:** Server routes/actions available for the backend; PWA offline support required for Atlas.

## ADR‑004 — Light backend in v1
- **Status:** Accepted
- **Context:** Socrate needs a server‑side model proxy; we also want a path to encrypted cross‑device sync.
- **Decision:** Stand up a **light backend** now. **All secrets live in the server environment only** — never in the client bundle or the repo.
- **Consequences:** A privacy surface to secure; Atlas must still work fully **offline / backend‑less**.

## ADR‑005 — Weighting per item
- **Status:** Accepted
- **Decision:** Importance weighting is **per checked item** (1–5); no rubric‑level weight.
- **Consequences:** `CheckedItem.weight` only (schema.md §2).

## ADR‑006 — AI provider: Mistral (sovereign EU)
- **Status:** Accepted
- **Context:** Privacy‑first product handling intimate decisions; Francophone heritage; no need for a frontier‑scale model (the deterministic Atlas backbone + curated banks carry most of the load).
- **Decision:** **Mistral** as the LLM provider. Prefer the **EU‑hosted endpoint** with **no‑training‑on‑inputs and minimal/zero retention** *(terms to verify)*. **Model tiering:** a capable mid/large tier for the reasoning turns (reframe, synthesis, detecting self‑sabotage), a small/edge tier for cheap turns (tone read, suggestion chips, acknowledgements). **Structured output / function calling** writes the canonical decision object (schema.md). **Roadmap:** self‑host an **open‑weight** Mistral model on EU infra for the governance/enterprise tier — no data leaves our servers.
- **Consequences:** Not using Anthropic/Claude (Claude‑specific tooling no longer applies). Exact model IDs/pricing **to confirm** against Mistral's current catalogue. Access via `MISTRAL_API_KEY` (server env); a developer/API key is required (a consumer chat subscription alone is insufficient).

## ADR‑007 — Privacy posture
- **Status:** Accepted
- **Decision:** **Local‑first**; **pseudonymous** (no PII required); **redact/minimize** before any model call; built‑in **export + delete**; **encryption at rest**, end‑to‑end for any future sync; **Atlas is the offline, no‑AI fallback.**
- **Consequences:** Highest‑stakes area — revisit with a threat model before Team mode (the number↔identity isolation).

## ADR‑008 — License / IP
- **Status:** Accepted
- **Decision:** **Proprietary, all rights reserved** (see `LICENSE`); protected at first.
- **Consequences:** Any move to a more open or commercial license is a deliberate, deferred decision.

---

## Open / deferred
- Exact **Mistral model lineup + EU data terms** (to verify before pinning IDs).
- **Business model** (deferred).
- **Hosting / deploy** target (static + edge/serverless; confirm against the environment's network policy).
- **Team / governance** product (post‑v1; needs the anonymity threat model).
- **Weighting scale** confirmation (1–5 "billes" vs low/med/high).
