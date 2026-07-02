"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  MARBLE_POOL,
  WEIGHT_METHODS,
  allocationToWeights,
  localizedItemLabel,
  maxdiffSets,
  maxdiffWeights,
  weightsToAllocation,
  type RubricKey,
  type Weight,
  type WeightMethod,
} from "@/lib/qart";
import { fmt } from "@/lib/i18n/dict";
import { useLocale } from "@/lib/i18n/react";
import { useDecisionStore, type ItemRef, type WeightUpdate } from "@/store";
import { WeightStepper } from "./weight-stepper";

const STORAGE_KEY = "qart.weightMethod";

interface PanelItem {
  key: string;
  rubric: RubricKey;
  ref: ItemRef;
  label: string;
  weight: Weight;
}

const SEG_ON = "bg-accent text-accent-foreground";
const SEG_OFF = "text-muted hover:text-foreground";

const isMethod = (m: string | null): m is WeightMethod =>
  m !== null && (WEIGHT_METHODS as readonly string[]).includes(m);

/**
 * The weighting pass (ADR-005). One panel, three selectable methods over every
 * checked item in the cycle — direct steppers, MaxDiff (most/least), and
 * constant-sum marbles. Each method has a non-drag, keyboard path (SC 2.5.7),
 * every control is named after the item it weighs (SC 1.3.1/2.4.6), and each
 * folds its result back into the canonical 1–5 billes. The chosen method is
 * recorded content-free for the later A/B and remembered across sessions.
 */
export function WeightingPanel() {
  const { ui, locale } = useLocale();
  const cycle = useDecisionStore((s) => s.activeCycle);
  const setWeightMethod = useDecisionStore((s) => s.setWeightMethod);

  // Apply the remembered method to a cycle that hasn't chosen one yet
  // (post-mount: the preference lives in localStorage).
  const cycleId = cycle?.id;
  const hasMethod = !!cycle?.weightMethod;
  useEffect(() => {
    if (!cycleId || hasMethod) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isMethod(saved) && saved !== "stepper") setWeightMethod(saved);
    } catch {
      /* ignore */
    }
  }, [cycleId, hasMethod, setWeightMethod]);

  const items: PanelItem[] = useMemo(() => {
    if (!cycle) return [];
    const out: PanelItem[] = [];
    for (const [rubric, entry] of Object.entries(cycle.rubrics)) {
      for (const ci of entry?.checkedItems ?? []) {
        out.push({
          key: `${rubric}::${ci.itemId ?? ci.label}`,
          rubric: rubric as RubricKey,
          ref: { id: ci.itemId, label: ci.label },
          label: localizedItemLabel(ci, locale),
          weight: ci.weight,
        });
      }
    }
    return out;
  }, [cycle, locale]);

  if (!cycle) return null;
  const method: WeightMethod = cycle.weightMethod ?? "stepper";
  // Remount the stateful panels when the item *set* changes, not just its size.
  const setSignature = items.map((i) => i.key).join("|");

  const pick = (m: WeightMethod) => {
    setWeightMethod(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* ignore */
    }
  };

  const label: Record<WeightMethod, string> = {
    stepper: ui.methodStepper,
    maxdiff: ui.methodMaxdiff,
    marbles: ui.methodMarbles,
  };

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-muted text-xs tracking-wide uppercase">{ui.weighting}</h3>
        <p className="text-muted mt-1 text-sm">{ui.weightingHint}</p>
      </div>

      <div
        role="group"
        aria-label={ui.weighting}
        className="border-border inline-flex flex-wrap items-center gap-1 rounded-full border p-1"
      >
        {WEIGHT_METHODS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => pick(m)}
            aria-pressed={m === method}
            className={`min-h-9 rounded-full px-3 text-sm font-medium transition-colors ${m === method ? SEG_ON : SEG_OFF}`}
          >
            {label[m]}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-muted text-sm">{ui.weightNeedsItems}</p>
      ) : method === "maxdiff" ? (
        <MaxDiffPanel key={`md-${setSignature}`} items={items} />
      ) : method === "marbles" ? (
        <MarblesPanel key={`mb-${setSignature}`} items={items} />
      ) : (
        <StepperPanel items={items} />
      )}
    </section>
  );
}

function StepperPanel({ items }: { items: PanelItem[] }) {
  const { ui } = useLocale();
  const setItemWeight = useDecisionStore((s) => s.setItemWeight);
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.key} className="space-y-1">
          <span className="text-sm">{it.label}</span>
          <WeightStepper
            label={`${ui.importance} — ${it.label}`}
            value={it.weight}
            onChange={(w) => setItemWeight(it.rubric, it.ref, w)}
          />
        </li>
      ))}
    </ul>
  );
}

function Billes({ n }: { n: number }) {
  return (
    <span className="text-accent tracking-tight" aria-hidden>
      {"●".repeat(Math.max(0, n))}
    </span>
  );
}

/** Completion note that receives focus, so keyboard users aren't dropped to <body>. */
function DoneNote({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <p ref={ref} tabIndex={-1} className="text-accent text-sm outline-none">
      {text} ✓
    </p>
  );
}

function MaxDiffPanel({ items }: { items: PanelItem[] }) {
  const { ui } = useLocale();
  const setWeights = useDecisionStore((s) => s.setWeights);
  const byKey = useMemo(() => new Map(items.map((i) => [i.key, i])), [items]);
  const sets = useMemo(() => maxdiffSets(items.map((i) => i.key)), [items]);

  const [idx, setIdx] = useState(0);
  const [responses, setResponses] = useState<{ bestId: string; worstId: string }[]>([]);
  const [best, setBest] = useState<string | null>(null);
  const [worst, setWorst] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (items.length < 2) return <p className="text-muted text-sm">{ui.weightNeedsItems}</p>;

  const set = sets[idx] ?? [];
  const isLast = idx >= sets.length - 1;
  const ready = best !== null && worst !== null && best !== worst;

  const advance = () => {
    if (!ready || best === null || worst === null) return;
    const all = [...responses, { bestId: best, worstId: worst }];
    setBest(null);
    setWorst(null);
    if (isLast) {
      const weights = maxdiffWeights(
        items.map((i) => i.key),
        all,
      );
      const updates: WeightUpdate[] = [];
      for (const [key, w] of weights) {
        const it = byKey.get(key);
        if (it)
          updates.push({
            rubric: it.rubric,
            id: it.ref.id,
            label: it.ref.label,
            weight: w as Weight,
          });
      }
      setWeights(updates);
      setDone(true);
    } else {
      setResponses(all);
      setIdx(idx + 1);
    }
  };

  if (done) return <DoneNote text={ui.applied} />;

  return (
    <div className="space-y-3">
      <p className="text-muted text-xs">{fmt(ui.maxdiffSet, { a: idx + 1, b: sets.length })}</p>
      <ul className="space-y-2">
        {set.map((key) => {
          const it = byKey.get(key);
          if (!it) return null;
          return (
            <li
              key={key}
              className="border-border flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
            >
              <span className="text-sm">{it.label}</span>
              <span className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setBest(best === key ? null : key)}
                  aria-pressed={best === key}
                  aria-label={`${ui.maxdiffMost} — ${it.label}`}
                  className={`min-h-9 rounded-full px-3 text-xs font-medium ${best === key ? SEG_ON : "border-border border"}`}
                >
                  {ui.maxdiffMost}
                </button>
                <button
                  type="button"
                  onClick={() => setWorst(worst === key ? null : key)}
                  aria-pressed={worst === key}
                  aria-label={`${ui.maxdiffLeast} — ${it.label}`}
                  className={`min-h-9 rounded-full px-3 text-xs font-medium ${worst === key ? SEG_ON : "border-border border"}`}
                >
                  {ui.maxdiffLeast}
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={advance}
        disabled={!ready}
        className="bg-accent text-accent-foreground inline-flex min-h-12 items-center rounded-full px-5 text-sm font-medium disabled:opacity-40"
      >
        {isLast ? ui.apply : ui.next}
      </button>
    </div>
  );
}

function MarblesPanel({ items }: { items: PanelItem[] }) {
  const { ui } = useLocale();
  const setWeights = useDecisionStore((s) => s.setWeights);
  const [alloc, setAlloc] = useState<Map<string, number>>(() => {
    const seed = weightsToAllocation(new Map(items.map((i) => [i.key, i.weight])));
    return new Map(items.map((i) => [i.key, seed.get(i.key) ?? 0]));
  });
  const [done, setDone] = useState(false);

  const used = [...alloc.values()].reduce((a, b) => a + b, 0);
  const left = MARBLE_POOL - used;

  const bump = (key: string, delta: number) => {
    setDone(false);
    setAlloc((prev) => {
      const cur = prev.get(key) ?? 0;
      const target = cur + delta;
      if (target < 0) return prev;
      // Recompute the pool from `prev`, not from a stale render closure.
      const usedNow = [...prev.values()].reduce((a, b) => a + b, 0);
      if (delta > 0 && usedNow >= MARBLE_POOL) return prev;
      const next = new Map(prev);
      next.set(key, target);
      return next;
    });
  };

  const apply = () => {
    const weights = allocationToWeights(alloc);
    const updates: WeightUpdate[] = [];
    for (const it of items) {
      const w = weights.get(it.key);
      if (w) updates.push({ rubric: it.rubric, id: it.ref.id, label: it.ref.label, weight: w });
    }
    setWeights(updates);
    setDone(true);
  };

  return (
    <div className="space-y-3">
      <p className="text-muted text-xs" aria-live="polite">
        {fmt(ui.marblesLeft, { n: left })}
      </p>
      <ul className="space-y-2">
        {items.map((it) => {
          const count = alloc.get(it.key) ?? 0;
          return (
            <li key={it.key} className="flex items-center justify-between gap-3">
              <span className="min-w-0 flex-1 truncate text-sm">{it.label}</span>
              <span className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => bump(it.key, -1)}
                  disabled={count <= 0}
                  aria-label={`${it.label} −`}
                  className="border-border grid size-9 place-items-center rounded-full border disabled:opacity-40"
                >
                  <Minus className="size-4" aria-hidden />
                </button>
                <span className="min-w-16 text-center text-sm">
                  <span className="sr-only">{count}</span>
                  <Billes n={count} />
                </span>
                <button
                  type="button"
                  onClick={() => bump(it.key, +1)}
                  disabled={left <= 0}
                  aria-label={`${it.label} +`}
                  className="border-border grid size-9 place-items-center rounded-full border disabled:opacity-40"
                >
                  <Plus className="size-4" aria-hidden />
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={apply}
        disabled={used === 0}
        className="bg-accent text-accent-foreground inline-flex min-h-12 items-center rounded-full px-5 text-sm font-medium disabled:opacity-40"
      >
        {done ? `${ui.applied} ✓` : ui.apply}
      </button>
    </div>
  );
}
