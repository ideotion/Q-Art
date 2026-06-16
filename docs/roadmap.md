# Q‑Art — Versioning & Release Roadmap

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (see `LICENSE`). **Status:** Accepted.

## Version scheme (decimal intent → semver tags)
- Pre‑alpha grind "0.01, 0.02 …" → **`0.0.1`, `0.0.2` …** (`package.json` starts at **`0.0.1`**).
- **V0.1 → `0.1.0`** · **V0.5 → `0.5.0`** · **V0.9 → `0.9.0`** · **V1 → `1.0.0`**.
- The **`0.0.x` band is private** (where the vibe‑coding churn lives). Public numbers stay honest.

## Three tracks mature at different rates
**Functionality**, **Quality & hardening**, **Design/UX**. "Fully functional at 0.1" *and* "full‑feature & bug‑less at 1.0" are both true because the tracks climb separately.

| Tag | Stage | Functionality | Quality & hardening | Design/UX | Audience |
|---|---|---|---|---|---|
| `0.0.x` | pre‑alpha dev | building toward the core loop | lenient (lint/types/CI on) | throwaway | **internal only** |
| `0.1.0` | **early alpha** | **core loop complete** — both doors, bilingual, end‑to‑end | basic tests, safety scope live, data policy enforced | rough but honest | **public** (labelled alpha) |
| `0.5.0` | **production alpha** | core hardened + key secondary features | reliable, secure, monitored, perf OK | coherent, not final | public, growing |
| `0.9.0` | **beta** | **feature‑complete** (v1 scope) | broad tests, a11y, perf, FR/EN content done | design largely final | **broad audience** |
| `1.0.0` | **release** | full feature, frictionless | **bug‑bar met, multi‑tested** | **sleek, final, UI‑centered** | general |

## Gates to advance (a bump is *earned*, not vibed)
- **→ `0.1.0`:** the hero journey runs in *both* doors (**question → 7 boards → synthesis/reframe → action plan → export**), bilingual, on Mistral, with the unified data policy enforced.
- **→ `0.5.0`:** core reliable, secure, monitored; no known data/privacy or correctness defects; safety scope solid.
- **→ `0.9.0`:** feature‑complete (v1 scope); design system in place; accessibility + perf pass.
- **→ `1.0.0`:** bug‑bar met, multi‑tested, design final, frictionless.

## The core loop (the "fully functional" target for `0.1.0`)
One user runs a full cycle through **either** door: **question → 7 boards → synthesis/reframe → action plan → export**, in FR or EN.
