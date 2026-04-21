import { expect, test } from '@playwright/test';

import { businessDetails } from '../src/lib/site-content';

test('contact form composes a mailto to the shop with all submitted fields', async ({
  page,
}) => {
  await page.goto('/contact/');

  const contactForm = page.locator('main form').first();

  await contactForm.getByLabel('Name').fill('Test Person');
  await contactForm.getByLabel('Email').fill('test@example.com');
  await contactForm.getByLabel('Phone (optional)').fill('01234 567890');
  await contactForm
    .getByLabel('Message')
    .fill('Interested in your latest arrivals.');

  const [navigationError] = await Promise.all([
    page
      .waitForEvent('requestfailed', {
        predicate: (request) => request.url().startsWith('mailto:'),
      })
      .catch(() => null),
    contactForm.getByRole('button', { name: 'Send Message' }).click(),
  ]);

  await expect(
    page.getByText('Opening your email app with your message prefilled.'),
  ).toBeVisible();

  expect(navigationError).toBeTruthy();

  const mailtoUrl = navigationError?.url() ?? '';
  expect(mailtoUrl.startsWith(`${businessDetails.emailHref}?`)).toBeTruthy();
  expect(mailtoUrl).toContain(encodeURIComponent('Name: Test Person'));
  expect(mailtoUrl).toContain(encodeURIComponent('Email: test@example.com'));
  expect(mailtoUrl).toContain(encodeURIComponent('Phone: 01234 567890'));
  expect(mailtoUrl).toContain(encodeURIComponent('Message:'));
  expect(mailtoUrl).toContain(
    encodeURIComponent('Interested in your latest arrivals.'),
  );
});
