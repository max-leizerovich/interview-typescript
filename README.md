# TypeScript Interview Monorepo

Standard interview setup with:

- **Backend**: Node.js + Express + TypeScript (`backend/`)
- **Frontend**: React + Vite + TypeScript (`frontend/`)
- **Shared**: shared runtime types/schemas (`shared/`)
- **Tests**: Jest + coverage (backend + frontend)
- **CI**: GitHub Actions workflow running lint/typecheck/tests/build

## Prerequisites

- Node.js **20+**
- npm **9+** (workspaces)

## Setup

```bash
npm install
```

## Run locally

Starts backend on `http://localhost:3001` and frontend on `http://localhost:5173` (Vite proxies `/api` to the backend).

```bash
npm run dev
```

## Quality checks

```bash
npm run lint
npm run typecheck
```

## Tests + coverage

Run tests in all workspaces:

```bash
npm test
```

Coverage for all workspaces:

```bash
npm run test:coverage
```

## Build

```bash
npm run build
```

## Repo structure

- `package.json`: npm workspaces + shared scripts
- `backend/src/app.ts`: Express app (`/health`, `/api/items`)
- `backend/src/app.test.ts`: supertest integration tests
- `frontend/src/App.tsx`: UI for listing + creating items
- `frontend/src/App.test.tsx`: React Testing Library tests
- `shared/src/index.ts`: shared Zod schemas + TypeScript types

