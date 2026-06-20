"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, type Locale, type LocalizedText } from "../qart";
import { diag, safe } from "../diag";
import { DICT, type UiDict } from "./dict";

const STORAGE_KEY = "qart.locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  ui: UiDict;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Read the persisted locale only after mount: a lazy initializer would
      // diverge from the server-rendered HTML and trip a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "en" || saved === "fr") setLocaleState(saved);
    } catch {
      /* localStorage unavailable — keep default */
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    diag("I", "i18n", "i18n.locale.load", { locale: safe(l) });
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, ui: DICT[locale] }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

/** Resolve a domain-layer LocalizedText (rubrics/banks/tree) to the active locale. */
export function useLoc(): (t: LocalizedText) => string {
  const { locale } = useLocale();
  return useCallback((t: LocalizedText) => t[locale], [locale]);
}
