# Getdown Final Artwork and Heading Design

## Objective

Complete the Getdown purchase panel by replacing the temporary Santù slide with the supplied Getdown artwork, tightening the admission note, and adding a section title consistent with the homepage’s existing headings.

## Content and Artwork

- Add the supplied 1170 × 1143 JPEG as `public/assets/home/getdown-services-album-art.jpeg`.
- Replace the Santù slide with this image and remove the now-unused Santù asset.
- Use the alt text: “Getdown Services album artwork featuring a hand-drawn figure on layered notepaper”.
- Add the panel heading `GETDOWN SERVICES IN-STORE` through the typed `homePurchaseFeature` content.
- Replace the short note with these three client-approved paragraphs:
  1. “Join us as we celebrate the release of 'Massive Champion', the brand-new album from Getdown Services.”
  2. “The band will be visiting the shop for a special appearance to mark the launch and we're really looking forward to welcoming them.”
  3. “Entry is free so long as you purchase the LP below.”
- Store the paragraphs as a typed string array and render each as its own `<p>` element. Do not combine them or insert manual `<br>` elements.

## Layout

Render the content inside the carousel header in this order:

1. `GETDOWN SERVICES IN-STORE` heading.
2. Three client-approved introductory paragraphs in the supplied order.
3. Full-width `BUY THE LP` button.
4. Carousel artwork panel.

The heading uses the existing `heading-section text-2xl font-black text-stone-950 uppercase` style shared by the “New stock” panel. Existing spacing, same-tab Stripe link, disabled state, five-second rotation, contained image fit, crossfade, hover/focus pause, reduced-motion behavior, responsive sizing, and desktop column fill remain unchanged.

## Verification

- Update homepage tests first to require the exact heading, all three paragraphs, new image path, alt text, and DOM order.
- Confirm the old Santù image path and alt text no longer appear in source or rendered output.
- Retain the existing desktop, Pixel 7, URL security, carousel interaction, accessibility, typecheck, lint, formatting, full Playwright, and static-build coverage.
- Keep the local server configured with the supplied live public Stripe Payment Link for client QA; do not complete a payment during site testing.
