# Pufferblow website

Marketing site and download portal for [Pufferblow](https://github.com/PufferBlow) — the self-hosted, open-source community platform. This is **not** the desktop client; it's a static React + Vite site that explains the project and links to the latest GitHub release binaries.

## Stack

- React 19
- Vite 7
- Tailwind CSS 4
- React Router (client-side, `react-router-dom`)
- TypeScript

The stack mirrors the desktop client in [`../client`](../client) so components, brand mark, and design tokens stay in sync.

## Routes

| Path        | Page                                                |
| ----------- | --------------------------------------------------- |
| `/`         | Marketing home — hero, how it works, features, preview |
| `/download` | Live GitHub releases for Windows, Linux, macOS      |
| `/terms`    | Terms & conditions                                  |
| `/privacy`  | Privacy policy                                      |

## Scripts

```bash
npm install
npm run dev        # http://localhost:5174
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
npm run typecheck
```

## Deploying

`npm run build` produces a fully static `dist/` directory — drop it behind any static host (Caddy, nginx, Cloudflare Pages, GitHub Pages, etc.). The download page calls the public GitHub Releases API directly from the browser, so there is no server component.

## Where downloads come from

The `/download` page hits `https://api.github.com/repos/PufferBlow/client/releases` and categorizes assets by extension (`.exe`, `.msi`, `.AppImage`, `.deb`, `.rpm`, `.dmg`, `.zip`). Add a new platform asset to a GitHub release and it appears here automatically — no site redeploy needed.
