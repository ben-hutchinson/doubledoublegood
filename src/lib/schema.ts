import { businessDetails } from '@/lib/site-content';

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicStore',
    name: businessDetails.name,
    description: businessDetails.headline,
    telephone: businessDetails.phone,
    email: businessDetails.email,
    url: businessDetails.canonicalSiteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessDetails.addressLine1,
      addressLocality: businessDetails.city,
      postalCode: businessDetails.postcode,
      addressCountry: 'GB',
    },
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
    sameAs: [],
  };
}
