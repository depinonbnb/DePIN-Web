# tests/

Placeholder for the DePIN-Web test suite. No test runner is wired up yet.

## Suggested setup

When tests are added, the recommended runner for this Vite + React stack is **Vitest** + **@testing-library/react**:

```bash
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Then add to `package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run"
}
```

## Conventions

- Component tests: co-locate next to the component as `Component.test.tsx`, OR put under `tests/components/`
- Integration tests (page-level, wallet flow, API client): put under `tests/integration/`
- Mock the wallet (`window.ethereum`) and the backend `fetch` client, not ethers internals

This is a recommendation, not a constraint — pick whichever convention fits the team. The placement is chosen when the suite is actually started.

## Why this dir is empty

The CLAUDE.md project layout rule requires every project to have a `tests/` directory. This is the placeholder. Delete this README once real tests are added.
