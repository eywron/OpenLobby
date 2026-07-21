OPENLOBBY MASTER AI SPECIFICATION

Part 3 — Authentication & Security Architecture

Version: V1.0

> Instruction for GitHub Copilot Agent: This document defines the complete authentication and security architecture for OpenLobby. These requirements are mandatory. Do not replace this architecture with third-party authentication services unless explicitly instructed.




---

1. AUTHENTICATION PHILOSOPHY

OpenLobby owns its authentication system.

Do not use:

Firebase Authentication

Supabase Authentication

Clerk

Auth0

Magic Links

Third-party identity providers for core authentication


The entire authentication system must be controlled by OpenLobby.

This ensures:

Full ownership of user accounts

Easy migration to different cloud providers

No vendor lock-in

Complete control over security policies



---

2. AUTHENTICATION STACK

Use:

PostgreSQL

Prisma ORM

Node.js

Express

JWT

Argon2id

Secure HTTP-only cookies (for refresh token)

Redis (optional for token revocation and rate limiting)



---

3. PASSWORD HASHING

Never store passwords.

Hash every password using:

Argon2id

Requirements:

Unique random salt

Strong memory cost

Strong time cost

Automatic parameter upgrades when appropriate


Never use:

SHA256

MD5

SHA1

Plain bcrypt defaults without review



---

4. LOGIN FLOW

User enters:

Email or Username

Password


Backend:

1. Validate input


2. Find user


3. Verify password


4. Check account status


5. Generate Access Token


6. Generate Refresh Token


7. Save Refresh Token


8. Return authenticated session



Never reveal whether the email or password was incorrect.

Always return a generic authentication error.


---

5. REGISTRATION FLOW

Collect:

Username

Display Name

Email

Password


Validation:

Username uniqueness

Email uniqueness

Password strength

Allowed username characters

Reserved username check


Automatically create:

User profile

Default avatar

Default settings

Default notification preferences



---

6. PASSWORD POLICY

Minimum requirements:

Minimum length

Maximum length

Prevent extremely common passwords

Prevent whitespace-only passwords


Do not require excessive complexity that harms usability.

Encourage passphrases.


---

7. EMAIL VERIFICATION

Version 1

Email verification is disabled.

Users can register and use the platform immediately.

However, the database and backend architecture must include:

Verification token table

Verification service

Verification endpoints

Email templates


These features remain inactive until enabled in a future version.

This allows email verification to be turned on later without redesigning the authentication system.


---

8. PASSWORD RESET

Allow password reset via email.

Flow:

1. User requests reset.


2. Generate secure random token.


3. Store hashed token with expiration.


4. Send email.


5. User submits new password.


6. Validate token.


7. Update password.


8. Invalidate existing sessions if configured.


9. Delete used token.



Tokens:

Single use

Short expiration

Cryptographically secure



---

9. JWT DESIGN

Generate:

Access Token

Purpose:

Authenticate API requests.

Short lifetime.

Contains:

User ID

Username

Role

Token version


Do not include sensitive information.


---

Refresh Token

Purpose:

Obtain new Access Tokens.

Long lifetime.

Random value.

Store hashed version in database.

Support revocation.


---

10. SESSION MANAGEMENT

Users may remain logged in on multiple devices.

Each login creates a unique session.

Track:

Device name (if available)

Browser

Operating System

IP address (optional)

Login timestamp

Last activity


Allow users to revoke individual sessions.


---

11. REMEMBER ME

If enabled:

Refresh Token expiration is extended.

If disabled:

Use a shorter expiration.

Do not extend Access Token lifetime.


---

12. LOGOUT

Logout:

Delete Refresh Token

Invalidate session

Clear cookies


Support:

Logout current device

Logout all devices



---

13. ACCOUNT DELETION

Deleting an account should:

Require password confirmation

Revoke all sessions

Remove refresh tokens

Soft delete user initially

Schedule permanent deletion if desired


Never instantly destroy data unless policy requires it.


---

14. USER ROLES

Initial roles:

User

Moderator

Administrator


Architecture must support adding more roles later.

Use Role-Based Access Control (RBAC).

Never hardcode permissions.


---

15. PERMISSIONS

Examples:

User

Create posts

Edit own posts

Delete own posts


Moderator

Review reports

Remove violating content


Administrator

Manage users

Manage moderators

View audit logs

Configure platform settings



---

16. ACCOUNT STATUS

Possible statuses:

Active

Suspended

Banned

Deleted

Pending (future use)


Every login should verify account status.


---

17. RATE LIMITING

Protect endpoints:

Login

Register

Password reset

Search

Posting

Image upload


Different endpoints may use different rate limits.


---

18. INPUT VALIDATION

Validate every request.

Validate:

Body

Query

Route parameters

Headers where appropriate


Never trust frontend validation alone.


---

19. SQL INJECTION

Prevent using:

Prisma parameterized queries

Input validation

Never concatenate SQL strings



---

20. XSS PREVENTION

Escape user-generated content before rendering.

Sanitize rich text if supported in future versions.

Never render raw HTML from users without sanitization.


---

21. CSRF

If using cookies for Refresh Tokens:

Implement CSRF protection for state-changing requests.

If using Authorization headers only:

Evaluate whether CSRF protection is required.


---

22. SECURITY HEADERS

Use Helmet.

Configure:

CSP

HSTS

X-Frame-Options

X-Content-Type-Options

Referrer Policy


Review settings for compatibility with the frontend.


---

23. CORS

Restrict origins.

Do not use wildcard origins in production.

Allow only trusted frontend domains.


---

24. FILE UPLOAD SECURITY

Reject:

Executables

Scripts

Unknown MIME types

Oversized files

Corrupted files


Verify both file extension and MIME type.

Scan upload metadata before processing.


---

25. IMAGE PROCESSING

Every uploaded image:

1. Validate


2. Resize if necessary


3. Compress


4. Strip EXIF metadata


5. Generate thumbnail


6. Convert to WebP when beneficial


7. Store securely



Never serve original unvalidated uploads directly.


---

26. SPAM PROTECTION

Protect against:

Rapid account creation

Post flooding

Comment flooding

Message flooding


Implement configurable cooldowns and rate limits.

Future support for CAPTCHA should be possible without major changes.


---

27. AUDIT LOGGING

Record important events such as:

Login

Logout

Password change

Password reset

Account deletion

Role changes

Moderator actions

Administrator actions


Audit logs should be immutable and accessible only to authorized administrators.


---

28. ERROR HANDLING

Never expose:

Stack traces

Database errors

Internal paths

Secrets


Return generic error messages to clients while logging detailed errors securely on the server.


---

29. ENVIRONMENT VARIABLES

Store all secrets outside the codebase.

Examples include:

JWT secrets

Database credentials

Azure Storage credentials

Redis connection details

Email service API keys


Never commit .env files to version control.

Provide a .env.example with placeholder values.


---

30. GITHUB COPILOT AGENT SECURITY WORKFLOW

For every authentication or security-related feature:

1. Review existing authentication architecture.


2. Reuse existing services where possible.


3. Validate all inputs.


4. Apply least-privilege principles.


5. Protect sensitive routes with authorization middleware.


6. Ensure secrets remain outside source code.


7. Review for common security vulnerabilities.


8. Add or update tests for critical flows.


9. Document security-sensitive behavior if needed.


10. Wait for approval before implementing unrelated security features.




---

31. AUTHENTICATION SUCCESS CRITERIA

The authentication system is complete only when it:

Uses custom authentication without vendor lock-in.

Stores passwords securely with Argon2id.

Supports JWT access and refresh tokens.

Allows multiple active sessions with revocation.

Supports password reset.

Is architected for future email verification without redesign.

Protects against common web attacks.

Follows secure coding practices.

Is modular, testable, and maintainable.



---

End of Part 3

Next: Part 4 — Database Architecture & Prisma Schema Planning, where we'll define every table, relationship, indexing strategy, naming conventions, migration rules, soft deletes, timestamps, and future-proof data model for OpenLobby.