import { LogoBox } from '@/components/press/logo-box';
import { OrgLogoLink } from '@/components/org-logo-link';
import { SiteLink } from '@/components/site-link';

import { partnerLogos } from '@/content/partner-logos';
import { partners } from '@/content/press';
import { pressLinks } from '@/content/press-links';

/**
 * "What each partner does with Flash". Audit finding: the old partners page
 * was a wall of logos linking out to partner homepages, which sent visitors
 * away. Each row says what the partner does and links to the Flash page that
 * explains that work first; the partner's own announcement, where one exists,
 * is the quieter second link.
 *
 * The left column is the partner's logo (content/partner-logos.ts) over its
 * name, which stays real text. Each logo sits left-aligned in a fixed box,
 * 112x32 on phones and 140x40 from the tablet width, contained, so wordmarks
 * run to the box's width and crests to its height; the files are the home
 * page's own, shown in full colour as they are there. A partner without a
 * logo file shows its name only. The box and its optical `scale` are the
 * shared <LogoBox> (logo-box.tsx), which the coverage list uses too. Each
 * logo is a link to the partner's own page about Flash, in a new tab
 * (<OrgLogoLink>, content/logo-links.ts), or plain where no verified page
 * exists. No hover.
 */
function PartnerLogo({ name }: { name: string }) {
  const logo = partnerLogos[name];
  if (!logo) return null;
  return (
    <LogoBox
      size="partner"
      logo={{ src: `/partners/${logo.file}`, alt: `${name} logo`, width: logo.width, height: logo.height, scale: logo.scale }}
    />
  );
}

export function PartnerList() {
  return (
    <section id="partners" aria-labelledby="partners-heading" className="scroll-mt-6 bg-neutral-0">
      <div className="container-page flex flex-col gap-8 py-20 lg:py-28">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2
            id="partners-heading"
            className="text-h2 leading-h2 font-extrabold tracking-display text-text md:text-h1 md:leading-h1"
          >
            What each partner does with Flash
          </h2>
          <p className="max-w-[400px] text-body-s leading-body-s text-pretty text-text-muted lg:shrink-0">
            Each row links to the Flash page that explains the work, and to the partner&apos;s own announcement where one
            exists.
          </p>
        </div>

        {/* The site's table style (components/why-flash/comparison-table.tsx):
            from md, a white frame with a border-xl outline, rows 28px top and
            bottom with a 1px border line between them (none after the last).
            On a phone the rows stack with spacing only, no lines. */}
        <ul className="flex flex-col gap-10 md:gap-0 md:rounded-xl md:border md:border-border md:bg-neutral-0">
          {partners.map((partner, i) => (
            <li
              key={partner.name}
              className={`flex flex-col gap-3 md:grid md:grid-cols-[220px_1fr] md:gap-x-8 md:px-8 md:py-7 lg:flex lg:flex-row lg:items-start ${
                i < partners.length - 1 ? 'md:border-b md:border-border' : ''
              }`}
            >
              <div className="flex flex-col items-start gap-2 lg:w-[220px] lg:shrink xl:w-[300px] xl:shrink-0">
                <OrgLogoLink org={partner.name} className="flex">
                  <PartnerLogo name={partner.name} />
                </OrgLogoLink>
                <h3 className="text-body-s leading-body-s font-medium text-text-muted">{partner.name}</h3>
              </div>
              <p className="text-body-l leading-body-l text-pretty text-text lg:min-w-0 lg:flex-1 xl:max-w-[640px]">{partner.work}</p>
              <div className="flex flex-col gap-1 text-body-s leading-body-s font-bold md:col-start-2 lg:w-[220px] lg:shrink lg:items-end lg:text-right xl:w-auto xl:flex-1">
                <SiteLink href={partner.link.href} className="inline-flex min-h-11 items-center text-brand-blue hover:underline lg:min-h-6">
                  {partner.link.label}&nbsp;<span aria-hidden>→</span>
                </SiteLink>
                {partner.external?.map((ext) => (
                  <SiteLink
                    key={ext.id}
                    href={pressLinks[ext.id].href}
                    className="inline-flex min-h-11 items-center text-text-muted hover:underline lg:min-h-6"
                  >
                    {ext.label}&nbsp;<span aria-hidden>↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </SiteLink>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
