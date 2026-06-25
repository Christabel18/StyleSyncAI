# Cross-team changes — StyleVibe expansion (P1 → P2 / P3 / P4)

**Date:** 2026-06-25  
**Author:** P1 (Frontend)  
**Status:** Frontend implemented, backend sync needed before going live

---

## What changed

`StyleVibe` was expanded from 8 styles to **10 gender-neutral styles** in `src/types/index.ts`.

### Old values (removed)
- `"romantic"` — removed (skewed feminine)
- `"clean-girl"` — removed (not in `types/index.ts` but was in old `styleConfig.ts`)

### New values (added)
- `"business"` — Power dressing, suiting
- `"avant-garde"` — Experimental, high-fashion
- `"casual-cool"` — Effortless everyday

### Retained (unchanged names)
`streetwear`, `minimalist`, `classic`, `edgy`, `sporty`, `preppy`, `bohemian`

---

## Required changes by team member

### P3 — `/api/recommend` + `scoring.ts`

**File:** `src/lib/scoring.ts`  
**Change:** Add `STYLE_ITEMS` entries for the 3 new styles:

```ts
business: ["suit", "blazer", "shirt", "trousers", "heels", "oxfords", "tie", "briefcase", "structured", "formal"],
"avant-garde": ["oversized", "asymmetric", "experimental", "layered", "unconventional", "sculptural", "statement"],
"casual-cool": ["jeans", "tee", "sneakers", "denim", "jacket", "hoodie", "relaxed", "everyday", "simple"],
```

Also remove `romantic` from `STYLE_ITEMS`.

**File:** `src/app/api/recommend/route.ts`  
**Change:** The `userStyle` field in `RecommendRequest` now accepts the new values.  
Confirm the route handles `"business"`, `"avant-garde"`, `"casual-cool"` without errors.

---

### P2 — `/api/analyze`

**File:** `src/app/api/analyze/route.ts`  
**Change:** The `userStyle` passed in the request body will now include the 3 new values.  
The Azure Vision call itself doesn't use `userStyle`, but confirm the route doesn't
validate or restrict it. No breaking change expected — just awareness.

Also remove any references to `"romantic"` from fixtures or prompt templates.

---

### P4 — Supabase schema

**File:** `scripts/supabase-schema.sql`  
**Change:** The `users` and `style_memory` tables use `style_vibe` text column.  
If you added a `CHECK` constraint or enum for style_vibe values, update it:

```sql
-- If you have a check constraint like:
-- CHECK (style_vibe IN ('minimalist','streetwear','classic','bohemian','sporty','preppy','edgy','romantic'))
-- Update it to:
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_style_vibe_check;
ALTER TABLE users ADD CONSTRAINT users_style_vibe_check
  CHECK (style_vibe IN (
    'streetwear','minimalist','classic','edgy','sporty',
    'preppy','bohemian','business','avant-garde','casual-cool'
  ));

-- Same for style_memory table if it has a matching constraint
```

**Note:** `casual-cool` and `avant-garde` contain hyphens — they work fine as
PostgreSQL text values but confirm they're handled cleanly in your queries.

---

## Mock mode safety

The frontend is fully functional with `NEXT_PUBLIC_MOCK_MODE=true` while these backend
changes are being made. The new styles all have fixture data in `src/lib/mockSession.ts`.

Once all three teams have synced, flip `NEXT_PUBLIC_MOCK_MODE=false` to go live.
