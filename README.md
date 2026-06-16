# Q‑Art

**Strategic decision‑making tool** — two doors to the same method:
- **Atlas** — structured, deterministic, **no‑LLM** (LLM‑optional, works without a model).
- **Socrate** — guided maieutic conversation, **LLM‑enriched** (via Mistral).

Both write the **same decision object** (`docs/schema.md`). Privacy‑first, **sovereign (EU)**, **bilingual FR/EN**.

## Status
- **Phase:** pre‑alpha (`0.0.1`) — strategy locked, **scaffold pending** (next step).
- **Stack (chosen):** Next.js + TypeScript PWA · Tailwind · next‑intl · Serwist · Dexie · Zustand · **Mistral** (server‑side).

## Docs — start here
| File | What |
|---|---|
| `docs/concept.md` | What Q‑Art is — the method, the two doors, the 7 boards. |
| `docs/schema.md` | The canonical decision object (the spine both doors write). |
| `docs/question-banks.md` | Curated questions / rubrics (the IP content). |
| `docs/decisions.md` | Architecture Decision Records (ADRs). |
| `docs/data-policy.md` | The single, unified data policy. |
| `docs/roadmap.md` | Version ladder + release gates. |
| `CLAUDE.md` | Project context for AI sessions. |

## Next step
Scaffold the Next.js + TS PWA at **`0.0.1`** per `docs/decisions.md` — single‑app repo, the library set above, `src/lib/qart/` (schema types + seeded banks), a guarded Socrate route, SessionStart hook. Then iterate **Atlas UI → Socrate**.

## Open questions (unresolved)
- Beachhead **persona / wedge** use case.
- **Monetization** direction.
- **Data‑policy** final wording sign‑off (working version committed).
- Concrete **EU host** + EU analytics/error tooling.

## License
**Proprietary — all rights reserved.** See `LICENSE`.
