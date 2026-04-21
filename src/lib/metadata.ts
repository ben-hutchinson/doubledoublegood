import type { Metadata } from 'next';

import { businessDetails } from '@/lib/site-content';

const metadataBase = new URL(businessDetails.canonicalSiteUrl);

export function createPageMetadata(
  title: string,
  description: string,
  pathname: string,
): Metadata {
  const normalizedPath =
    pathname === '/' ? '/' : `${pathname.replace(/\/$/, '')}/`;
  const pageTitle =
    normalizedPath === '/'
      ? `${businessDetails.name} | ${businessDetails.headline}`
      : `${title} | ${businessDetails.name}`;

  return {
    title: pageTitle,
    description,
    metadataBase,
    icons: {
      icon: '/icon.png',
      shortcut: '/icon.png',
      apple: '/icon.png',
    },
    alternates: {
      canonical: normalizedPath,
    },
    openGraph: {
      title: pageTitle,
      description,
      type: 'website',
      url: normalizedPath,
      siteName: businessDetails.name,
      locale: 'en_GB',
    },
  };
}
