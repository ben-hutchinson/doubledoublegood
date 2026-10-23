import { expect, test } from '@playwright/test';

const exploreColumns = [
  [
    { href: '/about/', label: 'About' },
    { href: '/find-us/', label: 'Find Us' },
    { href: '/sell/', label: 'Sell Your Vinyl' },
    { href: '/contact/', label: 'Contact' },
  ],
  [
    { href: '/reviews/', label: 'Reviews' },
    { href: '/delivery-returns/', label: 'Delivery & Returns' },
    { href: '/privacy/', label: 'Privacy Policy' },
    { href: '/', label: 'Home' },
  ],
];

test.describe('client footer', () => {
  test('keeps two complete Explore lists and the existing footer details', async ({
    page,
  }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    const lists = footer.getByRole('list');
    await expect(lists).toHaveCount(2);

    for (const [index, expectedLinks] of exploreColumns.entries()) {
      const links = lists.nth(index).getByRole('link');
      await expect(links).toHaveCount(4);
      await expect(links).toHaveText(expectedLinks.map(({ label }) => label));
      await expect
        .poll(() =>
          links.evaluateAll((items) =>
            items.map((item) => item.getAttribute('href')),
          ),
        )
        .toEqual(expectedLinks.map(({ href }) => href));
    }

    await expect(footer.getByText('Join the mailing list')).toHaveCount(0);
    await expect(
      footer.getByRole('heading', { name: 'Get in touch' }),
    ).toBeVisible();
    await expect(
      footer.getByRole('heading', { name: 'Opening times' }),
    ).toBeVisible();
    await expect(
      footer.getByText(/© \d{4} Double Double Good Music Emporium/),
    ).toBeVisible();
    await expect(
      footer.getByRole('link', { name: 'Back to top' }),
    ).toHaveAttribute('href', '#top');
  });

  test('uses equal, separated Explore columns on desktop', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Desktop layout check');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const lists = page.locator('footer').getByRole('list');
    const first = await lists.nth(0).boundingBox();
    const second = await lists.nth(1).boundingBox();
    const gap = await lists
      .nth(0)
      .locator('..')
      .evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).columnGap),
      );

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(Math.abs(first!.width - second!.width)).toBeLessThan(1);
    expect(gap).toBeGreaterThan(0);
    expect(second!.x - first!.x).toBeCloseTo(first!.width + gap, 0);
  });

  test('keeps all Explore links visible without horizontal overflow on mobile', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile layout check');
    await page.goto('/');

    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByRole('list')).toHaveCount(2);
    await expect(
      footer.getByRole('link', { name: 'About', exact: true }),
    ).toBeVisible();
    await expect(
      footer.getByRole('link', { name: 'Delivery & Returns', exact: true }),
    ).toBeVisible();
    await expect(
      footer.getByRole('link', { name: 'Home', exact: true }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
  });
});
