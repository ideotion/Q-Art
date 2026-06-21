#!/usr/bin/env bash
#
# Q-Art installer — transparent, least-privilege, Debian-first.
#
# Q-Art is a 100% local decision-making app: it runs entirely on your machine and
# sends none of your data anywhere. This script clones the repo, builds it, and
# starts it on http://localhost. It never needs root: if Node.js is missing it
# downloads an official Node build into a user cache (checksum-verified) and uses
# it locally. --with-deps is an opt-in for a system-wide Node via apt/NodeSource
# (it prints the exact commands first).
#
# Audit before running (recommended):
#   curl -fsSLO https://raw.githubusercontent.com/ideotion/q-art/main/install.sh
#   less install.sh && bash install.sh
#
set -euo pipefail

# --- constants -------------------------------------------------------------
readonly APP_NAME="Q-Art"
readonly REPO_SLUG="ideotion/q-art"
readonly REPO_URL="https://github.com/${REPO_SLUG}.git"
readonly DEFAULT_REF="0.1.0-rc.1" # the RC tag; falls back to main if absent
readonly MIN_NODE_MAJOR=20
readonly NODE_VERSION="20.18.1" # pinned local Node, fetched when none is present
readonly NODE_DIST="https://nodejs.org/dist/v${NODE_VERSION}"
readonly NODE_CACHE="${XDG_CACHE_HOME:-${HOME}/.cache}/q-art"
NODE_BIN_DIR="" # set by ensure_node; used by the systemd unit

# --- defaults (overridable by flags) --------------------------------------
DIR="${XDG_DATA_HOME:-${HOME}/.local/share}/q-art"
REF="${DEFAULT_REF}"
PORT=3000
DRY_RUN=0
NO_START=0
SERVICE=0
WITH_DEPS=0
UNINSTALL=0

# --- output helpers --------------------------------------------------------
c_reset=$'\033[0m'; c_accent=$'\033[36m'; c_warn=$'\033[33m'; c_dim=$'\033[2m'
step() { printf '\n%s▸ %s%s\n' "${c_accent}" "$*" "${c_reset}"; }
log() { printf '   %s\n' "$*"; }
warn() { printf '%s   ! %s%s\n' "${c_warn}" "$*" "${c_reset}"; }
die() { printf '\n   ✗ %s\n' "$*" >&2; exit 1; }

run() {
  # Echo every action; execute unless this is a dry run.
  if [[ "${DRY_RUN}" -eq 1 ]]; then
    printf '%s   [dry-run] %s%s\n' "${c_dim}" "$*" "${c_reset}"
  else
    log "\$ $*"
    "$@"
  fi
}

banner() {
  printf '%s' "${c_accent}"
  cat <<'BANNER'
  ┌──────────────────────────────────────────────────────────┐
  │  Q-Art — strategic decision-making, 100% on your device   │
  └──────────────────────────────────────────────────────────┘
BANNER
  printf '%s' "${c_reset}"
  log "Source : https://github.com/${REPO_SLUG}"
  log "Privacy: a local app — it sends none of your data anywhere."
}

usage() {
  cat <<EOF
${APP_NAME} installer

Usage: bash install.sh [options]

Options:
  --dir <path>     Install location (default: \$XDG_DATA_HOME/q-art or ~/.local/share/q-art)
  --ref <ref>      Branch or tag to install (default: ${DEFAULT_REF}, falls back to main)
  --port <n>       Port to serve on (default: ${PORT})
  --no-start       Build only; do not start the server
  --service        Install a user systemd unit (systemctl --user) — never system-wide
  --with-deps      Install Node system-wide via apt/NodeSource instead of the local,
                   no-root Node (prints the exact commands first)
  --dry-run        Print every action without changing anything
  --uninstall      Remove the install directory, the user service, and the cached Node
  --help           Show this help

This installer never requires root. If Node >= ${MIN_NODE_MAJOR} is missing it downloads an
official Node ${NODE_VERSION} build into a user cache and verifies its SHA-256 — no system
changes. Use --with-deps only if you'd rather install Node system-wide (needs sudo).
EOF
}

# --- argument parsing ------------------------------------------------------
parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dir) DIR="${2:?--dir needs a path}"; shift 2 ;;
      --ref) REF="${2:?--ref needs a value}"; shift 2 ;;
      --port) PORT="${2:?--port needs a value}"; shift 2 ;;
      --no-start) NO_START=1; shift ;;
      --service) SERVICE=1; shift ;;
      --with-deps) WITH_DEPS=1; shift ;;
      --dry-run) DRY_RUN=1; shift ;;
      --uninstall) UNINSTALL=1; shift ;;
      --help|-h) usage; exit 0 ;;
      *) die "Unknown option: $1 (try --help)" ;;
    esac
  done
}

have() { command -v "$1" >/dev/null 2>&1; }

# Download a URL to a file using whatever's available.
fetch() {
  local url="$1" dest="$2"
  if have curl; then
    curl -fsSL "${url}" -o "${dest}"
  elif have wget; then
    wget -qO "${dest}" "${url}"
  else
    die "Need 'curl' or 'wget' to download. Install one and retry."
  fi
}

# Map `uname -m` to a Node release arch; non-zero if unsupported.
map_arch() {
  case "$1" in
    x86_64 | amd64) printf 'x64' ;;
    aarch64 | arm64) printf 'arm64' ;;
    armv7l) printf 'armv7l' ;;
    *) return 1 ;;
  esac
}

# --- steps -----------------------------------------------------------------
detect_os() {
  step "Checking the system"
  if [[ -r /etc/os-release ]]; then
    # shellcheck disable=SC1091
    . /etc/os-release
    log "OS: ${PRETTY_NAME:-unknown}"
    case "${ID:-}${ID_LIKE:-}" in
      *debian*|*ubuntu*) : ;;
      *) warn "Designed for Debian/Ubuntu; other distros may work but are untested." ;;
    esac
  else
    warn "Could not read /etc/os-release; proceeding cautiously."
  fi
  have git || die "git is required. Install it (e.g. 'sudo apt-get install -y git') and retry."
}

node_major() { node -v 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/'; }

ensure_node() {
  step "Checking Node.js (>= ${MIN_NODE_MAJOR})"
  local major
  if have node; then
    major="$(node_major)"
    if [[ -n "${major}" && "${major}" -ge "${MIN_NODE_MAJOR}" ]]; then
      log "Found Node $(node -v)."
      NODE_BIN_DIR="$(dirname "$(command -v node)")"
      return 0
    fi
    warn "Node $(node -v) is older than ${MIN_NODE_MAJOR}."
  else
    warn "Node.js was not found — it will be installed as part of setup."
  fi

  # Default: a self-contained, no-root local Node. --with-deps installs it system-wide.
  if [[ "${WITH_DEPS}" -eq 1 ]]; then
    install_node_system
  else
    provision_local_node
  fi
}

# System-wide Node via NodeSource (opt-in; needs sudo). Prints commands first.
install_node_system() {
  step "Installing Node ${MIN_NODE_MAJOR}.x via NodeSource (system-wide, needs sudo)"
  log "The exact commands that will run:"
  log "  curl -fsSL https://deb.nodesource.com/setup_${MIN_NODE_MAJOR}.x | sudo -E bash -"
  log "  sudo apt-get install -y nodejs"
  if [[ "${DRY_RUN}" -eq 1 ]]; then
    printf '%s   [dry-run] (skipped system Node install)%s\n' "${c_dim}" "${c_reset}"
    return 0
  fi
  curl -fsSL "https://deb.nodesource.com/setup_${MIN_NODE_MAJOR}.x" | sudo -E bash -
  sudo apt-get install -y nodejs
  NODE_BIN_DIR="$(dirname "$(command -v node)")"
}

# Default path: download an official Node build into a user cache (no root) and
# verify its SHA-256 against nodejs.org before use.
provision_local_node() {
  local arch root tarball
  arch="$(map_arch "$(uname -m)")" ||
    die "Unsupported CPU architecture '$(uname -m)'. Install Node >= ${MIN_NODE_MAJOR} manually, or re-run with --with-deps."
  root="${NODE_CACHE}/node-v${NODE_VERSION}-linux-${arch}"
  tarball="node-v${NODE_VERSION}-linux-${arch}.tar.gz"

  step "Provisioning Node ${NODE_VERSION} locally (no root) → ${NODE_CACHE}"
  if [[ -x "${root}/bin/node" ]]; then
    log "Reusing the cached Node at ${root}."
  elif [[ "${DRY_RUN}" -eq 1 ]]; then
    printf '%s   [dry-run] download %s/%s, verify SHA-256, extract to %s%s\n' \
      "${c_dim}" "${NODE_DIST}" "${tarball}" "${root}" "${c_reset}"
  else
    local tmp
    tmp="$(mktemp -d)"
    log "Downloading ${NODE_DIST}/${tarball}"
    fetch "${NODE_DIST}/${tarball}" "${tmp}/${tarball}"
    log "Verifying SHA-256 against ${NODE_DIST}/SHASUMS256.txt"
    fetch "${NODE_DIST}/SHASUMS256.txt" "${tmp}/SHASUMS256.txt"
    (cd "${tmp}" && grep " ${tarball}\$" SHASUMS256.txt | sha256sum -c -) ||
      {
        rm -rf "${tmp}"
        die "Node checksum verification failed — aborting."
      }
    mkdir -p "${root}"
    tar -xzf "${tmp}/${tarball}" -C "${root}" --strip-components=1
    rm -rf "${tmp}"
    log "Installed Node into ${root}."
  fi

  NODE_BIN_DIR="${root}/bin"
  export PATH="${NODE_BIN_DIR}:${PATH}"
  [[ "${DRY_RUN}" -eq 1 ]] || log "Using $(node -v)."
}

resolve_ref() {
  # Print REF if it exists on the remote (as branch or tag), else 'main'.
  if git ls-remote --exit-code "${REPO_URL}" "${REF}" >/dev/null 2>&1 \
    || git ls-remote --exit-code "${REPO_URL}" "refs/tags/${REF}" >/dev/null 2>&1; then
    printf '%s' "${REF}"
  else
    printf 'main'
  fi
}

fetch_repo() {
  step "Fetching ${APP_NAME} (${REF}) into ${DIR}"
  local ref
  ref="$(resolve_ref)"
  if [[ "${ref}" != "${REF}" ]]; then
    warn "Ref '${REF}' not found on the remote; falling back to 'main'."
  fi

  if [[ -d "${DIR}/.git" ]]; then
    log "Existing checkout found — updating (idempotent)."
    local origin
    origin="$(git -C "${DIR}" remote get-url origin 2>/dev/null || echo '')"
    [[ "${origin}" == "${REPO_URL}" ]] || warn "Unexpected origin: ${origin}"
    run git -C "${DIR}" fetch --tags --force origin
    run git -C "${DIR}" checkout "${ref}"
    run git -C "${DIR}" pull --ff-only origin "${ref}" || true
  else
    run mkdir -p "${DIR}"
    run git clone --depth 1 --branch "${ref}" "${REPO_URL}" "${DIR}"
  fi

  if [[ "${DRY_RUN}" -eq 0 ]]; then
    log "Checked out commit: $(git -C "${DIR}" rev-parse --short HEAD)"
  fi
}

build_app() {
  step "Installing dependencies and building"
  run npm --prefix "${DIR}" ci
  run npm --prefix "${DIR}" run build
}

install_service() {
  step "Installing a user systemd service (systemctl --user)"
  local unit_dir="${HOME}/.config/systemd/user"
  local unit="${unit_dir}/q-art.service"
  local node_bin="${NODE_BIN_DIR:-/usr/bin}"
  local npm_bin="${node_bin}/npm"
  if [[ "${DRY_RUN}" -eq 1 ]]; then
    printf '%s   [dry-run] write %s and enable it%s\n' "${c_dim}" "${unit}" "${c_reset}"
    return 0
  fi
  mkdir -p "${unit_dir}"
  cat >"${unit}" <<EOF
[Unit]
Description=${APP_NAME} (local, offline decision tool)
After=network.target

[Service]
WorkingDirectory=${DIR}
Environment=PORT=${PORT}
Environment=PATH=${node_bin}:/usr/local/bin:/usr/bin:/bin
ExecStart=${npm_bin} run start
Restart=on-failure

[Install]
WantedBy=default.target
EOF
  systemctl --user daemon-reload
  systemctl --user enable --now q-art.service
  log "Service started. Manage it with: systemctl --user status q-art"
  log "Open http://localhost:${PORT}"
}

start_app() {
  step "Starting ${APP_NAME} on http://localhost:${PORT}"
  log "Press Ctrl+C to stop. Re-run anytime, or use --service to run in the background."
  if [[ "${DRY_RUN}" -eq 1 ]]; then
    printf '%s   [dry-run] PORT=%s npm --prefix %s run start%s\n' \
      "${c_dim}" "${PORT}" "${DIR}" "${c_reset}"
    return 0
  fi
  PORT="${PORT}" npm --prefix "${DIR}" run start
}

do_uninstall() {
  banner
  step "Uninstalling ${APP_NAME}"
  local unit="${HOME}/.config/systemd/user/q-art.service"
  if have systemctl && [[ -f "${unit}" ]]; then
    run systemctl --user disable --now q-art.service || true
    run rm -f "${unit}"
    run systemctl --user daemon-reload || true
  fi
  if [[ -d "${DIR}" ]]; then
    run rm -rf "${DIR}"
    log "Removed ${DIR}"
  else
    log "Nothing to remove at ${DIR}"
  fi
  if [[ -d "${NODE_CACHE}" ]]; then
    run rm -rf "${NODE_CACHE}"
    log "Removed cached Node (${NODE_CACHE})"
  fi
  log "Done. Your exported dossiers (if any) are wherever you saved them — untouched."
}

main() {
  parse_args "$@"
  if [[ "${UNINSTALL}" -eq 1 ]]; then
    do_uninstall
    exit 0
  fi
  banner
  [[ "${DRY_RUN}" -eq 1 ]] && warn "Dry run — nothing will be changed."
  detect_os
  ensure_node
  fetch_repo
  build_app
  if [[ "${SERVICE}" -eq 1 ]]; then
    install_service
  elif [[ "${NO_START}" -eq 1 ]]; then
    step "Build complete"
    log "Start later with: PORT=${PORT} npm --prefix ${DIR} run start"
  else
    start_app
  fi
}

main "$@"
