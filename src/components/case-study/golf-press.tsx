import { SiteLink } from '@/components/site-link';

import { Kicker } from '@/components/why-flash/section-heading';
import { troon } from '@/content/case-studies';
import { pressLinks } from '@/content/press-links';

/**
 * "In the golf press": four outbound pieces the golf trade and Golfweek have
 * published, one link each, and a line for the webinar and the podcast. Sits
 * before Keep reading; "All coverage" keeps the rest on the press page.
 */
export function GolfPressBand() {
  const { golfPress } = troon;
  return (
    <section aria-labelledby="golf-press-heading" className="border-t border-border bg-neutral-0">
      <div className="container-page flex flex-col gap-8 py-20 lg:py-28">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex flex-col gap-[14px]">
            <Kicker>{golfPress.label}</Kicker>
            <h2
              id="golf-press-heading"
              className="max-w-[820px] text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1"
            >
              {golfPress.heading}
            </h2>
          </div>
          <SiteLink
            href={golfPress.allLink.href}
            className="inline-flex min-h-11 items-center text-body-s leading-5 font-semibold text-brand-blue hover:underline lg:shrink-0"
          >
            {golfPress.allLink.label} <span aria-hidden>&nbsp;→</span>
          </SiteLink>
        </div>

        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {golfPress.cards.map((card) => {
            const link = pressLinks[card.id];
            return (
              <li key={card.id} className="flex">
                <SiteLink
                  href={link.href}
                  className="flex w-full flex-col gap-3 rounded-[20px] border border-border bg-neutral-0 p-6 shadow-[0_1px_2px_#0B13220D,0_12px_32px_#0B13220F] transition hover:-translate-y-0.5 hover:border-border-strong"
                >
                  <span className="text-micro font-semibold tracking-label text-gold-on-light uppercase">{card.kind}</span>
                  <span className="text-body-s leading-5 text-text-muted">{card.outlet}</span>
                  <h3 className="text-[19px] leading-[26px] font-bold tracking-heading text-pretty text-text">{card.title}</h3>
                  <span className="mt-auto text-body-s leading-5 text-text-muted">
                    <time dateTime={link.date}>{link.dateLabel}</time> <span aria-hidden>↗</span>
                    <span className="sr-only"> (opens {link.outlet} in a new tab)</span>
                  </span>
                </SiteLink>
              </li>
            );
          })}
        </ul>

        <p className="text-body-s leading-5 text-text-muted">
          {golfPress.footline.map((item, i) => (
            <span key={item.id}>
              {i > 0 && ', and '}
              <SiteLink href={pressLinks[item.id].href} className="font-medium text-brand-blue hover:underline">
                {item.text} <span aria-hidden>↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </SiteLink>
            </span>
          ))}
          .
        </p>
      </div>
    </section>
  );
}
