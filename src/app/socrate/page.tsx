"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { RUBRIC_META, SOCRATE_TREE } from "@/lib/qart";
import { fmt } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore, useGuiSession } from "@/store";
import { withViewTransition } from "@/lib/view-transition";
import { AppHeader } from "@/components/app-header";
import { RubricEditor } from "@/components/rubric-editor";
import { ReframeSuggestions } from "@/components/reading-view";
import { SynthesisView } from "@/components/synthesis-view";
import { AutoTextarea } from "@/components/text-field";

const PRIMARY =
  "bg-accent text-accent-foreground inline-flex min-h-12 items-center gap-1 rounded-full px-5 text-sm font-medium disabled:opacity-40";
const SECONDARY =
  "border-border text-foreground inline-flex min-h-12 items-center gap-1 rounded-full border px-5 text-sm disabled:opacity-40";

export default function SocratePage() {
  const { ui } = useLocale();
  const loc = useLoc();
  const { snap, send, restart, ready } = useGuiSession("socrate");
  const question = useDecisionStore((s) => s.activeCycle?.question ?? "");
  const setQuestion = useDecisionStore((s) => s.setQuestion);
  const reformulation = useDecisionStore(
    (s) => s.activeCycle?.synthesis.reformulatedQuestion ?? "",
  );
  const setReformulation = useDecisionStore((s) => s.setReformulation);

  const nodeId = snap.context.nodeId;
  const node = nodeId ? SOCRATE_TREE.nodes[nodeId] : undefined;
  const atStart = !nodeId || nodeId === SOCRATE_TREE.rootId; // pre-init frame: Back stays disabled
  const atEnd = node ? node.next === undefined : false;
  const step = nodeId ? SOCRATE_TREE.order.indexOf(nodeId) + 1 : 0;
  const total = SOCRATE_TREE.order.length;

  // One calm prompt at a time, with a smooth View Transition between steps.
  const next = () => withViewTransition(() => send({ type: "NEXT" }));
  const prev = () => withViewTransition(() => send({ type: "PREV" }));

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
        {ready && node ? (
          <>
            <p className="text-muted mb-3 text-xs">{fmt(ui.stepOf, { a: step, b: total })}</p>
            <h1 className="text-xl leading-snug font-medium text-balance">{loc(node.prompt)}</h1>
            {node.help ? <p className="text-muted mt-2 text-sm italic">{loc(node.help)}</p> : null}
            {node.kind === "rubric" && node.rubric ? <FollowUps rubric={node.rubric} /> : null}

            <div className="mt-6">
              {node.kind === "question" ? (
                <AutoTextarea
                  value={question}
                  onChange={setQuestion}
                  placeholder={ui.questionPlaceholder}
                  ariaLabel={ui.yourQuestion}
                  minRows={3}
                />
              ) : null}
              {node.kind === "rubric" && node.rubric ? <RubricEditor rubric={node.rubric} /> : null}
              {node.kind === "reframe" ? (
                <div>
                  <ReframeSuggestions onPick={setReformulation} />
                  <div className="mt-3">
                    <AutoTextarea
                      value={reformulation}
                      onChange={setReformulation}
                      placeholder={ui.reframePlaceholder}
                      ariaLabel={ui.reformulatedQuestion}
                      minRows={3}
                    />
                  </div>
                </div>
              ) : null}
              {node.kind === "summary" ? (
                <SynthesisView
                  onNextCycle={() => send({ type: "GOTO_NODE", id: SOCRATE_TREE.rootId })}
                />
              ) : null}
            </div>
          </>
        ) : null}
      </main>

      <nav
        aria-label={ui.steps}
        className="border-border bg-background sticky bottom-0 mx-auto flex w-full max-w-2xl items-center justify-between gap-3 border-t px-5 py-3"
      >
        <button type="button" onClick={prev} disabled={atStart} className={SECONDARY}>
          <ChevronLeft className="size-4" aria-hidden />
          {ui.back}
        </button>
        {atEnd ? (
          <button type="button" onClick={restart} className={PRIMARY}>
            <RotateCcw className="size-4" aria-hidden />
            {ui.restart}
          </button>
        ) : (
          <button type="button" onClick={next} className={PRIMARY}>
            {ui.next}
            <ChevronRight className="size-4" aria-hidden />
          </button>
        )}
      </nav>
    </div>
  );
}

/** The rubric's further open prompts — the maieutic follow-ups beyond the headline question. */
function FollowUps({ rubric }: { rubric: keyof typeof RUBRIC_META }) {
  const { ui } = useLocale();
  const loc = useLoc();
  const followUps = RUBRIC_META[rubric].openPrompts.slice(1);
  if (followUps.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-muted text-xs font-medium tracking-wide uppercase">{ui.alsoAsk}</p>
      <ul className="text-muted mt-1.5 list-disc space-y-1 ps-5 text-sm">
        {followUps.map((q, i) => (
          <li key={i}>{loc(q)}</li>
        ))}
      </ul>
    </div>
  );
}
