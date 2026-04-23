import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import {
  aboutContent,
  bannedMockupValues,
  businessDetails,
  homeWhatWeDo,
  integrationSettings,
  navigationItems,
  siteRoutes,
} from '../src/lib/site-content';

const routes = [...siteRoutes];

// Keep these assertions aligned with the current agreed product behavior in PRD.md.
function canonicalUrl(pathname: string) {
  return `${businessDetails.canonicalSiteUrl}${pathname === '/' ? '' : pathname}`;
}

function normalizedReviewsWidgetClass() {
  const trimmed = integrationSettings.reviewsWidgetId.trim();
  return trimmed.startsWith('elfsight-app-')
    ? trimmed
    : `elfsight-app-${trimmed}`;
}

test.describe('public routes', () => {
  test('home page keeps core what-we-do content without a duplicated page headline', async ({
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
        .getByText(homeWhatWeDo.heading, { exact: true })
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('main')
        .getByText(homeWhatWeDo.intro, { exact: false })
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
    await expect(
      page.getByRole('link', { name: 'Get Directions' }),
    ).toHaveAttribute('href', businessDetails.directionsUrl);
    await expect(
      page.locator('footer').getByRole('heading', { name: 'Opening times' }),
    ).toBeVisible();
    await expect(
      page.locator('footer').getByText('Tuesday - 10:00 - 17:00'),
    ).toBeVisible();
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

    await expect(
      page.getByRole('heading', { name: 'Reviews', level: 1 }),
    ).toBeVisible();
    await expect(
      page.locator(`.${normalizedReviewsWidgetClass()}`),
    ).toHaveCount(1);
  });

  test('about page shows current approved copy and owner section', async ({
    page,
  }) => {
    await page.goto('/about/');

    await expect(
      page.getByRole('heading', { name: aboutContent.ownerHeading }),
    ).toBeVisible();
    await expect(
      page.getByText(aboutContent.ownerParagraphs[0], { exact: false }),
    ).toBeVisible();
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
