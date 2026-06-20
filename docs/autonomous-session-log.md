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
</content>
