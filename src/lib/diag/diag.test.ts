import { beforeEach, describe, expect, it } from "vitest";
import { buildManifest, clearEvents, diag, getEvents, toJsonl } from "./diag";
import { REDACTED } from "./redact";
import { safe } from "./types";

beforeEach(() => clearEvents());

describe("diag core", () => {
  it("records only the dense, allowed keys", () => {
    diag("E", "socrate", "llm.structured.invalid", { tier: safe("small"), retry: 1 });
    const [ev] = getEvents();
    expect(Object.keys(ev).sort()).toEqual(["c", "e", "l", "t", "x"]);
    expect(ev).toMatchObject({ l: "E", c: "socrate", e: "llm.structured.invalid" });
    expect(ev.x).toEqual({ tier: "small", retry: 1 });
    expect(typeof ev.t).toBe("number");
  });

  it("redacts secret/PII-shaped context values", () => {
    diag("W", "net", "net.error", { note: safe("ping a@b.com with sk-ABCDEFGH12345678") });
    const ev = getEvents()[0];
    expect(ev.x?.note).not.toContain("a@b.com");
    expect(ev.x?.note).toContain(REDACTED);
  });

  it("builds a safe-to-share manifest with counts and last errors", () => {
    diag("E", "app", "app.error");
    diag("I", "app", "app.ready");
    const m = buildManifest({ commit: "abc1234" });
    expect(m.safeToShare).toBe(true);
    expect(m.counts.total).toBe(2);
    expect(m.counts.byLevel.E).toBe(1);
    expect(m.lastErrors).toContain("app.error");
    expect(m.commit).toBe("abc1234");
  });

  it("serializes events as JSONL", () => {
    diag("I", "app", "app.boot");
    diag("I", "app", "app.ready");
    const lines = toJsonl().split("\n");
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0]).e).toBe("app.boot");
  });

  it("makes decision content unrepresentable in a diag context (compile-time guarantee)", () => {
    const guard = () =>
      // @ts-expect-error a raw content string is not a SafeValue — this must NOT type-check
      diag("I", "store", "store.tx", { question: "Should I resign?" });
    // Never invoked — the guarantee is the type error asserted above.
    expect(typeof guard).toBe("function");
  });
});
