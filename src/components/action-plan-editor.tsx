"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ActionStep, ActionStepStatus } from "@/lib/qart";
import { fmt } from "@/lib/i18n/dict";
import { useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";
import { AutoTextarea } from "./text-field";

const STATUSES: ActionStepStatus[] = ["ready", "to_refine", "to_build"];

const FIELD =
  "border-border bg-background w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-accent";

/**
 * The structured action plan (concept.md §3.2 rubric 12): per step — action,
 * with whom, by when, an observable indicator, a status triage
 * (ready / to refine / to build), and a self-sabotage to watch. Built mainly in
 * the recursion cycle; "the best, not the perfect; small steps; a right to error."
 */
/** Stable fallback: a selector must not mint a fresh [] per call (re-render loop). */
const NO_STEPS: ActionStep[] = [];

export function ActionPlanEditor() {
  const { ui } = useLocale();
  const steps = useDecisionStore((s) => s.activeCycle?.actionPlan?.steps) ?? NO_STEPS;
  const addActionStep = useDecisionStore((s) => s.addActionStep);
  const updateActionStep = useDecisionStore((s) => s.updateActionStep);
  const removeActionStep = useDecisionStore((s) => s.removeActionStep);

  const statusLabel: Record<ActionStepStatus, string> = {
    ready: ui.statusReady,
    to_refine: ui.statusRefine,
    to_build: ui.statusBuild,
  };

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-muted text-xs tracking-wide uppercase">{ui.actionPlan}</h3>
        <p className="text-muted mt-1 text-sm">{ui.actionPlanIntro}</p>
      </div>

      {steps.length > 0 ? (
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <StepEditor
              key={i}
              index={i}
              step={step}
              statusLabel={statusLabel}
              onChange={(patch) => updateActionStep(i, patch)}
              onRemove={() => removeActionStep(i)}
            />
          ))}
        </ol>
      ) : null}

      <button
        type="button"
        onClick={() => addActionStep()}
        className="border-border text-foreground inline-flex min-h-12 items-center gap-1.5 rounded-full border px-4 text-sm"
      >
        <Plus className="size-4" aria-hidden />
        {ui.addStep}
      </button>
    </section>
  );
}

function StepEditor({
  index,
  step,
  statusLabel,
  onChange,
  onRemove,
}: {
  index: number;
  step: ActionStep;
  statusLabel: Record<ActionStepStatus, string>;
  onChange: (patch: Partial<ActionStep>) => void;
  onRemove: () => void;
}) {
  const { ui } = useLocale();
  const n = index + 1;
  const id = (field: string) => `plan-step-${index}-${field}`;

  return (
    <li className="border-border space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted text-xs font-medium tracking-wide uppercase">
          {fmt(ui.stepN, { n })}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${ui.removeStep} — ${fmt(ui.stepN, { n })}`}
          className="text-muted hover:text-foreground inline-flex min-h-9 min-w-9 items-center justify-center rounded-full"
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>

      <AutoTextarea
        label={ui.stepAction}
        value={step.action}
        onChange={(v) => onChange({ action: v })}
        placeholder={ui.stepActionPlaceholder}
        minRows={2}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-muted block text-xs">{ui.stepWith}</span>
          <input
            id={id("with")}
            value={step.withWhom ?? ""}
            onChange={(e) => onChange({ withWhom: e.target.value })}
            className={FIELD}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted block text-xs">{ui.stepWhen}</span>
          <input
            id={id("when")}
            value={step.when ?? ""}
            onChange={(e) => onChange({ when: e.target.value })}
            className={FIELD}
          />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="text-muted block text-xs">{ui.stepIndicator}</span>
          <input
            id={id("indicator")}
            value={step.indicator ?? ""}
            onChange={(e) => onChange({ indicator: e.target.value })}
            className={FIELD}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted block text-xs">{ui.stepSabotage}</span>
          <input
            id={id("sabotage")}
            value={step.sabotageWatch ?? ""}
            onChange={(e) => onChange({ sabotageWatch: e.target.value })}
            className={FIELD}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted block text-xs">{ui.stepStatus}</span>
          <select
            id={id("status")}
            value={step.status ?? "to_refine"}
            onChange={(e) => onChange({ status: e.target.value as ActionStepStatus })}
            className={FIELD}
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {statusLabel[st]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </li>
  );
}
