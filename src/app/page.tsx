"use client";

import Link from "next/link";
import { GUIS, rememberGui, type GuiMeta } from "@/lib/gui";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { GuiIcon } from "@/components/gui-icon";
import { LanguageToggle } from "@/components/language-toggle";

export default function Home() {
  const { ui } = useLocale();
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-8">
      <header className="flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">{ui.appName}</span>
        <LanguageToggle />
      </header>

      <div className="flex flex-1 flex-col justify-center py-10">
        <h1 className="text-2xl leading-snug font-medium text-balance sm:text-3xl">{ui.tagline}</h1>
        <p className="mt-6 text-sm font-medium">{ui.pickGuiTitle}</p>
        <p className="text-muted mt-1 text-sm">{ui.pickGuiHint}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {GUIS.map((g) => (
            <GuiCard key={g.id} gui={g} />
          ))}
        </div>
      </div>

      <footer className="text-muted border-border border-t pt-4 text-xs">{ui.notAdvice}</footer>
    </main>
  );
}

function GuiCard({ gui }: { gui: GuiMeta }) {
  const { ui } = useLocale();
  const loc = useLoc();
  return (
    <Link
      href={gui.route}
      onClick={() => rememberGui(gui.id)}
      className="border-border bg-card hover:border-accent group flex flex-col gap-2 rounded-xl border p-5 transition-colors"
    >
      <GuiIcon iconKey={gui.iconKey} className="text-accent size-6" />
      <span className="text-lg font-medium">{loc(gui.name)}</span>
      <span className="text-accent text-xs tracking-wide uppercase">{loc(gui.paradigm)}</span>
      <span className="text-muted text-sm">{loc(gui.tagline)}</span>
      <span className="text-muted mt-1 text-xs">
        <span className="font-medium">{ui.guiBestFor}:</span> {loc(gui.bestFor)}
      </span>
    </Link>
  );
}
