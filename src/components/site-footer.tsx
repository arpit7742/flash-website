import { SiteLink } from '@/components/site-link';

import { DEMO_HREF, footerNav, legalNav } from '@/content/navigation';
import { site } from '@/lib/seo/site';

import { ButtonLink } from './button';
import { Magnetic } from './finale/magnetic';
import { SiteMap } from './finale/site-map';
import { Logo } from './logo';
import { Motion } from './motion';

const socialLinks = [
  { label: 'LinkedIn', href: site.social.linkedin },
  { label: 'YouTube', href: site.social.youtube },
  { label: 'X', href: site.social.x },
  { label: 'Instagram', href: site.social.instagram },
  { label: 'Facebook', href: site.social.facebook },
  { label: 'TikTok', href: site.social.tiktok },
];

/**
 * How every page ends (C04 + C05): the closing band, then the footer, as
 * one piece. Each page renders it after its <main>.
 *
 * The band's copy is the home page's unless a page gives its own `eyebrow`,
 * `heading` or `body` (Pricing, an industry asking about its own sites).
 * Everything else is the same on every page: the two buttons, the map, the
 * layout, the footer and its links, and the motion (styles/finale.css):
 *   - hard edges: the band meets the section above it and the footer below
 *     without a blend
 *   - no entrance: the band's copy, buttons and map pins and the whole
 *     footer are always there, never revealed on scroll (an entrance that
 *     misses its moment leaves the end of the page blank)
 *   - over the map a storm drifts across the pins, looping while it is in
 *     view (the only motion, on the shared .motion system)
 *   - "Book a demo" leans towards the mouse
 * With reduced motion or no JavaScript it is still.
 *
 * `cta={false}` leaves the band out, for the few pages where a sales ask
 * does not belong (a post in memory of someone). The footer is unchanged.
 *
 * The footer's links are the site's second full internal-link graph: every
 * page reaches every hub. Under its last row it keeps room for the Flash
 * Agent widget (styles/agent-widget.css), so the widget never covers it.
 */
export function SiteFooter({
  eyebrow = 'Live demo · No sensors required for the forecast',
  heading = 'See your own sites on the map before the next storm.',
  body = "We'll load your locations, replay last season's strikes against Flash's predictions, and show you the alert log your safety officer would have received.",
  cta = true,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  cta?: boolean;
}) {
  return (
    // data-header-tone: the fixed header takes this tone while it is over
    // the ending (components/site-header.tsx).
    <div data-header-tone="dark">
      {cta && (
        <section aria-labelledby="cta-band-heading" className="bg-brand-blue pt-14 lg:pt-[88px]">
          <Motion replay={false} threshold={0.3} className="motion cta-finale-in">
            <div className="container-page relative z-[1] flex flex-col gap-8 pt-6 pb-2 lg:pt-8 lg:pb-[72px]">
              <div className="flex max-w-[720px] flex-col gap-[14px] lg:max-w-[520px] xl:max-w-[640px]">
                <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-viz-gold uppercase md:text-micro md:tracking-label-wide">
                  {eyebrow}
                </p>
                <h2
                  id="cta-band-heading"
                  className="text-[30px] leading-[34px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-[36px] md:leading-[44px]"
                >
                  {heading}
                </h2>
                <p className="text-[15px] leading-[22px] text-pretty text-[#C7D2F0] md:text-[17px] md:leading-h4">
                  {body}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Magnetic className="cta-magnet flex">
                  <ButtonLink href={DEMO_HREF} variant="gold" className="grow">
                    Book a demo
                  </ButtonLink>
                </Magnetic>
                <ButtonLink href="/pricing/" variant="outline-dark">
                  See pricing
                </ButtonLink>
              </div>
            </div>
            <div className="cta-map">
              <SiteMap className="size-full" />
            </div>
          </Motion>
        </section>
      )}

      <footer className="site-footer bg-brand-navy">
        <div className="container-page flex flex-col gap-12 pt-16 pb-14 lg:flex-row">
          <div className="footer-col flex flex-col gap-5 lg:w-[300px] lg:shrink xl:shrink-0">
            <Logo variant="dark" size="footer" />
            <p className="text-body-s leading-5 text-text-on-dark-muted md:leading-body-s">
              AI that predicts lightning and hail before they strike. Founded by a 20-year National Weather Service
              meteorologist.
            </p>
            <ul className="flex flex-col gap-1 text-body-s leading-5 md:leading-caption">
              <li>
                <a href={`mailto:${site.salesEmail}`} className="text-text-on-dark hover:underline">
                  {site.salesEmail}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="text-text-on-dark-muted hover:text-text-on-dark">
                  {site.email}
                </a>
              </li>
            </ul>
            <SiteLink
              href={site.appDownloadUrl}
              className="inline-flex h-11 w-fit items-center gap-2 rounded-xs border border-white/25 px-4 text-caption font-bold text-text-on-dark hover:bg-white/5"
            >
              Download the free app <span aria-hidden>↗</span>
            </SiteLink>
            <ul aria-label="Flash Weather on social media" className="flex flex-wrap gap-x-4 gap-y-2 text-caption">
              {socialLinks.map((s) => (
                <li key={s.href}>
                  <SiteLink href={s.href} rel="me" className="text-text-on-dark-muted hover:text-text-on-dark">
                    {s.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            className="grid grow grid-cols-2 gap-x-12 gap-y-10 md:grid-cols-4"
          >
            {footerNav.map((group) => (
              <div key={group.label} className="footer-col flex flex-col gap-3">
                {/* A label, not a heading: the page's outline is its own H2s. */}
                <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-viz-gold uppercase md:leading-[14px]">
                  {group.label}
                </p>
                <ul className="flex flex-col gap-3">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <SiteLink
                        href={item.href}
                        className="text-body-s leading-caption text-text-on-dark-muted hover:text-text-on-dark"
                      >
                        {item.label}
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-border-on-dark">
          <div className="container-page flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-micro text-neutral-500 md:text-caption md:leading-micro">
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-x-7 gap-y-2 text-micro md:text-caption md:leading-micro">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <SiteLink href={item.href} className="text-neutral-500 hover:text-text-on-dark-muted">
                    {item.label}
                  </SiteLink>
                </li>
              ))}
              <li>
                <SiteLink href={site.appUrl} className="text-neutral-500 hover:text-text-on-dark-muted">
                  Customer log in
                </SiteLink>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
