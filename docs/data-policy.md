# Q‑Art — Data Policy (canonical, internal source of truth)

> **Proprietary** · © 2026 Ideotion · personal, non-commercial use permitted; all other rights reserved (`LICENSE`).
> **Status:** Accepted — *working version* (final wording sign‑off + DPIA pending counsel).
> **Scope:** the **engineering data‑handling policy** and single source of truth. The public **Privacy Policy / Terms** are a separate, counsel‑reviewed artifact. **No legal claims here.**

## Principles
- **v1 is local and LLM‑free.** v1 carries no model and no backend, so **decision content never leaves the device** — we can say it plainly and truthfully.
- **One policy, both doors.** Atlas and the (deterministic) Socrate question‑tree get the **same** baseline.
- **EU law throughout (GDPR posture).** EU residency; data minimization; lawful basis; export & delete; retention limits.
- **Honest claims only.** v1: *"your decision content never leaves your device."* When **v2** adds LLM enrichment (Socrate via a sovereign EU model), that single model call is **disclosed here** — we will not market "processed only locally" once a model call exists.

## The promise (user‑facing intent)
> **v1 — We never see your decision content. It is processed entirely on your device.**
> **v2 (LLM enrichment) — A Socrate turn you opt into is sent to a sovereign EU model solely to generate the reply, under no‑training / minimal‑retention terms; we keep no copy.**

## Data tiers
| Tier | What | Handling rule |
|---|---|---|
| **Decision content** (sensitive) | boards, entries, reflections, the decision object (`schema.md`) | **v1:** processed **on‑device only**, never transmitted. **v2 Socrate‑LLM:** transient EU model call (no‑training/min‑retention, no server copy). Never mined; never trains a model; never enters analytics. Export + delete on demand. **Encrypted at rest** (RxDB). |
| **Operational data** (anonymous) | usage events, performance, errors/bugs (incl. the diagnostics bundle) | Content‑free, identity‑free, aggregated, **EU‑hosted, cookieless**, opt‑in. No link to content or person. |
| **Account data** (minimal — v2) | pseudonymous id, auth | Only when sync ships. Data‑minimized; **E2E‑encrypted** sync. |

## Storage & residency
- **v1:** *no backend, no accounts, no server‑side dossier DB.* Dossiers persist **client‑side** in **RxDB**, **encrypted at rest**.
- **v2:** optional **E2E local‑first sync** (RxDB replication to a self‑hosted EU server) for multi‑device + backup.
- All future processing/hosting in the **EU** (concrete host TBD).

## Model calls (v2 only)
- None in v1. In v2: **redact/minimize** client‑side first; send only what's needed; **no‑training + minimal/zero retention**; the maieutic LLM prompts (the IP) stay **server‑side**.

## User rights
- **Export** (portable, versioned JSON) and **Delete** (erasure) built in from `0.1.0`. Plus the **data‑subject rights** workstream (ADR‑017).

## Open / to confirm
- Final wording **sign‑off**; screening **DPIA** (Article 9) with counsel; **retention** periods.
- Concrete **EU host** + EU analytics/error tooling (self‑hosted, cookieless).
- v2 **DPA** with the model provider.
