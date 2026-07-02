import { describe, expect, it } from "vitest";
import { MIGRATIONS, migrateExport } from "./migrate";
import { SCHEMA_VERSION } from "../qart";
import type { DecisionExport } from "./types";

const exportAt = (schemaVersion: number): DecisionExport => ({
  schemaVersion,
  exportedAt: new Date().toISOString(),
  cases: [],
  cycles: [],
});

describe("export migration seam", () => {
  it("passes a current-version export through unchanged", () => {
    const d = exportAt(SCHEMA_VERSION);
    expect(migrateExport(d)).toBe(d);
  });

  it("passes newer-than-current data through (no unsafe downgrade)", () => {
    const d = exportAt(SCHEMA_VERSION + 5);
    expect(migrateExport(d).schemaVersion).toBe(SCHEMA_VERSION + 5);
  });

  it("throws if an older version has no registered migration", () => {
    expect(() => migrateExport(exportAt(SCHEMA_VERSION - 1))).toThrow(/No migration/);
  });

  it("applies registered migration steps through the production loop", () => {
    const from = SCHEMA_VERSION;
    MIGRATIONS[from] = (d) => ({ ...d, schemaVersion: from + 1 }) as DecisionExport;
    MIGRATIONS[from + 1] = (d) => ({ ...d, schemaVersion: from + 2 }) as DecisionExport;
    try {
      // The REAL migrateExport walks both steps (target param = the seam's test hook).
      const out = migrateExport(exportAt(from), from + 2);
      expect(out.schemaVersion).toBe(from + 2);
    } finally {
      delete MIGRATIONS[from];
      delete MIGRATIONS[from + 1];
    }
  });

  it("throws mid-chain when a step is missing (no silent partial upgrade)", () => {
    const from = SCHEMA_VERSION;
    MIGRATIONS[from] = (d) => ({ ...d, schemaVersion: from + 1 }) as DecisionExport;
    try {
      expect(() => migrateExport(exportAt(from), from + 3)).toThrow(/No migration/);
    } finally {
      delete MIGRATIONS[from];
    }
  });
});
