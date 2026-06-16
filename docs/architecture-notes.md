# Q‑Art — Pending Architecture Decisions (menu)

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (see `LICENSE`).
> **Status:** open — *to decide.* Pre‑scaffold.
> For each question: options + trade‑offs + a recommendation (✅). **Decide by picking a letter**; chosen items graduate to ADRs in `decisions.md`. Items marked **← needs your steer** are the ones I can't sensibly default.

## Tier A — architecture‑determining (decide before / at scaffold)

### A1 — LLM access layer
- **A)** Thin in‑house `llm` port over `fetch` → Mistral, own types. *Swap‑ready (self‑host), no lock‑in.*
- **B)** Mistral official SDK directly in routes. *Fast, but couples code to the vendor.*
- **C)** Vercel AI SDK (provider‑agnostic + streaming helpers). *Nice DX; extra dep + some abstraction.*
- ✅ **A** (optionally borrow AI‑SDK only for streaming UI). Protects the self‑host roadmap + enables test mocking.

### A2 — Schema versioning & export
- **A)** `schemaVersion` + stable bank‑item IDs + Dexie migrations + export = versioned JSON (+ import).
- **B)** No versioning yet (YAGNI).
- **C)** Event‑sourced / migration framework.
- ✅ **A.** B bites on the first schema change; C is overkill now.

### A3 — Atlas's deterministic "intelligence" (no LLM) ← needs your steer
- **A) Mirror:** organize inputs into the 7 boards + a clean recap. *Honest but thin.*
- **B) Scored synthesis:** weight‑aggregate per board, rules to surface tensions/conflicts, flag gaps. *A real engine.*
- **C) B + templated reframes:** rules trigger reframing questions/content drawn from the banks (still no LLM).
- ✅ **B for 0.1, layer C as the banks mature.** (A alone underwhelms; free‑text synthesis needs the model — that's Socrate's job.)

### A4 — Abuse/cost control on the public Socrate proxy ← needs your steer
- **A)** IP rate‑limit only. *Lightest; some bypass.*
- **B)** IP limit + bot challenge (Turnstile/hCaptcha — **note: Cloudflare = US**; EU alt: Friendly Captcha).
- **C)** Anonymous signed session token + per‑token quota + IP limit. *No third party; more code.*
- **D)** Require a free account for Socrate. *Strongest, but breaks v1 anonymity.*
- ✅ **A in 0.0.x · A+C for public 0.1 · add B if bots appear.** Avoid D.

### A5 — Client storage durability
- **A)** Dexie + prominent export/import + eviction warning.
- **B)** A + request persistent storage (`navigator.storage.persist()`).
- **C)** B + auto‑export reminder / File‑System‑Access backup.
- ✅ **B now, C later.** Each record carries a stable local `id` so a v2 account can "claim" it.

### A6 — Backend runtime / streaming / region
- **A)** Node route, web‑stream responses, EU‑pinned. *Portable to any EU host.*
- **B)** Edge route. *Lower latency; fewer Node APIs; host‑specific.*
- **C)** Separate Node service/container behind Next.
- ✅ **A.** Avoids edge lock‑in; keeps EU‑host options open (OVH / Scaleway / Clever / Hetzner).

### A7 — Observability (privacy‑safe)
- **A)** Self‑hosted GlitchTip (EU, Sentry‑compatible) + content/PII scrubbing.
- **B)** Sentry EU (hosted) + scrubbing.
- **C)** Platform logs only, no third party.
- ✅ **C in 0.0.x, A from 0.1.** Always: a hard "no content in logs" rule + a test that enforces it.

### A8 — IP split: visible vs secret ← needs your steer
- **A)** Accept that banks are client‑visible (Atlas needs them); **secret = server prompts / synthesis / orchestration.**
- **B)** Server‑fetch banks too. *Breaks offline/LLM‑less Atlas; adds latency.*
- **C)** Hybrid: core banks client‑side, "premium" rubrics server‑side.
- ✅ **A** — protect the real moat (the method/orchestration), not the question text. C only if specific rubrics are crown‑jewels.

### A9 — LLM output safety
- **A)** Sanitized markdown (allowlist) + system‑prompt hardening + echo‑guard.
- **B)** Plain text only. *Safest, least rich.*
- **C)** Unsanitized rich markdown. *(don't)*
- ✅ **A** (B if you want zero risk early).

### A10 — 12 rubrics → 7 boards mapping ← confirm
- **A)** Final as in `schema.md` — encode now.
- **B)** Needs a reconciliation pass first (concept names 12 rubrics; schema/roadmap say 7 boards).
- ✅ Tell me **A** or **B** (if B, I lock the mapping before coding types).

## Tier B — placeholder now, finalize later
- **B1 UI kit:** ✅ **shadcn/ui** (Radix + Tailwind, accessible) · alt: raw Radix / Headless UI / scratch.
- **B2 Analytics:** ✅ **Plausible or Umami** (self‑host, EU, cookieless), start at 0.1 · alt: PostHog‑EU / none.
- **B3 Consent:** ✅ **cookieless ⇒ no banner** (publish a notice) · alt: minimal banner.
- **B4 Config/flags:** ✅ **zod‑validated env + a tiny feature‑flag module** · alt: flag SaaS (overkill).
- **B5 i18n routing:** ✅ **`/fr` `/en` sub‑paths** + detection + hreflang · alt: sub‑domains / header‑only.
- **B6 PWA update:** ✅ **"new version → reload" toast** · alt: auto‑reload / silent.
- **B7 Socrate evals:** ✅ **fixtures + judge + mocked‑model unit tests** · alt: manual only.

## Tier C — flag for later (mostly legal/product)
- **C1 Trademark/domain "Q‑Art":** ✅ check availability now, file later.
- **C2 Age gate:** ✅ likely **16+** (GDPR), confirm w/ counsel · alt: 18+ / none.
- **C3 Safety boundary:** ✅ explicit **"not therapy/medical"** + crisis resources, no clinical claims.
- **C4 Team‑mode foresight:** ✅ **design the data model additive now** (cheap) · alt: defer.
- **C5 Monetization shape:** ✅ lean **freemium / metered Socrate** (track anon usage now) · alt: flat sub / one‑time / free.

---

### How to decide
Reply with picks, e.g. `A1=A, A3=B, A4=C, A8=A, A10=A` (defaults assumed for anything you skip). Chosen items move into `decisions.md` as ADRs, then we scaffold.
