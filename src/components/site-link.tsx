import Link from 'next/link';

import { PRODUCTION_HOST, site } from '@/lib/seo/site';

type LinkProps = React.ComponentProps<typeof Link>;

/**
 * The site's link: <Link> plus the one rule about where it opens.
 *
 * A link that leads to another website -- any absolute `http(s)` URL whose
 * host is not this site's -- opens in a new tab, with
 * `rel="noopener noreferrer"` and "(opens in a new tab)" for screen readers
 * (appended to `aria-label` too, when a link has one, since the label
 * replaces the content as the accessible name). Every link within the site
 * opens in place. This component is the single place that rule lives;
 * nothing else in `src` renders a bare next/link <Link> or a navigating <a>.
 * Raw <a> is only for in-page anchors (`#…`), `mailto:`, `tel:` and
 * downloads of our own files (`<a download>`, which save in place and never
 * open a tab).
 *
 * `newTab` overrides the rule either way, if a link ever has to.
 *
 * The anchor is real and carries a real `target`, so a middle-click or a
 * Cmd/Ctrl-click behaves exactly as the browser means it to, and a
 * programmatic `.click()` (the industry panels follow their card's link that
 * way, components/home/industry-panels.tsx) does what a click would.
 */
export function SiteLink({ newTab, href, children, rel, ...props }: LinkProps & { newTab?: boolean }) {
  const open = newTab ?? isExternal(href);
  const label = props['aria-label'];

  return (
    <Link
      href={href}
      {...props}
      aria-label={open && label ? `${label} (opens in a new tab)` : label}
      target={open ? '_blank' : props.target}
      rel={open ? withRel(rel, 'noopener', 'noreferrer') : rel}
    >
      {children}
      {open && <span className="sr-only"> (opens in a new tab)</span>}
    </Link>
  );
}

const ownHosts = new Set([PRODUCTION_HOST, new URL(site.url).host]);

/** An absolute URL on a host that is not this site's. */
export function isExternal(href: LinkProps['href']): boolean {
  const value = typeof href === 'string' ? href : (href.href ?? '');
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    return !ownHosts.has(new URL(value).host);
  } catch {
    return false;
  }
}

function withRel(rel: string | undefined, ...tokens: string[]) {
  const set = new Set((rel ?? '').split(/\s+/).filter(Boolean));
  for (const token of tokens) set.add(token);
  return [...set].join(' ');
}
