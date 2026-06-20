"use client";

import { useEffect, useRef } from "react";
import { useMachine } from "@xstate/react";
import type { Mode } from "../lib/qart";
import { useDecisionStore } from "./decision-store";
import { flowMachine } from "./flow-machine";

/**
 * One session, three GUIs. Each GUI page calls this on mount: it ensures a
 * decision cycle exists, records that this GUI is now editing, and starts the
 * (per-page) navigation machine. Crucially it does NOT reset the store — so
 * switching GUIs mid-session keeps every answer (brief §3: zero data loss).
 */
export function useGuiSession(mode: Mode) {
  const [snap, send] = useMachine(flowMachine);
  const init = useRef(false);

  useEffect(() => {
    if (init.current) return;
    init.current = true;
    const s = useDecisionStore.getState();
    if (!s.activeCycle) s.startCase({ mode });
    else s.setMode(mode);
    send({ type: "START", mode });
  }, [mode, send]);

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
