# Client Site Updates Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan task by task. Each task has a dedicated Luna 6 Extra High Developer and Tester pair.

**Goal:** Apply the client's six requested content and layout updates on a fresh feature branch.

**Architecture:** Keep the existing Next.js components and shared content constants. Preserve the Community page source outside the routing tree, removing its live route, navigation item, and sitemap entry. Use the existing responsive styling and ticker.

**Tech Stack:** Next.js, React, strict TypeScript, Tailwind CSS, Playwright, axe.

**Spec:** The client's task list in this chat (2026-10-23).

## Global Constraints

- Preserve the minimal aesthetic, mobile and desktop usability, and existing contact details.
- No new dependencies. Keep changes focused and components readable.
- Exact ticker copy: IN-STORE GIG - TIRED - SATURDAY 24TH OCTOBER - 4PM - FREE ENTRY
- Community code is retained but its public URL must return 404.
- Footer has two lists of four live links; add Home to the seven remaining navigation and policy links.
- All pairs use gpt-6-luna with xhigh reasoning. Developers change their assigned production files; Testers independently inspect and verify, updating only their assigned tests.

## Review Focus

- Direct navigation to /community and /community/ must return 404; sitemap and all navigation omit it.
- Footer has no mailing-list text, button, form, iframe, or loader on any page.
- Eight footer links form two equal lists of four, using the former mailing-list space at desktop sizes.
- Five primary navigation links are evenly spaced and legible without overflow on mobile, tablet, and desktop.
- Ticker exposes one accessible message, duplicated only for visual scrolling, and works with reduced motion.

## Dependencies and Scheduling

Task 1 -> Task 2; Task 4 -> Task 5; Task 4 -> Task 2 (final eight-link set).
Tasks 3 and 6 are independent. Work sharing site-content.ts or smoke.spec.ts is serialized. Testers receive developer completion before executing their final verification. At most three subagents run simultaneously.

### Task 1: Remove the mailing-list footer block

- [x] Developer: Remove NewsletterForm import and entire newsletter section from src/components/site-footer.tsx; preserve contact details, opening times, Explore, copyright, and back-to-top.
- [x] Tester: Replace obsolete newsletter expectation in tests/smoke.spec.ts with absence checks, including Beehiiv script and iframe. Run focused desktop/mobile check and report evidence.

### Task 2: Reflow footer links into two lists of four

Depends on Tasks 1 and 4.

- [x] Developer: Update src/components/site-footer.tsx with Home, five active navigation links, and two policy links in two semantic lists of four. Use equal desktop columns spanning the former Explore and newsletter space, retaining responsive stacking.
- [x] Tester: Add tests/client-footer.spec.ts verifying exact eight-link set, four links per list, equal column widths and spacing at desktop, mobile overflow and legibility.

### Task 3: Remove the owner section and portrait from About

- [x] Developer: Remove owner section and unused Image import from src/app/about/page.tsx; retain shop story and carousel.
- [x] Tester: Update owner-specific assertions in tests/smoke.spec.ts to verify absence of heading and portrait while the shop content and carousel remain visible.

### Task 4: Hide Community while preserving its code

- [x] Developer: Move src/app/community/page.tsx to src/components/community-page.tsx, remove Community from navigationItems and siteRoutes in src/lib/site-content.ts. Retain communityContent and explain restoration in a brief source comment. No live route remains.
- [x] Tester: Update obsolete Community and public route expectations in tests/smoke.spec.ts; verify both URL forms return 404 and sitemap/navigation omit Community. Verify source remains preserved.

### Task 5: Redistribute primary navigation

Depends on Task 4.

- [x] Developer: Update src/components/primary-nav.tsx so the five visible items occupy equal columns on desktop with legible text. Preserve mobile stacking, keyboard focus, active-page indication, and responsive tablet layout.
- [x] Tester: Add tests/client-navigation.spec.ts covering five-link set, equal desktop geometry, tablet/mobile overflow and touch targets, keyboard focus and active state.

### Task 6: Set the new ticker message

- [x] Developer: Update gigTickerContent.events in src/lib/site-content.ts to the exact requested copy, retaining existing feature flag and reduced-motion behavior.
- [x] Tester: Replace obsolete empty ticker test in tests/smoke.spec.ts. Verify exact literal copy, one accessible announcement, two visual duplicates, and reduced-motion behavior.
- [x] Review follow-up: Ensure reduced-motion ticker text wraps fully on narrow screens in src/app/globals.css; test text bounds within its viewport to catch clipping.

### Final integration review

- [x] Primary agent reviews all changes after all six pairs report completion.
- [x] Run lint, typecheck, formatting checks, production build, and complete Playwright desktop/mobile suite including accessibility.
- [x] Inspect rendered desktop/mobile pages and console errors; correct any integration issues and repeat affected checks.
- [x] Report branch, results, and material limitations to the user. No deployment requested.

## Completion evidence

All six tasks used a dedicated gpt-6-luna xhigh Developer/Tester pair. The primary agent reviewed the combined changes and caught reduced-motion ticker clipping; the pair added a failing width regression and fixed it with one CSS rule.

- Production build and TypeScript check passed. Community has no generated page; preserved source is in src/components/community-page.tsx.
- Final full production Playwright run: 90 passed, 2 expected viewport-specific skips, using one worker. Earlier parallel runs encountered carousel timer interference; isolated carousel checks and the final full run passed without changing carousel behavior.
- Accessibility scans passed on all public routes. Visual and interaction checks passed at widths 320, 390, 768, 1024, and 1440; no app console errors or horizontal overflow.
- All-source ESLint passed with existing nested .worktrees and .superpowers scratch directories excluded. Changed-file Prettier and whitespace checks passed.
- Home is the eighth footer link. The work stays on its feature branch; no deployment was requested.
