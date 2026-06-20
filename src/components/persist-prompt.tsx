"use client";

import { useEffect, useState } from "react";
import { HardDriveDownload, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/react";
import { diag } from "@/lib/diag";

const DISMISS_KEY = "qart.persistPrompt.dismissed";

/**
 * One-time, dismissible onboarding to request persistent storage so the browser
 * won't evict the encrypted dossiers under pressure (design.md §6). Non-coercive:
 * "Not now" is a first-class choice and we never ask again once dismissed.
 */
export function PersistPrompt() {
  const { ui } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let live = true;
    void (async () => {
      try {
        if (localStorage.getItem(DISMISS_KEY)) return;
        if (!navigator.storage?.persist || !navigator.storage.persisted) return;
        if (await navigator.storage.persisted()) return; // already persistent
        if (live) setShow(true);
      } catch {
        /* storage manager unavailable — skip the prompt */
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  if (!show) return null;

  const close = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  const allow = async () => {
    try {
      const granted = await navigator.storage.persist();
      diag("I", "storage", granted ? "storage.persist.granted" : "storage.persist.denied");
    } catch {
      /* ignore */
    }
    close();
  };

  return (
    <div
      role="region"
      aria-label={ui.persistTitle}
      className="border-border bg-card/80 border-b px-4 py-3 backdrop-blur"
    >
      <div className="mx-auto flex max-w-3xl items-start gap-3">
        <HardDriveDownload className="text-accent mt-0.5 size-5 shrink-0" aria-hidden />
        <div className="flex-1">
          <p className="text-sm font-medium">{ui.persistTitle}</p>
          <p className="text-muted mt-1 text-sm">{ui.persistBody}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={allow}
              className="bg-accent text-accent-foreground inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium"
            >
              {ui.persistAllow}
            </button>
            <button
              type="button"
              onClick={close}
              className="border-border text-muted hover:text-foreground inline-flex min-h-10 items-center rounded-full border px-4 text-sm"
            >
              {ui.dismiss}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label={ui.close}
          className="text-muted hover:text-foreground -mt-1 -mr-1 p-1"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
