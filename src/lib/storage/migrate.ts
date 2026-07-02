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

/**
 * Step an export up to `target` (the current SCHEMA_VERSION in production; the
 * parameter exists so tests exercise THIS loop, not a reimplementation of it).
 */
export function migrateExport(data: DecisionExport, target = SCHEMA_VERSION): DecisionExport {
  // Newer-than-us data: we can't safely downgrade — pass through untouched.
  if (data.schemaVersion >= target) return data;

  let d = data;
  while (d.schemaVersion < target) {
    const step = MIGRATIONS[d.schemaVersion];
    if (!step) throw new Error(`No migration registered from schema v${d.schemaVersion}`);
    d = step(d);
  }
  return d;
}
