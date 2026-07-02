# Your data — keep it, move it, erase it

> Part of the [Q‑Art User Guide](./README.md).

## Where your words live

**On your device, and nowhere else.** Q‑Art v1 has no account, no server, and no tracking; the app works offline once loaded. What you write is stored in your browser's local database, **encrypted at rest** — the stored bytes are sealed (AES‑GCM) under a key that can never be exported from your browser's key store.

Honest scope: encryption at rest protects the data *as stored*. It does not defend a device someone else controls, or a compromised browser. Your device's own protections (session lock, disk encryption) remain your first line.

## Autosave and coming back

Everything saves automatically as you work (watch the quiet *Saved* indicator in the header). Close the tab whenever you like:

- the **landing page** offers *Continue your last session*;
- opening a GUI directly (bookmark, refresh) resumes your latest saved session by itself.

## Back up: the dossier

From any synthesis, **Your data → Export dossier** downloads a single portable JSON file — your cases, cycles, maps, syntheses and action plans, in the clear, yours. Use it to:

- **back up** (browsers can evict site data under storage pressure — export anything you'd mind losing);
- **move devices** — on the other device, *Import dossier* and your session loads;
- **read your own history** — it's plain JSON, no lock-in.

The dossier is versioned (`schemaVersion`), so future versions of Q‑Art will import old files.

> The exported file is **not encrypted** — it's your readable copy. Store it as you would any private document.

## Erase everything

**Your data → Delete all my data** wipes every case and cycle stored on the device, after a confirmation. It cannot be undone (exported dossiers are untouched — they're wherever you saved them). A fresh, empty session starts immediately.

## The fine print, honestly

- No analytics, no telemetry, no cookies. Nothing is sent anywhere — there is no server to send it to.
- The optional **diagnostics** download (About page) is content-free by construction: event codes, counts and timings — never your words. It leaves your device only if *you* send the file to someone.
- Preferences (language, chosen GUI, dismissed prompts) live in plain localStorage — no decision content there.
- The engineering policy behind all of this: [`docs/data-policy.md`](../data-policy.md).
