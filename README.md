# DePIN-Web

> React/Vite frontend for the **DePIN-on-BNB** node operator platform.
> Operators connect a wallet, register a node on BSC Testnet, run the prover CLI, and earn points based on uptime and challenge response quality.

**Stack:** React 18 · TypeScript · Vite 5 · Tailwind 3 · Radix UI · ethers.js 6 · React Router 6
**Network:** BNB Smart Chain mainnet (chain ID `56`)
**Token:** `DEPIN` · CA `0x426326e876ad01fd99db898604c16c0628da7777` · 18 decimals · [BscScan](https://bscscan.com/token/0x426326e876ad01fd99db898604c16c0628da7777) — operators must hold **1,000,000 DEPIN** to earn
**Backend:** [`../DePINonBNB/`](../DePINonBNB/) (Go / Gin, listens on `:3000`)
**Deploy target:** Vercel

---

## Table of contents

- [Features](#features)
- [Architecture](#architecture)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Routes](#routes)
- [Project layout](#project-layout)
- [Contracts](#contracts)
- [Backend endpoints consumed](#backend-endpoints-consumed)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [Status & known gaps](#status--known-gaps)

---

## Features

- MetaMask connect with automatic chain switching to BSC Testnet
- On-chain node registration via the `DePINStaking` contract (payable in tBNB)
- Backend handshake — Phase 3 EIP-191 signed message with anti-replay nonce + timestamp
- Operator dashboard: status, points, uptime
- Global leaderboard and live network stats
- Operator guide at `/how-it-works`: hardware specs, earnings projection, setup timeline, anti-cheat rules
- Dark/light theming via `next-themes` + Tailwind CSS variables
- Mock-data fallback in `lib/api.ts` so the UI degrades gracefully when the backend is down (see gap #1)

## Architecture

```
   ┌─────────────┐       HTTP        ┌──────────────────┐       RPC        ┌──────────────────┐
   │   Browser   │ ────────────────▶ │  DePINonBNB API  │ ───────────────▶ │   BSC Testnet    │
   │ (this app)  │                   │  (Go / Gin :3000)│                  │  data-seed RPC   │
   └──────┬──────┘                   └──────────────────┘                  └──────────────────┘
          │ window.ethereum
          ▼
   ┌─────────────┐  ethers.js direct contract calls (read points, register node)
   │  MetaMask   │ ──────────────────────────────────────────────────────────────▶ BSC Testnet
   └─────────────┘
```

Two paths reach the chain: direct ethers.js calls for stake/points, and the backend REST API for off-chain metadata, challenges, and leaderboard data.

The frontend never holds private keys — signing happens in MetaMask. Full data-flow detail in [`docs/SPEC.md`](docs/SPEC.md).

## Quick start

**Prerequisites:** Node 18+, MetaMask (or any EIP-1193 wallet), some BSC Testnet tBNB ([faucet](https://testnet.bnbchain.org/faucet-smart)).

```bash
npm install
npm run dev      # http://localhost:3002
npm run build    # production build to dist/
npm run preview  # serve the dist/ build locally
```

The backend should be running at `http://localhost:3000` for the full flow. With the backend offline, the UI still loads and uses mock data.

> **CORS:** the backend must allow this origin. Set
> `CORS_ALLOWED_ORIGINS=http://localhost:3002,http://127.0.0.1:3002` on [DePINonBNB](../DePINonBNB/).

## Configuration

All config is build-time via Vite env vars (prefix `VITE_`). Defaults are wired in for local dev — production builds **must** override addresses.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api` | DePINonBNB backend base URL |
| `VITE_STAKING_CONTRACT_ADDRESS` | [`0x27bBD5…3a86f`](https://testnet.bscscan.com/address/0x27bBD5698D8Db1335D7A026DEbA260305813a86f) | `DePINStaking` |
| `VITE_POINTS_CONTRACT_ADDRESS` | [`0x04F824…0e6e`](https://testnet.bscscan.com/address/0x04F82418aAEF206e3733fA2eAFe4B8C5E0580e6e) | `DePINPoints` |
| `VITE_NETWORK_ID` | `97` | BSC Testnet chain ID |

Create `.env.local` (gitignored) for overrides:

```bash
VITE_API_URL=https://api.example.com/api
VITE_STAKING_CONTRACT_ADDRESS=0x...
VITE_POINTS_CONTRACT_ADDRESS=0x...
VITE_NETWORK_ID=97
```

## Routes

Defined in [`src/App.tsx`](src/App.tsx).

| Path | Page | Purpose |
|---|---|---|
| `/` | [`Home`](src/pages/Home.tsx) | Landing — hero, network stats, leaderboard preview |
| `/dashboard` | [`Dashboard`](src/pages/Dashboard.tsx) | Per-wallet view: status, points, uptime |
| `/nodes` | [`Nodes`](src/pages/Nodes.tsx) | List of registered nodes for the connected wallet |
| `/register` | [`Register`](src/pages/Register.tsx) | Stake + register a node, obtain prover auth token |
| `/leaderboard` | [`LeaderboardPage`](src/pages/LeaderboardPage.tsx) | Global ranking by points |
| `/earn` | [`Earn`](src/pages/Earn.tsx) | Earnings + activity overview (currently stubbed) |
| `/requirements` | [`Requirements`](src/pages/Requirements.tsx) | Hardware/network prerequisites for operators |
| `/how-it-works` | [`HowItWorks`](src/pages/HowItWorks.tsx) | Protocol explainer |

## Project layout

```
src/
  App.tsx                router + providers
  main.tsx               entry
  pages/                 route-level views
  components/
    AppHeader.tsx        global header with wallet button
    Footer.tsx
    Hero.tsx · HeroSection.tsx
    Leaderboard.tsx
    NetworkStats.tsx
    NodeDashboard.tsx · NodeInfo.tsx
    NoticeBanner.tsx
    ui/                  radix-based design system primitives
  lib/
    wallet.tsx           MetaMask context, connect/disconnect, chain switching
    contracts.ts         ethers.js contract wrappers + BSC Testnet config
    api.ts               backend fetch client with mock-data fallback
  contracts/
    DePINStaking.json    ABI
    DePINPoints.json     ABI
  styles/
    globals.css          Tailwind directives + theme variables
docs/
  SPEC.md                architecture, data flow, API contract, known gaps
  adr/                   architecture decision records
public/                  static assets served as-is
tests/                   placeholder — no runner wired yet
```

## Contracts

Deployed on **BSC Testnet** (chain ID `97`). RPC: `https://data-seed-prebsc-1-s1.bnbchain.org:8545/`.

| Contract | Address | Explorer |
|---|---|---|
| `DePINStaking` | `0x27bBD5698D8Db1335D7A026DEbA260305813a86f` | [BscScan ↗](https://testnet.bscscan.com/address/0x27bBD5698D8Db1335D7A026DEbA260305813a86f) |
| `DePINPoints` | `0x04F82418aAEF206e3733fA2eAFe4B8C5E0580e6e` | [BscScan ↗](https://testnet.bscscan.com/address/0x04F82418aAEF206e3733fA2eAFe4B8C5E0580e6e) |

ABIs live in [`src/contracts/`](src/contracts/). Override addresses via env vars — see [Configuration](#configuration).

## Backend endpoints consumed

The frontend talks to [`DePINonBNB`](../DePINonBNB/) at `VITE_API_URL`. Treat the backend as authoritative — if its routes diverge, update [`src/lib/api.ts`](src/lib/api.ts).

| Method | Path | Caller |
|---|---|---|
| GET | `/stats` | `NetworkStats` |
| GET | `/leaderboard` | `Leaderboard` |
| GET | `/nodes/:nodeId` | `NodeInfo`, `Dashboard` |
| POST | `/nodes/register` | Register flow (Phase 3 nonce + timestamp + EIP-191 signed message) |

Full request/response shapes: [`docs/SPEC.md` §5.1](docs/SPEC.md).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server on `:3002` with HMR |
| `npm run build` | Type-check (`tsc`) then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over `.ts` / `.tsx` (warnings treated as errors) |

## Troubleshooting

- **"Wrong network" / chain switch loop** — MetaMask must be unlocked. If BSC Testnet isn't added, the app calls `wallet_addEthereumChain` automatically; approve the prompt.
- **API calls return mock data** — the backend at `VITE_API_URL` is unreachable or CORS is blocking. Check [DePINonBNB](../DePINonBNB/) is running on `:3000` and `CORS_ALLOWED_ORIGINS` includes `http://localhost:3002`.
- **`registerNode` reverts** — make sure the wallet has tBNB ([faucet](https://testnet.bnbchain.org/faucet-smart)) and is on chain `97`.
- **Build fails on `tsc`** — run `npm run lint` first; type errors surface there with better context.

## Documentation

- [`docs/SPEC.md`](docs/SPEC.md) — architecture, data flow, API contract, known gaps
- [`docs/adr/`](docs/adr/) — architecture decision records:
  - [ADR-0001 — Record architecture decisions](docs/adr/0001-record-architecture-decisions.md)
  - [ADR-0002 — React + Vite + Tailwind stack](docs/adr/0002-react-vite-tailwind-stack.md)
  - [ADR-0003 — BSC Testnet only](docs/adr/0003-bsc-testnet-only.md)
  - [ADR-0004 — Mock-data fallback](docs/adr/0004-mock-data-fallback.md)
- Backend spec: [`../DePINonBNB/docs/SPEC.md`](../DePINonBNB/docs/SPEC.md)

## Status & known gaps

**Beta.** Core flows (wallet connect, node registration, leaderboard, dashboard) work end-to-end against BSC Testnet. Several areas are stubbed — full list in [`docs/SPEC.md` §8](docs/SPEC.md). Highlights:

- API errors silently fall back to mock data (no error UI yet)
- Bandwidth report signatures hardcoded to `0x` — backend doesn't yet enforce
- `Earn` page stats are mocked
- Node type hardcoded `"BSC Full"` instead of read from contract
- Prover CLI download buttons disabled — pending prover release
- No test runner wired yet
- Mainnet path not implemented — testnet-only by design (see [ADR-0003](docs/adr/0003-bsc-testnet-only.md))
