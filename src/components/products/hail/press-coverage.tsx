import { SiteLink } from '@/components/site-link';

import { SectionLabel } from '@/components/products/section-header';

import { pressSection } from './content';
import { PressClippings } from './press-clippings';

/** The launch coverage: the heading and "All coverage" beside the stack of press clippings. */
export function PressCoverage() {
  return (
    <section aria-labelledby="hail-press-heading" className="bg-brand-navy">
      <div className="container-page flex flex-col gap-12 py-20 lg:flex-row lg:items-start lg:gap-16 lg:py-[120px]">
        <div className="flex flex-col gap-4 lg:w-[400px] lg:shrink xl:shrink-0">
          <SectionLabel tone="muted-dark">{pressSection.label}</SectionLabel>
          <h2
            id="hail-press-heading"
            className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-[36px] md:leading-[42px] lg:text-[40px] lg:leading-[46px]"
          >
            {pressSection.heading}
          </h2>
          <p className="text-[15px] leading-6 text-pretty text-text-on-dark-muted">{pressSection.body}</p>
          <SiteLink
            href={pressSection.link.href}
            className="inline-flex min-h-11 items-center text-body-s leading-5 font-semibold text-text-on-dark hover:underline"
          >
            {pressSection.link.label} <span aria-hidden>&nbsp;→</span>
          </SiteLink>
        </div>

        <div className="grow basis-0">
          <PressClippings />
        </div>
      </div>
    </section>
  );
}
