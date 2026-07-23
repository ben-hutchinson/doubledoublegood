import { expect, test } from '@playwright/test';

import {
  getTrustedExternalUrl,
  getTrustedStripePaymentLink,
  trustedHostnames,
} from '../src/lib/security';

test.describe('security URL allowlist helpers', () => {
  test('rejects non-https URLs', () => {
    expect(getTrustedExternalUrl('http://formspree.io/f/test')).toBe('');
    expect(getTrustedExternalUrl('javascript:alert(1)')).toBe('');
  });

  test('rejects untrusted hostnames for embeds', () => {
    const unsafeReviewUrl = 'https://evil.example/reviews/embed';

    expect(
      getTrustedExternalUrl(unsafeReviewUrl, {
        allowedHostnames: trustedHostnames.reviewsEmbed,
      }),
    ).toBe('');
  });

  test('accepts trusted hostnames for contact endpoint', () => {
    const trustedContactUrl = 'https://formspree.io/f/xqenwbzd';

    expect(
      getTrustedExternalUrl(trustedContactUrl, {
        allowedHostnames: trustedHostnames.contactFormEndpoint,
      }),
    ).toBe('https://formspree.io/f/xqenwbzd');
  });

  test('accepts only exact HTTPS Stripe Payment Link hosts', () => {
    const livePaymentLink = 'https://buy.stripe.com/14A6oH4example';

    expect(getTrustedStripePaymentLink(livePaymentLink)).toBe(livePaymentLink);
    expect(getTrustedStripePaymentLink('http://buy.stripe.com/unsafe')).toBe(
      '',
    );
    expect(
      getTrustedStripePaymentLink('https://buy.stripe.com.evil.test/unsafe'),
    ).toBe('');
    expect(
      getTrustedStripePaymentLink('javascript:alert(document.domain)'),
    ).toBe('');
    expect(getTrustedStripePaymentLink(undefined)).toBe('');
  });

  test('rejects Stripe sandbox links unless test mode is explicitly allowed', () => {
    const sandboxPaymentLink = 'https://buy.stripe.com/test_7sIexample';

    expect(getTrustedStripePaymentLink(sandboxPaymentLink)).toBe('');
    expect(
      getTrustedStripePaymentLink(sandboxPaymentLink, {
        allowTestMode: true,
      }),
    ).toBe(sandboxPaymentLink);
  });
});
