# OPENLOBBY MASTER AI SPECIFICATION

## Part 5 — Backend Architecture

Version: V2.0

### 1. BACKEND STACK

- Node.js (LTS)
- Express 5.x
- TypeScript
- Prisma ORM
- Zod (Validation)
- Pino (Logging)

### 2. ARCHITECTURE LAYERS

The backend follows a layered architecture to separate concerns:

1. **Routes**: Define endpoints and apply middleware.
2. **Controllers**: Handle HTTP requests, parse inputs, and format responses.
3. **Services**: Contain business logic.
4. **Repositories**: Handle direct database access via Prisma.

### 3. AUTHENTICATION MIDDLEWARE

The `auth.middleware.ts` intercepts requests and verifies the Firebase ID Token.
If valid, it injects the decoded user info into `req.user`.

### 4. STORAGE SERVICE

The storage service connects to MinIO via the S3 protocol.
Uploaded images are processed in-memory using Sharp (resized, converted to WebP, stripped of EXIF metadata) before being uploaded to MinIO.

### 5. RATE LIMITING

Uses `express-rate-limit` backed by Redis (`rate-limit-redis`).

### 6. ERROR HANDLING

Express 5 supports native async error handling.
Use the `AppError` class for all expected operational errors.

### 7. GITHUB COPILOT AGENT BACKEND WORKFLOW

1. Validate inputs using Zod.
2. Implement business logic in services.
3. Write clean Prisma queries in repositories.
4. Format consistent API responses.
5. Never leak stack traces.
