# 👗 StyleSync AI

AI-powered style analysis — upload outfit photos, get scored recommendations and personalized fashion advice from AI assistants.

## What It Does

Upload a photo of your outfit → AI Vision analyzes colors, clothing items, and style → Get a style score with personalized recommendations from AI fashion assistants (Nova, Ava, or Ivy).

## Quick Start

```bash
npm install
cp .env.example .env.local  # Add your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **Vision AI:** Azure AI Vision
- **Recommendations:** Azure OpenAI
- **Database:** Supabase
- **Deployment:** Vercel

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze` | POST | Upload image → Azure Vision tags + colors |
| `/api/recommend` | POST | Outfit tags → style score + AI recommendations |
| `/api/outfits` | GET/POST | Save and retrieve outfit history |
| `/api/memory` | GET/POST | User style memory + preferences |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/       # P2: Azure Vision integration
│   │   ├── recommend/     # P3: Style scoring + AI recs
│   │   ├── outfits/       # P4: Outfit CRUD
│   │   └── memory/        # P4: Style memory
│   ├── upload/            # P1: Image upload page
│   ├── results/           # P1: Score + recs display
│   ├── onboarding/        # P1: Style preference picker
│   ├── layout.tsx
│   └── page.tsx           # P1: Landing/hero page
├── components/            # P1: Shared UI components
├── lib/                   # Shared utilities
│   ├── supabase.ts        # P4: Supabase client
│   ├── scoring.ts         # P3: Style scoring algorithm
│   └── prompts.ts         # P3: Nova/Ava/Ivy system prompts
├── types/                 # Shared TypeScript types
│   └── index.ts
└── fixtures/              # P2: Demo outfit fixtures
```

## Team

- P1 (Frontend) — @
- P2 (Vision) — @
- P3 (Recs) — @Christabel18
- P4 (Backend + Pitch) — @
