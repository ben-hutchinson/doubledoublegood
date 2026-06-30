import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import {
  aboutContent,
  bannedMockupValues,
  businessDetails,
  carouselItems,
  communityContent,
  homeWhatWeDo,
  homeFeatureImages,
  integrationSettings,
  getHomeFeatureImageVariant,
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

    const primaryLabels = await page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link')
      .allTextContents();

    expect(primaryLabels.at(-1)).toBe('Community');

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

  test('header shows upcoming in-store shows in the gig ticker', async ({
    page,
  }) => {
    await page.goto('/');

    const ticker = page.getByRole('region', {
      name: 'Upcoming in-store shows',
    });
    const visibleTickerText = ticker.locator('.gig-ticker__viewport');
    const firstEvent = gigTickerContent.events[0];

    await expect(ticker).toBeVisible();
    await expect(ticker.getByText(gigTickerContent.eyebrow)).toBeVisible();
    await expect(
      visibleTickerText.getByText(firstEvent.message).first(),
    ).toBeVisible();
  });

  test('mobile gig ticker scrolls the full notice text', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');

    const tickerMotion = await page.evaluate(async () => {
      const viewport = document.querySelector('.gig-ticker__viewport');
      const track = document.querySelector('.gig-ticker__track');
      const text = document.querySelector('.gig-ticker__text');

      if (!viewport || !track || !text) {
        return null;
      }

      const viewportWidth = viewport.getBoundingClientRect().width;
      const textWidth = text.getBoundingClientRect().width;
      const firstTransform = window.getComputedStyle(track).transform;

      await new Promise((resolve) => {
        window.setTimeout(resolve, 650);
      });

      const secondTransform = window.getComputedStyle(track).transform;

      return {
        isAnimated: firstTransform !== secondTransform,
        textWiderThanViewport: textWidth > viewportWidth,
      };
    });

    expect(tickerMotion).toEqual({
      isAnimated: true,
      textWiderThanViewport: true,
    });
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
    ).toBe(false);
    expect(shouldShowGigTicker(gigTickerContent)).toBe(true);
  });

  test('home feature image variants support the Santù A/B test posters', () => {
    expect(getHomeFeatureImageVariant(undefined)).toBe('santu-colour');
    expect(getHomeFeatureImageVariant('shopfront')).toBe('shopfront');
    expect(getHomeFeatureImageVariant('santu-bw')).toBe('santu-bw');
    expect(getHomeFeatureImageVariant('santu-colour')).toBe('santu-colour');
    expect(getHomeFeatureImageVariant('unknown')).toBe('santu-colour');

    expect(homeFeatureImages.shopfront).toMatchObject({
      alt: 'The Double Double Good shopfront at the Ancient High House',
      fit: 'cover',
      src: '/shopfront.jpg',
    });
    expect(homeFeatureImages['santu-bw']).toMatchObject({
      alt: 'Santù in-store live music poster, black and white version',
      fit: 'contain',
      height: 2000,
      src: '/assets/home/santu-bw.jpg',
      width: 1414,
    });
    expect(homeFeatureImages['santu-colour']).toMatchObject({
      alt: 'Santù in-store live music poster, colour version',
      fit: 'contain',
      height: 2000,
      src: '/assets/home/santu-colour.jpg',
      width: 1414,
    });
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
    await expect(
      page.getByRole('img', { name: aboutContent.ownerImage.alt }),
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

  test('community page launches with scaffolded copy and no fake entries', async ({
    page,
  }) => {
    await page.goto('/community/');

    await expect(
      page.getByRole('heading', { name: communityContent.title, level: 1 }),
    ).toBeVisible();
    await expect(page.getByText(communityContent.intro)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Supported bands' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('heading', {
        name: 'Independent shops',
      }),
    ).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Community' })).toHaveCount(2);

    const bodyText = await page.locator('body').innerText();
    expect(communityContent.intro).toBe(
      'COMING SOON! Stay tuned for news on the shop and our wider community.',
    );
    expect(bodyText).not.toContain(
      'Band links are being gathered and will be added here once confirmed.',
    );
    expect(bodyText).not.toContain(
      'Independent shop links are being gathered and will be added here once confirmed.',
    );
    expect(bodyText.toLowerCase()).not.toContain('placeholder');
    expect(bodyText).not.toContain('Example');
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

  test('about page shows current approved copy and owner section', async ({
    page,
  }) => {
    await page.goto('/about/');

    await expect(
      page.getByRole('heading', { name: aboutContent.ownerHeading }),
    ).toBeVisible();
    await expect(
      page.getByText('Owner story placeholder copy goes here for now.'),
    ).toHaveCount(0);

    const ownerImage = page.getByRole('img', {
      name: aboutContent.ownerImage.alt,
    });
    const mainBox = await page.locator('main').boundingBox();
    const imageBox = await ownerImage.boundingBox();

    await expect(ownerImage).toBeVisible();
    expect(imageBox?.width).toBeGreaterThan((mainBox?.width ?? 0) * 0.8);
  });

  test('newsletter section renders the Beehiiv embed form', async ({
    page,
  }) => {
    await page.goto('/');

    const beehiivLoader = page.locator('script[data-beehiiv-form]');
    const newsletterSection = page.locator('#newsletter');
    const beehiivEmbed = newsletterSection.locator(
      'iframe[src^="https://subscribe-forms.beehiiv.com"]',
    );

    await expect(beehiivLoader).toHaveCount(1);
    await expect(beehiivLoader).toHaveAttribute(
      'src',
      integrationSettings.beehiivEmbedScriptUrl,
    );
    await expect(beehiivLoader).toHaveAttribute(
      'data-beehiiv-form',
      integrationSettings.beehiivFormId,
    );
    await expect(beehiivEmbed).toHaveCount(1);
    await expect(beehiivEmbed).toHaveAttribute(
      'title',
      'Join the Double Double Good mailing list',
    );
  });

  test('home instagram reel uses the latest requested reel', () => {
    expect(integrationSettings.instagramReelEmbedUrl).toBe(
      'https://www.instagram.com/reel/DaFJbpLMhGl/embed/',
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
