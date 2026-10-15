/**
 * One source of truth for everything the site says about itself.
 *
 * Every piece of SEO output — metadata, canonicals, sitemap, robots, JSON-LD,
 * OG images — reads from here. Change the domain in one place and the whole
 * surface follows. Nothing below should be duplicated into a component.
 */

/** The production origin: the one host search engines should index. */
export const PRODUCTION_URL = 'https://flashweather.ai';
export const PRODUCTION_HOST = new URL(PRODUCTION_URL).host;

export const site = {
  name: 'Flash Weather',
  /** The company record, as the Contact page states it. */
  legalName: 'Flash Scientific Technology Inc.',
  address: { addressLocality: 'Canton', addressRegion: 'GA', addressCountry: 'US' },
  /** Used where a short label reads better than the full name. */
  shortName: 'Flash',
  /**
   * No trailing slash. `metadataBase` is built from this, and Next composes
   * relative paths against it — a trailing slash produces `//path`.
   *
   * Read from the environment so preview deploys canonicalise to themselves
   * rather than to production, which is what stops Google indexing a preview.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_URL).replace(/\/$/, ''),
  /**
   * Under 60 characters INCLUDING the ` | Flash Weather` suffix the root
   * layout appends, or Google truncates it. `npm run seo` measures the
   * rendered title, not this string, which is the only measurement that counts.
   */
  title: 'Predict lightning and hail before they strike',
  /** 150–160 characters. Longer is cut off; shorter wastes the slot. */
  description:
    'Flash Weather predicts lightning and hail up to an hour ahead at 1×1 km resolution, so outdoor operations clear, cover and resume on evidence.',
  locale: 'en_US',
  /** BCP 47, for <html lang>. Deliberately not the same shape as `locale`. */
  lang: 'en',
  twitter: '@FLASHWeatherAI',
  email: 'support@flashweather.ai',
  /* No foundingDate: sources disagree (2015 vs 2020), so the site states none until it is confirmed. */
  /** Sales and demo requests, as the live site publishes it. */
  salesEmail: 'sales@flashweather.ai',
  /** The customer app behind "Log in" (as linked from the live site). */
  appUrl: 'https://app.flashweather.ai/',
  /** Developer documentation for the Flash API. */
  apiDocsUrl: 'https://api.flashweather.ai/docs/',
  /** One link that sends phones to the right app store. */
  appDownloadUrl: 'https://onelink.to/flashweather',
  /**
   * Sameas links for the Organization schema. Search engines use these to
   * reconcile the site with the entity it belongs to.
   */
  social: {
    linkedin: 'https://www.linkedin.com/company/flash-weather/',
    x: 'https://x.com/FLASHWeatherAI',
    youtube: 'https://www.youtube.com/@flashweather',
    instagram: 'https://www.instagram.com/flashweatherai/',
    facebook: 'https://www.facebook.com/FLASHWeatherAI',
    tiktok: 'https://www.tiktok.com/@flashweatherai',
  },
} as const;

/**
 * An absolute URL for a path.
 *
 * Canonicals, sitemap entries and JSON-LD all need fully qualified URLs, and
 * hand-concatenating them is how you end up with a canonical pointing at
 * localhost in production.
 */
export function absoluteUrl(path = '/'): string {
  return new URL(path, site.url).toString();
}

/**
 * Whether this build is the production deployment. Vercel says so in
 * VERCEL_ENV; a build made anywhere else (a local `next build`, CI) counts as
 * production so it can be audited as one, and the host check below still
 * keeps localhost out of the index.
 */
export const isProductionBuild = (process.env.VERCEL_ENV ?? 'production') === 'production';

/**
 * Whether a request's host may be indexed: only the production domain, and
 * only on the production deployment. flashweather.vercel.app serves the same
 * build as flashweather.ai, so the build alone cannot tell them apart.
 */
export function isIndexableHost(host: string | null | undefined): boolean {
  return isProductionBuild && host?.split(':')[0].toLowerCase() === PRODUCTION_HOST;
}

/**
 * The origin this deployment answers on, for absolute asset URLs: the OG and
 * Twitter images (`metadataBase`). Not the canonical, which is always
 * `site.url`.
 *
 * Pages are prerendered, so one URL is baked into the HTML that every host
 * of the deployment serves. In production that is the project's production
 * domain, which Vercel gives as the shortest custom domain, or the vercel.app
 * one while there is none: flashweather.ai once it is added to the project,
 * flashweather.vercel.app until then, so a link shared before the switch
 * still gets its image. A preview uses its own deployment URL.
 */
export const deploymentUrl = (() => {
  const { VERCEL_ENV, VERCEL_URL, VERCEL_PROJECT_PRODUCTION_URL } = process.env;
  if (VERCEL_ENV === 'production' && VERCEL_PROJECT_PRODUCTION_URL) return `https://${VERCEL_PROJECT_PRODUCTION_URL}`;
  if (VERCEL_ENV && VERCEL_ENV !== 'production' && VERCEL_URL) return `https://${VERCEL_URL}`;
  return site.url;
})();
