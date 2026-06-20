"use client";

import { LocaleProvider } from "@/lib/i18n/react";
import { usePersistence } from "@/store";

/** Client root: locale context + app-level persistence (encrypted autosave). */
export function AppProviders({ children }: { children: React.ReactNode }) {
  usePersistence();
  return <LocaleProvider>{children}</LocaleProvider>;
}
