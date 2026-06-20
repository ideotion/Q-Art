/**
 * Diagnostics fabric — types (see docs/diagnostics.md, ADR-013).
 *
 * Law #4 "typed sink" is enforced here: a diag context may only hold
 * numbers, booleans, or strings explicitly vouched safe via `safe(...)`.
 * A raw `string` (e.g. decision content) is NOT assignable to `SafeValue`,
 * so content cannot reach a log without a deliberate, visible cast.
 */

export type Level = "E" | "W" | "I" | "D" | "T";

export type Category =
  | "app"
  | "nav"
  | "atlas"
  | "socrate"
  | "store"
  | "llm"
  | "net"
  | "storage"
  | "pwa"
  | "i18n"
  | "diag";

declare const SAFE: unique symbol;
/** A string explicitly vouched content-free (an id/enum/code) — never decision content. */
export type SafeString = string & { readonly [SAFE]: true };
/** Assert a string is safe to log. Use ONLY for ids/enums/codes, never user content. */
export const safe = (s: string): SafeString => s as SafeString;

export type SafeValue = number | boolean | SafeString | undefined;
export type SafeContext = Record<string, SafeValue>;

/** One log line. Dense, short keys (docs/diagnostics.md §event schema). */
export interface DiagEvent {
  t: number; // ms since session start
  l: Level;
  c: Category;
  e: string; // event code (dot-namespaced)
  cid?: string; // correlation id
  d?: number; // duration ms
  x?: SafeContext; // safe structured context
}
