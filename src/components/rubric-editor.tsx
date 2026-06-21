"use client";

import { Check } from "lucide-react";
import { getBank, type RubricKey } from "@/lib/qart";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { AutoTextarea } from "./text-field";

/**
 * Edits one rubric of the shared decision object — used by both Atlas and Socrate.
 * Ticking is enough: it's reflection, not a survey, so there's no grade on every
 * item (weighting is an optional pass in the synthesis). Free text always open.
 */
export function RubricEditor({ rubric }: { rubric: RubricKey }) {
  const { ui } = useLocale();
  const loc = useLoc();
  const bank = getBank(rubric);
  const entry = useDecisionStore((s) => s.activeCycle?.rubrics[rubric]);
  const toggleItem = useDecisionStore((s) => s.toggleItem);
  const setFreeText = useDecisionStore((s) => s.setFreeText);

  const checked = new Map((entry?.checkedItems ?? []).map((ci) => [ci.itemId, ci] as const));

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {bank.items.map((item) => {
          const isChecked = checked.has(item.id);
          const text = loc(item.label);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggleItem(rubric, { id: item.id, label: text })}
                aria-pressed={isChecked}
                className={`flex min-h-12 w-full items-center gap-2 rounded-lg border px-3 text-left text-sm transition-colors ${
                  isChecked
                    ? "border-accent bg-accent/10"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                    isChecked ? "border-accent bg-accent text-accent-foreground" : "border-border"
                  }`}
                >
                  {isChecked ? <Check className="size-3.5" aria-hidden /> : null}
                </span>
                <span>{text}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <AutoTextarea
        label={ui.freeText}
        value={entry?.freeText ?? ""}
        onChange={(v) => setFreeText(rubric, v)}
        placeholder={ui.freeTextPlaceholder}
      />
    </div>
  );
}
