import { SiteLink } from '@/components/site-link';

import { SectionHeader } from '@/components/products/section-header';
import { pressLinks } from '@/content/press-links';

import { heardAndRead } from './content';

/**
 * "Heard and read": three outbound pieces that explain lightning prediction,
 * on the sunken ground before the FAQ. Each card is one link to the original
 * (new tab); "All coverage" keeps the rest on the press page, so this page
 * stays about the product.
 */
export function HeardAndRead() {
  return (
    <section aria-labelledby="heard-and-read-heading" className="border-t border-border bg-surface-sunken">
      <div className="container-page flex flex-col gap-10 py-16 lg:py-[104px]">
        <SectionHeader
          id="heard-and-read-heading"
          label={heardAndRead.label}
          labelTone="muted-light"
          heading={heardAndRead.heading}
          size="md"
          aside={
            <SiteLink
              href={heardAndRead.allLink.href}
              className="inline-flex min-h-11 items-center text-body-s leading-5 font-semibold text-brand-blue hover:underline lg:justify-end"
            >
              {heardAndRead.allLink.label} <span aria-hidden>&nbsp;→</span>
            </SiteLink>
          }
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {heardAndRead.cards.map((card) => {
            const link = pressLinks[card.id];
            return (
              <li key={card.id} className="flex">
                <SiteLink
                  href={link.href}
                  className="flex w-full flex-col gap-3 rounded-[20px] border border-border bg-neutral-0 p-6 shadow-[0_1px_2px_#0B13220D,0_12px_32px_#0B13220F] transition hover:-translate-y-0.5 hover:border-border-strong md:p-7"
                >
                  <span className="text-micro font-semibold tracking-label text-gold-on-light uppercase">{card.kind}</span>
                  <span className="text-body-s leading-5 text-text-muted">{card.outlet}</span>
                  <h3 className="text-[20px] leading-[26px] font-bold tracking-heading text-pretty text-text">{card.title}</h3>
                  <span className="text-body-s leading-5 text-text-muted">
                    {card.note} · {link.dateLabel} <span aria-hidden>↗</span>
                    <span className="sr-only"> (opens {link.outlet} in a new tab)</span>
                  </span>
                </SiteLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
