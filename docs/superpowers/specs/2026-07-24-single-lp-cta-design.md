# Single LP Purchase CTA Design

## Objective

Simplify the Getdown homepage purchase feature to one product and make the admission context clear before the purchase action.

## Content and Layout

- Remove the LP + CD purchase option completely.
- Change the entry note to singular wording: “Purchase the LP to receive free entry for one named person to the Getdown Services gig at the Double Double Good Music Emporium.”
- Render the note first, followed by one full-width `BUY THE LP` button.
- Place that CTA block immediately above the carousel artwork on mobile and desktop.
- Preserve the carousel’s full-height desktop behavior, contained artwork, five-second rotation, hover/focus pause, reduced-motion handling, and 700ms crossfade.

## Configuration Cleanup

- Retain `NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK` as the only purchase-link variable.
- Configure that GitHub repository variable with the client-provided live Payment Link: `https://buy.stripe.com/aFafZh84H0UgdXd8Rb2oE01`.
- Do not hardcode the live URL in the React component; the static IONOS build continues to receive it through GitHub Actions.
- Remove `NEXT_PUBLIC_STRIPE_LP_CD_PAYMENT_LINK` from application content, GitHub Actions, Playwright fixtures, and documentation.
- Continue accepting only exact HTTPS `buy.stripe.com` URLs.
- Continue allowing `/test_...` Payment Links only for local development and non-default staging branches.
- Preserve the safe unavailable non-link state when the LP URL is missing or rejected.

## Operations Documentation

- Update the Stripe runbook so it describes one LP Payment Link, one product, one stock limit, and one live purchase/refund check.
- Retain the named-purchaser admission rule, successful receipt requirement, Payments CSV export, duplicate review, delivery/collection setup, and production blockers.
- Record the client’s successful manual sandbox checkout as evidence that the hosted checkout flow works, while leaving receipt, CSV, inactive-link, and live-mode checks outstanding until separately completed.
- Treat the supplied URL as a public checkout destination, not a secret key; no Stripe API key is required or added.

## Accessibility and Verification

- Keep the purchase target at least 44px high, full width, keyboard accessible, and same-tab.
- Confirm the note precedes the button and the CTA block precedes the carousel in DOM and visual order.
- Confirm no LP + CD label, link, environment variable, or documentation instruction remains.
- Update desktop and Pixel 7 tests for the one-button layout.
- Retain URL security, reduced-motion, rotation, pause, overflow, axe, typecheck, lint, formatting, full Playwright, and production-build coverage.
