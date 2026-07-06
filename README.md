# Atlas — Country Explorer

[![Live Demo](https://img.shields.io/badge/Live%20Demo-online-brightgreen)](https://livailledev.github.io/country-explorer/)
[![CI](https://github.com/LivailleDev/country-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/LivailleDev/country-explorer/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![React Router](https://img.shields.io/badge/React%20Router-6-CA4245)
![Vite](https://img.shields.io/badge/Vite-8-646CFF)

A **single-page app** to explore every country in the world: search by name, filter
by region, and open a detail page with the flag, capital, languages, currencies and
clickable links to neighbouring countries — a natural showcase for **client-side
routing**.

**🔗 Live demo:** https://livailledev.github.io/country-explorer/

## What this project demonstrates

- **Client-side routing with React Router** — a country grid (`/`), a dynamic detail
  route (`/country/:code`), a 404 route, and neighbour navigation that routes between
  detail pages.
- **TypeScript end to end** — typed domain models (`CountrySummary`, `CountryDetail`),
  typed components and a generic `useDebounce<T>` hook.
- **Data fetching done cleanly** — an isolated API layer with loading / empty / error
  states, plus a bundled offline fallback so the app always renders.
- **Pure, tested logic** — filtering (name + region) and formatting kept framework-free
  and unit-tested separately from the UI.
- **Accessible, responsive UI** — labelled controls, keyboard-focusable cards, a
  light/dark theme (persisted), and a grid that adapts from phone to desktop.
- **Tested + CI** — Vitest + Testing Library, run on every push via GitHub Actions.

## Features

- Search countries by name (debounced) and filter by region
- Country detail page: native name, population, region, capital, currencies, languages
- **Border countries** rendered as links that navigate between detail pages
- Light / dark mode, remembered across visits
- Works offline / on slow networks via a bundled fallback catalog

## Tech

React 19 · TypeScript · React Router 6 · Vite · Tailwind CSS · Vitest

## A note on the data

The catalog (250 countries) is served as a static JSON asset and fetched at runtime.
The long-standing free **REST Countries** API was deprecated, and its v5 now requires an
API key — which can't be embedded safely in a client-only SPA. So the dataset is built
from the public-domain [mledoze/countries](https://github.com/mledoze/countries) data,
with recent population figures merged in from the [World Bank API](https://data.worldbank.org)
and flags from [flagcdn](https://flagcdn.com). The API layer (`src/api/countries.ts`) is
isolated, so swapping in a hosted backend later is a one-file change.

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

Tests cover the `useDebounce` hook (fake timers), the filtering/formatting logic, the
API layer (success + offline fallback) and the `CountryCard` component.

## Build

```bash
npm run typecheck
npm run build
```
