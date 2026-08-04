# Empty Shop Ticker Design

## Goal

Keep the existing black shop-notice ticker bar and red `SHOP NOTICE` badge while removing the obsolete scrolling closure message everywhere, including from assistive technology.

## Design

- Keep `GigTicker` mounted whenever its feature flag is enabled.
- Represent the absence of current notices with an empty `events` array rather than an empty-string placeholder.
- Render the scrolling viewport, animation track, and screen-reader list only when at least one non-empty notice exists.
- Preserve the existing feature flag so setting `NEXT_PUBLIC_SHOW_GIG_TICKER=false` still removes the complete ticker.
- Do not change the ticker colours, height, spacing, label, or responsive layout.

## Testing

- Verify the ticker region and `SHOP NOTICE` badge remain visible on the homepage.
- Verify the obsolete closure message and scrolling track are absent.
- Verify an enabled ticker remains visible with no events.
- Verify the existing feature flag still hides the ticker when explicitly disabled.
- Run the focused regression test, full test suite, typecheck, lint, production build, and rendered desktop/mobile checks.
