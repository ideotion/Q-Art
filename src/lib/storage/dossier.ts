/**
 * The portable dossier: a versioned JSON snapshot of the decision object that the
 * user can export and re-import (ADR-015 — export/backup is first-class). Pure
 * serialize/parse/validate here (unit-tested); the browser download/upload glue
 * lives in the UI. Plaintext on purpose: a backup the user controls and can read.
 */
import { SCHEMA_VERSION } from "../qart";
import type { DecisionExport } from "./types";

export const DOSSIER_KIND = "qart.dossier";

/** Stable, human-readable filename for a dossier download. */
export function dossierFilename(now = new Date()): string {
  const stamp = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `qart-dossier-${stamp}.json`;
}

/** Serialize an export to pretty JSON, tagged with kind + version for safe re-import. */
export function serializeDossier(data: DecisionExport): string {
  return JSON.stringify({ kind: DOSSIER_KIND, ...data }, null, 2);
}

/** Parse + validate a dossier file's text. Throws on anything that isn't one. */
export function parseDossier(text: string): DecisionExport {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("Not valid JSON");
  }
  if (typeof raw !== "object" || raw === null) throw new Error("Not a dossier");
  const o = raw as Record<string, unknown>;
  if (o.kind !== DOSSIER_KIND) throw new Error("Not a Q‑Art dossier");
  if (typeof o.schemaVersion !== "number") throw new Error("Missing schemaVersion");
  if (!Array.isArray(o.cases) || !Array.isArray(o.cycles)) throw new Error("Malformed dossier");
  return {
    schemaVersion: o.schemaVersion,
    exportedAt: typeof o.exportedAt === "string" ? o.exportedAt : new Date().toISOString(),
    cases: o.cases as DecisionExport["cases"],
    cycles: o.cycles as DecisionExport["cycles"],
  };
}

/** A current-version export wrapper (used when the in-memory repo lacks one). */
export function emptyExport(): DecisionExport {
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    cases: [],
    cycles: [],
  };
}
