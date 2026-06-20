#!/usr/bin/env bash
#
# Q-Art uninstaller — removes the install directory and the user service.
# Thin shim: delegates to install.sh --uninstall when present; otherwise removes
# things inline so it also works when fetched on its own.
#
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "${here}/install.sh" ]]; then
  exec bash "${here}/install.sh" --uninstall "$@"
fi

DIR="${XDG_DATA_HOME:-${HOME}/.local/share}/q-art"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir) DIR="${2:?--dir needs a path}"; shift 2 ;;
    --help | -h) printf 'Usage: bash uninstall.sh [--dir <path>]\n'; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; exit 1 ;;
  esac
done

unit="${HOME}/.config/systemd/user/q-art.service"
if command -v systemctl >/dev/null 2>&1 && [[ -f "${unit}" ]]; then
  systemctl --user disable --now q-art.service || true
  rm -f "${unit}"
  systemctl --user daemon-reload || true
fi

if [[ -d "${DIR}" ]]; then
  rm -rf "${DIR}"
  printf 'Removed %s\n' "${DIR}"
else
  printf 'Nothing to remove at %s\n' "${DIR}"
fi
