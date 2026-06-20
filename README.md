# Q‑Art

**Strategic decision‑making tool** — two doors to the same method:
- **Atlas** — structured, deterministic board flow.
- **Socrate** — guided maieutic flow (**v1 = deterministic question‑tree, no LLM**; LLM enrichment in v2).

Both write the **same decision object** (`docs/schema.md`). Privacy‑first, **sovereign (EU)**, **bilingual FR/EN**. **v1 is fully local — your decision content never leaves your device.**

## Status
- **Phase:** pre‑alpha (`0.0.1`) — strategy + UI/architecture **locked**, and the **scaffold is in place** (both doors run end‑to‑end, fully local).
- **Stack:** Next 16 + TS PWA · Tailwind v4 · Zustand + **XState** · in‑memory storage behind a repository abstraction · diagnostics fabric · FR/EN. **No LLM / no backend in v1** (Mistral enrichment = v2). *Deferred behind their swap points:* RxDB+encryption, Paraglide, Serwist, Motion.

## Run
```bash
npm install
npm run dev        # http://localhost:3000  → / , /atlas , /socrate
npm run check      # typecheck + lint + unit tests
npm run build      # production build
npm run test:e2e   # Playwright smoke (browsers needed)
```

## Docs — start here
| File | What |
|---|---|
| `docs/design.md` | **Consolidated UI & architecture decisions** (start here). |
| `docs/concept.md` | The method, the two doors, the 7 boards. |
| `docs/schema.md` | The canonical decision object. |
| `docs/question-banks.md` | Curated questions / rubrics (IP content). |
| `docs/decisions.md` | Architecture Decision Records (ADRs). |
| `docs/data-policy.md` | The single, unified data policy. |
| `docs/roadmap.md` | Version ladder + release gates. |
| `docs/diagnostics.md` | The diagnostics fabric. |
| `docs/research/` | UI research provenance + summary. |
| `CLAUDE.md` | Project context for AI sessions. |

## Next step
Scaffold the Next.js + TS PWA at **`0.0.1`** per `docs/design.md` + `docs/decisions.md` — single‑app repo, the library set above, the diagnostics fabric, one shared store written by both deterministic doors.

## Open questions
- Weighting method + reflection serif‑vs‑sans (resolve by test) · beachhead persona/wedge · monetization · concrete EU host · v2 LLM + sync.

## License
**Proprietary — all rights reserved.** See `LICENSE`.
