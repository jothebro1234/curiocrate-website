# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing/donor website for CurioCrate, a STEM nonprofit (501(c)(3), est. 2023) that delivers free hands-on science kits to underserved communities. React SPA with heavy Framer Motion animation, deployed to Netlify (likely curiocrate.org).

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — serve the production build locally

No test suite exists in this repo.

## Architecture

**Stack:** React 19 + React Router 7 (`BrowserRouter`) + Vite 8 + Tailwind CSS 4 (via `@tailwindcss/vite`) + Framer Motion. Three.js/`@react-three/fiber` and `leaflet`/`react-leaflet` are present as deps for map/3D bits on specific pages.

**Routing** is centralized in `src/App.jsx`: every route is listed there alongside the persistent `CinematicNavbar`, `CinematicFooter`, and `ParticleField` (ambient background) that wrap all pages.

**Legacy vs. active components:** `src/components/` contains both the active set (`CinematicNavbar.jsx`, `CinematicFooter.jsx`, used site-wide) and older unused duplicates left over from a previous design pass (`Navbar.jsx`, `Footer.jsx`, `BoardMembers.jsx`, `Mission.jsx`, the component-level `Gallery.jsx`). None of the legacy ones are imported by `App.jsx` or any page — check `App.jsx` and the relevant page file before assuming a component is live.

**Content is data-driven in two different ways:**
- Simple lists (impact stats, gallery photos, alumni, news, map pin locations) live in `src/data/*.js` and are imported directly by the components that render them.
- Team/board content (`src/pages/Team.jsx`) is hardcoded as arrays (`cabinet`, `directors`, `productOfficers`, `departmentHeads`) at the top of the file, each entry driving a shared `PanelStage` component (hover-to-expand card row). Per-member styling fields (`color`, `glow`, `dark`, `photoHeight`/`photoExpandedHeight`, optional `photoOffsetY`) control a card's theme color and how its cutout photo is sized/positioned — these needed hand-tuning to keep photos level across a row when photo source files have inconsistent framing/aspect ratios, so don't assume a uniform value works for a newly added photo.
- **Our Chapters** (`src/pages/OurChapters.jsx`) is the exception: it live-fetches from a Google Sheet via an Apps Script web app (`VITE_APPS_SCRIPT_URL` in `.env`; the GAS source is in `apps-script/Code.gs`). `src/data/chapters.js` is intentionally an empty array — it's a fallback shape, not real data, and isn't meant to be hand-edited.

**Asset serving gotcha:** Several asset folders exist twice — once at the repo root (`boardmembers/`, `logos/`, loose image/video files) holding source originals, and once under `public/` (`public/boardmembers/`, `public/images/`, `public/logos/`, etc.) which is what Vite actually serves. Dropping a new file only at the repo root will 404 on the live site — it must also be copied into the matching `public/` subfolder.

**Deploy/caching (Netlify):** `public/_headers` sets `index.html` to `no-cache` and `/assets/*` to a long immutable cache — this matters because Vite content-hashes JS/CSS filenames on every build, so a stale cached `index.html` referencing a filename from a previous deploy causes a "Failed to load module script... MIME type text/html" error in the browser (the old hashed asset no longer exists, so the host's SPA fallback/404 page is served instead as `text/html`). `public/_redirects` has the SPA fallback (`/* -> /index.html`) but explicitly carves out `/assets/*` first so missing assets 404 instead of being served the HTML shell. If this error resurfaces, it's almost always a stale browser/CDN cache, not a code bug — a hard refresh plus a fresh deploy resolves it.

**CSS:** `src/index.css` starts with the Google Fonts `@import` followed by `@import "tailwindcss"`. Per the CSS spec, `@import` rules must precede all other rules — reordering these (e.g. putting other CSS before the font import) has previously broken every custom font site-wide, silently.
