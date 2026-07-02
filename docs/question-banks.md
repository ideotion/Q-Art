# Q-Art — Curated Question Banks (v0.1 seed)

> **Proprietary** · © 2026 Ideotion · personal, non-commercial use permitted; all other rights reserved (`LICENSE`).
> **Reads with:** `concept.md` (method) and `schema.md` (data model). These banks are the **proprietary content** that fills `QcmBank` / `QcmItem` per `RubricKey`.
> **Drafting rule:** no living/recent individuals or organizations; only well-known historical figures; no legally-loaded claims.

---

## How these work

- Each rubric provides two things:
  - **Open prompts** — the Socratic questions that frame the rubric (used by *Socrate* conversationally and shown as hints in *Atlas*).
  - **Checklist items (QCM)** — tickable, first-person statements (used as `CheckedItem`s; the user assigns each a **1–5 weight** at use).
- **Free text is always available** in every rubric; the checklist exists so no one freezes at a blank page.
- Items are written to suit **personal *and* professional** decisions (the audience spans independent operators, people at crossroads, and teams).
- Some items **deliberately recur across rubrics** (`sharedWith` in the schema) — that recurrence is what *croisements* detect.
- **Localization:** the shipped banks (`src/lib/qart/banks.ts`) are **fully bilingual FR/EN** (`LocalizedText`, parity‑tested). The lists below are the English reference text; the code is authoritative.
- This is a **seed** (v0.1) — meant to be expanded and tuned with use.

---

## The question (the spine) — formulation helpers

*Not a checklist — prompts to help state and later reframe the question.*
- State it as a real question, in your own words.
- Useful openers: *"Should I…", "How do I…", "What if…", "Is it worth…"*
- One question at a time; if several are tangled, pick the one that weighs most today.
- *(After a cycle)* the reframed question often begins with **"How do I…"** — that shift is the signal.

---

## 1. Framing & beliefs — *Est-ce (vraiment) un problème ?*

**Purpose:** confirm there's a real, actionable problem; surface the assumptions coloring it.
**Open prompts:** In what way is this a problem, and for whom? What are the concrete signs? What makes me say I can act on it? What am I taking for granted?

**Checklist — framing**
- It's a real problem, not just a passing annoyance.
- I'm not actually sure it's a problem.
- It mostly affects me. · It mostly affects others. · It affects both.
- It's urgent. · It can wait.
- It's mine to act on. · It's partly someone else's. · It isn't really mine.
- I can clearly influence the outcome. · I have little control over it.
- I've been avoiding naming it plainly.

**Checklist — beliefs to examine** *(tick any that sound like you, then question it)*
- "I have to handle everything myself."
- "If I'm not perfect, I've failed."
- "Admitting a mistake means losing respect/authority."
- "I'm worth less if I don't meet others' expectations."
- "Showing emotion is a weakness."
- "Trust has to be earned before I give any."
- "It's all or nothing."
- "It's always been like this / it never works / everyone thinks…/ no one will…"

---

## 2. Stakeholders & my role — *Qui est concerné*

**Purpose:** map who's involved/affected and, crucially, the part *I* play in keeping the situation going.
**Open prompts:** Who is affected, and how much? What role do I play with the others? How might I be feeding this?

**Checklist — who is affected**
- my partner / family / close ones
- my team / colleagues / business partners
- my clients / customers
- my manager / hierarchy / investors
- my friends / network
- only me

**Checklist — my role**
- I tend to take on others' problems / over-help.
- I feel wronged or stuck in it.
- I push, control, or blame others.
- I keep it alive by over-controlling.
- I keep it alive by staying silent / avoiding.
- I'm waiting for someone else to move first.

---

## 3. Emotions — *Ce que j'éprouve*

**Purpose:** name the feeling, accept it, and use it as energy for change.
**Open prompts:** What do I feel? Where do I feel it? What is the emotion telling me? Does it show up elsewhere too?

**Checklist**
- fear / anxiety
- anger / frustration
- sadness / discouragement
- guilt / shame
- relief (at least sometimes)
- hope / excitement
- "I don't really know what I feel"
- the feeling is intense · the feeling is mild
- I recognize this feeling from other situations

---

## 4. Ideal scene — *Mon idéal*

**Purpose:** picture the situation *without* the problem; find the exceptions that already exist.
**Open prompts:** Describe it solved — what's different? When does the problem *not* show up, and what's different then? What could I borrow from those moments?

**Checklist**
- I can clearly picture the situation resolved.
- There are already moments when the problem doesn't appear.
- When it goes well, what's different is: I set clear terms up front.
- …I ask for help. · …I say no. · …I plan ahead. · …someone else is involved.
- In the ideal, I'd feel: calm · free · proud · in control.
- I rarely let myself imagine the ideal.

---

## 5. Objective & benefits — *Objectif & bénéfices attendus*

**Purpose:** a concrete, realistic objective, the benefits of reaching it, and how I'll know.
**Open prompts:** What exactly do I want, by when? What will I gain? What sign will tell me it's working?

**Checklist — the objective**
- My goal is concrete and specific. · My goal is still vague.
- It's realistic given my situation. · It may be too ambitious for now.

**Checklist — benefits**
- more time / energy
- less stress / more peace of mind
- better relationships
- more income / financial security
- more freedom / autonomy
- self-respect / confidence
- growth / new opportunities

**Checklist — indicators**
- I can name an observable sign of progress.
- I'll know it's working when: *(free text)*

---

## 6. Resources & levers — *Ressources disponibles*

**Purpose:** what I can genuinely draw on.
**Open prompts:** What do I already have going for me? Who or what can help? (Look beyond people — time, money, skills, services.)

**Checklist**
- my own skills / experience
- time I can free up
- money / budget
- people who can help (family · friends · a mentor · peers)
- my team / collaborators
- tools, training, or outside services (e.g. subcontracting)
- past successes I can build on
- my health / energy

---

## 7. Solutions already tried — *Solutions déjà tentées*

**Purpose:** surface what's been tried and its result; spot "more of the same."
**Open prompts:** What have I already tried, and with what result? What did I do next? What would be genuinely *different*?

**Checklist**
- I've tried talking it out → result: *(free text)*
- I've tried working harder / doing more of the same.
- I've tried waiting it out.
- I've tried avoiding it.
- I've tried getting advice or help.
- Nothing has really changed (status quo).
- What I keep doing may be making it worse.

---

## 8. Brakes, obstacles & resistances — *Freins & obstacles*

**Purpose:** name what's in the way — including the hidden payoff of *not* deciding.
**Open prompts:** What's blocking this? What does staying as-is spare me from doing or feeling? What's the quiet benefit of the status quo?

**Checklist**
- another person is blocking it
- not enough time · money · skills · information
- fear of the consequences
- fear of conflict / disappointing someone
- fear of failing · fear of succeeding
- not deciding lets me avoid a hard conversation
- not deciding lets me avoid responsibility / change
- staying as-is is comfortable and familiar
- I don't feel ready

---

## 9. Risks & the price of deciding — *Risques*

**Purpose:** the near-certain consequences if I *don't* resolve this, and the price if I do.
**Open prompts:** What is almost certain to happen if nothing changes — for the work, for those close to me, for me? And what would I have to give up to decide?

**Checklist — work / organization** *(tag: org)*
- lost productivity or performance
- losing key people / rising turnover
- a worsening team or work climate
- losing clients / market share
- rising costs / cash-flow strain / debt
- damaged reputation or authority
- legal or regulatory exposure
- missing an opportunity

**Checklist — family / close ones** *(tag: family)*
- strain on my relationship (separation)
- a lower standard of living
- having to relocate
- impact on my children / close ones
- damage to how those close to me see me

**Checklist — me** *(tag: self)*
- loss of income / job / status
- demotivation / being sidelined
- exhaustion / illness / burnout
- low mood / loss of confidence
- damage to my self-image

**Checklist — the price of deciding**
- I'd have to give up some control / comfort / a familiar identity.
- I'd accept a short-term cost for a longer-term gain.
- I'd have to let go of: *(free text)*

---

## 10. Timing — *Délais d'action*

**Purpose:** the real timeframe.
**Open prompts:** By when must I act? Is the deadline real, or one I'm choosing? What happens if I act too late?

**Checklist**
- I must act within days · weeks · months.
- there's a hard deadline: *(free text)*
- there's no real deadline — I'm choosing one.
- acting too late makes it worse or pointless.
- I tend to delay this kind of decision.

---

## Action plan — *Plan d'action* (structured, not a checklist)

*Built mainly in the recursion cycle. Maps to `ActionStep` in the schema.*
**Open prompts:** What will I do immediately — this week? What's the smallest first step at low stakes? With whom? How will I know I've progressed?

Per step, capture: **action** · **with whom** · **when** · **resources** · **indicator (how I'll know it worked)** · **status** (ready / to refine / to build) · **a self-sabotage to watch**.
Guiding stance: the *best*, not the perfect; small steps; a right to error.

---

## Open / to expand

- **Depth:** these are seed lists (~8–15 items/rubric); expand with real usage and per-domain variants (e.g. an artisan vs. a manager).
- **French set:** author the FR labels (the method's native language).
- **Tags:** extend beyond the risk buckets (org/family/self) for filtering and croisements.
- **Shared items:** mark `sharedWith` links so deliberately recurring items are detected across rubrics.
