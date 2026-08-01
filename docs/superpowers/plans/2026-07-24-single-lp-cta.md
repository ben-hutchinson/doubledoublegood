# Single LP Purchase CTA Implementation Plan

> **For Codex:** Execute this plan inline with test-driven development. Keep the live Stripe Payment Link in GitHub repository configuration, not component source.

**Goal:** Reduce the Getdown homepage purchase feature to one clearly contextualised LP purchase action above the artwork carousel, while preserving carousel accessibility, responsive layout, URL validation, and IONOS static deployment.

**Architecture:** Keep Stripe-hosted Checkout as the payment surface and `src/lib/site-content.ts` as the typed content/configuration boundary. Make the offer singular at the type level. Render the note and purchase link as an `ImageCarousel` header so hover and CTA focus continue to pause the same carousel state, while the media panel flexes to fill the remaining desktop column height.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Playwright, GitHub Actions, IONOS Deploy Now, Stripe Payment Links.

---

## Task 1: Specify the single-offer UI and deployment contract

**Files:**

- Modify: `tests/smoke.spec.ts`
- Modify: `tests/stripe-payment-link-fixtures.ts`
- Modify: `playwright.config.ts`
- Modify: `.github/workflows/doubledoublegood-build.yaml`

### Step 1: Write the failing browser assertions

Update the homepage tests to require exactly one `BUY THE LP` link, the singular entry note, and no bundle control. Assert DOM and visual order as note → button → carousel media on desktop and Pixel 7, a minimum 44px full-width target, same-tab navigation, no horizontal overflow, and no trailing desktop whitespace beneath the media panel. Keep the existing two-slide, containment, rotation, hover/focus pause, reduced-motion, and accessibility coverage.

### Step 2: Remove the obsolete test and build fixtures

Reduce `stripePaymentLinkFixtures` to the LP fixture, then delete the bundle-link setup from Playwright and the GitHub Actions build environment.

### Step 3: Confirm the tests fail for the current two-offer implementation

Run:

```bash
npx playwright test tests/smoke.spec.ts --project=chromium --grep "home purchase"
```

Expected: failure because the current page still renders two offers below the carousel and uses plural note copy.

## Task 2: Implement the singular CTA above the carousel

**Files:**

- Modify: `src/lib/site-content.ts`
- Modify: `src/components/home-purchase-feature.tsx`
- Modify: `src/components/image-carousel.tsx`
- Test: `tests/home-purchase-feature.spec.tsx`
- Test: `tests/smoke.spec.ts`

### Step 1: Make the content contract singular

Replace `offers: HomePurchaseOffer[]` with `offer: HomePurchaseOffer`. Keep only `NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK`, preserve `getTrustedStripePaymentLink`, and set the note exactly to:

```text
Purchase the LP to receive free entry for one named person to the Getdown Services gig at the Double Double Good Music Emporium.
```

### Step 2: Add an optional carousel header

Replace the now-unused `footer` prop in `ImageCarouselProps` with `header?: ReactNode`. Render the header immediately before `[data-carousel-media]` inside the carousel’s existing hover/focus boundary. This preserves pause-on-CTA-focus without moving timer state out of the shared component.

### Step 3: Render note, one button, then artwork

Replace `PurchaseActions` with a small `PurchaseCallToAction` that renders the note followed by `PurchaseLink`. Pass it as the carousel header. Keep `PurchaseLink` full width, same-tab, keyboard accessible, and safely disabled when its URL is absent or rejected. Use the existing flex layout so the media panel fills the remaining desktop height and contained posters do not leave a blank strip under the panel.

### Step 4: Run focused tests to green

Run:

```bash
npm test -- tests/home-purchase-feature.spec.tsx tests/security-config.spec.ts
npx playwright test tests/smoke.spec.ts --project=chromium --grep "home purchase"
```

Expected: all focused unit, security, and homepage browser tests pass.

## Task 3: Rewrite the one-link operations documentation

**Files:**

- Modify: `docs/getdown-stripe-sales-runbook.md`
- Modify: `docs/superpowers/specs/2026-07-23-purchase-carousel-layout-design.md`
- Modify: `docs/superpowers/plans/2026-07-23-purchase-carousel-layout.md`

### Step 1: Rewrite the Stripe runbook for one LP link

Document one product, one stock allocation, fixed quantity one, collection/delivery choices, required purchaser fields and terms, immediate-confirmation methods, successful receipt as admission evidence, Payments CSV export, duplicate review, inactive-link handling, and one low-value live purchase/refund check. Record only the client-confirmed sandbox Checkout success; leave receipt, CSV, inactive-link, and live-mode verification unchecked.

### Step 2: Remove stale bundle instructions from historical design records

Mark the prior layout design and plan as superseded by the single-LP design, and remove obsolete LP+CD configuration, label, and mapping instructions so future maintainers cannot accidentally restore the bundle.

### Step 3: Verify cleanup

Run:

```bash
rg -n "LP \+ CD|LP\+CD|LP_CD|lpAndCd|either option|offers" src tests docs .github playwright.config.ts --glob '!docs/superpowers/specs/2026-07-24-single-lp-cta-design.md' --glob '!docs/superpowers/plans/2026-07-24-single-lp-cta.md'
```

Expected: no matches.

## Task 4: Verify locally and prepare the live deployment setting

**Files:**

- Verify: all changed files
- External configuration: GitHub repository variable `NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK`

### Step 1: Run the full quality gate

Run:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

Expected: every command exits successfully, with no serious or critical Axe violations in the browser suite.

### Step 2: Run the site locally with the live public Payment Link

Restart the local development server with:

```bash
NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK=https://buy.stripe.com/aFafZh84H0UgdXd8Rb2oE01 npm run dev
```

Verify at `http://127.0.0.1:3000/` that the singular note and button precede the carousel, the button resolves to the intended same-tab Stripe URL, and the layout remains correct at desktop and Pixel 7 widths. Do not complete an additional payment.

### Step 3: Configure or hand off the GitHub variable

If an authenticated repository-variable capability is available, set `NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK` to `https://buy.stripe.com/aFafZh84H0UgdXd8Rb2oE01`. Otherwise report the exact GitHub Settings path and value as the only remaining deployment action; do not hardcode a fallback URL in source.

### Step 4: Review and commit the implementation

Review `git diff`, confirm no unrelated changes, then commit the completed feature on `codex/getdown-stripe-carousel`. Do not merge to `main` or claim production readiness while the remaining live acceptance checks are unresolved.
