import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

test("exports a versioned JSON dossier from the synthesis", async ({ page }) => {
  await page.goto("/atlas");
  await page.getByRole("textbox").first().fill("Export me?");
  const nav = page.getByRole("navigation", { name: /Steps|Étapes/ });
  for (let i = 0; i < 7; i++) await nav.getByRole("button", { name: /Next|Suivant/ }).click();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Export dossier|Exporter le dossier/ }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^qart-dossier-.*\.json$/);
  const path = await download.path();
  const text = readFileSync(path, "utf8");
  expect(text).toContain('"schemaVersion"');
  expect(text).toContain('"kind": "qart.dossier"');
});

test("autosaves to encrypted storage and offers to continue after a full reload", async ({
  page,
}) => {
  const q = "Persisted across reload?";
  await page.goto("/atlas");
  await page.getByRole("textbox").first().fill(q);
  // The header shows a quiet autosave status once the encrypted write lands.
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();

  // A full fresh load (new JS context) — the only way back in is from storage.
  await page.goto("/");
  const cont = page.getByRole("button", { name: /Continue your last session/ });
  await expect(cont).toBeVisible();
  await cont.click();

  await expect(page).toHaveURL(/\/atlas/);
  await expect(page.getByRole("textbox").first()).toHaveValue(q);
});
