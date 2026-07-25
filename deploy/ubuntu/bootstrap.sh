#!/usr/bin/env bash
# One-time Ubuntu bootstrap for the static portfolio (nginx).
# Usage: sudo DOMAIN=example.com bash deploy/ubuntu/bootstrap.sh
set -euo pipefail

APP_USER="${APP_USER:-portfolio}"
APP_DIR="${APP_DIR:-/var/www/portfolio}"
DOMAIN="${DOMAIN:-portfolio.example.com}"
REPO_URL="${REPO_URL:-https://github.com/iamrf/iamrf.github.io.git}"
BRANCH="${BRANCH:-master}"
ENABLE_AUTO_UPDATE="${ENABLE_AUTO_UPDATE:-1}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash $0"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Updating apt"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates gnupg ufw nginx git tar rsync

echo "==> Installing Node.js 20 (for on-server builds / auto-update)"
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v
npm -v

echo "==> Creating user ${APP_USER}"
if ! id "${APP_USER}" >/dev/null 2>&1; then
  useradd --system --create-home --shell /bin/bash "${APP_USER}"
fi

echo "==> Creating app directories"
mkdir -p "${APP_DIR}/releases" "${APP_DIR}/shared" "${APP_DIR}/current" "${APP_DIR}/repo"
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}"

echo "==> Cloning repository (for auto-update mode)"
if [ ! -d "${APP_DIR}/repo/.git" ]; then
  sudo -u "${APP_USER}" git clone --branch "${BRANCH}" --depth 1 "${REPO_URL}" "${APP_DIR}/repo"
else
  echo "Repo already present at ${APP_DIR}/repo"
fi

SHARED_ENV="${APP_DIR}/shared/deploy.env"
if [ ! -f "${SHARED_ENV}" ]; then
  cat > "${SHARED_ENV}" <<EOF
REPO_URL=${REPO_URL}
BRANCH=${BRANCH}
APP_DIR=${APP_DIR}
WEBHOOK_SECRET=$(openssl rand -hex 24)
EOF
  chmod 600 "${SHARED_ENV}"
  chown "${APP_USER}:${APP_USER}" "${SHARED_ENV}"
  echo "Created ${SHARED_ENV}"
fi

echo "==> Installing nginx site"
cp "${SCRIPT_DIR}/nginx.portfolio.conf" /etc/nginx/sites-available/portfolio
sed -i "s/portfolio.example.com/${DOMAIN}/g" /etc/nginx/sites-available/portfolio
sed -i "s|/var/www/portfolio|${APP_DIR}|g" /etc/nginx/sites-available/portfolio
ln -sfn /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
rm -f /etc/nginx/sites-enabled/default
# Placeholder index so nginx starts before first deploy
if [ ! -f "${APP_DIR}/current/index.html" ]; then
  echo "<!doctype html><title>Portfolio</title><p>Awaiting first deploy</p>" > "${APP_DIR}/current/index.html"
  chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}/current"
fi
nginx -t
systemctl reload nginx

if [ "${ENABLE_AUTO_UPDATE}" = "1" ]; then
  echo "==> Installing auto-update timer + webhook"
  install -m 755 "${SCRIPT_DIR}/auto-update.sh" /usr/local/bin/portfolio-auto-update
  sed -i "s|/var/www/portfolio|${APP_DIR}|g" /usr/local/bin/portfolio-auto-update

  install -m 755 "${SCRIPT_DIR}/webhook-server.sh" /usr/local/bin/portfolio-webhook
  sed -i "s|/var/www/portfolio|${APP_DIR}|g" /usr/local/bin/portfolio-webhook

  cp "${SCRIPT_DIR}/portfolio-auto-update.service" /etc/systemd/system/portfolio-auto-update.service
  cp "${SCRIPT_DIR}/portfolio-auto-update.timer" /etc/systemd/system/portfolio-auto-update.timer
  cp "${SCRIPT_DIR}/portfolio-webhook.service" /etc/systemd/system/portfolio-webhook.service
  sed -i "s|/var/www/portfolio|${APP_DIR}|g" /etc/systemd/system/portfolio-*.service
  sed -i "s|User=portfolio|User=${APP_USER}|g" /etc/systemd/system/portfolio-*.service

  systemctl daemon-reload
  systemctl enable --now portfolio-auto-update.timer
  systemctl enable --now portfolio-webhook.service
fi

echo "==> Firewall"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 9000/tcp comment 'portfolio deploy webhook' || true
ufw --force enable || true

echo ""
echo "==> Bootstrap complete"
echo "    Site root: ${APP_DIR}/current"
echo "    Domain:    ${DOMAIN}"
echo "    Next: deploy via CI, or run:"
echo "      sudo -u ${APP_USER} APP_DIR=${APP_DIR} bash ${SCRIPT_DIR}/auto-update.sh"
echo "    Webhook: POST http://${DOMAIN}:9000/hooks/deploy  (secret in ${SHARED_ENV})"
