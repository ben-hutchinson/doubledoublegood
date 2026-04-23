import { expect, test } from '@playwright/test';

import { getTrustedExternalUrl, trustedHostnames } from '../src/lib/security';

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
    const trustedContactUrl = 'https://formspree.io/f/abcdwxyz';

    expect(
      getTrustedExternalUrl(trustedContactUrl, {
        allowedHostnames: trustedHostnames.contactFormEndpoint,
      }),
    ).toBe('https://formspree.io/f/abcdwxyz');
  });
});
