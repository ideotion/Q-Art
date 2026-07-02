"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { BOARDS, RUBRIC_META } from "@/lib/qart";
import { fmt } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore, useGuiSession } from "@/store";
import { AppHeader } from "@/components/app-header";
import { RubricEditor } from "@/components/rubric-editor";
import { SynthesisView } from "@/components/synthesis-view";
import { AutoTextarea } from "@/components/text-field";
import { CommandPalette } from "@/components/atlas/command-palette";

const PRIMARY =
  "bg-accent text-accent-foreground inline-flex min-h-12 items-center gap-1 rounded-full px-5 text-sm font-medium disabled:opacity-40";
const SECONDARY =
  "border-border text-foreground inline-flex min-h-12 items-center gap-1 rounded-full border px-5 text-sm disabled:opacity-40";

const isTyping = (el: EventTarget | null): boolean => {
  const t = el as HTMLElement | null;
  const tag = t?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable === true;
};

export default function AtlasPage() {
  const { ui } = useLocale();
  const loc = useLoc();
  const { snap, send, restart, ready } = useGuiSession("atlas");
  const question = useDecisionStore((s) => s.activeCycle?.question ?? "");
  const setQuestion = useDecisionStore((s) => s.setQuestion);

  const idx = snap.context.boardIndex;
  const board = BOARDS[idx];
  const isLast = idx >= BOARDS.length - 1;

  // Keyboard shortcuts: ←/→ walk the boards (when not typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector("dialog[open]")) return; // e.g. the ⌘K palette
      if (e.key === "ArrowRight") send({ type: "NEXT" });
      else if (e.key === "ArrowLeft") send({ type: "PREV" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [send]);

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        {!ready ? null : (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-muted text-xs">
                {fmt(ui.progress, { a: idx + 1, b: BOARDS.length })}
              </p>
              <CommandPalette onJump={(i) => send({ type: "GOTO_BOARD", index: i })} />
            </div>
            <h1 className="mt-1 text-xl font-medium">{loc(board.title)}</h1>

            <div className="mt-6 space-y-8">
              {board.includesQuestion ? (
                <AutoTextarea
                  label={ui.yourQuestion}
                  value={question}
                  onChange={setQuestion}
                  placeholder={ui.questionPlaceholder}
                />
              ) : null}

              {board.rubrics.map((key) => (
                <section key={key} className="space-y-3">
                  <div>
                    <h2 className="font-medium">{loc(RUBRIC_META[key].label)}</h2>
                    <p className="text-muted text-sm">{loc(RUBRIC_META[key].intent)}</p>
                  </div>
                  <RubricEditor rubric={key} />
                </section>
              ))}

              {board.isSynthesis ? <SynthesisView /> : null}
              {board.includesActionPlan ? (
                <p className="text-muted text-sm">{ui.actionPlanHint}</p>
              ) : null}
            </div>
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
