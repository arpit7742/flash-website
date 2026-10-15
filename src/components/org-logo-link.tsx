import { SiteLink } from '@/components/site-link';
import { logoLinkFor, type LogoLink } from '@/content/logo-links';

/**
 * Every press, partner and customer logo on the site goes through this: the
 * whole logo is one link to that organization's own page about Flash
 * (content/logo-links.ts), in a new tab. <SiteLink> adds the target, the
 * `rel="noopener noreferrer"` and the "(opens in a new tab)" that ends the
 * label, so the label reads "<Organization> on Flash: <page title> (opens in
 * a new tab)". The logo's own alt text stays "<Organization> logo".
 *
 * `link` overrides the organization's entry for a logo tied to one story.
 * With no verified page, the logo renders unlinked, in the same box, never
 * pointing at a homepage. No hover effect, no arrow, no underline; keyboard
 * focus draws the site's 2px ring, in brand blue on light grounds and
 * viz-gold on dark ones.
 */
export function OrgLogoLink({
  org,
  link = logoLinkFor(org),
  tone = 'light',
  inset = false,
  className = '',
  children,
}: {
  /** The organization's name as the site prints it; the key into content/logo-links.ts. */
  org: string;
  link?: LogoLink | null;
  tone?: 'light' | 'dark';
  /** Draw the focus ring inside the box, for a logo in a scrolling row that would clip a ring outside it. */
  inset?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (!link) return <span className={className}>{children}</span>;

  const ring = tone === 'dark' ? 'focus-visible:outline-viz-gold' : 'focus-visible:outline-brand-blue';
  return (
    <SiteLink
      href={link.url}
      newTab
      aria-label={`${link.name} on Flash: ${link.pageTitle}`}
      className={`rounded-sm focus-visible:outline-2 ${inset ? 'outline-offset-[-2px]' : 'outline-offset-4'} ${ring} ${className}`}
    >
      {children}
    </SiteLink>
  );
}
