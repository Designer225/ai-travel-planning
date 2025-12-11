# TripAI — AI Travel Planner

AI-assisted trip planning with Gemini, conversational refinements, inline itinerary editing, drag-and-drop builder, maps, and trip management.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API key

### Environment variables (`.env.local`)
```
DATABASE_URL="postgres://user:pass@host:5432/dbname"
SESSION_SECRET="replace_with_strong_secret"
GEMINI_API_KEY="your_gemini_key"
```

### Install & run
```bash
npm install
npm run dev
# visit http://localhost:3000
```

### Seeding demo data
```bash
npx prisma db seed
```

## Features
- AI chatbot (Gemini) generates and refines itineraries; rate-limit fallback and retries.
- Structured itineraries with cost estimates, AM/PM times, future-date defaults.
- Follow-up suggestions + quick actions to budget/relax/focus on food/add activities.
- TripPanel inline edit, save, discard, export JSON.
- My Trips with saved itineraries and gradient fallback images.
- Itinerary Builder with drag-and-drop activities and editable headers.
- Map Explorer page for destination browsing.
- Account and checkout pages for profile/payment flows.

## Navigation (key routes)
- `/chat` — TripAI chat + itinerary panel
- `/my-trips` — Saved trips
- `/itinerary-builder` — Drag-and-drop builder
- `/map-explore` — Map explorer
- `/account` — Profile & payments
- `/dashboard` — Hub (links to all)

## Screenshots
- Chat with itinerary: ![Chat + Itinerary](docs/chat-itinerary.png)
- My Trips grid: ![My Trips](docs/my-trips.png)
- Itinerary Builder: ![Itinerary Builder](docs/itinerary-builder.png)
- Map Explorer: ![Map Explorer](docs/explore.png)
- Dashboard: ![Dashboard](docs/dashboard.png)

## AI Tooling Disclosure
This app uses **Google Gemini** via `@google/generative-ai` to generate and refine travel itineraries and responses. API keys are kept server-side; prompts and outputs are processed on your infrastructure/API provider.

## Development Notes
- Framework: Next.js (App Router) + React 19 + TypeScript
- UI: Tailwind + shadcn/ui + MUI (select pages)
- State: React hooks; Prisma + PostgreSQL for data; iron-session for sessions
- Drag-and-drop: `react-dnd`

## Team & Contributions
Commit history reflects contributions from all teammates. 
