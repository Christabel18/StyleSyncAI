# StyleSync AI — Demo Script (5 Outfits)

> **For the live demo.** These 5 outfits are pre-tested end-to-end through `/api/analyze` → `/api/recommend`. Each has a paired Vision fixture (`fixtures/vision/`) and a paired Recommendation fixture (`fixtures/`) so we can fall back gracefully if Azure is slow or down.

---

## Order of demos (3-minute flow)

| # | Outfit | Style | Assistant | Expected Score | Why we show it |
|---|---|---|---|---|---|
| 1 | Streetwear Casual | streetwear | Nova | 80–100 | Opener — clean happy path, mid-high score |
| 2 | Edgy Night Out | edgy | Ava | 90–100 | The "wow" outfit — near-perfect score, showcases color harmony |
| 3 | Romantic Garden Party | romantic | Nova | 75–100 | Variety — different aesthetic, floral pattern detection |
| 4 | Classic Blazer Look | classic | Ivy | 85–100 | Shows accessory detection (watch + belt) |
| 5 | Mismatched Bohemian Attempt | bohemian | Ava | 30–55 | The differentiator — system catches user/outfit mismatch |

---

## Per-outfit talking points

### 1. Streetwear Casual (opener — ~30s)
- **What you'll see:** Black hoodie, joggers, white sneakers, red cap, backpack.
- **Vision detects:** 5 items across 3 categories (clothing, footwear, accessory).
- **Noise filtered:** `person`, `outdoor`, `standing`, `young` all dropped.
- **Color story:** Black + white balanced palette, red accent from the cap.
- **Score:** ~85. Nova (streetwear stylist) gives an encouraging "this fit goes" message.

### 2. Edgy Night Out (showstopper — ~30s)
- **What you'll see:** Black leather jacket, black jeans, combat boots, silver chains.
- **Vision detects:** Leather jacket + boots + black jeans + chains; classifies `leather` as `other` (material tag).
- **Color story:** ~90% black with a red accent.
- **Score:** 90+. Ava (bold/edgy stylist) confirms the look.

### 3. Romantic Garden Party (variety — ~30s)
- **What you'll see:** Pink floral dress, cream heels, pearl necklace.
- **Vision detects:** Dress + heels + pearl necklace + `floral pattern` (preserved as `other`).
- **Color story:** Pink + white pastel palette, gold accent.
- **Score:** 80+. Nova goes warm and enthusiastic.

### 4. Classic Blazer Look (accessory showcase — ~25s)
- **What you'll see:** Navy blazer, beige chinos, brown loafers, watch, belt.
- **Vision detects:** 5 items including 2 accessories.
- **Noise filtered:** `professional` tag is at 0.68 → dropped by the confidence ≥ 0.7 filter (live proof of filtering).
- **Score:** 85–95. Ivy (classic stylist) gives a polished read.

### 5. Mismatched Bohemian Attempt (the differentiator — ~45s)
- **What you'll see:** Pink tank top, gray leggings, white running shoes — but the user selected "bohemian" during onboarding.
- **Vision detects:** Sporty items only (no boho silhouettes).
- **Score:** 30–55. Low because the outfit doesn't match the chosen vibe.
- **Why this matters:** StyleSync isn't a flattery machine — it gives honest, style-aware feedback. Ava pushes the user to commit to a direction.

---

## Demo safety net

### If Azure Vision is slow or down
- The `/api/analyze` route catches the error and returns `FALLBACK_RESPONSE` with HTTP 200.
- The response includes header `X-StyleSync-Fallback: <reason>` (e.g., `timeout`, `config_missing`, `no_clothing`).
- Use `fixtures/vision/*.json` to seed the UI directly if needed — each `response` field is a drop-in `AnalyzeResponse`.

### If Azure OpenAI is slow or down
- P3's `/api/recommend` already has a rule-based fallback path (see `src/lib/scoring.ts` and `src/lib/prompts.ts`).
- Pre-written assistant messages are returned per persona.

### Hard offline mode (no network at venue)
1. Load the page.
2. Open DevTools → Network → throttle to "Offline".
3. Stub `/api/analyze` and `/api/recommend` responses by loading the relevant fixture pairs:
   - `fixtures/vision/<outfit>.json` → use `.response` for `/api/analyze`
   - `fixtures/<outfit>.json` → P3 will compute against this `.request` deterministically

---

## Pre-demo checklist (do 30 min before)

- [ ] `npm run verify:fixtures` → all 5 pass
- [ ] `npm run build` → no errors
- [ ] Hit `/api/analyze` with each demo image once (warms the Azure cache, surfaces any key issues)
- [ ] Confirm `AZURE_VISION_ENDPOINT` and `AZURE_VISION_KEY` set in Vercel prod env
- [ ] Run all 5 demos on a phone browser (judges will look over your shoulder on mobile)
- [ ] Open the 5 raw fixture files in a second tab as the offline fallback
