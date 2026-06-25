# StyleSync AI

> Your personal stylist that understands your wardrobe, learns your preferences, and helps you build outfits with confidence.

**Team:** HackyGirls for the Win · **Hackathon MVP**

StyleSync AI is an AI-powered personal fashion assistant. You pick your aesthetic,
upload an outfit photo, and a dedicated stylist persona (Nova, Ava, or Ivy) breaks
the look down — detected items, colors, patterns, a style score — and gives you
personalized recommendations. Every look you analyze is remembered, so the advice
gets more personal over time.

This repository currently contains the **frontend (P1)**. The backend API routes,
Azure Vision/OpenAI integration, and Supabase persistence are owned by P2/P3/P4 and
plug into the same Next.js app.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | TailwindCSS v4 (config-less, tokens in `globals.css`) |
| Animation | Framer Motion |
| Icons | lucide-react |
| Data (planned) | Supabase (`@supabase/supabase-js`) |
| AI (planned) | Azure AI Vision + Azure OpenAI |

See [`DEPENDENCIES.md`](./DEPENDENCIES.md) for the full, tracked dependency list.

## Getting started

```bash
# 1. Install (use npm.cmd on Windows if the npm PS wrapper is blocked)
npm install

# 2. Set up env
cp .env.example .env.local   # then fill in values (mock mode works with defaults)

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Mock mode is on by default** (`NEXT_PUBLIC_MOCK_MODE=true`). The entire UI works
> with built-in, style-aware demo data — no backend required. This is also the
> instant "swap to fixtures" safety net for the live demo.

## Routes (the user journey)

| Route | Purpose |
|-------|---------|
| `/` | Landing — value prop, how it works, personas |
| `/onboarding` | Style discovery — pick a style or swipe inspiration cards |
| `/upload` | Outfit upload — drag & drop, with loading/error states |
| `/results` | Style report — detected items, score, stylist message, recommendations |
| `/history` | Style memory — past outfits, favorite colors, common pieces |

## Project structure

```
src/
  app/                 # routes (landing, onboarding, upload, results, history)
  components/          # UI: StyleSelector, InspirationCards, OutfitUploader,
                       #     AnalysisCard, ScoreRing, AssistantMessage, …
  lib/
    api.ts             # mock/real switch + maps P2/P3 responses → UI shapes
    mockApi.ts         # built-in demo data (the safety net)
    styleMemory.ts     # localStorage-backed style memory
    personas.ts        # Nova / Ava / Ivy
    styles.ts          # the 7 onboarding styles
    supabaseClient.ts  # Supabase client (safe no-op until P4 sets env)
  types/index.ts       # shared types incl. the agreed backend wire formats
```

## Backend integration (P2 / P3 / P4)

The frontend only ever talks to `src/lib/api.ts`. To go live, set
`NEXT_PUBLIC_MOCK_MODE=false` and implement:

- **`POST /api/analyze`** (P2) → returns `RawAnalyzeResponse` (see `src/types/index.ts`).
  The frontend maps it to `OutfitAnalysis`. The base schema agreed in Phase 1 is
  `{ status, analysis: { summary, insights, confidence, tags }, model, timestamp }`,
  with optional fashion fields (`items`, `colors`, `patterns`, `style_tags`, `score`).
- **`POST /api/recommend`** (P3) → returns `RawRecommendResponse`
  `{ recommendations: [{ id, title, reason, confidence, source }], fallback_used }`.
- **Supabase** (P4) → set `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  `styleMemory.ts` can then be swapped from localStorage to the `outfits` table.

## Known notes

- On this Windows machine, call `npm.cmd` (the `npm` PowerShell wrapper is blocked by execution policy).
- Tailwind v4 has no `tailwind.config.js`; theme tokens live under `@theme` in `src/app/globals.css`.
- Uploaded images are downscaled client-side before being stored in style memory.
