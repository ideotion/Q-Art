"use client";

import { LocaleProvider } from "@/lib/i18n/react";
import { usePersistence } from "@/store";
import { ServiceWorkerRegister } from "./service-worker";
import { PersistPrompt } from "./persist-prompt";

/** Client root: locale context, encrypted autosave, PWA service worker + onboarding. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  usePersistence();
  return (
    <LocaleProvider>
      <PersistPrompt />
      {children}
      <ServiceWorkerRegister />
    </LocaleProvider>
  );
}
