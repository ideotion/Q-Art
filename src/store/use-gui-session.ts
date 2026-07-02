"use client";

import { useEffect, useRef } from "react";
import { useMachine } from "@xstate/react";
import type { Mode } from "../lib/qart";
import { getRepository, loadMostRecent } from "../lib/storage";
import { useDecisionStore } from "./decision-store";
import { useBoot } from "./persistence";
import { flowMachine } from "./flow-machine";

/**
 * One session, three GUIs. Each GUI page calls this on mount: it ensures a
 * decision cycle exists, records that this GUI is now editing, and starts the
 * (per-page) navigation machine. Crucially it does NOT reset the store — so
 * switching GUIs mid-session keeps every answer (brief §3: zero data loss).
 *
 * Direct loads (refresh, bookmark, PWA restore) resume the most recent *saved*
 * session instead of starting a fresh empty one — a plain F5 mid-decision must
 * never bury the user's work behind an empty case.
 */
export function useGuiSession(mode: Mode) {
  const [snap, send] = useMachine(flowMachine);
  const hydrated = useBoot((s) => s.hydrated);
  const init = useRef(false);

  useEffect(() => {
    if (!hydrated || init.current) return;
    init.current = true;
    let live = true;
    void (async () => {
      const s = useDecisionStore.getState();
      if (s.activeCycle) {
        s.setMode(mode);
      } else {
        const recent = await loadMostRecent(getRepository()).catch(() => null);
        if (!live) return;
        const st = useDecisionStore.getState();
        if (!st.activeCycle) {
          if (recent) {
            st.loadCycle(recent.c, recent.cy);
            st.setMode(mode);
          } else {
            st.startCase({ mode });
          }
        }
      }
      if (live) send({ type: "START", mode });
    })();
    return () => {
      live = false;
    };
  }, [hydrated, mode, send]);

  /** Explicit, user-initiated fresh start: clears data AND navigation. */
  const restart = () => {
    const s = useDecisionStore.getState();
    s.reset();
    s.startCase({ mode });
    send({ type: "RESET" });
    send({ type: "START", mode });
  };

  return { snap, send, restart } as const;
}
