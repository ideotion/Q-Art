"use client";

import { Check } from "lucide-react";
import { getBank, type RubricKey } from "@/lib/qart";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { AutoTextarea } from "./text-field";
import { WeightStepper } from "./weight-stepper";

/** Edits one rubric of the shared decision object — used by BOTH doors. */
export function RubricEditor({ rubric }: { rubric: RubricKey }) {
  const { ui } = useLocale();
  const loc = useLoc();
  const bank = getBank(rubric);
  const entry = useDecisionStore((s) => s.activeCycle?.rubrics[rubric]);
  const toggleItem = useDecisionStore((s) => s.toggleItem);
  const setItemWeight = useDecisionStore((s) => s.setItemWeight);
  const setFreeText = useDecisionStore((s) => s.setFreeText);

  const checked = new Map((entry?.checkedItems ?? []).map((ci) => [ci.itemId, ci] as const));

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {bank.items.map((item) => {
          const ci = checked.get(item.id);
          const text = loc(item.label);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggleItem(rubric, { id: item.id, label: text })}
                aria-pressed={Boolean(ci)}
                className={`flex min-h-12 w-full items-center gap-2 rounded-lg border px-3 text-left text-sm transition-colors ${
                  ci
                    ? "border-accent bg-accent/10"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                    ci ? "border-accent bg-accent text-accent-foreground" : "border-border"
                  }`}
                >
                  {ci ? <Check className="size-3.5" aria-hidden /> : null}
                </span>
                <span>{text}</span>
              </button>
              {ci ? (
                <div className="mt-1 pl-7">
                  <WeightStepper
                    label={ui.importance}
                    value={ci.weight}
                    onChange={(w) => setItemWeight(rubric, { id: item.id, label: text }, w)}
                  />
                </div>
              ) : null}
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
