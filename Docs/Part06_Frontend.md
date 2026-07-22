# OPENLOBBY MASTER AI SPECIFICATION

## Part 6 — Frontend Architecture

Version: V2.0

### 1. FRONTEND STACK

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form + Zod

### 2. API CLIENT

The `api.ts` file is a thin wrapper around `fetch`.
It automatically retrieves the current Firebase ID token using `auth.currentUser.getIdToken()` and injects it into the `Authorization: Bearer` header.

### 3. AUTHENTICATION PROVIDER

The `auth-provider.tsx` wraps the app and provides the current user state.
It uses Firebase's `onAuthStateChanged` to listen for logins/logouts.
Upon login, it syncs the Firebase user with the PostgreSQL backend via `/api/v1/auth/sync`.

### 4. DATA FETCHING

Use TanStack Query for all server state.

### 5. COMPONENTS

Keep components modular. Place reusable primitives in `components/ui` and feature-specific components in `features/`.

### 6. ROUTING

- `(auth)` route group for login, register, forgot-password.
- `(main)` route group for authenticated features.
