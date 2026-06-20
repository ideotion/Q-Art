"use client";

import { useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { AutoTextarea } from "./text-field";

/**
 * Text-first synthesis (design.md §4): the initial question, the highest-weighted
 * items the map surfaced, and the reframing editor. No node-graph in v1.
 */
export function SynthesisView() {
  const { ui } = useLocale();
  const cycle = useDecisionStore((s) => s.activeCycle);
  const setReformulation = useDecisionStore((s) => s.setReformulation);
  if (!cycle) return null;

  const priorities = Object.values(cycle.rubrics)
    .flatMap((e) => e?.checkedItems ?? [])
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6);

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-muted text-xs tracking-wide uppercase">{ui.initialQuestion}</h3>
        <p className="mt-1">{cycle.synthesis.initialQuestion || ui.none}</p>
      </div>

      {priorities.length > 0 ? (
        <div>
          <h3 className="text-muted text-xs tracking-wide uppercase">{ui.importance}</h3>
          <ul className="mt-2 space-y-1">
            {priorities.map((it, i) => (
              <li key={i} className="flex items-center justify-between gap-3 text-sm">
                <span>{it.label}</span>
                <span className="text-accent tracking-tight" aria-label={`${it.weight}/5`}>
                  {"●".repeat(it.weight)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <h3 className="text-muted mb-1 text-xs tracking-wide uppercase">
          {ui.reformulatedQuestion}
        </h3>
        <AutoTextarea
          value={cycle.synthesis.reformulatedQuestion ?? ""}
          onChange={setReformulation}
          placeholder={ui.reframePlaceholder}
        />
      </div>

      <p className="text-muted border-border border-t pt-3 text-xs">{ui.actionPlanHint}</p>
    </section>
  );
}
