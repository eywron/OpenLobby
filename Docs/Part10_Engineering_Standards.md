# OPENLOBBY MASTER AI SPECIFICATION

## Part 10 — Engineering Standards

Version: V2.0

### 1. MONOREPO STRUCTURE

The project is a `pnpm` workspace containing the `frontend` and `backend` packages.

### 2. CODE QUALITY

- **TypeScript**: Strict mode enabled everywhere.
- **Linting**: ESLint + Prettier.
- **Error Handling**: Use custom `AppError`. Never return stack traces.

### 3. COMMIT & BRANCH STRATEGY

Keep commits focused. Use descriptive messages.
