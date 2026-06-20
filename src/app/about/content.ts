/**
 * In-app Help/About copy (bilingual). Kept here, not in the UI dictionary, so the
 * longer prose stays together and is covered by its own FR/EN parity test.
 */
import type { LocalizedText } from "@/lib/qart";

export interface AboutSection {
  heading: LocalizedText;
  body: LocalizedText;
}

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    heading: { en: "What Q‑Art is for", fr: "À quoi sert Q‑Art" },
    body: {
      en: "When a decision matters, we reach for a reflex answer — the quickest way to stop the discomfort. Q‑Art slows that reflex down. It walks your question across many facets — what's really at stake, who's involved, what you feel, what you're avoiding — so the decision rests on the whole picture, not its loudest part.",
      fr: "Quand une décision compte, on saisit une réponse réflexe — le moyen le plus rapide de faire cesser l'inconfort. Q‑Art ralentit ce réflexe. Il parcourt votre question sous de nombreuses facettes — ce qui est vraiment en jeu, qui est concerné, ce que vous ressentez, ce que vous évitez — pour décider sur l'ensemble du tableau, pas sur sa partie la plus bruyante.",
    },
  },
  {
    heading: {
      en: "From a question to a better question",
      fr: "D'une question à une meilleure question",
    },
    body: {
      en: "You don't leave with a verdict. You leave with a clearer, often reframed question — the one that, once asked well, carries its own answer. Q‑Art highlights the themes that recur across facets (the croisements), weighs what matters most, and restates your question in your own words.",
      fr: "Vous ne repartez pas avec un verdict. Vous repartez avec une question plus claire, souvent reformulée — celle qui, bien posée, porte sa propre réponse. Q‑Art met en évidence les thèmes qui reviennent d'une facette à l'autre (les croisements), pèse ce qui compte le plus, et reformule votre question avec vos mots.",
    },
  },
  {
    heading: { en: "Three ways in", fr: "Trois entrées" },
    body: {
      en: "One method, three doors. Atlas is a structured workbench; Socrate is a calm guided dialogue; Cartes is a tactile card deck. Pick what fits the moment — and switch anytime without losing a thing, because all three write the same decision.",
      fr: "Une méthode, trois portes. Atlas est un établi structuré ; Socrate, un dialogue guidé et apaisé ; Cartes, un jeu de cartes tactile. Choisissez ce qui convient au moment — et changez à tout instant sans rien perdre, car les trois écrivent la même décision.",
    },
  },
  {
    heading: { en: "Your privacy", fr: "Votre vie privée" },
    body: {
      en: "Q‑Art v1 is fully local. Your decision content never leaves your device — no account, no server, no tracking. What you write is stored on this device, encrypted at rest. Export a portable backup or delete everything at any time, from the synthesis of any door.",
      fr: "Q‑Art v1 est entièrement local. Le contenu de vos décisions ne quitte jamais votre appareil — pas de compte, pas de serveur, pas de pistage. Ce que vous écrivez est stocké sur cet appareil, chiffré au repos. Exportez une sauvegarde portable ou supprimez tout à tout moment, depuis la synthèse de chaque porte.",
    },
  },
  {
    heading: { en: "Accessibility", fr: "Accessibilité" },
    body: {
      en: "Q‑Art targets WCAG 2.2 AA. Every interaction works by keyboard with no drag required, touch targets are generous, and the interface respects your reduced‑motion and colour‑scheme preferences. If something blocks you, that's a bug — please report it.",
      fr: "Q‑Art vise le niveau WCAG 2.2 AA. Chaque interaction fonctionne au clavier, sans glisser‑déposer ; les cibles tactiles sont généreuses ; l'interface respecte vos préférences de mouvement réduit et de thème. Si quelque chose vous bloque, c'est un bug — merci de le signaler.",
    },
  },
];

/** The safeguarding notice + crisis signposting (ADR-017) — reachable from every GUI. */
export const SAFEGUARDING: AboutSection = {
  heading: { en: "Not advice — and where to turn", fr: "Pas un avis — et vers qui se tourner" },
  body: {
    en: "Q‑Art helps you think. It is not therapy, and not medical, legal, or financial advice. If you're in distress or thinking of harming yourself, please reach out now: in immediate danger, call your local emergency number (112 in the EU, 911 in the US, 999 in the UK). For support, contact a local crisis line or your doctor — you don't have to sort this out alone.",
    fr: "Q‑Art vous aide à réfléchir. Ce n'est pas une thérapie, ni un avis médical, juridique ou financier. Si vous êtes en détresse ou pensez à vous faire du mal, demandez de l'aide maintenant : en cas de danger immédiat, appelez votre numéro d'urgence local (112 dans l'UE, 911 aux États‑Unis, 999 au Royaume‑Uni). Pour du soutien, contactez une ligne d'écoute locale ou votre médecin — vous n'avez pas à affronter cela seul(e).",
  },
};
