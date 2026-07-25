# Aref Fallah — Portfolio

Personal portfolio site built with **React**, **Vite**, **Tailwind CSS**, and **i18next** (EN / FA / AR / UR / ES / RU / ZH / TR).

Live: [iamrf.github.io](https://iamrf.github.io)

---

## Stack

- React 18 + Vite 5
- Tailwind CSS + Framer Motion
- i18next (8 languages, RTL-aware)
- Vitest + Testing Library

## Quick start

```bash
npm ci
npm run dev        # http://localhost:5173
npm test           # unit + component tests
npm run build      # production → dist/
npm run preview    # preview dist locally
npm run ci         # test + build (same as GitHub/GitLab CI)
```

Node.js **20.x** required.

## Project layout

```
src/
  components/     # UI sections
  data/           # projects, skills, experience
  locales/        # translations
  test/           # Vitest setup
.github/workflows/
  ci.yml                 # test + build on push/PR
  deploy.yml             # GitHub Pages
  deploy-vercel.yml      # Vercel production
  preview-vercel.yml     # Vercel PR previews
  deploy-ubuntu.yml      # Ubuntu SSH deploy (auto on push)
.gitlab-ci.yml           # GitLab: test → build → Pages / Vercel / Ubuntu
deploy/ubuntu/           # nginx bootstrap, auto-update, webhook
vercel.json
```

## CI/CD overview

| Target | Trigger | What happens |
|--------|---------|--------------|
| **CI** | Push / PR | `npm test` → `npm run build` |
| **GitHub Pages** | Push to `master`/`main` | Build + deploy Pages |
| **Vercel** | Push to `master`/`main` (+ PR previews) | Prebuilt deploy via Vercel CLI |
| **GitLab Pages** | Default branch | Publish `dist/` as Pages |
| **Ubuntu** | Push (GitHub/GitLab) or webhook/timer | Static release → nginx |

Full setup: see **[DEPLOY.md](./DEPLOY.md)**.

## Portfolio data

Projects live in `src/data/projects.js`. Each entry supports:

- `title` / `description` (`en`, `fa`)
- `tags`, `gradient`
- optional `live`, `github`, `telegram` URLs

## License

See [LICENSE](./LICENSE).
