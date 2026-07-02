/**
 * Find the most recent saved session — shared by the landing "continue" banner
 * and by direct GUI loads (refresh, bookmark, PWA restore), so a reload never
 * strands the user's saved work behind a fresh empty case.
 */
import type { Case, Cycle } from "../qart";
import type { StorageRepository } from "./types";

export interface ResumePoint {
  c: Case;
  cy: Cycle;
}

/** Most recently updated case + its latest cycle (chain order first, then recency). */
export async function loadMostRecent(repo: StorageRepository): Promise<ResumePoint | null> {
  const cases = await repo.listCases();
  if (!cases.length) return null;
  const c = [...cases].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const cycles = await repo.listCycles(c.id);
  if (!cycles.length) return null;
  // Prefer the last cycle of the case's chain (recursion-aware); fall back to recency.
  const lastId = c.cycleIds[c.cycleIds.length - 1];
  const cy =
    cycles.find((x) => x.id === lastId) ??
    [...cycles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  return { c, cy };
}
