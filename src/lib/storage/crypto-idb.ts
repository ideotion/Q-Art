/**
 * Encrypted-at-rest IndexedDB repository (ADR-020). Decision content is sealed
 * with AES-GCM (see ./codec) under a **non-extractable** CryptoKey kept in the
 * `meta` store, so nothing readable — and no key material — ever touches disk.
 *
 * This is the brief's blessed fallback for "encryption at rest" when RxDB can't
 * land green: same `StorageRepository` interface, so the UI/store never know.
 * Structural ids (uuids) are stored in the clear to index/cascade without
 * decrypting; they carry no decision content.
 *
 * Browser-only (IndexedDB + crypto.subtle). The in-memory repo stays the test
 * double; this adapter is exercised end-to-end by the e2e persistence test.
 */
import { open, seal, generateKey, type Sealed } from "./codec";
import { migrateExport } from "./migrate";
import { SCHEMA_VERSION, nowISO, type Case, type Cycle, type ID } from "../qart";
import type { DecisionExport, StorageRepository } from "./types";

const DB_NAME = "qart";
const DB_VERSION = 1;
const META = "meta";
const CASES = "cases";
const CYCLES = "cycles";
const KEY_ID = "enc-key";

interface CaseRow {
  id: ID;
  sealed: Sealed;
}
interface CycleRow {
  id: ID;
  caseId: ID; // plaintext structural id for indexing/cascade (not content)
  sealed: Sealed;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META);
      if (!db.objectStoreNames.contains(CASES)) db.createObjectStore(CASES, { keyPath: "id" });
      if (!db.objectStoreNames.contains(CYCLES)) {
        const s = db.createObjectStore(CYCLES, { keyPath: "id" });
        s.createIndex("caseId", "caseId", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const reqP = <T>(req: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const txDone = (tx: IDBTransaction): Promise<void> =>
  new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });

export class EncryptedIndexedDbRepository implements StorageRepository {
  private dbp = openDb();
  private keyp = this.loadOrCreateKey();

  private async loadOrCreateKey(): Promise<CryptoKey> {
    const db = await this.dbp;
    const existing = await reqP<CryptoKey | undefined>(
      db.transaction(META, "readonly").objectStore(META).get(KEY_ID),
    );
    if (existing) return existing;
    const key = await generateKey(); // non-extractable
    const tx = db.transaction(META, "readwrite");
    tx.objectStore(META).put(key, KEY_ID);
    await txDone(tx);
    return key;
  }

  private async sealRow(value: Case | Cycle): Promise<Sealed> {
    return seal(await this.keyp, value);
  }
  private async openRow<T>(sealed: Sealed): Promise<T> {
    return open<T>(await this.keyp, sealed);
  }

  async getCase(id: ID): Promise<Case | undefined> {
    const db = await this.dbp;
    const row = await reqP<CaseRow | undefined>(
      db.transaction(CASES, "readonly").objectStore(CASES).get(id),
    );
    return row ? this.openRow<Case>(row.sealed) : undefined;
  }

  async listCases(): Promise<Case[]> {
    const db = await this.dbp;
    const rows = await reqP<CaseRow[]>(
      db.transaction(CASES, "readonly").objectStore(CASES).getAll(),
    );
    return Promise.all(rows.map((r) => this.openRow<Case>(r.sealed)));
  }

  async putCase(c: Case): Promise<void> {
    const db = await this.dbp;
    const row: CaseRow = { id: c.id, sealed: await this.sealRow(c) };
    const tx = db.transaction(CASES, "readwrite");
    tx.objectStore(CASES).put(row);
    await txDone(tx);
  }

  async deleteCase(id: ID): Promise<void> {
    const db = await this.dbp;
    const tx = db.transaction([CASES, CYCLES], "readwrite");
    tx.objectStore(CASES).delete(id);
    const idx = tx.objectStore(CYCLES).index("caseId");
    const keys = await reqP<IDBValidKey[]>(idx.getAllKeys(IDBKeyRange.only(id)));
    for (const k of keys) tx.objectStore(CYCLES).delete(k);
    await txDone(tx);
  }

  async getCycle(id: ID): Promise<Cycle | undefined> {
    const db = await this.dbp;
    const row = await reqP<CycleRow | undefined>(
      db.transaction(CYCLES, "readonly").objectStore(CYCLES).get(id),
    );
    return row ? this.openRow<Cycle>(row.sealed) : undefined;
  }

  async listCycles(caseId: ID): Promise<Cycle[]> {
    const db = await this.dbp;
    const rows = await reqP<CycleRow[]>(
      db
        .transaction(CYCLES, "readonly")
        .objectStore(CYCLES)
        .index("caseId")
        .getAll(IDBKeyRange.only(caseId)),
    );
    return Promise.all(rows.map((r) => this.openRow<Cycle>(r.sealed)));
  }

  async putCycle(cy: Cycle): Promise<void> {
    const db = await this.dbp;
    const row: CycleRow = { id: cy.id, caseId: cy.caseId, sealed: await this.sealRow(cy) };
    const tx = db.transaction(CYCLES, "readwrite");
    tx.objectStore(CYCLES).put(row);
    await txDone(tx);
  }

  async deleteCycle(id: ID): Promise<void> {
    const db = await this.dbp;
    const tx = db.transaction(CYCLES, "readwrite");
    tx.objectStore(CYCLES).delete(id);
    await txDone(tx);
  }

  async exportAll(): Promise<DecisionExport> {
    const [cases, db] = [await this.listCases(), await this.dbp];
    const cycleRows = await reqP<CycleRow[]>(
      db.transaction(CYCLES, "readonly").objectStore(CYCLES).getAll(),
    );
    const cycles = await Promise.all(cycleRows.map((r) => this.openRow<Cycle>(r.sealed)));
    return { schemaVersion: SCHEMA_VERSION, exportedAt: nowISO(), cases, cycles };
  }

  async importAll(data: DecisionExport): Promise<void> {
    const migrated = migrateExport(data);
    for (const c of migrated.cases) await this.putCase(c);
    for (const cy of migrated.cycles) await this.putCycle(cy);
  }

  async clear(): Promise<void> {
    const db = await this.dbp;
    const tx = db.transaction([CASES, CYCLES], "readwrite");
    tx.objectStore(CASES).clear();
    tx.objectStore(CYCLES).clear();
    await txDone(tx);
  }
}

/** Feature-detect the APIs this adapter needs. */
export function canEncryptAtRest(): boolean {
  return (
    typeof indexedDB !== "undefined" &&
    typeof globalThis.crypto !== "undefined" &&
    !!globalThis.crypto.subtle
  );
}
