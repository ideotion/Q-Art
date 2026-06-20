"use client";

import { useEffect } from "react";
import { computeCrossLinks, rankedPriorities, RUBRIC_META } from "@/lib/qart";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { AutoTextarea } from "./text-field";
import { WeightingPanel } from "./weighting-panel";

const fmt = (t: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), t);

/**
 * Text-first synthesis (design.md §4): the initial question, the weighting pass,
 * the croisements (themes recurring across rubrics), the highest-weighted items,
 * and the reframing editor. No node-graph in v1 — always a text restatement.
 */
export function SynthesisView() {
  const { ui } = useLocale();
  const loc = useLoc();
  const cycle = useDecisionStore((s) => s.activeCycle);
  const setReformulation = useDecisionStore((s) => s.setReformulation);
  const runSynthesis = useDecisionStore((s) => s.runSynthesis);

  // Persist the derived synthesis onto the object so the dossier is faithful even
  // before export. Display below is computed live so it tracks re-weighting.
  useEffect(() => {
    runSynthesis();
  }, [runSynthesis]);

  if (!cycle) return null;

  const priorities = rankedPriorities(cycle, 6);
  const crossLinks = computeCrossLinks(cycle);

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-muted text-xs tracking-wide uppercase">{ui.initialQuestion}</h3>
        <p className="mt-1">{cycle.synthesis.initialQuestion || ui.none}</p>
      </div>

      <WeightingPanel />

      <div>
        <h3 className="text-muted text-xs tracking-wide uppercase">{ui.crossLinks}</h3>
        <p className="text-muted mt-1 text-sm">{ui.crossLinksHint}</p>
        {crossLinks.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {crossLinks.map((cl) => (
              <li key={cl.theme} className="text-sm">
                <span className="font-medium">{cl.theme}</span>
                <span className="text-muted">
                  {" — "}
                  {fmt(ui.crossLinksAcross, { n: cl.rubrics.length })}:{" "}
                  {cl.rubrics.map((r) => loc(RUBRIC_META[r].label)).join(", ")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mt-2 text-sm italic">{ui.noCrossLinks}</p>
        )}
      </div>

      {priorities.length > 0 ? (
        <div>
          <h3 className="text-muted text-xs tracking-wide uppercase">{ui.priorities}</h3>
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
