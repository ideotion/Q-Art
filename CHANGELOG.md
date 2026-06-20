# Changelog

All notable changes to Q‑Art. Format follows [Keep a Changelog](https://keepachangelog.com);
versioning follows `docs/roadmap.md` (ADR‑010). Proprietary — all rights reserved.

## [0.1.0-rc.1] — 2026‑06 (release candidate)

The **Triptyque** release candidate: the core loop through **three distinct GUIs over one engine**,
fully local, no‑LLM, bilingual FR/EN, targeting WCAG 2.2 AA.

### Added

- **Three GUIs, one object.** A GUI registry + landing **picker** and a header **switcher**;
  **lossless mid‑session switching** (one Zustand store, one XState navigation machine). (ADR‑018)
  - **Atlas** — structured boards (deepened).
  - **Socrate** — deterministic guided question‑tree, no LLM (deepened).
  - **Cartes** — new tactile **deck** GUI: keep/skip card stack + a "spread" overview, fully
    keyboard‑operable (no drag dependency). (ADR‑019)
- **Croisements engine** — detects themes recurring across rubrics, sums their weights → ranked
  priorities; pure + unit‑tested; feeds every GUI's synthesis.
- **Weighting A/B** — selectable **steppers · MaxDiff · constant‑sum marbles**, each with a
  non‑drag keyboard path; method recorded content‑free; 1–5 *billes* stay canonical. (ADR‑005/022)
- **Encrypted‑at‑rest persistence** — an encrypted IndexedDB repository (AES‑GCM, non‑extractable
  key) behind the storage abstraction; autosave + non‑coercive **Continue**; versioned **dossier**
  export/import + migration seam; **delete all**. (ADR‑020)
- **PWA** — hand‑authored offline service worker (app shell + assets), web manifest, install path,
  update toast, and a `navigator.storage.persist()` onboarding prompt. (ADR‑021)
- **In‑app Help/About** — method explainer, the three GUIs, privacy, an **accessibility
  statement**, and a prominent **safeguarding + crisis signposting** notice reachable from every
  GUI; plus a content‑free **diagnostics export** panel. (ADR‑013/017)
- **Accessibility gate** — `@axe-core/playwright` scans every GUI in light/dark and FR/EN; CI fails
  on serious/critical violations.
- **Installer** — transparent, Debian‑first `install.sh` (+ `uninstall.sh`), never root; a CI
  `shell` job (shellcheck + dry‑run). (ADR‑023)
- **Docs** — `architecture.md`, `install.md`, `testing.md`, `release.md`, `CONTRIBUTING.md`,
  `SECURITY.md`, and six new ADRs (018–023).

### Changed

- `Mode` extended to `atlas | socrate | cartes` (additive; persisted shape unchanged).
- Synthesis now hosts the weighting pass + croisements in a shared view used by all GUIs.
- CI now runs four gates: **verify · e2e · a11y · shell**.

### Notes

- v1 stays **fully local**: no LLM, no backend, no accounts, no off‑device telemetry. Decision
  content never leaves the device and is encrypted at rest.
- Deferred behind their swap points and documented: RxDB (vs. the shipped encrypted IndexedDB),
  Serwist (vs. the hand‑authored SW), Paraglide (vs. the typed FR/EN dictionary), Motion (deck
  physics). See `docs/OPEN-QUESTIONS.md`.

## [0.0.1] — 2026‑06

- Initial scaffold: Next 16 + TS + Tailwind PWA; domain layer, shared store, diagnostics fabric,
  in‑memory storage behind the repository abstraction, FR/EN seam, and both original doors.
