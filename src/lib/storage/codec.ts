/**
 * At-rest encryption codec (ADR-020). AES-GCM via the Web Crypto API. The key is
 * generated **non-extractable** — it can be stored in IndexedDB and used to
 * encrypt/decrypt, but never serialized out — so decision content is encrypted at
 * rest with no key material ever leaving the platform key store.
 *
 * Pure-ish and framework-free: works in the browser and in Node's webcrypto, so
 * the round-trip is unit-testable without IndexedDB.
 */
const ALGO = "AES-GCM";
const IV_BYTES = 12;

export interface Sealed {
  iv: ArrayBuffer;
  ct: ArrayBuffer;
}

const subtle = (): SubtleCrypto => {
  const c = globalThis.crypto;
  if (!c?.subtle) throw new Error("Web Crypto unavailable");
  return c.subtle;
};

/** A fresh 256-bit AES-GCM key. Non-extractable by default (strongest posture). */
export function generateKey(extractable = false): Promise<CryptoKey> {
  return subtle().generateKey({ name: ALGO, length: 256 }, extractable, ["encrypt", "decrypt"]);
}

/** Encrypt a JSON-serializable value. A fresh random IV per call. */
export async function seal(key: CryptoKey, value: unknown): Promise<Sealed> {
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const data = new TextEncoder().encode(JSON.stringify(value));
  const ct = await subtle().encrypt({ name: ALGO, iv }, key, data);
  return { iv: iv.buffer, ct };
}

/** Decrypt a sealed blob back into its value. */
export async function open<T>(key: CryptoKey, sealed: Sealed): Promise<T> {
  const pt = await subtle().decrypt({ name: ALGO, iv: new Uint8Array(sealed.iv) }, key, sealed.ct);
  return JSON.parse(new TextDecoder().decode(pt)) as T;
}
