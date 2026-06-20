"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { bundleFile, diag, setDeepMode } from "@/lib/diag";
import { APP_VERSION, GIT_COMMIT } from "@/lib/version";
import { useLocale } from "@/lib/i18n/react";

/**
 * Diagnostics export (ADR-013). Downloads a manifest-first, content-free bundle
 * the user can share to help fix a bug — codes/counts/timings only, never words.
 */
export function DiagnosticsPanel() {
  const { ui } = useLocale();
  const [deep, setDeep] = useState(false);

  const download = () => {
    const { filename, json } = bundleFile({ appVersion: APP_VERSION, commit: GIT_COMMIT });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    diag("I", "diag", "diag.export");
  };

  const toggleDeep = () => {
    const v = !deep;
    setDeep(v);
    setDeepMode(v);
    diag("I", "diag", v ? "diag.deepmode.on" : "diag.deepmode.off");
  };

  return (
    <section className="border-border space-y-3 border-t pt-5">
      <div>
        <h2 className="font-medium">{ui.diagnostics}</h2>
        <p className="text-muted mt-1 text-sm">{ui.diagnosticsHint}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={download}
          className="border-border text-foreground inline-flex min-h-12 items-center gap-1.5 rounded-full border px-4 text-sm"
        >
          <Download className="size-4" aria-hidden />
          {ui.downloadDiag}
        </button>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={deep}
            onChange={toggleDeep}
            className="accent-accent size-4"
          />
          {ui.deepMode}
        </label>
      </div>
      <p className="text-muted text-xs">
        {ui.version}: {APP_VERSION}
        {GIT_COMMIT ? ` · ${GIT_COMMIT.slice(0, 7)}` : ""}
      </p>
    </section>
  );
}
