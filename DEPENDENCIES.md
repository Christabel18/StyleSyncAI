# Dependencies Log — StyleSync AI (Frontend / P1)

This file tracks every package we install so issues are easy to debug.
**When you install something new, add a row here** (name, version, why, date).

---

## Environment
| Tool | Version | Notes |
|------|---------|-------|
| Node.js | v24.16.0 | Runtime |
| npm | 11.13.0 | Use `npm.cmd` on Windows (PS1 wrapper blocked by execution policy) |
| Next.js | 14.2.35 | App Router — aligned with team's repo |
| React | ^18 | |
| TailwindCSS | v3.4.1 | Config via `tailwind.config.ts` |

## Runtime dependencies
| Package | Version | Purpose | Added |
|---------|---------|---------|-------|
| next | 14.2.35 | React framework (App Router, API routes) | 2026-06-24 |
| react | ^18 | UI library | 2026-06-24 |
| react-dom | ^18 | React DOM renderer | 2026-06-24 |
| zustand | ^5.0.14 | Client-side state (style choice, current session, history) | 2026-06-24 |
| react-dropzone | ^15.0.0 | Drag & drop outfit uploader | 2026-06-24 |
| lucide-react | ^0.344.0 | Icon set | 2026-06-24 |
| @supabase/supabase-js | ^2.108.2 | Supabase client (style memory; wired by P4) | 2026-06-24 |

## Dev dependencies
| Package | Version | Purpose | Added |
|---------|---------|---------|-------|
| typescript | ^5 | Type checking | 2026-06-24 |
| @types/node | ^20 | Node type defs | 2026-06-24 |
| @types/react | ^18 | React type defs | 2026-06-24 |
| @types/react-dom | ^18 | React DOM type defs | 2026-06-24 |
| tailwindcss | ^3.4.1 | Utility-first CSS | 2026-06-24 |
| postcss | ^8 | PostCSS processor | 2026-06-24 |
| autoprefixer | latest | Required by Tailwind v3 PostCSS pipeline | 2026-06-24 |
| eslint | ^8 | Linting | 2026-06-24 |
| eslint-config-next | 14.2.35 | Next.js ESLint rules | 2026-06-24 |

## Install commands
```bash
# From repo root
npm install

# If autoprefixer is missing (Tailwind v3 needs it)
npm install autoprefixer
```

## Key files (P1 owns)
| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Fashion color palette (cream, clay, ink, nova, ava, ivy…) |
| `src/app/globals.css` | Tailwind directives + CSS variables |
| `src/app/layout.tsx` | Root layout + Header |
| `src/app/page.tsx` | Landing page |
| `src/app/onboarding/page.tsx` | Style discovery |
| `src/app/upload/page.tsx` | Outfit upload + analysis trigger |
| `src/app/results/page.tsx` | Style report (score, stylist, recommendations) |
| `src/app/history/page.tsx` | Style memory |
| `src/components/` | All UI components |
| `src/store/useAppStore.ts` | Zustand store (persisted) |
| `src/lib/styleConfig.ts` | Style + persona metadata |
| `src/lib/mockSession.ts` | Demo safety-net data (uses scoring.ts + prompts.ts) |
| `src/lib/api.ts` | Mock/real API switch (NEXT_PUBLIC_MOCK_MODE) |

## Files P1 does NOT touch
| File | Owner |
|------|-------|
| `src/lib/scoring.ts` | P3 |
| `src/lib/prompts.ts` | P2 |
| `src/lib/supabase.ts` | P4 |
| `src/types/index.ts` | Agreed schema (all) |
| `src/app/api/` | P2 / P3 / P4 |
| `fixtures/` | P2 (demo data) |

## Known notes / gotchas
- **npm on Windows:** use `npm.cmd` (not `npm`) — PS1 wrapper blocked by execution policy.
- **Tailwind v3:** theme tokens added to `tailwind.config.ts` → `theme.extend.colors`. No `@theme` block.
- **Mock mode:** controlled by `NEXT_PUBLIC_MOCK_MODE=true` (default). The entire UI is demoable with no backend. Set to `false` once `/api/analyze` + `/api/recommend` are live. This is the hackathon demo safety-net switch.
- **Zustand persist:** store hydrates from localStorage after mount. Pages guard with `const [mounted, setMounted] = useState(false)` + `useEffect(() => setMounted(true), [])` to prevent SSR/client mismatch.
- **postcss.config.mjs** must use `tailwindcss: {}` (v3) not `"@tailwindcss/postcss": {}` (v4).
