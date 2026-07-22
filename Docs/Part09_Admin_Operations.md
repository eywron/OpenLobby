# OPENLOBBY MASTER AI SPECIFICATION

## Part 9 — Admin & Moderation Operations

Version: V2.0

### 1. ROLES

- **User**: Standard permissions.
- **Moderator**: Can review reports and delete content.
- **Admin**: Full access.

### 2. REPORTING

Users can report posts, comments, or other users.
Reports are queued for moderator review.

### 3. AUDIT LOG

Critical actions (role changes, content deletions) are logged to the `AuditLog` table for accountability.
