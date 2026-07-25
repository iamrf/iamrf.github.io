#!/usr/bin/env bash
# Activate a static release uploaded by CI to /tmp/portfolio-release.tar.gz
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/portfolio}"
RELEASE_SHA="${RELEASE_SHA:-manual}"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="${APP_DIR}/releases/${TIMESTAMP}-${RELEASE_SHA:0:7}"
CURRENT_LINK="${APP_DIR}/current"
TARBALL="/tmp/portfolio-release.tar.gz"

echo "==> Portfolio remote activate"
echo "    APP_DIR=${APP_DIR}"
echo "    RELEASE=${RELEASE_DIR}"

if [[ ! -f "$TARBALL" ]]; then
  echo "Missing tarball: $TARBALL" >&2
  exit 1
fi

mkdir -p "$RELEASE_DIR" "${APP_DIR}/releases"
tar -xzf "$TARBALL" -C "$RELEASE_DIR"
rm -f "$TARBALL"

if [[ ! -f "${RELEASE_DIR}/index.html" ]]; then
  echo "ERROR: index.html missing in release" >&2
  exit 1
fi

# Keep last 8 releases
ls -1dt "${APP_DIR}/releases"/* 2>/dev/null | tail -n +9 | xargs -r rm -rf

ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

if command -v nginx >/dev/null 2>&1; then
  sudo -n nginx -t 2>/dev/null && sudo -n systemctl reload nginx 2>/dev/null || true
fi

echo "==> Release activated: ${RELEASE_DIR}"
