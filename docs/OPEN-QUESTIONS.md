# Q‑Art — Open Questions (autonomous RC)

> Genuinely irreversible or ambiguous calls surfaced during the autonomous
> `0.1.0-rc.1` build. For each, the **safe, reversible default** that was taken so
> the build could continue (per the brief's "never block on a question" rule).
> The human can revisit any of these. Routine reversible choices live in
> `docs/autonomous-session-log.md`, not here.

## Product / strategy (owner: human)

- **Weighting method (ADR‑005, "decide by test").** The RC ships **all three**
  selectable methods — direct *stepper*, *MaxDiff* (best/worst), *constant‑sum
  marbles* — and records the chosen method content‑free, so the A/B can be run
  later. **Default taken:** direct stepper (always available; the others are
  opt‑in). No method is removed.
- **Reflection serif‑vs‑sans (open).** **Default taken:** keep the single UI sans
  (Inter); no second webfont added (lean budget). Reversible via one CSS variable.
- **Beachhead persona / wedge, monetization, concrete EU host.** Untouched —
  out of scope for a local, no‑backend RC.

## Architecture (recorded as ADRs where decided)

- **Third GUI ⇒ third `mode`.** The decision object's `mode` tag (which door
  edited it) is extended to `"atlas" | "socrate" | "cartes"`. Additive, backward
  compatible (old data stays valid), no persisted‑shape change ⇒ `SCHEMA_VERSION`
  unchanged. Recorded in **ADR‑018**.
- **Encryption at rest (mandatory).** The brief prefers RxDB. **Default taken:**
  an **encrypted IndexedDB adapter** behind the existing `StorageRepository`
  (Web Crypto `AES‑GCM`, non‑extractable `CryptoKey` stored in IndexedDB), to
  avoid pulling a heavy dependency for an RC while still **never shipping
  unencrypted persistence**. The brief explicitly blesses this fallback.
  Recorded in **ADR‑020**.
- **PWA service worker.** **Default taken:** a small hand‑authored Serwist‑style
  SW (offline app‑shell + asset cache) if the Serwist+Next 16 integration can't
  land green quickly. Either way: manifest + icons + `navigator.storage.persist()`
  onboarding. Recorded in **ADR‑021**.
- **i18n library.** **Default taken:** keep the typed FR/EN dictionary seam
  (bilingual parity is the gate, not the library); Paraglide migration deferred.
</content>
