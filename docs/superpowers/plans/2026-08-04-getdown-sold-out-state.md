# Getdown Sold-Out State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the completed Getdown LP purchase call to action with a persistent, accessible `SOLD OUT` banner across the rotating homepage artwork.

**Architecture:** Keep the shared `ImageCarousel` unchanged and supply the sold-out treatment through its existing `header` and `overlay` slots. Simplify the Getdown content model so it contains a heading, sold-out label, slides, and timing only; remove obsolete homepage environment wiring while retaining the reusable Stripe URL validator.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Playwright, axe-core.

## Global Constraints

- Keep the exact title `GETDOWN SERVICES IN-STORE` above the carousel.
- Render exact visible status text `SOLD OUT` in white on accent red `#ba2b20`.
- Remove the three promotional paragraphs and `BUY THE LP` control completely.
- Keep two contained slides, five-second rotation, 700ms crossfade, hover/focus pause, reduced-motion handling, and existing image alt text.
- Do not change shared About or Sell carousel behaviour.
- Do not remove historical Stripe policy wording or reusable Stripe URL validation helpers.
- Do not add dependencies, inventory logic, a waitlist, or a replacement product.

---

### Task 1: Define the sold-out homepage behaviour with failing browser tests

**Files:**
- Modify: `tests/smoke.spec.ts:25-471`
- Delete: `tests/home-purchase-feature.spec.tsx`

**Interfaces:**
- Consumes: `homePurchaseFeature.heading`, `homePurchaseFeature.soldOutLabel`, `homePurchaseFeature.rotationIntervalMs`, and the rendered carousel region.
- Produces: Browser-level expectations for sold-out content, persistent overlay, rotation, hover pause, reduced motion, and mobile containment.

- [ ] **Step 1: Replace purchase-state fixtures and assertions with sold-out expectations**

Remove the Stripe fixture import and `getdownDescription`. Replace the purchase test with assertions equivalent to:

```ts
test('Getdown carousel shows a persistent sold-out state', async ({ page }) => {
  await page.goto('/');

  const feature = page.getByLabel('Getdown Services sold-out event');
  const carousel = page.getByLabel(homePurchaseFeature.ariaLabel);
  const banner = carousel.getByText(homePurchaseFeature.soldOutLabel, {
    exact: true,
  });

  await expect(
    feature.getByRole('heading', {
      level: 2,
      name: homePurchaseFeature.heading,
      exact: true,
    }),
  ).toBeVisible();
  await expect(banner).toBeVisible();
  await expect(banner).toHaveCSS('background-color', 'rgb(186, 43, 32)');
  await expect(feature.getByRole('link')).toHaveCount(0);
  await expect(feature.getByText('BUY THE LP', { exact: true })).toHaveCount(0);
  await expect(feature.locator('[aria-disabled="true"]')).toHaveCount(0);
  await expect(feature.locator('p')).toHaveCount(0);
});
```

Update the rotation test to assert `banner` remains visible after slide two becomes active. Update the hover test to pause on carousel hover only, because no focusable CTA remains. Update the mobile test to assert document width is 412px, the banner width does not exceed the media width, and the banner text does not wrap.

- [ ] **Step 2: Delete obsolete PurchaseLink unit coverage**

Delete `tests/home-purchase-feature.spec.tsx`; its exported production function will be removed and the replacement behaviour is covered through the real rendered homepage.

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
npx playwright test tests/smoke.spec.ts --project=chromium --grep "Getdown|home purchase carousel"
```

Expected: FAIL because `SOLD OUT` is absent and the purchase content/link are still rendered.

- [ ] **Step 4: Commit the failing behavioural tests**

```bash
git add tests/smoke.spec.ts tests/home-purchase-feature.spec.tsx
git commit -m "Test Getdown sold-out homepage state"
```

---

### Task 2: Render the sold-out banner and remove active purchase configuration

**Files:**
- Modify: `src/components/home-purchase-feature.tsx`
- Modify: `src/lib/site-content.ts:1-44,360-390`
- Modify: `playwright.config.ts:1-7`
- Modify: `.github/workflows/doubledoublegood-build.yaml:35-45`

**Interfaces:**
- Consumes: `ImageCarousel` props `header?: ReactNode` and `overlay?: ReactNode`.
- Produces: `homePurchaseFeature.soldOutLabel: string` and a non-interactive overlay marked with `data-sold-out-banner`.

- [ ] **Step 1: Simplify the typed sold-out content model**

Remove `HomePurchaseOffer`, `description`, and `offer`. Remove the production imports and environment reads for `getTrustedStripePaymentLink` and `shouldAllowStripeTestPaymentLinks`. Define the content shape as:

```ts
type HomePurchaseFeature = {
  ariaLabel: string;
  heading: string;
  rotationIntervalMs: number;
  slides: CarouselImage[];
  soldOutLabel: string;
};
```

Set `ariaLabel` to `Getdown Services sold-out carousel`, retain the existing heading, timing, and two slide objects unchanged, and set `soldOutLabel` to `SOLD OUT`.

- [ ] **Step 2: Replace purchase UI with the retained heading and banner overlay**

Remove `PurchaseLink`, `PurchaseLinkProps`, and `PurchaseCallToAction`. Continue rendering `ImageCarousel`, but pass the existing heading as `header` and this overlay:

```tsx
<div
  className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 border-y border-white/50 bg-[#ba2b20] px-4 py-4 text-center text-3xl font-black tracking-[0.16em] whitespace-nowrap text-white uppercase shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:py-5 sm:text-5xl"
  data-sold-out-banner
>
  {homePurchaseFeature.soldOutLabel}
</div>
```

Change the surrounding aside label to `Getdown Services sold-out event`. Retain every existing carousel sizing, image, preload, counter, scrim, border, zoom, and timing prop.

- [ ] **Step 3: Remove obsolete environment wiring**

Delete the `stripePaymentLinkFixtures` import and two process environment assignments from `playwright.config.ts`. Delete `ALLOW_STRIPE_TEST_PAYMENT_LINKS` and `NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK` from the IONOS build step. Leave `src/lib/security.ts`, `tests/security-config.spec.ts`, policy copy, and the Stripe runbook unchanged.

- [ ] **Step 4: Run the focused browser tests and verify GREEN**

Run:

```bash
npx playwright test tests/smoke.spec.ts --project=chromium --grep "Getdown|home purchase carousel"
npx playwright test tests/smoke.spec.ts --project=mobile --grep "Getdown|home purchase feature"
```

Expected: all selected sold-out, rotation, reduced-motion, and mobile checks pass.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/components/home-purchase-feature.tsx src/lib/site-content.ts playwright.config.ts .github/workflows/doubledoublegood-build.yaml
git commit -m "Show Getdown event as sold out"
```

---

### Task 3: Complete repository and rendered QA

**Files:**
- Modify only files required to resolve failures caused by Tasks 1-2.

**Interfaces:**
- Consumes: completed sold-out homepage state.
- Produces: verified build and responsive visual evidence.

- [ ] **Step 1: Run static and security checks**

```bash
npm run typecheck
npm run lint
npm run format:check
npm audit --omit=dev --audit-level=high
```

Expected: all commands exit 0; production audit reports zero high or critical vulnerabilities.

- [ ] **Step 2: Run full tests and production build**

```bash
npm test
npm run build
```

Expected: all Playwright projects pass and Next.js writes the static export to `out`.

- [ ] **Step 3: Verify the rendered homepage in the browser**

Test flow: `/` loads → `GETDOWN SERVICES IN-STORE` and `SOLD OUT` render → artwork rotates while the banner remains fixed → no purchase control or promotional copy exists.

Check desktop and Pixel 7 widths for page identity, meaningful content, framework overlays, console warnings/errors, banner containment, text contrast, wrapping, and horizontal overflow. Capture screenshots outside committed source.

- [ ] **Step 4: Review the final diff and commit any verification fixes**

```bash
git diff --check
git status --short
```

If verification required a source correction, stage only that correction and commit it with a focused message. Do not add Playwright traces, screenshots, reports, or the pre-existing `.playwright-mcp` files.
