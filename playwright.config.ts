import { defineConfig, devices } from '@playwright/test';

import { stripePaymentLinkFixtures } from './tests/stripe-payment-link-fixtures';

process.env.NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK = stripePaymentLinkFixtures.lp;
process.env.NEXT_PUBLIC_STRIPE_LP_CD_PAYMENT_LINK =
  stripePaymentLinkFixtures.lpAndCd;
process.env.ALLOW_STRIPE_TEST_PAYMENT_LINKS = 'true';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
