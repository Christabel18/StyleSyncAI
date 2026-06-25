# Dependencies Log — StyleSync AI (Frontend / P1)

This file tracks every package we install so issues are easy to debug.
**When you install something new, add a row here** (name, version, why, date).

## Environment
| Tool | Version | Notes |
|------|---------|-------|
| Node.js | v24.16.0 | Runtime |
| npm | 11.13.0 | Use `npm.cmd` on this machine (PowerShell execution policy blocks the `npm` PS1 wrapper) |
| Next.js | 16.2.9 | App Router, scaffolded via `create-next-app` |
| React | 19.2.4 | |
| TailwindCSS | v4 | Config-less; uses `@import "tailwindcss"` + `@theme` in `globals.css` (no `tailwind.config.js`) |

## Runtime dependencies
| Package | Version | Purpose | Added |
|---------|---------|---------|-------|
| next | 16.2.9 | React framework (App Router, API routes) | 2026-06-24 |
| react | 19.2.4 | UI library | 2026-06-24 |
| react-dom | 19.2.4 | React DOM renderer | 2026-06-24 |
| framer-motion | ^12.41.0 | Animations + swipeable inspiration cards (onboarding) | 2026-06-24 |
| lucide-react | ^1.21.0 | Icon set | 2026-06-24 |
| clsx | ^2.1.1 | Conditional className helper | 2026-06-24 |
| tailwind-merge | ^3.6.0 | Merge/dedupe Tailwind classes (used by `cn()` util) | 2026-06-24 |
| @supabase/supabase-js | ^2.108.2 | Supabase client (style memory / outfits; wired by P4) | 2026-06-24 |

## Dev dependencies
| Package | Version | Purpose | Added |
|---------|---------|---------|-------|
| typescript | ^5 | Type checking | 2026-06-24 |
| @types/node | ^20 | Node type defs | 2026-06-24 |
| @types/react | ^19 | React type defs | 2026-06-24 |
| @types/react-dom | ^19 | React DOM type defs | 2026-06-24 |
| tailwindcss | ^4 | Utility-first CSS | 2026-06-24 |
| @tailwindcss/postcss | ^4 | Tailwind v4 PostCSS plugin | 2026-06-24 |
| eslint | ^9 | Linting | 2026-06-24 |
| eslint-config-next | 16.2.9 | Next.js ESLint rules | 2026-06-24 |

## Install commands used
```bash
# Scaffold (run once)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Frontend libraries
npm install framer-motion lucide-react clsx tailwind-merge @supabase/supabase-js
```

## Known notes / gotchas
- **npm on this Windows machine:** call `npm.cmd` (not `npm`) — the PowerShell script wrapper is blocked by execution policy.
- **Tailwind v4:** there is no `tailwind.config.js`. Theme tokens live in `src/app/globals.css` under `@theme`. Add custom colors/fonts there.
- **Mock mode:** the frontend runs fully without a backend. Controlled by `NEXT_PUBLIC_MOCK_MODE` (default `true`). This is also the demo fallback per the hackathon plan.
- 2 moderate `npm audit` warnings exist from transitive deps in the scaffold; left as-is (do not `npm audit fix --force` — it forces breaking upgrades).
