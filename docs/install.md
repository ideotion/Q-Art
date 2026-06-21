# Q‑Art — Installer guide

> **Confidential & proprietary** · © 2026 Ideotion · all rights reserved (`LICENSE`).
> The installer (`install.sh`, ADR‑023) clones, builds, and serves Q‑Art **locally**. It is a
> 100% local app — it sends none of your data anywhere.

## Use it

```bash
# Recommended: download, READ, then run
curl -fsSLO https://raw.githubusercontent.com/ideotion/q-art/main/install.sh
less install.sh && bash install.sh

# Convenient one‑liner
curl -fsSL https://raw.githubusercontent.com/ideotion/q-art/main/install.sh | bash
```

Once the `0.1.0‑rc.1` tag is published you can pin it: `bash install.sh --ref 0.1.0-rc.1`
(the script defaults to that tag and falls back to `main` if it isn't found yet).

## Flags

| Flag | Effect |
|---|---|
| `--help` | Show usage. |
| `--dry-run` | Print every action; change nothing. |
| `--dir <path>` | Install location (default `${XDG_DATA_HOME:-$HOME/.local/share}/q-art`). |
| `--ref <branch\|tag>` | What to install (default: the RC tag, else `main`). |
| `--port <n>` | Port to serve on (default `3000`). |
| `--no-start` | Build only; don't start the server. |
| `--service` | Install a **user** `systemctl --user` unit (never system‑wide). |
| `--with-deps` | Allow installing Node via NodeSource (prints the exact commands first). |
| `--uninstall` | Remove the install directory and the user service. |

## What it does

1. Detects Debian/Ubuntu and checks **Node ≥ 20** (instructs, or installs with `--with-deps`).
2. Clones or fast‑forwards the repo at `--ref`; prints the **checked‑out commit SHA**; verifies the
   origin URL.
3. `npm ci` → `npm run build`.
4. Starts on `http://localhost:<port>` — or installs the user service with `--service`.

## Security notes

- **Never requires root.** The system is touched **only** with `--with-deps`, and the exact
  `apt`/NodeSource commands are printed first. Prefer an existing Node or `nvm`.
- Pins a tag by default and prints the commit so you know exactly what ran.
- No analytics, no data egress. Reversible with `--uninstall` (or `uninstall.sh`).

## Uninstall

```bash
bash install.sh --uninstall          # or: bash uninstall.sh
```

Your exported dossiers (wherever you saved them) are left untouched.
