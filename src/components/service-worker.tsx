"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/react";
import { diag } from "@/lib/diag";

/**
 * Registers the hand-authored service worker (ADR-021) for offline use, and
 * surfaces a calm, dismissible "new version ready" toast when an update is
 * waiting — reload on the user's terms, never a surprise auto-refresh (the
 * worker itself waits for SKIP_WAITING; see public/sw.js).
 *
 * Production only: in dev the SW would serve stale chunks over HMR, so we
 * unregister any leftover worker instead.
 */
export function ServiceWorkerRegister() {
  const { ui } = useLocale();
  const [updateReady, setUpdateReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const waitingRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistration().then((reg) => reg?.unregister());
      return;
    }
    let cancelled = false;
    const offerUpdate = (w: ServiceWorker | null) => {
      if (!w || cancelled) return;
      waitingRef.current = w;
      setUpdateReady(true);
      diag("I", "pwa", "pwa.sw.update");
    };
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // An update may already be waiting from a previous visit.
        if (navigator.serviceWorker.controller) offerUpdate(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            // An update (not the first install) is installed and now waiting.
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              offerUpdate(reg.waiting ?? nw);
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

  const reload = () => {
    const w = waitingRef.current;
    if (!w) {
      window.location.reload();
      return;
    }
    // Reload only once the new worker has actually taken control.
    navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), {
      once: true,
    });
    w.postMessage("SKIP_WAITING");
  };

  const show = updateReady && !dismissed;
  return (
    // Persistent live region: mounted before content changes, so AT announces it.
    <div role="status" aria-live="polite">
      {show ? (
        <div className="border-border bg-card fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl border p-3 shadow-lg">
          <span className="text-sm">{ui.updateReady}</span>
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={reload}
              className="bg-accent text-accent-foreground inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium"
            >
              <RefreshCw className="size-4" aria-hidden />
              {ui.reload}
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-muted hover:text-foreground inline-flex min-h-10 min-w-10 items-center justify-center rounded-full"
              aria-label={ui.dismiss}
            >
              <X className="size-4" aria-hidden />
            </button>
          </span>
        </div>
      ) : null}
    </div>
  );
}
