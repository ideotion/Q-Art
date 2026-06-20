/**
 * Export/import migration seam (ADR-002 / A2). A `DecisionExport` carries its
 * `schemaVersion`; on import we step it up to the current `SCHEMA_VERSION` by
 * applying registered migrations in order. v1 needs none yet — this is the seam
 * (and its test) so the first schema change has a home and can't be forgotten.
 */
import { SCHEMA_VERSION } from "../qart";
import type { DecisionExport } from "./types";

/** A migration takes data at version N and returns data at version N+1. */
export type Migration = (data: DecisionExport) => DecisionExport;

/** Keyed by the *source* version. Add `1: (d) => ...` when SCHEMA_VERSION → 2. */
export const MIGRATIONS: Record<number, Migration> = {};

export function migrateExport(data: DecisionExport): DecisionExport {
  // Newer-than-us data: we can't safely downgrade — pass through untouched.
  if (data.schemaVersion >= SCHEMA_VERSION) return data;

  let d = data;
  while (d.schemaVersion < SCHEMA_VERSION) {
    const step = MIGRATIONS[d.schemaVersion];
    if (!step) throw new Error(`No migration registered from schema v${d.schemaVersion}`);
    d = step(d);
  }
  return d;
}
