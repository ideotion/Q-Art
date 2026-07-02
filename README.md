# Q‑Art

> **Proprietary** — Q‑Art is the property of **Ideotion**.
> © 2026 Ideotion · all rights reserved. See `LICENSE`.

**A strategic decision‑making tool.** Bring the question you can't resolve; leave with a
better question — and the answer that comes with it.

One method, **three GUIs**, over one shared decision object (`docs/schema.md`):

- **Atlas — the workbench.** Structured boards, keyboard‑first, at your own pace.
- **Socrate — the dialogue.** A calm, guided question‑tree, one prompt at a time. **v1 is
  deterministic — no LLM.**
- **Cartes — the deck.** A tactile card deck: keep, skip, and weigh each card.

All three write the **same** decision — switch between them mid‑session without losing a thing.

**v1 is fully local:** your decision content never leaves your device. No account, no server, no
tracking; **encrypted at rest**. Bilingual **FR/EN**. Targets **WCAG 2.2 AA**.

> **Status:** `0.1.0‑rc.1` — release candidate. Proprietary; personal, non‑commercial local use is permitted, all other rights reserved (`LICENSE`).

## Install (Debian/Ubuntu)

One installer, one command. It's **transparent and local‑only** — it clones, builds, and serves
Q‑Art on your machine and sends none of your data anywhere. It never needs root.

```bash
curl -fsSL https://raw.githubusercontent.com/ideotion/q-art/main/install.sh | bash
```

Then open `http://localhost:3000`. No prerequisites beyond `git` — if **Node** is missing it's
installed for you (an official build, downloaded locally and checksum‑verified, no root). Prefer to
read the script first, or want flags (`--dry-run`, `--port`, `--service`, `--uninstall`)? See
**`docs/install.md`**.

> Building Q‑Art itself? Developer setup and scripts live in **`CONTRIBUTING.md`**.

## The core loop

A full cycle, in any GUI, entirely on‑device:

**question → 7 boards / 10 rubrics → weighting → text‑first synthesis & reframe → export.**

- **Weighting** (`ADR‑005`): pick **steppers**, **MaxDiff** (most/least), or constant‑sum
  **marbles** — each keyboard‑operable, no drag required. The 1–5 *billes* stay the visual identity.
- **Croisements:** themes that recur across rubrics are surfaced and weight‑summed → ranked
  priorities.
- **Synthesis:** text/ranked‑list first, always — plus your reframed question. No node‑graph.
- **Export/import:** a portable, versioned JSON *dossier*; delete everything anytime.

## Architecture in one line

**One object, three views.** `src/lib/qart` (domain) · `src/lib/gui` (GUI registry) ·
`src/lib/storage` (repository abstraction, encrypted IndexedDB) · `src/lib/diag` (content‑free
diagnostics) · `src/lib/i18n` (FR/EN) · `src/store` (Zustand + XState) · `src/app` + `src/components`
(UI). See **`docs/architecture.md`**.

## Docs — start here

| File | What |
|---|---|
| `docs/design.md` | Consolidated UI & architecture decisions. |
| `docs/architecture.md` | One‑object‑three‑views: module map, store/flow, storage, diagnostics. |
| `docs/decisions.md` | Architecture Decision Records (ADRs). |
| `docs/concept.md` · `docs/schema.md` · `docs/question-banks.md` | The method, the object, the IP content. |
| `docs/data-policy.md` · `SECURITY.md` | Privacy posture & security. |
| `docs/install.md` · `docs/testing.md` · `docs/release.md` | Run, test, release. |
| `CONTRIBUTING.md` | Setup, scripts, conventions, the a11y gate, commit style. |
| `CHANGELOG.md` | Notable changes. |

## License & ownership

**Q‑Art is the property of Ideotion.** Proprietary — © 2026 Ideotion, all rights reserved.
A limited grant permits **personal, non‑commercial local use of unmodified builds** (e.g. via the
installer above); modification, redistribution, and commercial use require written permission. See
`LICENSE`.
