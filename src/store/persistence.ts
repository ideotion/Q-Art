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
let timer: ReturnType<typeof setTimeout> | null = null;

/**
 * Swap in the encrypted-at-rest repository when the platform supports it. Any
 * failure degrades to the in-memory repo — the app must never break because
 * storage is unavailable (private mode, quota, old browser).
 */
async function initRepo(): Promise<StorageRepository> {
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

/**
 * App-level persistence: initialise the encrypted repo, then autosave the active
 * case/cycle (debounced) so decision content is encrypted at rest as you work.
 * No auto-resume into a GUI — the landing offers an explicit, non-coercive
 * "continue" instead.
 */
export function usePersistence() {
  useEffect(() => {
    if (started) return;
    started = true;
    let unsub = () => {};
    void (async () => {
      const repo = await initRepo();
      useBoot.getState().setHydrated();
      unsub = useDecisionStore.subscribe((state) => {
        const { activeCase, activeCycle } = state;
        if (!activeCase || !activeCycle) return;
        useSaveStatus.getState().set("saving");
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          void (async () => {
            try {
              await repo.putCase(activeCase);
              await repo.putCycle(activeCycle);
              useSaveStatus.getState().set("saved");
              diag("D", "storage", "store.tx");
            } catch {
              useSaveStatus.getState().set("error");
            }
          })();
        }, 250);
      });
    })();
    return () => unsub();
  }, []);
}
