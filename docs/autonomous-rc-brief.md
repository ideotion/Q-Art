# Q‑Art — Autonomous Build Brief: the "Triptyque" Release Candidate (`0.1.0-rc.1`)

> **What this is.** A self‑contained brief for a **fully autonomous** Claude Code session on the
> `ideotion/q-art` repo. The operator **cannot answer questions** during the run. Read it top to
> bottom, then execute. The repository's own docs are the source of truth and override this brief
> where they conflict.
>
> **How to launch it.** Open a Claude Code session on `ideotion/q-art` and either paste this file's
> contents as the task, or say: *"Read `docs/autonomous-rc-brief.md` and execute it end‑to‑end."*

---

## 0. Prime directive & operating mode (read first)

You are building a **testing release candidate** of Q‑Art with **three distinct, curated GUIs**, a
**transparent Debian installer**, and **thorough documentation** — autonomously, ethically, and
leaving the tree **green** at every push.

**Rules of engagement (non‑negotiable):**
1. **Never block on a question.** At every fork, pick the most **reversible, lowest‑risk** option
   that honours the locked decisions, write one line in `docs/autonomous-session-log.md` (create it),
   and continue. Genuinely irreversible/ambiguous calls → record in `docs/OPEN-QUESTIONS.md` and pick
   the safe default anyway.
2. **Green or revert.** After every slice run `npm run check` (typecheck + lint + unit) **and**
   `npm run build`, plus `npm run test:e2e` when a browser is available. If a change can't go green
   quickly, revert it and note why. **Never** disable/skip a test to fake green.
3. **Commit small, push often.** The container is ephemeral — unpushed work is lost. Conventional
   commits. Push after every milestone.
4. **One draft PR.** Open it early, keep its body updated, keep it a **draft**. **Never push to
   `main`. Never merge. Never publish a release.** The human does those.
5. **Honesty.** If something is stubbed/partial, say so in the docs and PR. Don't overclaim.
6. **Scope discipline.** v1 is **local, no‑LLM, no‑backend, no accounts, no telemetry off‑device.**
   Do **not** add an LLM, a server, Anthropic/Mistral SDKs, analytics, or sync — those are v2.

**Read before coding (in order):** `CLAUDE.md`, `docs/design.md`, `docs/decisions.md`,
`docs/concept.md`, `docs/schema.md`, `docs/question-banks.md`, `docs/diagnostics.md`,
`docs/data-policy.md`, `docs/roadmap.md`, `docs/research/ui-research-summary.md`. Obey every
non‑negotiable in them.

**Repo facts.** Next 16 (App Router) + TS + Tailwind v4 PWA. Layers already exist:
`src/lib/qart` (domain), `src/lib/diag` (diagnostics), `src/lib/storage` (repository abstraction),
`src/lib/i18n` (FR/EN seam), `src/store` (Zustand + XState), `src/app` + `src/components` (UI).
Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `format`, `check`.
CI = `.github/workflows/ci.yml` (`verify` + `e2e`). Node ≥ 20. Both doors (Atlas, Socrate) already
run end‑to‑end over one shared store; the diagnostics fabric is content‑free **by type**.

---

## 1. Mission

Ship **`0.1.0-rc.1`**: the Q‑Art **core loop** — *question → 7 boards / 10 rubrics → weighting →
text‑first synthesis & reframe → export* — delivered through **three distinct, user‑selectable
GUIs**, all writing the **one shared decision object** (`docs/schema.md`), **fully local, no‑LLM**,
**bilingual FR/EN**, **WCAG 2.2 AA**. Plus a transparent **`curl | bash` GitHub installer** for
Debian, **comprehensive app + repo documentation**, and a **draft GitHub Release**.

**What "done" looks like:** a reviewer clones `main`, runs the one‑line installer on Debian, opens
the app, picks any of the three GUIs, completes a full decision cycle in FR or EN, exports a JSON
dossier — all offline — and every CI gate (typecheck, lint, unit, build, e2e, a11y, shellcheck) is
green.

---

## 2. The headline: *le triptyque* — three GUIs, one engine

Add a **GUI picker** on the landing page (persisted preference, switchable mid‑session). All three
are **views over the same store** — none may fork the data model. Each is a genuinely distinct,
specialised paradigm, and each must independently pass the a11y gate.

1. **Atlas — "L'Établi" (Workbench / boards)** — *exists; deepen.*
   Structured, information‑dense, **desktop/keyboard‑first**. The 7 boards with inline editing,
   a **⌘K command palette**, keyboard shortcuts + roving focus, a text **board overview/minimap**,
   per‑board completeness, autosave. For deliberate, professional decisions.

2. **Socrate — "Le Dialogue" (guided)** — *exists; deepen.*
   Calm, **mobile‑first**, **one prompt at a time**, large type, breathing pace, gentle progress,
   encouraging microcopy, smooth **View‑Transitions** steps. Deterministic question‑tree (**NO LLM**).
   For emotionally‑charged decisions.

3. **Cartes — "L'Atelier de cartes" (deck)** — *new; build to full parity.*
   A tactile **card deck**: each rubric / prompt / bank item is a card you **keep / skip / weight**;
   a **"spread" overview**; playful‑yet‑calm; **touch + gesture first** *with complete non‑gesture
   fallbacks* (buttons + keyboard — WCAG 2.2 SC 2.5.7 is mandatory, not optional). Physics/drag may
   use **Motion (JS)**; everything else is CSS/View‑Transitions. For exploratory/creative framing.
   (This is the "deck/tarot" option carried in `docs/design.md`.)

**Shared invariants for all three:** same domain layer, same store, same rubrics/banks/question‑tree,
FR/EN parity, dark mode, `prefers-reduced-motion`, targets ≥ 48px, visible focus, text equivalents
for any visual, and the safeguarding notice (§7) always reachable.

---

## 3. Deliverables & acceptance criteria

- [ ] **GUI picker** on landing; preference persisted (localStorage now; RxDB later); **switch
      mid‑session with zero data loss** (shared store). Each GUI reachable at its own route.
- [ ] **All three GUIs complete the core loop** and **export a versioned JSON dossier**
      (`schemaVersion` + import round‑trip).
- [ ] **Croisements engine**: detect items/keywords recurring across rubrics, sum weights → ranked
      priorities; pure + unit‑tested; feeds every GUI's synthesis.
- [ ] **Weighting A/B (ADR‑005)**: ship **both** MaxDiff (tap best/worst) **and** constant‑sum
      "marbles" as selectable methods; **each with a non‑drag stepper path**; persist the chosen
      method; keep the billes visual identity; record method choice content‑free for later analysis.
- [ ] **Synthesis**: **text/ranked‑list first, always**; optional calm **balance/"thermometer"**
      visual as progressive enhancement; **no node‑graph**; always a text restatement.
- [ ] **Persistence**: wire **RxDB, encrypted at rest**, behind the existing `StorageRepository`
      interface (`src/lib/storage`), with migrations + versioned export/import; in‑memory stays the
      test double. **Encryption at rest is mandatory.** If RxDB‑encryption can't land green in
      reasonable effort, implement an **encrypted IndexedDB adapter behind the same interface** and
      record the deviation in an ADR — **never ship unencrypted persistence.**
- [ ] **PWA**: Serwist service worker (offline app shell + assets), installability, manifest, icons,
      and a persistent‑storage (`navigator.storage.persist()`) onboarding prompt.
- [ ] **i18n**: keep FR/EN parity (the bilingual‑completeness test must cover all new strings).
      Migrating the seam to **Paraglide** is welcome **if** it stays green; otherwise keep the typed
      dictionary seam — *bilingual parity is the gate, not the library.*
- [ ] **Diagnostics**: extend the seams to the new GUIs; keep the typed sink + redaction + the
      failing **"no content in logs"** test; add a small **diagnostics export panel** (manifest +
      JSONL bundle).
- [ ] **Accessibility gate**: integrate **`@axe-core/playwright`**; scan every GUI (light + dark,
      FR + EN) in CI; fail CI on serious/critical violations; keyboard‑complete; contrast verified.
- [ ] **Tests**: unit for engine/store/croisements/weighting/storage; e2e core‑loop happy path **for
      each GUI** + language toggle + export + a11y scan. CI green (`verify` + `e2e` + new `a11y` and
      `shell` checks).
- [ ] **Installer** (`install.sh`) — see §5.
- [ ] **Documentation** — see §6.
- [ ] **Release**: bump to `0.1.0-rc.1`; write `CHANGELOG.md`; create a **draft** GitHub Release with
      notes + the install one‑liner. **Do not publish.**
- [ ] **PR**: keep one draft PR; final body = summary, decisions log, test/gate status, open
      questions, screenshots/GIFs if capturable.

---

## 4. Architecture rules (don't regress)

- **One object, three views.** One decision object (`schema.md`) + one Zustand store; an XState flow
  machine drives navigation per GUI. GUIs are presentation only — no GUI forks state or schema.
- **Boundaries:** new GUIs live under `src/app/<gui>/` + `src/components/<gui>/`; shared primitives in
  `src/components/`. Keep the `lib/qart | lib/diag | lib/storage | lib/i18n | store` separation.
- **Motion:** CSS + View Transitions first; **Motion (JS) only** for the deck's physics/gestures.
  **No `tldraw`, no `GSAP`** (proprietary). Prefer MIT/Apache deps; record every new dep + license.
- **Privacy/security:** no LLM, no backend, no network calls with user content, no analytics
  off‑device, no secrets. Encryption at rest mandatory; export/backup first‑class; keep storage
  abstracted (Capacitor‑ready). Diagnostics content‑free **by construction**.
- **TS strict**; no `any` escapes; keep the compile‑time content‑leak guard intact.

---

## 5. The installer (`install.sh`) — transparent, ethical, Debian‑first

Create `install.sh` at the repo root, served raw from GitHub. **Design for trust and least
privilege.**

**Usage (document both):**
```bash
# Convenience
curl -fsSL https://raw.githubusercontent.com/ideotion/q-art/<ref>/install.sh | bash
# Recommended (auditable): download, READ, then run
curl -fsSLO https://raw.githubusercontent.com/ideotion/q-art/<ref>/install.sh
less install.sh && bash install.sh
```

**Requirements:**
- `set -euo pipefail`; strict, **idempotent**, **no obfuscation**, echo every step with a clear banner
  that names the project, the source URL, and "100% local app — sends none of your data anywhere."
- Flags: `--help`, `--dry-run` (print actions, change nothing), `--dir <path>`
  (default `${XDG_DATA_HOME:-$HOME/.local/share}/q-art`), `--ref <branch|tag>` (default: the RC tag,
  fall back to `main`), `--port <n>` (default 3000), `--no-start`, `--service` (install a **user**
  `systemctl --user` unit only — never system‑wide), `--with-deps`, `--uninstall`.
- **Never require root.** Only touch the system with `--with-deps`, and then **print the exact
  `apt`/NodeSource commands first** and proceed only with that explicit consent flag. Never silently
  pipe a third‑party script into a shell. Prefer a userspace Node (existing `node`/`nvm`) and only
  guide an OS install as a last resort.
- Steps: detect Debian/Ubuntu; check **Node ≥ 20** (instruct if missing); clone or fast‑forward the
  repo at `--ref`; `npm ci`; `npm run build`; then `npm run start` (print `http://localhost:<port>`)
  or, with `--service`, the user systemd unit.
- **Integrity:** default to a **pinned tag**; print the checked‑out commit SHA; verify the remote URL.
  Provide `--uninstall` that removes the dir + user service. No analytics, no data egress.
- **Quality gate:** must pass `shellcheck`; add a CI `shell` job running `shellcheck install.sh` and
  `bash install.sh --dry-run`; a containerised Debian dry‑run if feasible. Ship an `uninstall.sh`
  shim too.

---

## 6. Documentation (app + repo)

**User/app docs** (`docs/` + an in‑app Help/About panel + first‑run onboarding):
- Plain‑language explainer of the method (the reflex‑shortcut trap, mapping the question, reframing).
- **The three GUIs** and when to use each; the core loop; weighting; synthesis/reframe; export/import.
- Privacy ("your decision content never leaves your device"), the **not‑advice + crisis signposting**
  notice (FR + EN), and an **accessibility statement**.

**Repo/dev docs:**
- `README.md` (overview, quickstart, the install one‑liner, screenshots/GIFs if capturable).
- `docs/architecture.md` (one‑object‑three‑views, module map, store/flow, storage, diagnostics, i18n,
  motion).
- `CONTRIBUTING.md` (setup, scripts, conventions, testing, the a11y gate, commit style).
- `docs/install.md` (installer flags, uninstall, security notes, manual steps).
- `docs/testing.md`, `docs/release.md` (versioning + how the release tag and installer `--ref` align).
- `SECURITY.md` (local‑only posture, no secrets, how to report), `CHANGELOG.md`.
- Keep **ADRs current**: add ADRs for the three‑GUI architecture, the deck GUI, RxDB encryption
  wiring, Serwist, the weighting‑A/B plumbing, and the installer.

---

## 7. Ethics & safety (hard gates — there is no human in the loop)

- **Privacy:** fully local; encryption at rest; content‑free diagnostics; **no** off‑device
  telemetry; honest claims only.
- **Safeguarding:** the "**not therapy / medical / legal advice**" line **plus crisis signposting**
  (FR + EN) must be reachable in **every** GUI. **No dark patterns** — no streaks, guilt, fake
  urgency, or engagement manipulation. Calm, non‑coercive design is a duty of care.
- **Accessibility:** WCAG 2.2 AA is a **release gate**. Never ship a GUI that fails the axe scan;
  every interaction has a keyboard + non‑drag path.
- **Licensing/IP:** respect the proprietary `LICENSE`; no proprietary‑trap or copyleft‑incompatible
  deps; record all new deps and their licenses.
- **Installer security:** transparent, least‑privilege, auditable, pinned refs, no hidden network
  calls, reversible (uninstall).
- **Honesty over ambition:** ship a smaller green RC rather than a larger broken one; document every
  stub and deferral.

---

## 8. Suggested execution order (vertical slices — keep green between each)

1. Read the docs; ensure deps install; create `docs/autonomous-session-log.md`; open the **draft PR**.
2. Introduce a **GUI registry + picker** and refactor Atlas/Socrate behind it (shared store,
   persisted preference). Green.
3. **Croisements** + **dual weighting (MaxDiff + marbles)** in the engine, with tests. Green.
4. Build the **Cartes (deck) GUI** to full core‑loop parity + e2e. Green.
5. **RxDB encrypted persistence** behind the repo seam + export/import + migrations + tests. Green.
6. **Serwist PWA** offline + install/persist onboarding. Green.
7. **a11y harness** (axe) in CI across all three GUIs; fix to AA. Green.
8. Deepen **Atlas** (⌘K, shortcuts, overview) and **Socrate** (transitions, microcopy). Green.
9. **Installer** + `shellcheck`/`--dry-run` CI + uninstall. Green.
10. **Documentation** pass (app + repo + in‑app Help + onboarding).
11. Bump **`0.1.0-rc.1`** + `CHANGELOG.md` + **draft GitHub Release** + finalise the PR body.
12. **Stretch (only if green and time remains):** balance/"thermometer" synthesis visual; the
    **recursion** cycle (second pass + action‑plan board); Paraglide migration; a Capacitor spike note.

---

## 9. Guardrails recap (re‑read before every push)

- Green CI or revert · push often · **draft PR only** · never `main` · never merge · never publish.
- Decisions → ADRs; ambiguity → `OPEN-QUESTIONS.md`, then proceed with the safest reversible choice.
- **Bilingual parity · accessibility · privacy · safeguarding** are gates, not nice‑to‑haves.
- Keep the **"no content in logs"** test passing and the diagnostics typed‑sink guarantee intact.
- No LLM · no backend · no off‑device data · no proprietary‑trap deps.
