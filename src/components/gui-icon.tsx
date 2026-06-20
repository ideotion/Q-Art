"use client";

import { Layers, LayoutGrid, MessagesSquare, type LucideIcon } from "lucide-react";
import type { GuiIconKey } from "@/lib/gui";

/** Map a registry icon key to its Lucide glyph (UI layer owns the icons). */
const ICONS: Record<GuiIconKey, LucideIcon> = {
  atlas: LayoutGrid, // structured boards / workbench
  socrate: MessagesSquare, // guided dialogue
  cartes: Layers, // a deck of cards
};

export function GuiIcon({ iconKey, className }: { iconKey: GuiIconKey; className?: string }) {
  const Icon = ICONS[iconKey];
  return <Icon className={className} aria-hidden />;
}
