# Q‑Art — Diagnostics Fabric (spec)

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (see `LICENSE`).
> **Status:** Accepted — *living spec.* **Reads with:** `decisions.md` (ADR‑013), `data-policy.md` (the content‑free law), `roadmap.md`.

## Purpose
A privacy‑safe, **content‑free** diagnostics layer built to power **semi‑automated recursive development**: the running app emits dense, structured logs → you export a bundle → Claude reads it and ships the next change. This is the *per‑session, opt‑in‑shareable* half of observability; the anonymous aggregate analytics (ADR‑009) are separate.

## Laws (non‑negotiable)
1. **Content‑free by construction.** Never log decision content (boards, entries, reflections, Socrate prompts/completions). Log *structure*: ids, enums, shapes, counts, timings, codes, stacks.
2. **Secret/PII scrubbed.** A redaction pass strips token/key/email‑style patterns before any write or export.
3. **Safe to share.** Every bundle's `manifest.json` asserts `"safeToShare": true`. The build **fails a test** if a content field can reach a log.
4. **Typed sink.** The logging API only accepts safe field types; freeform content strings are not representable.

## The fabric — one core, thin seams
- **Core:** `diag(level, category, eventCode, ctx?)` → a bounded **ring buffer** (memory) mirrored to **IndexedDB** (so crashes survive).
- **Seams (instrument via wrappers, never per‑function):**
  - `withDiag(fn, {cat, event})` — wrap async actions / use‑cases.
  - **Zustand middleware** — state transitions (action + state‑*shape* delta, never values).
  - **IO/LLM wrapper** — every model / storage / network call (metadata only).
  - **React error boundary** — component crashes → error event + auto‑export offer.
  - **Global handlers** — `window.onerror`, `unhandledrejection`.
  - **Lifecycle hooks** — boot/ready, route change, PWA install, SW update, locale load.
- **Correlation id (`cid`)** — per user action / request; threaded **client → Socrate server** so the two logs align.
- **Build stamp** — app version + git commit injected at build → every bundle pins exact code.

## Levels & categories
- **Levels:** `E` error · `W` warn · `I` info (key milestones) · `D` debug · `T` trace.
- **Categories:** `app`, `nav`, `atlas`, `socrate`, `store`, `llm`, `net`, `storage`, `pwa`, `i18n`, `diag`.

## Modes
- **Default (prod/public):** `E`+`W` + a few `I` milestones. Low overhead.
- **Deep mode (opt‑in):** `D`/`T` on, caps raised — for reproducing a specific bug (toggle in a diagnostics panel).
- **Dev (`0.0.x`):** deep by default.

## Event schema (dense, LLM‑optimized)
One JSON object per line (`.jsonl`); short keys, codes not sentences:
```
{"t":1234,"l":"E","c":"socrate","e":"llm.structured.invalid","cid":"a1f","d":820,"x":{"tier":"small","retry":1,"schema":"Cycle"}}
```
| key | meaning |
|---|---|
| `t` | ms since session start (manifest holds the absolute base) |
| `l` | level (E/W/I/D/T) |
| `c` | category |
| `e` | event code (dot‑namespaced) |
| `cid` | correlation id (optional) |
| `d` | duration ms (optional) |
| `x` | safe structured context — ids/enums/shapes/counts only |

## Bundle (downloadable; layered for manifest‑first reading)
`qart-diag-<session>-<commit>-<ts>.zip`:
| File | Contents |
|---|---|
| `manifest.json` | schema version, build commit, app version, locale, door, flags, env summary, counts by level/category, last N error codes, file index, `safeToShare`. **Read first.** |
| `events.jsonl` | full event stream |
| `errors.jsonl` | errors only, enriched (stack + state‑shape at failure) |
| `state-snapshot.json` | store **shape** (keys/types/sizes/enums) — never values |
| `llm-trace.jsonl` | per Socrate call: tier, latency, token **counts**, tool name, structured‑output valid?, retries, error code |
| `network.jsonl` | method, route, status, duration, size, `cid` |
| `env.json` | browser/OS (coarse), viewport, PWA/SW state, online, storage quota/usage |

## Event‑code catalog (seed — grows with the app)
- `app.boot` · `app.ready` · `app.error`
- `nav.route`
- `atlas.case.create` · `atlas.board.open` · `atlas.item.check` · `atlas.weight.set` · `atlas.synthesis.run` · `atlas.export`
- `socrate.session.start` · `socrate.turn.send` · `socrate.turn.recv` · `socrate.map.write` · `socrate.degraded` (fell back to Atlas)
- `llm.call` · `llm.stream.start` · `llm.stream.end` · `llm.structured.invalid` · `llm.retry` · `llm.error` · `llm.ratelimited`
- `store.tx` · `store.migrate` · `storage.persist.granted|denied` · `storage.evicted`
- `net.request` · `net.error`
- `pwa.install` · `pwa.sw.update` · `pwa.offline` · `pwa.online`
- `i18n.locale.load` · `i18n.missingKey`
- `diag.export` · `diag.deepmode.on|off`

## Versioning
`diagSchemaVersion` in every manifest. Any key/code change bumps it; **this spec is the source of truth** for the legend.

## The loop protocol
1. Reproduce → **Export diagnostics** (or auto‑export on crash) → send the file(s) + one line: *expected vs observed.*
2. Claude reads `manifest.json` → drills into `errors.jsonl` / the relevant file → diagnoses from evidence (the commit pins the code state).
3. Claude ships the fix **and**, when the log was insufficient, **adds/upgrades the instrumentation** at that seam — diagnostics co‑evolve with the code.

## Scaffold note
Wired in from `0.0.1` as a cross‑cutting pillar: the `diag` core + ring/IndexedDB sink + the seams + the bundle/export builder + the redaction pass + the "no content in logs" test.
