# Q‑Art — Data Policy (canonical, internal source of truth)

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (see `LICENSE`).
> **Status:** Accepted — *working version* (final wording sign‑off pending).
> **Scope:** this is the **engineering data‑handling policy** and the single source of truth. The public‑facing **Privacy Policy / Terms** are a separate, counsel‑reviewed artifact authored later; this document defines what that policy must reflect. **No legal claims are made here.**

## Principles
- **Connected by default, private by contract.** Q‑Art is an online PWA; privacy is guaranteed by *what we do with data*, **not** by keeping it offline.
- **One policy, both doors.** Atlas (no‑LLM) and Socrate (LLM) share an **identical** data‑protection baseline. The only difference — Socrate's model call — is disclosed **inside this one policy**, never a second one.
- **EU law throughout (GDPR posture).** EU data residency; data minimization; lawful basis; export & delete.
- **Honest claims only.** We never say "processed only locally" — that is *false for Socrate*. We say: *we never store or analyze your decision content; we process it only to give you your result.*

## The promise (user‑facing intent)
> **We never store or analyze your decision content — we process it only to give you *your* result.**
> • **Atlas:** on your device. • **Socrate:** transmitted to a sovereign EU model solely to generate the reply, under no‑training / minimal‑retention terms; we keep no copy.

## Data tiers
| Tier | What | Handling rule |
|---|---|---|
| **Decision content** (sensitive) | boards, entries, reflections, the decision object (`schema.md`) | Never retained or mined by us; never trains a model; never enters analytics. Atlas → processed **on‑device**. Socrate → **transient EU model call only** (no‑training/min‑retention, no server copy). Export + delete on demand. |
| **Operational data** (anonymous) | usage events, performance, errors/bugs | Collected & stored to improve the app. **Content‑free, identity‑free**, aggregated, **EU‑hosted, cookieless**. No link to decision content or to a person. |
| **Account data** (minimal — v2) | pseudonymous id, auth | Only when sync ships. Data‑minimized; **E2E‑encrypted** sync. |

## Storage & residency
- **v1:** *no server‑side dossier DB, no accounts.* Dossiers persist **client‑side** (IndexedDB/Dexie) until opt‑in sync (v2).
- All processing/hosting in the **EU** (model = Mistral EU endpoint; app/backend on EU infra — concrete host TBD at deploy).
- Encryption at rest (client) now; **E2E** for sync in v2.

## Model calls (Socrate)
- **Redact/minimize** client‑side before anything leaves the device.
- Send only what's needed to generate the reply; prefer **no‑training + minimal/zero retention** terms (verify).
- The maieutic prompts/rubrics (**the IP**) stay **server‑side**, never shipped to the client.
- **Graceful degradation:** no key / no network / model down ⇒ **Atlas still works** (LLM‑optional).

## User rights
- **Export** (portable) and **Delete** (erasure) built in from `0.1.0`.

## Open / to confirm
- Final wording **sign‑off** (this is the working version).
- Concrete **EU host** + **EU analytics/error tooling** (self‑hosted, cookieless).
- **DPA** with the model provider; retention specifics (verify).
