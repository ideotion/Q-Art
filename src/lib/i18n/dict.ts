/**
 * UI string dictionary (FR/EN). Thin, typed i18n seam for the app chrome.
 * NOTE: the chosen production i18n is Paraglide (compile-time, ADR-003); this
 * dictionary is the 0.0.1 stand-in and the swap target. Content strings
 * (rubrics/banks/question-tree) are localized in the domain layer, not here.
 */
import type { Locale } from "../qart";

export interface UiDict {
  appName: string;
  tagline: string;
  chooseDoor: string;
  atlasName: string;
  atlasDesc: string;
  socrateName: string;
  socrateDesc: string;
  start: string;
  next: string;
  back: string;
  finish: string;
  restart: string;
  backHome: string;
  yourQuestion: string;
  questionPlaceholder: string;
  freeText: string;
  freeTextPlaceholder: string;
  importance: string;
  reframe: string;
  reframePlaceholder: string;
  synthesis: string;
  initialQuestion: string;
  reformulatedQuestion: string;
  none: string;
  actionPlanHint: string;
  notAdvice: string;
  language: string;
  progress: string; // "{a} / {b}"
}

export const DICT: Record<Locale, UiDict> = {
  en: {
    appName: "Q‑Art",
    tagline:
      "Bring the question you can't resolve. Leave with a better question — and the answer that comes with it.",
    chooseDoor: "Choose a door",
    atlasName: "Atlas",
    atlasDesc: "Map it yourself — the structured boards, at your own pace.",
    socrateName: "Socrate",
    socrateDesc: "Let it question you — one guided question at a time.",
    start: "Start",
    next: "Next",
    back: "Back",
    finish: "Finish",
    restart: "Start over",
    backHome: "Home",
    yourQuestion: "Your question",
    questionPlaceholder: "Should I…  /  How do I…  /  Is it worth…",
    freeText: "In your own words",
    freeTextPlaceholder: "Anything the list doesn't capture…",
    importance: "Importance",
    reframe: "Reframe your question",
    reframePlaceholder: "How do I…",
    synthesis: "Synthesis",
    initialQuestion: "Initial question",
    reformulatedQuestion: "Reframed question",
    none: "—",
    actionPlanHint: "The action plan is built in the next cycle, on your reframed question.",
    notAdvice:
      "Q‑Art helps you think — it is not therapy, medical, or legal advice. In crisis, contact local emergency services.",
    language: "Language",
    progress: "{a} / {b}",
  },
  fr: {
    appName: "Q‑Art",
    tagline:
      "Apportez la question que vous n'arrivez pas à trancher. Repartez avec une meilleure question — et la réponse qui l'accompagne.",
    chooseDoor: "Choisissez une porte",
    atlasName: "Atlas",
    atlasDesc: "Cartographiez vous-même — les tableaux structurés, à votre rythme.",
    socrateName: "Socrate",
    socrateDesc: "Laissez-le vous questionner — une question guidée à la fois.",
    start: "Commencer",
    next: "Suivant",
    back: "Retour",
    finish: "Terminer",
    restart: "Recommencer",
    backHome: "Accueil",
    yourQuestion: "Votre question",
    questionPlaceholder: "Devrais-je…  /  Comment faire pour…  /  Est-ce que ça vaut…",
    freeText: "Avec vos mots",
    freeTextPlaceholder: "Tout ce que la liste ne capture pas…",
    importance: "Importance",
    reframe: "Reformulez votre question",
    reframePlaceholder: "Comment faire pour…",
    synthesis: "Synthèse",
    initialQuestion: "Question initiale",
    reformulatedQuestion: "Question reformulée",
    none: "—",
    actionPlanHint:
      "Le plan d'action se construit au cycle suivant, sur votre question reformulée.",
    notAdvice:
      "Q‑Art vous aide à réfléchir — ce n'est ni une thérapie, ni un avis médical ou juridique. En cas de crise, contactez les services d'urgence locaux.",
    language: "Langue",
    progress: "{a} / {b}",
  },
};
