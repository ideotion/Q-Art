/**
 * The triptyque GUI registry (ADR-018). Three distinct presentations over ONE
 * decision object and ONE store — none forks the schema or state. The GUI id is
 * the schema `Mode`, so "which door edited this" and "which GUI is shown" stay in
 * lockstep. Icons are resolved to Lucide components in the UI layer (this module
 * stays presentation-data only, no React).
 */
import type { LocalizedText, Mode } from "../qart";

export type GuiId = Mode;
export type GuiIconKey = "atlas" | "socrate" | "cartes";

export interface GuiMeta {
  id: GuiId;
  route: string;
  iconKey: GuiIconKey;
  /** Proper name (same in both locales). */
  name: LocalizedText;
  /** The paradigm label — "The Workbench" / "L'Établi". */
  paradigm: LocalizedText;
  /** One-line description of how it feels to use. */
  tagline: LocalizedText;
  /** When to reach for this GUI. */
  bestFor: LocalizedText;
}

export const GUIS: GuiMeta[] = [
  {
    id: "atlas",
    route: "/atlas",
    iconKey: "atlas",
    name: { en: "Atlas", fr: "Atlas" },
    paradigm: { en: "The Workbench", fr: "L'Établi" },
    tagline: {
      en: "Map it yourself — structured boards, at your own pace.",
      fr: "Cartographiez vous-même — des tableaux structurés, à votre rythme.",
    },
    bestFor: {
      en: "For deliberate, desk-bound decisions. Keyboard-first.",
      fr: "Pour les décisions posées, au bureau. Pensé pour le clavier.",
    },
  },
  {
    id: "socrate",
    route: "/socrate",
    iconKey: "socrate",
    name: { en: "Socrate", fr: "Socrate" },
    paradigm: { en: "The Dialogue", fr: "Le Dialogue" },
    tagline: {
      en: "Let it question you — one prompt at a time.",
      fr: "Laissez-le vous questionner — une invite à la fois.",
    },
    bestFor: {
      en: "For emotionally-charged decisions. Calm and mobile-first.",
      fr: "Pour les décisions chargées d'émotion. Apaisé, pensé mobile.",
    },
  },
  {
    id: "cartes",
    route: "/cartes",
    iconKey: "cartes",
    name: { en: "Cartes", fr: "Cartes" },
    paradigm: { en: "The Card Atelier", fr: "L'Atelier de cartes" },
    tagline: {
      en: "Sort it like a deck — keep, skip, and weigh each card.",
      fr: "Triez comme un jeu de cartes — gardez, passez, et pesez.",
    },
    bestFor: {
      en: "For exploratory, creative framing. Touch and gesture, with full keyboard fallbacks.",
      fr: "Pour explorer et recadrer librement. Tactile, avec un repli clavier complet.",
    },
  },
];

export const DEFAULT_GUI: GuiId = "atlas";

const BY_ID = new Map<GuiId, GuiMeta>(GUIS.map((g) => [g.id, g]));

export function getGui(id: GuiId): GuiMeta {
  const g = BY_ID.get(id);
  if (!g) throw new Error(`Unknown GUI: ${id}`);
  return g;
}

export function isGuiId(v: string): v is GuiId {
  return BY_ID.has(v as GuiId);
}
