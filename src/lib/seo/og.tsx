import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { site } from './site';

/**
 * The share card, in one place.
 *
 * File-based `opengraph-image` does NOT cascade to nested segments — a card
 * defined at the app root covers `/` and nothing below it. So every segment
 * needs its own, and the only way that stays consistent is if they all render
 * through here. `npm run seo` fails any route that ends up without one.
 *
 * Satori, which renders this, is not a browser: it supports a subset of CSS,
 * and it rejects any element with more than one child that has no explicit
 * `display`. Compose strings before interpolating them rather than writing
 * `{a} — {b}`, which is three children.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/** The dark-ground logo file (731 × 396), read once, at build. */
const LOGO = { width: 731, height: 396 };
const logoSrc = `data:image/png;base64,${await readFile(
  join(process.cwd(), 'public/brand/flash-logo-for-dark-bg.png'),
  'base64',
)}`;
const LOGO_HEIGHT = 84;

/**
 * Manrope, the site's typeface, as static WOFF (Satori reads TTF, OTF and
 * WOFF, not WOFF2 or variable fonts). Latin subset, from Fontsource.
 */
const font = (weight: 500 | 800) => readFile(join(process.cwd(), `src/lib/seo/fonts/manrope-latin-${weight}.woff`));
const fonts = [
  { name: 'Manrope', data: await font(500), weight: 500 as const, style: 'normal' as const },
  { name: 'Manrope', data: await font(800), weight: 800 as const, style: 'normal' as const },
];

/**
 * The logo names the brand, so an eyebrow that opens with it ("Flash Weather
 * AI · FAQ") drops that part, and one that is only the name drops out.
 */
const brandPrefix = new RegExp(`^${site.name}\\s*(?:[·—-]\\s*)?`);

export function ogImage({
  eyebrow,
  headline,
  footer,
}: {
  eyebrow: string;
  headline: string;
  footer: string;
}) {
  const label = eyebrow.replace(brandPrefix, '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#070D26',
          backgroundImage: 'radial-gradient(70% 90% at 100% 0%, rgba(230, 186, 45, 0.16) 0%, rgba(7, 13, 38, 0) 100%)',
          color: '#FFFFFF',
          padding: '64px 80px 72px',
          fontFamily: 'Manrope',
          fontWeight: 500,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders <img>, not next/image */}
        <img
          src={logoSrc}
          alt=""
          height={LOGO_HEIGHT}
          width={Math.round((LOGO_HEIGHT * LOGO.width) / LOGO.height)}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {label && (
            <div style={{ fontSize: 26, letterSpacing: 4, color: '#E6BA2D', textTransform: 'uppercase' }}>{label}</div>
          )}
          <div style={{ fontSize: 68, lineHeight: 1.05, letterSpacing: -2.5, maxWidth: 1000, fontWeight: 800 }}>
            {headline}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 48, height: 4, background: '#E6BA2D' }} />
          <div style={{ fontSize: 24, color: '#AEB8C7' }}>{footer}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
