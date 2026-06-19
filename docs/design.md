# Q‑Art — Design & Architecture (consolidated)

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (see `LICENSE`).
> **Status:** Accepted (June 2026). **Reads with:** `concept.md`, `schema.md`, `decisions.md`, `data-policy.md`, `roadmap.md`, `diagnostics.md`.
> **Provenance:** synthesized from **five cross‑examined research passes** — two UI/OSS reports, an adversarial red‑team, and an independent second‑opinion model run blind (Phase 1) then confronting all prior work (Phase 2). Summary in `research/ui-research-summary.md`. The pivots below are where the passes **independently converged**, which is why they're treated as settled.

---

## 0. The headline decision (and its big consequence)
**v1 ships with no LLM at all.** Both doors are deterministic in v1:
- **Atlas** — structured board flow.
- **Socrate (v1)** — a **pre‑authored maieutic question‑tree** (no model) that fills the *same* boards.

⇒ v1 is a **fully local, client‑only PWA**: no model proxy, no `MISTRAL_API_KEY`, no cloud‑LLM privacy surface. The honest claim *"your decision content never leaves your device"* is **true for v1**. **LLM enrichment of Socrate (via Mistral) is a v2 upgrade.**

## 1. Design language — "Calm, but discoverable"
Calm/quiet base (muted palette, one accent, generous space, purposeful motion) **without extreme minimalism** (NN/g: minimalism that strips signifiers harms findability for stressed users). Therefore, as explicit requirements:
- **Progressive disclosure** as the primary discoverability mechanism; clear affordances + obvious next‑step CTAs.
- Persistent board navigation; a **⌘K command palette** for power users.
- One memorable **signature element** (the decision map / the billes).
- Mobile‑first (targets ≥48px, works at 320px), **dark mode first‑class**, FR/EN parity (~30% expansion), `prefers-reduced-motion` always.
- **Core direction = "Quiet Atlas."** Carried as options to prototype: a **card/"deck" presentation** of the boards, and a calm **balance/"thermometer"** synthesis visual.

## 2. Tokens, type, motion, icons
- **Tokens:** Tailwind CSS‑variables; data‑attribute theming; the single accent is reserved for weighting/marbles.
- **Type:** hyperlegible sans for UI (Inter / Atkinson Hyperlegible); reflection body sans‑or‑serif **to be settled by testing** (evidence is mixed; serif reads warm, sans tests better for some). **Primary a11y lever = user‑adjustable size + line‑height + spacing**, not special fonts. Dyslexia‑font toggle kept **as a preference, not framed as evidence‑based**. Lean webfont budget (ideally one webfont).
- **Motion:** **CSS + View Transitions API first** (Baseline same‑document incl. Safari 18+, 0 KB); **Motion (JS) only** for marble physics + drag gestures. Avoid **GSAP** and **tldraw** (both proprietary).
- **Icons:** Lucide.

## 3. The "one map, two doors"
One shared decision object (`schema.md`), one store. Both doors write it; switch mid‑flow.
- **Atlas:** responsive **card/board flow** (no heavy canvas — lighter, calmer, more accessible). Optional read‑only overview "map."
- **Socrate (v1):** deterministic **question‑tree** filling the same boards. The question‑tree content (like the banks) **ships to the client = visible IP**; the secret server‑side LLM prompts are a **v2** concern.

## 4. Signature interactions
- **Weighting — prototype both, decide by test.** Candidates: **MaxDiff** (tap "most/least important" from small sets; lower cognitive load, evidence‑backed) and **constant‑sum "marbles."** Per‑item 1–5 is **deprecated** as the sole method (weakest discrimination). **A non‑drag/stepper path is required** (WCAG 2.2 SC 2.5.7), not optional. The **billes/marbles remain the visual identity** regardless of the underlying method.
- **Synthesis — text/ranked‑list first, always.** "X pulls against Y because…" An optional calm visual (balance/thermometer or simple matrix) is **progressive enhancement**; **no node‑graph in v1** (decorative + poor mobile a11y at this scale). Always a text restatement.
- **Reflection input — native auto‑growing `<textarea>`** (`react-textarea-autosize`): dictation‑friendly (no contenteditable IME hazards), autosave drafts, distraction‑free. Rich text (TipTap/Lexical) only if truly needed, with on‑device dictation testing.

## 5. Stack (refined — all changes reversible)
| Concern | Choice | Note |
|---|---|---|
| Framework | **Next.js (App Router) + TS** | kept — SSR marketing/SEO helps discoverability (no App Store) |
| UI | **shadcn/ui on Radix** | Radix default (lowest variance); Base UI = upgrade path; React Aria = a11y escape hatch |
| i18n | **Paraglide** (compile‑time) | zero‑runtime, typed, framework‑agnostic; + CSS **logical properties** |
| State | **Zustand (UI) + XState (flow)** | the guided flow is a guarded state machine |
| Storage | **RxDB**, **encrypted at rest**, behind a **repository abstraction** | enables a Capacitor/SQLite swap + a v2 sync path |
| Motion | **CSS/View Transitions + Motion (physics only)** | |
| Input | **react‑textarea‑autosize** | dictation‑safe |
| PWA | **Serwist** | |
| Quality | TS strict · ESLint/Prettier · Vitest · Playwright · GH Actions · SessionStart hook | |
| **v1 backend** | **none** | no LLM in v1 → fully client‑side. Backend (Mistral proxy + optional sync) = **v2**. |

## 6. Platform hedge
**PWA primary.** Because iOS evicts storage (and `persist()` is gated/imperfect), and PWAs lack App Store discoverability: keep storage behind the **repository abstraction so a Capacitor shell (WKWebView + native SQLite) is a drop‑in**. **Export/backup is first‑class regardless** (nothing fully solves eviction). Install + persistent‑storage request as onboarding. Decide PWA‑vs‑Capacitor **before public launch**.

## 7. Data & durability
One decision object with **`schemaVersion`** + migrations; **versioned JSON export/import**; **encryption at rest (RxDB) non‑negotiable.** v2 = **E2E local‑first sync** (RxDB replication to a self‑hosted EU server) for multi‑device + backup.

## 8. Accessibility — WCAG 2.2 AA (release gate)
SC **2.5.7** (non‑drag alternative), **2.5.5** (targets ≥48px), contrast (verify the muted palette), visible focus, reduced‑motion, screen‑reader paths, and **text equivalents for every visual** (the synthesis especially). Keyboard‑operable weighting + synthesis.

## 9. Privacy, legal & safeguarding
- **v1 = no‑LLM, fully local** ⇒ decision content never leaves the device. Strongest posture; claim is honest.
- **Encryption at rest** from day one (RxDB).
- **Gating workstream (counsel — not drafted in repo):** a screening **DPIA** (decision content can be GDPR **Article 9** special‑category), **explicit consent** design, **retention** policy, **data‑subject rights** (export/delete already built). The v1 local architecture keeps this surface small; it grows with v2 (LLM + sync).
- **Safeguarding:** "**not therapy / medical / legal advice**" framing + **crisis signposting** (FR/EN resources). The calm / non‑engagement philosophy is a duty‑of‑care asset — make it explicit.
- **Analytics:** anonymous, content‑free, EU‑hosted, opt‑in (ADR‑009) + the diagnostics fabric (ADR‑013).

## 10. Prototype order
1. **One store + Atlas card flow + question‑tree Socrate** both writing the same boards (the "one map, two doors").
2. **Weighting A/B** (MaxDiff vs marbles, both stepper‑accessible) + **text‑first synthesis**.
3. **Reflection composer** (native textarea + autosave) + **RxDB encryption + export**.
4. **iOS durability**: install + persist + Capacitor spike.
5. **Palette/type** in light/dark with contrast checks.

## 11. Carried ideas vs parked
- **Adopted:** question‑tree Socrate (v1). **Candidates to prototype:** balance/"thermometer" synthesis, card/"deck" board presentation.
- **Parked (v2+):** decision time‑capsule (future‑self check‑in), bilingual side‑by‑side mirror, ship/anchor weighting metaphor, ambient soundscapes, printable‑deck export.

## 12. Still open (flagged)
Weighting method (post‑test) · reflection serif‑vs‑sans (post‑test) · concrete EU host · beachhead persona/wedge · monetization direction · v2 LLM + sync details · Team mode (post‑v1).
