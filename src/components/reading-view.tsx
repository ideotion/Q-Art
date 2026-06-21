"use client";

import { ArrowRight } from "lucide-react";
import { RUBRIC_META, readCycle, type Insight, type ReframeSuggestion } from "@/lib/qart";
import type { UiDict } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { AutoTextarea } from "./text-field";

const fmt = (t: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), t);

/**
 * The reading: the deterministic "intelligence layer" rendered as plain, warm
 * prose (concept.md §3.6). It interprets the user's own words — it never advises —
 * then offers the pivot (a better question) and one small step.
 */
export function ReadingView() {
  const { ui } = useLocale();
  const loc = useLoc();
  const cycle = useDecisionStore((s) => s.activeCycle);
  const setReformulation = useDecisionStore((s) => s.setReformulation);
  const setFirstStep = useDecisionStore((s) => s.setFirstStep);
  if (!cycle) return null;

  const reading = readCycle(cycle);
  const reframeButtons = reading.reframes.filter((r) => r.kind !== "smallest_step");

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">{ui.reading}</h2>
        <p className="text-muted mt-1 text-sm">{ui.readingIntro}</p>
      </div>

      <div>
        <h3 className="text-muted text-xs tracking-wide uppercase">{ui.whatStandsOut}</h3>
        {reading.insights.length > 0 ? (
          <ul className="mt-3 space-y-4">
            {reading.insights.map((ins, i) => {
              const { title, body } = renderInsight(ins, ui, loc);
              return (
                <li key={i} className="border-accent/40 border-l-2 pl-4">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-muted mt-1 text-sm leading-relaxed">{body}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted mt-2 text-sm italic">{ui.emptyReading}</p>
        )}
      </div>

      <div>
        <h3 className="text-muted text-xs tracking-wide uppercase">{ui.betterQuestion}</h3>
        <p className="text-muted mt-1 text-sm">{ui.betterQuestionHint}</p>
        {reframeButtons.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {reframeButtons.map((r, i) => {
              const text = reframeText(r, ui);
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setReformulation(text)}
                    className="border-border hover:border-accent group flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors"
                  >
                    <span>{text}</span>
                    <span className="text-accent inline-flex shrink-0 items-center gap-1 text-xs">
                      {ui.useThis}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
        <div className="mt-3">
          <AutoTextarea
            value={cycle.synthesis.reformulatedQuestion ?? ""}
            onChange={setReformulation}
            placeholder={ui.reframePlaceholder}
            ariaLabel={ui.betterQuestion}
            minRows={2}
          />
        </div>
      </div>

      <div>
        <h3 className="text-muted text-xs tracking-wide uppercase">{ui.oneStep}</h3>
        <p className="text-muted mt-1 text-sm">{ui.oneStepHint}</p>
        <div className="mt-2">
          <AutoTextarea
            value={cycle.actionPlan?.steps[0]?.action ?? ""}
            onChange={setFirstStep}
            placeholder={ui.oneStepPlaceholder}
            ariaLabel={ui.oneStep}
            minRows={2}
          />
        </div>
      </div>
    </section>
  );
}

function renderInsight(
  ins: Insight,
  ui: UiDict,
  loc: (t: { en: string; fr: string }) => string,
): { title: string; body: string } {
  const a = ins.primary?.label ?? "";
  switch (ins.kind) {
    case "knot":
      return {
        title: ui.insightKnotTitle,
        body: fmt(ui.insightKnotBody, { theme: ins.theme ?? "", n: ins.rubrics?.length ?? 2 }),
      };
    case "tension":
      return {
        title: ui.insightTensionTitle,
        body: fmt(ui.insightTensionBody, { a, b: ins.secondary?.label ?? "" }),
      };
    case "role":
      return { title: ui.insightRoleTitle, body: fmt(ui.insightRoleBody, { a }) };
    case "sameness":
      return { title: ui.insightSamenessTitle, body: fmt(ui.insightSamenessBody, { a }) };
    case "payoff":
      return { title: ui.insightPayoffTitle, body: fmt(ui.insightPayoffBody, { a }) };
    case "belief":
      return { title: ui.insightBeliefTitle, body: fmt(ui.insightBeliefBody, { a }) };
    case "exception":
      return { title: ui.insightExceptionTitle, body: fmt(ui.insightExceptionBody, { a }) };
    case "gap": {
      const areas = (ins.rubrics ?? []).map((r) => loc(RUBRIC_META[r].label)).join(", ");
      return { title: ui.insightGapTitle, body: fmt(ui.insightGapBody, { areas }) };
    }
  }
}

function reframeText(r: ReframeSuggestion, ui: UiDict): string {
  const theme = r.theme ?? "";
  switch (r.kind) {
    case "overcome":
      return fmt(ui.reframeOvercome, { theme });
    case "need":
      return fmt(ui.reframeNeed, { theme });
    case "belief":
      return fmt(ui.reframeBelief, { theme });
    case "role":
      return ui.reframeRole;
    case "clarify":
      return ui.reframeClarify;
    case "smallest_step":
      return ui.reframeSmallestStep;
  }
}
