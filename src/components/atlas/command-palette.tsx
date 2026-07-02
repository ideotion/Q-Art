"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CornerDownLeft, Search } from "lucide-react";
import { BOARDS } from "@/lib/qart";
import { fmt } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";

/**
 * Atlas ⌘K/Ctrl+K command palette — also the board overview/minimap. A native <dialog>
 * (showModal) gives focus-trapping + Escape for free, so it stays accessible.
 * Each entry shows how many items the board has selected. Jump with Enter or click.
 */
export function CommandPalette({ onJump }: { onJump: (index: number) => void }) {
  const { ui } = useLocale();
  const loc = useLoc();
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  // Show the platform's actual shortcut (the handler accepts both ⌘K and Ctrl+K).
  // Post-mount read: navigator isn't available during prerender (same pattern
  // as LocaleProvider's localStorage read).
  const [kbd, setKbd] = useState("Ctrl K");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (/Mac|iP(hone|ad|od)/.test(navigator.platform)) setKbd("⌘K");
  }, []);
  const cycle = useDecisionStore((s) => s.activeCycle);

  const open = () => {
    setQ("");
    ref.current?.showModal();
  };
  const close = () => ref.current?.close();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const entries = BOARDS.map((b, index) => ({ b, index })).filter(({ b }) =>
    loc(b.title).toLowerCase().includes(q.trim().toLowerCase()),
  );

  const selectedIn = (rubrics: readonly string[]): number =>
    rubrics.reduce(
      (n, r) => n + (cycle?.rubrics[r as keyof typeof cycle.rubrics]?.checkedItems.length ?? 0),
      0,
    );

  const jump = (index: number) => {
    onJump(index);
    close();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="border-border text-muted hover:text-foreground inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs"
      >
        <Search className="size-3.5" aria-hidden />
        {ui.commands}
        <kbd className="border-border ml-1 rounded border px-1 text-[10px]">{kbd}</kbd>
      </button>

      <dialog
        ref={ref}
        aria-label={ui.commands}
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
        className="bg-card text-foreground border-border m-auto w-[min(28rem,92vw)] rounded-xl border p-0 shadow-xl backdrop:bg-black/40"
      >
        <form
          method="dialog"
          onSubmit={(e) => {
            e.preventDefault();
            if (entries[0]) jump(entries[0].index);
          }}
          className="border-border flex items-center gap-2 border-b px-3 py-2"
        >
          <Search className="text-muted size-4" aria-hidden />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={ui.jumpToBoard}
            placeholder={ui.jumpToBoard}
            className="placeholder:text-muted flex-1 bg-transparent py-1 text-sm outline-none"
          />
          <CornerDownLeft className="text-muted size-3.5" aria-hidden />
        </form>
        <ul className="max-h-72 overflow-auto p-1">
          {entries.map(({ b, index }) => {
            const n = selectedIn(b.rubrics);
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => jump(index)}
                  className="hover:bg-accent/10 flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm"
                >
                  <span>{loc(b.title)}</span>
                  <span className="text-muted flex items-center gap-1 text-xs">
                    {n > 0 ? <Check className="text-accent size-3.5" aria-hidden /> : null}
                    {n > 0 ? fmt(ui.selectedCount, { n }) : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </dialog>
    </>
  );
}
