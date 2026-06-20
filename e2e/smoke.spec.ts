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

test("Socrate starts the deterministic question-tree", async ({ page }) => {
  await page.goto("/socrate");
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  // The first real node asks for the question. Query by role: react-textarea-autosize
  // also renders a hidden aria-hidden measurement textarea, which role queries exclude.
  await expect(page.getByRole("textbox")).toBeVisible();
});

test("Cartes flips the deck to the synthesis", async ({ page }) => {
  await page.goto("/cartes");
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // question + 10 rubric cards → synthesis card.
  for (let i = 0; i < CARTES_DECK_LEN - 1; i++) {
    await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  }
  await expect(page.getByText(/Initial question|Question initiale/)).toBeVisible();
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
