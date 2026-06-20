import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Accessibility gate (WCAG 2.2 AA, brief §7). Every GUI is scanned in light + dark
 * and EN + FR; CI fails on any serious/critical violation. axe can't prove full
 * conformance, but it catches the regressions that matter (contrast, names, roles).
 */
const ROUTES = ["/", "/atlas", "/socrate", "/cartes", "/about"];
const SCHEMES = ["light", "dark"] as const;
const LOCALES = ["en", "fr"] as const;
const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function scan(page: Page, route: string, locale: string, scheme: "light" | "dark") {
  await page.emulateMedia({ colorScheme: scheme });
  await page.addInitScript((loc) => localStorage.setItem("qart.locale", loc), locale);
  await page.goto(route);
  await page.getByRole("heading").first().waitFor();

  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(
    serious,
    JSON.stringify(serious.map((v) => ({ id: v.id, nodes: v.nodes.length }))),
  ).toEqual([]);
}

for (const route of ROUTES) {
  for (const scheme of SCHEMES) {
    for (const locale of LOCALES) {
      test(`a11y ${route} · ${scheme} · ${locale}`, async ({ page }) => {
        await scan(page, route, locale, scheme);
      });
    }
  }
}
