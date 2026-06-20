/**
 * Diagnostics core: `diag()` → a bounded ring buffer, with a manifest-first
 * export builder. Content-free by construction (see ./types) and redacted on
 * the way in. IndexedDB/RxDB mirroring and the zipped bundle are a later wiring
 * step; the buffer + manifest + JSONL serializer land at 0.0.1.
 */
import { redactContext } from "./redact";
import type { Category, DiagEvent, Level, SafeContext } from "./types";

export const DIAG_SCHEMA_VERSION = 1;

const LEVEL_RANK: Record<Level, number> = { E: 0, W: 1, I: 2, D: 3, T: 4 };

interface DiagConfig {
  minLevel: Level;
  capacity: number;
}

// Dev (0.0.x) defaults to deep; tighten for prod via configureDiag.
const config: DiagConfig = { minLevel: "T", capacity: 2000 };
const baseTime = Date.now();
let buffer: DiagEvent[] = [];

export function configureDiag(patch: Partial<DiagConfig>): void {
  Object.assign(config, patch);
}

export function setDeepMode(on: boolean): void {
  config.minLevel = on ? "T" : "I";
}

export function diag(
  level: Level,
  category: Category,
  eventCode: string,
  ctx?: SafeContext,
  opts?: { cid?: string; d?: number },
): void {
  if (LEVEL_RANK[level] > LEVEL_RANK[config.minLevel]) return;
  const ev: DiagEvent = { t: Date.now() - baseTime, l: level, c: category, e: eventCode };
  if (opts?.cid) ev.cid = opts.cid;
  if (typeof opts?.d === "number") ev.d = opts.d;
  const x = redactContext(ctx);
  if (x && Object.keys(x).length > 0) ev.x = x;
  buffer.push(ev);
  if (buffer.length > config.capacity) buffer.splice(0, buffer.length - config.capacity);
}

export function getEvents(): readonly DiagEvent[] {
  return buffer;
}

export function clearEvents(): void {
  buffer = [];
}

export interface DiagManifest {
  diagSchemaVersion: number;
  safeToShare: true;
  baseTime: number;
  commit?: string;
  appVersion?: string;
  counts: {
    total: number;
    byLevel: Record<string, number>;
    byCategory: Record<string, number>;
  };
  lastErrors: string[];
}

export function buildManifest(meta?: { commit?: string; appVersion?: string }): DiagManifest {
  const byLevel: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  for (const ev of buffer) {
    byLevel[ev.l] = (byLevel[ev.l] ?? 0) + 1;
    byCategory[ev.c] = (byCategory[ev.c] ?? 0) + 1;
  }
  const lastErrors = buffer
    .filter((e) => e.l === "E")
    .slice(-10)
    .map((e) => e.e);
  return {
    diagSchemaVersion: DIAG_SCHEMA_VERSION,
    safeToShare: true,
    baseTime,
    commit: meta?.commit,
    appVersion: meta?.appVersion,
    counts: { total: buffer.length, byLevel, byCategory },
    lastErrors,
  };
}

/** The events as newline-delimited JSON (events.jsonl). */
export function toJsonl(): string {
  return buffer.map((e) => JSON.stringify(e)).join("\n");
}
