/**
 * Rubric metadata (intent, motto, open prompts) and the 7-board packaging.
 * Sourced from `docs/concept.md` §3.2 and `docs/schema.md` §4. Content is IP.
 */
import type { Board, LocalizedText, RubricKey } from "./types";

/** The 10 exploration rubrics, in canonical order. */
export const RUBRIC_KEYS = [
  "framing_beliefs",
  "stakeholders",
  "emotions",
  "ideal_scene",
  "objective_benefits",
  "resources",
  "tried",
  "obstacles",
  "risks",
  "timing",
] as const satisfies readonly RubricKey[];

export interface RubricMeta {
  key: RubricKey;
  label: LocalizedText;
  motto?: LocalizedText;
  intent: LocalizedText;
  openPrompts: LocalizedText[];
}

export const RUBRIC_META: Record<RubricKey, RubricMeta> = {
  framing_beliefs: {
    key: "framing_beliefs",
    label: { en: "Framing & beliefs", fr: "Cadrage & croyances" },
    motto: {
      en: "I don't see the world as it is, but as I am.",
      fr: "Je ne vois pas le monde tel qu'il est, mais tel que je suis.",
    },
    intent: {
      en: "Confirm there's a real, actionable problem; surface the assumptions coloring it.",
      fr: "Confirmer qu'il y a un vrai problème actionnable ; révéler les postulats qui le colorent.",
    },
    openPrompts: [
      {
        en: "In what way is this a problem, and for whom?",
        fr: "En quoi est-ce un problème, et pour qui ?",
      },
      { en: "What are the concrete signs?", fr: "Quels en sont les signes concrets ?" },
      { en: "What am I taking for granted?", fr: "Qu'est-ce que je tiens pour acquis ?" },
    ],
  },
  stakeholders: {
    key: "stakeholders",
    label: { en: "Stakeholders & my role", fr: "Parties prenantes & mon rôle" },
    motto: {
      en: "The other is the mirror of my behaviors.",
      fr: "L'autre est le miroir de mes comportements.",
    },
    intent: {
      en: "Map who's involved — and, crucially, the part I play in keeping it going.",
      fr: "Cartographier qui est concerné — et surtout le rôle que je joue dans la situation.",
    },
    openPrompts: [
      { en: "Who is affected, and how much?", fr: "Qui est concerné, et dans quelle mesure ?" },
      { en: "What role do I play with the others?", fr: "Quel rôle je joue avec les autres ?" },
      {
        en: "How might I be feeding this?",
        fr: "Comment se peut-il que j'alimente la situation ?",
      },
    ],
  },
  emotions: {
    key: "emotions",
    label: { en: "Emotions", fr: "Émotions" },
    motto: { en: "Emotion is the engine of change.", fr: "L'émotion est le moteur du changement." },
    intent: {
      en: "Name the feeling, accept it, and use it as energy for change.",
      fr: "Nommer l'émotion, l'accepter, et s'en servir comme énergie de changement.",
    },
    openPrompts: [
      { en: "What do I feel, and where?", fr: "Qu'est-ce que j'éprouve, et où ?" },
      { en: "What is the emotion telling me?", fr: "Que me dit cette émotion ?" },
      { en: "Does it show up elsewhere too?", fr: "Apparaît-elle aussi ailleurs ?" },
    ],
  },
  ideal_scene: {
    key: "ideal_scene",
    label: { en: "Ideal scene", fr: "Scène idéale" },
    motto: {
      en: "To act is to have the faculty to desire.",
      fr: "Agir, c'est avoir la faculté de désirer.",
    },
    intent: {
      en: "Picture the situation without the problem; find the exceptions that already exist.",
      fr: "Imaginer la situation sans le problème ; trouver les exceptions qui existent déjà.",
    },
    openPrompts: [
      {
        en: "Describe it solved — what's different?",
        fr: "Décrivez-la résolue — qu'est-ce qui change ?",
      },
      { en: "When does the problem not show up?", fr: "Quand le problème n'apparaît-il pas ?" },
      {
        en: "What could I borrow from those moments?",
        fr: "Que puis-je emprunter à ces moments-là ?",
      },
    ],
  },
  objective_benefits: {
    key: "objective_benefits",
    label: { en: "Objective & benefits", fr: "Objectif & bénéfices" },
    motto: { en: "Progress, not perfection.", fr: "Le progrès, pas la perfection." },
    intent: {
      en: "A concrete, realistic objective, the benefits of reaching it, and how I'll know.",
      fr: "Un objectif concret et réaliste, les bénéfices attendus, et comment je le saurai.",
    },
    openPrompts: [
      {
        en: "What exactly do I want, by when?",
        fr: "Qu'est-ce que je veux exactement, et pour quand ?",
      },
      { en: "What will I gain?", fr: "Qu'est-ce que j'y gagne ?" },
      { en: "What sign will tell me it's working?", fr: "Quel signe me dira que ça marche ?" },
    ],
  },
  resources: {
    key: "resources",
    label: { en: "Resources & levers", fr: "Ressources & leviers" },
    intent: {
      en: "What I can genuinely draw on — beyond people: time, money, skills, services.",
      fr: "Ce sur quoi je peux vraiment m'appuyer — au-delà des personnes : temps, argent, compétences, services.",
    },
    openPrompts: [
      { en: "What do I already have going for me?", fr: "Qu'est-ce que j'ai déjà pour moi ?" },
      { en: "Who or what can help?", fr: "Qui ou quoi peut m'aider ?" },
    ],
  },
  tried: {
    key: "tried",
    label: { en: "Solutions already tried", fr: "Solutions déjà tentées" },
    motto: {
      en: "The more it changes, the more it's the same.",
      fr: "Plus ça change, plus c'est la même chose.",
    },
    intent: {
      en: "Surface what's been tried and its result; spot 'more of the same'.",
      fr: "Révéler ce qui a déjà été tenté et son résultat ; repérer le « toujours plus de la même chose ».",
    },
    openPrompts: [
      { en: "What have I tried, with what result?", fr: "Qu'ai-je tenté, avec quel résultat ?" },
      { en: "What would be genuinely different?", fr: "Qu'est-ce qui serait vraiment différent ?" },
    ],
  },
  obstacles: {
    key: "obstacles",
    label: { en: "Brakes & obstacles", fr: "Freins & obstacles" },
    motto: {
      en: "It is the fear of success that sometimes explains failure.",
      fr: "C'est la peur de réussir qui parfois explique l'échec.",
    },
    intent: {
      en: "Name what's in the way — including the hidden payoff of not deciding.",
      fr: "Nommer ce qui bloque — y compris le bénéfice caché à ne pas décider.",
    },
    openPrompts: [
      { en: "What's blocking this?", fr: "Qu'est-ce qui bloque ?" },
      {
        en: "What does staying as-is spare me from?",
        fr: "De quoi le statu quo me dispense-t-il ?",
      },
    ],
  },
  risks: {
    key: "risks",
    label: { en: "Risks & the price of deciding", fr: "Risques & le prix de la décision" },
    intent: {
      en: "Near-certain consequences if I don't resolve this — and the price if I do.",
      fr: "Les conséquences quasi certaines si je ne résous pas — et le prix à payer si je décide.",
    },
    openPrompts: [
      {
        en: "What is almost certain if nothing changes?",
        fr: "Qu'est-ce qui est presque certain si rien ne change ?",
      },
      {
        en: "What would I have to give up to decide?",
        fr: "À quoi devrais-je renoncer pour décider ?",
      },
    ],
  },
  timing: {
    key: "timing",
    label: { en: "Timing", fr: "Délais d'action" },
    motto: {
      en: "Even a good decision is the wrong decision when it's made too late.",
      fr: "Même une bonne décision est mauvaise quand elle est prise trop tard.",
    },
    intent: {
      en: "The real timeframe — and whether the deadline is real or chosen.",
      fr: "Le vrai délai — et si l'échéance est réelle ou choisie.",
    },
    openPrompts: [
      { en: "By when must I act?", fr: "Pour quand dois-je agir ?" },
      {
        en: "Is the deadline real, or one I'm choosing?",
        fr: "L'échéance est-elle réelle, ou choisie ?",
      },
    ],
  },
};

/** The 7 boards + synthesis (presentation grouping of the flat rubrics). */
export const BOARDS: Board[] = [
  {
    id: "b1",
    title: { en: "Question & framing", fr: "Question & cadrage" },
    rubrics: ["framing_beliefs"],
    includesQuestion: true,
  },
  {
    id: "b2",
    title: { en: "Stakeholders & my role", fr: "Parties prenantes & mon rôle" },
    rubrics: ["stakeholders"],
  },
  { id: "b3", title: { en: "Emotions", fr: "Émotions" }, rubrics: ["emotions"] },
  {
    id: "b4",
    title: { en: "Direction", fr: "Direction" },
    rubrics: ["ideal_scene", "objective_benefits"],
  },
  {
    id: "b5",
    title: { en: "Means & history", fr: "Moyens & historique" },
    rubrics: ["resources", "tried"],
  },
  {
    id: "b6",
    title: { en: "Forces against & cost", fr: "Forces contraires & coût" },
    rubrics: ["obstacles", "risks"],
  },
  {
    id: "b7",
    title: { en: "Commitment", fr: "Engagement" },
    rubrics: ["timing"],
    includesActionPlan: true,
  },
  { id: "synthesis", title: { en: "Synthesis", fr: "Synthèse" }, rubrics: [], isSynthesis: true },
];

/**
 * The Cartes deck (ADR-018): the same rubrics as a one-card-at-a-time deck — a
 * question card, one card per rubric, then a synthesis card. A genuinely
 * different granularity from Atlas's 7 boards, written to the same object.
 */
export type CartesCardKind = "question" | "rubric" | "synthesis";
export interface CartesCard {
  id: string;
  kind: CartesCardKind;
  rubric?: RubricKey;
}

export const CARTES_DECK: CartesCard[] = [
  { id: "card_question", kind: "question" },
  ...RUBRIC_KEYS.map((rubric): CartesCard => ({ id: `card_${rubric}`, kind: "rubric", rubric })),
  { id: "card_synthesis", kind: "synthesis" },
];
