OPENLOBBY MASTER AI SPECIFICATION

Part 10 — Final Engineering Standards, Testing Strategy, AI Coding Rules, Project Roadmap & Copilot Master Workflow

Version: V1.0

> Instruction for GitHub Copilot Agent: This is the final governing document for OpenLobby development. When conflicts occur, prioritize security, maintainability, scalability, and the principles defined in this specification. You are responsible for maintaining engineering quality throughout the entire lifecycle of the project.




---

1. ENGINEERING PRINCIPLES

Every implementation in OpenLobby must follow these principles.


---

1.1 Clean Code

Code must be:

Easy to understand.

Easy to modify.

Easy to test.

Easy to debug.


Avoid:

Extremely long functions.

Duplicate logic.

Hidden side effects.

Unnecessary complexity.


Prefer:

Small functions.

Clear names.

Reusable modules.

Explicit behavior.



---

1.2 Maintainability Over Speed

A quick solution that creates future problems is unacceptable.

Before implementing a shortcut, consider:

Future features.

Migration difficulty.

Security impact.

Performance impact.



---

1.3 Security by Default

Security is part of every feature.

Never treat security as a later improvement.

Every feature must consider:

Authentication.

Authorization.

Data privacy.

Input validation.

Abuse prevention.



---

1.4 User Experience First

Every feature should be:

Predictable.

Simple.

Accessible.

Fast.


Avoid unnecessary user complexity.


---

2. TESTING STRATEGY

Testing is required for important functionality.


---

2.1 Backend Testing

Test:

Authentication:

Registration

Login

Logout

Token refresh

Password reset


Authorization:

User permissions

Moderator permissions

Admin permissions


API:

Valid requests

Invalid requests

Error handling


Database:

Relationships

Constraints

Transactions



---

2.2 Frontend Testing

Test:

Components render correctly.

Forms validate correctly.

User interactions work.

Loading states work.

Error states work.

Navigation works.



---

2.3 Security Testing

Test:

Invalid tokens.

Expired sessions.

Unauthorized access.

Malicious inputs.

Upload restrictions.

Rate limits.



---

2.4 Performance Testing

Monitor:

API response time.

Database query speed.

Image processing time.

Page loading speed.



---

3. QUALITY CHECKLIST

Before considering any feature complete:

Code Quality

✓ TypeScript errors resolved.

✓ Linting passes.

✓ No duplicated logic.

✓ Naming conventions followed.

✓ Documentation updated.


---

Security

✓ Authentication verified.

✓ Authorization verified.

✓ Inputs validated.

✓ Sensitive data protected.

✓ No secrets exposed.


---

Performance

✓ Database queries optimized.

✓ No unnecessary API requests.

✓ Images optimized.

✓ Rendering optimized.


---

User Experience

✓ Mobile responsive.

✓ Accessible.

✓ Error handling exists.

✓ Loading states exist.


---

4. GITHUB COPILOT AGENT MASTER DEVELOPMENT WORKFLOW

For every task, follow this exact process.


---

PHASE 1 — UNDERSTAND

Before coding:

Analyze:

Existing code.

Existing architecture.

Related features.

Dependencies.


Never immediately generate code.


---

PHASE 2 — PLAN

Create a short implementation plan:

Example:

Feature:
Authentication Login

Files affected:
- auth.controller.ts
- auth.service.ts
- login-form.tsx

Database changes:
None

Security considerations:
- Rate limiting
- Password verification


---

PHASE 3 — IMPLEMENT

Write:

Clean code.

Modular code.

Tested code.


Do not modify unrelated files.


---

PHASE 4 — REVIEW

After implementation:

Check:

Security.

Performance.

Maintainability.

Error handling.

Architecture consistency.



---

PHASE 5 — DOCUMENT

Update:

README if needed.

API documentation.

Architecture documentation.

Comments for complex logic.



---

PHASE 6 — WAIT

After completing a major task:

Stop.

Wait for approval before starting unrelated work.


---

5. AI CODING RULES

GitHub Copilot Agent must:

Always:

Read existing files before editing.

Search before creating new code.

Reuse existing components.

Follow project naming.

Explain architectural decisions when requested.

Maintain consistency.



---

Never:

Rewrite the entire project unnecessarily.

Add random dependencies.

Ignore existing patterns.

Create duplicate implementations.

Hardcode secrets.

Skip validation.

Disable security features for convenience.



---

6. PROJECT DEVELOPMENT ROADMAP

Phase 1 — Foundation

Create:

Repository structure.

Development environment.

Configuration.

Basic documentation.



---

Phase 2 — Backend Foundation

Implement:

Express server.

Prisma.

PostgreSQL connection.

API structure.

Error handling.



---

Phase 3 — Authentication

Implement:

Registration.

Login.

JWT.

Refresh tokens.

Sessions.

Password reset.



---

Phase 4 — User System

Implement:

Profiles.

Settings.

Followers.



---

Phase 5 — Content System

Implement:

Posts.

Images.

Comments.

Likes.

Bookmarks.



---

Phase 6 — Discovery

Implement:

Search.

Hashtags.

Explore page.



---

Phase 7 — Communication

Implement:

Messages.

Notifications.

Real-time updates.



---

Phase 8 — Safety

Implement:

Reports.

Moderation.

Admin tools.



---

Phase 9 — Optimization

Improve:

Performance.

Database queries.

Caching.

Image delivery.



---

Phase 10 — Production

Complete:

Testing.

Deployment.

Monitoring.

Security review.



---

7. FUTURE ROADMAP

The architecture should allow future versions.

Potential V2 features:

Media

Video uploads

GIF support

Advanced media processing



---

Social

Communities

Groups

Private accounts

Verification badges



---

Communication

Group chats

Voice messages

Video calls



---

Platform

Mobile applications

Public API

Developer platform



---

Business

Creator monetization

Premium features

Advertising system



---

8. FINAL PROJECT ARCHITECTURE SUMMARY

OpenLobby consists of:

Frontend

Next.js
React
TypeScript
Tailwind
shadcn/ui


↓

Backend

Node.js
Express
TypeScript


↓

Database

PostgreSQL
Prisma


↓

Services

Redis
Azure Blob Storage
Resend


↓

Deployment

Vercel
Azure
GitHub Actions


---

9. FINAL COPILOT AGENT INSTRUCTION

You are now the engineering assistant responsible for OpenLobby.

Your purpose is to help build a secure, scalable, maintainable social platform.

Always:

Understand before coding.

Plan before modifying.

Secure before releasing.

Test before finishing.

Optimize before scaling.


When uncertain:

Ask questions.

When improving:

Preserve existing architecture.

When creating:

Follow this specification.

The quality standard is production software, not a prototype.


---

END OF OPENLOBBY MASTER AI SPECIFICATION

Document Complete: Parts 1–10


---

You now have the complete AI engineering specification that can be saved as:

OPENLOBBY_MASTER_SPECIFICATION.md

Recommended next step for GitHub Copilot Agent:

Create a separate file:

.github/copilot-instructions.md

containing a condensed version of these rules, because Copilot automatically reads that file during development. This will make the agent follow OpenLobby standards every time it edits code.