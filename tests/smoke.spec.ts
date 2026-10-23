import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import {
  aboutContent,
  bannedMockupValues,
  businessDetails,
  carouselItems,
  footerContent,
  homeWhatWeDo,
  integrationSettings,
  getHeaderOpenStatusBadgeMode,
  getGigTickerEnabledMode,
  gigTickerContent,
  navigationItems,
  sellContent,
  shouldShowGigTicker,
  siteRoutes,
} from '../src/lib/site-content';
import {
  getOpenStatusMessage,
  parseWeeklyOpeningHours,
} from '../src/lib/open-status';
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
  test('skip link is the first keyboard focus target and jumps to main content', async ({
    page,
  }) => {
    await page.goto('/about/');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();
    await skipLink.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
  });

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

  test('header logo has rounded corners and a soft edge fade', async ({
    page,
  }) => {
    await page.goto('/');

    const logo = page.getByRole('img', {
      name: 'Double Double Good Music Emporium',
    });

    await expect(logo).toHaveCSS('border-radius', '19.2px');
    await expect(logo).toHaveCSS('mask-image', /gradient/);
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
      page.locator('footer').getByRole('link', { name: 'Delivery & Returns' }),
    ).toBeVisible();
    await expect(
      page.locator('footer').getByRole('link', { name: 'Privacy Policy' }),
    ).toBeVisible();
  });

  test('delivery and returns page omits the old checkout disclaimer', async ({
    page,
  }) => {
    await page.goto('/delivery-returns/');

    await expect(
      page.getByRole('heading', { name: 'Delivery & Returns', level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText(
        'This V1 website is informational and does not offer an online checkout.',
      ),
    ).toHaveCount(0);
  });

  test('delivery and returns explains online fulfilment, cancellation, and gig admission', async ({
    page,
  }) => {
    await page.goto('/delivery-returns/');

    await expect(
      page.getByText(/Collect from Double Double Good.*free/i),
    ).toBeVisible();
    await expect(page.getByText(/within 14 days of receiving/i)).toBeVisible();
    await expect(
      page.getByText(/return.*within the next 14 days/i),
    ).toBeVisible();
    await expect(
      page.getByText(/gig.*cancelled or rescheduled/i),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'GOV.UK distance selling guidance' }),
    ).toHaveAttribute(
      'href',
      'https://www.gov.uk/online-and-distance-selling-for-businesses/distance-selling',
    );
  });

  test('privacy page explains Stripe processing without claiming the site receives card details', async ({
    page,
  }) => {
    await page.goto('/privacy/');

    await expect(page.getByText(/transaction and fulfilment/i)).toBeVisible();
    await expect(page.getByText(/fraud prevention/i).first()).toBeVisible();
    await expect(
      page.getByText(/does not receive or store your full card/i),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Stripe Privacy Policy' }),
    ).toHaveAttribute('href', 'https://stripe.com/gb/privacy');
  });

  test('header shows the open status badge and footer keeps opening times simple', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page
        .locator('header')
        .getByText(/^(Open now|Shop closed)/)
        .first(),
    ).toBeVisible();
    await expect(
      page.locator('footer').getByText(/^(Open now|Shop closed)/),
    ).toHaveCount(0);
    await expect(
      page.locator('footer').getByText('Tuesday - 10:00 - 17:00'),
    ).toBeVisible();
  });

  test('header ticker shows the approved message with accessible and reduced-motion support', async ({
    page,
  }) => {
    await page.goto('/');

    const ticker = page.getByRole('region', {
      name: 'Upcoming in-store shows',
    });
    const message =
      'IN-STORE GIG - TIRED - SATURDAY 24TH OCTOBER - 4PM - FREE ENTRY';

    await expect(ticker).toBeVisible();
    await expect(ticker.getByText(gigTickerContent.eyebrow)).toBeVisible();

    const announcement = ticker.locator('.sr-only');
    await expect(announcement).toHaveCount(1);
    await expect(announcement.getByRole('listitem')).toHaveCount(1);
    await expect(announcement.getByRole('listitem')).toHaveText(message);

    const viewport = ticker.locator('.gig-ticker__viewport');
    await expect(viewport).toHaveAttribute('aria-hidden', 'true');
    await expect(viewport.locator('.gig-ticker__text')).toHaveCount(2);
    await expect(viewport.locator('.gig-ticker__text')).toHaveText([
      message,
      message,
    ]);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const track = viewport.locator('.gig-ticker__track');
    const visualCopies = viewport.locator('.gig-ticker__text');
    await expect(track).toHaveCSS('animation-name', 'none');
    await expect(visualCopies.first()).toBeVisible();
    await expect(visualCopies.first()).toHaveText(message);
    await expect(visualCopies.nth(1)).toBeHidden();

    const availableWidth = await viewport.evaluate(
      (element) => element.getBoundingClientRect().width,
    );
    const messageFit = await visualCopies.first().evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      width: element.getBoundingClientRect().width,
    }));
    const messageWidth = messageFit.width;
    expect(messageWidth).toBeLessThanOrEqual(availableWidth);
    expect(messageFit.scrollWidth).toBeLessThanOrEqual(messageFit.clientWidth);
  });

  test('open status feature flag switches the header badge to a closed message', () => {
    expect(getHeaderOpenStatusBadgeMode(undefined)).toBe('schedule');
    expect(getHeaderOpenStatusBadgeMode('true')).toBe('schedule');
    expect(getHeaderOpenStatusBadgeMode('false')).toBe('closed');
    expect(getHeaderOpenStatusBadgeMode('FALSE')).toBe('closed');
  });

  test('gig ticker feature flag only hides the ticker when explicitly false', () => {
    expect(getGigTickerEnabledMode(undefined)).toBe('enabled');
    expect(getGigTickerEnabledMode('true')).toBe('enabled');
    expect(getGigTickerEnabledMode('false')).toBe('hidden');
    expect(getGigTickerEnabledMode('FALSE')).toBe('hidden');
    expect(
      shouldShowGigTicker({
        enabledMode: 'hidden',
        events: gigTickerContent.events,
      }),
    ).toBe(false);
    expect(
      shouldShowGigTicker({
        enabledMode: 'enabled',
        events: [],
      }),
    ).toBe(true);
    expect(shouldShowGigTicker(gigTickerContent)).toBe(true);
  });

  test('home page shows the Ancient High House shopfront instead of gig artwork', async ({
    page,
  }) => {
    await page.goto('/');

    const shopfront = page.getByRole('img', {
      name: 'The Double Double Good shopfront at the Ancient High House',
    });

    await expect(shopfront).toBeVisible();
    await expect(shopfront).toHaveAttribute('src', /shopfront\.jpg/);
    await expect(page.getByText('SOLD OUT', { exact: true })).toHaveCount(0);
    await expect(
      page.getByText('GETDOWN SERVICES IN-STORE', { exact: true }),
    ).toHaveCount(0);
  });

  test('open status automation only shows open during opening hours', () => {
    const schedule = parseWeeklyOpeningHours(
      businessDetails.weeklyOpeningHours,
    );

    expect(
      getOpenStatusMessage(schedule, {
        minutesNow: 9 * 60 + 59,
        weekday: 'Wednesday',
      }),
    ).toBe('Shop closed');
    expect(
      getOpenStatusMessage(schedule, {
        minutesNow: 10 * 60,
        weekday: 'Wednesday',
      }),
    ).toBe('Open now · closes 17:00');
    expect(
      getOpenStatusMessage(schedule, {
        minutesNow: 17 * 60,
        weekday: 'Wednesday',
      }),
    ).toBe('Shop closed');
    expect(
      getOpenStatusMessage(schedule, {
        minutesNow: 12 * 60,
        weekday: 'Sunday',
      }),
    ).toBe('Shop closed');
  });

  test('mobile navigation remains visible and stacked', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Primary' });

    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Reviews' })).toBeVisible();
  });

  test('active primary navigation item exposes aria-current', async ({
    page,
  }) => {
    await page.goto('/about/');

    await expect(
      page.getByRole('link', { name: 'About' }).first(),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('about page carousel renders without visible controls or counter', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/about/');
    await page.mouse.move(1, 1);

    const carousel = page.getByLabel('Shop image carousel');

    await expect(carousel.getByRole('button')).toHaveCount(0);
    await expect(carousel.getByText(/^\d+\s*\/\s*\d+$/)).toHaveCount(0);
    await expect(carousel.locator('img')).toHaveCount(16);
    await expect(carousel.locator('img').first()).toHaveCSS(
      'object-fit',
      'cover',
    );
    await expect(carousel.locator('img').first()).toHaveCSS(
      'object-position',
      carouselItems[0].objectPosition ?? '50% 50%',
    );
    await expect(carousel.locator('.media-zoom').first()).toHaveCSS(
      'border-radius',
      '19.2px',
    );
    expect(carouselItems).toHaveLength(16);
    expect(
      carouselItems.every((item) =>
        item.src.startsWith('/assets/shop-carousel/'),
      ),
    ).toBe(true);

    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      const carouselBox = await carousel.locator('.media-zoom').boundingBox();
      const shopCopyBox = await page
        .locator('main article')
        .first()
        .boundingBox();

      expect(carouselBox?.y).toBeCloseTo(shopCopyBox?.y ?? 0, 0);
    }
  });

  test('home and about section panels do not offset text with card outlines', async ({
    page,
  }) => {
    await page.goto('/');

    const homeSectionPanel = page.locator('.surface-stack > section').first();
    await expect(homeSectionPanel).toHaveCSS('border-top-style', 'none');
    await expect(homeSectionPanel).toHaveCSS('padding-left', '0px');

    await page.goto('/about/');

    const aboutSectionPanel = page.locator('.surface-stack > section').first();
    await expect(aboutSectionPanel).toHaveCSS('border-top-style', 'none');
    await expect(aboutSectionPanel).toHaveCSS('padding-left', '0px');
  });

  test('home instagram reel fills more horizontal space while preserving height', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');

    const instagramFrame = page.locator('iframe[title*=Instagram]');
    const frameBox = await instagramFrame.boundingBox();

    expect(frameBox?.width).toBeGreaterThan(520);
    expect(frameBox?.height).toBeGreaterThan(650);
  });

  test('about page carousel disables autoplay for reduced motion users', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/about/');

    const carousel = page.getByLabel('Shop image carousel');

    await expect(carousel.getByRole('button')).toHaveCount(0);
    await expect(carousel.getByText(/^\d+\s*\/\s*\d+$/)).toHaveCount(0);
  });

  test('about page carousel rotates through shop images every few seconds', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/about/');
    await page.mouse.move(1, 1);

    const carousel = page.getByLabel('Shop image carousel');
    const getActiveImageIndex = async () =>
      carousel
        .locator('img')
        .evaluateAll((images) =>
          images.findIndex((image) =>
            image.className.toString().includes('opacity-100'),
          ),
        );

    const activeImageIndex = await getActiveImageIndex();
    expect(activeImageIndex).toBeGreaterThanOrEqual(0);

    await page.waitForTimeout(3300);

    await expect
      .poll(getActiveImageIndex)
      .toBe((activeImageIndex + 1) % carouselItems.length);
  });

  test('site photos use consistent rounded corners', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('img', { name: homeWhatWeDo.shopfrontImage.alt }),
    ).toHaveCSS('border-radius', '19.2px');

    await page.goto('/about/');
    await expect(
      page.getByLabel('Shop image carousel').locator('.media-zoom').first(),
    ).toHaveCSS('border-radius', '19.2px');
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
    await expect(
      page.locator('main .label-with-icon, footer .label-with-icon'),
    ).toHaveCount(0);
  });

  test('community route is retired with and without a trailing slash', async ({
    page,
    request,
  }) => {
    for (const route of ['/community', '/community/']) {
      const response = await request.get(route);
      expect(response.status()).toBe(404);
    }

    await page.goto('/');
    await expect(
      page
        .getByRole('navigation', { name: 'Primary' })
        .getByRole('link', { name: 'Community', exact: true }),
    ).toHaveCount(0);
    await expect(
      page.locator('footer').getByRole('link', {
        name: 'Community',
        exact: true,
      }),
    ).toHaveCount(0);
  });

  test('sell page rotates cropped local vinyl photos in the existing image slot', async ({
    page,
  }) => {
    await page.goto('/sell/');

    const carousel = page.getByLabel('Sell vinyl image carousel');

    await expect(carousel.locator('img')).toHaveCount(2);
    await expect(carousel.locator('img').first()).toHaveCSS(
      'object-fit',
      'cover',
    );
    await expect(carousel.locator('img').first()).toHaveCSS(
      'object-position',
      sellContent.carouselItems[0].objectPosition ?? '50% 50%',
    );
    const imageBox = await carousel
      .locator('.media-zoom')
      .first()
      .boundingBox();

    expect(imageBox?.height).toBeGreaterThanOrEqual(220);
    expect(imageBox?.height).toBeLessThanOrEqual(300);
    expect(sellContent.carouselRotationMs).toBe(5000);
    expect(sellContent.carouselItems).toHaveLength(2);
    expect(
      sellContent.carouselItems.every((item) =>
        item.src.startsWith('/assets/sell-carousel/'),
      ),
    ).toBe(true);
  });

  test('contact form renders required fields and submit control', async ({
    page,
  }) => {
    await page.goto('/contact/');

    const contactForm = page.locator('main form').first();

    await expect(contactForm).toHaveAttribute('data-hydrated', 'true');
    await expect(contactForm).toHaveAttribute(
      'action',
      integrationSettings.contactFormEndpoint,
    );
    await expect(contactForm).toHaveAttribute('method', 'post');
    await expect(contactForm.getByLabel('Name')).toBeVisible();
    await expect(contactForm.getByLabel('Name')).toHaveAttribute(
      'name',
      'name',
    );
    await expect(contactForm.getByLabel('Email')).toBeVisible();
    await expect(contactForm.getByLabel('Email')).toHaveAttribute(
      'name',
      'email',
    );
    await expect(contactForm.getByLabel('Phone (optional)')).toBeVisible();
    await expect(contactForm.getByLabel('Phone (optional)')).toHaveAttribute(
      'name',
      'phone',
    );
    await expect(contactForm.getByLabel('Message')).toBeVisible();
    await expect(contactForm.getByLabel('Message')).toHaveAttribute(
      'name',
      'message',
    );
    await expect(
      contactForm.getByRole('button', { name: 'Send Message' }),
    ).toBeVisible();
  });

  test('contact form shows clear validation feedback for empty submission', async ({
    page,
  }) => {
    await page.goto('/contact/');

    const contactForm = page.locator('main form').first();
    const submitButton = contactForm.getByRole('button', {
      name: 'Send Message',
    });

    await expect(contactForm).toHaveAttribute('data-hydrated', 'true');
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click();
    await expect(contactForm.getByLabel('Name')).toBeFocused();
    await expect(contactForm.getByLabel('Name')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(contactForm.getByLabel('Email')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(contactForm.getByLabel('Message')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(
      contactForm.getByText('Please enter your name.'),
    ).toBeVisible();
    await expect(
      contactForm.getByText('Please enter your email address.'),
    ).toBeVisible();
    await expect(
      contactForm.getByText('Please enter your message.'),
    ).toBeVisible();
    await expect(
      contactForm.getByText(
        'Please fix the highlighted fields before sending.',
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

  test('about page shows the shop story and carousel without the owner section', async ({
    page,
  }) => {
    await page.goto('/about/');

    await expect(
      page.getByRole('heading', { name: aboutContent.ownerHeading }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('img', { name: aboutContent.ownerImage.alt }),
    ).toHaveCount(0);

    const ownerImageFilename = aboutContent.ownerImage.src.split('/').at(-1);
    await expect(page.locator(`img[src*="${ownerImageFilename}"]`)).toHaveCount(
      0,
    );

    await expect(
      page.getByRole('heading', { name: aboutContent.shopHeading }),
    ).toBeVisible();
    await expect(page.getByText(aboutContent.shopParagraphs[0])).toBeVisible();
    await expect(page.getByLabel('Shop image carousel')).toBeVisible();
  });

  test('newsletter section and Beehiiv embed are absent from public pages', async ({
    page,
  }) => {
    for (const route of ['/', '/about/']) {
      await page.goto(route);

      const footer = page.locator('footer');

      await expect(page.locator('#newsletter')).toHaveCount(0);
      await expect(
        page.getByRole('heading', { name: footerContent.newsletterTitle }),
      ).toHaveCount(0);
      await expect(footer.locator('form')).toHaveCount(0);
      await expect(footer.getByRole('button')).toHaveCount(0);
      await expect(
        page.locator('iframe[src^="https://subscribe-forms.beehiiv.com"]'),
      ).toHaveCount(0);
      await expect(page.locator('script[data-beehiiv-form]')).toHaveCount(0);
    }
  });

  test('home instagram reel uses the latest requested reel', () => {
    expect(integrationSettings.instagramReelEmbedUrl).toBe(
      'https://www.instagram.com/reel/Delh1EUszLo/embed/',
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
    expect(sitemapBody).not.toContain(
      `<loc>${canonicalUrl('/community')}</loc>`,
    );
  });
});
