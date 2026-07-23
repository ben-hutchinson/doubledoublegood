import { expect, test } from '@playwright/test';
import type { ReactElement } from 'react';

import { PurchaseLink } from '../src/components/home-purchase-feature';

test('missing Stripe configuration renders an unavailable non-link state', () => {
  const element = PurchaseLink({
    offer: { href: '', label: 'BUY THE LP' },
  }) as ReactElement<Record<string, unknown>>;

  expect(element.type).toBe('span');
  expect(element.props['aria-disabled']).toBe('true');
  expect(element.props).not.toHaveProperty('href');
});

test('validated Stripe configuration renders a same-tab purchase link', () => {
  const element = PurchaseLink({
    offer: {
      href: 'https://buy.stripe.com/14A6oH4example',
      label: 'BUY THE LP',
    },
  }) as ReactElement<Record<string, unknown>>;

  expect(element.type).toBe('a');
  expect(element.props.href).toBe('https://buy.stripe.com/14A6oH4example');
  expect(element.props).not.toHaveProperty('target');
  expect(element.props).not.toHaveProperty('aria-disabled');
});
