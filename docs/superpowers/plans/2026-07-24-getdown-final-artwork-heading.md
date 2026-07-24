# Getdown Final Artwork and Heading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the temporary carousel artwork and add the approved Getdown title and admission copy above the existing LP purchase button.

**Architecture:** Keep presentation content in the typed `homePurchaseFeature` object and reuse the existing carousel header and heading utility classes. The component gains only a content-driven heading; carousel timing, layout, Stripe configuration, and interaction state remain unchanged.

**Tech Stack:** Next.js App Router, React, strict TypeScript, Tailwind CSS, Next Image, Playwright.

## Global Constraints

- Render in this order: `GETDOWN SERVICES INSTORE` → exact revised note → full-width `BUY THE LP` → carousel artwork.
- Store the supplied 1170 × 1143 JPEG at `public/assets/home/getdown-services-album-art.jpeg` and remove the unused Santù asset.
- Use alt text: `Getdown Services album artwork featuring a hand-drawn figure on layered notepaper`.
- Preserve `object-contain`, five-second rotation, 700ms crossfade, hover/focus pause, reduced-motion handling, same-tab Stripe navigation, safe unavailable state, responsive sizing, and desktop column fill.
- Keep the local server configured with `NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK=https://buy.stripe.com/aFafZh84H0UgdXd8Rb2oE01`.

---

### Task 1: Finalise the Getdown Purchase Panel

**Files:**

- Add: `public/assets/home/getdown-services-album-art.jpeg`
- Delete: `public/assets/home/santu-colour.jpg`
- Modify: `src/lib/site-content.ts`
- Modify: `src/components/home-purchase-feature.tsx`
- Test: `tests/smoke.spec.ts`

**Interfaces:**

- Consumes: `HomePurchaseFeature`, `homePurchaseFeature`, `PurchaseCallToAction`, and the existing `ImageCarousel` header slot.
- Produces: `HomePurchaseFeature.heading: string`, the final second slide, and the approved heading/note/button/media DOM order.

- [ ] **Step 1: Write the failing homepage content test**

Extend the existing homepage purchase-carousel test with the exact content and final slide assertions:

```ts
await expect(
  purchaseCta.getByRole('heading', {
    name: 'GETDOWN SERVICES INSTORE',
    exact: true,
  }),
).toBeVisible();
await expect(purchaseCta.getByText(homePurchaseFeature.note)).toHaveText(
  'Purchase the LP to receive free entry for one named person to the Getdown Services gig instore',
);
await expect(images.nth(1)).toHaveAttribute(
  'src',
  /getdown-services-album-art\.jpeg/,
);
await expect(images.nth(1)).toHaveAttribute(
  'alt',
  'Getdown Services album artwork featuring a hand-drawn figure on layered notepaper',
);
```

Also assert the heading precedes the note, the note precedes the purchase link, and `[data-purchase-cta]` precedes `[data-carousel-media]`.

- [ ] **Step 2: Run the focused test and verify red**

Run:

```bash
npx playwright test tests/smoke.spec.ts --project=chromium --grep "home purchase carousel shows"
```

Expected: FAIL because the heading is absent, the old note remains, and the second slide still references Santù.

- [ ] **Step 3: Add the final artwork asset**

Copy the approved JPEG without transformation:

```bash
cp '/Users/ben.hutchinson/Downloads/WhatsApp Image 2026-07-24 at 14.59.45.jpeg' public/assets/home/getdown-services-album-art.jpeg
```

After updating the slide reference, delete `public/assets/home/santu-colour.jpg` because it has no remaining consumers.

- [ ] **Step 4: Update typed content**

Add `heading: string` to `HomePurchaseFeature`, then set:

```ts
heading: 'GETDOWN SERVICES INSTORE',
note: 'Purchase the LP to receive free entry for one named person to the Getdown Services gig instore',
```

Replace the second slide with:

```ts
{
  alt: 'Getdown Services album artwork featuring a hand-drawn figure on layered notepaper',
  src: '/assets/home/getdown-services-album-art.jpeg',
},
```

- [ ] **Step 5: Render the heading in the carousel header**

Update `PurchaseCallToAction` to render:

```tsx
<div className="space-y-3" data-purchase-cta>
  <h2 className="heading-section text-2xl font-black text-stone-950 uppercase">
    {homePurchaseFeature.heading}
  </h2>
  <p className="text-sm leading-6 text-stone-700">{homePurchaseFeature.note}</p>
  <PurchaseLink offer={homePurchaseFeature.offer} />
</div>
```

- [ ] **Step 6: Run focused desktop and mobile tests to green**

Run:

```bash
npx playwright test tests/smoke.spec.ts --project=chromium --project=mobile --grep "home purchase"
```

Expected: all selected tests pass, with existing project-specific skips only.

- [ ] **Step 7: Run the full quality gate**

Run:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK=https://buy.stripe.com/aFafZh84H0UgdXd8Rb2oE01 npm run build
```

Expected: all commands exit successfully, the full browser suite reports no failures, and the static build completes.

- [ ] **Step 8: Restart localhost for client QA**

Run:

```bash
NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK=https://buy.stripe.com/aFafZh84H0UgdXd8Rb2oE01 npm run dev -- --hostname 127.0.0.1 --port 3000
```

Leave the server running at `http://127.0.0.1:3000/` for client review. Do not open or submit Stripe Checkout.
