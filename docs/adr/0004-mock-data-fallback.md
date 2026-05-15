# 4. Mock-data fallback in the API client

Date: 2026-05-07

## Status

Accepted (with caveat — see Consequences)

## Context

`src/lib/api.ts` calls the DePINonBNB backend for leaderboard, network stats, node info, etc. During development the backend may not be running (frontend on `:3002`, backend on `:3001`). A naive client would surface errors and break the UI.

## Decision

Catch fetch errors in the API client and return a small mock dataset instead, so the UI continues to render. See `src/lib/api.ts:63,94`.

## Consequences

- Frontend devs can iterate without running the Go backend
- **Risk**: backend outages in production look identical to "everything works with stale-but-plausible data"
- Mitigation needed before production: distinguish "API unavailable" state in the UI (banner / toast / placeholder), and only fall back to mocks when an explicit dev flag is set (e.g. `import.meta.env.DEV`)
- Tracked as gap #1 in [../SPEC.md](../SPEC.md)
