#!/usr/bin/env bash
# Pull latest git commit, build, and atomically publish to APP_DIR/current.
# Used by systemd timer and deploy webhook for auto-update on push.
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/portfolio}"
REPO_DIR="${REPO_DIR:-${APP_DIR}/repo}"
BRANCH="${BRANCH:-master}"
LOCK_FILE="${APP_DIR}/shared/auto-update.lock"

mkdir -p "${APP_DIR}/shared" "${APP_DIR}/releases"

exec 9>"${LOCK_FILE}"
if ! flock -n 9; then
  echo "Auto-update already running — skipping"
  exit 0
fi

if [[ -f "${APP_DIR}/shared/deploy.env" ]]; then
  # shellcheck disable=SC1091
  source "${APP_DIR}/shared/deploy.env"
fi

BRANCH="${BRANCH:-master}"

echo "==> Portfolio auto-update $(date -u +%Y-%m-%dT%H:%M:%SZ)"

if [[ ! -d "${REPO_DIR}/.git" ]]; then
  echo "ERROR: git repo missing at ${REPO_DIR}" >&2
  exit 1
fi

cd "${REPO_DIR}"
git fetch --prune origin "${BRANCH}"
LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/${BRANCH}")"

if [[ "$LOCAL" == "$REMOTE" ]]; then
  echo "Already up to date ($LOCAL)"
  exit 0
fi

echo "Updating ${LOCAL:0:7} → ${REMOTE:0:7}"
git reset --hard "origin/${BRANCH}"

npm ci --prefer-offline
npm test
npm run build

TIMESTAMP="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="${APP_DIR}/releases/${TIMESTAMP}-${REMOTE:0:7}"
mkdir -p "$RELEASE_DIR"
cp -a dist/. "$RELEASE_DIR/"

ls -1dt "${APP_DIR}/releases"/* 2>/dev/null | tail -n +9 | xargs -r rm -rf
ln -sfn "$RELEASE_DIR" "${APP_DIR}/current"

# Symlink swap is enough for static assets; reload nginx if permitted.
if command -v nginx >/dev/null 2>&1; then
  sudo -n nginx -t 2>/dev/null && sudo -n systemctl reload nginx 2>/dev/null || true
fi

echo "==> Published ${RELEASE_DIR}"
