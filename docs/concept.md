# Q‑Art — Concept, Methodology & Build Brief

> **Status:** Living foundation · last revised 2026‑06‑16
> **Proprietary** · © 2026 Ideotion · personal, non-commercial use permitted; all other rights reserved (`LICENSE`).
> **How to read this:** This document is deliberately **self‑contained**. Assume the reader — including a future AI session with **no memory of prior conversations or source files** — has zero other context. Everything needed to understand *what Q‑Art is, why it works, and what we are building* is captured here. If you are that future session: start at §0, and treat this file as the single source of truth.

---

## 0. Intent — the north star (read first)

**Q‑Art is "*l'art du questionnement*" — the art of questioning.** It is a method, and a product, that helps a person get **unstuck on a hard, emotionally charged decision** — the kind with no obvious right answer — by **systematically mapping the whole system around their question** until the question itself **reformulates**. From that reformulation, a workable answer *emerges on its own*.

The single most important idea: **Q‑Art works on the *question*, not on the answer.** It does not give advice. It does not recommend a choice. It re‑opens the steps a person's mind skipped, so that *they* see the path.

**What Q‑Art is NOT:**
- Not an advice engine, oracle, or recommender — it never tells you what to do.
- Not a linear questionnaire to "fill out" — it is a non‑linear exploration of a system.
- Not therapy or coaching — though it borrows from both (see §4).
- Not dependent on any human expert — the questioning intelligence lives in the **structure** and (optionally) in **AI**.

**The promise to the user:** *"Bring the question you can't resolve. Leave with a better question — and the answer that comes with it."*

This product is being built **brand new**. The methodology below is the durable asset; the implementation is ours to design.

---

## 1. The problem Q‑Art solves: the *schéma réflexe* (reflex shortcut)

One job of intelligence is to **save energy** by building a stock of **reflex shortcuts** — ready‑made mental routes from *problem → answer*. We accumulate these our whole lives; education, family, and a **Cartesian culture of linear, deductive reasoning** all reinforce them. They are genuinely useful for **repetitive, "programmable" problems**.

They **fail** the moment a problem is novel, complex, or charged — the *non‑programmable*. And modern life is increasingly non‑programmable: fast, shifting, unpredictable. We were trained for permanence, not for constant change.

When we feel **stuck, indecisive, lacking visibility, it is a signal that the reflex shortcut has hit its limit.** And here is the trap: having been handed ready‑made answers all our lives, *we have unlearned how to unlearn*. Failing to handle a situation deemed "unmanageable" is felt as personal failure — sometimes a "narcissistic wound" — and produces stress.

**The mechanism of the trap (the diagram at the heart of the method):**

```
   Problem / Question  ──▶  [reflex shortcut]  ──▶  Solution
                              ▲
        Everything AROUND the question is skipped, automated, and lost.
        The "solution" reflects only the few elements the reflex kept —
        not the system that actually surrounds the question.
```

It is even natural to *bend* our reading of the situation to fit the answer we already want. Q‑Art's job is to **interrupt this comfort path** and force a full, honest tour of the question's system.

> Signature framing: *"A problem with no solution is a poorly‑stated problem."* — and: *"Insanity is doing the same thing and expecting a different result."*

---

## 2. The core idea: cartography of the question

Q‑Art is a **systemic method that maps, broadly, the environment around a question.** A question never stands alone — it sits inside a system of elements (people, feelings, beliefs, resources, risks, constraints) that it depends on and that give it meaning. The question exists *because that system is out of balance* (otherwise there would be no problem).

The method **brings back into the light every step the reflex shortcut hid**, lets the person feed and enrich the subject, and **re‑states the problem differently**. From the new formulation, new axes of reflection — then of action — emerge. **The answer is present *through* the reformulation**, more or less directly, and the system can find a new equilibrium.

Three properties define the approach:

- **Systemic.** Each component acts on the others. The system has its own autonomy and produces unexpected feedback ("retroactivity"). Two mental models: the *domino line* (a direct, Cartesian, linear effect — easy) vs. the *butterfly effect* (indirect, systemic effect — requires thinking differently). Q‑Art trains the second.
- **Non‑linear.** The person moves freely among facets; there is no fixed order. The same item deliberately recurs across several facets — that recurrence is signal, not noise.
- **Recursive.** Q‑Art is itself a new reflex — but one that *shakes up* the usual register. It generates new questions until the system's components that bear on the original question are **exhausted**. The reframed question feeds a fresh cycle; the later cycle is where the **action plan** is built.

> The "problem" is converted into an **objective to reach**: a situation to evaluate, with new decision elements (including the ones that had been hidden) brought into view.

---

## 3. The method — the engine in detail

### 3.1 The shape of every module

Q‑Art is a **journey through ~7 boards (*tableaux* / modules) plus a final synthesis.** **Every board is built the same way:**

1. **A curated checklist of propositions (QCM)** — pre‑written prompts the person ticks. *This is core IP:* good curated prompts stop people from freezing at a blank page and surface angles they'd never list themselves.
2. **A relative‑importance weighting** — the person rates how much each ticked item matters, producing **priorities and weight** (exact scale TBD; e.g. 1–5 or low/med/high).
3. **Free‑text zones** — for anything the checklist doesn't capture, in the person's own words.

Items intentionally **reappear across boards**; Q‑Art's value is precisely to *illuminate every facet* of the same subject, including the ones we elide for efficiency.

### 3.2 The rubrics (the canonical questioning logic)

The system around the question is mapped by the rubrics below. These are sourced from the method itself: each has an **intent**, **signature prompts**, and a **motto** that sets its spirit. *(In the build, the questioning intelligence these encode is delivered by the structured modules of Atlas and, conversationally, by Socrate — see §6. No human facilitator is required.)*

The canonical rubrics (12), packaged into ~7 boards + synthesis:

1. **Ma question** *(My question)* — the central question, in the person's own words.
2. **Est‑ce (vraiment) un problème ? — postulats & croyances** *(Is it really a problem? + beliefs)* — *"I don't see the world as it is, but as I am."* Validate that there's a real, actionable problem; surface the assumptions, beliefs, and "always/never/everyone" certainties coloring it; move from perceptions to facts; develop empathy by defending the other's viewpoint.
3. **Qui est concerné** *(Who is concerned)* — stakeholders, and crucially **my own role**: *how do I feed this situation?* What role do I play (Persecutor / Victim / Rescuer)? Recenter on "I" rather than "we/they/one."
4. **Ce que j'éprouve** *(What I feel)* — *"Emotion is the engine of change."* Name the emotion (anger, fear, sadness, frustration), accept it, lower its negative charge, and use it as energy.
5. **Mon idéal — la scène idéale** *(My ideal scene)* — *"To act is to have the faculty to desire."* Describe the situation *without* the problem; find **exceptions** (when does it not occur? what's different then?). Most people don't allow themselves to dream — verbalizing the ideal often reveals the innovating element that solves it.
6. **Objectif & bénéfices attendus** *(Objective & expected benefits)* — *"Progress, not perfection."* A concrete, clear, realistic objective with a date/duration and **observable progress indicators**; the benefits expected from resolving it.
7. **Ressources disponibles** *(Available resources / levers)* — what I can draw on.
8. **Solutions déjà tentées** *(Solutions already tried)* — *"The more it changes, the more it's the same."* Surface "more of the same"; recognize where **the attempted solution has become the problem**; build the conviction to do something genuinely different.
9. **Freins & obstacles — résistances** *(Brakes, obstacles, resistances)* — *"It is the fear of success that sometimes explains failure."* Legitimize resistances (they have a useful function) to reduce their grip; expose the **paradoxical benefit of not deciding** (what does the status quo spare me from doing or feeling?).
10. **Risques — le prix de la décision** *(Risks & the price of the decision)* — near‑certain consequences if the question is *not* resolved, and the **price to pay** if it is (what must I let go of, keep, adjust, abandon?). Has a rich curated taxonomy across **organization / family / self** (see Appendix B).
11. **Délais** *(Timing / deadlines)* — *"Even a good decision is the wrong decision when it's made too late."*
12. **Plan d'action** *(Action plan)* — *"If you believe everything is difficult, everything becomes so."* The best, not the perfect; **small steps**; a right to error (trials and adjustments); experiment first where stakes are low; what will I do *immediately*, with whom, when?

**Provisional 7‑board packaging** (to finalize in the schema, §9):
T1 Question & framing (1+2) · T2 Stakeholders & my role (3) · T3 Emotions (4) · T4 Direction: ideal + objective/benefits (5+6) · T5 Means & history: resources + solutions tried (7+8) · T6 Forces against & cost: brakes/resistances + risks (9+10) · T7 Commitment: timing + action plan (11+12) · **+ Synthèse**.

### 3.3 Croisements (cross‑referencing) & weighting

After the boards, answers are read **across** modules (*croisements*). An item that recurs in several places, or carries high weight, is a key parameter of the system. Combined with the importance weighting, this produces the **priorities** that drive the reformulation. This is the heuristic / mind‑map step.

### 3.4 Synthesis, reformulation & recursion

The deliverable of a cycle is the **synthesis**: the **initial question → the reformulated question**, plus the key words retained per rubric. The reformulation is the pivot — *the answer lives inside it.*

Then **recurse**: feed the reformulated question into a new cycle. Repeat until the system's relevant components are exhausted. A later pass produces the concrete **action plan**.

### 3.5 Worked examples

**Example 1 — canonical (use this one).**

1. **Initial question:** *"I'm overwhelmed — how can I better manage my time?"*
2. **Systemic questioning** unfolds (simplified): *"I struggle to delegate" → "I struggle to trust my colleagues" → "I generally operate from distrust" → "I'm a perfectionist" → "If I do it myself it'll be better and faster" → "but I'll soon hit the limit of what I can do alone" → "I risk stress, for me and those around me."*
   - **Risks surfaced:** illness, absenteeism, demotivation, deteriorating performance and company results, strain on my marriage.
   - **Benefits surfaced:** focus on my core mission, lower stress at work and home, re‑motivate my teams.
3. **Reformulated question:** *"How can I learn to trust my colleagues?"*
4. **Action paths:** *"I could relearn trust gradually, starting with low‑stakes situations."* → first concrete step: *"On Monday I'll hand task ABC to X, while keeping light oversight of progress."*

The real problem was never time management; it was trust and delegation. The reframing made the answer visible.

**Example 2 — an independent operator's dilemma.**

1. **Initial question:** *"Should I drop my most demanding client?"*
2. **Systemic questioning** unfolds (simplified): *"They're ~40% of my revenue, so losing them scares me" → "yet I dread every exchange with them" → "I say yes to their every last-minute demand because I'm afraid they'll walk" → "I haven't reviewed my price with them in three years" → "I assume they'd never accept boundaries or a higher rate" (never tested) → "they consume so much of my time that I have no pipeline — which is exactly why I feel I can't afford to lose them."*
   - **Exception noticed:** *"My easy clients pay on time and rarely overrun — what's different there? I set clear terms with them up front."*
   - **Risks surfaced:** burnout, resentment, neglect of my other clients, my health, zero growth.
   - **Benefits surfaced:** reclaimed time and energy, room to win better-fit clients, self-respect, a healthier book of business.
3. **Reformulated question:** *"How do I renegotiate this relationship on my own terms — and what's my safety net if they walk?"*
4. **Action paths:** *"Test the belief I've never tested — propose new terms and a rate increase — but build a cushion first."* → first concrete steps: *"This week, reinvest two reclaimed hours into outreach to two prospects and draft the new terms; hold the renegotiation conversation in two weeks."*

The real problem was never this one client; it was an **untested belief** and a **self-maintained dependency** — over-serving had itself become the problem ("more of the same"). The binary *"drop them or not?"* dissolved into *"renegotiate from strength."*

**Example 3 — the most complete real dossier (resignation).** *(Full raw dossier in Appendix G.)*

1. **Initial question:** *"Should I resign from my post as corporate officer (mandataire social)?"*
2. **What the map surfaced:** he is excluded from board meetings yet personally — even criminally — liable (*"I'm responsible for things I can't control"*); weighted stakeholders: boss (a lot), wife (a lot); feelings: fear of losing his job and of being charged, fear of disappointing and losing his spouse; already tried a meeting with the boss and emails flagging the risks → *status quo, nothing happens*; timeframe: two weeks.
3. **Reformulated question:** *"How do I overcome my fear of telling my boss I'm resigning — i.e. how do I present my resignation as corporate officer?"*
4. **Insight:** once mapped, resigning was clearly the right call — the real problem was the **fear of the conversation**. The person does not validate here; they **re-run Q-Art on the reformulated question**, and that second cycle builds the action plan.

### 3.6 The intelligence layer (formerly a person's craft — now structure + AI)

Beyond filling boards, a good Q‑Art pass requires judgment that we now deliver via structure and AI (no human tutor):

- **Read the emotional register** of the responses (e.g. technical, approval‑seeking, wanting to be rescued, mature, confident, disturbed).
- **Detect self‑sabotages** — points to watch where the person may undermine their own plan.
- **Detect connected questions** the person raised implicitly — candidates for the next recursion.
- **Ensure every facet is covered** (prompt the thin or skipped areas).
- **Help reformulate** the question and **structure the action plan** into: *ready now / to refine but workable / still to build.*
- **Keep memory of the dossier** so a later session (or the team synthesis) can build on it.

---

## 4. Theoretical & scientific foundations

Q‑Art synthesizes established traditions; each maps to concrete rubrics above.

- **Systemic / brief therapy (the Palo Alto school).** Systems thinking; *"more of the same"*; attempted solutions that **become** the problem; **reframing** (recadrage); second‑order change. → rubrics 8, and the whole reformulation logic.
- **Solution‑Focused approach.** The **ideal scene** / miracle question; **exceptions**; progress over perfection. → rubrics 5, 6.
- **Transactional Analysis.** The **drama triangle** — Persecutor / Victim / Rescuer. → rubric 3.
- **Constructivism / NLP.** *"The map is not the territory"; "I see the world as I am."* → rubric 2.
- **Complexity & systems science.** Interactivity, **retroactivity**, the **butterfly effect**; a system's emergent autonomy. → §2.
- **Cognitive science of heuristics.** The reflex shortcut as an energy‑saving "comfort path" (fast, automatic thinking) that misfires on novel problems. → §1.
- **Socratic maieutics.** Questioning that "gives birth" to the answer already within — the spirit of the **Socrate** door. Galileo and Socrates are emblematic of the questioning stance Q‑Art revives.
- **GROW arc** (Goal → Reality → Options → Will) as a coaching backbone.
- **Dialectical consensus (the φ-protocol).** A structured confrontation protocol for groups — complementary to Q‑Art in team/governance use (Appendix F).

**Q-Art as a synthesis of decision methods.** There is no "decision machine": real decisions are by turns intuitive, emotional, logical, collective, and personal. Comparisons of the common decision-aid methods, scored on **reliability, speed, credibility, and ease of implementation**, found no single winner. Q-Art's robustness comes from deliberately **combining six of the ten in one structured pass** — *deciding alone* (solo reflection), *analysing the numbers / using models* (project, marketing, business plans), *deciding as a team*, *turning to a third party*, *trusting intuition* (treated as the fruit of emotional intelligence and accumulated experience), and *mind-mapping* (the *croisements* step naturally forms a heuristic map). It deliberately **excludes the four passive or avoidant methods** — *act-then-think, not deciding at all, doing as everyone else does, leaving it to chance* — for which it is not intended. At any step, a third party, a team, or AI can be brought in to validate a result.

---

## 5. Products & variants — one engine

The product lineup is **not yet fixed.** Two independent axes combine, and we have **not** decided how many variants to ship or how to package them:

- **Context axis — Solo vs Team/Governance** (detailed in §5.1–§5.2 below).
- **AI-intensity axis — LLM-less vs LLM-enhanced.** An **LLM-less** mode is structured, deterministic, fully private and offline-capable (the *Atlas* end, §6). An **LLM-enhanced** mode adds AI — from light assist up to a fully conversational guide (the *Socrate* end, §6).

Crossing the axes gives up to **four** candidate variants, and the count is genuinely open (we may ship two, three, or four):

| | LLM-less (Atlas end) | LLM-enhanced (Socrate end) |
|---|---|---|
| **Solo** | structured, fully private | AI-assisted / conversational |
| **Team** | structured, anonymized pooling | AI-assisted synthesis & facilitation |

Every variant fills the **same** decision object (§6). The LLM-less modes are the privacy / offline / audit baseline; the LLM-enhanced modes trade some privacy for lower friction and adaptivity. **Exploratory — decision deferred.**

### 5.1 Solo
A private, personal "get unstuck" tool: one person, one question, the full cycle, a synthesis they own.

### 5.2 Team / Governance
Several people work the **same** question **privately and independently**, then their inputs are pooled into a collective synthesis:

- Each participant is assigned a **number; the mapping of number→person is held only by the facilitator** (which may be the platform itself).
- Each person's answers are gathered per question; a **per‑question mini‑synthesis** is produced and then **anonymized** (compiled so meaning is kept but no author is recognizable by style or phrasing).
- In a working session the syntheses become a **mind‑map** the group enriches collectively; a designated scribe captures the result; a shared **action plan** is produced.

**Flagship case — boards & ethics decisions.** Board members carry **personal, criminal liability** for their votes. For "management‑power" and **"humanist" decisions** (e.g. where the coldly logical, figures‑driven choice — like layoffs — is resisted on human grounds), the law offers no clear referential, and **group dynamics suppress candor**: members won't voice every objection or "far‑fetched" idea in session. Q‑Art lets each member express their full reasoning — *including emotional intelligence* — **anonymously**, and the board can produce a **collective, written synthesis of all the elements behind its decision, annexable to the record.** That document is **defensible** against an individual‑liability claim (each member demonstrably did a complete material *and* societal appraisal) and lets human reservations be aired without anyone having to reveal their stance. *(Illustrative dilemma: at equal budget, build the new factory in China — faster ROI, investors' preference — or in a hard‑hit French employment area — slower and costlier, but the founder's ethical preference? A figures‑only comparison yields no clear winner.)*

---

## 6. Product architecture — two doors, one engine

Build the **canonical Q‑Art "decision object" once** — the data structure holding the rubrics, weights, the initial→reformulated question, and the action plan — then offer **two front doors that fill the same object**:

- **ATLAS — *you map it*.** The structured door: the boards, curated prompts, weighting, and free‑text, with **optional** AI assist. **Privacy‑maximal**: completes with **zero AI**, works offline, deterministic. It is the **audit/governance‑friendly mode** and the **backbone** the other door writes into.
- **SOCRATE — *it questions you*.** The conversational door: an **AI that runs the method maieutically**, adapting its questioning, probing thin spots, detecting connected questions and self‑sabotage, and proposing the reformulation. Low‑friction, broad‑audience; a larger trust/cost commitment. A Socrate session still **produces the same Atlas map artifact.**

*Naming rationale:* **Atlas** = the book of maps you hold (the *cartographie*); **Socrate** (French spelling) = the maieutic art of questioning that is literally *Q‑Art*, nodding to the Francophone roots. Structure + dialogue; map + questioner.

> **Build note (`0.1.0-rc.1`):** the two doors generalized to **three GUIs over the same object** — Atlas, Socrate, and **Cartes** (a tactile card‑deck presentation) — per ADR‑018/019. The doors remain the conceptual ends of the AI‑intensity axis; Cartes is a third *presentation*, not a third method.

These two doors are the ends of the **AI-intensity axis** (§5): each can apply within both **Solo** and **Team** contexts. *Atlas* spans the LLM-less → light-assist range; *Socrate* is fully AI-driven. How many of these combinations we actually ship is undecided.

---

## 7. Strategy & decisions (locked)

| Decision | Direction |
|---|---|
| **Audience** | Broad, **tilted to independent operators** (solo entrepreneurs, small‑business owners, artisans) — people who make lonely, high‑stakes calls with no board or coach — plus coaches/therapists (B2B2C), people at life/career crossroads, and teams & governance. |
| **Format** | **Privacy‑first PWA** — capture anywhere, go deep when focused, cross‑device. |
| **AI** | **Two named doors, one engine**: Atlas (structured) + Socrate (conversational). |
| **Business model** | **Parked** (candidates: consumer subscription, B2B2C via coaches, enterprise/governance seats, freemium). |

---

## 8. Design principles (non‑negotiables)

- **Privacy‑first**, with **two kinds of confidentiality**: user ↔ platform, and member ↔ member inside a team.
- **Non‑linearity** — free movement among modules; recurrence across modules is a feature.
- **Curated prompts + weighting** — the QCM banks and importance scoring are central, not decoration.
- **Reframing *and* recursion** — never stop at the first map; the reformulation and the next cycle are the point.
- **Emotional and belief dimensions** carry equal weight to rational ones.
- **The synthesis is a tangible, exportable artifact** the user owns.
- **Plain, broadly accessible language** — no coach/consultant jargon; usable with no training.
- **No dependency on a human expert** — structure + AI carry the method; in team mode a facilitator (human or the platform) is a convenience, not a gatekeeper.

---

## 9. Open questions & next steps

1. **Finalize the canonical decision‑object schema** — confirm the 7‑board packaging (§3.2), field types, weighting scale, and the synthesis/recursion data model. *(Proposed immediate next deliverable.)*
2. **Author the full curated QCM banks** per rubric — partially preserved here (Appendices B–C); the rest to be (re)written, since they are the core IP.
3. **Socrate**: choose the AI approach, provider, and privacy‑preserving deployment / trust model.
4. **Decide the product matrix** (§5) — how many variants to ship across Solo/Team × LLM-less/LLM-enhanced, and how to package them. *(Open — not yet decided.)*
5. **Business model** — decide later.
6. **First prototype** — proposed: **Atlas** (the deterministic backbone the rest builds on).

---

## 10. License & IP

**This work is proprietary. © 2026 Ideotion.** It is **not** open source: a limited grant permits personal, non‑commercial local use of unmodified builds; all other rights — modification, redistribution, commercial use — are reserved — see the `LICENSE` file.

- **Posture:** protected / closed **at first.** Any later move toward a more open or commercial license is a deliberate, deferred decision.
- **Assets to protect:** the Q-Art method and module structure; the curated QCM banks (Appendices B–C); the worked-case library (Appendix G); and the product names (*Q-Art*, *Atlas*, *Socrate*).
- **Drafting rule for this repo (applies to every future edit):** name no living or recent individuals and no third-party organizations; reference only well-known historical figures; avoid statements that could carry legal or regulatory weight.

---

## Appendix A — Signature mottos (tone reference)
- "A problem with no solution is a poorly‑stated problem."
- "Insanity is doing the same thing and expecting a different result."
- "You can be wrong about the solution… not about the problem."
- "I don't see the world as it is, but as I am."
- "Emotion is the engine of change."
- "The more it changes, the more it's the same."
- "The other is the mirror of my behaviors."
- "Even a good decision is the wrong decision when it's made too late."
- "Every successful enterprise traces back to someone, one day, making a courageous decision."
- "Asking the right question is already holding a good part of the answer."

## Appendix B — RISKS taxonomy (verbatim curated checklist)
*Prompt:* "What risks are tied to this question? Unlike *what I feel*, list here the near‑certain consequences if I do **not** resolve the question or move past the situation."

**For the organization (company / association):** loss of productivity · risk of being copied (idea, counterfeit, imitation) · deteriorating social climate · strike / social action · departure of key staff · rising turnover · loss of market share · rising stress · quality deterioration · rising costs · lengthening lead times · increasing complexity · more responsibility on me · rising debt · greater weight of shareholders · over‑dependence (markets, suppliers) · failure to find financing · short/medium/long‑term cash risk · challenge to my authority · legal risks · disorganization of services · offshoring risk · redundancy/social plan · takeover by a competitor · customer dissatisfaction.

**For my family:** challenge to my self‑image · drop in living standard · geographic relocation · marital risk (divorce, separation) · disruption to the children's schooling.

**For me:** dismissal · loss of status · forced transfer · demotivation · resignation · illness · loss of income · being side‑lined ("placard") · risk of depression · damage to self‑image · legal risks.

## Appendix C — Example beliefs/postulates (curated list, business context)
It's dangerous to show yourself as you are · Showing mistakes means losing authority · I'm worthless if I don't meet others' demands · Speaking up risks looking ridiculous · If I'm not perfect I feel guilty · I must control everything myself · One should only speak when certain · Showing emotion is weakness · Beware of the affective at work · I must control my spontaneity · I must please or I'm worth nothing · Criticizing others is being harsh · Whoever isn't with me is against me · One must not contradict one's hierarchy · Trust must be earned — be sure first · They're paid for it, why thank them?

## Appendix D — Team facilitation procedure (operational)
List participants and assign each a number (mapping known only to the facilitator) → write the group's question → collect each participant's Q‑Art answers under their number → write a per‑question mini‑synthesis → duplicate into an "action plan" file keeping **only** the syntheses, **anonymized** (preserve meaning, remove anything that identifies an author) → in session, turn the printed syntheses into a wall **mind‑map** the group moves around and annotates → name a **scribe** → complete the final **action plan** page with everything that emerged, and distribute it to all by an agreed date.

## Appendix E — Governance: why boards would use Q‑Art (rationale)
Administrators bear personal criminal liability. Legal/accounting breaches are well framed by law, but **"management‑power" and humanist decisions are subjective**, with vague jurisprudence. Decisions made under urgency invite challenge; employees and unions inject non‑measurable, ideology‑driven variables that must be weighed. The purely Cartesian choice (e.g. cut payroll) is easy to justify on paper but can carry an unquantifiable social cost; a member voting against it can rarely defend the position with figures, and **a "parasitic" group dynamic pushes everyone toward the logically‑defensible vote to protect their own credibility and avoid liability.** Boards therefore need a method for **economic *and* humanist** dossiers. In‑session debate is insufficient (people self‑censor). Q‑Art supplies anonymous, complete, individual appraisals that aggregate into a **collegial written synthesis annexable to the report and defensible against individual‑liability claims.**

## Appendix F — Dialectical consensus: the φ-protocol
**Goal:** reach **unanimity** via consensus built on confronting opinions (not winning).
**Steps:** identify the dilemma A vs B → A states position (B silent) → B objects (A silent) → A answers objections (B silent) → B states position (A silent) → A objects (B silent) → B answers (A silent) → each person privately writes the points of **agreement** between A and B → facilitator studies the sheets → facilitator synthesizes the agreement points into a unanimous consensus.
**When:** decisions where quantitative data alone can't settle it and the *quality* of the arguments must be weighed.

## Appendix G — Worked cases & example questions (from source; for later analysis)

*A stock of real cases and decision questions drawn from the source material — preserved for testing the method, designing prompts, and training Socrate.*

**G.1 — Full dossier: the resignation case** *(the most complete worked example in the corpus)*
- **Initial question:** "Should I resign from my post as corporate officer (*mandataire social*)?"
- **Reformulated (after Q-Art):** "How do I overcome my fear of presenting my resignation to my boss? → How do I present my resignation as corporate officer?"
- **Objective:** free myself from a responsibility that weighs on me; end the fear of legal prosecution; be calmer; make the company aware of the dangers it runs; get reassurance about future income.
- **Who is involved:** boss (a lot), colleagues (a little), investors, wife (a lot).
- **Resources / levers:** investors (a little), friends (a little), myself (a lot), wife (a lot).
- **Expected benefits:** make the team effective and add value to the company; restore marital balance and avoid divorce; re-motivate myself, regain serenity and self-trust.
- **Brakes / obstacles:** boss (a lot — blocking); investors allied with the boss; wife (fear of losing her); myself (I no longer know where I stand; stress).
- **Me / feelings:** team demotivation and the company's financial risk feel like *my* responsibility; fear of being misunderstood by my spouse and of disappointing/losing them; fear of losing my job, of financial trouble, and of being criminally charged.
- **Risks:** lost productivity and staff departures; legal risk; divorce; depression, damaged self-image, lost income, demotivation.
- **Solutions already tried + result:** a meeting with the boss, soliciting investors' opinions, an email detailing the risks → *status quo; nothing happens.*
- **Timeframe:** two weeks.
- **Also surfaced:** "I'm not included in board meetings; decisions are made without me; I'm liable for things I can't control; I'm reduced to scrounging for information."
- **Key insight:** after mapping, resigning is *obviously* the decision — the real problem is the **fear of telling the boss**. The person does not stop here; they **re-run Q-Art on the reformulated question**, where the concrete action plan is built.

**G.2 — Family / personal practice case**
"Where should we go on holiday so that every member of the family is satisfied?" — used as a lighter, multi-stakeholder "delicate" question to practice the method.

**G.3 — Team case: "SUB OPTI"** *(real, anonymized; facilitator restitution notes)*
A team working on motivation and direction. Threads that emerged: each member's personal happiness and **personal driver/goal** ("is this project just a grade, or building a future — circumstantial or lasting?"); widening **resources** beyond people (training, sport, subcontracting); reframing **pressure/control** ("little but reliably delivered" beats grand objectives; one final goal plus many small, celebrated steps; learn to say no — and explain — when a deadline is too short); **defining the perimeter of one's responsibility** and the help wanted, to avoid external pressure; clarifying whether supervisors are *project resources* (to manage like suppliers) or teachers; and accepting the negative consequences of one's choices.

**G.4 — Board / governance case: factory location** *(see also Appendix E)*
An innovative SME — prototypes finished and orders in hand — must industrialize fast; cash is not the constraint. The board must choose between a factory **in China** (investors' preference — faster ROI) and one **in a hard-hit French employment area** (the founder's ethical preference — slower, costlier). A figures-only pro/con yields no clear winner — the textbook case for the team/governance mode.

**G.5 — Example-question bank** *(quick test inputs)*
- "I'm overwhelmed — how do I manage my time better?" → *learn to trust / delegate.* (canonical, §3.5)
- "Should I resign as corporate officer?" → *overcome the fear of telling the boss.* (G.1)
- "Where do we holiday so the whole family is happy?" (G.2)
- "Should I drop my most demanding client?" → *renegotiate from strength.* (§3.5, Example 2)
- Team motivation & direction — "SUB OPTI." (G.3)
- Factory in China vs a depressed French region — ethics vs ROI. (G.4)
- A layoff / social plan — the "Cartesian" payroll cut vs the unquantifiable human cost. (governance, §5)

## Glossary
- **Q‑Art** — *l'art du questionnement*; the method and the product.
- **Schéma réflexe** — the energy‑saving mental shortcut from problem to answer; Q‑Art interrupts it.
- **Non‑programmable** — novel/complex/charged problems the reflex shortcut can't handle.
- **Croisements** — cross‑referencing answers across modules to surface recurring, high‑weight parameters.
- **Scène idéale** — the "ideal scene": the situation imagined without the problem.
- **Reformulation** — the restated question a cycle produces; the pivot from which the answer emerges.
- **Recursion** — feeding the reformulated question into a new cycle until the system is exhausted.
- **Decision object** — the canonical data structure both Atlas and Socrate fill in.
- **Atlas / Socrate** — the structured door and the conversational door over the same engine.
- **φ-protocol** — a dialectical consensus protocol, complementary in team/governance mode.
