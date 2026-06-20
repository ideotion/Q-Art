import { describe, expect, it } from "vitest";
import { DEFAULT_GUI, GUIS, getGui, isGuiId } from "./registry";
import { LOCALES, type LocalizedText } from "../qart";

const complete = (t: LocalizedText) => LOCALES.every((l) => t[l]?.trim().length > 0);

describe("GUI registry (the triptyque)", () => {
  it("registers exactly the three GUIs with unique ids and routes", () => {
    expect(GUIS.map((g) => g.id)).toEqual(["atlas", "socrate", "cartes"]);
    expect(new Set(GUIS.map((g) => g.route)).size).toBe(3);
  });

  it("has a resolvable default", () => {
    expect(isGuiId(DEFAULT_GUI)).toBe(true);
    expect(getGui(DEFAULT_GUI).id).toBe(DEFAULT_GUI);
  });

  it("throws on an unknown id and rejects it as a guard", () => {
    expect(isGuiId("nope")).toBe(false);
    expect(() => getGui("nope" as never)).toThrow();
  });

  it("is bilingually complete (FR/EN parity is a gate)", () => {
    for (const g of GUIS) {
      expect(complete(g.name), `${g.id} name`).toBe(true);
      expect(complete(g.paradigm), `${g.id} paradigm`).toBe(true);
      expect(complete(g.tagline), `${g.id} tagline`).toBe(true);
      expect(complete(g.bestFor), `${g.id} bestFor`).toBe(true);
    }
  });
});
