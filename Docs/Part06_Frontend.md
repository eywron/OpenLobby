OPENLOBBY MASTER AI SPECIFICATION

Part 6 — Frontend Architecture, Next.js Structure, State Management & Performance

Version: V1.0

> Instruction for GitHub Copilot Agent: This document is the authoritative frontend specification for OpenLobby. Every frontend implementation must follow these rules to ensure consistency, maintainability, performance, accessibility, and scalability. Never sacrifice architecture for short-term convenience.




---

1. FRONTEND PHILOSOPHY

The frontend exists to provide a fast, intuitive, and responsive user experience.

It must:

Feel instant.

Minimize unnecessary network requests.

Render efficiently.

Be accessible.

Be maintainable.

Be reusable.


The frontend should never contain business logic that belongs on the backend.


---

2. FRONTEND STACK

Use:

Next.js (App Router)

React

TypeScript

Tailwind CSS

shadcn/ui

TanStack Query

React Hook Form

Zod

Framer Motion (minimal)

Lucide Icons


Do not introduce additional UI frameworks unless approved.


---

3. APPLICATION STRUCTURE

Organize by feature whenever practical.

Example:

frontend/

app/
components/
features/
hooks/
lib/
services/
providers/
types/
utils/
styles/
constants/

Avoid large "miscellaneous" folders.


---

4. NEXT.JS APP ROUTER

Use the App Router.

Take advantage of:

Nested layouts

Route groups

Loading UI

Error boundaries

Server Components

Client Components only when required


Keep Client Components to the minimum necessary.


---

5. SERVER VS CLIENT COMPONENTS

Default to Server Components.

Use Client Components only when interaction is required, such as:

Forms

Dropdowns

Modals

Infinite scrolling

Image upload

Real-time messaging


Do not mark entire pages as client components unless necessary.


---

6. COMPONENT DESIGN

Components should be:

Small

Focused

Reusable

Easy to test

Easy to read


Prefer composition over inheritance.

One component should have one primary responsibility.


---

7. COMPONENT HIERARCHY

Build reusable UI primitives first.

Example layers:

UI primitives (Button, Input, Card)

Shared components (Navbar, Sidebar, Modal)

Feature components (PostCard, CommentList)

Page components

Layouts


Do not duplicate components with similar behavior.


---

8. STATE MANAGEMENT

Use the simplest tool that solves the problem.

Local state:

useState


Complex local state:

useReducer


Server state:

TanStack Query


Form state:

React Hook Form


Avoid global state unless it provides clear value.


---

9. DATA FETCHING

Use TanStack Query for server data.

Requirements:

Caching

Background refetching

Optimistic updates where appropriate

Automatic retries (when appropriate)

Query invalidation after mutations


Do not fetch the same data multiple times unnecessarily.


---

10. API LAYER

Do not call fetch() directly throughout the application.

Create a centralized API service layer.

Responsibilities:

Authentication headers

Error handling

Request utilities

Base URL configuration

Token refresh handling



---

11. ROUTING

Routes should reflect user features.

Examples:

/
 /login
 /register
 /profile/[username]
 /messages
 /notifications
 /settings
 /bookmarks
 /search

Keep URLs clean and predictable.


---

12. FORMS

All forms should use:

React Hook Form

Zod validation


Validate:

Client side for user experience.

Server side for security.


Never rely only on client-side validation.


---

13. ERROR HANDLING

Every page should handle:

Loading state

Empty state

Error state


Never leave users with a blank screen.

Provide clear recovery actions when possible.


---

14. LOADING EXPERIENCE

Prefer skeleton loaders over spinners.

Skeletons should resemble the final content.

Use loading indicators sparingly.


---

15. IMAGE HANDLING

Use Next.js image optimization where compatible with Azure Blob Storage.

Requirements:

Lazy loading

Responsive sizes

Placeholder while loading

Preserve aspect ratio

Prevent layout shifts



---

16. PERFORMANCE OPTIMIZATION

Optimize for:

Small JavaScript bundles

Code splitting

Dynamic imports

Memoization when justified

Efficient rendering

Minimal re-renders


Do not prematurely optimize, but avoid obvious inefficiencies.


---

17. INFINITE SCROLL

Used for:

Home feed

Notifications

Messages

Search results (if applicable)


Requirements:

Smooth loading

Intersection Observer

Preserve scroll position

Avoid duplicate requests



---

18. SEARCH EXPERIENCE

Requirements:

Debounced input

Cached recent searches (optional)

Fast results

Clear loading state

Empty state messaging


Do not trigger a request on every keystroke.


---

19. THEME

V1 includes only the default E-Ink-inspired monochrome theme.

Future theme support should be possible without restructuring the application.

Do not hardcode colors throughout components; use centralized design tokens.


---

20. ACCESSIBILITY

Every interactive element must:

Be keyboard accessible.

Have visible focus indicators.

Include ARIA attributes where needed.

Support screen readers.


Accessibility regressions are considered bugs.


---

21. RESPONSIVE DESIGN

Target breakpoints:

Mobile

Tablet

Laptop

Desktop


Design mobile-first.

Test layouts across common viewport sizes.


---

22. NOTIFICATIONS

Display notifications using toast components.

Requirements:

Non-blocking

Short duration

Accessible

Meaningful messages


Avoid excessive notification spam.


---

23. REAL-TIME FEATURES

Future real-time functionality (e.g., typing indicators, new messages, live notifications) should use a dedicated communication layer (such as WebSockets) rather than repeated polling.

Design components so they can transition to real-time updates without major rewrites.


---

24. SEO

Use Next.js metadata APIs.

Include:

Titles

Descriptions

Open Graph

Twitter metadata

Canonical URLs


Generate:

Sitemap

robots.txt



---

25. TESTING

Frontend tests should cover:

Critical UI interactions

Form validation

Component rendering

Accessibility checks

Routing behavior


Focus on user-visible functionality.


---

26. DOCUMENTATION

Document:

Shared components

Custom hooks

Utility functions

Complex rendering logic

Feature architecture


Keep documentation close to the code when practical.


---

27. GITHUB COPILOT AGENT FRONTEND WORKFLOW

For every frontend feature:

1. Review existing components before creating new ones.


2. Reuse shared UI where possible.


3. Keep business logic out of components.


4. Use Server Components by default.


5. Convert to Client Components only when interaction requires it.


6. Ensure responsiveness.


7. Verify accessibility.


8. Optimize rendering performance.


9. Keep styling consistent with the design system.


10. Update documentation if architecture changes.


11. Wait for approval before beginning the next major feature.




---

28. FRONTEND SUCCESS CRITERIA

A frontend feature is complete only when it:

Uses the established component architecture.

Avoids unnecessary client-side rendering.

Is responsive.

Is accessible.

Is performant.

Is reusable.

Is fully typed.

Integrates cleanly with the backend API.

Matches the OpenLobby design system.



---

⭐ Additional Instruction for GitHub Copilot Agent

Before implementing any frontend feature, internally evaluate:

1. Can this be a Server Component?


2. Can I reuse an existing component?


3. Does this introduce unnecessary client-side JavaScript?


4. Is the user experience intuitive?


5. Is it responsive on all supported devices?


6. Is it accessible?


7. Does it follow the OpenLobby monochrome design system?


8. Will it remain maintainable as the application grows?



Only begin implementation after these questions have been considered.


---

End of Part 6

Next: Part 7 — Image Upload Pipeline, Azure Blob Storage, Media Processing & Storage Architecture, where we'll define secure uploads, Sharp processing, storage organization, CDN considerations, metadata handling, and media lifecycle management.