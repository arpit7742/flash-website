import { SiteLink } from '@/components/site-link';

import { Motion } from '@/components/motion';
import { type TextLink, type WhyFlashKey, whyFlashOrder, whyFlashPages } from '@/content/why-flash';

import { Kicker } from './section-heading';

/**
 * "More in Why Flash": the section read as a series (styles/why-flash-series.css).
 * Left to right from lg: the page you are on (muted, a check, aria-current,
 * not a link), the next page in `whyFlashOrder` as the large navy card with
 * "Read next", then the others, in series order, as smaller cards. The page's
 * own outbound links follow as a text row. Every page in the section still
 * links to every other, so none depends on the nav alone to be reached.
 *
 * Phones: stacked, the primary card first, the smaller cards full width, and
 * "You're here" under them as one muted line; from sm the two smaller cards
 * share a row.
 *
 * It fades up once as it scrolls in (Motion, the shared fail-safe trigger),
 * item by item 60ms apart, then the text row. Reduced motion shows it at rest.
 */
export function WhyFlashLinks({
  current,
  extra = [],
  heading = 'More in Why Flash',
}: {
  current: WhyFlashKey;
  extra?: TextLink[];
  heading?: string;
}) {
  const at = whyFlashOrder.indexOf(current);
  const [next, ...rest] = whyFlashOrder
    .map((_, i) => whyFlashOrder[(at + 1 + i) % whyFlashOrder.length])
    .filter((key) => key !== current)
    .map((key) => whyFlashPages[key]);
  const here = whyFlashPages[current];

  return (
    <nav aria-label={heading} className="border-t border-border bg-neutral-0">
      <div className="container-page flex flex-col gap-7 py-16 lg:gap-8 lg:py-20">
        <div className="flex flex-col gap-3">
          <Kicker>Keep reading</Kicker>
          {/* A label, not a heading: the page outline is the design's H2s. */}
          <p className="text-h3 leading-h3 font-extrabold tracking-[-0.02em] text-text md:text-[28px] md:leading-[34px]">
            {heading}
          </p>
        </div>

        <Motion className="motion wfn flex flex-col gap-7 lg:gap-8" replay={false} threshold={0.2}>
          <ol className="flex flex-wrap gap-3 lg:flex-nowrap lg:items-end lg:gap-6">
            <li
              aria-current="page"
              data-step="0"
              className="wfn-step order-last flex w-full items-center gap-2.5 pt-2 text-text-muted lg:order-none lg:w-[168px] lg:shrink-0 lg:flex-col lg:items-start lg:pt-0 lg:pb-6"
            >
              <span aria-hidden className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6.2 5 8.5l4.5-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {/* One line of text on a phone; from lg the name and the note stack. */}
              <span className="min-w-0 lg:contents">
                <span className="text-[15px] leading-[21px] font-semibold">{here.label}</span>{' '}
                <span className="text-caption leading-caption font-medium whitespace-nowrap">
                  <span aria-hidden className="lg:hidden">
                    ·{' '}
                  </span>
                  You’re here
                </span>
              </span>
            </li>

            <li data-step="1" className="wfn-step flex w-full lg:w-[500px] lg:shrink-0">
              <SiteLink
                href={next.path}
                className="wfn-card wfn-primary flex w-full flex-col justify-between gap-7 rounded-[16px] bg-brand-navy p-6 lg:gap-10 lg:p-8"
              >
                <span className="flex flex-col gap-[14px]">
                  <span className="text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">Up next</span>
                  <span className="text-[24px] leading-[30px] font-extrabold tracking-[-0.03em] text-text-on-dark lg:text-[30px] lg:leading-[36px]">
                    {next.label}
                  </span>
                  <span className="text-body leading-body text-text-on-dark-muted">{next.blurb}</span>
                </span>
                <span className="flex items-center gap-2 text-[15px] leading-5 font-extrabold text-text-on-dark">
                  Read next
                  <span aria-hidden className="wfn-arrow text-body leading-5 text-viz-gold">
                    →
                  </span>
                </span>
              </SiteLink>
            </li>

            {/* The smaller cards share a row, so they always match each other's height. */}
            <li className="flex w-full grow lg:w-auto lg:min-w-0">
              <ul className="flex w-full flex-wrap gap-3 lg:flex-nowrap lg:gap-6">
                {rest.map((page, i) => (
                  <li key={page.path} data-step={i + 2} className="wfn-step flex grow basis-[240px] lg:basis-0">
                    <SiteLink
                      href={page.path}
                      className="wfn-card wfn-small flex w-full flex-col justify-between gap-[14px] rounded-[16px] border border-border bg-neutral-0 px-5 pt-[22px] pb-5 lg:gap-6 lg:px-6 lg:pt-7 lg:pb-6"
                    >
                      <span className="flex flex-col gap-2.5">
                        <span className="text-h4 leading-[26px] font-extrabold tracking-[-0.01em] text-text">
                          {page.label}
                        </span>
                        <span className="text-body-s leading-body-s text-text-muted">{page.blurb}</span>
                      </span>
                      <span aria-hidden className="wfn-arrow text-body leading-5 font-extrabold text-brand-blue">
                        →
                      </span>
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </li>
          </ol>

          {extra.length > 0 && (
            <div
              data-step={rest.length + 2}
              className="wfn-step flex flex-wrap items-center gap-x-5 border-t border-border pt-4 lg:gap-x-7"
            >
              <p className="w-full pt-2 text-body-s leading-5 font-medium text-text-muted lg:w-auto lg:pt-0">
                The products behind it
              </p>
              <ul className="flex flex-wrap gap-x-5 lg:gap-x-7">
                {extra.map((item) => (
                  <li key={item.href + item.label}>
                    <SiteLink
                      href={item.href}
                      className="inline-flex min-h-11 items-center text-body-s leading-5 font-bold text-brand-blue hover:underline"
                    >
                      {item.label}
                      <span aria-hidden>&nbsp;→</span>
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Motion>
      </div>
    </nav>
  );
}
