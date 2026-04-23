import { businessDetails, socialLinks } from '@/lib/site-content';
import { getTrustedExternalUrl, trustedHostnames } from '@/lib/security';

export function getLocalBusinessSchema() {
  const metadataBase = new URL(businessDetails.canonicalSiteUrl);
  const image = new URL('/shopfront.jpg', metadataBase).toString();
  const logo = new URL('/double-double-good-logo.jpg', metadataBase).toString();
  const mapUrl = getTrustedExternalUrl(businessDetails.mapEmbedUrl, {
    allowedHostnames: trustedHostnames.mapEmbed,
  });
  const sameAs = Array.from(
    new Set(
      socialLinks
        .map((link) => link.href.trim())
        .map((href) => getTrustedExternalUrl(href))
        .filter(Boolean),
    ),
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicStore',
    name: businessDetails.name,
    description: businessDetails.headline,
    image,
    logo,
    telephone: businessDetails.phone,
    email: businessDetails.email,
    url: businessDetails.canonicalSiteUrl,
    ...(mapUrl ? { hasMap: mapUrl } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessDetails.addressLine1,
      addressLocality: businessDetails.city,
      postalCode: businessDetails.postcode,
      addressCountry: 'GB',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: businessDetails.phone,
        email: businessDetails.email,
        areaServed: 'GB',
        availableLanguage: 'en-GB',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Tuesday',
        opens: '10:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Wednesday',
        opens: '10:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Thursday',
        opens: '10:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '10:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '17:00',
      },
    ],
    sameAs,
  };
}
