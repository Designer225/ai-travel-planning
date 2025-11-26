# Team Notes (Local Only)

This file is for teammates’ reference. It’s excluded from git by design (all .md are ignored except README.md).

## Project structure

```
app/
  itinerary-builder/page.tsx     # Itinerary Builder route
  map-explore/page.tsx           # Map Explore route (dynamic import)
  layout.tsx, globals.css        # App shell + theme tokens
components/
  itinerary/                     # Itinerary builder components
  map/                           # Map page components
  ui/                            # Reusable shadcn/ui primitives
  figma/                         # Figma-specific helpers
data/
  destinations.ts                # Sample destination data
lib/
  utils.ts                       # cn() and shared utilities
types/
  index.ts                       # Trip types (TripPlan, TripDay, DayActivity)
public/
  images/                        # Static assets
```

## Routes
- /itinerary-builder
- /map-explore

## Conventions
- Interactive components use `'use client'`.
- Imports use the `@/` alias (configured in tsconfig).
- DnD pieces use `react-dnd` + `HTML5Backend` (see ItineraryBuilder wrapper).
- UI primitives are in `components/ui` and expect Tailwind v4 tokens (globals.css).

## Performance tips
- Map page uses dynamic import (no SSR) to keep initial load small:
  - `app/map-explore/page.tsx` dynamically imports `components/map/MapExplore`.
- Keep only one dev server running to avoid lock/dup compiles.
- Optional local fallback to Webpack dev (if needed):
  - Windows PowerShell per-run: `$env:NEXT_DISABLE_TURBOPACK=1; npm run dev`

## Next.js root warning
If you see “Next.js inferred your workspace root” warnings, it’s due to multiple lockfiles on your machine outside the project. This does not affect teammates who clone only this project.
- Best practice: ensure only this repo’s `package-lock.json` is present inside the project.

## Pushing guidelines
- `.gitignore` excludes all `*.md` except `README.md`.
  - If you accidentally committed other `.md`, untrack with:
    ```bash
    git rm -r --cached -- *.md
    git rm -r --cached -- **/*.md
    git add README.md
    git commit -m "Ignore all markdown except README"
    ```
- Commit `package-lock.json` for reproducible installs.

## Getting started
- Install: `npm install` (or `npm ci`)
- Dev: `npm run dev`
- Visit: http://localhost:3000

## Notes
- Theme tokens in `app/globals.css` match Figma-generated components.
- If adding heavy libs (charts/maps), prefer `next/dynamic` with `{ ssr: false }`.
