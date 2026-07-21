OPENLOBBY MASTER AI SPECIFICATION

Part 5 — Backend Architecture, REST API Design & Project Structure

Version: V1.0

> Instruction for GitHub Copilot Agent: This document defines the backend architecture for OpenLobby. Follow these standards for every backend feature. Do not bypass the architecture or mix responsibilities between layers.




---

1. BACKEND PHILOSOPHY

The backend is responsible for:

Business logic

Authentication

Authorization

Validation

Security

Database access

Image processing

Notifications

API responses


The frontend must never directly access the database.

The backend must act as the single source of truth.


---

2. BACKEND TECHNOLOGY STACK

Use:

Node.js LTS

Express.js

TypeScript

Prisma ORM

PostgreSQL

Redis

Sharp

Zod

Pino (logging)

Helmet

CORS

Compression

Cookie Parser

JWT

Argon2


Do not introduce unnecessary frameworks.


---

3. ARCHITECTURE PATTERN

Use a layered architecture.

Never put all logic inside route files.

Each layer has a single responsibility.

Client
    │
REST API
    │
Routes
    │
Controllers
    │
Services
    │
Repositories (Prisma)
    │
PostgreSQL


---

4. RESPONSIBILITIES

Routes

Responsible for:

URL definitions

Middleware ordering

Passing requests to controllers


No business logic.


---

Controllers

Responsible for:

Receiving requests

Calling services

Returning responses


No database queries.


---

Services

Responsible for:

Business logic

Transactions

Validation coordination

Calling repositories

External services


Most application logic belongs here.


---

Repositories

Responsible for:

Prisma queries only


No business logic.


---

Middleware

Responsible for:

Authentication

Authorization

Validation

Rate limiting

Logging

Error handling



---

5. PROJECT STRUCTURE

Recommended backend structure:

backend/

src/

config/

constants/

controllers/

middleware/

routes/

services/

repositories/

validators/

schemas/

types/

utils/

lib/

jobs/

prisma/

tests/

uploads/

logs/

Keep folders small and organized.


---

6. ROUTING STANDARDS

Group routes by feature.

Example:

/auth

/users

/posts

/comments

/messages

/notifications

/search

/bookmarks

/reports

/admin

Never create huge route files.


---

7. API DESIGN

Use REST principles.

Examples:

GET /posts

GET /posts/:id

POST /posts

PATCH /posts/:id

DELETE /posts/:id

Keep naming predictable.

Use nouns instead of verbs.


---

8. RESPONSE FORMAT

All API responses should follow a consistent structure.

Successful response:

{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}

Error response:

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request."
  }
}

Never expose stack traces or internal implementation details.


---

9. HTTP STATUS CODES

Use proper HTTP status codes.

Examples:

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

429 Too Many Requests

500 Internal Server Error

Do not return 200 for failures.


---

10. VALIDATION

Use Zod for request validation.

Validate:

request body

query parameters

route parameters


Validation must occur before business logic executes.


---

11. AUTHENTICATION MIDDLEWARE

Protected routes require authentication.

Authentication middleware should:

Verify Access Token

Validate expiration

Attach authenticated user to request

Reject invalid tokens


Never trust client-provided user IDs.


---

12. AUTHORIZATION

Implement Role-Based Access Control (RBAC).

Examples:

Normal user:

Edit own profile

Delete own posts


Moderator:

Moderate reports

Remove content


Administrator:

Manage users

Manage roles

Access audit logs


Permissions must be configurable.


---

13. ERROR HANDLING

Use centralized error handling.

Never repeat try/catch blocks unnecessarily.

Handle:

Validation errors

Authentication failures

Database errors

File upload errors

Unknown exceptions


Log detailed errors internally.

Return safe messages to clients.


---

14. LOGGING

Use structured logging with Pino.

Log:

Server startup

Errors

Authentication events

Failed login attempts

Critical actions

Unexpected exceptions


Never log:

Passwords

Tokens

Secrets



---

15. TRANSACTIONS

Use database transactions for multi-step operations.

Examples:

Creating a post with images.

Registering a user.

Deleting an account.

Updating multiple related records.

Ensure operations are atomic.


---

16. SEARCH

Implement efficient search.

Support:

users

posts

hashtags


Use database indexes.

Paginate results.

Debounce requests on the frontend.


---

17. PAGINATION

Every large collection must support pagination.

Examples:

Posts

Comments

Messages

Followers

Notifications

Avoid returning unbounded datasets.


---

18. FILE UPLOADS

Upload flow:

1. Validate file.


2. Scan metadata.


3. Resize.


4. Compress.


5. Strip metadata.


6. Upload to Azure Blob Storage.


7. Save metadata in PostgreSQL.



Never expose temporary files.


---

19. CACHING

Use Redis selectively.

Examples:

Trending hashtags

Frequently accessed user profiles

Rate limiting

Session revocation (if applicable)

Do not cache sensitive user-specific data without careful consideration.


---

20. BACKGROUND TASKS

Prepare an architecture for asynchronous jobs.

Potential uses:

Image processing

Notification delivery

Email sending

Cleanup tasks


Design now, even if some jobs are implemented synchronously in V1.


---

21. CONFIGURATION

Centralize configuration.

Examples:

Database

JWT

Redis

Azure Storage

Email

Rate limits

Upload limits

Never scatter configuration values across the codebase.


---

22. ENVIRONMENT VARIABLES

Provide a .env.example with placeholders.

Examples:

DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER=
REDIS_URL=
RESEND_API_KEY=
PORT=
NODE_ENV=

Do not commit actual secrets.


---

23. API VERSIONING

Prepare for versioning.

Example:

/api/v1/...

Future versions should coexist without breaking existing clients.


---

24. TESTING STRATEGY

Backend tests should include:

Unit tests

Integration tests

Authentication flows

Validation

Authorization

Error handling


Critical paths must be tested.


---

25. DOCUMENTATION

Maintain API documentation.

Include:

Endpoints

Request schemas

Response schemas

Authentication requirements

Error codes


Documentation should evolve with the API.


---

26. GITHUB COPILOT AGENT BACKEND WORKFLOW

For every backend feature:

1. Review the existing architecture.


2. Reuse existing services and utilities.


3. Define or update validation schemas.


4. Implement business logic in services.


5. Keep controllers thin.


6. Add or update repository queries.


7. Verify authentication and authorization.


8. Review performance.


9. Review security.


10. Update documentation if the API changes.


11. Wait for approval before implementing unrelated features.



Do not bypass established layers.


---

27. BACKEND SUCCESS CRITERIA

The backend is complete when it:

Follows the layered architecture.

Separates responsibilities cleanly.

Uses consistent REST conventions.

Validates all input.

Secures protected routes.

Handles errors gracefully.

Logs important events safely.

Supports future growth without major restructuring.



---

⭐ Additional Instruction for GitHub Copilot Agent

Before writing any new backend code, answer these questions internally:

1. Does this functionality already exist?


2. Can I reuse an existing service or utility?


3. Does this require a database transaction?


4. What are the security implications?


5. What are the performance implications?


6. How will this scale to 1 million users?


7. Is this implementation consistent with the OpenLobby architecture?



Only proceed after those questions have been considered.


---

End of Part 5

Next: Part 6 — Frontend Architecture, Next.js Structure, State Management, Performance, and Component Standards, where we'll define the complete frontend code organization, rendering strategy, caching, reusable components, and best practices for a fast, maintainable user interface.