# Purchase Carousel Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Getdown purchase buttons below the full poster panel, stack them on mobile, retain a two-column desktop layout, remove the playback control, and remove the homepage policy links.

**Architecture:** Extend `ImageCarousel` with an optional footer slot that remains inside its hover/focus pause boundary but renders after the media panel. Add a switch for its existing decorative bottom scrim so the Getdown artwork can use the complete panel without changing the About or Sell carousels. `HomePurchaseFeature` supplies the CTA grid through that footer and renders only the free-entry note after the carousel.

**Tech Stack:** Next.js 16, React 19, strict TypeScript, Tailwind CSS, Playwright, axe-core

## Global Constraints

- Retain `object-contain`, the neutral image background, five-second rotation, 700ms crossfade, hover pause, focus pause, and reduced-motion behavior.
- Grow the desktop image panel to consume remaining column height; do not leave whitespace between the buttons and note or below the note.
- Stack the buttons vertically on mobile and render two equal columns from the `sm` breakpoint upward.
- Preserve same-tab Stripe navigation, minimum 44px targets, keyboard focus styles, and safe unavailable states.
- Remove only the homepage feature's policy links; do not remove the policy pages or navigation links elsewhere.
- Do not change the About or Sell carousel appearance or behavior.

---

### Task 1: Render Purchase Actions Below Full Carousel Media

**Files:**

- Modify: `tests/smoke.spec.ts:242-388`
- Modify: `src/components/image-carousel.tsx:10-151`
- Modify: `src/components/home-purchase-feature.tsx:1-85`
- Verify: `tests/home-purchase-feature.spec.tsx`

**Interfaces:**

- Consumes: `homePurchaseFeature.offers`, `homePurchaseFeature.note`, `ImageCarouselProps.overlay`, and the existing carousel pause state.
- Produces: `ImageCarouselProps.footer?: ReactNode`, `ImageCarouselProps.showBottomScrim?: boolean`, and a purchase-action container marked with `data-purchase-actions` for focused layout assertions.

- [x] **Step 1: Write failing homepage layout and interaction assertions**

Update the main purchase-carousel smoke test to scope all homepage-specific content to the event feature and require the new structure:

```ts
const purchaseFeature = page.getByLabel('Getdown Services event purchase');
const carousel = page.getByLabel(homePurchaseFeature.ariaLabel);
const media = carousel.locator('[data-carousel-media]');
const purchaseActions = carousel.locator('[data-purchase-actions]');

await expect(carousel.getByRole('button')).toHaveCount(0);
await expect(media.locator(':scope > div')).toHaveCount(0);
await expect(images.first()).toHaveCSS('padding-bottom', '0px');
await expect(
  carousel.locator('[data-carousel-media] + [data-purchase-actions]'),
).toBeVisible();
await expect(
  purchaseFeature.getByRole('link', { name: 'Delivery & Returns' }),
).toHaveCount(0);
await expect(
  purchaseFeature.getByRole('link', { name: 'Privacy' }),
).toHaveCount(0);
```

Replace the playback-control part of the pause test with hover and CTA-focus coverage only, and rename it accordingly:

```ts
test('home purchase carousel pauses on hover and CTA focus', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'chromium',
    'Desktop pointer timing coverage is enough.',
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const carousel = page.getByLabel(homePurchaseFeature.ariaLabel);
  const secondImage = carousel.locator('img').nth(1);
  const lpLink = carousel.getByRole('link', {
    name: 'BUY THE LP',
    exact: true,
  });

  await carousel.hover();
  await page.waitForTimeout(homePurchaseFeature.rotationIntervalMs + 150);
  await expect(secondImage).toHaveAttribute('aria-hidden', 'true');

  await lpLink.focus();
  await page.mouse.move(1, 1);
  await page.waitForTimeout(homePurchaseFeature.rotationIntervalMs + 150);
  await expect(secondImage).toHaveAttribute('aria-hidden', 'true');
  await expect(carousel.getByRole('button')).toHaveCount(0);
});
```

Add responsive geometry assertions. Desktop requires matching button tops; Pixel 7 requires the second button to begin below the first:

```ts
const ctaBoxes = await purchaseActions
  .getByRole('link')
  .evaluateAll((links) =>
    links.map((link) => link.getBoundingClientRect().toJSON()),
  );

expect(ctaBoxes[0]?.top).toBe(ctaBoxes[1]?.top);
// Mobile test:
expect(ctaBoxes[1]?.top).toBeGreaterThanOrEqual(ctaBoxes[0]?.bottom ?? 0);
```

- [x] **Step 2: Run the focused tests and verify the old layout fails**

Run:

```bash
npx playwright test tests/smoke.spec.ts --grep "home purchase" --project=chromium --project=mobile
```

Expected: FAIL because the playback button, image padding, scrim, overlaid two-column CTA grid, and policy links still exist.

- [x] **Step 3: Add the carousel footer and scrim controls**

Extend `ImageCarouselProps` and the component defaults in `src/components/image-carousel.tsx`:

```tsx
type ImageCarouselProps = {
  footer?: ReactNode;
  showBottomScrim?: boolean;
};

export function ImageCarousel({
  footer,
  showBottomScrim = true,
}: ImageCarouselProps) {
```

Conditionally render the existing scrim, then render the footer directly after the media panel so focus and hover continue bubbling through the carousel section:

```tsx
{showBottomScrim ? (
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
) : null}
{overlay}
</div>
{footer}

{showCounter ? (
  <div className="flex flex-wrap items-center gap-3">
    <p aria-live="polite" className="text-sm font-semibold text-stone-500">
      {safeIndex + 1} / {items.length}
    </p>
  </div>
) : null}
```

- [x] **Step 4: Move the CTAs into the footer and simplify the homepage feature**

Remove the unused `next/link` import and replace `PurchaseOverlay` with:

```tsx
function PurchaseActions() {
  return (
    <div
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3"
      data-purchase-actions
    >
      {homePurchaseFeature.offers.map((offer) => (
        <PurchaseLink key={offer.label} offer={offer} />
      ))}
    </div>
  );
}
```

Configure the carousel without image padding, overlay, or playback control, and render only the entry note below it:

```tsx
<ImageCarousel
  ariaLabel={homePurchaseFeature.ariaLabel}
  className="xl:flex-1"
  contentClassName="space-y-3 xl:flex xl:h-full xl:flex-col"
  footer={<PurchaseActions />}
  imageClassName="h-[38rem] sm:h-[48rem] xl:h-auto xl:min-h-[48rem] xl:flex-1"
  imageFit="contain"
  imageSizes="(min-width: 1280px) 44vw, 100vw"
  items={homePurchaseFeature.slides}
  preloadAllImages
  rotationIntervalMs={homePurchaseFeature.rotationIntervalMs}
  showBottomScrim={false}
  showCounter={false}
  showTopBorder={false}
  zoomOnHover={false}
/>

<p className="text-sm leading-6 text-stone-700">
  {homePurchaseFeature.note}
</p>
```

- [x] **Step 5: Run focused tests and confirm the new behavior passes**

Run:

```bash
npx playwright test tests/home-purchase-feature.spec.tsx tests/smoke.spec.ts --grep "home purchase|Stripe configuration" --project=chromium --project=mobile
```

Expected: all selected tests pass, with only the existing project-specific timing skips.

- [x] **Step 6: Verify the rendered local page**

At `http://127.0.0.1:3000/`, verify desktop and Pixel 7 layouts: full poster panel, no playback button or scrim, side-by-side desktop CTAs, stacked mobile CTAs, note below, no feature-level policy links, and no console errors.

- [x] **Step 7: Run the complete verification suite**

Run:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test -- --reporter=dot
npm run build
```

Expected: every command exits 0; Playwright retains only its intentional platform-specific skips.

- [ ] **Step 8: Commit and push the verified adjustment**

```bash
git add src/components/image-carousel.tsx src/components/home-purchase-feature.tsx tests/smoke.spec.ts docs/superpowers/plans/2026-07-23-purchase-carousel-layout.md
git commit -m "Refine purchase carousel layout"
git push
```

Expected: the feature branch updates without merging to `main`; IONOS staging remains subject to the existing branch-enablement requirement.
