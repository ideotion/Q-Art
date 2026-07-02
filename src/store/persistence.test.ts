/**
 * The autosave path and the degrade-to-memory fallback are what the privacy
 * story rests on — tested directly (the seam was extracted for exactly this).
 * NOTE: no fake-indexeddb here on purpose: this environment has no IndexedDB,
 * which is the degrade case initRepo must survive.
 */
import { describe, expect, it, vi } from "vitest";
import { createAutosaver, initRepo, type SaveStatus } from "./persistence";
import { InMemoryStorageRepository, getRepository } from "../lib/storage";
import { createCase, createCycle } from "../lib/qart";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function fixtures() {
  const c = createCase("u_test");
  const cy = createCycle(c.id, { mode: "atlas", question: "Q?" });
  c.cycleIds = [cy.id];
  return { c, cy };
}

describe("initRepo degrade path", () => {
  it("falls back to the in-memory repository when the platform can't encrypt at rest", async () => {
    // jsdom without fake-indexeddb: canEncryptAtRest() is false here.
    const repo = await initRepo();
    expect(repo).toBe(getRepository());
    expect(repo).toBeInstanceOf(InMemoryStorageRepository);
  });
});

describe("createAutosaver", () => {
  it("debounces bursts into a single write of the latest state", async () => {
    const repo = new InMemoryStorageRepository();
    const putCase = vi.spyOn(repo, "putCase");
    const putCycle = vi.spyOn(repo, "putCycle");
    const saver = createAutosaver(repo, { debounceMs: 30 });

    const { c, cy } = fixtures();
    const cy2 = { ...cy, question: "Q — revised?" };
    saver.notify(c, cy);
    saver.notify(c, cy2);
    expect(putCase).not.toHaveBeenCalled(); // still inside the debounce window

    await wait(80);
    expect(putCase).toHaveBeenCalledTimes(1);
    expect(putCycle).toHaveBeenCalledTimes(1);
    expect(putCycle).toHaveBeenCalledWith(cy2); // the latest state, not the first
    saver.dispose();
  });

  it("flush() writes pending state immediately (pagehide path)", async () => {
    const repo = new InMemoryStorageRepository();
    const putCycle = vi.spyOn(repo, "putCycle");
    const saver = createAutosaver(repo, { debounceMs: 60_000 }); // never fires on its own

    const { c, cy } = fixtures();
    saver.notify(c, cy);
    await saver.flush();
    expect(putCycle).toHaveBeenCalledTimes(1);

    await saver.flush(); // nothing pending — must not double-write
    expect(putCycle).toHaveBeenCalledTimes(1);
    saver.dispose();
  });

  it("reports saving → saved on success and error on a failing repository", async () => {
    const statuses: SaveStatus[] = [];
    const repo = new InMemoryStorageRepository();
    const saver = createAutosaver(repo, { debounceMs: 1, onStatus: (s) => statuses.push(s) });
    const { c, cy } = fixtures();
    saver.notify(c, cy);
    await wait(30);
    expect(statuses).toEqual(["saving", "saved"]);

    const failing = new InMemoryStorageRepository();
    vi.spyOn(failing, "putCase").mockRejectedValue(new Error("quota"));
    const statuses2: SaveStatus[] = [];
    const saver2 = createAutosaver(failing, { debounceMs: 1, onStatus: (s) => statuses2.push(s) });
    saver2.notify(c, cy);
    await wait(30);
    expect(statuses2).toEqual(["saving", "error"]);
    saver.dispose();
    saver2.dispose();
  });

  it("dispose() cancels a pending write", async () => {
    const repo = new InMemoryStorageRepository();
    const putCase = vi.spyOn(repo, "putCase");
    const saver = createAutosaver(repo, { debounceMs: 10 });
    const { c, cy } = fixtures();
    saver.notify(c, cy);
    saver.dispose();
    await wait(40);
    expect(putCase).not.toHaveBeenCalled();
  });
});
