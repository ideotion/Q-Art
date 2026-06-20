/**
 * In-memory StorageRepository — the v1 default and the test double. Clones on
 * the boundary so callers can't mutate stored objects by reference (mirrors the
 * serialization boundary a real persisted backend would impose).
 */
import { SCHEMA_VERSION, nowISO, type Case, type Cycle, type ID } from "../qart";
import type { DecisionExport, StorageRepository } from "./types";

const clone = <T>(v: T): T => structuredClone(v);

export class InMemoryStorageRepository implements StorageRepository {
  private cases = new Map<ID, Case>();
  private cycles = new Map<ID, Cycle>();

  getCase(id: ID): Promise<Case | undefined> {
    const c = this.cases.get(id);
    return Promise.resolve(c ? clone(c) : undefined);
  }

  listCases(): Promise<Case[]> {
    return Promise.resolve([...this.cases.values()].map(clone));
  }

  putCase(c: Case): Promise<void> {
    this.cases.set(c.id, clone(c));
    return Promise.resolve();
  }

  deleteCase(id: ID): Promise<void> {
    this.cases.delete(id);
    for (const [cycleId, cy] of this.cycles) {
      if (cy.caseId === id) this.cycles.delete(cycleId);
    }
    return Promise.resolve();
  }

  getCycle(id: ID): Promise<Cycle | undefined> {
    const cy = this.cycles.get(id);
    return Promise.resolve(cy ? clone(cy) : undefined);
  }

  listCycles(caseId: ID): Promise<Cycle[]> {
    return Promise.resolve(
      [...this.cycles.values()].filter((cy) => cy.caseId === caseId).map(clone),
    );
  }

  putCycle(cy: Cycle): Promise<void> {
    this.cycles.set(cy.id, clone(cy));
    return Promise.resolve();
  }

  deleteCycle(id: ID): Promise<void> {
    this.cycles.delete(id);
    return Promise.resolve();
  }

  exportAll(): Promise<DecisionExport> {
    return Promise.resolve({
      schemaVersion: SCHEMA_VERSION,
      exportedAt: nowISO(),
      cases: [...this.cases.values()].map(clone),
      cycles: [...this.cycles.values()].map(clone),
    });
  }

  importAll(data: DecisionExport): Promise<void> {
    for (const c of data.cases) this.cases.set(c.id, clone(c));
    for (const cy of data.cycles) this.cycles.set(cy.id, clone(cy));
    return Promise.resolve();
  }

  clear(): Promise<void> {
    this.cases.clear();
    this.cycles.clear();
    return Promise.resolve();
  }
}
