# Q‑Art — Testing

> **Proprietary** · © 2026 Ideotion · personal, non-commercial use permitted; all other rights reserved (`LICENSE`).

## Layers

| Layer | Tool | Scope |
|---|---|---|
| **Unit** | Vitest (jsdom) | Domain engines (weighting, croisements), schema/factory, store, storage (codec/migrate/dossier/in‑memory), diagnostics (incl. the content‑leak guard), GUI registry, About/i18n parity. |
| **e2e** | Playwright (chromium, prod build) | Core loop per GUI, language toggle, export download, cross‑GUI data preservation, autosave→reload→continue, PWA manifest/SW, About + safeguarding. |
| **a11y** | `@axe-core/playwright` | Every route × light/dark × FR/EN; fails on serious/critical (WCAG A/AA). |
| **shell** | shellcheck + `--dry-run` | `install.sh`, `uninstall.sh`. |

## Run

```bash
npm run check                 # typecheck + lint + unit
npm run test:e2e              # all e2e (needs: npx playwright install chromium)
npx playwright test e2e/a11y.spec.ts          # just the axe scan
npx playwright test --grep-invert "^a11y"     # e2e minus a11y (how CI splits them)
```

## CI (`.github/workflows/ci.yml`)

Four jobs run on every push/PR (superseded runs are cancelled):

- **verify** — `format:check · typecheck · lint · test · build` (build stamps the git commit).
- **e2e** — Playwright, excluding the a11y spec.
- **a11y** — the axe scan across all GUIs.
- **shell** — shellcheck + installer dry‑run.

## Conventions

- Keep tests deterministic; the engines are pure and the in‑memory repo is the storage double.
- Bilingual parity is enforced by tests — add both FR and EN for any new string.
- The "**no content in logs**" guarantee is a typed, compile‑time test — don't weaken it.
- e2e scopes the flow nav by its accessible name (`Steps` / `Étapes`) to stay robust as chrome grows.
