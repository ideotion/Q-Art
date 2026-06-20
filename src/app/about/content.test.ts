import { describe, expect, it } from "vitest";
import { ABOUT_SECTIONS, SAFEGUARDING } from "./content";
import { LOCALES, type LocalizedText } from "@/lib/qart";

const complete = (t: LocalizedText) => LOCALES.every((l) => t[l]?.trim().length > 0);

describe("About/Help content (FR/EN parity is a gate)", () => {
  it("has bilingual heading + body for every section, including safeguarding", () => {
    for (const s of [...ABOUT_SECTIONS, SAFEGUARDING]) {
      expect(complete(s.heading), s.heading.en).toBe(true);
      expect(complete(s.body), s.heading.en).toBe(true);
    }
  });

  it("keeps the crisis signposting in the safeguarding notice", () => {
    expect(SAFEGUARDING.body.en).toMatch(/emergency/i);
    expect(SAFEGUARDING.body.fr).toMatch(/urgence/i);
  });
});
