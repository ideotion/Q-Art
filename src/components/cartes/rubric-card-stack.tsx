"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { getBank, RUBRIC_META, type RubricKey } from "@/lib/qart";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { diag, safe } from "@/lib/diag";
import { AutoTextarea } from "../text-field";

const fmt = (t: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), t);

/**
 * A rubric, dealt as a card stack: one bank item at a time, kept or skipped.
 * Touch/gesture is a later enhancement — the keep/skip buttons + Tab/Enter are
 * the required non-drag, keyboard-complete path (WCAG 2.2 SC 2.5.7). Kept items
 * land in the same decision object; weighting is refined later in the synthesis.
 */
export function RubricCardStack({ rubric }: { rubric: RubricKey }) {
  const { ui } = useLocale();
  const loc = useLoc();
  const bank = getBank(rubric);
  const entry = useDecisionStore((s) => s.activeCycle?.rubrics[rubric]);
  const toggleItem = useDecisionStore((s) => s.toggleItem);
  const setFreeText = useDecisionStore((s) => s.setFreeText);

  const [idx, setIdx] = useState(0);
  const items = bank.items;
  const checked = new Set((entry?.checkedItems ?? []).map((ci) => ci.itemId));
  const keptCount = entry?.checkedItems.length ?? 0;

  const item = items[idx];
  const isKept = item ? checked.has(item.id) : false;
  const atEnd = idx >= items.length;

  const advance = () => setIdx((i) => Math.min(i + 1, items.length));

  const keep = () => {
    if (!item) return;
    const text = loc(item.label);
    if (!checked.has(item.id)) toggleItem(rubric, { id: item.id, label: text });
    diag("D", "cartes", "cartes.card.keep", { rubric: safe(rubric) });
    advance();
  };
  const skip = () => {
    diag("D", "cartes", "cartes.card.skip", { rubric: safe(rubric) });
    advance();
  };

  return (
    <div className="space-y-4">
      <p className="text-muted text-xs">{loc(RUBRIC_META[rubric].intent)}</p>

      {atEnd ? (
        <div className="border-border bg-card grid min-h-40 place-items-center rounded-2xl border border-dashed p-6 text-center">
          <div className="space-y-3">
            <p className="text-sm">{ui.allCardsSeen}</p>
            <p className="text-muted text-xs">
              {fmt(ui.deckProgress, { a: keptCount, b: items.length })} · {ui.kept}
            </p>
            {keptCount > 0 || idx > 0 ? (
              <button
                type="button"
                onClick={() => setIdx(0)}
                className="border-border text-muted hover:text-foreground inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-xs"
              >
                <RotateCcw className="size-3.5" aria-hidden />
                {ui.restart}
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <p className="text-muted text-xs">{fmt(ui.cardOf, { a: idx + 1, b: items.length })}</p>
          <article
            key={item.id}
            className="card-in border-border bg-card flex min-h-40 flex-col justify-between gap-4 rounded-2xl border p-6 shadow-sm"
          >
            <p className="text-lg leading-snug font-medium text-balance">{loc(item.label)}</p>
            {isKept ? (
              <span className="text-accent inline-flex items-center gap-1 text-xs font-medium">
                <Check className="size-3.5" aria-hidden />
                {ui.kept}
              </span>
            ) : null}
          </article>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={skip}
              className="border-border text-foreground inline-flex min-h-12 items-center gap-1.5 rounded-full border px-6 text-sm"
            >
              <X className="size-4" aria-hidden />
              {ui.skip}
            </button>
            <button
              type="button"
              onClick={keep}
              aria-pressed={isKept}
              className="bg-accent text-accent-foreground inline-flex min-h-12 items-center gap-1.5 rounded-full px-6 text-sm font-medium"
            >
              <Check className="size-4" aria-hidden />
              {ui.keep}
            </button>
          </div>
        </>
      )}

      <AutoTextarea
        label={ui.freeText}
        value={entry?.freeText ?? ""}
        onChange={(v) => setFreeText(rubric, v)}
        placeholder={ui.freeTextPlaceholder}
      />
    </div>
  );
}
