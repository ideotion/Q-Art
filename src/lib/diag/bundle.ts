/**
 * Downloadable diagnostics bundle (docs/diagnostics.md §Bundle). Manifest-first,
 * content-free by construction: only the structured event stream (ids/enums/
 * counts/codes) and the safe manifest. `safeToShare` is asserted true.
 */
import { buildManifest, getEvents, type DiagManifest } from "./diag";
import type { DiagEvent } from "./types";

export interface DiagBundle {
  manifest: DiagManifest;
  events: DiagEvent[];
}

export function buildBundle(meta?: { commit?: string; appVersion?: string }): DiagBundle {
  return { manifest: buildManifest(meta), events: [...getEvents()] };
}

/** A bundle plus a stable, commit-stamped filename, ready to download. */
export function bundleFile(meta?: { commit?: string; appVersion?: string }): {
  filename: string;
  json: string;
} {
  const bundle = buildBundle(meta);
  const stamp = bundle.manifest.commit ?? "dev";
  return {
    filename: `qart-diag-${stamp}-${Date.now()}.json`,
    json: JSON.stringify(bundle, null, 2),
  };
}
