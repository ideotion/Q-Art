"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { GUIS } from "@/lib/gui";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { AppHeader } from "@/components/app-header";
import { GuiIcon } from "@/components/gui-icon";
import { DiagnosticsPanel } from "@/components/diagnostics-panel";
import { ABOUT_SECTIONS, SAFEGUARDING } from "./content";

export default function AboutPage() {
  const { ui } = useLocale();
  const loc = useLoc();

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 space-y-8 px-5 py-8">
        <h1 className="text-2xl font-medium">{ui.aboutTitle}</h1>

        {ABOUT_SECTIONS.map((s) => (
          <section key={s.heading.en} className="space-y-1">
            <h2 className="font-medium">{loc(s.heading)}</h2>
            <p className="text-muted text-sm leading-relaxed">{loc(s.body)}</p>
            {s.heading.en === "Three ways in" ? (
              <ul className="mt-3 space-y-2">
                {GUIS.map((g) => (
                  <li key={g.id} className="flex items-start gap-2 text-sm">
                    <GuiIcon iconKey={g.iconKey} className="text-accent mt-0.5 size-4 shrink-0" />
                    <span>
                      <span className="font-medium">{loc(g.name)}</span>
                      <span className="text-muted"> — {loc(g.bestFor)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        {/* Safeguarding — prominent, reachable from every GUI via the header link. */}
        <section className="border-accent bg-accent/5 space-y-1 rounded-xl border p-4">
          <h2 className="flex items-center gap-2 font-medium">
            <ShieldAlert className="text-accent size-5" aria-hidden />
            {loc(SAFEGUARDING.heading)}
          </h2>
          <p className="text-sm leading-relaxed">{loc(SAFEGUARDING.body)}</p>
        </section>

        <DiagnosticsPanel />

        <Link
          href="/"
          className="text-muted hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {ui.backHome}
        </Link>
      </main>
    </div>
  );
}
