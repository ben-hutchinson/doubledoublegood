import type { Metadata } from 'next';

import { businessDetails } from '@/lib/site-content';

const metadataBase = new URL(businessDetails.canonicalSiteUrl);
const ogImageUrl = new URL('/shopfront.jpg', metadataBase).toString();
const ogImageAlt = 'Double Double Good shopfront at the Ancient High House';

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
    referrer: 'strict-origin-when-cross-origin',
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
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 1600,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImageUrl],
    },
  };
}
