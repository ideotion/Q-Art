# Q‑Art — Releasing

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (`LICENSE`).
> Versioning follows `roadmap.md` (ADR‑010). A bump is **earned**, not vibed.

## Version ↔ tag ↔ installer

- `package.json` `version` is the source of truth; `src/lib/version.ts` mirrors it for the in‑app
  build stamp (the diagnostics bundle pins `appVersion` + commit).
- The git **tag** matches the version, e.g. `0.1.0-rc.1`.
- The installer's `--ref` **defaults to the RC tag** and falls back to `main` if the tag isn't
  published yet, so `curl … | bash` works before and after tagging.

## Cut a release (human‑owned steps)

1. Ensure `main` is green (verify · e2e · a11y · shell).
2. Confirm `package.json` `version` and `src/lib/version.ts` `APP_VERSION` agree, and `CHANGELOG.md`
   has an entry for the version.
3. Tag and push the tag:
   ```bash
   git tag 0.1.0-rc.1 && git push origin 0.1.0-rc.1
   ```
4. Create the **GitHub Release** for that tag (draft first), with notes from `CHANGELOG.md` and the
   install one‑liner. **Publish only when ready** — the autonomous build never publishes.
5. Verify the installer against the tag: `bash install.sh --ref 0.1.0-rc.1 --dry-run`.

## Gate to `0.1.0` (from `roadmap.md`)

The core loop runs in **every** GUI — question → 7 boards → synthesis/reframe → action plan →
export — **bilingual**, **fully local (no LLM)**, data policy enforced, **WCAG 2.2 AA** on the core
flow. `rc` builds harden toward that; the stable `0.1.0` drops `-rc.N` once the gate is met.

## Notes

- Never publish a release or merge to `main` from an automated session — that's a human action.
- `0.0.x` is the private grind; `0.1.0` is the first public (alpha) number. Keep public numbers
  honest.
