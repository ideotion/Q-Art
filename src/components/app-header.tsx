"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { useLocale } from "@/lib/i18n/react";
import { GuiSwitcher } from "./gui-switcher";
import { LanguageToggle } from "./language-toggle";
import { SavedIndicator } from "./saved-indicator";

export function AppHeader() {
  const { ui } = useLocale();
  return (
    <header className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
      <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
        {ui.appName}
      </Link>
      <div className="flex items-center gap-2">
        <SavedIndicator />
        <GuiSwitcher />
        <LanguageToggle />
        <Link
          href="/about"
          aria-label={ui.about}
          title={ui.about}
          className="text-muted hover:text-foreground grid size-9 place-items-center rounded-full"
        >
          <HelpCircle className="size-5" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
