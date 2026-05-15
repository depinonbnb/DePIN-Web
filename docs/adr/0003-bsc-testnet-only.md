# 3. Target BSC Testnet only for the current iteration

Date: 2026-05-07

## Status

Accepted (current iteration)

## Context

The DePIN protocol is pre-launch. Contract addresses, reward parameters, and challenge difficulty are still being tuned. Shipping a UI that supports both testnet and mainnet means doubling the surface area we have to test, and risks users sending real BNB to contracts that may yet be redeployed.

## Decision

Hardcode BSC Testnet (chain ID 97) as the only supported network for now:
- Default contract addresses in `src/lib/contracts.ts` point to testnet deployments
- `useWallet()` enforces chain ID 97 on connect, prompting the user to switch
- RPC URL hardcoded to `https://data-seed-prebsc-1-s1.bnbchain.org:8545/`
- Block explorer links go to `testnet.bscscan.com`

Env vars exist (`VITE_STAKING_CONTRACT_ADDRESS`, etc.) so the values are *overridable*, but no mainnet build target exists.

## Consequences

- Simpler UX while the protocol stabilizes — users can't accidentally interact with mainnet
- No production launch path yet. Adding mainnet support is a separate ADR (decisions to make: chain switcher UX, env-driven config vs. hosted config endpoint, fee handling)
- Anyone running a production deploy *must* override the env vars; otherwise testnet contract addresses leak into prod
