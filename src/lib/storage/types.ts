/**
 * Storage repository abstraction (ADR-015). The UI and store depend only on
 * this interface; the engine (in-memory now, RxDB-encrypted later, native
 * SQLite via Capacitor as a hedge) swaps behind it. Async throughout so a real
 * IndexedDB/SQLite backend is a drop-in.
 */
import type { Case, Cycle, ID, ISODate } from "../qart";

/** Portable, versioned snapshot for export/import (first-class per ADR-015). */
export interface DecisionExport {
  schemaVersion: number;
  exportedAt: ISODate;
  cases: Case[];
  cycles: Cycle[];
}

export interface StorageRepository {
  getCase(id: ID): Promise<Case | undefined>;
  listCases(): Promise<Case[]>;
  putCase(c: Case): Promise<void>;
  /** Deletes the case and all of its cycles. */
  deleteCase(id: ID): Promise<void>;

  getCycle(id: ID): Promise<Cycle | undefined>;
  listCycles(caseId: ID): Promise<Cycle[]>;
  putCycle(cy: Cycle): Promise<void>;
  deleteCycle(id: ID): Promise<void>;

  exportAll(): Promise<DecisionExport>;
  importAll(data: DecisionExport): Promise<void>;
  clear(): Promise<void>;
}
