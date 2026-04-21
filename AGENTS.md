AGENTS.md
Mission

Build quickly, keep code readable, avoid unnecessary complexity, and preserve a clean path toward future ecommerce features.

Engineering Principles
Prefer clarity over cleverness.
Keep components small and single-purpose.
Use TypeScript strictly.
Avoid premature abstractions.
Build page-by-page with shared layout primitives.
Mobile-first styling.
Every new feature must preserve minimal aesthetic.
Folder Intent
src/app/ routes and pages
src/components/ reusable UI pieces
src/lib/ helpers/constants
public/ logos/placeholders/assets
styles/ globals if needed
Coding Rules
Named components
Explicit prop types
No giant files
Keep JSX tidy
Prefer server components unless interactivity needed
Tailwind utilities grouped logically
Use constants for repeated content
Use ESLint and Prettier
Keep components shared in a central components folder
Prefer fast page-by-page implementation over deep abstraction
Done Criteria
Works on mobile + desktop
No console errors
Basic accessibility checks pass
Clean spacing/typography
Content accurate
Avoid
Overengineering state management
Heavy animation
UI clutter
Deep prop drilling when avoidable
Random dependencies
