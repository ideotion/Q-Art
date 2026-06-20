"use client";

import { LOCALES } from "@/lib/qart";
import { useLocale } from "@/lib/i18n/react";

export function LanguageToggle() {
  const { locale, setLocale, ui } = useLocale();
  return (
    <div
      role="group"
      aria-label={ui.language}
      className="border-border inline-flex items-center gap-1 rounded-full border p-1"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={l === locale}
          className={`min-h-9 rounded-full px-3 text-sm font-medium transition-colors ${
            l === locale ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
