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
| `--with-deps` | Install Node **system‑wide** via apt/NodeSource instead of the local, no‑root Node (prints the exact commands first). |
| `--uninstall` | Remove the install directory, the user service, and the cached Node. |

## Node.js — installed for you

Node is part of the install, no root required:

1. If a suitable **Node ≥ 20** is already on your `PATH`, it's used as‑is.
2. Otherwise the installer downloads an **official Node build** (currently `22.13.0` LTS) into a user
   cache (`${XDG_CACHE_HOME:-$HOME/.cache}/q-art`), **verifies its SHA‑256** against
   `nodejs.org/dist/.../SHASUMS256.txt`, and uses it locally — nothing system‑wide.
3. Prefer a system‑wide Node (on your global `PATH`)? Pass **`--with-deps`** to install it via
   apt/NodeSource (needs sudo; the exact commands are printed first).

## What it does

1. Detects Debian/Ubuntu and ensures **Node ≥ 20** (see above).
2. Clones or fast‑forwards the repo at `--ref`; prints the **checked‑out commit SHA**; verifies the
   origin URL.
3. `npm ci` → `npm run build`.
4. Starts on `http://localhost:<port>` — or installs the user service with `--service`.

## Security notes

- **Never requires root.** A missing Node is provisioned **locally and checksum‑verified**; the
  system is touched **only** with `--with-deps`, and the exact `apt`/NodeSource commands are
  printed first.
- Pins a tag by default and prints the commit so you know exactly what ran.
- No analytics, no data egress. Reversible with `--uninstall` (or `uninstall.sh`).

## Uninstall

```bash
bash install.sh --uninstall          # or: bash uninstall.sh
```

Your exported dossiers (wherever you saved them) are left untouched.
