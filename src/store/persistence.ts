"use client";

import { useEffect } from "react";
import { create } from "zustand";
import {
  EncryptedIndexedDbRepository,
  canEncryptAtRest,
  getRepository,
  setRepository,
  type StorageRepository,
} from "../lib/storage";
import { isPristineCycle, type Case, type Cycle } from "../lib/qart";
import { diag } from "../lib/diag";
import { useDecisionStore } from "./decision-store";

/** Boot gate: true once persistence has been initialised (so the UI can read it). */
interface BootState {
  hydrated: boolean;
  setHydrated: () => void;
}
export const useBoot = create<BootState>((set) => ({
  hydrated: false,
  setHydrated: () => set({ hydrated: true }),
}));

export type SaveStatus = "idle" | "saving" | "saved" | "error";
interface SaveState {
  status: SaveStatus;
  set: (s: SaveStatus) => void;
}
export const useSaveStatus = create<SaveState>((set) => ({
  status: "idle",
  set: (status) => set({ status }),
}));

let started = false;

/**
 * Swap in the encrypted-at-rest repository when the platform supports it. Any
 * failure degrades to the in-memory repo — the app must never break because
 * storage is unavailable (private mode, quota, old browser).
 */
export async function initRepo(): Promise<StorageRepository> {
  if (!canEncryptAtRest()) {
    diag("W", "storage", "storage.persist.denied", { reason: undefined });
    return getRepository();
  }
  try {
    const repo = new EncryptedIndexedDbRepository();
    await repo.listCases(); // forces DB + key creation; throws if the store is broken
    setRepository(repo);
    diag("I", "storage", "storage.persist.granted");
    return repo;
  } catch {
    diag("E", "storage", "app.error", { where: undefined });
    return getRepository();
  }
}

export interface Autosaver {
  /** Queue the current case/cycle for a debounced write. */
  notify(c: Case, cy: Cycle): void;
  /** Write any pending state immediately (tab close, visibility change). */
  flush(): Promise<void>;
  dispose(): void;
}

/**
 * Debounced writer for the active case/cycle. Extracted from the hook so the
 * debounce, flush, and error paths are unit-testable against any repository.
 */
export function createAutosaver(
  repo: StorageRepository,
  opts: { debounceMs?: number; onStatus?: (s: SaveStatus) => void } = {},
): Autosaver {
  const debounceMs = opts.debounceMs ?? 250;
  const onStatus = opts.onStatus ?? (() => {});
  let pending: { c: Case; cy: Cycle } | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const write = async (): Promise<void> => {
    const p = pending;
    pending = null;
    if (!p) return;
    try {
      await repo.putCase(p.c);
      await repo.putCycle(p.cy);
      onStatus("saved");
      diag("D", "storage", "store.tx");
    } catch {
      onStatus("error");
    }
  };

  return {
    notify(c, cy) {
      pending = { c, cy };
      onStatus("saving");
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void write(), debounceMs);
    },
    async flush() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      await write();
    },
    dispose() {
      if (timer) clearTimeout(timer);
      timer = null;
      pending = null;
    },
  };
}

/**
 * App-level persistence: initialise the encrypted repo, then autosave the active
 * case/cycle (debounced) so decision content is encrypted at rest as you work.
 * Pristine (untouched) cycles are never written — a stray page load must not
 * bury the real session. Pending writes flush on pagehide so the last keystrokes
 * before closing the tab aren't lost to the debounce.
 * No auto-open into a GUI from here — resuming is the session hook's job.
 */
export function usePersistence() {
  useEffect(() => {
    if (started) return;
    started = true;
    let unsub = () => {};
    void (async () => {
      const repo = await initRepo();
      const saver = createAutosaver(repo, {
        onStatus: (s) => useSaveStatus.getState().set(s),
      });
      useBoot.getState().setHydrated();
      unsub = useDecisionStore.subscribe((state) => {
        const { activeCase, activeCycle } = state;
        if (!activeCase || !activeCycle || isPristineCycle(activeCycle)) return;
        saver.notify(activeCase, activeCycle);
      });
      const flushNow = () => void saver.flush();
      window.addEventListener("pagehide", flushNow);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") flushNow();
      });
    })();
    return () => unsub();
  }, []);
}
