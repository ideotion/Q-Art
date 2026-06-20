"use client";

import { Minus, Plus } from "lucide-react";
import type { Weight } from "@/lib/qart";

const WEIGHTS: Weight[] = [1, 2, 3, 4, 5];

/**
 * Relative-importance weighting ("billes"), 1–5. Non-drag and keyboard-operable
 * (WCAG 2.2 SC 2.5.7), 48px targets (SC 2.5.5). The weighting *method* is still
 * under test (MaxDiff vs constant-sum, ADR-005); this is the stepper-accessible
 * path that any method must provide.
 */
export function WeightStepper({
  value,
  onChange,
  label,
}: {
  value: Weight;
  onChange: (w: Weight) => void;
  label: string;
}) {
  const set = (w: number) => onChange(Math.max(1, Math.min(5, w)) as Weight);
  return (
    <div role="group" aria-label={label} className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => set(value - 1)}
        disabled={value <= 1}
        aria-label={`${label} −`}
        className="border-border grid size-12 place-items-center rounded-full border disabled:opacity-40"
      >
        <Minus className="size-4" aria-hidden />
      </button>
      {WEIGHTS.map((w) => (
        <button
          key={w}
          type="button"
          onClick={() => onChange(w)}
          aria-label={`${label} ${w}/5`}
          aria-pressed={w === value}
          className="grid size-12 place-items-center"
        >
          <span
            className={`block rounded-full ${w <= value ? "bg-accent size-4" : "bg-border size-2.5"}`}
          />
        </button>
      ))}
      <button
        type="button"
        onClick={() => set(value + 1)}
        disabled={value >= 5}
        aria-label={`${label} +`}
        className="border-border grid size-12 place-items-center rounded-full border disabled:opacity-40"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
