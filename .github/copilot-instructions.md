# OPENLOBBY MASTER COPILOT & AI AGENT INSTRUCTIONS

Welcome to **OpenLobby** — a minimalist, community-focused social platform built with a Next.js frontend and an Express backend.

These instructions govern all AI agent and Copilot contributions to this workspace.

---

## 1. PROJECT ARCHITECTURE & CORE PHILOSOPHY

- **Design System:** E-Ink-inspired, strictly monochrome UI (`bg-background`, `text-foreground`, `bg-secondary`, `border-border`). No vibrant accent colors except muted red for errors/destructive actions.
- **Backend Architecture:** Strict 4-layer structure (Routes -> Controllers -> Services -> Repositories). No database calls inside controllers or routes.
- **Frontend Architecture:** Next.js App Router with Server Components by default, Client Components (`'use client'`) for interactive widgets. State managed via `TanStack Query` and `AuthContext`.
- **API Envelope:** All API responses use standard JSON format:
  ```json
  { "success": true, "data": {}, "message": "..." }
  ```
  or error:
  ```json
  { "success": false, "error": { "code": "...", "message": "..." } }
  ```

---

## 2. REPOSITORY LAYOUT

- `frontend/` — Next.js 15 App Router application, Tailwind CSS, `shadcn/ui`, TanStack Query, Framer Motion.
- `backend/` — Express TypeScript API, Prisma ORM, PostgreSQL, Argon2, JWT auth.
- `Docs/` — Source-of-truth master specification documents (Parts 1–12).

---

## 3. KEY ENGINEERING RULES FOR COPILOT / AGENTS

1. **Maintain Consistency:** Never bypass the layered backend or invent non-standard API response shapes.
2. **Type Safety:** Always maintain zero `tsc --noEmit` errors across both frontend and backend.
3. **Documentation:** Keep `README.md`, `Docs/`, and `.github/copilot-instructions.md` updated whenever features, endpoints, or rules are modified.
4. **Validation:** All incoming request bodies, route params, and query strings must be validated with `Zod` schemas before hitting service logic.
5. **Monochrome Aesthetic:** UI components must exclusively utilize the monochrome design tokens defined in `globals.css`.

---

## 4. COMPLETED IMPLEMENTATION PHASES

- **Phase 1-3:** Backend Core, Prisma V1 Schema, Argon2/JWT Authentication, Session management.
- **Phase 4-5:** Profiles, Follows, User Settings, Posts, Media Pipeline, Comments, Likes, Bookmarks.
- **Phase 6-7:** Notifications system, Moderation, Content Reporting, Audit logs.
- **Phase 8:** Direct Messaging (1-to-1 conversations, unread counters) and Universal Search APIs + Full Frontend UI.
