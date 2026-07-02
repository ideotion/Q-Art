/**
 * Storage repository (ADR-015). v1 default = in-memory. Swap the implementation
 * (RxDB encrypted-at-rest; Capacitor/native SQLite) behind `setRepository`
 * without touching callers.
 */
export * from "./types";
export * from "./memory";
export * from "./codec";
export * from "./migrate";
export * from "./crypto-idb";
export * from "./dossier";
export * from "./resume";

import { InMemoryStorageRepository } from "./memory";
import type { StorageRepository } from "./types";

let repo: StorageRepository | null = null;

export function getRepository(): StorageRepository {
  if (!repo) repo = new InMemoryStorageRepository();
  return repo;
}

export function setRepository(r: StorageRepository): void {
  repo = r;
}
