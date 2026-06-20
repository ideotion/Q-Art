"use client";

import { Check, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/react";
import { useSaveStatus } from "@/store";

/** A quiet autosave status — reassurance that work is encrypted at rest, no nagging. */
export function SavedIndicator() {
  const { ui } = useLocale();
  const status = useSaveStatus((s) => s.status);
  if (status === "idle") return null;

  const saving = status === "saving";
  return (
    <span
      className="text-muted inline-flex items-center gap-1 text-xs"
      aria-live="polite"
      data-status={status}
    >
      {saving ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        <Check className="size-3.5" aria-hidden />
      )}
      {saving ? ui.saving : ui.saved}
    </span>
  );
}
