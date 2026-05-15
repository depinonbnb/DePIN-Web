# 2. React + Vite + Tailwind stack

Date: 2026-05-07 (retroactive — captures choices already in `package.json`)

## Status

Accepted

## Context

The frontend needs to:
- Render a small set of operator-facing pages (~8 routes)
- Talk to BSC Testnet via injected wallet (MetaMask) and to a Go backend over REST
- Ship as a static bundle to Vercel

Trade-offs we considered:
- **Next.js**: SSR/SSG would help SEO, but the app is wallet-gated and behind a connect button — there's nothing useful to render server-side. Adds build complexity.
- **CRA**: Slow dev server, deprecated tooling.
- **Vite + React**: Fast HMR, minimal config, ships as static assets which Vercel handles natively.

For styling, we needed a system that pairs well with Radix UI primitives (which are unstyled) without inventing a bespoke design system.

## Decision

- **Build tool**: Vite 5 (dev server on port 3002, static build to `dist/`)
- **Framework**: React 18 + React Router 6
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3 + CSS variables for theming + Radix UI primitives wrapped in `src/components/ui/`
- **State**: React Context + `useState` (no Redux/Zustand) — the app's shared state is small (wallet + theme)
- **Forms**: react-hook-form
- **Charts**: Recharts
- **Icons**: lucide-react
- **Toasts**: sonner

## Consequences

- Fast iteration loop, simple deployment.
- Static bundle means no per-request server work. Wallet/auth state is fully client-side.
- No SSR — the initial HTML is empty until JS hydrates. Acceptable because all interesting content requires a connected wallet.
- Radix gives accessibility for free but the design system is hand-rolled in `src/components/ui/`. Visual consistency depends on discipline, not framework guarantees.
- React Context is sufficient today but may need replacing if we add cross-page caching of backend data (consider TanStack Query at that point).
