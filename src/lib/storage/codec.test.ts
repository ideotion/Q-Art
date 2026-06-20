import { describe, expect, it } from "vitest";
import { generateKey, open, seal } from "./codec";

describe("at-rest encryption codec (AES-GCM)", () => {
  it("round-trips a value through seal/open", async () => {
    const key = await generateKey();
    const value = { q: "Should I resign?", weight: 5, nested: { ok: true } };
    const sealed = await seal(key, value);
    expect(await open(key, sealed)).toEqual(value);
  });

  it("produces ciphertext that does not contain the plaintext", async () => {
    const key = await generateKey();
    const sealed = await seal(key, { secret: "fear-of-the-boss" });
    const bytes = new Uint8Array(sealed.ct);
    const asText = new TextDecoder().decode(bytes);
    expect(asText).not.toContain("fear-of-the-boss");
  });

  it("uses a fresh IV each call (same input → different ciphertext)", async () => {
    const key = await generateKey();
    const a = await seal(key, { x: 1 });
    const b = await seal(key, { x: 1 });
    expect(new Uint8Array(a.iv)).not.toEqual(new Uint8Array(b.iv));
    expect(new Uint8Array(a.ct)).not.toEqual(new Uint8Array(b.ct));
  });

  it("a different key cannot open the blob", async () => {
    const k1 = await generateKey();
    const k2 = await generateKey();
    const sealed = await seal(k1, { x: 42 });
    await expect(open(k2, sealed)).rejects.toBeTruthy();
  });

  it("defaults to a non-extractable key", async () => {
    const key = await generateKey();
    expect(key.extractable).toBe(false);
  });
});
