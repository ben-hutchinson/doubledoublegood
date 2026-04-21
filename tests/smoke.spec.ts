import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import {
  bannedMockupValues,
  businessDetails,
  integrationSettings,
  navigationItems,
  siteRoutes,
} from '../src/lib/site-content';

const routes = [...siteRoutes];

function canonicalUrl(pathname: string) {
  return `${businessDetails.canonicalSiteUrl}${pathname === '/' ? '' : pathname}`;
}

test.describe('public routes', () => {
  test('home page keeps the intro copy without a duplicated page headline', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: businessDetails.headline,
      }),
    ).toHaveCount(0);
    await expect(
      page
        .locator('header')
        .getByText(businessDetails.headline, { exact: true })
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('main')
        .getByText(
          'Drop in for a proper browse, ask about a collection',
          { exact: false },
        )
        .first(),
    ).toBeVisible();
  });

  test('primary and footer navigation cover the required routes', async ({
    page,
  }) => {
    await page.goto('/');

    for (const item of navigationItems) {
      await expect(
        page.getByRole('link', { name: item.label }).first(),
      ).toBeVisible();
    }

    await expect(
      page.getByRole('link', { name: 'Delivery & Returns' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Privacy Policy' }),
    ).toBeVisible();
  });

  test('mobile navigation remains visible and stacked', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Primary' });

    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Reviews' })).toBeVisible();
  });

  test('find us page contains the correct facts and directions link', async ({
    page,
  }) => {
    await page.goto('/find-us/');

    const main = page.locator('main');

    await expect(main.getByText('49 Greengate Street').first()).toBeVisible();
    await expect(main.getByText('Stafford').first()).toBeVisible();
    await expect(main.getByText('ST16 2JA').first()).toBeVisible();
    await expect(main.getByText('Opening Hours')).toHaveCount(0);
    await expect(main.getByText(businessDetails.openingHours)).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Get Directions' }),
    ).toHaveAttribute('href', businessDetails.directionsUrl);
  });

  test('contact form renders required fields and submit control', async ({
    page,
  }) => {
    await page.goto('/contact/');

    const contactForm = page.locator('main form').first();

    await expect(contactForm.getByLabel('Name')).toBeVisible();
    await expect(contactForm.getByLabel('Email')).toBeVisible();
    await expect(contactForm.getByLabel('Phone (optional)')).toBeVisible();
    await expect(contactForm.getByLabel('Message')).toBeVisible();
    await expect(
      contactForm.getByRole('button', { name: 'Send Message' }),
    ).toBeVisible();
  });

  test('contact form shows clear validation feedback for empty submission', async ({
    page,
  }) => {
    await page.goto('/contact/');

    const contactForm = page.locator('main form').first();

    await contactForm.getByRole('button', { name: 'Send Message' }).click();
    await expect(
      contactForm.getByText(
        'Please complete your name, email address, and message.',
      ),
    ).toBeVisible();
  });

  test('reviews page keeps only the embedded widget area', async ({ page }) => {
    await page.goto('/reviews/');

    await expect(page.getByText('Google reviews')).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Read on Google' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Write a review' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Leave Us a Review' }),
    ).toHaveCount(0);
    await expect(
      page.locator('.elfsight-app-5c9dd34d-87e7-4dbe-828b-63797bbbfcbb'),
    ).toHaveCount(1);
  });

  test('about page uses permanent highlights and no placeholder prompt', async ({
    page,
  }) => {
    await page.goto('/about/');

    await expect(page.getByText('Inside the High House')).toBeVisible();
    await expect(page.getByText('Placeholder image area')).toHaveCount(0);
    await expect(
      page.getByText('Use authentic shop photography here before launch'),
    ).toHaveCount(0);
  });

  test('newsletter section renders the Beehiiv embed form', async ({
    page,
  }) => {
    await page.goto('/');

    const newsletterSection = page.locator('#newsletter');
    const beehiivEmbed = newsletterSection.locator('iframe.beehiiv-embed');

    await expect(beehiivEmbed).toHaveCount(1);
    await expect(beehiivEmbed).toHaveAttribute(
      'src',
      integrationSettings.beehiivFormUrl,
    );
    await expect(beehiivEmbed).toHaveAttribute(
      'title',
      'Join the Double Double Good mailing list',
    );
  });

  test('no mockup placeholders leak into public routes', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route);

      const pageText = (await page.locator('body').innerText()).trim();

      for (const bannedValue of bannedMockupValues) {
        expect(pageText).not.toContain(bannedValue);
      }
    }
  });

  test('critical routes have no serious or critical accessibility violations', async ({
    page,
  }) => {
    for (const route of routes) {
      await page.goto(route);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .exclude('iframe[src*="instagram.com"]')
        .analyze();
      const seriousViolations = accessibilityScanResults.violations.filter(
        (violation) => ['serious', 'critical'].includes(violation.impact ?? ''),
      );

      expect(seriousViolations).toEqual([]);
    }
  });

  test('robots and sitemap publish all primary public routes', async ({
    request,
  }) => {
    const robotsResponse = await request.get('/robots.txt');
    expect(robotsResponse.ok()).toBeTruthy();
    const robotsBody = await robotsResponse.text();
    expect(robotsBody).toMatch(/user-agent:\s*\*/i);
    expect(robotsBody).toContain(
      `Sitemap: ${businessDetails.canonicalSiteUrl}/sitemap.xml`,
    );

    const sitemapResponse = await request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapBody = await sitemapResponse.text();
    for (const route of routes) {
      expect(sitemapBody).toContain(`<loc>${canonicalUrl(route)}</loc>`);
    }
  });
});
