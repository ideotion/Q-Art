# Q‑Art — Architecture

> **Proprietary** · © 2026 Ideotion · personal, non-commercial use permitted; all other rights reserved (`LICENSE`).
> **Reads with:** `design.md` (decisions), `decisions.md` (ADRs), `schema.md` (the object),
> `diagnostics.md`. This file is the practical module map for the `0.1.0‑rc.1` codebase.

## The one idea: one object, three views

There is **one decision object** (`schema.md`) and **one store**. The three GUIs — **Atlas**
(boards), **Socrate** (question‑tree), **Cartes** (deck) — are *presentation only*. None forks the
schema or the state. A GUI is chosen by the schema `Mode` (`atlas | socrate | cartes`), so "which
GUI is shown" and "which door last edited this" are the same fact (ADR‑018).

```
            ┌── Atlas (boards) ─┐
question →  ├── Socrate (Q&A) ──┤ →  one Zustand store  →  encrypted IndexedDB
            └── Cartes (deck) ──┘     (the decision object)     (at rest)
                     ▲                        │
                 XState flow            croisements + weighting (pure)
              (navigation only)                │
                                          text‑first synthesis → export
```

## Module map (`src/`)

| Layer | Path | Responsibility |
|---|---|---|
| **Domain** | `lib/qart` | The schema types, seed banks (IP), the Socrate question‑tree, the 7 boards + Cartes deck, and **pure engines**: `weighting` (stepper/MaxDiff/marbles → 1–5) and `croisements` (recurrence across rubrics). No React, no I/O. |
| **GUI registry** | `lib/gui` | The three GUIs' metadata (route, icon key, bilingual copy) keyed by `Mode`, + the persisted GUI preference. Presentation data only. |
| **Storage** | `lib/storage` | The `StorageRepository` interface + an in‑memory impl (test double) and an **encrypted IndexedDB** impl (AES‑GCM, non‑extractable key). Versioned `dossier` export/import + a migration seam. |
| **Diagnostics** | `lib/diag` | Content‑free, typed‑sink logging (ADR‑013): ring buffer, redaction, manifest, JSONL, downloadable bundle. A raw content string is *unrepresentable* in a log context. |
| **i18n** | `lib/i18n` | FR/EN seam: the UI dictionary + `useLoc` resolver for domain `LocalizedText`. Bilingual parity is a test gate. |
| **Store** | `store` | **Zustand** holds the decision object + writer actions (shared by all GUIs). **XState** (`flow-machine`) holds *navigation only* (board index / deck card / tree node). `useGuiSession` wires a GUI to one lossless session; `persistence` swaps in the encrypted repo + autosaves. |
| **UI** | `app` + `components` | Routes (`/`, `/atlas`, `/socrate`, `/cartes`, `/about`) and shared/per‑GUI components. |

## Data flow

1. A GUI page calls `useGuiSession(mode)`: ensures one decision cycle exists (or keeps the current
   one — switching GUIs never resets), records the mode, and starts the navigation machine.
2. Editing calls **store writers** (`toggleItem`, `setItemWeight`, `setFreeText`, …). Every write
   is immutable (`structuredClone`) and emits a content‑free `diag` event.
3. `persistence` subscribes to the store and **autosaves** the active case/cycle to the encrypted
   repository (debounced). The landing offers a non‑coercive **Continue**.
4. The shared **synthesis** recomputes **croisements** + keyword summaries (pure) and offers the
   **weighting** pass + the reframe + **export/import/delete**.

## Storage & encryption (ADR‑020)

`StorageRepository` is async throughout, so the engine is swappable. The default in the browser is
`EncryptedIndexedDbRepository`: each record is AES‑GCM‑sealed with a **non‑extractable** `CryptoKey`
stored in IndexedDB; structural uuids are kept in the clear (no content) to index and cascade. The
in‑memory repo is the unit‑test double. RxDB (and a v2 sync path) or a Capacitor/SQLite shell can
replace the impl behind the same interface.

## Flow machine (navigation only)

`flow-machine.ts` is a small XState machine with `idle → running → done`. Context = `{ mode, nodeId
(socrate), boardIndex (atlas), cardIndex (cartes) }`. It owns *where you are*; it never holds
decision data. This keeps GUI navigation independent while the data stays in one store.

## Motion & PWA

CSS + View Transitions first; a 0‑KB CSS "deal‑in" for Cartes; all motion respects
`prefers-reduced-motion`. The PWA is a hand‑authored service worker (ADR‑021): precache the shell,
network‑first navigations, SWR for hashed assets — no user content cached.

## Privacy & diagnostics invariants

- **No content leaves the device** in v1; **encryption at rest** is mandatory.
- Diagnostics are **content‑free by construction** (typed sink) and secret‑scrubbed (redaction);
  the "no content in logs" guarantee is enforced by a compile‑time test.
- **TS strict**, no `any` escapes; bilingual parity, the a11y gate, and the content‑leak guard are
  all CI gates.
