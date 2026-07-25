# Portfolio — Deployment Guide

Deploy this Vite/React static portfolio to **Vercel**, **GitHub Pages**, **GitLab Pages**, and an **Ubuntu** server with **auto-update on push**.

---

## Table of contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Local quality gate](#3-local-quality-gate)
4. [GitHub Actions](#4-github-actions)
5. [Vercel](#5-vercel)
6. [GitLab CI/CD](#6-gitlab-cicd)
7. [Ubuntu server](#7-ubuntu-server)
8. [Auto-update on push](#8-auto-update-on-push)
9. [Secrets checklist](#9-secrets-checklist)
10. [Rollback](#10-rollback)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Overview

| Target | How it deploys | When |
|--------|----------------|------|
| **CI** | Test → build | Every push / PR |
| **GitHub Pages** | Upload `dist/` via `actions/deploy-pages` | Push to `master`/`main` |
| **Vercel production** | Vercel CLI `--prebuilt` | Push to `master`/`main` + manual dispatch |
| **Vercel preview** | Vercel CLI; comments URL on PR | Pull requests |
| **GitLab Pages** | Job `pages` publishes `public/` | Default branch |
| **Ubuntu (CI)** | Build artifact → SCP → `remote-activate.sh` | Push to default branch |
| **Ubuntu (auto)** | Git pull + build on server (timer + webhook) | Continuous / on webhook |

Project files:

```
.github/workflows/
  ci.yml
  deploy.yml                 # GitHub Pages
  deploy-vercel.yml
  preview-vercel.yml
  deploy-ubuntu.yml
.gitlab-ci.yml
vercel.json
deploy/ubuntu/
  bootstrap.sh               # one-time server setup
  build-release.sh           # local tarball
  manual-deploy.sh           # deploy from laptop
  remote-activate.sh         # CI activate on server
  auto-update.sh             # git pull → test → build → publish
  webhook-server.sh          # POST /hooks/deploy
  nginx.portfolio.conf
  portfolio-auto-update.service
  portfolio-auto-update.timer
  portfolio-webhook.service
```

---

## 2. Prerequisites

- Node.js **20.x**
- GitHub and/or GitLab repository with CI enabled
- For Vercel: [Vercel](https://vercel.com) account + project linked to this repo
- For Ubuntu: VPS (22.04/24.04), SSH access, DNS A record

---

## 3. Local quality gate

```bash
npm ci
npm test
npm run build
# or
npm run ci
```

Tests cover portfolio data integrity, locale key parity, and core React components (24 tests).

---

## 4. GitHub Actions

### Enable Pages

1. Repo → **Settings → Pages**
2. Source: **GitHub Actions**
3. Push to `master`/`main` — workflow `Deploy to GitHub Pages` builds, tests, and publishes `dist/`

### Repository secrets (Vercel + Ubuntu)

| Secret | Used by |
|--------|---------|
| `VERCEL_TOKEN` | Vercel deploy / preview |
| `VERCEL_ORG_ID` | Vercel |
| `VERCEL_PROJECT_ID` | Vercel |
| `UBUNTU_HOST` | Ubuntu deploy |
| `UBUNTU_USER` | Ubuntu deploy |
| `UBUNTU_SSH_PORT` | Optional (default `22`) |
| `UBUNTU_APP_DIR` | Optional (default `/var/www/portfolio`) |
| `UBUNTU_SSH_PRIVATE_KEY` | Deploy key (ed25519) |
| `UBUNTU_SSH_KNOWN_HOSTS` | Optional; otherwise `ssh-keyscan` |
| `UBUNTU_HEALTH_URL` | Optional health check URL |

Create a GitHub Environment named `ubuntu-production` (and optionally `production` for Vercel) if you want approval gates.

### Manual runs

- **Actions → Deploy Vercel → Run workflow** (production / preview)
- **Actions → Deploy Ubuntu → Run workflow**

---

## 5. Vercel

### Option A — Git integration (simplest)

1. Import the GitHub/GitLab repo in Vercel
2. Framework preset: **Vite** (see `vercel.json`)
3. Output: `dist`
4. Every push to the production branch deploys automatically

### Option B — GitHub Actions CLI (this repo)

1. Create a Vercel project; copy **Org ID** and **Project ID** from `.vercel/project.json` after `vercel link`
2. Create a token at https://vercel.com/account/tokens
3. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` as GitHub secrets
4. Push to `master`/`main` → `deploy-vercel.yml` runs test + prebuilt production deploy
5. PRs get preview URLs via `preview-vercel.yml`

SPA routing is handled by the rewrite in `vercel.json`.

---

## 6. GitLab CI/CD

File: `.gitlab-ci.yml`

| Job | Stage | Notes |
|-----|-------|-------|
| `test` | test | `npm test` |
| `build` | build | Produces `dist/` artifact |
| `pages` | deploy | GitLab Pages from `public/` |
| `deploy_vercel` | deploy | Needs `VERCEL_*` CI variables |
| `deploy_ubuntu` | deploy | Needs `UBUNTU_*` CI variables |

### GitLab CI/CD variables

Settings → CI/CD → Variables (mask secrets):

- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `UBUNTU_HOST`, `UBUNTU_USER`, `UBUNTU_SSH_PRIVATE_KEY`
- Optional: `UBUNTU_SSH_PORT`, `UBUNTU_APP_DIR`, `UBUNTU_SSH_KNOWN_HOSTS`, `UBUNTU_HEALTH_URL`

Enable **GitLab Pages** under Settings → Pages after the first successful `pages` job.

---

## 7. Ubuntu server

### One-time bootstrap

```bash
# On the server (as root)
git clone https://github.com/iamrf/iamrf.github.io.git /tmp/portfolio-src
cd /tmp/portfolio-src
sudo DOMAIN=your.domain.com \
     REPO_URL=https://github.com/iamrf/iamrf.github.io.git \
     BRANCH=master \
     bash deploy/ubuntu/bootstrap.sh
```

This installs nginx, Node 20, app user, release directories, git clone for auto-update, systemd timer, and webhook on port **9000**.

Point DNS A record of `your.domain.com` at the VPS. For TLS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your.domain.com
```

Allow the deploy user passwordless nginx reload (optional):

```bash
echo 'portfolio ALL=(root) NOPASSWD: /usr/sbin/nginx, /bin/systemctl reload nginx' \
  | sudo tee /etc/sudoers.d/portfolio-nginx
```

### Deploy modes

**A. CI artifact (recommended)** — GitHub `deploy-ubuntu.yml` or GitLab `deploy_ubuntu` builds in CI, SCPs tarball, runs `remote-activate.sh`.

**B. Manual from laptop**

```bash
export UBUNTU_HOST=1.2.3.4
export UBUNTU_USER=ubuntu
./deploy/ubuntu/manual-deploy.sh
```

**C. On-server auto-update** — see next section.

Site files are served from `/var/www/portfolio/current` (symlink to a release under `releases/`).

---

## 8. Auto-update on push

Three complementary mechanisms:

### 1) CI push deploy (GitHub / GitLab)

Push to `master`/`main` → workflow builds → SCP → `remote-activate.sh`. No git pull on the server required.

### 2) Systemd timer (poll)

`portfolio-auto-update.timer` runs every ~2 minutes:

1. `git fetch` in `/var/www/portfolio/repo`
2. If `origin/master` moved → `npm ci` → `npm test` → `npm run build`
3. Atomic publish to `current`

```bash
sudo systemctl status portfolio-auto-update.timer
sudo journalctl -u portfolio-auto-update.service -f
```

Ensure the server can `git fetch` (public repo, or deploy key / token in the clone remote URL).

### 3) Deploy webhook (instant)

`portfolio-webhook.service` listens on `:9000`.

```bash
# Secret is in /var/www/portfolio/shared/deploy.env → WEBHOOK_SECRET
curl -X POST "http://your.domain.com:9000/hooks/deploy" \
  -H "X-Deploy-Secret: YOUR_SECRET"
```

Wire a GitHub/GitLab **webhook** (push events) to that URL and set the same secret in the `X-Deploy-Secret` header via a small relay, or call it from a CI job:

```yaml
# example extra step after push
- run: |
    curl -fsS -X POST "${{ secrets.UBUNTU_WEBHOOK_URL }}" \
      -H "X-Deploy-Secret: ${{ secrets.UBUNTU_WEBHOOK_SECRET }}"
```

Health: `GET /hooks/health` → `healthy`.

---

## 9. Secrets checklist

### GitHub

- [ ] Pages source = GitHub Actions  
- [ ] `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID`  
- [ ] `UBUNTU_HOST` / `UBUNTU_USER` / `UBUNTU_SSH_PRIVATE_KEY`  
- [ ] Optional health + webhook secrets  

### GitLab

- [ ] Same `VERCEL_*` and `UBUNTU_*` CI variables  
- [ ] Runner available for default branch  

### Ubuntu

- [ ] Bootstrap completed  
- [ ] DNS + optional Certbot  
- [ ] `deploy.env` present; webhook secret rotated if needed  
- [ ] Timer + webhook services enabled  

---

## 10. Rollback

Releases are kept under `/var/www/portfolio/releases/` (last 8).

```bash
ls -1dt /var/www/portfolio/releases/*
sudo ln -sfn /var/www/portfolio/releases/TIMESTAMP-SHA /var/www/portfolio/current
# optional
sudo systemctl reload nginx
```

On Vercel / Pages: redeploy a previous deployment from the dashboard or git revert + push.

---

## 11. Troubleshooting

| Symptom | Fix |
|---------|-----|
| CI fails on `npm test` | Run `npm test` locally; check Vitest output |
| GitHub Pages 404 | Confirm Pages source is Actions; check `deploy.yml` artifact path `dist` |
| Vercel build fails | Verify secrets; run `vercel link` + `vercel pull` locally |
| Ubuntu SCP fails | Check SSH key, `known_hosts`, firewall, `UBUNTU_USER` sudo/file perms on `/tmp` and `APP_DIR` |
| Auto-update never pulls | Check remote URL credentials; `sudo -u portfolio git -C /var/www/portfolio/repo fetch` |
| Webhook 401 | Compare `X-Deploy-Secret` with `WEBHOOK_SECRET` in `deploy.env` |
| Blank site after deploy | Ensure `index.html` exists in release; `ls -la /var/www/portfolio/current` |

---

## Quick reference commands

```bash
# Local
npm run ci

# Server bootstrap
sudo DOMAIN=example.com bash deploy/ubuntu/bootstrap.sh

# Force on-server update
sudo -u portfolio APP_DIR=/var/www/portfolio /usr/local/bin/portfolio-auto-update

# Manual remote deploy
UBUNTU_HOST=x.x.x.x UBUNTU_USER=ubuntu ./deploy/ubuntu/manual-deploy.sh
```
