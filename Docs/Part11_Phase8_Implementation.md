OPENLOBBY MASTER AI SPECIFICATION

Part 11 — Phase 8 Implementation: Direct Messaging & Search API

Version: V1.0

---

1. OVERVIEW

Phase 8 implements the final pieces of the OpenLobby social communication features: Direct Messaging and Universal Search. 

These features strictly adhere to the layered architecture defined in Part 5 (Routes -> Controllers -> Services -> Repositories) and utilize the models defined in Part 4.

---

2. DIRECT MESSAGING API

The messaging API allows users to establish 1-to-1 direct conversations, send messages, and track read states.

Endpoints (under `/api/v1/conversations` and `/api/v1/messages`):

- `GET /api/v1/conversations`
  - Retrieves the current user's conversations, including the latest message and unread count for each conversation.
  - Supports cursor-based or offset pagination.

- `POST /api/v1/conversations`
  - Starts a new direct conversation with a target user (or retrieves the existing one).
  - Expects `{ "targetUserId": "<uuid>" }` in the body.
  - Validates that the target user exists, is active, and is not the current user.

- `POST /api/v1/conversations/:conversationId/messages`
  - Sends a new message in a conversation.
  - Expects `{ "textContent": "..." }` and/or attachment fields.
  - Updates the conversation's `updatedAt` timestamp to bubble it up in the conversation list.

- `GET /api/v1/conversations/:conversationId/messages`
  - Retrieves message history for a conversation.
  - Uses cursor-based pagination for smooth scrolling in the UI.

- `POST /api/v1/conversations/:conversationId/read`
  - Updates the `lastReadAt` timestamp for the current user in the conversation.
  - Clears unread counts.

- `GET /api/v1/messages/unread-count`
  - Aggregates the total number of unread messages across all conversations for the current user.

---

3. SEARCH API

The search API provides universal discovery for users, posts, and hashtags.

Endpoints (under `/api/v1/search`):

- `GET /api/v1/search`
  - Universal search endpoint supporting queries: `?q=query&type=users|posts|hashtags&limit=20&skip=0`
  - Type `users`: Searches usernames and display names, ignoring deleted accounts.
  - Type `posts`: Searches post content, returning public posts ordered by recency.
  - Type `hashtags`: Extracts post counts for matching hashtag patterns.

---

4. ARCHITECTURE & VALIDATION

- All requests are strictly validated using Zod schemas (`message.schema.ts` and `search.schema.ts`).
- Route handlers extract the authenticated user ID and delegate to Services.
- Services handle business logic (e.g., verifying a user is actually a participant in a conversation before allowing them to read/send messages).
- Repositories handle Prisma ORM calls exclusively.
- All responses use standard `createSuccessResponse()` and `createErrorResponse()` envelopes.

End of Part 11
