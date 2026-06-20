import { expect, test } from "@playwright/test";

test("About carries the safeguarding + crisis notice and diagnostics export", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: /About Q‑Art/ })).toBeVisible();
  await expect(page.getByText(/emergency number/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Download diagnostics/ })).toBeVisible();
});

test("the safeguarding notice is reachable from a GUI", async ({ page }) => {
  await page.goto("/atlas");
  await page.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about/);
  await expect(page.getByText(/not therapy/i)).toBeVisible();
});
