OPENLOBBY MASTER AI SPECIFICATION

Part 9 — Administration, Moderation, Monitoring, Analytics, DevOps & Production Operations

Version: V1.0

> Instruction for GitHub Copilot Agent: This document defines how OpenLobby is operated after deployment. Design every administrative tool with security, auditability, and scalability in mind. Administrative actions must be traceable, reversible where appropriate, and protected by strict authorization.




---

1. OPERATIONS PHILOSOPHY

OpenLobby is intended to operate continuously with minimal manual intervention.

The platform should:

Recover gracefully from failures.

Provide visibility into system health.

Keep administrator tools secure.

Support future growth without major operational changes.



---

2. ADMIN PANEL

The Admin Panel is accessible only to users with the ADMIN role.

Never expose administrative routes, APIs, or data to unauthorized users.

Admin capabilities include:

Dashboard

User management

Post management

Report management

Moderation logs

Audit logs

Platform statistics

System health

Storage monitoring



---

3. MODERATOR PANEL

Moderators have limited administrative privileges.

Capabilities:

Review reports

Remove violating posts

Remove violating comments

Suspend accounts (if permitted)

Leave moderation notes


Moderators cannot:

Change administrator roles

Access environment variables

Delete audit logs

Modify platform configuration



---

4. USER MANAGEMENT

Administrators can:

Search users

View profiles

Suspend accounts

Ban accounts

Restore suspended accounts

Reset user sessions

Review moderation history


Account deletion should be handled carefully and follow platform policy.


---

5. CONTENT MANAGEMENT

Administrators and authorized moderators can:

View reported posts

Remove posts

Restore posts (if soft-deleted)

Review reports

Record moderation decisions


All actions must be logged.


---

6. REPORT QUEUE

Reports should progress through defined states:

1. Open


2. In Review


3. Resolved


4. Rejected



Support filtering by:

Status

Reporter

Target type

Date

Assigned moderator


Prevent multiple moderators from unknowingly handling the same report simultaneously where practical.


---

7. AUDIT LOGS

Audit logs record sensitive operations.

Examples:

Login

Logout

Password reset

Role changes

User suspension

Post removal

Configuration changes


Audit logs are append-only.

They must never be editable through the application.


---

8. ANALYTICS DASHBOARD

Provide aggregated platform statistics.

Examples:

Total users

Active users

New registrations

Total posts

Total comments

Messages sent

Reports submitted

Storage consumption


Do not expose personally identifiable information unnecessarily.


---

9. SYSTEM HEALTH

Display:

Database connectivity

Redis connectivity

Azure Blob Storage availability

API response times

Background job status

Server uptime


The dashboard should help identify operational issues quickly.


---

10. STORAGE MONITORING

Track:

Total storage used

Avatar storage

Banner storage

Post image storage

Message attachment storage

Thumbnail storage


Prepare for storage quotas in future versions.


---

11. LOGGING

Centralize application logs.

Log categories:

Application

Authentication

Security

Errors

Moderation

Background jobs


Use structured logging.

Avoid logging secrets or sensitive personal information.


---

12. ERROR MONITORING

Track:

Unhandled exceptions

API failures

Database failures

Upload failures

Background job failures


Critical errors should be easy to identify.

Future integration with monitoring platforms should be straightforward.


---

13. BACKGROUND JOBS

Background tasks may include:

Image cleanup

Thumbnail generation

Password reset email delivery

Notification processing

Audit log maintenance

Storage cleanup


Design jobs to be:

Idempotent

Retryable

Observable



---

14. DEPLOYMENT TARGET

Initial deployment:

Frontend:

Vercel


Backend:

Azure App Service


Database:

Azure Database for PostgreSQL


Storage:

Azure Blob Storage


Cache:

Redis


Future migrations should require minimal code changes.


---

15. ENVIRONMENT CONFIGURATION

Separate configuration by environment:

Development

Testing

Staging (future)

Production


Never hardcode environment-specific values.


---

16. CI/CD

Use GitHub Actions.

Typical workflow:

1. Install dependencies.


2. Lint.


3. Type check.


4. Run tests.


5. Build application.


6. Deploy if checks pass.



Deployments should fail if critical checks fail.


---

17. VERSION CONTROL

Use Git with a clear branching strategy.

Recommended:

main for production-ready code.

develop (optional) for integration.

Feature branches for new work.


Write meaningful commit messages.


---

18. BACKUPS

Implement database backup procedures.

Requirements:

Regular automated backups.

Backup verification.

Recovery documentation.


Prepare for media backup strategies if storage grows significantly.


---

19. DISASTER RECOVERY

Plan for:

Database failure

Storage failure

Server failure

Accidental deletions


Document recovery procedures.

Design systems to minimize downtime.


---

20. SCALABILITY

The architecture should support future scaling through:

Horizontal API scaling.

Database optimization.

Caching.

CDN integration.

Background workers.

Load balancing.


Avoid architecture that depends on a single server instance.


---

21. SECURITY OPERATIONS

Monitor:

Failed login attempts.

Suspicious upload activity.

Excessive API usage.

Rate-limit violations.

Moderator actions.


Support future alerting mechanisms.


---

22. DOCUMENTATION

Maintain operational documentation for:

Deployment

Rollback

Environment setup

Backups

Recovery

Monitoring

Troubleshooting


Documentation should remain current.


---

23. GITHUB COPILOT AGENT OPERATIONS WORKFLOW

When implementing operational features:

1. Verify authorization requirements.


2. Protect sensitive routes.


3. Record audit logs where appropriate.


4. Reuse monitoring utilities.


5. Avoid exposing sensitive information.


6. Review operational impact.


7. Update documentation.


8. Test administrative permissions.


9. Confirm scalability.


10. Wait for approval before implementing unrelated operational features.




---

24. OPERATIONS SUCCESS CRITERIA

Operational features are complete only when they:

Protect sensitive functionality.

Record important actions.

Support platform maintenance.

Scale with application growth.

Minimize operational risk.

Integrate cleanly with the overall architecture.



---

⭐ Additional Instruction for GitHub Copilot Agent

Before implementing any administrative or operational feature, internally evaluate:

1. Is this action properly authorized?


2. Should this action be recorded in the audit log?


3. Can this expose sensitive information?


4. How does this affect system reliability?


5. Can this operation be safely reversed?


6. Does it support future scaling?


7. Is documentation required?


8. Does it align with the OpenLobby operational philosophy?



Only proceed after these questions have been considered.


---

End of Part 9

Next: Part 10 — Final Engineering Standards, Testing Strategy, AI Coding Rules, Project Roadmap, Future Expansion & GitHub Copilot Master Workflow, which will serve as the permanent instruction manual governing how GitHub Copilot Agent plans, writes, reviews, tests, and evolves the OpenLobby codebase throughout its lifecycle.