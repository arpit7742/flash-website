import type { Metadata, Viewport } from 'next';
import { Manrope, Orbitron } from 'next/font/google';

import { AgentWidget } from '@/components/agent-widget';
import { PageTransition } from '@/components/page-transition';
import { SmoothScroll } from '@/components/smooth-scroll';
import { AGENT_WIDGET_ENABLED } from '@/content/agent-widget';
import { JsonLd, organizationSchema, websiteSchema } from '@/lib/seo/jsonld';
import { absoluteUrl, deploymentUrl, isProductionBuild, PRODUCTION_HOST, site } from '@/lib/seo/site';

import './globals.css';

// Self-hosted by next/font: no request to Google at runtime, no layout shift
// from a late swap. The logo is an image now; Orbitron (`font-logo`) is left
// for one display label, so it keeps just two weights.
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], display: 'swap' });
const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
});

/**
 * The defaults every route inherits.
 *
 * `metadataBase` is the one that has to be right: without it, every relative
 * OG image and canonical resolves against localhost, and Next warns rather
 * than fails, so it ships broken. It is the deployment's own origin
 * (`deploymentUrl`), so the OG and Twitter image URLs resolve on the host
 * that serves the page; canonicals are absolute and stay on `site.url`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(deploymentUrl),
  title: {
    default: site.title,
    // Child routes set only their own title; the suffix is applied here so no
    // page has to remember it and none can spell it differently.
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: site.title,
    description: site.description,
  },
  twitter: { card: 'summary_large_image', site: site.twitter, creator: site.twitter },
  // A preview deployment is closed on every host. The production build is
  // open here, and closed on its other hosts by the header, robots.txt and
  // the script in <head> below.
  robots: isProductionBuild ? {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google use full-size previews and untruncated snippets rather
      // than the conservative defaults it falls back to.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  } : { index: false, follow: false, googleBot: { index: false, follow: false } },
  formatDetection: { telephone: false, address: false, email: false },
};

const noIndexElsewhere = `if(location.hostname!==${JSON.stringify(PRODUCTION_HOST)}){var m=document.createElement('meta');m.name='robots';m.content='noindex, nofollow';document.head.appendChild(m)}`;

export const viewport: Viewport = {
  // Brand navy: most pages open on a navy nav bar.
  themeColor: '#070D26',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The font variables go on <html>, not <body>: Tailwind declares
    // `--font-sans: var(--font-manrope)` on :root, and a var() that is not
    // defined at :root resolves to nothing, dropping every page to the
    // system font stack.
    <html lang={site.lang} className={`${manrope.variable} ${orbitron.variable}`}>
      {isProductionBuild && (
        <head>
          {/* The production build is prerendered once and served on every
              host, so its robots meta says "index". On any host but the
              production domain (flashweather.vercel.app) this adds a
              "noindex, nofollow" one, the stricter of the two. The
              X-Robots-Tag header (next.config.ts) is the server-side
              signal; this is the in-page one. */}
          <script dangerouslySetInnerHTML={{ __html: noIndexElsewhere }} />
        </head>
      )}
      <body className="antialiased">
        {/* Once, here. Organization and WebSite describe the site as a whole,
            so repeating them per page would assert the same entity twice. */}
        <JsonLd schema={organizationSchema()} />
        <JsonLd schema={websiteSchema()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xs focus:bg-neutral-0 focus:px-4 focus:py-2 focus:text-body-s focus:font-bold focus:text-brand-navy"
        >
          Skip to content
        </a>
        {/* Each page renders its own <SiteHeader> (dark on hero pages, light
            on reading pages, as the page's design draws it), its own
            <main id="main"> and, after it, the <SiteFooter> every page ends
            on, with its own closing copy where it has some. <PageTransition>
            fades the old page out when the route changes. */}
        <PageTransition>{children}</PageTransition>
        {AGENT_WIDGET_ENABLED && <AgentWidget />}
        <SmoothScroll />
      </body>
    </html>
  );
}
