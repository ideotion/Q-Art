"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/react";
import { LanguageToggle } from "./language-toggle";

export function AppHeader() {
  const { ui } = useLocale();
  return (
    <header className="border-border flex items-center justify-between border-b px-5 py-3">
      <Link href="/" className="text-base font-semibold tracking-tight">
        {ui.appName}
      </Link>
      <LanguageToggle />
    </header>
  );
}
