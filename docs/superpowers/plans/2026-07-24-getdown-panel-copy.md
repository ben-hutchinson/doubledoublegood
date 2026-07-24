# Getdown Panel Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Getdown panel’s short admission note with the client-approved three-paragraph introduction and correct the title to `GETDOWN SERVICES IN-STORE`.

**Architecture:** Replace the singular `note: string` content property with `description: string[]` so each client paragraph renders as semantic HTML without manual line breaks. `PurchaseCallToAction` maps the typed paragraphs between the existing heading and button; Stripe and carousel behavior remain unchanged.

**Tech Stack:** Next.js App Router, React, strict TypeScript, Tailwind CSS, Playwright.

## Global Constraints

- Preserve the client’s wording and straight apostrophes exactly.
- Render in this order: corrected heading → three paragraphs → `BUY THE LP` → carousel artwork.
- Keep each paragraph as its own `<p>` element.
- Preserve the existing full-width button, live Stripe configuration, carousel behavior, responsive sizing, and final Getdown artwork.

---

### Task 1: Render the Revised Client Copy

**Files:**

- Modify: `tests/smoke.spec.ts`
- Modify: `src/lib/site-content.ts`
- Modify: `src/components/home-purchase-feature.tsx`
- Modify: `docs/superpowers/plans/2026-07-24-getdown-final-artwork-heading.md`

**Interfaces:**

- Consumes: `homePurchaseFeature.heading`, the `ImageCarousel` header slot, and `PurchaseLink`.
- Produces: `HomePurchaseFeature.description: string[]` and three semantic paragraphs in the approved order.

- [ ] **Step 1: Write the failing content and ordering assertions**

Define the exact expected paragraphs in `tests/smoke.spec.ts`:

```ts
const getdownDescription = [
  "Join us as we celebrate the release of 'Massive Champion', the brand-new album from Getdown Services.",
  "The band will be visiting the shop for a special appearance to mark the launch and we're really looking forward to welcoming them.",
  'Entry is free so long as you purchase the LP below.',
];
```

Update the purchase test to require the corrected heading, exactly three paragraph elements, and child order:

```ts
await expect(
  purchaseCta.getByRole('heading', {
    name: 'GETDOWN SERVICES IN-STORE',
    exact: true,
  }),
).toBeVisible();
await expect(purchaseCta.locator(':scope > p')).toHaveText(getdownDescription);
await expect(purchaseCtaChildren.nth(0)).toHaveRole('heading');
await expect(purchaseCtaChildren.nth(1)).toHaveText(getdownDescription[0]);
await expect(purchaseCtaChildren.nth(2)).toHaveText(getdownDescription[1]);
await expect(purchaseCtaChildren.nth(3)).toHaveText(getdownDescription[2]);
await expect(purchaseCtaChildren.nth(4)).toHaveText('BUY THE LP');
```

Update desktop and Pixel 7 geometry tests to locate the final paragraph with `homePurchaseFeature.description.at(-1)`.

- [ ] **Step 2: Run the focused test and verify red**

Stop the live-link development server so Playwright can start its sandbox-fixture server, then run:

```bash
npx playwright test tests/smoke.spec.ts --project=chromium --grep "home purchase carousel shows"
```

Expected: FAIL because the title is not hyphenated and only the old one-line note exists.

- [ ] **Step 3: Update the typed content model**

Replace `note: string` with `description: string[]` in `HomePurchaseFeature`, then configure:

```ts
heading: 'GETDOWN SERVICES IN-STORE',
description: [
  "Join us as we celebrate the release of 'Massive Champion', the brand-new album from Getdown Services.",
  "The band will be visiting the shop for a special appearance to mark the launch and we're really looking forward to welcoming them.",
  'Entry is free so long as you purchase the LP below.',
],
```

- [ ] **Step 4: Render each description paragraph**

Replace the single note paragraph in `PurchaseCallToAction` with:

```tsx
{
  homePurchaseFeature.description.map((paragraph) => (
    <p className="text-sm leading-6 text-stone-700" key={paragraph}>
      {paragraph}
    </p>
  ));
}
```

- [ ] **Step 5: Retire the superseded short-copy plan**

Replace the old implementation plan body with a short superseded notice pointing maintainers to this plan and the approved design spec. Do not leave the old title or short note as active implementation instructions.

- [ ] **Step 6: Run focused and full verification**

Run:

```bash
npx playwright test tests/smoke.spec.ts --project=chromium --project=mobile --grep "home purchase"
npm run typecheck
npm run lint
npm run format:check
npm test
NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK=https://buy.stripe.com/aFafZh84H0UgdXd8Rb2oE01 npm run build
```

Expected: all commands exit successfully, with only the suite’s intentional platform-specific skips.

- [ ] **Step 7: Commit and restart localhost**

Commit the content, component, tests, and plan updates on `codex/getdown-stripe-carousel`. Restart:

```bash
NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK=https://buy.stripe.com/aFafZh84H0UgdXd8Rb2oE01 npm run dev -- --hostname 127.0.0.1 --port 3000
```

Leave `http://127.0.0.1:3000/` running for client QA without opening or submitting Stripe Checkout.
