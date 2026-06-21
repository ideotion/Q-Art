import { expect, test } from "@playwright/test";

// The point of the whole app: the synthesis must *interpret*, not just list back.
test("the synthesis gives a real reading and offers a better question", async ({ page }) => {
  await page.goto("/atlas");

  // Board 1 (Question & framing): state a binary question and tick a belief.
  await page.getByRole("textbox").first().fill("Should I resign?");
  await page.getByRole("button", { name: /handle everything myself/i }).click();

  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  for (let i = 0; i < 7; i++) await nav.getByRole("button", { name: /Next|Suivant/ }).click();

  // A reading, not a bare list: interpretation + the pivot.
  await expect(page.getByText(/What stands out|Ce qui ressort/)).toBeVisible();
  await expect(page.getByText(/An assumption worth testing|Un postulat à tester/)).toBeVisible();
  await expect(page.getByText(/A better question|Une meilleure question/)).toBeVisible();

  // An offered reframe the user can adopt with one click.
  const useThis = page.getByRole("button", { name: /Use this|Utiliser/ }).first();
  await expect(useThis).toBeVisible();
  await useThis.click();
  // Clicking fills the "better question" field.
  const reframed = page.getByRole("textbox", { name: /A better question|Une meilleure question/ });
  await expect(reframed).not.toHaveValue("");
});
