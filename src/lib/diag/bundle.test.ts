import { beforeEach, describe, expect, it } from "vitest";
import { buildBundle, bundleFile } from "./bundle";
import { clearEvents, diag } from "./diag";
import { safe } from "./types";

beforeEach(() => clearEvents());

describe("diagnostics bundle", () => {
  it("asserts safeToShare and carries the content-free event stream", () => {
    diag("I", "app", "app.boot");
    diag("E", "cartes", "cartes.card.keep", { rubric: safe("emotions") });
    const bundle = buildBundle({ commit: "abc1234" });
    expect(bundle.manifest.safeToShare).toBe(true);
    expect(bundle.manifest.commit).toBe("abc1234");
    expect(bundle.events).toHaveLength(2);
    // Every event has only the dense, allowed keys — no free-form content.
    const allowed = new Set(["t", "l", "c", "e", "cid", "d", "x"]);
    for (const ev of bundle.events) {
      for (const k of Object.keys(ev)) expect(allowed.has(k)).toBe(true);
    }
  });

  it("produces a commit-stamped .json filename and parseable JSON", () => {
    diag("I", "app", "app.ready");
    const { filename, json } = bundleFile({ commit: "deadbee" });
    expect(filename).toMatch(/^qart-diag-deadbee-\d+\.json$/);
    expect(JSON.parse(json).manifest.safeToShare).toBe(true);
  });
});
