"use client";

import { useEffect, useRef } from "react";
import { useMachine } from "@xstate/react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { SOCRATE_TREE } from "@/lib/qart";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { flowMachine } from "@/store/flow-machine";
import { AppHeader } from "@/components/app-header";
import { RubricEditor } from "@/components/rubric-editor";
import { SynthesisView } from "@/components/synthesis-view";
import { AutoTextarea } from "@/components/text-field";

const PRIMARY =
  "bg-accent text-accent-foreground inline-flex min-h-12 items-center gap-1 rounded-full px-5 text-sm font-medium disabled:opacity-40";
const SECONDARY =
  "border-border text-foreground inline-flex min-h-12 items-center gap-1 rounded-full border px-5 text-sm disabled:opacity-40";

export default function SocratePage() {
  const { ui } = useLocale();
  const loc = useLoc();
  const [snap, send] = useMachine(flowMachine);
  const startCase = useDecisionStore((s) => s.startCase);
  const reset = useDecisionStore((s) => s.reset);
  const question = useDecisionStore((s) => s.activeCycle?.question ?? "");
  const setQuestion = useDecisionStore((s) => s.setQuestion);
  const reformulation = useDecisionStore(
    (s) => s.activeCycle?.synthesis.reformulatedQuestion ?? "",
  );
  const setReformulation = useDecisionStore((s) => s.setReformulation);
  const init = useRef(false);

  useEffect(() => {
    if (init.current) return;
    init.current = true;
    reset();
    startCase({ mode: "socrate" });
    send({ type: "START", mode: "socrate" });
  }, [reset, startCase, send]);

  const nodeId = snap.context.nodeId;
  const node = nodeId ? SOCRATE_TREE.nodes[nodeId] : undefined;
  const atStart = nodeId === SOCRATE_TREE.rootId;
  const atEnd = node ? node.next === undefined : false;

  const restart = () => {
    reset();
    startCase({ mode: "socrate" });
    send({ type: "RESET" });
    send({ type: "START", mode: "socrate" });
  };

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
        {node ? (
          <>
            <h1 className="text-xl leading-snug font-medium text-balance">{loc(node.prompt)}</h1>
            {node.help ? <p className="text-muted mt-2 text-sm italic">{loc(node.help)}</p> : null}

            <div className="mt-6">
              {node.kind === "question" ? (
                <AutoTextarea
                  value={question}
                  onChange={setQuestion}
                  placeholder={ui.questionPlaceholder}
                  minRows={3}
                />
              ) : null}
              {node.kind === "rubric" && node.rubric ? <RubricEditor rubric={node.rubric} /> : null}
              {node.kind === "reframe" ? (
                <AutoTextarea
                  value={reformulation}
                  onChange={setReformulation}
                  placeholder={ui.reframePlaceholder}
                  minRows={3}
                />
              ) : null}
              {node.kind === "summary" ? <SynthesisView /> : null}
            </div>
          </>
        ) : null}
      </main>

      <nav className="border-border bg-background sticky bottom-0 mx-auto flex w-full max-w-2xl items-center justify-between gap-3 border-t px-5 py-3">
        <button
          type="button"
          onClick={() => send({ type: "PREV" })}
          disabled={atStart}
          className={SECONDARY}
        >
          <ChevronLeft className="size-4" aria-hidden />
          {ui.back}
        </button>
        {atEnd ? (
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
