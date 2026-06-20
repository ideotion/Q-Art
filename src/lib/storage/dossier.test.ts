import { describe, expect, it } from "vitest";
import { DOSSIER_KIND, dossierFilename, parseDossier, serializeDossier } from "./dossier";
import { InMemoryStorageRepository } from "./memory";
import { createCase, createCycle } from "../qart";
import type { DecisionExport } from "./types";

describe("dossier (versioned export/import)", () => {
  it("serializes with a kind tag and round-trips through parse", () => {
    const data: DecisionExport = {
      schemaVersion: 1,
      exportedAt: "2026-06-20T00:00:00.000Z",
      cases: [createCase("u")],
      cycles: [createCycle("c", { mode: "atlas", question: "Q?" })],
    };
    const text = serializeDossier(data);
    expect(JSON.parse(text).kind).toBe(DOSSIER_KIND);
    const back = parseDossier(text);
    expect(back.schemaVersion).toBe(1);
    expect(back.cases).toHaveLength(1);
    expect(back.cycles[0].question).toBe("Q?");
  });

  it("rejects non-dossier input", () => {
    expect(() => parseDossier("not json")).toThrow();
    expect(() => parseDossier(JSON.stringify({ hello: 1 }))).toThrow(/dossier/);
    expect(() => parseDossier(JSON.stringify({ kind: DOSSIER_KIND }))).toThrow(/schemaVersion/);
  });

  it("produces a timestamped .json filename", () => {
    expect(dossierFilename(new Date("2026-06-20T09:08:07Z"))).toBe(
      "qart-dossier-2026-06-20-09-08-07.json",
    );
  });

  it("round-trips through the repository export/import", async () => {
    const repo = new InMemoryStorageRepository();
    const c = createCase("u");
    const cy = createCycle(c.id, { mode: "cartes", question: "Keep or quit?" });
    c.cycleIds = [cy.id];
    await repo.putCase(c);
    await repo.putCycle(cy);

    const text = serializeDossier(await repo.exportAll());

    const fresh = new InMemoryStorageRepository();
    await fresh.importAll(parseDossier(text));
    const cases = await fresh.listCases();
    expect(cases).toHaveLength(1);
    expect((await fresh.listCycles(c.id))[0].question).toBe("Keep or quit?");
  });
});
