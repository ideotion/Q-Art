/**
 * Pure constructors for the decision object. Used by both doors' store writers
 * and by tests. No side effects beyond id/timestamp generation.
 */
import {
  SCHEMA_VERSION,
  type Case,
  type Cycle,
  type ID,
  type ISODate,
  type Mode,
  type RubricEntry,
  type RubricKey,
  type Synthesis,
} from "./types";

export function newId(): ID {
  return crypto.randomUUID();
}

export function nowISO(): ISODate {
  return new Date().toISOString();
}

export function emptySynthesis(initialQuestion: string): Synthesis {
  return { initialQuestion, keywordsByRubric: {}, crossLinks: [] };
}

export function emptyRubricEntry(key: RubricKey): RubricEntry {
  return { key, checkedItems: [], keywords: [] };
}

export function createCase(ownerId: ID, init?: Partial<Pick<Case, "id" | "title">>): Case {
  const ts = nowISO();
  return {
    id: init?.id ?? newId(),
    schemaVersion: SCHEMA_VERSION,
    ownerId,
    title: init?.title,
    cycleIds: [],
    createdAt: ts,
    updatedAt: ts,
  };
}

export function createCycle(
  caseId: ID,
  init: { mode: Mode; question?: string; parentCycleId?: ID; id?: ID },
): Cycle {
  const ts = nowISO();
  const question = init.question ?? "";
  return {
    id: init.id ?? newId(),
    caseId,
    parentCycleId: init.parentCycleId,
    mode: init.mode,
    question,
    rubrics: {},
    synthesis: emptySynthesis(question),
    createdAt: ts,
    updatedAt: ts,
  };
}
