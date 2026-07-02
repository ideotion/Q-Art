"use client";

import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { localizedItemLabel, rankedPriorities } from "@/lib/qart";
import { fmt } from "@/lib/i18n/dict";
import { useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { ReadingView } from "./reading-view";
import { WeightingPanel } from "./weighting-panel";
import { ActionPlanEditor } from "./action-plan-editor";
import { ExportPanel } from "./export-panel";

/**
 * The synthesis: the initial question, then a genuine **reading** of the map
 * (concept.md §3.4/§3.6) — interpretation, a better question, a small step —
 * and the method's pivot: **start the next cycle on the reframed question**
 * (recursion). The action plan is structured here (front and centre in a
 * recursion cycle; a quiet disclosure in a first pass). Text-first, no node-graph.
 */
export function SynthesisView({ onNextCycle }: { onNextCycle?: () => void }) {
  const { ui, locale } = useLocale();
  const activeCase = useDecisionStore((s) => s.activeCase);
  const cycle = useDecisionStore((s) => s.activeCycle);
  const runSynthesis = useDecisionStore((s) => s.runSynthesis);
  const startNextCycle = useDecisionStore((s) => s.startNextCycle);

  // Persist the derived synthesis (croisements/keywords) onto the object.
  useEffect(() => {
    runSynthesis();
  }, [runSynthesis]);

  if (!cycle) return null;
  const priorities = rankedPriorities(cycle, 6);
  const cycleNumber = Math.max(1, (activeCase?.cycleIds.indexOf(cycle.id) ?? 0) + 1);
  const isRecursion = !!cycle.parentCycleId;
  const canRecurse = !!cycle.synthesis.reformulatedQuestion?.trim();

  const nextCycle = () => {
    startNextCycle();
    onNextCycle?.();
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-accent text-xs font-medium tracking-wide uppercase">
          {fmt(ui.cycleN, { n: cycleNumber })}
          {isRecursion ? <span className="text-muted"> · {ui.fromReframed}</span> : null}
        </p>
        <h3 className="text-muted mt-3 text-xs tracking-wide uppercase">{ui.initialQuestion}</h3>
        <p className="mt-1">{cycle.synthesis.initialQuestion || ui.none}</p>
      </div>

      <ReadingView />

      {canRecurse ? (
        <div className="border-accent/40 bg-accent/5 space-y-2 rounded-xl border p-4">
          <p className="text-muted text-sm">{ui.nextCycleHint}</p>
          <button
            type="button"
            onClick={nextCycle}
            className="bg-accent text-accent-foreground inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-medium"
          >
            {ui.nextCycle}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}

      {priorities.length > 0 ? (
        <details className="border-border rounded-lg border">
          <summary className="text-muted hover:text-foreground cursor-pointer px-4 py-3 text-sm font-medium">
            {ui.refineOptional}
          </summary>
          <div className="space-y-5 px-4 pt-1 pb-4">
            <WeightingPanel />
            <div>
              <h3 className="text-muted text-xs tracking-wide uppercase">{ui.priorities}</h3>
              <ul className="mt-2 space-y-1">
                {priorities.map((it, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-sm">
                    <span>{localizedItemLabel(it, locale)}</span>
                    <span className="text-accent tracking-tight">
                      <span className="sr-only">{`${it.weight}/5`}</span>
                      <span aria-hidden>{"●".repeat(it.weight)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      ) : null}

      {isRecursion ? (
        <div className="border-border border-t pt-4">
          <ActionPlanEditor />
        </div>
      ) : (
        <details className="border-border rounded-lg border">
          <summary className="text-muted hover:text-foreground cursor-pointer px-4 py-3 text-sm font-medium">
            {ui.actionPlan}
          </summary>
          <div className="space-y-4 px-4 pt-1 pb-4">
            <p className="text-muted text-xs">{ui.actionPlanHint}</p>
            <ActionPlanEditor />
          </div>
        </details>
      )}

      <ExportPanel />
    </section>
  );
}
