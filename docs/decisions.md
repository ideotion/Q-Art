# Q‑Art — Decision Records (ADRs)

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (see `LICENSE`).
> **Reads with:** `concept.md`, `schema.md`, `question-banks.md`, `data-policy.md`, `roadmap.md`, **`design.md`**, `diagnostics.md`.
> **Scope note:** the "no third‑party orgs / no legally‑loaded claims" drafting rule governs the **method / concept** content. These ADRs record **engineering** decisions, so they name tools/vendors — capabilities only, **no legal claims**.

Each entry: **Status · Context · Decision · Consequences.** Several ADRs were **revised June 2026** after a five‑pass UI/architecture research review (see `design.md`).

---

## ADR‑001 — v1 scope: Solo, both doors
- **Status:** Accepted
- **Decision:** v1 = **Solo**, shipping **both Atlas and Socrate** — *but* Socrate v1 is a **deterministic question‑tree** (see ADR‑016), so v1 carries no LLM. Team/governance deferred.
- **Consequences:** *Done* = one user runs a full cycle (question → 7 boards → synthesis/reframe → action plan → export) through either door, fully offline‑capable.

## ADR‑002 — Bilingual FR/EN from day one
- **Status:** Accepted
- **Decision:** **FR + EN from the start**; object keys language‑neutral (schema.md §7). i18n via **Paraglide** (ADR‑003). CSS **logical properties** for cheap RTL‑readiness.
- **Consequences:** Banks, question‑tree, and UI copy authored/reviewed in both languages; design for ~30% FR expansion.

## ADR‑003 — Frontend stack *(Revised 2026‑06)*
- **Status:** Accepted (revised)
- **Decision:** **Next.js (App Router) + TypeScript**, PWA, mobile‑first, `src/`, alias `@/*`. **Tailwind**; **shadcn/ui on Radix** (Base UI = upgrade path, React Aria = a11y escape hatch); **Paraglide** i18n; **Serwist** PWA; **Zustand** (UI) **+ XState** (guided flow); **RxDB** storage, **encrypted at rest**, behind a **repository abstraction**; motion = **CSS/View Transitions first, Motion (JS) only for physics/gestures**; **react‑textarea‑autosize** inputs; **Lucide** icons.
- **Consequences:** Next.js kept for an SSR marketing/SEO surface (discoverability, since no App Store). Changed from the original lean: next‑intl→Paraglide, Dexie→RxDB, +XState, +View‑Transitions, storage abstracted. All reversible.

## ADR‑004 — Backend deferred to v2 *(Revised 2026‑06)*
- **Status:** Accepted (revised — supersedes "light backend in v1")
- **Context:** Socrate v1 is deterministic (no model). With no LLM in v1, the v1 backend's reason to exist disappears.
- **Decision:** **v1 ships with no backend** — a fully client‑side PWA. The backend (a stateless **Mistral** proxy + optional **EU sync**) arrives in **v2**. When it does: secrets server‑side only; `.env.example` committed, never a real `.env`.
- **Consequences:** Dramatically smaller v1 surface (privacy, cost, ops). Diagnostics `cid` client→server seam (ADR‑013) becomes relevant in v2.

## ADR‑005 — Weighting method *(Revised 2026‑06)*
- **Status:** Accepted (revised — method under test)
- **Context:** Research rates per‑item 1–5 the weakest (no forced trade‑off); MaxDiff and constant‑sum both force trade‑offs.
- **Decision:** **Prototype both MaxDiff (tap best/worst) and constant‑sum "marbles," decide by user test.** Per‑item 1–5 **deprecated** as the sole method. A **non‑drag / stepper path is required** (WCAG 2.2 SC 2.5.7). **Billes/marbles remain the visual identity** regardless of method.
- **Consequences:** `schema.md` weighting field must accommodate either method; keep it method‑agnostic until the test resolves.

## ADR‑006 — LLM provider: Mistral — **v2** *(Revised 2026‑06)*
- **Status:** Accepted (revised — scope moved to v2)
- **Decision:** **No LLM in v1.** When Socrate gains LLM enrichment in **v2**, the provider is **Mistral** (sovereign EU): EU endpoint, **no‑training / minimal retention**, structured output to the decision object, **self‑host open‑weights** on the roadmap. Access via `MISTRAL_API_KEY` (server env; *La Plateforme* key required).
- **Consequences:** **Not** Anthropic/Claude (no Anthropic SDK). v1's "method is IP, prompts server‑side" concern is deferred with the LLM; v1's question‑tree content is client‑visible IP.

## ADR‑007 — Privacy posture & data handling *(Revised 2026‑06)*
- **Status:** Accepted (revised)
- **Decision:** Governed by **`docs/data-policy.md`**. **v1 = no‑LLM, fully local ⇒ decision content never leaves the device** (honest, strongest posture). **Encryption at rest** is concrete via **RxDB** (not aspirational). Pseudonymous; **export + delete** from `0.1.0`; **anonymous, content‑free, EU‑hosted analytics**; **E2E** sync in v2. A **legal/safeguarding workstream is gating** (ADR‑017).
- **Consequences:** When v2 adds the LLM/sync, the data policy's disclosed EU/no‑train model‑call posture applies; redaction before any send.

## ADR‑008 — License / IP
- **Status:** Accepted
- **Decision:** **Proprietary, all rights reserved** (see `LICENSE`).
- **Consequences:** Any more‑open/commercial license is a deliberate, deferred decision.

## ADR‑009 — Unified data policy *(lightly revised 2026‑06)*
- **Status:** Accepted
- **Decision:** One canonical policy (`data-policy.md`), three tiers — *decision content* (v1: never leaves device; v2 Socrate‑LLM: transient EU call), *operational data* (anonymous, content‑free, EU‑hosted), *account data* (v2). One policy, both doors.
- **Consequences:** Public Privacy Policy/ToS (counsel) mirror this; analytics must be content‑/identity‑free.

## ADR‑010 — Versioning & release roadmap
- **Status:** Accepted
- **Decision:** See `roadmap.md`. `0.0.x` private grind (starts `0.0.1`) → `0.1.0` public alpha (core loop, **no‑LLM**) → `0.5.0` → `0.9.0` → `1.0.0`. LLM enrichment + sync land **post‑0.1** (see roadmap).
- **Consequences:** `package.json` starts `0.0.1`; bumps are gated.

## ADR‑011 — Repo shape: single app
- **Status:** Accepted
- **Decision:** **Single Next.js app** (not a monorepo) for now.

## ADR‑012 — Quality bar & CI
- **Status:** Accepted
- **Decision:** TS strict; ESLint+Prettier; Vitest; Playwright (e2e smoke); GitHub Actions; SessionStart hook. Bar ramps with version. **WCAG 2.2 AA** + reduced‑motion + contrast are release gates (ADR‑014).

## ADR‑013 — Diagnostics fabric for recursive development
- **Status:** Accepted
- **Decision:** Privacy‑safe diagnostics fabric (see `diagnostics.md`) — `diag` core + thin seams, ring buffer mirrored to IndexedDB/RxDB, content‑free + secret‑scrubbed by construction, layered downloadable bundle, commit‑stamped. Scaffold pillar from `0.0.1`.
- **Consequences:** Every feature wires its seam + event codes. (This is also our privacy‑respecting answer to "improve UX without tracking.")

## ADR‑014 — UI design language & direction *(New 2026‑06)*
- **Status:** Accepted
- **Decision:** "**Calm, but discoverable**" (see `design.md`): calm base + progressive disclosure + clear affordances + ⌘K palette; reject extreme minimalism. Core = **"Quiet Atlas"**; card/"deck" presentation + balance/"thermometer" synthesis carried as prototype options. **Text‑first synthesis** (no node‑graph in v1). **WCAG 2.2 AA** as a gate.
- **Consequences:** Discoverability + affordance clarity are explicit requirements, not afterthoughts.

## ADR‑015 — Platform hedge: PWA + Capacitor‑ready *(New 2026‑06)*
- **Status:** Accepted
- **Decision:** **PWA primary**; storage behind a **repository abstraction** so a **Capacitor** shell (WKWebView + native SQLite) is a drop‑in. **Export/backup first‑class** (iOS eviction isn't fully solvable); install + `storage.persist()` as onboarding. Decide PWA‑vs‑Capacitor **before public launch**.
- **Consequences:** Don't hardwire the storage engine into UI; trigger to switch = real‑device data loss or iOS retention far below Android.

## ADR‑016 — Socrate v1 = deterministic question‑tree *(New 2026‑06)*
- **Status:** Accepted
- **Context:** Independent passes found a full LLM chat door under‑earns its cost/latency/privacy surface in v1; a clean guided flow already "shows its work."
- **Decision:** **Socrate v1 is a pre‑authored maieutic question‑tree (no LLM)** that fills the same boards. **LLM enrichment → v2** (ADR‑006). Wrap any future AI SDK behind an adapter; store our own normalized message shape.
- **Consequences:** v1 is fully local/sovereign. The "two doors" identity holds (both deterministic in v1); the Atlas/Socrate distinction in v1 is *format* (structured form vs guided Q&A), with LLM enrichment as the v2 differentiator.

## ADR‑017 — Legal & safeguarding gating workstream *(New 2026‑06)*
- **Status:** Accepted (workstream; legal text owned by counsel)
- **Decision:** Treat as **pre‑launch gates**: a screening **DPIA** (decision content can be GDPR **Article 9**), **explicit consent** design, **retention** policy, **data‑subject rights** (export/delete built in); plus **"not therapy/medical/legal advice"** framing and **crisis signposting** (FR/EN). v1's local/no‑LLM design keeps the surface small.
- **Consequences:** We do not draft legal text in‑repo; we build the product affordances (consent, export, delete, disclaimers, crisis links) the policy requires.

## ADR‑018 — Three GUIs over one object ("le triptyque") *(New — `0.1.0-rc.1`)*
- **Status:** Accepted
- **Context:** The RC adds a third presentation. The locked rule is "one map, two doors" generalized to "one object, N views" — GUIs are presentation only and must never fork the schema or store.
- **Decision:** A **GUI registry** (`src/lib/gui`) describes three presentations — **Atlas** (workbench/boards), **Socrate** (guided dialogue), **Cartes** (deck) — keyed by the schema `Mode`, so "which GUI is shown" and "which door edited this" stay in lockstep. `Mode` is extended `atlas | socrate | cartes` (additive, backward compatible; persisted shape unchanged ⇒ `SCHEMA_VERSION` stays 1). One Zustand store + one XState flow machine; a `useGuiSession` hook ensures a single session so switching GUIs mid-flow loses nothing.
- **Consequences:** New GUIs are presentation modules under `src/app/<gui>` + `src/components/<gui>`; the domain/store/diagnostics layers are untouched. Bilingual parity + the a11y gate apply to each GUI independently.

## ADR‑019 — Cartes: the deck GUI *(New — `0.1.0-rc.1`)*
- **Status:** Accepted
- **Context:** `design.md` carried a card/"deck" presentation as a prototype option. The RC builds it to full parity as the third GUI.
- **Decision:** **Cartes** deals the same rubrics as a one-card-at-a-time deck (`CARTES_DECK` = question + 10 rubric cards + synthesis), with a **keep/skip** card stack per rubric and a **spread** overview. Touch/gesture is a future enhancement; the **buttons + keyboard are the required non-drag path** (WCAG 2.2 SC 2.5.7), so no Motion/drag dependency ships in the RC. Motion is on the floor for later physics only.
- **Consequences:** No `tldraw`/`GSAP` (proprietary); no new runtime dep. Card motion is CSS-only and reduced-motion-safe.

## ADR‑020 — Encrypted-at-rest persistence: encrypted IndexedDB (RxDB deferred) *(New — `0.1.0-rc.1`)*
- **Status:** Accepted (supersedes the RxDB wiring step for the RC)
- **Context:** Encryption at rest is non-negotiable (ADR‑007). RxDB + its encryption plugin is a heavy add and risky to land green inside an autonomous RC.
- **Decision:** Ship an **encrypted IndexedDB adapter** behind the existing `StorageRepository` — **AES‑GCM** via Web Crypto under a **non-extractable** key kept in IndexedDB; structural uuids stored in the clear (no content) for indexing/cascade. Versioned export/import (`dossier`) + a migration seam. In-memory stays the test double. This is the brief's explicitly blessed fallback; **persistence is never shipped unencrypted.**
- **Consequences:** RxDB (and its replication/sync path) can replace this later behind the same interface; a Capacitor/SQLite swap remains a drop-in. Browser-only; degrades to in-memory if Web Crypto/IndexedDB are unavailable.

## ADR‑021 — PWA service worker: hand-authored (Serwist deferred) *(New — `0.1.0-rc.1`)*
- **Status:** Accepted (revises ADR‑003's Serwist choice for the RC)
- **Context:** Serwist's Next plugin is webpack-based; Next 16 builds with **Turbopack**, so the integration is uncertain and can't be iterated on safely in this environment.
- **Decision:** Ship a small **hand-authored, dependency-free service worker** (`public/sw.js`, Serwist-style): precache the app shell, network-first navigations (offline fallback), stale-while-revalidate for content-hashed assets. No user content cached (it lives encrypted in IndexedDB). Plus a manifest, icons, an install path, a dismissible update toast, and a `navigator.storage.persist()` onboarding prompt.
- **Consequences:** Swappable for Serwist when its Turbopack story is solid. Raster PNG icons are a polish item (SVG icons ship now).

## ADR‑022 — Weighting A/B plumbing *(New — implements ADR‑005)*
- **Status:** Accepted
- **Decision:** Ship **all three** weighting methods, selectable and persisted (`Cycle.weightMethod`, recorded content-free): direct **stepper**, **MaxDiff** (best-worst), and constant-sum **marbles**. The canonical importance stays the **1–5 billes** (`CheckedItem.weight`); MaxDiff and marbles derive it through one shared normalizer, so the schema stays method-agnostic until the test resolves. Every method has a **non-drag, keyboard path** (SC 2.5.7).
- **Consequences:** The A/B can be run later from real `weightMethod` telemetry (content-free). Billes remain the visual identity regardless of method.

## ADR‑023 — Installer: transparent, Debian-first, least-privilege *(New — `0.1.0-rc.1`)*
- **Status:** Accepted
- **Decision:** A `curl | bash` `install.sh` served from GitHub: `set -euo pipefail`, idempotent, no obfuscation, a banner naming the project + source + "100% local". Flags for dir/ref/port/dry-run/no-start/service/with-deps/uninstall. **Never requires root**; only `--with-deps` touches OS packages and **prints the exact NodeSource/apt commands first**. Defaults to the pinned RC tag, falls back to `main`; prints the checked-out SHA. A `shellcheck` + `--dry-run` CI job gates it; an `uninstall.sh` shim ships too.
- **Node is part of the install (revised):** if Node ≥ 20 isn't present, the installer downloads an **official Node build (pinned `22.13.0` LTS) into a user cache and verifies its SHA‑256** (no root) and uses it locally; `--with-deps` remains the opt‑in for a system‑wide Node. The earlier behaviour (bail out unless `--with-deps`) failed for users without Node, so provisioning is now the default — still least‑privilege. The pinned version satisfies every dependency's `engines` (≥ 20.19 / ≥ 22.12), so `npm ci` is warning‑free.
- **Consequences:** Trust-first distribution without an app store; works on a clean machine with only `git`; reversible (`--uninstall` also clears the cached Node); no hidden network calls or data egress.

## ADR‑024 — The reading engine: deterministic "intelligence layer" *(New — post‑`0.1.0-rc.1`)*
- **Status:** Accepted
- **Context:** First real use exposed that the synthesis only *mirrored* inputs (a sorted list + raw recurring tokens + a blank reframe box). It felt like data‑gathering, not help — the deterministic intelligence the method calls for (concept.md §3.6) was never built, and grading every item amplified the survey feel.
- **Decision:** Build a pure, no‑LLM **reading engine** (`src/lib/qart/insights.ts`) that interprets the decision object and surfaces, in plain bilingual prose: the **knot** (recurring high‑weight theme), the **pull** (what you want vs. what you fear), your **part** in keeping it going, **"more of the same"**, the **quiet payoff** of the status quo, an **untested belief**, the **exception** where it already works, and skipped **gaps** — then **offers** reframed questions ("Should I…?" → "How do I…?", the method's pivot) and captures **one small step**. The engine returns structured findings keyed off the user's own words; the UI renders the copy (FR/EN). It never advises. Gathering is **lightened**: ticking is enough; weighting is an **optional** refinement, not a grade on every item.
- **Consequences:** All three GUIs gain the reading via the shared synthesis. Insight classification uses stable bank‑item id groupings (mirrors the banks; extend together). LLM enrichment (v2/Socrate) can deepen this behind the same shape; the deterministic reading remains the private, offline baseline.

---

## Open / deferred
- **Weighting method** (resolve by A/B test) and **reflection serif‑vs‑sans** (resolve by test).
- **Data‑policy final wording** sign‑off; **DPIA** with counsel.
- **Beachhead persona / wedge**; **monetization direction**.
- Concrete **EU host** + EU analytics/error tooling.
- **v2**: LLM (Mistral) Socrate enrichment + E2E local‑first sync details.
- **Team / governance** + anonymity threat model (post‑v1).
