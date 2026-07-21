OPENLOBBY MASTER AI SPECIFICATION

Part 4 — Database Architecture & Prisma Schema Planning

Version: V1.0

> Instruction for GitHub Copilot Agent: This document defines the authoritative database architecture for OpenLobby. All schema design, migrations, relationships, and indexing must follow this specification. Prioritize data integrity, scalability, and maintainability. Avoid breaking changes unless explicitly approved.




---

1. DATABASE PHILOSOPHY

The database is the source of truth for OpenLobby.

Design principles:

Normalize data where appropriate.

Use foreign keys to enforce relationships.

Prevent orphaned records.

Minimize redundant data.

Design for future expansion without major schema changes.

Prefer explicit relationships over implicit assumptions.



---

2. DATABASE TECHNOLOGY

PostgreSQL

Prisma ORM

Prisma Migrations


Never modify the database directly in production. All schema changes must go through Prisma migrations.


---

3. GENERAL TABLE RULES

Every table should include:

Primary key (id)

createdAt

updatedAt


Where appropriate, also include:

deletedAt (for soft deletes)

createdBy

updatedBy


Use UUIDs (or another globally unique identifier) as primary keys to simplify distributed systems and future scaling.


---

4. CORE TABLES

The initial schema must include at least:

Users

Stores user account information.

Key fields:

id

username

displayName

email

passwordHash

avatarUrl

bannerUrl

bio

role

accountStatus

createdAt

updatedAt

deletedAt (nullable)



---

UserSettings

Stores user preferences.

Examples:

notification settings

privacy settings

theme preferences (future)

language (future)


Keep settings separate from the Users table.


---

Sessions

Tracks active login sessions.

Fields include:

session identifier

user ID

refresh token hash

device information

browser

operating system

IP address (optional)

last activity

expiration time



---

PasswordResetTokens

Stores password reset tokens.

Requirements:

hashed token

expiration

single-use

linked to user



---

EmailVerificationTokens

Included in V1 architecture but unused until email verification is enabled.


---

Posts

Stores all user posts.

Fields:

author

text content

visibility

timestamps

edit status


Do not store images directly in this table.


---

PostImages

Supports multiple images per post.

Each image record contains:

post ID

storage URL

thumbnail URL

width

height

display order


This design supports future multi-image posts.


---

Comments

Supports nested replies.

Each comment references:

post

author

parent comment (nullable)


Allow unlimited nesting through parent-child relationships.


---

PostLikes

Stores likes on posts.

One like per user per post.

Enforce uniqueness with database constraints.


---

CommentLikes

Stores likes on comments.


---

Bookmarks

Private bookmarks.

Only visible to the owner.


---

Followers

Stores follow relationships.

Fields:

follower

following

createdAt


Prevent duplicate relationships.


---

Notifications

Stores notifications.

Types include:

like

comment

reply

follow

mention (future)


Track read/unread status.


---

Conversations

Represents private conversations.

Support:

one-to-one conversations

future group conversations


Design now for future compatibility.


---

ConversationParticipants

Links users to conversations.

Allows multiple participants.


---

Messages

Stores individual messages.

Support:

text

image attachments

timestamps

read status

edited status

deleted status


Never permanently delete messages immediately unless policy requires it.


---

Reports

Stores moderation reports.

Targets:

posts

comments

users


Track:

reporter

reason

status

assigned moderator

resolution



---

AuditLogs

Stores security and administrative events.

Examples:

login

logout

role changes

moderator actions

password changes

account deletion


Audit logs should be append-only.


---

5. RELATIONSHIPS

Examples:

User

↓

Posts

↓

Comments

↓

Replies

User

↓

Followers

↓

Users

Conversation

↓

Participants

↓

Messages

Report

↓

Target Entity

All relationships must be enforced with foreign keys.


---

6. CASCADE STRATEGY

Be deliberate with cascading behavior.

Examples:

Deleting a user should not automatically delete audit logs.

Deleting a post should remove associated likes and bookmarks but preserve moderation history where appropriate.

Choose cascade, restrict, or set-null intentionally for each relationship.


---

7. SOFT DELETES

Prefer soft deletes for:

users

posts

comments

messages


Benefits:

moderation

recovery

auditability


Do not soft delete lookup tables unnecessarily.


---

8. INDEXING STRATEGY

Create indexes for frequently queried fields.

Examples:

Users:

username

email


Posts:

author

createdAt


Comments:

post ID


Messages:

conversation ID

createdAt


Followers:

follower ID

following ID


Search-related indexes should support fast lookups without excessive write overhead.


---

9. UNIQUE CONSTRAINTS

Enforce uniqueness where appropriate.

Examples:

username

email

one like per user per post

one bookmark per user per post

one follow relationship per user pair


Do not rely solely on application logic.


---

10. ENUMS

Use enums for controlled values.

Examples:

Role:

USER

MODERATOR

ADMIN


AccountStatus:

ACTIVE

SUSPENDED

BANNED

DELETED


NotificationType:

LIKE

COMMENT

REPLY

FOLLOW


ReportStatus:

OPEN

IN_REVIEW

RESOLVED

REJECTED



---

11. FILE STORAGE

Do not store image binaries in PostgreSQL.

Store only metadata:

URL

dimensions

MIME type

file size

thumbnail URL


Actual image files belong in Azure Blob Storage.


---

12. FUTURE-PROOFING

Design the schema to support future features without major rewrites.

Examples:

videos

stories

group chats

communities

advertisements

premium subscriptions


Avoid assumptions that limit expansion.


---

13. MIGRATION RULES

Every schema change must:

1. Be implemented in the Prisma schema.


2. Generate a migration.


3. Be reviewed before applying to production.


4. Preserve existing data whenever possible.



Never edit historical migrations after they have been applied.


---

14. DATA INTEGRITY

Use:

foreign keys

unique constraints

check constraints (where appropriate)

transactions for multi-step operations


Ensure operations that modify multiple tables are atomic.


---

15. GITHUB COPILOT AGENT DATABASE WORKFLOW

When making database changes:

1. Review the current Prisma schema.


2. Check existing relationships.


3. Reuse enums and models where appropriate.


4. Avoid duplicate tables.


5. Add indexes when justified.


6. Generate a Prisma migration.


7. Review migration impact.


8. Update documentation if the schema changes.


9. Ensure queries remain efficient.


10. Wait for approval before making unrelated schema changes.




---

16. DATABASE SUCCESS CRITERIA

The database architecture is complete when it:

Maintains data integrity.

Supports all V1 features.

Uses clear relationships.

Enforces uniqueness at the database level.

Stores files outside the database.

Supports future expansion.

Remains performant through proper indexing.

Is fully managed through Prisma migrations.



---

End of Part 4

Next: Part 5 — Backend Architecture, REST API Design & Project Structure, where we'll define Express application architecture, controllers, services, middleware, validation, routing, logging, error handling, API conventions, folder organization, and coding standards for the backend.