# StyleSync AI — Integration Contracts & Dependencies

> **Purpose:** This document defines exactly how each person's code connects to everyone else's. Read your section before coding. If you change a contract, **tell the affected person immediately** — this is the #1 hackathon coordination failure.

---

## The Core Data Flow

```
User uploads photo
       │
       ▼
  ┌──────────┐     AnalyzeResponse      ┌──────────────┐     RecommendResponse     ┌──────────┐
  │ P1 — UI  │ ──────────────────────▶  │ P2 — Vision  │ ──────────────────────▶   │ P3 — Recs│
  │ Frontend │ ◀───────────────────────  │ /api/analyze │ ◀───────────────────────  │/api/reco │
  └──────────┘                           └──────────────┘                           └──────────┘
       │                                                                                  │
       │   Save outfit + score                                                     Uses Azure
       ▼                                                                           OpenAI
  ┌──────────┐
  │ P4 — DB  │
  │ Supabase │
  └──────────┘
```

**In plain English:**
1. P1 sends the uploaded image to P2's `/api/analyze`
2. P2 returns tagged clothing items + colors
3. P1 forwards that analysis (plus user style + chosen assistant) to P3's `/api/recommend`
4. P3 returns a score, recommendations, and an AI assistant message
5. P1 displays the results and sends them to P4 to save in Supabase

---

## Contract 1: P2 → P3 (The Critical Handoff)

> **⚠️ This is the most important contract.** If these types change without both sides updating, the app breaks.

### What P2 produces (`AnalyzeResponse`)

```typescript
// Defined in: src/types/index.ts

interface AnalyzeResponse {
  tags: OutfitTag[];        // clothing/accessory/footwear items detected
  colors: OutfitColor[];    // colors detected with dominance %
  dominantColor: string;    // most prominent color name
  rawTags: string[];        // all Azure tags (for debugging only)
}

interface OutfitTag {
  name: string;             // e.g., "blazer", "jeans", "sneakers"
  confidence: number;       // 0-1, only include tags >= 0.7
  category: "clothing" | "accessory" | "footwear" | "other";
}

interface OutfitColor {
  name: string;             // e.g., "navy", "white" — use lowercase
  hex: string;              // e.g., "#000080"
  dominance: number;        // 0-1, how dominant this color is
}
```

### What P3 expects (`RecommendRequest`)

```typescript
interface RecommendRequest {
  tags: OutfitTag[];        // ← directly from P2's AnalyzeResponse
  colors: OutfitColor[];    // ← directly from P2's AnalyzeResponse
  dominantColor: string;    // ← directly from P2's AnalyzeResponse
  userStyle: StyleVibe;     // ← from P1's onboarding (user's chosen style)
  assistant: AssistantName; // ← from P1's onboarding ("Nova" | "Ava" | "Ivy")
}
```

### Rules both sides must follow

| Rule | Why |
|---|---|
| Tag names must be **lowercase** | P3's scoring engine does case-insensitive matching but normalizes to lowercase |
| Only include tags with confidence **≥ 0.7** | Lower confidence tags create noise in scoring |
| Color names must be **simple English** (e.g., "navy" not "DarkNavyBlue") | P3 matches against a predefined list of color pairs |
| `dominance` values should **sum to ~1.0** | Used to weight color harmony calculations |
| `category` must be one of: `clothing`, `accessory`, `footwear`, `other` | P3 filters by category for different recommendation types |

### How to test this integration

P3 has a working placeholder in P2's `/api/analyze` route that returns fixture data. P2 should aim to match this format exactly when implementing the real Azure Vision integration.

---

## Contract 2: P3 → P1 (Results Display)

### What P3 produces (`RecommendResponse`)

```typescript
interface RecommendResponse {
  score: StyleScore;
  recommendations: Recommendation[];
  assistantMessage: AssistantMessage;
}

interface StyleScore {
  overall: number;          // 0-100 (this is the big number P1 displays)
  styleMatch: number;       // 0-100 (60% weight in overall)
  colorHarmony: number;     // 0-100 (40% weight in overall)
  breakdown: {
    label: string;          // "Style Match" or "Color Harmony"
    score: number;
    explanation: string;    // Human-readable, 1-2 sentences
  }[];
}

interface Recommendation {
  type: "swap" | "add" | "remove" | "keep";
  item: string;             // the item name
  reason: string;           // why this recommendation
  priority: "high" | "medium" | "low";
}

interface AssistantMessage {
  assistant: AssistantName; // "Nova" | "Ava" | "Ivy"
  message: string;          // The AI-generated (or fallback) text
  tone: string;             // "encouraging" | "bold" | "analytical"
}
```

### P1 display notes

- **`score.overall`** → Show as a big circular score (0-100)
- **`score.breakdown`** → Show as two sub-bars or cards (Style Match + Color Harmony)
- **`recommendations`** → Render as a list of cards, color-coded by `type` (swap=yellow, add=green, remove=red, keep=blue)
- **`assistantMessage`** → Show in a chat bubble with the assistant's name and personality. The `tone` field can be used to style the bubble differently per assistant
- There will always be at least 1 recommendation and 1 assistant message — even if Azure OpenAI is down (fallbacks are built in)

---

## Contract 3: P1 → P4 (Saving Outfits)

### What P4 should expect from P1

```typescript
// When user saves an outfit after viewing results
interface OutfitSaveRequest {
  user_id: string;                  // from localStorage (no auth for MVP)
  image_url?: string;               // optional Supabase Storage URL
  tags: OutfitTag[];                // from P2's analysis
  colors: OutfitColor[];            // from P2's analysis
  score: number;                    // overall score from P3
  recommendations: Recommendation[];// from P3
  assistant_message: string;        // the message text from P3
}
```

### Supabase tables P4 needs

```sql
-- Users (no auth, just a style profile)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  style_vibe TEXT NOT NULL,
  assistant TEXT NOT NULL DEFAULT 'Nova',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Outfits (saved analysis results)
CREATE TABLE outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  image_url TEXT,
  tags JSONB NOT NULL,
  colors JSONB NOT NULL,
  score INTEGER NOT NULL,
  recommendations JSONB NOT NULL,
  assistant_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Style memory (aggregated from all outfits)
CREATE TABLE style_memory (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  total_outfits INTEGER DEFAULT 0,
  avg_score NUMERIC(5,2) DEFAULT 0,
  top_colors TEXT[] DEFAULT '{}',
  top_items TEXT[] DEFAULT '{}',
  style_trend TEXT DEFAULT 'exploring',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (use anon key, no auth)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_memory ENABLE ROW LEVEL SECURITY;

-- Allow all operations for MVP (no auth)
CREATE POLICY "Allow all" ON users FOR ALL USING (true);
CREATE POLICY "Allow all" ON outfits FOR ALL USING (true);
CREATE POLICY "Allow all" ON style_memory FOR ALL USING (true);
```

---

## Contract 4: P1 → P2 (Image Upload)

### What P2's `/api/analyze` expects

```
POST /api/analyze
Content-Type: multipart/form-data

Body: FormData with field "image" containing the uploaded file
```

P1 should use `react-dropzone` to capture the file, then:

```typescript
const formData = new FormData();
formData.append("image", file);

const res = await fetch("/api/analyze", {
  method: "POST",
  body: formData,
});
const data: AnalyzeResponse = await res.json();
```

---

## Dependency Map

```
P1 (Frontend) depends on:
├── P2 — AnalyzeResponse shape (to send to P3)
├── P3 — RecommendResponse shape (to display results)
└── P4 — Supabase client + outfit save API

P2 (Vision) depends on:
├── Shared types in src/types/index.ts
└── Azure Vision API key (in .env.local)

P3 (Recs) depends on:
├── P2 — AnalyzeResponse as input (tags + colors)
├── Azure OpenAI key (optional — has fallback)
└── Shared types in src/types/index.ts

P4 (Backend) depends on:
├── Supabase project (must be created first)
├── P3 — RecommendResponse shape (to know what to store)
└── Shared types in src/types/index.ts
```

---

## ⚠️ Rules for Changing Contracts

1. **All shared types live in `src/types/index.ts`** — do NOT define types locally
2. If you need to add a field, **add it as optional** (`field?: type`) so existing code doesn't break
3. If you need to change a field type or remove a field, **tell the affected person in chat first**
4. After any type change, run `npm run build` to catch breakages across the whole project
5. When in doubt, **don't change the contract** — work around it or discuss with the team

---

## Quick Reference: Who Talks to Whom

| From | To | Through | Data |
|---|---|---|---|
| P1 | P2 | `POST /api/analyze` | Image file (FormData) |
| P2 | P1 | Response | `AnalyzeResponse` (tags, colors) |
| P1 | P3 | `POST /api/recommend` | `RecommendRequest` (tags + colors + userStyle + assistant) |
| P3 | P1 | Response | `RecommendResponse` (score + recs + message) |
| P1 | P4 | `POST /api/outfits` | Outfit data to save |
| P1 | P4 | `GET /api/outfits` | Fetch outfit history |
| P1 | P4 | `GET /api/memory` | Fetch style memory |
| P4 | P1 | Response | Saved outfit records / memory object |
