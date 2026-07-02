/*
 * Regenerate the user-guide screenshots (docs/guide/img, EN + FR) from the real
 * app. Deterministic: fixed viewport, light scheme, reduced motion, seeded with
 * the canonical "manage my time" case so the reading has substance.
 *
 * Usage:
 *   npm run build && PORT=3210 npm run start &   # serve the production build
 *   BASE_URL=http://localhost:3210 node scripts/capture-guide-screenshots.mjs
 *
 * Requires a Chromium available to Playwright. The selectors key off stable
 * bank-item labels (banks.ts) and the flow-nav accessible name; if those change,
 * update the regexes here.
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const BASE = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../docs/guide/img");
mkdirSync(OUT, { recursive: true });

const QUESTION = {
  en: "I'm overwhelmed — how do I manage my time better?",
  fr: "Je suis débordé·e — comment mieux gérer mon temps ?",
};

const browser = await chromium.launch();

async function fresh(locale) {
  const ctx = await browser.newContext({
    viewport: { width: 1000, height: 800 },
    deviceScaleFactor: 1.5,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  await ctx.addInitScript((loc) => localStorage.setItem("qart.locale", loc), locale);
  return ctx;
}

const shot = (page, name) =>
  page.screenshot({ path: `${OUT}/${name}.png`, animations: "disabled" });

async function landing(locale) {
  const ctx = await fresh(locale);
  const page = await ctx.newPage();
  await page.goto(BASE + "/");
  await page.getByRole("link", { name: /Atlas/ }).waitFor();
  await shot(page, `${locale}-landing`);
  await ctx.close();
}

async function atlasFlow(locale) {
  const ctx = await fresh(locale);
  const page = await ctx.newPage();
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  const next = nav.getByRole("button", { name: /Next|Suivant/ });

  await page.goto(BASE + "/atlas");
  await page.getByRole("textbox").first().fill(QUESTION[locale]);
  await page.getByRole("button", { name: /handle everything myself|tout gérer moi-même/i }).click();
  await page
    .getByRole("button", {
      name: /real problem, not a passing|vrai problème, pas une contrariété/i,
    })
    .click();
  await shot(page, `${locale}-atlas-board`);

  // Fill a few more facets so the reading has substance.
  await next.click(); // stakeholders
  await page
    .getByRole("button", { name: /my team|mon équipe/i })
    .first()
    .click();
  await next.click(); // emotions
  await page.getByRole("button", { name: /fear \/ anxiety|peur \/ anxiété/i }).click();
  await next.click(); // direction
  await page.getByRole("button", { name: /more time \/ energy|plus de temps/i }).click();
  await next.click(); // means & history
  await page
    .getByRole("button", { name: /working harder|travailler plus|more of the same/i })
    .first()
    .click();
  await next.click(); // forces against
  await page
    .getByRole("button", { name: /avoid a hard conversation|évite une conversation difficile/i })
    .click();
  await next.click(); // commitment
  await next.click(); // synthesis
  await page.getByText(/Cycle 1/).waitFor();
  await shot(page, `${locale}-reading`);

  // Adopt a reframe → recursion → plan (EN only; FR guide reuses its reading shot).
  if (locale === "en") {
    await page
      .getByRole("button", { name: /Use this|Utiliser/ })
      .first()
      .click();
    await shot(page, "en-pivot");
    await page
      .getByRole("button", { name: /Explore this question|Explorer cette question/ })
      .click();
    for (let i = 0; i < 7; i++) await next.click();
    await page.getByText(/Cycle 2/).waitFor();
    await page.getByRole("button", { name: /Add a step|Ajouter un pas/ }).click();
    await page
      .getByRole("textbox", { name: /^Action$/ })
      .first()
      .fill("On Monday I hand task ABC to X — and keep only light oversight.");
    await shot(page, "en-plan");
  }
  await ctx.close();
}

async function socrate(locale) {
  const ctx = await fresh(locale);
  const page = await ctx.newPage();
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  const next = nav.getByRole("button", { name: /Next|Suivant/ });
  await page.goto(BASE + "/socrate");
  await next.click();
  await page.getByRole("textbox").fill(QUESTION[locale]);
  await next.click(); // first rubric node (with follow-ups)
  await page.getByText(/Also worth asking|À se demander aussi/).waitFor();
  await shot(page, `${locale}-socrate`);
  await ctx.close();
}

async function cartes(locale) {
  const ctx = await fresh(locale);
  const page = await ctx.newPage();
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  await page.goto(BASE + "/cartes");
  await page.getByRole("textbox").fill(QUESTION[locale]);
  await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  await page.getByRole("button", { name: /^(Keep|Garder)$/ }).waitFor();
  await shot(page, `${locale}-cartes`);
  await ctx.close();
}

await landing("en");
await atlasFlow("en");
await socrate("en");
await cartes("en");
await landing("fr");
await atlasFlow("fr");
await socrate("fr");
console.log(`captured → ${OUT}`);
await browser.close();
