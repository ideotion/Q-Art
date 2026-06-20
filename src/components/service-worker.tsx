"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useLocale } from "@/lib/i18n/react";
import { diag } from "@/lib/diag";

/**
 * Registers the hand-authored service worker (ADR-021) for offline use, and
 * surfaces a calm, dismissible "new version ready" toast when an update installs
 * — reload on the user's terms, never a surprise auto-refresh (no dark patterns).
 */
export function ServiceWorkerRegister() {
  const { ui } = useLocale();
  const [updateReady, setUpdateReady] = useState(false);
  const waitingRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    let cancelled = false;
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        diag("I", "pwa", "pwa.sw.update", { scope: undefined });
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            // An update (not the first install) is ready and waiting.
            if (nw.state === "installed" && navigator.serviceWorker.controller && !cancelled) {
              waitingRef.current = reg.waiting;
              setUpdateReady(true);
            }
          });
        });
      })
      .catch(() => {
        /* SW unsupported or blocked — app still works online */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!updateReady) return null;

  const reload = () => {
    waitingRef.current?.postMessage("SKIP_WAITING");
    window.location.reload();
  };

  return (
    <div
      role="status"
      className="border-border bg-card fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl border p-3 shadow-lg"
    >
      <span className="text-sm">{ui.updateReady}</span>
      <button
        type="button"
        onClick={reload}
        className="bg-accent text-accent-foreground inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium"
      >
        <RefreshCw className="size-4" aria-hidden />
        {ui.reload}
      </button>
    </div>
  );
}
