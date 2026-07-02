import { describe, expect, it } from "vitest";
import { InMemoryStorageRepository } from "./memory";
import { loadMostRecent } from "./resume";
import { createCase, createCycle } from "../qart";

describe("loadMostRecent (session resume)", () => {
  it("returns null when nothing is stored", async () => {
    expect(await loadMostRecent(new InMemoryStorageRepository())).toBeNull();
  });

  it("returns null for a case with no cycles", async () => {
    const repo = new InMemoryStorageRepository();
    await repo.putCase(createCase("u"));
    expect(await loadMostRecent(repo)).toBeNull();
  });

  it("picks the most recently updated case", async () => {
    const repo = new InMemoryStorageRepository();
    const old = createCase("u");
    old.updatedAt = "2026-01-01T00:00:00.000Z";
    const oldCy = createCycle(old.id, { mode: "atlas" });
    old.cycleIds = [oldCy.id];

    const fresh = createCase("u");
    fresh.updatedAt = "2026-06-01T00:00:00.000Z";
    const freshCy = createCycle(fresh.id, { mode: "socrate" });
    fresh.cycleIds = [freshCy.id];

    await repo.putCase(old);
    await repo.putCycle(oldCy);
    await repo.putCase(fresh);
    await repo.putCycle(freshCy);

    const found = await loadMostRecent(repo);
    expect(found?.c.id).toBe(fresh.id);
    expect(found?.cy.id).toBe(freshCy.id);
  });

  it("prefers the last cycle of the chain (recursion-aware) over raw recency", async () => {
    const repo = new InMemoryStorageRepository();
    const c = createCase("u");
    const cy1 = createCycle(c.id, { mode: "atlas" });
    cy1.updatedAt = "2026-06-02T00:00:00.000Z"; // touched later…
    const cy2 = createCycle(c.id, { mode: "atlas", parentCycleId: cy1.id });
    cy2.updatedAt = "2026-06-01T00:00:00.000Z"; // …but cy2 is the chain's last
    c.cycleIds = [cy1.id, cy2.id];

    await repo.putCase(c);
    await repo.putCycle(cy1);
    await repo.putCycle(cy2);

    const found = await loadMostRecent(repo);
    expect(found?.cy.id).toBe(cy2.id);
  });
});
