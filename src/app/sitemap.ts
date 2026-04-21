import type { MetadataRoute } from 'next';

import { businessDetails, siteRoutes } from '@/lib/site-content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes.map((route) => ({
    url: `${businessDetails.canonicalSiteUrl}${route === '/' ? '' : route}`,
    lastModified: new Date(),
  }));
}
