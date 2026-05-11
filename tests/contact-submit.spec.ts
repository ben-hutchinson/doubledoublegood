import { expect, test } from '@playwright/test';

import { integrationSettings } from '../src/lib/site-content';

test('contact form submits through configured endpoint without opening a mail app', async ({
  page,
}) => {
  await page.goto('/contact/');

  const contactForm = page.locator('main form').first();
  const endpoint = integrationSettings.contactFormEndpoint.trim();

  await expect(contactForm).toHaveAttribute('data-hydrated', 'true');
  await contactForm.getByLabel('Name').fill('Test Person');
  await contactForm.getByLabel('Email').fill('test@example.com');
  await contactForm.getByLabel('Phone (optional)').fill('01234 567890');
  await contactForm
    .getByLabel('Message')
    .fill('Interested in your latest arrivals.');

  const submitButton = contactForm.getByRole('button', {
    name: 'Send Message',
  });
  await submitButton.scrollIntoViewIfNeeded();

  if (!endpoint) {
    await submitButton.click();
    await expect(
      contactForm.getByText(
        'Contact form is temporarily unavailable right now. Please call or email the shop directly.',
      ),
    ).toBeVisible();
    return;
  }

  let payload: Record<string, string> | null = null;

  await page.route(
    (url) => url.toString().startsWith(endpoint),
    async (route) => {
      payload = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"ok":true}',
      });
    },
  );

  await submitButton.click();

  await expect(
    contactForm.getByText("Thanks, we'll get back to you soon."),
  ).toBeVisible();
  expect(payload).toMatchObject({
    name: 'Test Person',
    email: 'test@example.com',
    phone: '01234 567890',
    message: 'Interested in your latest arrivals.',
    source: 'website-contact-form',
  });
});
