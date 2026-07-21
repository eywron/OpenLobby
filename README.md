# OpenLobby

OpenLobby is a minimalist, community-focused social platform built with a Next.js frontend and an Express backend.

## Workspace Structure

- `frontend/` - Next.js App Router application
- `backend/` - Express TypeScript application
- `Docs/` - project architecture and standards source-of-truth documents

## Getting Started

1. Install dependencies:
   - `npm install`
2. Copy `.env.example` to `.env` and set local values.
3. Run quality checks:
   - `npm run lint`
   - `npm run typecheck`

## Phase 8 Status

This repository currently includes foundational workspace setup, shared TypeScript and lint configuration, starter frontend scaffolding, the initial backend core platform bootstrap, a complete Prisma V1 database schema, the authentication & session system, user profiles/follows/settings, the media/content pipeline, the notification system, admin/moderation features, and the direct messaging & search APIs aligned with the OpenLobby architecture documents.

### Backend bootstrap (Phase 1)

- Express app factory with security middleware
- Centralized environment validation
- Structured request logging
- Health check endpoint at `/api/v1/health`

### Database schema (Phase 2)

- Complete Prisma schema with all V1 core models
- Enums: UserRole, AccountStatus, PostVisibility, NotificationType, ConversationKind, MessageAttachmentType, ReportTargetType, ReportStatus, AuditLogType
- Models: User, UserSettings, Session, PasswordResetToken, EmailVerificationToken, Post, PostImage, Comment, PostLike, CommentLike, Bookmark, Follow, Notification, Conversation, ConversationParticipant, Message, Report, AuditLog
- Proper foreign keys, unique constraints, and indexes
- Soft deletes and cascading behavior aligned with security requirements
- Prisma client singleton available at `backend/src/lib/prisma.ts`

### Authentication & Session System (Phase 3)

- Registration with validation (username, email, password strength)
- Login with Argon2id password hashing and JWT tokens (access + refresh)
- HTTP-only cookies for refresh tokens with remember-me support
- Logout (single device or all devices), token refresh, password reset flow
- Auth middleware for protecting routes, optional auth for public endpoints with optional user context
- Session tracking with device info, IP, browser, and OS for security auditing

### User Profiles, Follows & Settings (Phase 4)

- Get own profile (`GET /api/v1/users/me`)
- Update own profile (`PATCH /api/v1/users/me`)
- Get public profile by username (`GET /api/v1/users/:username`)
- Get user settings (`GET /api/v1/users/me/settings`)
- Update user settings (`PATCH /api/v1/users/me/settings`)
- Follow/unfollow users (`POST /api/v1/users/me/follow`, `DELETE /api/v1/users/:userId/unfollow`)
- Check follow status (`GET /api/v1/users/:userId/follow-status`)
- Get followers/following lists with pagination (`GET /api/v1/users/:userId/followers`, `GET /api/v1/users/:userId/following`)

### Media Pipeline & Content Management (Phase 5)

**Posts:**
- Create post with optional images (`POST /api/v1/posts`)
- Get post by ID (`GET /api/v1/posts/:postId`)
- Get authenticated user's feed (`GET /api/v1/posts/feed`) - shows user's posts and followed users' posts
- Get public posts from user (`GET /api/v1/posts/user/:userId/posts`)
- Update own post (`PATCH /api/v1/posts/:postId`)
- Delete own post (`DELETE /api/v1/posts/:postId`)

**Post Interactions:**
- Like post (`POST /api/v1/posts/:postId/like`)
- Unlike post (`DELETE /api/v1/posts/:postId/like`)
- Check like status (`GET /api/v1/posts/:postId/like-status`)
- Bookmark post (`POST /api/v1/posts/:postId/bookmark`)
- Remove bookmark (`DELETE /api/v1/posts/:postId/bookmark`)
- Check bookmark status (`GET /api/v1/posts/:postId/bookmark-status`)

**Comments:**
- Create comment on post (`POST /api/v1/posts/:postId/comments`)
- Get post comments with thread view (`GET /api/v1/posts/:postId/comments`)
- Delete own comment (`DELETE /api/v1/posts/:postId/comments/:commentId`)
- Like comment (`POST /api/v1/posts/:postId/comments/:commentId/like`)
- Unlike comment (`DELETE /api/v1/posts/:postId/comments/:commentId/like`)
- Check comment like status (`GET /api/v1/posts/:postId/comments/:commentId/like-status`)

### Notifications & Real-time (Phase 6)

**Notification Management:**
- Get notifications with filtering and pagination (`GET /api/v1/notifications?limit=20&skip=0&type=LIKE&unreadOnly=false`)
- Get unread notification count (`GET /api/v1/notifications/unread-count?type=LIKE`)
- Mark single notification as read (`POST /api/v1/notifications/:notificationId/read`)
- Mark all notifications as read (`POST /api/v1/notifications/read-all`)
- Delete single notification (`DELETE /api/v1/notifications/:notificationId`)
- Delete all notifications (`DELETE /api/v1/notifications?type=LIKE`)

**Automatic Notifications:**
- LIKE: Sent when user likes a post
- COMMENT: Sent when user comments on a post
- REPLY: Sent when user replies to a comment
- FOLLOW: Sent when user follows another user

### Admin & Moderation (Phase 7)

**Content Reporting:**
- Create report for post/comment/user (`POST /api/v1/admin/reports`) - public endpoint
- Get all reports with filtering (`GET /api/v1/admin/reports?status=OPEN&targetType=POST`) - admin/moderator only
- Get single report (`GET /api/v1/admin/reports/:reportId`) - admin/moderator only
- Review report (change status + add note) (`POST /api/v1/admin/reports/:reportId/review`) - admin/moderator only

**User Management:**
- Suspend user (`POST /api/v1/admin/users/:userId/suspend`) - admin/moderator only
- Unsuspend user (`POST /api/v1/admin/users/:userId/unsuspend`) - admin/moderator only
- Delete user account (`DELETE /api/v1/admin/users/:userId`) - admin/moderator only

**Content Moderation:**
- Delete post or comment (`POST /api/v1/admin/content/delete`) - admin/moderator only

**Audit Logs:**
- Get audit logs with optional admin filter (`GET /api/v1/admin/audit-logs?limit=20&skip=0&adminId=userId`) - admin/moderator only

**Report Statuses:**
- OPEN: New report, not yet reviewed
- UNDER_REVIEW: Being investigated
- RESOLVED: Action taken
- REJECTED: No action needed

### Messaging & Search (Phase 8)

**Direct Messages:**
- Get user conversations (`GET /api/v1/conversations`)
- Start or get direct conversation (`POST /api/v1/conversations`)
- Send message (`POST /api/v1/conversations/:conversationId/messages`)
- Get message history (`GET /api/v1/conversations/:conversationId/messages`)
- Mark conversation as read (`POST /api/v1/conversations/:conversationId/read`)
- Get total unread messages count (`GET /api/v1/messages/unread-count`)

**Search:**
- Universal search (`GET /api/v1/search?q=query&type=users|posts|hashtags`)
