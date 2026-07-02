"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { GUIS, getGui, readGui, rememberGui, type GuiId, type GuiMeta } from "@/lib/gui";
import { getRepository, loadMostRecent, type ResumePoint } from "@/lib/storage";
import { useLoc, useLocale } from "@/lib/i18n/react";
import { useBoot, useDecisionStore } from "@/store";
import { GuiIcon } from "@/components/gui-icon";
import { LanguageToggle } from "@/components/language-toggle";

export default function Home() {
  const { ui } = useLocale();
  // Surface the remembered GUI (post-mount: the preference lives in localStorage,
  // so a lazy initializer would trip a hydration mismatch — same pattern as LocaleProvider).
  const [lastUsed, setLastUsed] = useState<GuiId | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastUsed(readGui());
  }, []);
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-8">
      <header className="flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">{ui.appName}</span>
        <LanguageToggle />
      </header>

      <div className="flex flex-1 flex-col justify-center py-10">
        <h1 className="text-2xl leading-snug font-medium text-balance sm:text-3xl">{ui.tagline}</h1>
        <ContinueBanner />
        <p className="mt-6 text-sm font-medium">{ui.pickGuiTitle}</p>
        <p className="text-muted mt-1 text-sm">{ui.pickGuiHint}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {GUIS.map((g) => (
            <GuiCard key={g.id} gui={g} lastUsed={g.id === lastUsed} />
          ))}
        </div>
      </div>

      <footer className="text-muted border-border flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs">
        <span className="max-w-prose">{ui.notAdvice}</span>
        <Link href="/about" className="hover:text-foreground shrink-0 underline underline-offset-2">
          {ui.about}
        </Link>
      </footer>
    </main>
  );
}

/** Offers to reopen the most-recent encrypted session, if any. Opt-in, never forced. */
function ContinueBanner() {
  const { ui } = useLocale();
  const router = useRouter();
  const hydrated = useBoot((s) => s.hydrated);
  const loadCycle = useDecisionStore((s) => s.loadCycle);
  const [resume, setResume] = useState<ResumePoint | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    let live = true;
    void (async () => {
      const found = await loadMostRecent(getRepository()).catch(() => null);
      if (live && found) setResume(found);
    })();
    return () => {
      live = false;
    };
  }, [hydrated]);

  if (!resume) return null;
  const open = () => {
    loadCycle(resume.c, resume.cy);
    router.push(getGui(resume.cy.mode).route);
  };

  return (
    <button
      type="button"
      onClick={open}
      className="border-accent bg-accent/10 hover:bg-accent/15 mt-6 inline-flex min-h-12 items-center gap-2 self-start rounded-full border px-5 text-sm font-medium transition-colors"
    >
      {ui.continueSession}
      <ArrowRight className="size-4" aria-hidden />
    </button>
  );
}

function GuiCard({ gui, lastUsed }: { gui: GuiMeta; lastUsed?: boolean }) {
  const { ui } = useLocale();
  const loc = useLoc();
  return (
    <Link
      href={gui.route}
      onClick={() => rememberGui(gui.id)}
      className="border-border bg-card hover:border-accent group flex flex-col gap-2 rounded-xl border p-5 transition-colors"
    >
      <span className="flex items-center justify-between">
        <GuiIcon iconKey={gui.iconKey} className="text-accent size-6" />
        {lastUsed ? (
          <span className="text-accent border-accent/40 rounded-full border px-2 py-0.5 text-[10px] tracking-wide uppercase">
            {ui.lastUsed}
          </span>
        ) : null}
      </span>
      <span className="text-lg font-medium">{loc(gui.name)}</span>
      <span className="text-accent text-xs tracking-wide uppercase">{loc(gui.paradigm)}</span>
      <span className="text-muted text-sm">{loc(gui.tagline)}</span>
      <span className="text-muted mt-1 text-xs">
        <span className="font-medium">{ui.guiBestFor}:</span> {loc(gui.bestFor)}
      </span>
    </Link>
  );
}
