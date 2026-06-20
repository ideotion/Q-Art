"use client";

import Link from "next/link";
import { Compass, MessagesSquare, type LucideIcon } from "lucide-react";
import { useLocale } from "@/lib/i18n/react";
import { LanguageToggle } from "@/components/language-toggle";

export default function Home() {
  const { ui } = useLocale();
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-8">
      <header className="flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">{ui.appName}</span>
        <LanguageToggle />
      </header>

      <div className="flex flex-1 flex-col justify-center py-12">
        <h1 className="text-2xl leading-snug font-medium text-balance sm:text-3xl">{ui.tagline}</h1>
        <p className="text-muted mt-6 text-sm">{ui.chooseDoor}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <DoorCard href="/atlas" icon={Compass} name={ui.atlasName} desc={ui.atlasDesc} />
          <DoorCard
            href="/socrate"
            icon={MessagesSquare}
            name={ui.socrateName}
            desc={ui.socrateDesc}
          />
        </div>
      </div>

      <footer className="text-muted border-border border-t pt-4 text-xs">{ui.notAdvice}</footer>
    </main>
  );
}

function DoorCard({
  href,
  icon: Icon,
  name,
  desc,
}: {
  href: string;
  icon: LucideIcon;
  name: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="border-border bg-card hover:border-accent group flex flex-col gap-2 rounded-xl border p-5 transition-colors"
    >
      <Icon className="text-accent size-6" aria-hidden />
      <span className="text-lg font-medium">{name}</span>
      <span className="text-muted text-sm">{desc}</span>
    </Link>
  );
}
