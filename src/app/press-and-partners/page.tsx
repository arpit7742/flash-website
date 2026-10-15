import Image from 'next/image';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { Eyebrow } from '@/components/eyebrow';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { AsSeenInStrip } from '@/components/press/as-seen-in';
import { PartnerList } from '@/components/press/partner-list';
import { PressCoverage } from '@/components/press/press-coverage';
import { Testimonials } from '@/components/press/testimonials';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { FigurePrefix } from '@/components/stats/figure-prefix';
import { PRESS_PATH, heroStats, pressPage } from '@/content/press';
import { JsonLd, webPageSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { site } from '@/lib/seo/site';

export const metadata = buildMetadata({ title: pressPage.title, description: pressPage.description, path: PRESS_PATH });

export default function PressAndPartnersPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd
          schema={webPageSchema({ type: 'WebPage', name: pressPage.title, description: pressPage.description, path: PRESS_PATH })}
        />
        {/* Hero */}
        <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
          <HeroBackground storm>
            <Image
              src="/images/press/flash-weather-press-hero-fleet-lot-hail-sky.png"
              alt="Rows of parked vehicles in an open lot under a bruised hail sky, the photograph graded behind the Press and Partners headline"
              fill
              preload
              sizes="100vw"
              className="object-cover object-[55%_45%] opacity-80"
            />
          </HeroBackground>
          <div aria-hidden className="press-hero-grade-left absolute inset-0" />
          <div aria-hidden className="press-hero-grade-bottom absolute inset-0" />
          <div className="container-page relative pt-8 pb-16 md:pt-10 lg:pb-[112px]">
            <Breadcrumbs
              tone="dark"
              className="hero-crumbs"
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Press & partners', path: PRESS_PATH },
              ]}
            />
            <div className="flex flex-col gap-12 pt-12 lg:flex-row lg:items-end lg:gap-16 lg:pt-[88px]">
            <div className="hero-copy flex min-w-0 grow basis-0 flex-col gap-6">
              <Eyebrow className="hero-eyebrow">{pressPage.eyebrow}</Eyebrow>
              <h1 className="text-[34px] leading-[40px] font-extrabold tracking-[-0.04em] text-text-on-dark md:text-[48px] md:leading-[54px] xl:text-display-l xl:leading-[62px] xl:tracking-[-0.05em]">
                <HeroWords text={pressPage.headline} />
              </h1>
              <p className="hero-lede max-w-[640px] text-[17px] leading-h4 text-pretty text-[#C9D1E3] md:text-[19px] md:leading-body-l">
                {pressPage.lede}
              </p>
              <div className="hero-ctas flex flex-col gap-3 pt-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-[14px]">
                <ButtonLink href={`mailto:${site.email}`} variant="outline-dark">
                  Contact press · {site.email}
                </ButtonLink>
              </div>
            </div>
            <dl className="hero-visual hero-visual-side flex flex-col gap-6 border-l border-white/20 pl-6 lg:w-[352px] lg:shrink xl:shrink-0 lg:pl-8">
              {heroStats.map((stat) => (
                <div key={stat.value} className="flex flex-col-reverse gap-1">
                  <dt className="text-body-s leading-5 text-neutral-400">{stat.label}</dt>
                  <dd className="text-[32px] leading-10 font-bold tracking-display whitespace-nowrap text-text-on-dark md:text-[36px]">
                    {stat.prefix && <FigurePrefix onDark>{stat.prefix}</FigurePrefix>}
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            </div>
          </div>
        </HeroSection>

        <AsSeenInStrip />
        <PressCoverage />
        <Testimonials />
        <PartnerList />

      </main>
      <SiteFooter eyebrow="Book a demo · No sensors required for the forecast" />
    </>
  );
}
