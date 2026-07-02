"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, RotateCcw } from "lucide-react";
import { CARTES_DECK, RUBRIC_META } from "@/lib/qart";
import { fmt } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore, useGuiSession } from "@/store";
import { AppHeader } from "@/components/app-header";
import { SynthesisView } from "@/components/synthesis-view";
import { AutoTextarea } from "@/components/text-field";
import { RubricCardStack } from "@/components/cartes/rubric-card-stack";
import { CartesSpread } from "@/components/cartes/cartes-spread";

const PRIMARY =
  "bg-accent text-accent-foreground inline-flex min-h-12 items-center gap-1 rounded-full px-5 text-sm font-medium disabled:opacity-40";
const SECONDARY =
  "border-border text-foreground inline-flex min-h-12 items-center gap-1 rounded-full border px-5 text-sm disabled:opacity-40";

export default function CartesPage() {
  const { ui } = useLocale();
  const loc = useLoc();
  const { snap, send, restart, ready } = useGuiSession("cartes");
  const question = useDecisionStore((s) => s.activeCycle?.question ?? "");
  const setQuestion = useDecisionStore((s) => s.setQuestion);
  const [spread, setSpread] = useState(false);
  const spreadToggleRef = useRef<HTMLButtonElement>(null);
  const closeSpread = () => {
    setSpread(false);
    // Return focus to the control that opened the spread (no drop to <body>).
    requestAnimationFrame(() => spreadToggleRef.current?.focus());
  };

  const idx = snap.context.cardIndex;
  const card = CARTES_DECK[idx];
  const isLast = idx >= CARTES_DECK.length - 1;

  const heading =
    card.kind === "question"
      ? ui.yourQuestion
      : card.kind === "synthesis"
        ? ui.synthesis
        : card.rubric
          ? loc(RUBRIC_META[card.rubric].label)
          : "";

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        {!ready ? null : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-muted text-xs">
                {fmt(ui.deckProgress, { a: idx + 1, b: CARTES_DECK.length })}
              </p>
              <button
                ref={spreadToggleRef}
                type="button"
                onClick={() => setSpread((v) => !v)}
                aria-expanded={spread}
                className="border-border text-muted hover:text-foreground inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs"
              >
                <LayoutGrid className="size-3.5" aria-hidden />
                {ui.spread}
              </button>
            </div>

            {spread ? (
              <div className="mt-4">
                <CartesSpread
                  current={idx}
                  onJump={(i) => send({ type: "GOTO_CARD", index: i })}
                  onClose={closeSpread}
                />
              </div>
            ) : (
              <div className="mt-3">
                <h1 className="text-xl font-medium">{heading}</h1>
                <div className="mt-5">
                  {card.kind === "question" ? (
                    <AutoTextarea
                      value={question}
                      onChange={setQuestion}
                      placeholder={ui.questionPlaceholder}
                      ariaLabel={ui.yourQuestion}
                      minRows={3}
                    />
                  ) : null}
                  {card.kind === "rubric" && card.rubric ? (
                    <RubricCardStack key={card.rubric} rubric={card.rubric} />
                  ) : null}
                  {card.kind === "synthesis" ? <SynthesisView /> : null}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <nav
        aria-label={ui.steps}
        className="border-border bg-background sticky bottom-0 mx-auto flex w-full max-w-2xl items-center justify-between gap-3 border-t px-5 py-3"
      >
        <button
          type="button"
          onClick={() => send({ type: "PREV" })}
          disabled={idx === 0}
          className={SECONDARY}
        >
          <ChevronLeft className="size-4" aria-hidden />
          {ui.back}
        </button>
        {isLast ? (
          <button type="button" onClick={restart} className={PRIMARY}>
            <RotateCcw className="size-4" aria-hidden />
            {ui.restart}
          </button>
        ) : (
          <button type="button" onClick={() => send({ type: "NEXT" })} className={PRIMARY}>
            {ui.next}
            <ChevronRight className="size-4" aria-hidden />
          </button>
        )}
      </nav>
    </div>
  );
}
