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
</content>
