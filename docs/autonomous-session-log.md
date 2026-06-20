# Q‑Art — Autonomous Session Log (`0.1.0-rc.1`)

> One line per fork taken during the autonomous RC build. The rule (brief §0):
> at every fork pick the most **reversible, lowest‑risk** option that honours the
> locked decisions, log it here, and continue. Genuinely irreversible/ambiguous
> calls also go to `docs/OPEN-QUESTIONS.md`. Newest at the bottom.

## Slice 0 — process setup

- Branch: developing on `claude/focused-pasteur-rpxby5` (per task brief); CLAUDE.md's
  older branch name is stale and left untouched to avoid churn.
- Confirmed baseline green (`npm run check` exit 0) before any change.
- Created this log + `docs/OPEN-QUESTIONS.md`; opening one **draft** PR early (#7).

## Slice 1 — engine: croisements + dual weighting + third mode

- Extended `Mode` to `atlas | socrate | cartes` (additive, backward compatible;
  SCHEMA_VERSION unchanged) — see ADR-018 (to be written in the docs pass).
- Added `WeightMethod` (`stepper | maxdiff | marbles`) + optional `Cycle.weightMethod`.
- New pure engines: `weighting.ts` (MaxDiff best-worst, constant-sum marbles, one
  shared 1–5 normalizer) and `croisements.ts` (token co-occurrence across rubrics →
  ranked themes; `rankedPriorities`; `topKeywordsByRubric`). Tokenizing on the
  token itself (not a surface label) avoids collapsing distinct themes.
- Store: `setWeights` (batch), `setWeightMethod`, `runSynthesis` (persists
  croisements + keywords), `loadCycle`; per-mode session diag events.
- `WeightingPanel` (three methods, each non-drag/keyboard) folded into the shared
  `SynthesisView`, so all GUIs get the weighting pass + croisements for free.
- 16 new engine tests; full gate green (typecheck·lint·43 tests·format·build).
- Note: the human (repo owner) marked PR #7 *ready for review*. Respecting that
  explicit action rather than reverting to draft; the hard rules still hold —
  I never merge, publish, or push to `main`. PR body keeps the WIP checklist.
- PR #7 was then **merged** by the human. Treating that as "this batch landed,
  keep going" (the RC is far from complete) — continuing on the same branch and
  will open a fresh PR for the *remaining* work (not a re-open of #7).

## Slice 2 — the triptyque: GUI registry + picker + Cartes (deck)

- New `src/lib/gui` registry (id === schema `Mode`): Atlas/Socrate/Cartes meta
  (route, icon key, bilingual name/paradigm/tagline/bestFor) + persisted
  preference (`qart.gui`). Bilingual-completeness test added.
- Landing rebuilt as the **triptyque picker**; `GuiSwitcher` in the app header
  switches GUI mid-session.
- **Lossless switching:** new `useGuiSession(mode)` hook replaces the per-page
  `reset()+startCase()` init — it ensures one session and only records the mode,
  so switching GUIs keeps every answer. Added store `setMode`/`loadCycle`.
- **Cartes GUI** built to full core-loop parity: `CARTES_DECK` (question + 10
  rubric cards + synthesis) in the domain; flow machine extended with a card
  index + `GOTO_CARD`; `RubricCardStack` (keep/skip, keyboard-complete — no drag
  dependency) + `CartesSpread` overview; CSS-only deal-in (reduced-motion safe).
- Flow nav given an accessible name (`Steps`) so it's distinct from the switcher;
  e2e updated (3 GUIs, Cartes deck walk, cross-GUI data-preservation).
- Gate green: typecheck·lint·48 unit tests·format·build; all four routes 200 in a
  prod server smoke. (e2e runs in CI — no browser in this sandbox.)
- CI on this push: **verify + e2e both green** (confirms the Cartes + cross-GUI
  e2e logic runs correctly in CI, since I can't run a browser locally).

## Slice 3 — encrypted-at-rest persistence + export/import (ADR-020)

- Chose the brief's blessed fallback over RxDB: an **encrypted IndexedDB adapter**
  (`crypto-idb.ts`) behind the same `StorageRepository`. AES-GCM via Web Crypto;
  key is **non-extractable**, stored in IndexedDB; structural uuids in the clear
  to index/cascade without decrypting (no content). `codec.ts` is unit-tested
  (round-trip, ciphertext doesn't leak plaintext, fresh IV, wrong-key fails).
- `migrate.ts` migration seam (+ test) and `dossier.ts` versioned export/import
  (+ test, repo round-trip). In-memory repo stays the test double.
- App-level `usePersistence` (in a new client `AppProviders`): swaps in the
  encrypted repo, **autosaves** the active case/cycle (debounced), all defensive
  — any storage failure degrades to in-memory so the app never breaks.
- `SavedIndicator` (quiet autosave status), `ExportPanel` (export · import ·
  delete — the data-subject rights, in the shared SynthesisView so every GUI has
  them), and a non-coercive **Continue** affordance on the landing (resume the
  most-recent encrypted session).
- e2e added: dossier export download + autosave→reload→continue round-trip.
- Gate green: typecheck·lint·61 unit tests·format·build; route smoke 200.

## Slice 4 — PWA (offline + install + persist onboarding) — ADR-021

- Chose a **hand-authored service worker** over Serwist: Serwist's plugin is
  webpack-based and Next 16 builds with Turbopack (high risk of breaking the
  build, and no way to iterate on browser issues in this sandbox). Recorded
  ADR-021. `public/sw.js`: precache the app shell, network-first navigations
  (offline fallback), stale-while-revalidate for content-hashed assets. No user
  content cached (it lives encrypted in IndexedDB).
- `ServiceWorkerRegister`: registers the SW + a calm, dismissible "new version
  ready" toast (reload on the user's terms — no surprise refresh).
- `PersistPrompt`: one-time, dismissible `navigator.storage.persist()`
  onboarding (inline banner, so it never obstructs the header or flow nav — a
  fixed overlay would have broken e2e clicks). "Not now" is first-class.
- Manifest hardened (id, lang, display_override, categories, sized icons) +
  apple-touch icon in metadata.
- e2e: manifest linked/served + SW registers. Gate green (61 tests, build, fmt).

## Slice 5 — in-app Help/About + diagnostics export

- `/about`: method explainer, the three GUIs, privacy, **accessibility
  statement**, a prominent **safeguarding + crisis signposting** box (ADR-017),
  reachable from every GUI (header link) + landing footer. Emergency numbers are
  facts (112/EU, 911/US, 999/UK); no specific orgs named.
- `DiagnosticsPanel` + `bundle.ts`: download a manifest-first, content-free,
  safe-to-share bundle + deep-mode toggle + version/commit stamp (ADR-013).
- Bilingual About content with its own FR/EN parity test; +4 unit tests (65).

## Slice 6 — installer (Debian-first, transparent) + shellcheck CI

- `install.sh` (`set -euo pipefail`, idempotent, no obfuscation): banner names
  the project + source + "100% local". Flags: --help/--dry-run/--dir/--ref/
  --port/--no-start/--service (user unit only)/--with-deps/--uninstall. Never
  requires root; --with-deps prints the exact NodeSource/apt commands first.
  Default --ref is the RC tag, **falls back to main** if absent. Prints the
  checked-out SHA; verifies origin. `uninstall.sh` shim included.
- CI `shell` job: shellcheck both scripts + `install.sh --dry-run`. Build now
  stamps `NEXT_PUBLIC_GIT_COMMIT`. Verified locally: syntax, --help, --dry-run
  (full + --service), --uninstall, shim delegation (shellcheck runs in CI).
- CI confirmed green for slices 3–6: verify + e2e + shell all pass (validates the
  persistence-reload, PWA-SW, and About e2e I couldn't run locally).

## Slice 7 — accessibility gate (axe, WCAG 2.2 AA)

- Added `@axe-core/playwright`; `e2e/a11y.spec.ts` scans all 5 routes × light/dark
  × FR/EN (20 scans), failing CI on any serious/critical violation (WCAG A/AA tags).
- New CI `a11y` job (e2e job now excludes a11y to avoid double-run).
- Proactive fixes (no local browser to iterate): verified every text pair ≥4.5:1
  by calculation (lowest accent-on-bg 4.70 — passes); added `aria-label` to the
  previously-unlabelled textareas (Socrate Q/reframe, Cartes Q, synthesis reframe);
  sync `<html lang>` to the active locale.
- CI green incl. the new **a11y** job (axe found no serious/critical across all
  5 routes × light/dark × FR/EN) — the proactive contrast calc + labels held.

## Slice 8 — documentation (repo + dev) + ADRs

- ADRs 018–023 (three-GUI, Cartes, encrypted IndexedDB, hand-authored SW,
  weighting A/B, installer) appended to `decisions.md`.
- New: `README.md` (rewritten — triptyque + install one-liner), `architecture.md`
  (one-object-three-views module map), `CONTRIBUTING.md`, `SECURITY.md`,
  `docs/install.md`, `docs/testing.md`, `docs/release.md`, `CHANGELOG.md`.
- In-app Help/onboarding already shipped in slice 5 (About) + slice 4 (persist
  prompt). Format/typecheck green.

## Slice 9 — deepen Atlas + Socrate

- **Atlas:** ⌘K **command palette** (native `<dialog>` → focus-trap + Escape for
  free) that doubles as a **board overview/minimap** (per-board selected counts +
  jump); **←/→ keyboard** board navigation (ignored while typing).
- **Socrate:** smooth **View Transitions** between steps (`withViewTransition` +
  `flushSync`, reduced-motion-safe) and a **gentle "Step a of b"** progress line.
- e2e: command-palette jump + Socrate progress. Gate green (65 tests, lint, build).
</content>
