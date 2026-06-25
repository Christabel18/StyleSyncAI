# StyleSync AI — Pitch Deck

---

## Slide 1 — Hook

> *"Your closet is full. Your confidence isn't."*

**StyleSync AI** is the AI stylist in your pocket — instant outfit analysis, personalized scoring, and a stylist who actually remembers you.

---

## Slide 2 — The Problem

- 💸 People spend **$1,800+/year** on clothes, yet 80% report regularly feeling "I have nothing to wear"
- 🤷 One-size-fits-all fashion apps give generic advice with no memory of your taste
- 📸 No tool connects your personal style history to real-time outfit feedback

**The gap:** Fashion AI exists — but it forgets you after every session.

---

## Slide 3 — The Solution

**StyleSync AI** — a personalized AI fashion stylist that:

1. Analyzes your outfit photo with computer vision
2. Scores it against your chosen style (0–100)
3. Delivers recommendations through a named AI persona
4. **Remembers your outfit history** to get smarter over time

---

## Slide 4 — Demo Flow

```
Select style → Upload outfit photo
      ↓
Azure AI Vision detects items + colors
      ↓
Score: Style Match (60%) + Color Harmony (40%)
      ↓
AI Stylist (Nova / Ava / Ivy) delivers personalized advice
      ↓
Outfit saved → Style Memory updated
```

**Full happy path completes in under 10 seconds.**

---

## Slide 5 — The Three AI Stylists

| Persona | Style | Personality |
|---------|-------|-------------|
| **Nova** | Streetwear | Bold, trend-forward, hype-aware |
| **Ava** | Minimalist | Clean, precise, less-is-more |
| **Ivy** | Old Money / Classic | Refined, understated, timeless |

Each persona has a distinct system prompt, tone, and response style powered by Azure OpenAI.

---

## Slide 6 — Style Memory (The Differentiator)

After just 3–5 outfits, StyleSync knows:
- Your **top colors** ("You often wear black — try amber accents")
- Your **go-to items** ("Your jeans are doing a lot of work")
- Your **style trend** (improving / consistent / exploring)

> *This turns a one-shot outfit rater into a stylist who actually knows you.*

---

## Slide 7 — Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, Zustand |
| Vision | Azure AI Vision (Computer Vision v3.2) |
| AI | Azure OpenAI (GPT-4o, 120 token responses) |
| Database | Supabase (Postgres + RLS) |
| Hosting | Vercel (serverless, edge-ready) |
| Auth | None — UUID in localStorage (MVP) |

**Built in 36 hours by a team of 4.**

---

## Slide 8 — What We Built vs. What's Next

### ✅ MVP (This Hackathon)
- Style onboarding (7 aesthetics)
- Outfit upload + Azure Vision analysis
- Rule-based scoring + AI persona response
- Style memory (Supabase)
- 5 pre-tested demo outfits as fallbacks

### 🔜 V2 Roadmap
- Real user auth (Supabase Auth)
- Shopping integrations (link recommendations to products)
- Outfit history timeline UI
- AR try-on (camera overlay)

---

## Slide 9 — Traction & Validation

- Tested on **5 real outfit scenarios** across all 3 personas
- Full offline fallback — demo never crashes
- Sub-10s end-to-end latency
- Hackathon-ready: works on mobile + desktop

---

## Slide 10 — The Ask

**What we want:**
- Feedback on the Style Memory concept — does it solve a real problem?
- Judges who love fashion tech, AI personalization, or UX

**What we're proud of:**
- A system that gets smarter with every upload
- An AI that has a personality, not just a score
- Built in a weekend — fully deployed on Vercel

> *StyleSync AI — the stylist that remembers.*
