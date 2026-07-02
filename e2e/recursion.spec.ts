import { expect, test } from "@playwright/test";

/**
 * Recursion — the method's defining move (concept.md §3.4): the reformulated
 * question feeds a fresh cycle; a later pass builds the action plan. This walks
 * the canonical shape: map → reframe → new cycle → structured plan.
 */
test("the reframed question starts cycle 2, where the action plan is built", async ({ page }) => {
  await page.goto("/atlas");

  // Cycle 1: state a binary question, tick a belief, reach the synthesis.
  await page.getByRole("textbox").first().fill("Should I resign?");
  await page.getByRole("button", { name: /handle everything myself/i }).click();
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  for (let i = 0; i < 7; i++) await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  await expect(page.getByText(/Cycle 1/)).toBeVisible();

  // Adopt an offered reframe, then take the pivot: a new cycle on that question.
  await page
    .getByRole("button", { name: /Use this|Utiliser/ })
    .first()
    .click();
  const reframed = await page
    .getByRole("textbox", { name: /A better question|Une meilleure question/ })
    .inputValue();
  expect(reframed).not.toBe("");
  await page.getByRole("button", { name: /Explore this question|Explorer cette question/ }).click();

  // Back on board 1 of a clean map, carrying the reframed question.
  await expect(page.getByRole("textbox").first()).toHaveValue(reframed);

  // Walk to the synthesis of cycle 2: the action plan is now front and centre.
  for (let i = 0; i < 7; i++) await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  await expect(page.getByText(/Cycle 2/)).toBeVisible();
  await page.getByRole("button", { name: /Add a step|Ajouter un pas/ }).click();
  await page
    .getByRole("textbox", { name: /^(Action)$/ })
    .first()
    .fill("On Monday I hand task ABC to X.");
  await expect(page.getByText(/Step 1|Pas 1/)).toBeVisible();
});
