import { expect, test, type Page } from "@playwright/test";

/**
 * The weighting pass (ADR-005/022) — the product's declared A/B decision point.
 * Covers all three methods end-to-end: direct steppers, MaxDiff (most/least),
 * and constant-sum marbles, each reachable and applicable by mouse/keyboard.
 */

const FIRST = /real problem, not a passing|vrai problème, pas une contrariété/i;
const SECOND = /handle everything myself|tout gérer moi-même/i;

async function toWeighting(page: Page) {
  await page.goto("/atlas");
  await page.getByRole("textbox").first().fill("Should I resign?");
  await page.getByRole("button", { name: FIRST }).click();
  await page.getByRole("button", { name: SECOND }).click();
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  for (let i = 0; i < 7; i++) await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  await page
    .getByText(/Weigh what matters \(optional\)|Pesez ce qui compte \(facultatif\)/)
    .click();
}

test("steppers: every control is named after its item and sets the billes", async ({ page }) => {
  await toWeighting(page);
  // Named per item (SC 1.3.1/2.4.6): "Importance — <item label> 5/5".
  const five = page.getByRole("button", { name: /Importance — It.?s a real problem.*5\/5/ });
  await expect(five).toBeVisible();
  await five.click();
  await expect(five).toHaveAttribute("aria-pressed", "true");
});

test("MaxDiff: most/least screens fold back into weights", async ({ page }) => {
  await toWeighting(page);
  await page.getByRole("button", { name: /Most \/ least|Plus \/ moins/ }).click();
  // Two items → one screen; buttons are named per item.
  await page
    .getByRole("button", { name: /^(Most|Le plus) — / })
    .first()
    .click();
  await page
    .getByRole("button", { name: /^(Least|Le moins) — / })
    .last()
    .click();
  await page.getByRole("button", { name: /^(Apply|Appliquer)$/ }).click();
  await expect(page.getByText(/Applied|Appliqué/)).toBeVisible();
});

test("marbles: constant-sum allocation applies and never overdraws the pool", async ({ page }) => {
  await toWeighting(page);
  await page.getByRole("button", { name: /^(Marbles|Billes)$/ }).click();
  // The seed fills the pool exactly — never a negative remainder.
  await expect(page.getByText(/^0 marbles left|^0 billes restantes/)).toBeVisible();
  // Free one marble, then apply.
  await page
    .getByRole("button", { name: /real problem.*−$|vrai problème.*−$/ })
    .first()
    .click();
  await expect(page.getByText(/^1 marbles left|^1 billes restantes/)).toBeVisible();
  await page.getByRole("button", { name: /^(Apply|Appliquer)$/ }).click();
  await expect(page.getByText(/Applied|Appliqué/)).toBeVisible();
});

test("checked items re-localize when the language changes mid-session", async ({ page }) => {
  await toWeighting(page);
  await expect(page.getByText(/It.?s a real problem/).first()).toBeVisible();
  await page.getByRole("button", { name: "FR" }).click();
  // The synthesis/weighting must not become mixed-language (locale-stable labels).
  await expect(page.getByText(/C.?est un vrai problème/).first()).toBeVisible();
});
