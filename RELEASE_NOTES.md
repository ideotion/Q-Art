# Q‑Art `0.1.0-rc.1` — the "Triptyque" release candidate

> **Confidential & proprietary** — Q‑Art is the property of **Ideotion**.
> © 2026 Ideotion · all rights reserved (`LICENSE`).

> **Draft release body — ready to paste.** The autonomous build cannot create or
> publish a GitHub Release (no create‑release capability, and it must not tag/publish
> `main`). To cut the release, follow `docs/release.md`: tag `0.1.0-rc.1` on `main`
> after merge, create a **draft** GitHub Release for that tag, paste these notes,
> and publish when ready.

Q‑Art's **core loop** — *question → 7 boards / 10 rubrics → weighting → text‑first
synthesis & reframe → export* — now runs through **three distinct GUIs over one
engine**, fully local, **no‑LLM**, bilingual **FR/EN**, targeting **WCAG 2.2 AA**.

## Install (Debian/Ubuntu, 100% local)

```bash
# Audit, then run (recommended)
curl -fsSLO https://raw.githubusercontent.com/ideotion/q-art/0.1.0-rc.1/install.sh
less install.sh && bash install.sh --ref 0.1.0-rc.1

# Or the convenient one‑liner
curl -fsSL https://raw.githubusercontent.com/ideotion/q-art/0.1.0-rc.1/install.sh | bash
```

It never needs root and sends none of your data anywhere. See `docs/install.md`.

## Highlights

- **Le triptyque — three GUIs, one object.** **Atlas** (workbench/boards),
  **Socrate** (deterministic guided dialogue, no LLM), **Cartes** (tactile deck).
  A landing picker + a header switcher; **switch mid‑session with zero data loss.**
- **Weighting A/B:** steppers · MaxDiff · constant‑sum marbles — each
  keyboard‑operable, no drag required; the 1–5 *billes* stay the identity.
- **Croisements:** themes recurring across rubrics are surfaced and weight‑summed
  into ranked priorities; text‑first synthesis with your reframed question.
- **Private by construction:** fully local; **encrypted at rest** (AES‑GCM,
  non‑extractable key); portable JSON **export/import**; **delete‑all**.
- **PWA:** offline app shell, installable, persistent‑storage onboarding.
- **Accessible:** axe (WCAG 2.2 AA) gates CI across every GUI, light/dark, FR/EN.
- **Safeguarding:** a "not therapy/medical/legal advice" + crisis notice reachable
  from every GUI; content‑free diagnostics export.

## Honest scope

v1 is local‑only and **no‑LLM, no‑backend, no accounts, no off‑device telemetry**.
Deferred behind their swap points (documented in `docs/OPEN-QUESTIONS.md`): RxDB
(vs. the shipped encrypted IndexedDB), Serwist (vs. the hand‑authored SW),
Paraglide (vs. the typed FR/EN dictionary), Motion (deck physics).

Full notes: `CHANGELOG.md`. **Proprietary — all rights reserved.**
