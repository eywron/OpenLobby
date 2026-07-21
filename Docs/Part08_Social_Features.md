OPENLOBBY MASTER AI SPECIFICATION

Part 8 — Social Features, Feed System, Search, Direct Messages, Notifications & User Interaction

Version: V1.0

> Instruction for GitHub Copilot Agent: This document defines how users interact with OpenLobby. All social features must be implemented consistently, efficiently, and with future scalability in mind. Prioritize simplicity in V1 while designing an architecture that supports future enhancements.




---

1. SOCIAL PLATFORM PHILOSOPHY

OpenLobby is built around meaningful conversations and simple content sharing.

The platform should feel:

Fast

Clean

Community-focused

Easy to understand

Predictable


Avoid addictive or manipulative engagement mechanics.


---

2. USER JOURNEY

A typical user flow:

1. Register or log in.


2. Complete a basic profile.


3. Browse the Home Feed.


4. Follow users.


5. Create posts.


6. Like, comment, bookmark, or report posts.


7. Search for users and hashtags.


8. Exchange direct messages.


9. Receive notifications.


10. Manage personal settings.



All flows should be intuitive and require as few steps as practical.


---

3. HOME FEED

V1 feed behavior:

Reverse chronological order (newest first).

Show posts from:

Followed users.

The user's own posts.


If the user follows no one, display recent public posts.


Requirements:

Infinite scrolling.

Pagination at the API level.

Lazy loading.

Skeleton placeholders.

Stable ordering without duplicate posts during scrolling.


Do not implement recommendation algorithms in V1.


---

4. POSTS

A post may contain:

Text only

One or more images

Text + images


Future support for videos should not require redesigning the post model.

Each post includes:

Author

Timestamp

Edited indicator (if edited)

Visibility setting (future-ready)

Interaction counts



---

5. POST EDITING

Users may:

Edit text.

Delete the post.


V1 does not support editing uploaded images after publication.

Editing should preserve edit history internally if desired for moderation, but only the latest version is shown to users.


---

6. POST INTERACTIONS

Users can:

Like

Comment

Reply

Bookmark

Share (copy post link)

Report


Each interaction should be independent and modular.


---

7. COMMENTS

Requirements:

Nested replies.

Unlimited depth (practically constrained by UI).

Edit own comments.

Delete own comments.

Like comments.

Report comments.


Deleted comments should preserve thread structure where possible (e.g., show "Comment deleted" instead of breaking reply chains).


---

8. BOOKMARKS

Bookmarks are private.

Only the owner can view bookmarked posts.

Deleting a post automatically removes related bookmarks.


---

9. FOLLOW SYSTEM

Users may:

Follow

Unfollow


Future support:

Private accounts

Follow requests


V1 assumes all accounts are public.

Prevent duplicate follow relationships.


---

10. USER PROFILES

Each profile includes:

Avatar

Banner

Display name

Username

Bio

Followers

Following

Posts

Media gallery


Future support for profile verification should not require schema redesign.


---

11. SEARCH

Search categories:

Users

Posts

Hashtags


Requirements:

Debounced input.

Pagination.

Fast response.

Case-insensitive matching.

Indexed database queries.


Future support for advanced filters should be possible.


---

12. HASHTAGS

Extract hashtags from post text.

Store relationships for efficient search.

Display hashtag pages showing related posts.

Future support:

Trending hashtags

Hashtag analytics



---

13. NOTIFICATIONS

Generate notifications for:

New follower

Post liked

Comment received

Reply received

Mention (future)


Do not generate duplicate notifications for repeated actions where inappropriate.

Users can:

View notifications.

Mark individual notifications as read.

Mark all as read.



---

14. DIRECT MESSAGES

Support:

One-to-one conversations

Text messages

Image attachments

Read receipts

Typing indicators


Future support:

Group conversations

Voice messages

File sharing


Conversation history should be paginated.


---

15. REAL-TIME COMMUNICATION

V1 architecture should support WebSockets (or an equivalent technology) for:

New messages

Typing indicators

Notification updates


Design the messaging layer so real-time functionality can be expanded without major refactoring.


---

16. MESSAGE MANAGEMENT

Users may:

Send messages.

Delete messages for themselves (soft delete).

Edit messages (optional future feature).


Maintain conversation integrity when messages are deleted.


---

17. REPORTING

Users can report:

Posts

Comments

User accounts


Reports include:

Reporter

Target

Reason

Optional description


Duplicate reports from the same user for the same target should be prevented where appropriate.


---

18. MODERATION FLOW

1. User submits report.


2. Report enters moderation queue.


3. Moderator reviews.


4. Moderator takes action:

Dismiss.

Remove content.

Suspend user.



5. Audit log is created.



Moderation actions must be traceable.


---

19. BLOCKING (FUTURE-READY)

Although full blocking may not be implemented in V1, the architecture should support:

Blocking users.

Hiding messages.

Hiding posts.

Preventing new conversations.



---

20. SHARE LINKS

Sharing in V1 copies a permanent URL to the post.

Future support for sharing to external platforms should not require redesigning the share system.


---

21. RATE LIMITS FOR SOCIAL ACTIONS

Protect against abuse by limiting:

Likes per minute.

Comments per minute.

Messages per minute.

Follow actions per minute.

Report submissions.


Limits should be configurable.


---

22. FEED PERFORMANCE

The feed must:

Avoid N+1 database queries.

Batch related data efficiently.

Cache when appropriate.

Use cursor-based pagination where practical.


Optimize for both read and write performance.


---

23. PRIVACY

Users should control:

Profile visibility (future)

Notification preferences

Saved posts

Account deletion


Private user data must never be exposed through public APIs.


---

24. ANALYTICS (INTERNAL)

Collect aggregate metrics such as:

Total posts

Total users

Daily active users

New registrations

Report volume


Do not collect unnecessary personal information.


---

25. GITHUB COPILOT AGENT SOCIAL FEATURE WORKFLOW

When implementing a social feature:

1. Review existing feature modules.


2. Reuse shared services.


3. Validate permissions.


4. Respect privacy settings.


5. Ensure database efficiency.


6. Avoid duplicate notifications or relationships.


7. Review rate limiting.


8. Review scalability.


9. Update documentation if behavior changes.


10. Wait for approval before implementing unrelated social features.




---

26. SOCIAL FEATURE SUCCESS CRITERIA

A social feature is complete only when it:

Follows the OpenLobby interaction model.

Scales efficiently.

Respects user privacy.

Prevents abuse.

Maintains data integrity.

Integrates cleanly with notifications and moderation.

Remains easy to extend for future features.



---

⭐ Additional Instruction for GitHub Copilot Agent

Before implementing any social feature, internally evaluate:

1. Does this respect user privacy?


2. Can this action be abused? If so, how is it limited?


3. Are notifications generated correctly?


4. Are duplicate actions prevented?


5. Will database queries remain efficient at scale?


6. Does this support future features without breaking V1?


7. Is the user experience simple and intuitive?


8. Does this align with the OpenLobby philosophy of a clean, community-focused platform?



Only proceed after these questions have been considered.


---

End of Part 8

Next: Part 9 — Administration, Moderation Dashboard, Analytics, Monitoring, Deployment, CI/CD, Production Readiness & Operations, which will define how administrators manage the platform, how the application is monitored and deployed, and the operational standards for maintaining OpenLobby in production.