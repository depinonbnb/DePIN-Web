# DePIN-Web

React/Vite frontend for the DePIN-on-BNB node operator platform. Operators connect their wallet, register a node, run the prover CLI, and earn points based on uptime and challenge response quality.

The companion backend lives at [../DePINonBNB/](../DePINonBNB/).

## Stack

- React 18 + TypeScript
- Vite 5 (dev server on port 3002)
- Tailwind CSS 3 + Radix UI primitives
- ethers.js 6 (BSC Testnet, chain ID 97)
- React Router 6
- Deployed on Vercel

## Quick start

```bash
npm install
npm run dev      # http://localhost:3002
npm run build    # production build to dist/
```

## Configuration

Configured at build time via Vite env vars (prefix `VITE_`). Defaults are wired in for local dev:

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api` | backend api base url (depinonbnb) |
| `VITE_STAKING_CONTRACT_ADDRESS` | `0x27bBD…3a86f` | depin staking contract |
| `VITE_POINTS_CONTRACT_ADDRESS` | `0x04F8…0e6e` | depin points contract |
| `VITE_NETWORK_ID` | `97` | bsc testnet |

backend listens on `:3000`. vite dev server runs on `:3002`. set `CORS_ALLOWED_ORIGINS=http://localhost:3002,http://127.0.0.1:3002` on the backend.

## Layout

```
src/
  pages/          route-level views (home, dashboard, register, earn, nodes, …)
  components/     feature components + ui/ radix primitives
  lib/
    wallet.tsx    metamask context, connect/disconnect, chain switching
    contracts.ts  ethers.js contract wrappers + bsc testnet config
    api.ts        backend fetch client with mock-data fallback
  contracts/      abis (depinstaking.json, depinpoints.json)
  styles/         globals.css (tailwind + theme variables)
docs/
  SPEC.md         architecture and contracts
  adr/            architecture decision records
tests/            placeholder — no runner wired yet
```

## Documentation

- [docs/SPEC.md](docs/SPEC.md) — architecture, data flow, API contract with the backend, known gaps
- [docs/adr/](docs/adr/) — architecture decision records

## Status

beta. core flows (wallet connect, node register, leaderboard, dashboard) work against bsc testnet. several areas are stubbed — see [docs/SPEC.md](docs/SPEC.md) "known gaps".
