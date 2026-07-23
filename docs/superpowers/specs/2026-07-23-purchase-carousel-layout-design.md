# Purchase Carousel Layout Adjustment

## Objective

Simplify the Getdown homepage purchase feature so the artwork fills the carousel panel and the purchase actions follow it in a clear document flow.

## Layout

- Remove the visible carousel play/pause control.
- Remove the CTA overlay and its dark bottom scrim from the artwork panel.
- Let both poster images use the full carousel panel while retaining `object-contain`, the existing neutral background, five-second rotation, crossfade, hover pause, focus pause, and reduced-motion behavior.
- On desktop, let the image panel grow to consume the available column height so the note finishes flush with the neighboring content rather than leaving trailing whitespace.
- Place `BUY THE LP` and `BUY THE LP + CD` immediately beneath the panel.
- Stack the buttons vertically on mobile and display them as two equal columns from the small desktop breakpoint upward.
- Place the existing free-entry note beneath the buttons.
- Remove the Delivery & Returns and Privacy links from this homepage feature only; retain the policy pages and site navigation links elsewhere.

## Component Changes

`HomePurchaseFeature` will render the carousel, purchase-button grid, and entry note as three consecutive elements. It will stop passing overlay content, image-bottom padding, and `showPlaybackControl` to `ImageCarousel`. The shared carousel API remains available for other pages and future uses.

## Accessibility and Failure States

- Preserve the existing minimum 44px button height, keyboard focus treatment, same-tab destinations, and unavailable non-link state.
- Removing the visible playback control does not enable autoplay for reduced-motion users.
- Hover and keyboard focus continue to pause rotation.
- The note remains visible and readable below both buttons at all supported viewport sizes.

## Verification

- Update homepage tests to confirm the carousel has no playback control or purchase overlay.
- Confirm CTAs appear after the carousel media and before the free-entry note.
- Confirm buttons stack on Pixel 7 and remain side-by-side on desktop.
- Retain rotation, reduced-motion, hover/focus pause, URL safety, minimum-target, overflow, and accessibility coverage.
- Run typecheck, lint, formatting, focused Playwright tests, the full test suite, and the production build.
