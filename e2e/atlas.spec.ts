import { expect, test } from "@playwright/test";

test("Atlas command palette jumps to a board", async ({ page }) => {
  await page.goto("/atlas");
  await page.getByRole("button", { name: /Commands/ }).click();
  const input = page.getByRole("textbox", { name: /Jump to a board/ });
  await expect(input).toBeVisible();
  await input.fill("Synthesis");
  await page.keyboard.press("Enter");
  await expect(page.getByText(/Initial question|Question initiale/)).toBeVisible();
});

test("Socrate shows gentle step progress", async ({ page }) => {
  await page.goto("/socrate");
  await expect(page.getByText(/Step 1 of|Étape 1 sur/)).toBeVisible();
});
