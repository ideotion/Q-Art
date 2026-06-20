"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GUIS, rememberGui } from "@/lib/gui";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { diag, safe } from "@/lib/diag";
import { GuiIcon } from "./gui-icon";

/**
 * Switch GUI mid-session. All three are views over one store, so navigating here
 * keeps every answer (the page-level session hook never resets on mount). Compact
 * icon segments; the active GUI is marked with aria-current.
 */
export function GuiSwitcher() {
  const { ui } = useLocale();
  const loc = useLoc();
  const pathname = usePathname();

  return (
    <nav
      aria-label={ui.switchView}
      className="border-border inline-flex items-center gap-1 rounded-full border p-1"
    >
      {GUIS.map((g) => {
        const active = pathname === g.route;
        return (
          <Link
            key={g.id}
            href={g.route}
            aria-current={active ? "page" : undefined}
            title={loc(g.name)}
            onClick={() => {
              rememberGui(g.id);
              diag("I", "nav", "gui.select", { gui: safe(g.id) });
            }}
            className={`flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium transition-colors ${
              active ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            <GuiIcon iconKey={g.iconKey} className="size-4" />
            <span className="sr-only sm:not-sr-only">{loc(g.name)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
