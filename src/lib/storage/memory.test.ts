import { beforeEach, describe, expect, it } from "vitest";
import { createCase, createCycle } from "../qart";
import { InMemoryStorageRepository } from "./memory";

let repo: InMemoryStorageRepository;
beforeEach(() => {
  repo = new InMemoryStorageRepository();
});

describe("InMemoryStorageRepository", () => {
  it("stores and retrieves cloned (not by-reference) objects", async () => {
    const c = createCase("u");
    await repo.putCase(c);

    const got = await repo.getCase(c.id);
    expect(got).toEqual(c);
    expect(got).not.toBe(c);

    const a = await repo.getCase(c.id);
    if (!a) throw new Error("expected case");
    a.title = "mutated";
    const b = await repo.getCase(c.id);
    expect(b?.title).toBeUndefined(); // store unaffected by caller mutation
  });

  it("cascades cycle deletion when a case is deleted", async () => {
    const c = createCase("u");
    const cy = createCycle(c.id, { mode: "atlas" });
    await repo.putCase(c);
    await repo.putCycle(cy);
    expect(await repo.listCycles(c.id)).toHaveLength(1);

    await repo.deleteCase(c.id);
    expect(await repo.getCase(c.id)).toBeUndefined();
    expect(await repo.listCycles(c.id)).toHaveLength(0);
  });

  it("round-trips through versioned export/import", async () => {
    const c = createCase("u");
    const cy = createCycle(c.id, { mode: "socrate", question: "Q?" });
    await repo.putCase(c);
    await repo.putCycle(cy);

    const dump = await repo.exportAll();
    expect(dump.schemaVersion).toBeGreaterThanOrEqual(1);
    expect(dump.cases).toHaveLength(1);

    const fresh = new InMemoryStorageRepository();
    await fresh.importAll(dump);
    expect(await fresh.getCase(c.id)).toEqual(c);
    const cycles = await fresh.listCycles(c.id);
    expect(cycles[0]?.question).toBe("Q?");
  });
});
