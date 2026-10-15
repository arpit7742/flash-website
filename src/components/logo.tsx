import Image from 'next/image';
import { SiteLink } from '@/components/site-link';

import { site } from '@/lib/seo/site';

/**
 * The two cleaned logo files, one per background, as 480px WebP (about 23 KB,
 * against 115 KB for the 731px PNG they are made from): no logo is drawn
 * wider than about 150 CSS px, so this covers a 3x screen, and the header's
 * copy is preloaded beside the hero image on every page. The PNG masters
 * stay in /public/brand for the OG images (lib/seo/og.tsx). `v` busts caches
 * still holding an older file at the same path; bump it when the art changes.
 */
const files = {
  dark: { src: '/brand/flash-logo-for-dark-bg.webp?v=4', width: 480, height: 260 },
  light: { src: '/brand/flash-logo-for-light-bg.webp?v=4', width: 480, height: 260 },
} as const;

/** Height only; the width follows the file's own aspect ratio. */
const sizes = {
  nav: 'h-11 md:h-14',
  /** The fixed header's: 44 / 56px, 48 once it compacts (styles/header.css). */
  header: 'site-header-logo-img',
  footer: 'h-20',
  /** The Flash Agent window's title bar (styles/agent-window.css). */
  window: 'h-[26px] md:h-8',
  /** The slim title bar of a video framed as an app window (styles/video-player.css). */
  bar: 'h-[18px] md:h-5',
  /** The agent's name on its messages in that window. */
  chat: 'h-[22px] md:h-[26px]',
  /** The Flash column's header in the comparison tables. */
  column: 'h-[30px]',
  /** The same column label on a stacked comparison card, below md. */
  label: 'h-[22px]',
  /** The Intelligence row of the home catalogue's phone accordion (styles/home-catalogue-strips.css). */
  strip: 'h-9',
} as const;

/**
 * The self-hosted logo, a link home -- it is how every page links to `/`.
 * Pick the variant by the background it sits on: `dark` for navy grounds,
 * `light` for white ones.
 *
 * `link={false}` is the logo as a mark inside something else (the Flash
 * Agent window names the agent with it), where a link home would be out of
 * place; `alt` then says what it stands for there.
 *
 * `decorative` is a repeat of the logo that adds nothing to what the page
 * already says (a window's title bar, a sticker, a stacked card's label): its
 * alt is empty, so a screen reader does not announce the brand again, and it
 * is never a link, since a link needs a name. The header's logo, the link
 * home, keeps its alt, "Flash Weather".
 *
 * `themed` is for a logo whose ground can change under it (the fixed header
 * of a light page, which turns dark over the page's ending): both files are
 * in the markup, marked `logo-for-dark` and `logo-for-light`, and the
 * stylesheet shows the one for the theme in force (styles/header.css).
 * `variant` is still the one the page opens on, and the one loaded first.
 *
 * `unoptimized` serves the PNG as drawn: the optimizer would re-encode it
 * lossily, which is what puts a fringe on letter edges.
 */
export function Logo({
  variant,
  size = 'nav',
  priority = false,
  themed = false,
  decorative = false,
  link = !decorative,
  alt = decorative ? '' : site.name,
}: {
  variant: 'dark' | 'light';
  size?: keyof typeof sizes;
  /** The nav logo is above the fold on every page. */
  priority?: boolean;
  themed?: boolean;
  decorative?: boolean;
  link?: boolean;
  alt?: string;
}) {
  const shown = themed ? (['dark', 'light'] as const) : [variant];
  const images = shown.map((name) => (
    <Image
      key={name}
      src={files[name].src}
      alt={alt}
      width={files[name].width}
      height={files[name].height}
      unoptimized
      loading={priority && name === variant ? 'eager' : 'lazy'}
      className={`w-auto ${sizes[size]} ${themed ? `logo-for-${name}` : ''}`}
    />
  ));
  if (!link) return <span className="flex shrink-0 items-center">{images}</span>;
  return (
    <SiteLink href="/" className="flex shrink-0 items-center">
      {images}
    </SiteLink>
  );
}
