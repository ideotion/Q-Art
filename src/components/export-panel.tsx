"use client";

import { useRef, useState } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { dossierFilename, getRepository, parseDossier, serializeDossier } from "@/lib/storage";
import { useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { diag } from "@/lib/diag";

const BTN =
  "border-border text-foreground inline-flex min-h-12 items-center gap-1.5 rounded-full border px-4 text-sm disabled:opacity-40";

/**
 * Export / import / delete — the data-subject rights, first-class from 0.1.0
 * (data-policy.md). The dossier is a portable, versioned JSON the user owns.
 * Everything is local; nothing is sent anywhere.
 */
export function ExportPanel() {
  const { ui } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const reset = useDecisionStore((s) => s.reset);
  const [msg, setMsg] = useState<string | null>(null);

  const onExport = async () => {
    const data = await getRepository().exportAll();
    const blob = new Blob([serializeDossier(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = dossierFilename();
    a.click();
    URL.revokeObjectURL(url);
    diag("I", "storage", "atlas.export", { cases: data.cases.length });
  };

  const onImportFile = async (file: File) => {
    try {
      const data = parseDossier(await file.text());
      await getRepository().importAll(data);
      setMsg(ui.imported);
      diag("I", "storage", "store.migrate", { cases: data.cases.length });
    } catch {
      setMsg(ui.importFailed);
    }
  };

  const onDelete = async () => {
    if (!confirm(ui.confirmDelete)) return;
    await getRepository().clear();
    reset();
    setMsg(ui.deleteAll);
  };

  return (
    <section className="border-border space-y-3 border-t pt-4">
      <div>
        <h3 className="text-muted text-xs tracking-wide uppercase">{ui.yourData}</h3>
        <p className="text-muted mt-1 text-sm">{ui.dataHint}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onExport} className={BTN}>
          <Download className="size-4" aria-hidden />
          {ui.exportDossier}
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={BTN}>
          <Upload className="size-4" aria-hidden />
          {ui.importDossier}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label={ui.importDossier}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onImportFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={onDelete}
          className={`${BTN} text-foreground/80 hover:text-foreground`}
        >
          <Trash2 className="size-4" aria-hidden />
          {ui.deleteAll}
        </button>
      </div>
      {msg ? (
        <p className="text-muted text-sm" aria-live="polite">
          {msg}
        </p>
      ) : null}
    </section>
  );
}
