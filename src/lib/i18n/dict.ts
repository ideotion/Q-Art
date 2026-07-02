/**
 * UI string dictionary (FR/EN). Thin, typed i18n seam for the app chrome.
 * NOTE: the chosen production i18n is Paraglide (compile-time, ADR-003); this
 * dictionary is the 0.0.1 stand-in and the swap target. Content strings
 * (rubrics/banks/question-tree) are localized in the domain layer, not here.
 */
import type { Locale } from "../qart";

/** Tiny template helper: replaces every `{key}` occurrence in a dict string. */
export const fmt = (t: string, vars: Record<string, string | number>): string =>
  Object.entries(vars).reduce((s, [k, v]) => s.split(`{${k}}`).join(String(v)), t);

export interface UiDict {
  appName: string;
  tagline: string;
  chooseDoor: string;
  pickGuiTitle: string;
  pickGuiHint: string;
  switchView: string;
  lastUsed: string;
  guiBestFor: string;
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
  // recursion (the method's pivot) + structured action plan
  cycleN: string; // "Cycle {n}"
  fromReframed: string;
  nextCycle: string;
  nextCycleHint: string;
  actionPlan: string;
  actionPlanIntro: string;
  addStep: string;
  removeStep: string;
  stepAction: string;
  stepActionPlaceholder: string;
  stepWith: string;
  stepWhen: string;
  stepIndicator: string;
  stepSabotage: string;
  stepStatus: string;
  statusReady: string;
  statusRefine: string;
  statusBuild: string;
  stepN: string; // "Step {n}"
  // retained keywords
  keywordsLabel: string;
  keywordsHint: string;
  keywordAddPlaceholder: string;
  keywordAdd: string;
  keywordRemove: string; // "Remove {word}"
  // socrate depth
  alsoAsk: string;
  notAdvice: string;
  language: string;
  progress: string; // "{a} / {b}"
  steps: string; // accessible name for the flow nav
  // weighting (ADR-005)
  weighting: string;
  weightingHint: string;
  methodStepper: string;
  methodMaxdiff: string;
  methodMarbles: string;
  maxdiffMost: string;
  maxdiffLeast: string;
  maxdiffSet: string; // "Set {a} / {b}"
  marblesLeft: string; // "{n} marbles left"
  apply: string;
  applied: string;
  weightNeedsItems: string;
  // croisements
  crossLinks: string;
  crossLinksHint: string;
  crossLinksAcross: string; // "across {n} areas"
  noCrossLinks: string;
  priorities: string;
  // the reading (insight engine)
  reading: string;
  readingIntro: string;
  whatStandsOut: string;
  emptyReading: string;
  betterQuestion: string;
  betterQuestionHint: string;
  useThis: string;
  oneStep: string;
  oneStepHint: string;
  oneStepPlaceholder: string;
  refineOptional: string;
  insightKnotTitle: string;
  insightKnotBody: string; // {theme} {n}
  insightTensionTitle: string;
  insightTensionBody: string; // {a} {b}
  insightRoleTitle: string;
  insightRoleBody: string; // {a}
  insightSamenessTitle: string;
  insightSamenessBody: string; // {a}
  insightPayoffTitle: string;
  insightPayoffBody: string; // {a}
  insightBeliefTitle: string;
  insightBeliefBody: string; // {a}
  insightExceptionTitle: string;
  insightExceptionBody: string; // {a}
  insightGapTitle: string;
  insightGapBody: string; // {areas}
  reframeOvercome: string; // {theme}
  reframeNeed: string; // {theme}
  reframeBelief: string; // {theme}
  reframeRole: string;
  reframeClarify: string;
  reframeSmallestStep: string;
  // cartes (deck GUI)
  keep: string;
  skip: string;
  kept: string;
  cardOf: string; // "Card {a} / {b}"
  deckProgress: string; // "{a} / {b}"
  keptOf: string; // "Kept {a} of {b}"
  removeKept: string;
  allCardsSeen: string;
  spread: string;
  yourDeck: string;
  close: string;
  done: string;
  // persistence / data rights
  saving: string;
  saved: string;
  continueSession: string;
  exportDossier: string;
  importDossier: string;
  deleteAll: string;
  confirmDelete: string;
  imported: string;
  importFailed: string;
  deleted: string;
  opFailed: string;
  yourData: string;
  dataHint: string;
  // pwa
  persistTitle: string;
  persistBody: string;
  persistAllow: string;
  dismiss: string;
  updateReady: string;
  reload: string;
  // about / help / diagnostics
  about: string;
  aboutTitle: string;
  diagnostics: string;
  diagnosticsHint: string;
  downloadDiag: string;
  deepMode: string;
  version: string;
  // atlas deepening + socrate progress
  commands: string;
  jumpToBoard: string;
  selectedCount: string; // "{n} selected"
  stepOf: string; // "Step {a} of {b}"
}

export const DICT: Record<Locale, UiDict> = {
  en: {
    appName: "Q‑Art",
    tagline:
      "Bring the question you can't resolve. Leave with a better question — and the answer that comes with it.",
    chooseDoor: "Choose a door",
    pickGuiTitle: "Choose how you'll work",
    pickGuiHint: "Three ways into the same method. Switch anytime — your work follows you.",
    switchView: "Switch view",
    lastUsed: "Last used",
    guiBestFor: "Best for",
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
    cycleN: "Cycle {n}",
    fromReframed: "picking up your reframed question",
    nextCycle: "Explore this question — new cycle",
    nextCycleHint:
      "The method's pivot: run a fresh pass on your reframed question. The map starts clean; the question carries over — this is where the answer takes shape.",
    actionPlan: "Action plan",
    actionPlanIntro:
      "The best, not the perfect: small steps, a right to error. For each step — what, with whom, by when, and how you'll know it worked.",
    addStep: "Add a step",
    removeStep: "Remove this step",
    stepAction: "Action",
    stepActionPlaceholder: "What exactly will I do?",
    stepWith: "With whom",
    stepWhen: "By when",
    stepIndicator: "How I'll know it worked",
    stepSabotage: "A self-sabotage to watch",
    stepStatus: "Status",
    statusReady: "Ready",
    statusRefine: "To refine",
    statusBuild: "Still to build",
    stepN: "Step {n}",
    keywordsLabel: "Retained words",
    keywordsHint: "Mark the words that ring true — they feed your synthesis.",
    keywordAddPlaceholder: "Add a word…",
    keywordAdd: "Retain",
    keywordRemove: "Remove {word}",
    alsoAsk: "Also worth asking",
    notAdvice:
      "Q‑Art helps you think — it is not therapy, medical, or legal advice. In crisis, contact local emergency services.",
    language: "Language",
    progress: "{a} / {b}",
    steps: "Steps",
    weighting: "Weigh what matters",
    weightingHint: "Pick a method. Every method keeps a non-drag, keyboard path.",
    methodStepper: "Steppers",
    methodMaxdiff: "Most / least",
    methodMarbles: "Marbles",
    maxdiffMost: "Most",
    maxdiffLeast: "Least",
    maxdiffSet: "Set {a} / {b}",
    marblesLeft: "{n} marbles left",
    apply: "Apply",
    applied: "Applied",
    weightNeedsItems: "Check a few items first, then weigh them here.",
    crossLinks: "What recurs across your map",
    crossLinksHint: "Themes that surface in more than one area — often the real knot.",
    crossLinksAcross: "across {n} areas",
    noCrossLinks: "No themes recur yet — keep mapping.",
    priorities: "Top of your map",
    reading: "Your reading",
    readingIntro:
      "Here is what your map shows — not advice, a mirror with a memory. Take what's useful, leave the rest.",
    whatStandsOut: "What stands out",
    emptyReading:
      "Tick what rings true as you go — even two or three things — and a reading will take shape here. There's nothing to get right.",
    betterQuestion: "A better question",
    betterQuestionHint:
      "This is the pivot of the whole method: the answer usually lives inside the reframed question. It often shifts from “Should I…?” to “How do I…?”. Start from one of these, or write your own.",
    useThis: "Use this",
    oneStep: "One small step",
    oneStepHint:
      "The best step, not the perfect one — small, soon, low‑stakes. What could you try this week?",
    oneStepPlaceholder: "This week, I will…",
    refineOptional: "Weigh what matters (optional)",
    insightKnotTitle: "The knot",
    insightKnotBody:
      "“{theme}” keeps coming back — it runs through {n} of the areas you mapped. When something recurs like this, it's rarely a side issue; it's usually the centre of gravity. Start there.",
    insightTensionTitle: "The pull",
    insightTensionBody:
      "Part of you reaches for {a}. Another part holds back because of {b}. The decision lives in that tension — not in pretending either side away. Which one have you been listening to?",
    insightRoleTitle: "Your part",
    insightRoleBody:
      "You named something you do: “{a}”. Of the whole system, this is the one piece you fully control — which is exactly why it's the hardest, and the most useful, place to move.",
    insightSamenessTitle: "More of the same",
    insightSamenessBody:
      "You've been trying “{a}” — and it hasn't moved things. Often the attempted solution has quietly become the problem. The lever is to do something different, not more of the same.",
    insightPayoffTitle: "The quiet payoff",
    insightPayoffBody:
      "Staying as things are spares you something: “{a}”. That payoff is real, and naming it out loud is half of getting unstuck — what would make it worth giving up?",
    insightBeliefTitle: "An assumption worth testing",
    insightBeliefBody:
      "You're holding a belief: “{a}”. Is it always true — and when did you last test it? We don't see the world as it is, but as we are.",
    insightExceptionTitle: "When it already works",
    insightExceptionBody:
      "You noticed an exception: “{a}”. There's gold there — whatever is different in those moments is often the seed of the solution. What makes them different?",
    insightGapTitle: "Where you haven't looked yet",
    insightGapBody:
      "You moved quickly past {areas}. The answer often hides in the corner we skip — worth a glance before you decide.",
    reframeOvercome: "How do I move forward despite {theme}?",
    reframeNeed: "What is {theme} telling me — and what does it need?",
    reframeBelief: "What would change if “{theme}” weren't true?",
    reframeRole: "What is my part here — and what could I change?",
    reframeClarify: "What would actually make this decision clear?",
    reframeSmallestStep: "What is the smallest step I could test this week?",
    keep: "Keep",
    skip: "Skip",
    kept: "Kept",
    cardOf: "Card {a} / {b}",
    deckProgress: "{a} / {b}",
    keptOf: "Kept {a} of {b}",
    removeKept: "Remove from kept",
    allCardsSeen: "You've been through every card in this suit.",
    spread: "Spread",
    yourDeck: "Your deck",
    close: "Close",
    done: "Done",
    saving: "Saving…",
    saved: "Saved",
    continueSession: "Continue your last session",
    exportDossier: "Export dossier",
    importDossier: "Import dossier",
    deleteAll: "Delete all my data",
    confirmDelete: "Delete everything stored on this device? This can't be undone.",
    imported: "Dossier imported — your session is loaded.",
    importFailed: "That file isn't a Q‑Art dossier.",
    deleted: "Everything stored on this device was deleted.",
    opFailed: "Something went wrong — nothing was changed.",
    yourData: "Your data",
    dataHint:
      "Everything stays on this device, encrypted at rest. Export a backup or delete it anytime.",
    persistTitle: "Keep your work safe on this device",
    persistBody:
      "Allow persistent storage so the browser won't evict your encrypted dossiers under pressure.",
    persistAllow: "Allow",
    dismiss: "Not now",
    updateReady: "A new version is ready.",
    reload: "Reload",
    about: "About",
    aboutTitle: "About Q‑Art",
    diagnostics: "Diagnostics",
    diagnosticsHint:
      "A content-free, safe-to-share log of what the app did (codes, counts, timings — never your words). Helps fix bugs.",
    downloadDiag: "Download diagnostics",
    deepMode: "Detailed logging",
    version: "Version",
    commands: "Commands",
    jumpToBoard: "Jump to a board…",
    selectedCount: "{n} selected",
    stepOf: "Step {a} of {b}",
  },
  fr: {
    appName: "Q‑Art",
    tagline:
      "Apportez la question que vous n'arrivez pas à trancher. Repartez avec une meilleure question — et la réponse qui l'accompagne.",
    chooseDoor: "Choisissez une porte",
    pickGuiTitle: "Choisissez votre manière de travailler",
    pickGuiHint:
      "Trois entrées dans la même méthode. Changez à tout moment — votre travail vous suit.",
    switchView: "Changer de vue",
    lastUsed: "Dernière utilisée",
    guiBestFor: "Idéal pour",
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
    cycleN: "Cycle {n}",
    fromReframed: "à partir de votre question reformulée",
    nextCycle: "Explorer cette question — nouveau cycle",
    nextCycleHint:
      "Le pivot de la méthode : relancez un passage sur votre question reformulée. La carte repart à neuf ; la question vous suit — c'est là que la réponse prend forme.",
    actionPlan: "Plan d'action",
    actionPlanIntro:
      "Le meilleur, pas le parfait : de petits pas, un droit à l'erreur. Pour chaque pas — quoi, avec qui, pour quand, et comment savoir que ça a marché.",
    addStep: "Ajouter un pas",
    removeStep: "Retirer ce pas",
    stepAction: "Action",
    stepActionPlaceholder: "Que vais-je faire, concrètement ?",
    stepWith: "Avec qui",
    stepWhen: "Pour quand",
    stepIndicator: "Comment je saurai que ça a marché",
    stepSabotage: "Un auto-sabotage à surveiller",
    stepStatus: "Statut",
    statusReady: "Prêt",
    statusRefine: "À affiner",
    statusBuild: "À construire",
    stepN: "Pas {n}",
    keywordsLabel: "Mots retenus",
    keywordsHint: "Marquez les mots qui sonnent juste — ils nourrissent votre synthèse.",
    keywordAddPlaceholder: "Ajouter un mot…",
    keywordAdd: "Retenir",
    keywordRemove: "Retirer {word}",
    alsoAsk: "À se demander aussi",
    notAdvice:
      "Q‑Art vous aide à réfléchir — ce n'est ni une thérapie, ni un avis médical ou juridique. En cas de crise, contactez les services d'urgence locaux.",
    language: "Langue",
    progress: "{a} / {b}",
    steps: "Étapes",
    weighting: "Pesez ce qui compte",
    weightingHint: "Choisissez une méthode. Chacune offre un chemin clavier, sans glisser.",
    methodStepper: "Curseurs",
    methodMaxdiff: "Plus / moins",
    methodMarbles: "Billes",
    maxdiffMost: "Le plus",
    maxdiffLeast: "Le moins",
    maxdiffSet: "Série {a} / {b}",
    marblesLeft: "{n} billes restantes",
    apply: "Appliquer",
    applied: "Appliqué",
    weightNeedsItems: "Cochez d'abord quelques éléments, puis pesez-les ici.",
    crossLinks: "Ce qui revient sur votre carte",
    crossLinksHint: "Les thèmes présents dans plusieurs zones — souvent le vrai nœud.",
    crossLinksAcross: "dans {n} zones",
    noCrossLinks: "Aucun thème ne revient encore — continuez la cartographie.",
    priorities: "En haut de votre carte",
    reading: "Votre lecture",
    readingIntro:
      "Voici ce que montre votre carte — pas un conseil, un miroir qui se souvient. Prenez ce qui vous est utile, laissez le reste.",
    whatStandsOut: "Ce qui ressort",
    emptyReading:
      "Cochez ce qui sonne juste, au fil de l'eau — même deux ou trois choses — et une lecture se dessinera ici. Il n'y a rien à réussir.",
    betterQuestion: "Une meilleure question",
    betterQuestionHint:
      "C'est le pivot de toute la méthode : la réponse vit le plus souvent dans la question reformulée. On passe souvent de « Dois‑je… ? » à « Comment faire pour… ? ». Partez de l'une d'elles, ou écrivez la vôtre.",
    useThis: "Utiliser",
    oneStep: "Un petit pas",
    oneStepHint:
      "Le meilleur pas, pas le parfait — petit, bientôt, à faible enjeu. Qu'est‑ce que vous pourriez tenter cette semaine ?",
    oneStepPlaceholder: "Cette semaine, je vais…",
    refineOptional: "Pesez ce qui compte (facultatif)",
    insightKnotTitle: "Le nœud",
    insightKnotBody:
      "« {theme} » revient sans cesse — il traverse {n} des zones que vous avez cartographiées. Quand un élément revient ainsi, il est rarement secondaire ; c'est souvent le centre de gravité. Commencez par là.",
    insightTensionTitle: "La tension",
    insightTensionBody:
      "Une part de vous vise {a}. Une autre se retient à cause de {b}. La décision se joue dans cette tension — pas en niant l'un des deux côtés. Lequel écoutez‑vous depuis quelque temps ?",
    insightRoleTitle: "Votre part",
    insightRoleBody:
      "Vous avez nommé quelque chose que vous faites : « {a} ». De tout le système, c'est la seule pièce que vous maîtrisez entièrement — d'où l'endroit le plus difficile, et le plus utile, où agir.",
    insightSamenessTitle: "Toujours pareil",
    insightSamenessBody:
      "Vous essayez « {a} » — sans que les choses bougent. Souvent, la solution tentée est devenue le problème. Le levier, c'est de faire autrement, pas davantage de la même chose.",
    insightPayoffTitle: "Le bénéfice caché",
    insightPayoffBody:
      "Rester ainsi vous épargne quelque chose : « {a} ». Ce bénéfice est réel, et le nommer à voix haute, c'est déjà à moitié se débloquer — qu'est‑ce qui vaudrait la peine d'y renoncer ?",
    insightBeliefTitle: "Un postulat à tester",
    insightBeliefBody:
      "Vous tenez un postulat : « {a} ». Est‑il toujours vrai — et quand l'avez‑vous testé pour la dernière fois ? On ne voit pas le monde tel qu'il est, mais tel qu'on est.",
    insightExceptionTitle: "Quand ça marche déjà",
    insightExceptionBody:
      "Vous avez repéré une exception : « {a} ». Il y a de l'or là — ce qui diffère dans ces moments est souvent la graine de la solution. Qu'est‑ce qui les rend différents ?",
    insightGapTitle: "Là où vous n'avez pas encore regardé",
    insightGapBody:
      "Vous avez vite passé {areas}. La réponse se cache souvent dans le coin qu'on saute — un coup d'œil avant de décider en vaut la peine.",
    reframeOvercome: "Comment avancer malgré {theme} ?",
    reframeNeed: "Que me dit {theme} — et de quoi a‑t‑elle besoin ?",
    reframeBelief: "Qu'est‑ce qui changerait si « {theme} » n'était pas vrai ?",
    reframeRole: "Quel est mon rôle ici — et que puis‑je changer ?",
    reframeClarify: "Qu'est‑ce qui rendrait vraiment cette décision claire ?",
    reframeSmallestStep: "Quel est le plus petit pas que je pourrais tester cette semaine ?",
    keep: "Garder",
    skip: "Passer",
    kept: "Gardé",
    cardOf: "Carte {a} / {b}",
    deckProgress: "{a} / {b}",
    keptOf: "Gardées : {a} sur {b}",
    removeKept: "Retirer des cartes gardées",
    allCardsSeen: "Vous avez parcouru toutes les cartes de cette série.",
    spread: "Vue d'ensemble",
    yourDeck: "Votre jeu",
    close: "Fermer",
    done: "Terminé",
    saving: "Enregistrement…",
    saved: "Enregistré",
    continueSession: "Reprendre votre dernière session",
    exportDossier: "Exporter le dossier",
    importDossier: "Importer un dossier",
    deleteAll: "Supprimer toutes mes données",
    confirmDelete: "Tout supprimer de cet appareil ? Cette action est irréversible.",
    imported: "Dossier importé — votre session est chargée.",
    importFailed: "Ce fichier n'est pas un dossier Q‑Art.",
    deleted: "Tout ce qui était stocké sur cet appareil a été supprimé.",
    opFailed: "Quelque chose n'a pas fonctionné — rien n'a été modifié.",
    yourData: "Vos données",
    dataHint:
      "Tout reste sur cet appareil, chiffré au repos. Exportez une sauvegarde ou supprimez à tout moment.",
    persistTitle: "Gardez votre travail en sécurité sur cet appareil",
    persistBody:
      "Autorisez le stockage persistant pour que le navigateur n'efface pas vos dossiers chiffrés.",
    persistAllow: "Autoriser",
    dismiss: "Plus tard",
    updateReady: "Une nouvelle version est prête.",
    reload: "Recharger",
    about: "À propos",
    aboutTitle: "À propos de Q‑Art",
    diagnostics: "Diagnostics",
    diagnosticsHint:
      "Un journal sans contenu, partageable en confiance, de ce qu'a fait l'app (codes, comptes, durées — jamais vos mots). Aide à corriger les bugs.",
    downloadDiag: "Télécharger les diagnostics",
    deepMode: "Journalisation détaillée",
    version: "Version",
    commands: "Commandes",
    jumpToBoard: "Aller à un tableau…",
    selectedCount: "{n} sélectionné(s)",
    stepOf: "Étape {a} sur {b}",
  },
};
