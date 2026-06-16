# Q‑Art — Project Context (for AI sessions)

Q‑Art is a **strategic decision‑making tool**. One method, **two doors**:
- **Atlas** — structured, deterministic, **no LLM** (LLM‑optional; works without a model).
- **Socrate** — guided maieutic conversation, **LLM‑enriched** (via Mistral).

Both doors write the **same decision object** (`docs/schema.md`). v1 = **Solo**, **bilingual FR/EN**.

## Current status
- **Phase:** pre‑alpha, version **`0.0.1`**. Strategy is locked; the **scaffold has not been run yet** — that is the immediate next task.
- All decisions live in `docs/`. Read **`docs/decisions.md`**, **`docs/data-policy.md`**, **`docs/roadmap.md`**, plus `docs/concept.md`, `docs/schema.md`, `docs/question-banks.md`.

## Stack (decided)
Next.js (App Router) + TypeScript, PWA, mobile‑first · **Tailwind** · **next‑intl** (FR/EN) · **Serwist** (PWA/SW) · **Dexie** (IndexedDB) · **Zustand** · **ESLint + Prettier** · **Vitest** + **Playwright** · **GitHub Actions** CI. Backend = a **light, stateless** Next route for Socrate (no user DB in v1). Single‑app repo (not a monorepo).

## AI provider
**Mistral** (sovereign EU). Model tiering (capable + small). Structured output / function calling to fill the decision object. Self‑host open‑weights = roadmap. Access via `MISTRAL_API_KEY` (**server env only**; never in client/repo). Requires a *La Plateforme* API key (a consumer chat subscription ≠ API access). **Not** Anthropic/Claude — **do not add Anthropic SDK code**.

## Non‑negotiable rules
- **Method is the IP:** maieutic prompts/rubrics live **server‑side only**, never shipped to the client.
- **Privacy:** one **unified data policy** (`docs/data-policy.md`). Same baseline both doors. We **never store/analyze decision content**; we keep only **anonymous, content‑free** analytics. **EU residency.** Honest claims only — never "processed only locally" (false for Socrate).
- **Secrets:** server‑side env only; commit `.env.example`, never a real `.env`.
- **Docs:** no legally‑loaded claims; the public Privacy Policy/ToS are separate counsel‑reviewed artifacts, **not** drafted in the repo.
- **Connected PWA**, not "local‑first." **LLM‑optional** (Atlas needs no model); offline is a later nice‑to‑have, not a v1 guarantee.
- **Versioning** (`docs/roadmap.md`): `0.0.x` = private dev grind; `0.1.0` = public alpha (core loop complete); `1.0.0` = polished full release. A version bump is *earned* via its gate.

## Git / workflow
- Develop on branch **`claude/charming-darwin-9cv8kz`**; work is tracked in the PR. Conventional commits. Commit + push when changes are complete.

## Open questions (ask the user)
- Beachhead **persona / wedge** use case.
- **Monetization** direction.
- **Data‑policy** final wording sign‑off.
- Concrete **EU host** + EU analytics/error tooling.

## Immediate next step
Run the scaffold at **`0.0.1`** per `docs/decisions.md`: Next.js + TS PWA with the library set above, `src/lib/qart/` (schema types + seeded question banks), a guarded Socrate route (no‑ops without the key), and a SessionStart hook. Then iterate **Atlas UI → Socrate**.
