import { expect, test } from "@playwright/test";

test("links a web manifest and registers a service worker", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    /manifest\.webmanifest/,
  );

  // The hand-authored SW (ADR-021) registers for offline use.
  await page.waitForFunction(
    async () => !!(await navigator.serviceWorker?.getRegistration()),
    null,
    {
      timeout: 15000,
    },
  );
});

test("serves the manifest with installable fields", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.ok()).toBeTruthy();
  const m = await res.json();
  expect(m.name).toBeTruthy();
  expect(m.start_url).toBe("/");
  expect(m.display).toBe("standalone");
  expect(Array.isArray(m.icons) && m.icons.length).toBeTruthy();
});
