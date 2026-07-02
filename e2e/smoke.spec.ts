import { expect, test } from "@playwright/test";

// question card + 10 rubric cards + synthesis card (mirrors CARTES_DECK length).
const CARTES_DECK_LEN = 12;

test("landing offers all three GUIs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Atlas/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Socrate/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Cartes/ })).toBeVisible();
});

test("language toggle switches to French", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "FR" }).click();
  await expect(page.getByText(/Choisissez votre manière/)).toBeVisible();
});

test("Atlas walks the boards to the synthesis", async ({ page }) => {
  await page.goto("/atlas");
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ }); // the flow nav
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (let i = 0; i < 7; i++) {
    await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  }
  await expect(page.getByText(/Initial question|Question initiale/)).toBeVisible();
});

test("Socrate walks the full question-tree with content to the synthesis", async ({ page }) => {
  await page.goto("/socrate");
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  const next = nav.getByRole("button", { name: /Next|Suivant/ });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // intro → question node. Query textboxes by role: react-textarea-autosize also
  // renders a hidden aria-hidden measurement textarea, which role queries exclude.
  await next.click();
  await page.getByRole("textbox").fill("Should I resign?");

  // 10 rubric nodes: tick a proposition on the first, then walk the rest.
  await next.click();
  await page.getByRole("button", { name: /real problem, not a passing/i }).click();
  for (let i = 0; i < 9; i++) await next.click();

  // reframe node → summary node (the synthesis).
  await next.click();
  await page.getByRole("textbox").fill("How do I leave on my own terms?");
  await next.click();
  await expect(page.getByText(/Initial question|Question initiale/)).toBeVisible();
  await expect(page.getByText("Should I resign?").first()).toBeVisible();
});

test("Cartes keeps a card and it reaches the shared synthesis", async ({ page }) => {
  await page.goto("/cartes");
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Question card, then keep the first card of the first rubric's stack.
  await page.getByRole("textbox").fill("Should I move abroad?");
  await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  await page.getByRole("button", { name: /^(Keep|Garder)$/ }).click();

  // Walk the remaining cards to the synthesis.
  for (let i = 0; i < CARTES_DECK_LEN - 2; i++) {
    await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  }
  await expect(page.getByText(/Initial question|Question initiale/)).toBeVisible();
  // The kept item is in the shared object: it shows up in the weighting list.
  await page
    .getByText(/Weigh what matters \(optional\)|Pesez ce qui compte \(facultatif\)/)
    .click();
  await expect(page.getByText(/real problem, not a passing/i).first()).toBeVisible();
});

test("a GUI switch preserves the typed question (one object, three views)", async ({ page }) => {
  await page.goto("/atlas");
  const q = "Should I take the leap?";
  await page.getByRole("textbox").first().fill(q);
  // Switch to Cartes via the header switcher, then back — data must survive.
  await page
    .getByRole("navigation", { name: /Switch view|Changer de vue/ })
    .getByRole("link", { name: /Cartes/ })
    .click();
  await expect(page).toHaveURL(/\/cartes/);
  await expect(page.getByRole("textbox").first()).toHaveValue(q);
});
