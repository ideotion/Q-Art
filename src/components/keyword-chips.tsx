"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { RubricKey } from "@/lib/qart";
import { fmt } from "@/lib/i18n/dict";
import { useLocale } from "@/lib/i18n/react";
import { useDecisionStore } from "@/store";

/**
 * Retained ("bold") words for a rubric — the method's keyword capture
 * (schema.md: RubricEntry.keywords). They feed croisements and the per-rubric
 * keyword summary. Deliberately tiny and calm: type a word, Enter or Retain.
 */
/** Stable fallback: a selector must not mint a fresh [] per call (re-render loop). */
const NO_KEYWORDS: string[] = [];

export function KeywordChips({ rubric }: { rubric: RubricKey }) {
  const { ui } = useLocale();
  const keywords = useDecisionStore((s) => s.activeCycle?.rubrics[rubric]?.keywords) ?? NO_KEYWORDS;
  const setKeywords = useDecisionStore((s) => s.setKeywords);
  const [draft, setDraft] = useState("");

  const add = () => {
    const word = draft.trim();
    if (!word) return;
    if (!keywords.includes(word)) setKeywords(rubric, [...keywords, word]);
    setDraft("");
  };
  const remove = (word: string) =>
    setKeywords(
      rubric,
      keywords.filter((k) => k !== word),
    );

  return (
    <div className="space-y-2">
      <p className="text-muted text-xs">{ui.keywordsHint}</p>
      {keywords.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {keywords.map((word) => (
            <li key={word}>
              <span className="border-accent/40 bg-accent/10 inline-flex items-center gap-1 rounded-full border py-0.5 ps-2.5 pe-1 text-xs font-medium">
                {word}
                <button
                  type="button"
                  onClick={() => remove(word)}
                  aria-label={fmt(ui.keywordRemove, { word })}
                  className="hover:text-foreground text-muted grid size-6 place-items-center rounded-full"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex items-center gap-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          aria-label={ui.keywordsLabel}
          placeholder={ui.keywordAddPlaceholder}
          className="border-border bg-background focus:border-accent min-h-9 flex-1 rounded-full border px-3 text-sm outline-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim()}
          className="border-border text-muted hover:text-foreground inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-xs disabled:opacity-40"
        >
          <Plus className="size-3.5" aria-hidden />
          {ui.keywordAdd}
        </button>
      </div>
    </div>
  );
}
