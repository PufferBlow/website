<div align="center">

<img src="./public/pufferblow-logo.svg" width="120" alt="Pufferblow logo" />

# Pufferblow Website

**The marketing site, download portal, and documentation home for Pufferblow.**

[![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-blue?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub Stars](https://img.shields.io/github/stars/PufferBlow/website?style=flat-square&color=yellow)](https://github.com/PufferBlow/website/stargazers)

</div>

---

## Overview

This repository is the public face of Pufferblow. It serves three things from one static React + Vite bundle:

- **Marketing site** — what Pufferblow is and why you might want to run it
- **Download portal** — live links to the latest desktop client release from the GitHub API
- **Documentation** — the full operator, user, and developer docs, hosted in-repo (no separate GitHub Pages site, no mkdocs deploy step)

The whole thing builds to a static `dist/` directory and can be dropped behind any static host.

---

## Project Layout

Pufferblow is made up of five repositories that work together:

| Repository | Language | Role |
|---|---|---|
| **[pufferblow](https://github.com/PufferBlow/pufferblow)** | Python / FastAPI | Control plane — REST API, auth, storage, federation |
| **[client](https://github.com/PufferBlow/client)** | TypeScript / React / Electron | Desktop and web client |
| **[media-sfu](https://github.com/PufferBlow/media-sfu)** | Go / Pion WebRTC | Media plane — WebRTC voice forwarding |
| **[pypufferblow](https://github.com/PufferBlow/pypufferblow)** | Python | Official SDK and bot framework |
| **website** (this repo) | TypeScript / React / Vite | Marketing site, download portal, and docs |

---

## Routes

| Path | Page |
|---|---|
| `/` | Marketing home — hero, how it works, features, dashboard preview |
| `/download` | Live GitHub releases for Windows, Linux, and macOS |
| `/docs` | Documentation home |
| `/docs/user/*` | User docs — joining a community, installing your own server |
| `/docs/operator/*` | Operator docs — Docker, backups, federation, operations, release notes |
| `/docs/developer/*` | Developer docs — architecture, roles, API reference, client, Python SDK |
| `/terms` | Terms & conditions |
| `/privacy` | Privacy policy |

---

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 19 + React Router v7 (client-side, `react-router-dom`) |
| Styling | Tailwind CSS v4 |
| Build | Vite 7 |
| Markdown rendering | react-markdown + remark-gfm + rehype-slug + rehype-highlight |
| Language | TypeScript 5 |

No SSR, no Next.js, no Astro — the whole site is one static SPA bundle. `import.meta.glob('?raw', { eager: true })` bakes every documentation markdown file into the bundle at build time, so the docs route works with no server-side component.

---

## Development Setup

### Prerequisites

- Node.js 20 or later
- npm 10 or later

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Opens at `http://localhost:5174` by default (the client uses `5173`, so the two can run side-by-side).

### Production build

```bash
npm run build
```

Produces a fully static `dist/`. Serve it with any static host — Caddy, nginx, Cloudflare Pages, GitHub Pages, S3, etc. There is no server component.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server on port 5174 |
| `npm run build` | Type-check, then build static output to `dist/` |
| `npm run preview` | Serve `dist/` locally on port 4173 |
| `npm run typecheck` | Run TypeScript without emitting |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run sync:docs` | Refresh `src/content/docs/` from `../pufferblow/docs/` |

---

## Project Structure

```
website/
├── public/
│   ├── pufferblow-logo.svg     Brand mark used in nav + favicon
│   └── icon.png                Higher-res icon
├── scripts/
│   └── sync-docs.mjs           Refresh the docs snapshot from pufferblow/
├── src/
│   ├── components/             Shared layout (SiteNav, SiteFooter, DocsSidebar, MarkdownDoc…)
│   ├── content/
│   │   └── docs/               Snapshot of pufferblow/docs/ — bundled at build time
│   ├── docs/
│   │   ├── manifest.ts         Sidebar nav + slug-to-file map
│   │   ├── loader.ts           import.meta.glob('?raw') wrapper
│   │   ├── preprocess.ts       MkDocs-Material → plain GFM
│   │   └── links.ts            Rewrites *.md hrefs to /docs routes
│   ├── hooks/                  Small browser-side hooks
│   ├── pages/                  One file per route (Home, Download, Docs, Terms, Privacy, NotFound)
│   ├── services/
│   │   └── githubReleases.ts   GitHub Releases API client used by /download
│   ├── app.css                 Theme tokens + docs prose + brand mark CSS
│   └── main.tsx                Router root
├── index.html
└── vite.config.ts
```

---

## How the Download Page Works

`/download` calls `https://api.github.com/repos/PufferBlow/client/releases` directly from the browser at page load. Assets are categorized by file extension (`.exe`, `.msi`, `.AppImage`, `.deb`, `.rpm`, `.dmg`, `.zip`) and the recommended build is picked based on the visitor's user-agent.

Add a new asset to a GitHub release on the client repo and it appears here automatically — no website redeploy needed.

---

## How the Docs Work

Documentation lives in two places:

1. **Source of truth** — `pufferblow/docs/` on the [pufferblow](https://github.com/PufferBlow/pufferblow) repo. This is where you edit content.
2. **Snapshot** — `website/src/content/docs/` here. Bundled into the SPA at build time.

To pull the latest content over:

```bash
npm run sync:docs
```

The script wipes `src/content/docs/` and re-copies every `.md` file from `../pufferblow/docs/`, so deletions propagate cleanly. If you add or remove pages, also update [`src/docs/manifest.ts`](src/docs/manifest.ts) so they show up in the sidebar.

A handful of MkDocs-Material extensions used in the source docs (admonitions, `:octicons-…:` button links, the `!!swagger` placeholder) are translated into plain GFM by [`src/docs/preprocess.ts`](src/docs/preprocess.ts) at render time. Cross-page `.md` links are rewritten to router paths by [`src/docs/links.ts`](src/docs/links.ts), so inter-page navigation just works.

---

## Deployment

`npm run build` produces a static `dist/` directory. There is no server component, no database, no API. Drop the directory behind any static host:

```bash
# example: serve dist/ on any host
npx serve dist
```

The only external service the site talks to at runtime is the public GitHub Releases API (from the browser) for the download list. If that's offline, the download page falls back to a "browse releases on GitHub" link.

---

## Contributing

Contributions are welcome. Please open an issue before starting work on a non-trivial change so we can discuss approach.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: describe the change"`
4. Open a pull request against `main`

---

## License

Released under the [GNU General Public License v3.0](LICENSE).
