# Security Policy

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (`LICENSE`).

## Posture (v1)

Q‑Art v1 is a **fully local, client‑only** app. There is **no backend, no account, and no
network transmission of decision content**. Concretely:

- **Decision content never leaves the device.** It is stored locally in IndexedDB, **encrypted at
  rest** with AES‑GCM under a **non‑extractable** key (ADR‑020). Key material is never exported.
- **No secrets in the repo.** v1 ships no API keys, tokens, or `.env`. (The v2 Mistral proxy will
  keep secrets server‑side only — see `data-policy.md`.)
- **No off‑device telemetry.** Diagnostics are **content‑free by construction** (typed sink +
  redaction, ADR‑013) and only leave the device if *you* export and share a bundle.
- **Export/backup & delete** are first‑class: a portable JSON dossier and a "delete all" action.
- **The installer** is transparent, least‑privilege, and never requires root (ADR‑023). It only
  touches OS packages with `--with-deps`, printing the exact commands first; pins a tag and prints
  the checked‑out commit; reversible via `--uninstall`.

## Reporting a vulnerability

Email **github@ideotion.com** with a description, reproduction steps, and impact. Please do not open
a public issue for security reports. We'll acknowledge and work a fix; coordinated disclosure is
appreciated.

## Scope notes

- Client‑side encryption protects data **at rest**; it does not defend against a compromised device
  or a malicious browser extension.
- `localStorage` holds only non‑sensitive preferences (locale, chosen GUI, dismissed prompts).
- Third‑party dependencies are kept minimal and MIT/Apache‑compatible; new deps and licenses are
  recorded in the PR.
