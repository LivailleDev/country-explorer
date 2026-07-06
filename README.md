# Atlas — Country Explorer

[![Live Demo](https://img.shields.io/badge/Live%20Demo-online-brightgreen)](https://livailledev.github.io/country-explorer/)
[![CI](https://github.com/LivailleDev/country-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/LivailleDev/country-explorer/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![React Router](https://img.shields.io/badge/React%20Router-6-CA4245)
![Vite](https://img.shields.io/badge/Vite-8-646CFF)

A **single-page app** to explore the world through an **interactive map where every
country is painted with its own flag**. Pan, zoom and click a country to open a detail
page with its capital, languages, currencies and clickable links to its neighbours — a
natural showcase for **client-side routing** and **data visualisation**.

**🔗 Live demo:** https://livailledev.github.io/country-explorer/

## What this project demonstrates

- **Interactive SVG data-viz** — a world map built with `d3-geo` + TopoJSON where each
  country's territory is clipped and filled with its flag, with smooth pan/zoom (`d3-zoom`).
- **Client-side routing with React Router** — the map (`/`), a dynamic detail route
  (`/country/:code`), a 404 route, and neighbour navigation that routes between countries.
- **TypeScript end to end** — typed domain models (`CountrySummary`, `CountryDetail`) and
  typed components.
- **Data fetching done cleanly** — an isolated API layer with loading / error states and a
  bundled offline fallback so the app always renders.
- **Pure, tested logic** — data normalisation and formatting kept framework-free and
  unit-tested separately from the UI.
- **Accessible, responsive UI** — a persisted light/dark theme, keyboard-focusable
  controls, and respect for `prefers-reduced-motion`.
- **Tested + CI** — Vitest + Testing Library, run on every push via GitHub Actions.

## Features

- **World map of flags** — each country filled with its flag; drag to pan, scroll to zoom
- Hover a country to highlight it; click to open its detail page
- Country detail page: native name, population, region, capital, currencies, languages
- **Border countries** rendered as links that navigate between detail pages
- Light / dark mode, remembered across visits
- Works offline / on slow networks via a bundled fallback catalog

## Tech

React 19 · TypeScript · React Router 6 · d3-geo · TopoJSON · Vite · Tailwind CSS · Vitest

## A note on the data

The catalog (250 countries) is served as a static JSON asset and fetched at runtime.
The long-standing free **REST Countries** API was deprecated, and its v5 now requires an
API key — which can't be embedded safely in a client-only SPA. So the dataset is built
from the public-domain [mledoze/countries](https://github.com/mledoze/countries) data,
with recent population figures merged in from the [World Bank API](https://data.worldbank.org)
and flags from [flagcdn](https://flagcdn.com). The map geometry is the
[world-atlas](https://github.com/topojson/world-atlas) TopoJSON, matched to countries by
ISO numeric code. The API layer (`src/api/countries.ts`) is isolated, so swapping in a
hosted backend later is a one-file change.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5176
```

## Tests

```bash
npm test          # run the suite once (Vitest)
npm run test:watch
```

Tests cover the data/API layer (normalisation, lookup and offline fallback) and the pure
filtering/formatting helpers.

## Build

```bash
npm run typecheck
npm run build
```
