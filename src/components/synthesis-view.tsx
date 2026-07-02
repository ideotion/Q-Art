"use client";

import { useEffect } from "react";
import { localizedItemLabel, rankedPriorities } from "@/lib/qart";
import { useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { ReadingView } from "./reading-view";
import { WeightingPanel } from "./weighting-panel";
import { ExportPanel } from "./export-panel";

/**
 * The synthesis: the initial question, then a genuine **reading** of the map
 * (concept.md §3.4/§3.6) — interpretation, a better question, a small step.
 * Weighting is demoted to an optional refinement; the help is in the reading,
 * not in the grading. Text-first, no node-graph.
 */
export function SynthesisView() {
  const { ui, locale } = useLocale();
  const cycle = useDecisionStore((s) => s.activeCycle);
  const runSynthesis = useDecisionStore((s) => s.runSynthesis);

  // Persist the derived synthesis (croisements/keywords) onto the object.
  useEffect(() => {
    runSynthesis();
  }, [runSynthesis]);

  if (!cycle) return null;
  const priorities = rankedPriorities(cycle, 6);

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-muted text-xs tracking-wide uppercase">{ui.initialQuestion}</h3>
        <p className="mt-1">{cycle.synthesis.initialQuestion || ui.none}</p>
      </div>

      <ReadingView />

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

      <p className="text-muted border-border border-t pt-3 text-xs">{ui.actionPlanHint}</p>

      <ExportPanel />
    </section>
  );
}
