/**
 * Persisted GUI preference (localStorage now; RxDB-backed later). Plain functions
 * — no React — guarded so SSR / private-mode never throws.
 */
import { DEFAULT_GUI, isGuiId, type GuiId } from "./registry";

const KEY = "qart.gui";

export function rememberGui(id: GuiId): void {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* storage unavailable — preference is best-effort */
  }
}

export function readGui(): GuiId {
  try {
    const v = localStorage.getItem(KEY);
    if (v && isGuiId(v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_GUI;
}
