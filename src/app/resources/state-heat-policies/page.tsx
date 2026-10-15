import { Breadcrumbs } from '@/components/breadcrumbs';
import { Eyebrow } from '@/components/eyebrow';
import { HeroSection, HeroWords } from '@/components/hero/hero';
import { ResourceCard } from '@/components/resources/resource-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { HEAT_POLICIES_PATH, heatPolicyPath, publishedHeatPolicies } from '@/content/heat-policies';
import type { ResourceCard as Card } from '@/content/resources';
import { JsonLd, itemListSchema, webPageSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

const TITLE = 'State heat policies for athletics (WBGT)';
const DESCRIPTION =
  'WBGT thresholds, practice limits and record-keeping for high school athletics, state by state, checked against each association’s own documents.';

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: HEAT_POLICIES_PATH });

/** One card per live state page, in the resources hub's card style. Drafts are left out. */
const cards: Card[] = publishedHeatPolicies.map((policy) => ({
  kind: `${policy.state} · ${policy.association}`,
  title: `${policy.state} heat policy`,
  body: policy.summary,
  href: heatPolicyPath(policy.slug),
  cta: `Read the ${policy.state} guide`,
}));

/**
 * The index of state heat-policy pages: the resources hub's hero and cards,
 * one card per state. The nav, the footer and the resources hub link here,
 * and here links to every live state page.
 */
export default function StateHeatPoliciesPage() {
  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <JsonLd schema={webPageSchema({ type: 'CollectionPage', name: TITLE, description: DESCRIPTION, path: HEAT_POLICIES_PATH })} />
        <JsonLd schema={itemListSchema(cards.map((card) => ({ name: card.title, path: card.href })))} />

        <HeroSection theme="light" className="resources-hero overflow-hidden border-b border-border">
          <div className="hero-copy container-page flex flex-col gap-5 pt-10 pb-14 md:pt-14 md:pb-20">
            <Breadcrumbs
              tone="light"
              className="hero-crumbs"
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Resources', path: '/resources/' },
                { name: 'State heat policies', path: HEAT_POLICIES_PATH },
              ]}
            />
            <Eyebrow tone="light" className="hero-eyebrow pt-6">
              Resources · State heat policies · WBGT
            </Eyebrow>
            <h1 className="max-w-[900px] text-[40px] leading-[44px] font-extrabold tracking-[-0.05em] text-text md:text-[56px] md:leading-[60px] lg:text-[64px] lg:leading-[68px]">
              <HeroWords text="State heat policies for high school athletics" tone="light" />
            </h1>
            <p className="hero-lede max-w-narrow text-[17px] leading-[28px] text-pretty text-text-muted md:text-[19px] md:leading-body-l">
              Each state association sets its own WBGT bands, practice limits and paperwork. Every guide here prints
              the thresholds as the association does, cites its documents and the date we checked them. Flash is a
              forecast for planning, not an on-site meter: compliance uses the reading your state policy requires.
            </p>
          </div>
        </HeroSection>

        <section aria-labelledby="state-guides" className="bg-surface-sunken">
          <div className="container-page flex flex-col gap-10 py-16 md:py-20 lg:py-24">
            <h2
              id="state-guides"
              className="text-[28px] leading-[34px] font-extrabold tracking-[-0.04em] text-text md:text-h2 md:leading-h2"
            >
              Guides by state
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <li key={card.href}>
                  <ResourceCard card={card} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
