# OPENLOBBY MASTER AI SPECIFICATION

## Part 3 — Authentication & Security Architecture

Version: V2.0

### 1. AUTHENTICATION PHILOSOPHY

OpenLobby uses Firebase Authentication for all identity management.
The backend verifies Firebase tokens, but PostgreSQL remains the absolute source of truth for all application data, profiles, and relationships.

### 2. AUTHENTICATION STACK

- **Client SDK**: `firebase/auth` (Frontend)
- **Admin SDK**: `firebase-admin` (Backend)
- **Providers**: Google Sign-In, Email/Password
- **Database**: PostgreSQL (via Prisma)

### 3. LOGIN FLOW

1. User authenticates via Firebase Client SDK (Google or Email/Password).
2. Firebase issues an ID Token.
3. Frontend attaches the ID Token to all API requests as a Bearer token.
4. Backend verifies the token using Firebase Admin SDK.
5. If the user doesn't exist in PostgreSQL, the backend creates them during the `/auth/sync` flow.

### 4. ACCOUNT SYNCING

Because Firebase stores credentials, PostgreSQL must store the application profile.
After logging in, the frontend sends a request to `POST /api/v1/auth/sync`.
The backend reads the Firebase UID from the token, checks PostgreSQL, and either creates a new user or updates existing details.

### 5. PASSWORD MANAGEMENT

OpenLobby does NOT store passwords or password hashes.
All password hashing, storage, and validation is handled securely by Firebase Authentication.
Password resets are triggered via Firebase's `sendPasswordResetEmail` method.

### 6. SESSION MANAGEMENT

Firebase handles session persistence and token refreshing automatically.
The frontend does not need to store JWTs in `localStorage` or `httpOnly` cookies.
`getIdToken()` handles auto-refreshing expired tokens.

### 7. SECURITY PRACTICES

- **CORS**: Strict origin enforcement.
- **Rate Limiting**: Redis-backed rate limiting for APIs.
- **SQL Injection**: Prevented via Prisma ORM.
- **XSS**: Handled by React's built-in escaping.
