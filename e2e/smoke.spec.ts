import { expect, test } from "@playwright/test";

test("landing offers both doors", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Atlas/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Socrate/ })).toBeVisible();
});

test("language toggle switches to French", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "FR" }).click();
  await expect(page.getByText(/Choisissez une porte/)).toBeVisible();
});

test("Atlas walks the boards to the synthesis", async ({ page }) => {
  await page.goto("/atlas");
  const nav = page.getByRole("navigation"); // scope to the flow nav, not stray buttons
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (let i = 0; i < 7; i++) {
    await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  }
  await expect(page.getByText(/Initial question|Question initiale/)).toBeVisible();
});

test("Socrate starts the deterministic question-tree", async ({ page }) => {
  await page.goto("/socrate");
  const nav = page.getByRole("navigation");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await nav.getByRole("button", { name: /Next|Suivant/ }).click();
  // The first real node asks for the question. Query by role: react-textarea-autosize
  // also renders a hidden aria-hidden measurement textarea, which role queries exclude.
  await expect(page.getByRole("textbox")).toBeVisible();
});
