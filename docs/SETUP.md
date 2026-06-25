# StyleSync AI — Local Setup Guide

> **For teammates:** Pull the repo, feed this file to your AI agent, and it will set up everything for you.

## Prerequisites

- **Node.js** ≥ 18 (recommended: 20 LTS)
- **npm** ≥ 9
- **Git** with `core.autocrlf` set to `false` (avoids cross-platform line ending issues)

```bash
git config core.autocrlf false
```

---

## 1. Clone & Install

```bash
git clone https://github.com/Christabel18/StyleSyncAI.git
cd StyleSyncAI
npm install
```

This installs all dependencies including:
- `next@14` — App framework (App Router, API routes)
- `zustand` — Client state management
- `@supabase/supabase-js` — Database client
- `react-dropzone` — Image upload widget

---

## 2. Environment Variables

Copy the example and fill in your keys:

```bash
cp .env.example .env.local
```

### What each variable does

| Variable | Owner | Required for | How to get it |
|---|---|---|---|
| `AZURE_VISION_ENDPOINT` | P2 | `/api/analyze` (image tagging) | Azure portal → Cognitive Services → Vision resource → Keys & Endpoint |
| `AZURE_VISION_KEY` | P2 | `/api/analyze` | Same page, Key 1 or Key 2 |
| `AZURE_OPENAI_ENDPOINT` | P3 | `/api/recommend` (AI assistant) | Azure portal → Azure OpenAI → your resource → Keys & Endpoint |
| `AZURE_OPENAI_KEY` | P3 | `/api/recommend` | Same page, Key 1 or Key 2 |
| `AZURE_OPENAI_DEPLOYMENT` | P3 | `/api/recommend` | Name of your GPT-4o deployment (default: `gpt-4o`) |
| `NEXT_PUBLIC_SUPABASE_URL` | P4 | Database, auth, storage | Supabase dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | P4 | Database, auth, storage | Same page → `anon` `public` key |

> **No keys yet?** That's fine — the app still runs. P3's recommend engine falls back to rule-based scoring + pre-written assistant messages when Azure OpenAI is missing. P2's analyze endpoint returns placeholder data until wired up.

---

## 3. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the default Next.js page (P1 will replace this with the landing page).

### Other useful commands

```bash
npm run build    # Production build — run this before pushing to catch type errors
npm run lint     # ESLint check
npm run start    # Start production build locally
```

---

## 4. Project Structure (What Goes Where)

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      ← P2 owns (Azure Vision)
│   │   ├── recommend/route.ts    ← P3 owns (Scoring + OpenAI)
│   │   ├── outfits/route.ts      ← P4 owns (Supabase CRUD)
│   │   └── memory/route.ts       ← P4 owns (Style memory)
│   ├── upload/                   ← P1 owns (Upload page)
│   ├── results/                  ← P1 owns (Results page)
│   ├── onboarding/               ← P1 owns (Style picker)
│   ├── layout.tsx                ← P1 owns (Root layout)
│   └── page.tsx                  ← P1 owns (Landing page)
├── components/                   ← P1 owns (Shared UI components)
├── lib/
│   ├── scoring.ts                ← P3 owns (Score algorithm)
│   ├── prompts.ts                ← P3 owns (AI assistant prompts)
│   └── supabase.ts               ← P4 owns (DB client)
├── store/                        ← P1 owns (see "P1 Setup Tasks" below)
├── types/
│   └── index.ts                  ← SHARED — all types live here
└── fixtures/                     ← Demo/test data (anyone can add)
```

---

## P1 Setup Tasks (Frontend Lead — do these first)

These are things P1 should set up before building pages:

### 1. Initialize shadcn/ui

```bash
npx shadcn-ui@latest init
# Recommended: New York style, Slate color, CSS variables = yes
npx shadcn-ui@latest add button card input label skeleton
```

### 2. Create the Zustand store (`src/store/index.ts`)

Zustand is already installed. P1 needs to create the global store that passes data between pages. Suggested shape:

```typescript
import { create } from "zustand";
import type { StyleVibe, AssistantName, AnalyzeResponse, RecommendResponse } from "@/types";

interface StyleSyncStore {
  // Onboarding
  userStyle: StyleVibe | null;
  assistant: AssistantName | null;
  setOnboarding: (style: StyleVibe, assistant: AssistantName) => void;

  // Analysis (from P2)
  analysisResult: AnalyzeResponse | null;
  setAnalysisResult: (result: AnalyzeResponse) => void;

  // Recommendations (from P3)
  recommendResult: RecommendResponse | null;
  setRecommendResult: (result: RecommendResponse) => void;

  // Reset
  reset: () => void;
}
```

This store connects the data flow: **Onboarding → Upload → Results**. P1 owns the implementation — the types above are already defined in `src/types/index.ts`.

---

## 5. Git Workflow

1. **Always work on a branch** — never push directly to `main`
2. Branch naming: `p{number}/{short-description}` (e.g., `p2/azure-vision-integration`)
3. Open a PR using the template (auto-filled)
4. At least one teammate approves before merge
5. Run `npm run build` locally before pushing — the CI will catch type errors too

---

## 6. Tech Stack Quick Reference

| Tool | Version | What it does |
|---|---|---|
| Next.js | 14.2 | Full-stack React framework (App Router) |
| TypeScript | 5.x | Type safety everywhere |
| Tailwind CSS | 3.4 | Utility-first CSS |
| shadcn/ui | *(to install)* | Pre-built accessible components |
| Zustand | 5.x | Lightweight client state |
| Supabase | 2.x | Postgres DB + auth + storage |
| react-dropzone | 15.x | Drag-and-drop image uploads |

### Installing shadcn/ui (P1 should do this first)

```bash
npx shadcn-ui@latest init
# Choose: New York style, Slate color, CSS variables = yes
npx shadcn-ui@latest add button card input label
```

---

## 7. Testing API Routes Locally

Once the dev server is running, you can test the API routes with curl:

### Test `/api/recommend` (P3 — works now, no keys needed)

```bash
curl -X POST http://localhost:3000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "tags": [
      {"name": "blazer", "confidence": 0.92, "category": "clothing"},
      {"name": "jeans", "confidence": 0.88, "category": "clothing"},
      {"name": "sneakers", "confidence": 0.85, "category": "footwear"}
    ],
    "colors": [
      {"name": "navy", "hex": "#000080", "dominance": 0.4},
      {"name": "white", "hex": "#FFFFFF", "dominance": 0.35}
    ],
    "dominantColor": "navy",
    "userStyle": "classic",
    "assistant": "Nova"
  }'
```

### Test `/api/analyze` (P2 — returns placeholder until implemented)

```bash
curl -X POST http://localhost:3000/api/analyze
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `LF would be replaced by CRLF` | Run `git config core.autocrlf false` |
| Port 3000 already in use | `npm run dev -- -p 3001` |
| Types not resolving | Check `tsconfig.json` has `"@/*": ["./src/*"]` path alias |
| Build fails on lint | Run `npm run lint` to see specific errors, fix before pushing |
| Azure OpenAI not responding | The app still works — falls back to rule-based recs + pre-written messages |
