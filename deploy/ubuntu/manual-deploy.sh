#!/usr/bin/env bash
# Build locally and activate on a remote Ubuntu host (manual deploy).
# Usage:
#   UBUNTU_HOST=1.2.3.4 UBUNTU_USER=ubuntu ./deploy/ubuntu/manual-deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HOST="${UBUNTU_HOST:?Set UBUNTU_HOST}"
USER="${UBUNTU_USER:-ubuntu}"
PORT="${UBUNTU_SSH_PORT:-22}"
APP_DIR="${UBUNTU_APP_DIR:-/var/www/portfolio}"

cd "$ROOT"
npm ci
npm test
npm run build

tar -czf /tmp/portfolio-release.tar.gz -C dist .
scp -P "$PORT" /tmp/portfolio-release.tar.gz "${USER}@${HOST}:/tmp/portfolio-release.tar.gz"
scp -P "$PORT" "$ROOT/deploy/ubuntu/remote-activate.sh" "${USER}@${HOST}:/tmp/portfolio-remote-activate.sh"
ssh -p "$PORT" "${USER}@${HOST}" \
  "chmod +x /tmp/portfolio-remote-activate.sh && APP_DIR='${APP_DIR}' RELEASE_SHA='manual' /tmp/portfolio-remote-activate.sh"

echo "Deployed to ${USER}@${HOST}:${APP_DIR}"
