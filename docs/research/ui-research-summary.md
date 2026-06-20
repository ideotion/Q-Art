# Q‑Art — UI/Architecture Research: Provenance & Summary

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (see `LICENSE`).
> **Status:** Reference. The **decisions** these passes informed live in **`docs/design.md`** + **`docs/decisions.md`**. This file records *how* we got there and *what convinced us*, so a fresh session trusts the conclusions.

## The process (June 2026)
A deliberate, multi‑engine, adversarial review before committing to a UI/architecture, run as **five passes**:
1. **Report 1** — UI/UX direction + OSS toolkit (voice‑inclusive).
2. **Report 2** — same, revised after dropping custom voice (rely on OS keyboard dictation; dictation‑friendly inputs).
3. **Red‑team review** — adversarial critique of Reports 1 & 2 (steelman the opposite, widen alternatives, expose blind spots).
4. **Independent second opinion — Phase 1** — a *different* model, run **blind** (no prior docs), forming its own conclusions.
5. **Independent second opinion — Phase 2** — that model then confronting/verifying all prior work and proposing new ideas.

> The raw outputs of all five passes are held by the team (outside the repo). They can be archived under `docs/research/` on request; this summary is the durable, curated record.

## Why we trust the result: independent convergence
The blind Phase‑1 model landed on the **red‑team's revised plan**, not the original two reports — on ~8 of 13 contested forks **without seeing the critique**. Cross‑engine convergence on the same pivots is the strongest de‑risking signal short of building it. Those pivots are now the baseline (see `design.md`).

## Verified facts (load‑bearing, checked across passes)
- **View Transitions API** is Baseline for same‑document transitions incl. **Safari 18+** → no JS animation lib needed for most transitions.
- **WCAG 2.2 SC 2.5.7** requires a non‑drag alternative for any drag → steppers are **mandatory**, not optional.
- **MaxDiff/best‑worst** beats constant‑sum and rating scales on cognitive load + discrimination (constant‑sum keeps a niche: explicit magnitude).
- **iOS** evicts IndexedDB/cache under pressure; `storage.persist()` is gated/imperfect; **Capacitor** (native SQLite) improves but **does not eliminate** eviction → export/backup stays essential.
- **GDPR Article 9** (special‑category) likely applies → a **DPIA** is prudent/likely‑mandatory.
- **Dyslexia‑specific fonts**: weak efficacy evidence; the real levers are **spacing/size/contrast**.
- **Paraglide** (compile‑time i18n) is markedly lighter than runtime next‑intl, and framework‑agnostic.
- License traps confirmed: **tldraw** (proprietary, license key + watermark) and **GSAP** (free but proprietary) → use **React Flow/Excalidraw** and **Motion** (MIT).

## Decisions reached (pointers)
- Socrate v1 = deterministic question‑tree (no LLM) → **ADR‑016**; v1 fully local → **ADR‑004/007**, `data-policy.md`.
- Weighting: prototype MaxDiff vs marbles, non‑drag required → **ADR‑005**.
- Stack refinements (Radix, Paraglide, RxDB+encryption, XState, View‑Transitions, Capacitor‑ready) → **ADR‑003/015**.
- "Calm but discoverable", text‑first synthesis, native‑textarea input → **ADR‑014**, `design.md`.
- Legal/safeguarding gating workstream → **ADR‑017**.

## Ideas surfaced, parked for v2+
Decision time‑capsule (future‑self check‑in) · bilingual side‑by‑side mirror · ship/anchor weighting metaphor · ambient soundscapes · printable‑deck export. *(Adopted: question‑tree Socrate. Candidates to prototype: balance/"thermometer" synthesis, card/"deck" board presentation.)*

## Still open (resolve later)
Weighting method (post‑test) · reflection serif‑vs‑sans (post‑test) · concrete EU host · beachhead persona/wedge · monetization · v2 LLM + sync details.
