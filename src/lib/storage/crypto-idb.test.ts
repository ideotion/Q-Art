/**
 * The encrypted-at-rest repository is the component that embodies the
 * "encryption at rest from day one" non-negotiable (ADR-020) — it gets a real
 * unit suite, not just a happy-path e2e. IndexedDB is provided by
 * fake-indexeddb; AES-GCM by the platform webcrypto (same as the codec tests).
 */
import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EncryptedIndexedDbRepository, canEncryptAtRest } from "./crypto-idb";
import { createCase, createCycle, type Case, type Cycle } from "../qart";

const QUESTION = "Should I resign from my post?";

function fixtures(): { c: Case; cy: Cycle; cy2: Cycle } {
  const c = createCase("u_test");
  const cy = createCycle(c.id, { mode: "atlas", question: QUESTION });
  cy.rubrics.emotions = {
    key: "emotions",
    checkedItems: [{ itemId: "emo_fear", label: "fear / anxiety", weight: 4 }],
    freeText: "fear of the conversation",
    keywords: [],
  };
  const cy2 = createCycle(c.id, { mode: "socrate", parentCycleId: cy.id });
  c.cycleIds = [cy.id, cy2.id];
  return { c, cy, cy2 };
}

const deleteDb = () =>
  new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase("qart");
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });

// An open connection blocks deleteDatabase — track and close every repo.
const open: EncryptedIndexedDbRepository[] = [];
function make(): EncryptedIndexedDbRepository {
  const repo = new EncryptedIndexedDbRepository();
  open.push(repo);
  return repo;
}

beforeEach(async () => {
  await deleteDb();
});
afterEach(async () => {
  for (const r of open) await r.close();
  open.length = 0;
  await deleteDb();
});

describe("EncryptedIndexedDbRepository (ADR-020)", () => {
  it("is feature-detected on this platform (fake IDB + webcrypto)", () => {
    expect(canEncryptAtRest()).toBe(true);
  });

  it("round-trips a case and lists it", async () => {
    const repo = make();
    const { c } = fixtures();
    await repo.putCase(c);
    expect(await repo.getCase(c.id)).toEqual(c);
    expect(await repo.listCases()).toEqual([c]);
    expect(await repo.getCase("missing")).toBeUndefined();
  });

  it("round-trips cycles and filters listCycles by case", async () => {
    const repo = make();
    const { c, cy, cy2 } = fixtures();
    const other = createCycle("other_case", { mode: "cartes" });
    await repo.putCase(c);
    await repo.putCycle(cy);
    await repo.putCycle(cy2);
    await repo.putCycle(other);

    expect(await repo.getCycle(cy.id)).toEqual(cy);
    const listed = await repo.listCycles(c.id);
    expect(listed.map((x) => x.id).sort()).toEqual([cy.id, cy2.id].sort());
  });

  it("deleteCase cascades that case's cycles — and only those", async () => {
    const repo = make();
    const { c, cy, cy2 } = fixtures();
    const other = createCycle("other_case", { mode: "cartes" });
    await repo.putCase(c);
    await repo.putCycle(cy);
    await repo.putCycle(cy2);
    await repo.putCycle(other);

    await repo.deleteCase(c.id);
    expect(await repo.getCase(c.id)).toBeUndefined();
    expect(await repo.getCycle(cy.id)).toBeUndefined();
    expect(await repo.getCycle(cy2.id)).toBeUndefined();
    expect(await repo.getCycle(other.id)).toEqual(other);
  });

  it("export → import round-trips through a fresh store", async () => {
    const repo = make();
    const { c, cy, cy2 } = fixtures();
    await repo.putCase(c);
    await repo.putCycle(cy);
    await repo.putCycle(cy2);
    const dump = await repo.exportAll();

    await repo.close(); // an open connection would block the delete below
    await deleteDb();
    const fresh = make();
    await fresh.importAll(dump);
    expect(await fresh.getCase(c.id)).toEqual(c);
    expect((await fresh.listCycles(c.id)).length).toBe(2);
  });

  it("clear() empties both stores", async () => {
    const repo = make();
    const { c, cy } = fixtures();
    await repo.putCase(c);
    await repo.putCycle(cy);
    await repo.clear();
    expect(await repo.listCases()).toEqual([]);
    expect(await repo.listCycles(c.id)).toEqual([]);
  });

  it("a second repository instance reuses the persisted key and reads existing data", async () => {
    const first = make();
    const { c } = fixtures();
    await first.putCase(c);

    // Same DB, new instance — must decrypt with the stored (non-extractable) key.
    const second = make();
    expect(await second.getCase(c.id)).toEqual(c);
  });

  it("stores no plaintext at rest — raw rows carry only sealed bytes", async () => {
    const repo = make();
    const { c, cy } = fixtures();
    await repo.putCase(c);
    await repo.putCycle(cy);

    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open("qart");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const raw = await new Promise<{ id: string; sealed: { iv: ArrayBuffer; ct: ArrayBuffer } }>(
      (resolve, reject) => {
        const req = db.transaction("cycles").objectStore("cycles").get(cy.id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      },
    );
    db.close();

    // The row has no readable fields beyond structural ids…
    expect(Object.keys(raw).sort()).toEqual(["caseId", "id", "sealed"]);
    // …and the ciphertext does not contain the decision content.
    const asText = new TextDecoder("utf-8", { fatal: false }).decode(raw.sealed.ct);
    expect(asText).not.toContain(QUESTION);
    expect(asText).not.toContain("fear of the conversation");
  });
});
