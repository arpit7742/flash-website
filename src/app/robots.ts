import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

import { absoluteUrl, isIndexableHost, site } from '@/lib/seo/site';

/**
 * Crawl rules, and the pointer to the sitemap.
 *
 * Every host but the production domain is closed to crawlers entirely:
 * preview deployments, and flashweather.vercel.app, which serves the same
 * production build as flashweather.ai. An indexable copy competes with
 * production for the same content and usually wins the wrong URL into the
 * results -- and no canonical will save you once it has been crawled. So
 * this reads the request's host, which makes it per request; only crawlers
 * ask for it. The X-Robots-Tag header (next.config.ts) and the robots meta
 * (root layout) close the same hosts.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');

  if (!isIndexableHost(host)) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Nothing here is secret; these are just routes with no search value.
      disallow: ['/api/', '/_next/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: site.url,
  };
}
