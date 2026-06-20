import { flushSync } from "react-dom";

/**
 * Run a state update inside a View Transition (Baseline; design.md §2). React
 * updates async, so we `flushSync` inside the transition callback. Falls back to a
 * plain update when the API is missing or the user prefers reduced motion.
 */
export function withViewTransition(update: () => void): void {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => unknown;
  };
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (doc.startViewTransition && !reduce) {
    doc.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}
