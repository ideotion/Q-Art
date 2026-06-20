"use client";

import { Check, X } from "lucide-react";
import { CARTES_DECK, RUBRIC_META, getBank } from "@/lib/qart";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";

/**
 * The spread: every card in the deck at a glance, with per-suit completeness, so
 * you can leap to any card. Plain buttons in a labelled grid — fully keyboard
 * operable.
 */
export function CartesSpread({
  current,
  onJump,
  onClose,
}: {
  current: number;
  onJump: (index: number) => void;
  onClose: () => void;
}) {
  const { ui } = useLocale();
  const loc = useLoc();
  const cycle = useDecisionStore((s) => s.activeCycle);

  const title = (i: number): string => {
    const card = CARTES_DECK[i];
    if (card.kind === "question") return ui.yourQuestion;
    if (card.kind === "synthesis") return ui.synthesis;
    return card.rubric ? loc(RUBRIC_META[card.rubric].label) : "";
  };

  const sub = (i: number): string => {
    const card = CARTES_DECK[i];
    if (card.kind !== "rubric" || !card.rubric) return "";
    const kept = cycle?.rubrics[card.rubric]?.checkedItems.length ?? 0;
    const total = getBank(card.rubric).items.length;
    return `${kept}/${total} · ${ui.kept}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{ui.yourDeck}</h2>
        <button
          type="button"
          onClick={onClose}
          className="border-border text-muted hover:text-foreground inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-sm"
        >
          <X className="size-4" aria-hidden />
          {ui.close}
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CARTES_DECK.map((card, i) => {
          const active = i === current;
          const kept =
            card.kind === "rubric" && card.rubric
              ? (cycle?.rubrics[card.rubric]?.checkedItems.length ?? 0) > 0
              : false;
          return (
            <li key={card.id}>
              <button
                type="button"
                onClick={() => {
                  onJump(i);
                  onClose();
                }}
                aria-current={active ? "true" : undefined}
                className={`flex min-h-20 w-full flex-col justify-between rounded-xl border p-3 text-left text-sm transition-colors ${
                  active
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card hover:border-accent"
                }`}
              >
                <span className="flex items-center gap-1 font-medium">
                  {kept ? <Check className="text-accent size-3.5 shrink-0" aria-hidden /> : null}
                  {title(i)}
                </span>
                <span className="text-muted text-xs">{sub(i)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
