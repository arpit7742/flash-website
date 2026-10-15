import { OrgLogoLink } from '@/components/org-logo-link';
import { SiteLink } from '@/components/site-link';

import { outletLogos } from '@/components/press/outlet-logos';
import { PRESS_PATH, asSeenIn, homeAsSeenIn } from '@/content/press';

/**
 * "As seen in" on the press page: the outlets' logos, each a link to that
 * outlet's most recent article about Flash, in a new tab (<OrgLogoLink>,
 * content/logo-links.ts). The beat under the logo is part of the link.
 */
export function AsSeenInStrip() {
  return (
    <section aria-label="As seen in" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-6 py-8 lg:flex-row lg:items-start lg:gap-16 lg:py-10">
        <p className="shrink-0 pt-1 text-micro font-semibold tracking-label text-text-muted uppercase lg:w-[160px]">
          As seen in
        </p>
        <ul className="grid grow grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
          {asSeenIn.map((item) => {
            const Logo = outletLogos[item.logo];
            return (
              <li key={item.logo}>
                <OrgLogoLink org={item.name} className="inline-flex min-h-11 flex-col justify-center gap-1.5">
                  <Logo className="h-7 w-auto max-w-full" />
                  <span className="text-micro leading-micro font-medium tracking-label text-text-muted uppercase">
                    {item.beat}
                  </span>
                </OrgLogoLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/**
 * The home page's row: six outlet logos, each a link to that outlet's most
 * recent article about Flash in a new tab (<OrgLogoLink>), and the way to the
 * press page under them.
 */
export function AsSeenInRow() {
  return (
    <div className="customers-rise flex flex-col items-center gap-5 pt-2 [--i:3]">
      <p className="text-[11px] leading-4 font-semibold tracking-label text-text-subtle uppercase md:text-micro">As seen in</p>
      <ul className="flex flex-wrap items-center justify-center gap-x-9 gap-y-5">
        {homeAsSeenIn.map((id) => {
          const Logo = outletLogos[id];
          const name = asSeenIn.find((item) => item.logo === id)?.name ?? id;
          return (
            <li key={id} className="flex">
              <OrgLogoLink org={name} className="inline-flex min-h-11 items-center">
                <Logo className="h-6 w-auto md:h-7" />
              </OrgLogoLink>
            </li>
          );
        })}
      </ul>
      <SiteLink href={PRESS_PATH} className="text-body-s leading-5 font-bold text-brand-blue hover:underline">
        Press &amp; partners <span aria-hidden>→</span>
      </SiteLink>
    </div>
  );
}
