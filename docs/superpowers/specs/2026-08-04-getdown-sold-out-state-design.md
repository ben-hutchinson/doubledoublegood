# Getdown Sold-Out State Design

## Objective

Replace the completed Getdown Services purchase call to action with an unambiguous sold-out state while retaining the event title and rotating artwork. Customers must no longer see purchase copy, a disabled purchase control, or any suggestion that more LPs can be bought through the website.

## Content and Layout

- Keep the `GETDOWN SERVICES IN-STORE` heading above the carousel using its existing homepage heading style.
- Remove all three promotional/admission paragraphs and the `BUY THE LP` control.
- Keep both existing Getdown images, their alt text, contained image fit, five-second rotation, 700ms crossfade, hover/focus pause, and reduced-motion behaviour.
- Add a persistent horizontal banner centred vertically over the carousel media.
- The banner reads `SOLD OUT` in large white uppercase text on the existing accent red `#ba2b20`.
- The banner spans the visible width of the media panel, remains legible on mobile and desktop, and uses a subtle border or shadow to separate it from both artworks.
- The banner is informational rather than interactive and must not capture pointer events.

## Component and Content Changes

- Continue using the shared `ImageCarousel` and its existing `overlay` prop. Do not change shared carousel timing or behaviour and do not affect the About or Sell carousels.
- Simplify `HomePurchaseFeature` so its header contains only the retained heading and its carousel overlay contains the sold-out banner.
- Replace the purchase-specific `description` and `offer` fields in `homePurchaseFeature` with a typed sold-out label.
- Remove the now-unused `PurchaseLink`, purchase CTA component, and homepage Payment Link environment reads.
- Remove the obsolete `NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK` and `ALLOW_STRIPE_TEST_PAYMENT_LINKS` wiring from the IONOS build and Playwright configuration.
- Retain the reusable Stripe URL validation helpers and their focused security tests for potential future ecommerce work.
- Retain the Stripe-related privacy, fulfilment, and historical event-operation documentation because completed customer transactions still exist.

## Accessibility

- Expose `SOLD OUT` as ordinary visible text once in the carousel region.
- Keep inactive carousel slides hidden from assistive technology through the existing carousel implementation.
- Keep the banner contrast at or above WCAG AA and avoid relying on colour alone; the explicit text communicates the state.
- Do not add a focusable element or announce the banner repeatedly as slides rotate.

## Verification

- Add or update tests first so they fail against the current purchase state.
- Verify the homepage displays the retained heading and visible `SOLD OUT` text.
- Verify `BUY THE LP` and the three purchase paragraphs are absent.
- Verify no purchase link or disabled purchase element remains.
- Verify the sold-out banner stays visible while the active slide changes.
- Verify both images remain contained and the carousel continues rotating at five seconds.
- Verify the banner does not create horizontal overflow or illegible wrapping at Pixel 7 dimensions.
- Confirm the About and Sell carousels retain their existing behaviour.
- Run typecheck, lint, formatting, the full Playwright suite, the production audit, and the static production build.

## Non-Goals

- Do not deactivate, edit, or otherwise manage the Stripe Payment Link from website code.
- Do not add live inventory, a waitlist, a replacement product, or additional event copy.
- Do not remove historical Stripe policy wording needed for customers who already purchased.
