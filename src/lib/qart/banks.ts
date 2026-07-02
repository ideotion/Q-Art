/**
 * Curated QCM banks (v0.1 seed) — proprietary IP content, from `docs/question-banks.md`.
 * Bilingual EN/FR. A seed subset per rubric; expand with use. `sharedWith` marks the
 * deliberate cross-rubric recurrence that *croisements* detect; risk items carry
 * org/family/self tags. Item ids are stable identifiers (not display text).
 */
import type { ID, Locale, QcmBank, QcmItem, RubricKey } from "./types";

const items = (xs: QcmItem[]) => xs;

export const QCM_BANKS: Record<RubricKey, QcmBank> = {
  framing_beliefs: {
    rubric: "framing_beliefs",
    items: items([
      {
        id: "framing_real_problem",
        label: {
          en: "It's a real problem, not a passing annoyance.",
          fr: "C'est un vrai problème, pas une contrariété passagère.",
        },
      },
      {
        id: "framing_unsure",
        label: {
          en: "I'm not actually sure it's a problem.",
          fr: "Je ne suis pas sûr(e) que ce soit un problème.",
        },
      },
      {
        id: "framing_affects_me",
        label: { en: "It mostly affects me.", fr: "Cela me concerne surtout moi." },
      },
      {
        id: "framing_affects_others",
        label: { en: "It mostly affects others.", fr: "Cela concerne surtout les autres." },
      },
      {
        id: "framing_mine_to_act",
        label: { en: "It's mine to act on.", fr: "C'est à moi d'agir." },
      },
      {
        id: "framing_influence",
        label: {
          en: "I can clearly influence the outcome.",
          fr: "Je peux clairement influencer l'issue.",
        },
      },
      {
        id: "belief_handle_alone",
        label: { en: "I have to handle everything myself.", fr: "Je dois tout gérer moi-même." },
      },
      {
        id: "belief_perfect",
        label: {
          en: "If I'm not perfect, I've failed.",
          fr: "Si je ne suis pas parfait(e), j'ai échoué.",
        },
      },
      {
        id: "belief_all_or_nothing",
        label: { en: "It's all or nothing.", fr: "C'est tout ou rien." },
      },
      {
        id: "belief_emotion_weak",
        label: {
          en: "Showing emotion is a weakness.",
          fr: "Montrer ses émotions est une faiblesse.",
        },
        sharedWith: ["emotions"],
      },
      {
        id: "framing_partly_others",
        label: {
          en: "It's partly someone else's to act on.",
          fr: "Cela relève en partie de quelqu'un d'autre.",
        },
      },
      {
        id: "framing_little_control",
        label: {
          en: "I have little control over it.",
          fr: "J'ai peu de prise dessus.",
        },
      },
      {
        id: "framing_avoided_naming",
        label: {
          en: "I've been avoiding naming it plainly.",
          fr: "J'évite de le nommer clairement.",
        },
      },
      {
        id: "belief_trust_earned",
        label: {
          en: "Trust has to be earned before I give any.",
          fr: "La confiance doit se mériter avant que je l'accorde.",
        },
        sharedWith: ["stakeholders"],
      },
      {
        id: "belief_please",
        label: {
          en: "I must please others, or I'm worth nothing.",
          fr: "Je dois plaire aux autres, sinon je ne vaux rien.",
        },
      },
      {
        id: "belief_mistake_authority",
        label: {
          en: "Admitting a mistake means losing authority.",
          fr: "Reconnaître une erreur, c'est perdre son autorité.",
        },
      },
      {
        id: "belief_not_contradict",
        label: {
          en: "One must not contradict one's hierarchy.",
          fr: "On ne doit pas contredire sa hiérarchie.",
        },
      },
      {
        id: "belief_speak_certain",
        label: {
          en: "One should only speak when certain.",
          fr: "On ne devrait parler que si l'on est certain.",
        },
      },
      {
        id: "belief_always_never",
        label: {
          en: 'I catch myself saying "always / never / everyone".',
          fr: "Je me surprends à dire « toujours / jamais / tout le monde ».",
        },
      },
    ]),
  },
  stakeholders: {
    rubric: "stakeholders",
    items: items([
      {
        id: "stk_family",
        label: {
          en: "my partner / family / close ones",
          fr: "mon/ma partenaire, ma famille, mes proches",
        },
      },
      {
        id: "stk_team",
        label: {
          en: "my team / colleagues / business partners",
          fr: "mon équipe, mes collègues, mes associés",
        },
      },
      { id: "stk_clients", label: { en: "my clients / customers", fr: "mes clients" } },
      {
        id: "stk_hierarchy",
        label: { en: "my manager / hierarchy / investors", fr: "ma hiérarchie, mes investisseurs" },
      },
      { id: "stk_only_me", label: { en: "only me", fr: "moi seulement" } },
      {
        id: "role_overhelp",
        label: {
          en: "I tend to take on others' problems / over-help.",
          fr: "J'ai tendance à prendre les problèmes des autres / à trop aider.",
        },
      },
      {
        id: "role_control",
        label: {
          en: "I push, control, or blame others.",
          fr: "Je pousse, je contrôle ou je blâme les autres.",
        },
      },
      {
        id: "role_silent",
        label: {
          en: "I keep it alive by staying silent / avoiding.",
          fr: "Je l'entretiens en me taisant / en évitant.",
        },
      },
      {
        id: "role_waiting",
        label: {
          en: "I'm waiting for someone else to move first.",
          fr: "J'attends que quelqu'un d'autre bouge en premier.",
        },
      },
      {
        id: "stk_friends",
        label: {
          en: "my friends / my network",
          fr: "mes amis, mon réseau",
        },
      },
      {
        id: "stk_board",
        label: {
          en: "the board / my co-directors",
          fr: "le conseil, mes coadministrateurs",
        },
      },
      {
        id: "stk_authority",
        label: {
          en: "a regulator / an authority",
          fr: "un régulateur, une autorité",
        },
      },
      {
        id: "role_victim",
        label: {
          en: "I feel wronged or stuck in it.",
          fr: "Je me sens lésé(e) ou coincé(e).",
        },
      },
      {
        id: "role_we_they",
        label: {
          en: 'I keep saying "we / they / one" instead of "I".',
          fr: "Je dis « on / ils » au lieu de « je ».",
        },
      },
    ]),
  },
  emotions: {
    rubric: "emotions",
    items: items([
      { id: "emo_fear", label: { en: "fear / anxiety", fr: "peur / anxiété" } },
      { id: "emo_anger", label: { en: "anger / frustration", fr: "colère / frustration" } },
      {
        id: "emo_sadness",
        label: { en: "sadness / discouragement", fr: "tristesse / découragement" },
      },
      { id: "emo_guilt", label: { en: "guilt / shame", fr: "culpabilité / honte" } },
      {
        id: "emo_relief",
        label: { en: "relief (at least sometimes)", fr: "soulagement (au moins parfois)" },
      },
      { id: "emo_hope", label: { en: "hope / excitement", fr: "espoir / enthousiasme" } },
      {
        id: "emo_unknown",
        label: {
          en: "I don't really know what I feel.",
          fr: "Je ne sais pas vraiment ce que je ressens.",
        },
      },
      { id: "emo_intense", label: { en: "the feeling is intense", fr: "l'émotion est intense" } },
      {
        id: "emo_familiar",
        label: {
          en: "I recognize this feeling from other situations.",
          fr: "Je reconnais cette émotion d'autres situations.",
        },
      },
      {
        id: "emo_overwhelm",
        label: {
          en: "overwhelm / feeling swamped",
          fr: "débordement / sensation d'être submergé(e)",
        },
      },
      {
        id: "emo_resentment",
        label: {
          en: "resentment / bitterness",
          fr: "ressentiment / amertume",
        },
      },
      {
        id: "emo_loneliness",
        label: {
          en: "loneliness in the decision",
          fr: "solitude dans la décision",
        },
      },
      {
        id: "emo_mild",
        label: {
          en: "the feeling is mild",
          fr: "l'émotion est légère",
        },
      },
      {
        id: "emo_engine",
        label: {
          en: "I can feel this emotion as energy to act.",
          fr: "Je peux sentir cette émotion comme une énergie pour agir.",
        },
      },
    ]),
  },
  ideal_scene: {
    rubric: "ideal_scene",
    items: items([
      {
        id: "ideal_picture",
        label: {
          en: "I can clearly picture the situation resolved.",
          fr: "Je peux clairement imaginer la situation résolue.",
        },
      },
      {
        id: "ideal_exceptions",
        label: {
          en: "There are already moments when the problem doesn't appear.",
          fr: "Il y a déjà des moments où le problème n'apparaît pas.",
        },
      },
      {
        id: "ideal_clear_terms",
        label: {
          en: "When it goes well, I set clear terms up front.",
          fr: "Quand ça va bien, je pose des conditions claires d'emblée.",
        },
      },
      { id: "ideal_ask_help", label: { en: "…I ask for help.", fr: "…je demande de l'aide." } },
      { id: "ideal_say_no", label: { en: "…I say no.", fr: "…je dis non." } },
      {
        id: "ideal_feel_calm",
        label: {
          en: "In the ideal, I'd feel calm and in control.",
          fr: "Dans l'idéal, je me sentirais calme et maître de la situation.",
        },
      },
      {
        id: "ideal_rarely_dream",
        label: {
          en: "I rarely let myself imagine the ideal.",
          fr: "Je m'autorise rarement à imaginer l'idéal.",
        },
      },
      {
        id: "ideal_plan_ahead",
        label: {
          en: "…I plan ahead.",
          fr: "…je planifie à l'avance.",
        },
      },
      {
        id: "ideal_someone_else",
        label: {
          en: "…someone else is involved.",
          fr: "…quelqu'un d'autre est impliqué.",
        },
      },
      {
        id: "ideal_feel_free",
        label: {
          en: "In the ideal, I'd feel free and proud.",
          fr: "Dans l'idéal, je me sentirais libre et fier(ère).",
        },
      },
      {
        id: "ideal_borrow",
        label: {
          en: "I could borrow what works in those good moments.",
          fr: "Je pourrais m'inspirer de ce qui marche dans ces bons moments.",
        },
      },
      {
        id: "ideal_innovating",
        label: {
          en: "Imagining the ideal reveals an element that could solve it.",
          fr: "Imaginer l'idéal révèle un élément qui pourrait le résoudre.",
        },
      },
    ]),
  },
  objective_benefits: {
    rubric: "objective_benefits",
    items: items([
      {
        id: "obj_concrete",
        label: {
          en: "My goal is concrete and specific.",
          fr: "Mon objectif est concret et précis.",
        },
      },
      {
        id: "obj_vague",
        label: { en: "My goal is still vague.", fr: "Mon objectif est encore flou." },
      },
      {
        id: "obj_realistic",
        label: { en: "It's realistic given my situation.", fr: "Il est réaliste vu ma situation." },
      },
      { id: "ben_time", label: { en: "more time / energy", fr: "plus de temps / d'énergie" } },
      {
        id: "ben_peace",
        label: { en: "less stress / more peace of mind", fr: "moins de stress / plus de sérénité" },
      },
      {
        id: "ben_relationships",
        label: { en: "better relationships", fr: "de meilleures relations" },
      },
      {
        id: "ben_income",
        label: {
          en: "more income / financial security",
          fr: "plus de revenus / de sécurité financière",
        },
      },
      {
        id: "ben_freedom",
        label: { en: "more freedom / autonomy", fr: "plus de liberté / d'autonomie" },
      },
      {
        id: "ben_confidence",
        label: { en: "self-respect / confidence", fr: "estime de soi / confiance" },
      },
      {
        id: "obj_indicator",
        label: {
          en: "I can name an observable sign of progress.",
          fr: "Je peux nommer un signe observable de progrès.",
        },
      },
      {
        id: "obj_too_ambitious",
        label: {
          en: "It may be too ambitious for now.",
          fr: "Il est peut-être trop ambitieux pour l'instant.",
        },
      },
      {
        id: "obj_has_date",
        label: {
          en: "It has a clear date or duration.",
          fr: "Il a une date ou une durée claire.",
        },
      },
      {
        id: "ben_growth",
        label: {
          en: "growth / new opportunities",
          fr: "de la croissance / de nouvelles opportunités",
        },
      },
      {
        id: "ben_reputation",
        label: {
          en: "a stronger reputation or standing",
          fr: "une meilleure réputation, une meilleure position",
        },
      },
      {
        id: "ben_team_morale",
        label: {
          en: "a re-motivated team",
          fr: "une équipe re-motivée",
        },
      },
      {
        id: "obj_progress_not_perfection",
        label: {
          en: "I'll aim for progress, not perfection.",
          fr: "Je viserai le progrès, pas la perfection.",
        },
      },
    ]),
  },
  resources: {
    rubric: "resources",
    items: items([
      {
        id: "res_skills",
        label: { en: "my own skills / experience", fr: "mes compétences / mon expérience" },
      },
      { id: "res_time", label: { en: "time I can free up", fr: "du temps que je peux libérer" } },
      { id: "res_money", label: { en: "money / budget", fr: "de l'argent / un budget" } },
      {
        id: "res_people",
        label: {
          en: "people who can help (family, friends, a mentor, peers)",
          fr: "des personnes qui peuvent aider (famille, amis, mentor, pairs)",
        },
      },
      {
        id: "res_team",
        label: { en: "my team / collaborators", fr: "mon équipe / mes collaborateurs" },
      },
      {
        id: "res_tools",
        label: {
          en: "tools, training, or outside services",
          fr: "des outils, formations ou services externes",
        },
      },
      {
        id: "res_past",
        label: {
          en: "past successes I can build on",
          fr: "des réussites passées sur lesquelles m'appuyer",
        },
      },
      { id: "res_health", label: { en: "my health / energy", fr: "ma santé / mon énergie" } },
      {
        id: "res_network",
        label: {
          en: "my network / peers in the same boat",
          fr: "mon réseau, des pairs dans la même situation",
        },
      },
      {
        id: "res_info",
        label: {
          en: "information I can still gather",
          fr: "des informations que je peux encore réunir",
        },
      },
      {
        id: "res_subcontract",
        label: {
          en: "subcontracting / delegation",
          fr: "la sous-traitance, la délégation",
        },
      },
      {
        id: "res_resilience",
        label: {
          en: "my resilience / what I've overcome before",
          fr: "ma résilience, ce que j'ai déjà surmonté",
        },
      },
      {
        id: "res_advisor",
        label: {
          en: "a trusted advisor (coach, accountant, lawyer)",
          fr: "un conseil de confiance (coach, comptable, avocat)",
        },
      },
    ]),
  },
  tried: {
    rubric: "tried",
    items: items([
      {
        id: "try_talk",
        label: { en: "I've tried talking it out.", fr: "J'ai essayé d'en parler." },
      },
      {
        id: "try_harder",
        label: {
          en: "I've tried working harder / more of the same.",
          fr: "J'ai essayé de travailler plus / toujours pareil.",
        },
      },
      {
        id: "try_wait",
        label: { en: "I've tried waiting it out.", fr: "J'ai essayé d'attendre que ça passe." },
      },
      { id: "try_avoid", label: { en: "I've tried avoiding it.", fr: "J'ai essayé de l'éviter." } },
      {
        id: "try_advice",
        label: {
          en: "I've tried getting advice or help.",
          fr: "J'ai essayé de demander conseil ou de l'aide.",
        },
      },
      {
        id: "try_nothing_changed",
        label: {
          en: "Nothing has really changed (status quo).",
          fr: "Rien n'a vraiment changé (statu quo).",
        },
      },
      {
        id: "try_worse",
        label: {
          en: "What I keep doing may be making it worse.",
          fr: "Ce que je continue de faire empire peut-être les choses.",
        },
      },
      {
        id: "try_delegate_takeback",
        label: {
          en: "I've tried delegating, then taking it back.",
          fr: "J'ai essayé de déléguer, puis de reprendre la main.",
        },
      },
      {
        id: "try_control_more",
        label: {
          en: "I've tried controlling it more tightly.",
          fr: "J'ai essayé de tout contrôler de plus près.",
        },
      },
      {
        id: "try_ultimatum",
        label: {
          en: "I've tried an ultimatum or pressure.",
          fr: "J'ai essayé l'ultimatum ou la pression.",
        },
      },
      {
        id: "try_never_tested",
        label: {
          en: "I've assumed the answer without ever testing it.",
          fr: "J'ai supposé la réponse sans jamais la tester.",
        },
      },
      {
        id: "try_same_person",
        label: {
          en: "I keep turning to the same person or approach.",
          fr: "Je me tourne toujours vers la même personne ou approche.",
        },
      },
    ]),
  },
  obstacles: {
    rubric: "obstacles",
    items: items([
      {
        id: "obs_other_blocks",
        label: { en: "another person is blocking it", fr: "une autre personne bloque" },
      },
      {
        id: "obs_not_enough",
        label: {
          en: "not enough time, money, skills, or information",
          fr: "pas assez de temps, d'argent, de compétences ou d'informations",
        },
      },
      {
        id: "obs_fear_consequences",
        label: { en: "fear of the consequences", fr: "peur des conséquences" },
        sharedWith: ["risks", "emotions"],
      },
      {
        id: "obs_fear_conflict",
        label: {
          en: "fear of conflict / disappointing someone",
          fr: "peur du conflit / de décevoir",
        },
        sharedWith: ["emotions", "stakeholders"],
      },
      {
        id: "obs_fear_fail",
        label: { en: "fear of failing — or of succeeding", fr: "peur d'échouer — ou de réussir" },
      },
      {
        id: "obs_avoid_conversation",
        label: {
          en: "not deciding lets me avoid a hard conversation",
          fr: "ne pas décider m'évite une conversation difficile",
        },
      },
      {
        id: "obs_comfortable",
        label: {
          en: "staying as-is is comfortable and familiar",
          fr: "rester ainsi est confortable et familier",
        },
      },
      {
        id: "obs_not_ready",
        label: { en: "I don't feel ready.", fr: "Je ne me sens pas prêt(e)." },
      },
      {
        id: "obs_avoid_responsibility",
        label: {
          en: "not deciding lets me avoid responsibility or change",
          fr: "ne pas décider m'évite la responsabilité ou le changement",
        },
      },
      {
        id: "obs_dont_know_how",
        label: {
          en: "I don't know how to start.",
          fr: "Je ne sais pas par où commencer.",
        },
      },
      {
        id: "obs_loyalty",
        label: {
          en: "loyalty or guilt holds me back",
          fr: "la loyauté ou la culpabilité me retient",
        },
      },
      {
        id: "obs_sunk_cost",
        label: {
          en: "I've already invested too much to change now.",
          fr: "J'ai déjà trop investi pour changer maintenant.",
        },
        sharedWith: ["risks"],
      },
      {
        id: "obs_resistance_useful",
        label: {
          en: "my resistance has a useful function I haven't named",
          fr: "ma résistance a une fonction utile que je n'ai pas nommée",
        },
      },
    ]),
  },
  risks: {
    rubric: "risks",
    items: items([
      {
        id: "risk_org_productivity",
        label: {
          en: "lost productivity or performance",
          fr: "perte de productivité ou de performance",
        },
        tags: ["org"],
      },
      {
        id: "risk_org_people",
        label: {
          en: "losing key people / rising turnover",
          fr: "départ de personnes clés / turnover en hausse",
        },
        tags: ["org"],
      },
      {
        id: "risk_org_clients",
        label: { en: "losing clients / market share", fr: "perte de clients / de parts de marché" },
        tags: ["org"],
      },
      {
        id: "risk_org_cash",
        label: {
          en: "rising costs / cash-flow strain / debt",
          fr: "hausse des coûts / tensions de trésorerie / dette",
        },
        tags: ["org"],
      },
      {
        id: "risk_org_legal",
        label: { en: "legal or regulatory exposure", fr: "exposition juridique ou réglementaire" },
        tags: ["org"],
      },
      {
        id: "risk_family_marital",
        label: {
          en: "strain on my relationship (separation, divorce)",
          fr: "tensions dans mon couple (séparation, divorce)",
        },
        tags: ["family"],
      },
      {
        id: "risk_family_living",
        label: { en: "a lower standard of living", fr: "une baisse du niveau de vie" },
        tags: ["family"],
      },
      {
        id: "risk_family_children",
        label: {
          en: "impact on my children / close ones",
          fr: "un impact sur mes enfants / mes proches",
        },
        tags: ["family"],
      },
      {
        id: "risk_self_income",
        label: {
          en: "loss of income / job / status",
          fr: "perte de revenu / d'emploi / de statut",
        },
        tags: ["self"],
      },
      {
        id: "risk_self_burnout",
        label: { en: "exhaustion / illness / burnout", fr: "épuisement / maladie / burn-out" },
        tags: ["self"],
      },
      {
        id: "risk_self_confidence",
        label: { en: "low mood / loss of confidence", fr: "moral en berne / perte de confiance" },
        tags: ["self"],
      },
      {
        id: "risk_self_legal",
        label: {
          en: "legal exposure for me personally",
          fr: "exposition juridique pour moi personnellement",
        },
        tags: ["self"],
      },
      {
        id: "price_give_up",
        label: {
          en: "I'd have to give up some control, comfort, or a familiar identity.",
          fr: "Je devrais renoncer à un peu de contrôle, de confort, ou à une identité familière.",
        },
      },
      {
        id: "risk_org_climate",
        label: {
          en: "a worsening team or work climate",
          fr: "une dégradation du climat de travail",
        },
        tags: ["org"],
      },
      {
        id: "risk_org_reputation",
        label: {
          en: "damage to reputation or authority",
          fr: "une atteinte à la réputation ou à l'autorité",
        },
        tags: ["org"],
      },
      {
        id: "risk_org_dependence",
        label: {
          en: "over-dependence on a market, supplier, or client",
          fr: "une dépendance excessive à un marché, un fournisseur, un client",
        },
        tags: ["org"],
      },
      {
        id: "risk_org_opportunity",
        label: {
          en: "missing an opportunity",
          fr: "rater une opportunité",
        },
        tags: ["org"],
      },
      {
        id: "risk_family_image",
        label: {
          en: "damage to how those close to me see me",
          fr: "une atteinte à l'image que mes proches ont de moi",
        },
        tags: ["family"],
      },
      {
        id: "risk_family_relocation",
        label: {
          en: "having to relocate",
          fr: "devoir déménager",
        },
        tags: ["family"],
      },
      {
        id: "risk_self_sidelined",
        label: {
          en: "being sidelined / demotivation",
          fr: "une mise à l'écart, une démotivation",
        },
        tags: ["self"],
      },
      {
        id: "risk_self_depression",
        label: {
          en: "low mood turning into depression",
          fr: "un moral en berne virant à la dépression",
        },
        tags: ["self"],
      },
      {
        id: "risk_gov_liability",
        label: {
          en: "personal or criminal liability for the decision",
          fr: "une responsabilité personnelle ou pénale liée à la décision",
        },
        tags: ["self"],
      },
      {
        id: "price_short_term_cost",
        label: {
          en: "I'd accept a short-term cost for a longer-term gain.",
          fr: "J'accepterais un coût à court terme pour un gain à plus long terme.",
        },
      },
    ]),
  },
  timing: {
    rubric: "timing",
    items: items([
      {
        id: "time_days",
        label: { en: "I must act within days.", fr: "Je dois agir d'ici quelques jours." },
      },
      {
        id: "time_weeks",
        label: { en: "I must act within weeks.", fr: "Je dois agir d'ici quelques semaines." },
      },
      {
        id: "time_months",
        label: { en: "I must act within months.", fr: "Je dois agir d'ici quelques mois." },
      },
      {
        id: "time_hard_deadline",
        label: { en: "there's a hard deadline", fr: "il y a une échéance ferme" },
      },
      {
        id: "time_no_deadline",
        label: {
          en: "there's no real deadline — I'm choosing one",
          fr: "il n'y a pas de vraie échéance — je m'en fixe une",
        },
      },
      {
        id: "time_too_late",
        label: {
          en: "acting too late makes it worse or pointless",
          fr: "agir trop tard aggrave ou rend inutile",
        },
      },
      {
        id: "time_delay",
        label: {
          en: "I tend to delay this kind of decision",
          fr: "j'ai tendance à repousser ce genre de décision",
        },
      },
      {
        id: "time_real_or_chosen",
        label: {
          en: "I'm not sure if the deadline is real or self-imposed.",
          fr: "Je ne sais pas si l'échéance est réelle ou que je me l'impose.",
        },
      },
      {
        id: "time_others_waiting",
        label: {
          en: "others are waiting on my decision",
          fr: "d'autres attendent ma décision",
        },
        sharedWith: ["stakeholders"],
      },
      {
        id: "time_window_closing",
        label: {
          en: "a window is closing",
          fr: "une fenêtre se referme",
        },
      },
      {
        id: "time_rushing",
        label: {
          en: "I'm tempted to rush it to end the discomfort",
          fr: "je suis tenté(e) de précipiter pour faire cesser l'inconfort",
        },
      },
    ]),
  },
};

/** All banks as a flat list. */
export const ALL_BANKS: QcmBank[] = Object.values(QCM_BANKS);

export function getBank(rubric: RubricKey): QcmBank {
  return QCM_BANKS[rubric];
}

/** Every bank item by stable id — lets the UI re-localize checked items live. */
export const BANK_ITEM_INDEX: ReadonlyMap<ID, QcmItem> = new Map(
  ALL_BANKS.flatMap((b) => b.items.map((i) => [i.id, i] as const)),
);

/**
 * Resolve a checked item's display label in the *current* locale. The stored
 * label is a snapshot from click time (kept for export fidelity); bank-backed
 * items re-localize live so a mid-session FR↔EN toggle never yields a
 * mixed-language synthesis. Custom items render as written.
 */
export function localizedItemLabel(ci: { itemId?: ID; label: string }, locale: Locale): string {
  const item = ci.itemId ? BANK_ITEM_INDEX.get(ci.itemId) : undefined;
  return item ? item.label[locale] : ci.label;
}
