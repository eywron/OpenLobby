# OPENLOBBY MASTER AI SPECIFICATION

## Part 4 — Database Schema & Data Modeling

Version: V2.0

### 1. DATABASE PHILOSOPHY

The PostgreSQL database is the absolute source of truth for all application data, relationships, and application-specific user profiles.
Prisma is the ORM.

### 2. CORE MODELS

#### User

- `id`: UUID (Primary Key)
- `firebaseUid`: String (Unique) - The link to Firebase Auth
- `username`: String (Unique)
- `displayName`: String
- `email`: String (Unique)
- `provider`: String (e.g. 'google', 'email')
- `emailVerified`: Boolean

#### UserSettings

- Preferences for notifications and privacy. Linked 1-to-1 with User.

#### Post

- The core content unit. Supports text and images. Contains `visibility` settings.

#### PostImage

- Contains `storageUrl` and `thumbnailUrl` for MinIO objects.

#### Comment

- Belongs to a Post. Supports self-referential relations for replies.

#### Follow, Bookmark, Like

- Standard social relationship models.

#### Notification

- Records activities that the user should be alerted about.

#### Conversation & Message

- Direct and group messaging data models.

#### Report & AuditLog

- Moderation and platform history.

### 3. WHAT IS EXCLUDED

Since authentication is handled by Firebase, the database does NOT contain:

- Password hashes
- Session tracking
- Refresh tokens
- Password reset tokens
- Email verification tokens
