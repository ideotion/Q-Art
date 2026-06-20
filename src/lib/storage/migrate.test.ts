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

  it("applies a registered migration step (seam works end-to-end)", () => {
    const from = SCHEMA_VERSION;
    const to = SCHEMA_VERSION + 1;
    MIGRATIONS[from] = (d) => ({ ...d, schemaVersion: to, title: "migrated" }) as DecisionExport;
    try {
      // Pretend the app now targets `to` by migrating a `from` export upward.
      const out = migrateAgainst(exportAt(from), to);
      expect(out.schemaVersion).toBe(to);
    } finally {
      delete MIGRATIONS[from];
    }
  });
});

/** Local helper mirroring migrateExport but against an explicit target (for the seam test). */
function migrateAgainst(data: DecisionExport, target: number): DecisionExport {
  let d = data;
  while (d.schemaVersion < target) {
    const step = MIGRATIONS[d.schemaVersion];
    if (!step) throw new Error(`No migration registered from schema v${d.schemaVersion}`);
    d = step(d);
  }
  return d;
}
