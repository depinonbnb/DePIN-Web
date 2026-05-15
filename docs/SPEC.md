# DePIN-Web — Specification

Status: **draft / generated from existing codebase 2026-05-07**. Confirm and refine.

## 1. Purpose

DePIN-Web is the operator-facing frontend for the DePIN-on-BNB platform. It lets a wallet holder:

1. Connect MetaMask and switch to BSC Testnet (chain 97)
2. Register a node on-chain via the staking contract and obtain an API auth token from the backend
3. Run the prover CLI (downloaded separately) to prove ownership of their BNB Chain node
4. View their nodes, points, bandwidth/uptime history, and the global leaderboard

It is a thin client. All authoritative state lives in two places: the BSC Testnet contracts and the DePINonBNB backend API.

## 2. Scope

### In scope
- Wallet connect, account management, chain switching
- On-chain node registration (calls `DePINStaking.registerNode`)
- Calling the backend `/api/nodes/register` to obtain an auth token after on-chain registration
- Browsing nodes, leaderboard, network stats
- Submitting bandwidth reports
- Educational content (HowItWorks, Requirements)

### Out of scope
- The prover daemon (separate Go binary in [../DePINonBNB/cmd/prover/](../../DePINonBNB/cmd/prover/main.go))
- Challenge generation/verification (lives in the backend)
- Any persistent server state — the frontend is stateless beyond ephemeral React state and `window.ethereum`

## 3. Architecture

```
   ┌─────────────┐        ┌──────────────────┐        ┌───────────────────┐
   │   Browser   │  HTTP  │  DePINonBNB API  │  RPC   │   BSC Testnet     │
   │ (this app)  │ ─────▶ │  (Go / Gin)      │ ─────▶ │   nodes & RPC     │
   └─────┬───────┘        └──────────────────┘        └───────────────────┘
         │ window.ethereum
         ▼
   ┌─────────────┐
   │  MetaMask   │ ──── direct contract calls (ethers.js) ────▶ BSC Testnet
   └─────────────┘
```

Two parallel paths reach the chain:

- **Read/write of points and stake** — direct contract calls via ethers.js (`src/lib/contracts.ts`)
- **Off-chain metadata, challenge results, leaderboard** — the DePINonBNB REST API (`src/lib/api.ts`)

The frontend never holds private keys. Signing happens in MetaMask. For backend authentication, the user signs a message (EIP-191) with `signer.signMessage(...)`; the backend verifies and issues an API auth token tied to the wallet.

## 4. Module map

| Path | Responsibility |
|---|---|
| `src/main.tsx`, `src/App.tsx` | Entry, router, top-level providers |
| `src/lib/wallet.tsx` | `WalletProvider`, `useWallet()`, MetaMask events, chain switch |
| `src/lib/contracts.ts` | Contract instances, ABIs, BSC Testnet config, RPC helpers |
| `src/lib/api.ts` | `fetch`-based client for the DePINonBNB backend; mock-data fallbacks |
| `src/contracts/*.json` | Compiled ABIs (DePINStaking, DePINPoints) |
| `src/pages/*` | Route components (Home, Dashboard, Register, Earn, Nodes, LeaderboardPage, HowItWorks, Requirements) |
| `src/components/*` | Feature components (NodeRegistration, BandwidthReport, Leaderboard, …) |
| `src/components/ui/*` | Radix-based design system primitives |
| `src/styles/globals.css` | Tailwind directives, CSS variables, dark-mode tokens |

## 5. External contracts

### 5.1 Backend API (DePINonBNB)

Base URL: `VITE_API_URL` (default `http://localhost:3001/api`). Endpoints consumed:

| Method | Path | Used by |
|---|---|---|
| GET | `/stats/network` | NetworkStats |
| GET | `/stats/leaderboard` | Leaderboard |
| GET | `/nodes/:address` | NodeInfo, Dashboard |
| GET | `/bandwidth/reputation/:address` | Dashboard |
| GET | `/bandwidth/history/:address` | BandwidthChart |
| POST | `/nodes/register` | Register flow |
| POST | `/bandwidth/report` | BandwidthReport |

> Note: the backend's actual base path is `/api` and its routes are documented in [../DePINonBNB/docs/SPEC.md](../../DePINonBNB/docs/SPEC.md). The endpoint set listed above is what the frontend currently calls; if the backend has diverged, treat the backend as authoritative and update `src/lib/api.ts`.

### 5.2 Contracts (BSC Testnet)

| Contract | Default address (testnet) | Used for |
|---|---|---|
| DePINStaking | `0x27bBD5698D8Db1335D7A026DEbA260305813a86f` | Node registration, stake |
| DePINPoints | `0x04F82418aAEF206e3733fA2eAFe4B8C5E0580e6e` | Point balances |

Override via `VITE_STAKING_CONTRACT_ADDRESS` / `VITE_POINTS_CONTRACT_ADDRESS`. RPC endpoint hardcoded to `https://data-seed-prebsc-1-s1.bnbchain.org:8545/`.

## 6. Key flows

### Connect wallet
`useWallet().connect()` requests accounts via `window.ethereum.request({method: 'eth_requestAccounts'})`, then ensures chain ID 97. On wrong chain, calls `wallet_switchEthereumChain`; if the chain isn't added, falls back to `wallet_addEthereumChain` with BSC Testnet params.

### Register node
1. User fills NodeRegistration form
2. `DePINStaking.registerNode(...)` is called via ethers.js — payable in tBNB
3. On confirmation, frontend POSTs to `/api/nodes/register` with the wallet address and a signed message
4. Backend returns an auth token; frontend displays it for the user to paste into the prover CLI

### Leaderboard / stats
Pulled from the backend on page mount. If the API call fails, `src/lib/api.ts` falls back to mock data so the UI doesn't break — but this hides backend outages. See gap #1.

## 7. Configuration

All config is build-time (Vite env). See [README.md](../README.md) for the full table. Production builds must override defaults — the testnet contract addresses are baked in for dev convenience only.

## 8. Known gaps

| # | Where | What's missing |
|---|---|---|
| 1 | `src/lib/api.ts:63,94` | API errors silently fall back to mock data. Need an error/loading UI distinguishable from real data |
| 2 | `src/components/BandwidthReport.tsx:28` | Bandwidth report signature is hardcoded `'0x'` — the backend should reject this once it enforces signatures |
| 3 | `src/pages/Earn.tsx:34` | Stats are mocked; should call the backend for the connected wallet's earnings |
| 4 | `src/pages/Nodes.tsx:69,135` | Node type is hardcoded `"BSC Full"`; should read from the contract or backend |
| 5 | `src/pages/Register.tsx:333-341` | Prover CLI download buttons are disabled / "Coming soon" — once the prover is published, wire these up |
| 6 | `src/lib/wallet.tsx:159` | `window.ethereum` typed as `any`. Replace with EIP-1193 typings |
| 7 | Mainnet | All contract addresses, chain ID, and RPC URL assume BSC Testnet only. Mainnet path doesn't exist yet |
| 8 | Tests | No test runner configured. See [tests/README.md](../tests/README.md) |
| 9 | `nul` file at project root | Stray Windows redirect output. Safe to delete |

## 9. Non-goals (current iteration)

- Multi-chain support (mainnet, ETH, polygon)
- Wallet providers other than MetaMask (WalletConnect, etc.)
- Server-side rendering / SEO
- i18n (Google Translate widget is embedded but disabled)

## 10. Open questions

- Should the frontend auth token be stored in `localStorage` or kept in memory only? (Currently the registration flow returns it to the user once.)
- How are mainnet contract addresses going to be configured — via env at build time, or fetched from a config endpoint?
- Should bandwidth reporting move to a signed payload before the backend enforces signatures (gap #2)?
