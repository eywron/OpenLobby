# OPENLOBBY MASTER AI SPECIFICATION

## Part 2 — UI/UX Design System & Frontend Standards

Version: V2.0

### 1. UI DESIGN PHILOSOPHY

OpenLobby is not designed to imitate Facebook, Instagram, or X. Instead, it follows these principles:
Minimalist, Calm, Readable, Fast, Functional, Content-first.
The interface should disappear into the background so users focus on posts and conversations.

### 2. DESIGN INSPIRATION

E-Ink readers, Notion, GitHub, Linear, Minimal modern web applications.

### 3. COLOR SYSTEM

The default interface is monochrome. Primary colors: Black, White, Gray.
Accent colors should be used sparingly and only when necessary for accessibility or status indicators.
Uploaded images retain their original colors.

### 4. TYPOGRAPHY

Typography prioritizes readability. Clear hierarchy for headings and body text. Comfortable line spacing. Consistent font sizes.

### 5. SPACING SYSTEM

Use a consistent spacing scale throughout the application. Every page should feel uncluttered.

### 6. FRONTEND ARCHITECTURE

- **Framework**: Next.js 15
- **Routing**: App Router
- **Styles**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: TanStack React Query

Organize by feature rather than file type where practical. Keep components focused and reusable.

### 7. GITHUB COPILOT AGENT FRONTEND WORKFLOW

1. Check for existing reusable components.
2. Reuse before creating new ones.
3. Maintain consistent spacing and typography.
4. Ensure responsiveness.
5. Verify accessibility.
6. Optimize rendering performance.
