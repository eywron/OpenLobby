OPENLOBBY MASTER AI SPECIFICATION

Part 2 — UI/UX Design System, User Experience & Frontend Standards

Version: V1.0

> Instruction for GitHub Copilot Agent: This document defines the visual identity, user experience, layout rules, and frontend implementation standards for OpenLobby. Treat these as mandatory requirements. Do not introduce design patterns that conflict with this specification unless explicitly approved.




---

1. UI DESIGN PHILOSOPHY

OpenLobby is not designed to imitate Facebook, Instagram, or X.

Instead, it follows these principles:

Minimalist

Calm

Readable

Fast

Functional

Content-first


The interface should disappear into the background so users focus on posts and conversations.


---

2. DESIGN INSPIRATION

The design language should be inspired by:

E-Ink readers

Notion

GitHub

Linear

Minimal modern web applications


Do not copy their designs directly. Use them only as inspiration for spacing, typography, and simplicity.


---

3. COLOR SYSTEM

The default interface is monochrome.

Primary colors:

Black

White

Gray


Accent colors should be used sparingly and only when necessary for accessibility or status indicators (e.g., success, warning, error).

Uploaded images retain their original colors.

Avoid gradients unless they serve a clear functional purpose.


---

4. TYPOGRAPHY

Typography should prioritize readability.

Rules:

Clear hierarchy for headings and body text.

Comfortable line spacing.

Consistent font sizes.

Avoid decorative fonts.

Ensure sufficient contrast for accessibility.



---

5. SPACING SYSTEM

Use a consistent spacing scale throughout the application.

Every page should feel uncluttered.

Avoid cramming components together.

Whitespace is a design element.


---

6. ICONOGRAPHY

Use a single icon library consistently throughout the project.

Icons should be:

Simple

Outlined

Easily recognizable

Consistent in size and stroke weight


Do not mix icon styles.


---

7. RESPONSIVE DESIGN

Support:

Mobile

Tablet

Laptop

Desktop


Design mobile-first.

The application should remain usable on small screens without horizontal scrolling.


---

8. ACCESSIBILITY

Every interface must support:

Keyboard navigation

Screen readers

Semantic HTML

ARIA labels where appropriate

Visible focus states

Sufficient contrast ratios


Accessibility is a core requirement, not an optional enhancement.


---

9. GLOBAL LAYOUT

Every page should follow a consistent layout structure.

Typical layout:

--------------------------------------
Top Navigation
--------------------------------------

Left Sidebar | Main Content | Right Sidebar

--------------------------------------
Footer (optional)
--------------------------------------

On mobile:

Sidebars collapse into drawers or bottom navigation as appropriate.



---

10. TOP NAVIGATION

Contains:

OpenLobby logo

Search

Notifications

Messages

Profile menu


Requirements:

Sticky while scrolling

Lightweight

Responsive



---

11. LEFT SIDEBAR

Primary navigation:

Home

Explore

Search

Messages

Notifications

Bookmarks

Profile

Settings


The active page should be clearly indicated.


---

12. RIGHT SIDEBAR

May include:

Trending hashtags

Suggested users

Community announcements


Hide on smaller screens if necessary.


---

13. HOME FEED

Requirements:

Infinite scrolling

Fast loading

Smooth scrolling

Optimized rendering

Skeleton loaders during data fetching


Posts should appear in chronological order for V1.


---

14. POST CARD

Each post displays:

User avatar

Display name

Username

Timestamp

Post content

Images (if present)

Like count

Comment count

Bookmark button

Share button

More options menu


Keep the layout clean and uncluttered.


---

15. CREATE POST

Features:

Text input

Image upload

Character counter (if a limit is introduced)

Preview uploaded images

Remove images before posting

Submit button

Cancel button


Prevent duplicate submissions.


---

16. PROFILE PAGE

Displays:

Banner image

Avatar

Display name

Username

Bio

Follower count

Following count

Posts

Media

Saved posts (private)

Edit profile button (owner only)



---

17. SEARCH PAGE

Support searching:

Users

Posts

Hashtags


Requirements:

Instant feedback

Debounced requests

Pagination or infinite loading

Clear empty states



---

18. NOTIFICATIONS PAGE

Group notifications by date.

Each notification should indicate:

Type

Related user

Related content

Timestamp

Read/unread state


Allow users to mark all as read.


---

19. MESSAGES PAGE

Layout:

Left:

Conversation list


Right:

Active conversation


Support:

Real-time updates

Typing indicator

Read receipts

Image attachments

Infinite message history



---

20. SETTINGS PAGE

Sections:

Account

Profile

Password

Privacy

Notifications

Blocked users

Delete account


Group settings logically.


---

21. EMPTY STATES

Every page should include meaningful empty states.

Examples:

No posts yet

No followers

No search results

No notifications

No conversations


Include helpful guidance for users.


---

22. LOADING STATES

Use skeleton loaders instead of generic spinners where appropriate.

Loading indicators should match the shape of the final content.


---

23. ERROR STATES

Display clear, user-friendly error messages.

Avoid exposing technical details.

Provide recovery actions when possible.


---

24. MODALS

Use modal dialogs for:

Delete confirmations

Report content

Edit profile

Image preview


Prevent accidental destructive actions.


---

25. TOAST NOTIFICATIONS

Use unobtrusive toast messages for:

Success

Error

Information


Keep messages concise.


---

26. IMAGE DISPLAY

Requirements:

Lazy loading

Responsive sizing

Aspect ratio preservation

Click to enlarge

Optimized delivery


Do not stretch or distort images.


---

27. ANIMATIONS

Animations should be subtle.

Use animations only to improve usability.

Examples:

Fade

Slide

Scale


Avoid excessive motion.


---

28. REUSABLE COMPONENTS

Create reusable components for:

Button

Input

Textarea

Avatar

Card

Modal

Dropdown

Tooltip

Badge

Toast

Tabs

Pagination

Skeleton Loader


Do not duplicate component implementations.


---

29. FRONTEND ARCHITECTURE

Organize by feature rather than file type where practical.

Example structure:

app/
components/
features/
hooks/
lib/
services/
types/
utils/
styles/

Keep components focused and reusable.


---

30. GITHUB COPILOT AGENT FRONTEND WORKFLOW

When implementing a new UI feature:

1. Check for existing reusable components.


2. Reuse before creating new ones.


3. Maintain consistent spacing and typography.


4. Ensure responsiveness.


5. Verify accessibility.


6. Optimize rendering performance.


7. Test keyboard navigation.


8. Confirm visual consistency with the design system.


9. Avoid unnecessary dependencies.


10. Stop after completing the requested feature and wait for approval before starting the next major UI task.




---

31. UI SUCCESS CRITERIA

A UI feature is complete only if it is:

Responsive

Accessible

Consistent with the monochrome design system

Easy to understand

Fast to render

Reusable

Maintainable

Free of unnecessary visual clutter



---

End of Part 2

Next: Part 3 — Authentication & Security Architecture, which will specify your custom authentication system (PostgreSQL + Prisma + JWT + Argon2), session management, refresh tokens, password reset flow, future-ready email verification architecture, and comprehensive security practices.