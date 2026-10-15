import { SiteLink } from '@/components/site-link';

/**
 * Buttons, per the component sheet (C04): 54px tall, 4px radius, Manrope 800
 * at 14/18 with 0.02em tracking, sentence case. `hero` is the home hero's
 * smaller 13/16 set. Always links -- every CTA on a marketing site goes somewhere,
 * and an <a> is what a crawler follows.
 *
 * Where it opens is <SiteLink>'s rule: a button that leads to another website
 * opens in a new tab, and one that stays on the site opens in place.
 * `newTab` overrides. A `download` button is a plain <a download> to one of
 * our own files: it saves the file, in place, and never opens a tab.
 */

const variants = {
  /** Gold on dark grounds. The primary action. */
  gold: 'bg-gold-button text-brand-navy hover:brightness-[1.06]',
  /** Secondary on dark grounds. */
  'outline-dark': 'border border-white/45 text-text-on-dark hover:bg-white/8',
  /** Primary on light grounds. */
  blue: 'bg-brand-blue text-text-on-dark hover:bg-brand-blue-hover',
  /** Secondary on light grounds. */
  'outline-light': 'border border-border-strong text-brand-navy hover:bg-neutral-50',
} as const;

const sizes = {
  md: 'h-[54px] px-[22px] text-body-s leading-caption tracking-[0.02em]',
  hero: 'h-[54px] px-[22px] text-caption leading-micro',
  sm: 'h-[44px] px-5 text-body-s leading-caption tracking-[0.02em]',
} as const;

export function ButtonLink({
  href,
  children,
  variant = 'gold',
  size = 'md',
  icon,
  newTab,
  download,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** A trailing glyph such as ↗ or →; hidden from screen readers. */
  icon?: string;
  /** Force the answer <SiteLink> would otherwise give: opens in a new tab, or does not. */
  newTab?: boolean;
  /** The link saves the file it points at (one of ours) instead of opening it. */
  download?: boolean;
  className?: string;
}) {
  const classes = `inline-flex shrink-0 items-center justify-center gap-[14px] rounded-xs font-extrabold transition ${variants[variant]} ${sizes[size]} ${className}`;

  if (download)
    return (
      <a href={href} download className={classes}>
        {children}
        {icon && <span aria-hidden>{icon}</span>}
      </a>
    );

  return (
    <SiteLink href={href} className={classes} newTab={newTab}>
      {children}
      {icon && <span aria-hidden>{icon}</span>}
    </SiteLink>
  );
}
