# Architecture Decision Records

Records of architecturally significant decisions made on this project.

Format: [Michael Nygard's template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions). One file per decision, numbered sequentially: `NNNN-kebab-title.md`.

Each ADR has:
- **Status** — proposed / accepted / superseded by NNNN
- **Context** — what's the situation that forces a decision
- **Decision** — what we chose
- **Consequences** — what follows from this, both good and bad

ADRs are append-only. To revisit, write a new ADR that supersedes the old one rather than editing history.

## Index

- [0001](0001-record-architecture-decisions.md) — Record architecture decisions
- [0002](0002-react-vite-tailwind-stack.md) — React + Vite + Tailwind stack
- [0003](0003-bsc-testnet-only.md) — Target BSC Testnet only for the current iteration
- [0004](0004-mock-data-fallback.md) — Mock-data fallback in the API client
