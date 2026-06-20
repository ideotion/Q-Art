/**
 * Redaction pass (Law #2): strip secret/PII-shaped substrings before any write
 * or export — belt-and-braces on top of the typed sink.
 */
import type { SafeContext, SafeString } from "./types";

export const REDACTED = "[redacted]";

const PATTERNS: RegExp[] = [
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, // email
  /\b(?:sk|pk|api|key|token|bearer)[-_ ]?[A-Za-z0-9]{8,}\b/gi, // token/key-ish
  /\b[A-Fa-f0-9]{32,}\b/g, // long hex (keys/hashes)
];

export function redact(s: string): string {
  return PATTERNS.reduce((acc, re) => acc.replace(re, REDACTED), s);
}

export function redactContext(x?: SafeContext): SafeContext | undefined {
  if (!x) return undefined;
  const out: SafeContext = {};
  for (const [k, v] of Object.entries(x)) {
    out[k] = typeof v === "string" ? (redact(v) as SafeString) : v;
  }
  return out;
}
