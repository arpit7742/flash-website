import Image from 'next/image';
import { SiteLink } from '@/components/site-link';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { FigurePrefix } from '@/components/stats/figure-prefix';
import { VideoPlayer } from '@/components/video-player';
import { type HeroAside, type Industry, type IndustryHero as Hero, LIGHTNING_HERO_STATS } from '@/content/industries';
import { industryPhoto } from '@/content/industries-cycle';
import { DEMO_HREF } from '@/content/navigation';

import { Dot, Illustrative, hailBorder, toneTextOnDark } from './primitives';

type Crumb = { name: string; path: string };

/** The design's photo grades, one per layout (classes in styles/industries.css). */
const GRADE = {
  start: 'industry-hero-grade-start',
  end: 'industry-hero-grade-end',
  centered: 'industry-hero-grade-centered',
} as const;

/**
 * The industry hero, on the shared hero motion. Designed verticals pass
 * `industry.hero`; the rest get a plain navy hero from `headline` and
 * `intro`, so every page opens the same way and carries exactly one h1.
 */
export function IndustryHero({ industry, trail }: { industry: Industry; trail: Crumb[] }) {
  const hero = industry.hero;
  if (!hero) return <PlainHero industry={industry} trail={trail} />;
  return hero.theme === 'light' ? (
    <LightHero hero={hero} headline={industry.headline} trail={trail} />
  ) : (
    <DarkHero hero={hero} headline={industry.headline} trail={trail} />
  );
}

// ---------------------------------------------------------------------------

/**
 * The hero for a vertical with no designed `hero`: Golf's layout, built from
 * the core fields. The industry photo, darkened, behind the copy; the shared
 * three figures; and on the right (below the button on a phone) the same
 * photo as a card carrying the vertical's alert chip.
 */
function PlainHero({ industry, trail }: { industry: Industry; trail: Crumb[] }) {
  const photo = industryPhoto(industry);
  const hero: Hero = {
    theme: 'dark',
    layout: 'split',
    asideSide: 'end',
    eyebrow: `${industry.name} · ${industry.title}`.toUpperCase(),
    lead: industry.intro,
    // The card beside the copy describes the photo; behind the copy it is decoration.
    image: { src: photo.src, alt: '' },
    stats: LIGHTNING_HERO_STATS,
    ...(industry.alert ? { aside: { kind: 'photo', image: photo, alert: industry.alert } } : {}),
  };
  return <DarkHero hero={hero} headline={industry.headline} trail={trail} />;
}

// ---------------------------------------------------------------------------

function DarkHero({ hero, headline, trail }: { hero: Hero; headline: string; trail: Crumb[] }) {
  const centered = hero.layout === 'centered';
  const side = hero.asideSide ?? 'end';

  return (
    <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
      <HeroBackground storm={hero.storm}>
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          preload
          sizes="100vw"
          quality={75}
          className="object-cover opacity-55"
        />
      </HeroBackground>
      {/* On small screens the copy sits over the whole photo, so the grade is even. */}
      <div aria-hidden className="industry-hero-wash absolute inset-0 lg:hidden" />
      <div aria-hidden className={`${centered ? GRADE.centered : GRADE[side]} absolute inset-0 hidden lg:block`} />

      <div className="container-page relative pt-8 pb-16 md:pt-10 lg:pb-[112px]">
        <Breadcrumbs trail={trail} tone="dark" className={`hero-crumbs ${centered ? '[&_ol]:justify-center' : ''}`} />

        {centered ? (
          <div className="hero-copy flex flex-col items-center gap-6 pt-12 text-center lg:pt-20">
            <HeroCopy hero={hero} headline={headline} dark centered />
            {hero.aside && (
              <div className="hero-visual mt-6 flex w-full flex-col items-center gap-4">
                <Aside aside={hero.aside} />
                {hero.illustrative && <Illustrative dark />}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-12 pt-12 lg:flex-row lg:items-center lg:gap-16 lg:pt-[88px]">
            <div className="hero-copy flex min-w-0 grow basis-0 flex-col gap-6">
              <HeroCopy hero={hero} headline={headline} dark />
            </div>
            {hero.aside && (
              <div
                className={`hero-visual ${side === 'end' ? 'hero-visual-side' : ''} flex shrink-0 flex-col gap-3 ${
                  hero.aside.kind === 'video' || hero.aside.kind === 'photo'
                    ? 'w-full min-w-0 lg:w-[50%]'
                    : side === 'start'
                      ? 'lg:order-first lg:w-[440px]'
                      : 'lg:w-[460px]'
                }`}
              >
                <Aside aside={hero.aside} />
                {hero.illustrative && <Illustrative dark />}
              </div>
            )}
          </div>
        )}
      </div>
    </HeroSection>
  );
}

// ---------------------------------------------------------------------------

function LightHero({ hero, headline, trail }: { hero: Hero; headline: string; trail: Crumb[] }) {
  return (
    <HeroSection theme="light" className="overflow-hidden bg-neutral-0">
      <div className="container-page pt-8 pb-16 md:pt-10 lg:pb-[112px]">
        <Breadcrumbs trail={trail} tone="light" className="hero-crumbs" />
        <div className="flex flex-col gap-12 pt-10 lg:flex-row lg:items-center lg:pt-16">
          <div className="hero-copy flex min-w-0 grow basis-0 flex-col gap-6">
            <HeroCopy hero={hero} headline={headline} />
          </div>
          <div className="hero-visual hero-visual-side w-full shrink-0 lg:w-[520px] xl:w-[600px]">
            <div className="relative overflow-hidden rounded-xl bg-brand-navy-deep">
              <div className="relative aspect-[600/680] w-full">
                <Image
                  src={hero.image.src}
                  alt={hero.image.alt}
                  fill
                  preload
                  sizes="(min-width: 1440px) 600px, (min-width: 1024px) 520px, 100vw"
                  quality={75}
                  className="object-cover"
                />
                <div aria-hidden className="industry-hero-photo-grade absolute inset-0" />
              </div>
              {hero.aside && (
                <div className="relative -mt-24 px-4 pb-4 sm:absolute sm:bottom-6 sm:left-6 sm:mt-0 sm:w-[400px] sm:p-0">
                  <Aside aside={hero.aside} illustrative={hero.illustrative} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </HeroSection>
  );
}

// ---------------------------------------------------------------------------

function HeroCopy({
  hero,
  headline,
  dark = false,
  centered = false,
}: {
  hero: Hero;
  headline: string;
  dark?: boolean;
  centered?: boolean;
}) {
  return (
    <>
      <p
        className={`hero-eyebrow text-micro font-semibold tracking-[0.16em] ${dark ? 'text-viz-gold' : 'text-brand-blue'}`}
      >
        {hero.eyebrow}
      </p>
      <h1
        className={`text-[34px] leading-[40px] font-extrabold tracking-[-0.04em] md:text-[48px] md:leading-[54px] xl:text-display-l xl:leading-[62px] xl:tracking-[-0.05em] ${
          dark ? 'text-neutral-0' : 'text-text'
        } ${centered ? 'max-w-[1000px]' : ''}`}
      >
        <HeroWords text={headline} />
      </h1>
      <p
        className={`hero-lede text-[17px] leading-h4 text-pretty md:text-[19px] md:leading-body-l ${
          dark ? 'text-[#C9D1E3]' : 'text-text-muted'
        } ${centered ? 'max-w-narrow' : 'max-w-[640px]'}`}
      >
        {hero.lead}
      </p>
      {hero.stats && (
        <dl className="hero-stats flex divide-x divide-white/15">
          {hero.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1 px-3 first:pl-0 last:pr-0 sm:px-7">
              <dt className={`text-[12px] leading-4 font-semibold md:text-[13px] ${dark ? 'text-[#8F9AB8]' : 'text-text-muted'}`}>
                {stat.label}
              </dt>
              <dd
                className={`text-[20px] leading-[26px] font-extrabold tracking-[-0.03em] whitespace-nowrap sm:text-[22px] md:text-[26px] md:leading-[30px] ${
                  dark ? 'text-text-on-dark' : 'text-text'
                }`}
              >
                {stat.prefix && <FigurePrefix onDark={dark}>{stat.prefix}</FigurePrefix>}
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      <HeroButtons dark={dark} secondary={hero.secondary} primary={hero.primary} centered={centered} />
      {hero.footnote && (
        <p className={`hero-support text-caption leading-5 ${dark ? 'text-[#8F9AB8]' : 'text-text-muted'}`}>
          {hero.footnote}
        </p>
      )}
    </>
  );
}

function HeroButtons({
  dark,
  primary = { label: 'Book a demo', href: DEMO_HREF },
  secondary,
  centered = false,
}: {
  dark: boolean;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  centered?: boolean;
}) {
  return (
    <div
      className={`hero-ctas flex flex-col gap-3 pt-1.5 sm:flex-row sm:items-center sm:gap-[14px] ${
        centered ? 'sm:justify-center' : ''
      }`}
    >
      <ButtonLink href={primary.href} variant="gold">
        {primary.label}
      </ButtonLink>
      {secondary && (
        <ButtonLink href={secondary.href} variant={dark ? 'outline-dark' : 'outline-light'}>
          {secondary.label}
        </ButtonLink>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Asides

const panel =
  'rounded-[20px] border border-white/10 bg-[#040818B8] shadow-[0_30px_80px_#00000073] backdrop-blur-[2px]';

function Aside({ aside, illustrative }: { aside: HeroAside; illustrative?: boolean }) {
  switch (aside.kind) {
    case 'stat':
      return <StatAside aside={aside} />;
    case 'sites':
      return <SitesAside aside={aside} />;
    case 'field-card':
      return <FieldCard aside={aside} illustrative={illustrative} />;
    case 'readings':
      return <Readings aside={aside} />;
    case 'photo':
      return <PhotoCard aside={aside} />;
    case 'video':
      return (
        <VideoPlayer
          clip={aside.clip}
          onDark
          preloadPoster
          sizes="(min-width: 1440px) 624px, (min-width: 1024px) 50vw, 100vw"
        />
      );
  }
}

/**
 * The industry photo as a card: rounded, a soft shadow, a light darkening so
 * the chip reads, and the alert chip with its disclaimer in the lower left.
 */
function PhotoCard({ aside }: { aside: Extract<HeroAside, { kind: 'photo' }> }) {
  return (
    <figure className="relative overflow-hidden rounded-[20px] border border-white/10 bg-brand-navy-deep shadow-[0_30px_80px_#00000073]">
      <div className="relative aspect-[4/3] w-full lg:aspect-[16/11]">
        {/* In the first screen on desktop, and the page's largest paint on a phone: never lazy. */}
        <Image
          src={aside.image.src}
          alt={aside.image.alt}
          fill
          loading="eager"
          sizes="(min-width: 1440px) 624px, (min-width: 1024px) 50vw, 100vw"
          quality={75}
          className="object-cover"
        />
        <div aria-hidden className="industry-photo-card-shade absolute inset-0" />
      </div>
      <figcaption className="absolute inset-x-4 bottom-4 flex flex-col items-start gap-2 sm:inset-x-5 sm:bottom-5">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#040818D9] px-3.5 py-2 text-caption leading-4 font-semibold text-neutral-0 backdrop-blur-sm">
          <Dot tone={aside.alert.tone} />
          {aside.alert.label}
        </span>
        <span className="text-[11px] leading-[14px] font-semibold tracking-[0.08em] text-[#C9D1E3] uppercase">
          Illustrative example · not live weather
        </span>
      </figcaption>
    </figure>
  );
}

const ring = { sm: 'size-6', md: 'size-8', lg: 'size-16' } as const;

function StatAside({ aside }: { aside: Extract<HeroAside, { kind: 'stat' }> }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[72px] leading-[72px] font-bold tracking-[-0.04em] text-neutral-0 md:text-[128px] md:leading-[120px]">
        {aside.value}
      </p>
      <p className="max-w-[380px] text-[19px] leading-body-l text-[#C9D1E3]">{aside.caption}</p>
      {aside.scale && (
        <ul className="flex items-end gap-4 pt-5 sm:gap-6">
          {aside.scale.map((step) => (
            <li key={step.label} className="flex w-24 shrink-0 flex-col items-center gap-[10px]">
              <span aria-hidden className="flex h-16 items-end justify-center">
                <span className={`block rounded-full border-2 ${hailBorder[step.tone]} ${ring[step.size]}`} />
              </span>
              <span className="text-micro font-semibold tracking-[0.08em] text-neutral-0">{step.label}</span>
              <span className="text-micro text-neutral-400">{step.sub}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SitesAside({ aside }: { aside: Extract<HeroAside, { kind: 'sites' }> }) {
  return (
    <div className={`${panel} px-5 pt-5 pb-4 sm:px-6`}>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-[14px]">
        <p className="text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8]">{aside.title}</p>
        <p className="text-[11px] leading-[14px] font-medium text-alert-clear">{aside.status}</p>
      </div>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{aside.title}</caption>
        <thead>
          <tr className="border-b border-white/10">
            {aside.columns.map((col, i) => (
              <th
                key={col}
                scope="col"
                className={`py-2 text-[10px] leading-3 font-semibold tracking-label text-[#8F9AB8] ${
                  i === 2 ? 'text-right' : ''
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {aside.rows.map((row) => (
            <tr key={row.name} className="border-b border-white/10">
              <th scope="row" className="py-[13px] pr-3 text-caption leading-caption font-medium text-neutral-0 sm:text-body-s">
                {row.name}
              </th>
              <td className="py-[13px] pr-3">
                <span className="flex items-center gap-2 text-caption leading-micro text-neutral-0">
                  <Dot tone={row.tone} />
                  {row.status}
                </span>
              </td>
              <td
                className={`py-[13px] text-right text-caption leading-micro font-semibold ${
                  row.etaTone === 'muted'
                    ? 'text-[#8F9AB8]'
                    : row.etaTone
                      ? toneTextOnDark[row.etaTone]
                      : 'text-neutral-0'
                }`}
              >
                {row.eta}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-[14px]">
        <p className="text-caption leading-micro text-neutral-400">{aside.footer}</p>
        {aside.link && (
          <SiteLink href={aside.link.href} className="text-caption leading-micro font-semibold text-neutral-0 hover:underline">
            {aside.link.label}
          </SiteLink>
        )}
      </div>
    </div>
  );
}

function FieldCard({
  aside,
  illustrative,
}: {
  aside: Extract<HeroAside, { kind: 'field-card' }>;
  illustrative?: boolean;
}) {
  return (
    <div className={`${panel} flex flex-col gap-[14px] px-6 pt-[22px] pb-1.5`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8]">{aside.label}</p>
        <p className="text-micro text-[#8F9AB8]">{aside.date}</p>
      </div>
      <div className="flex flex-col items-center gap-1.5 pt-1.5">
        {/* The WBGT dial: green, gold, orange, red bands, the needle in the orange band. */}
        <svg width="200" height="110" viewBox="0 0 200 110" aria-hidden className="shrink-0">
          <path d="M20 100 A80 80 0 0 1 95 20.2" fill="none" stroke="var(--color-alert-clear)" strokeWidth="14" />
          <path d="M95 20.2 A80 80 0 0 1 142.9 32.5" fill="none" stroke="var(--color-viz-gold)" strokeWidth="14" />
          <path d="M142.9 32.5 A80 80 0 0 1 164.7 53" fill="none" stroke="var(--color-alert-watch)" strokeWidth="14" />
          <path d="M164.7 53 A80 80 0 0 1 180 100" fill="none" stroke="var(--color-alert-warning)" strokeWidth="14" />
          <line x1="100" y1="100" x2="145.3" y2="46.6" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="6" fill="#fff" />
        </svg>
        <p className="text-[34px] leading-h2 font-bold tracking-display text-neutral-0">{aside.value}</p>
        <p className="text-center text-micro text-neutral-400">{aside.caption}</p>
      </div>
      <ul>
        {aside.rows.map((row) => (
          <li key={row.time} className="flex items-center gap-3 border-t border-white/10 py-[14px]">
            <span className="w-16 shrink-0 text-micro font-semibold text-neutral-0">{row.time}</span>
            <Dot tone={row.tone} className="size-[10px]" />
            <span className="grow basis-0 text-body-s leading-5 text-neutral-0">{row.text}</span>
          </li>
        ))}
      </ul>
      {illustrative && (
        <div className="border-t border-white/10 pt-3 pb-[10px]">
          <Illustrative dark className="!text-[10px] !leading-[13px]" />
        </div>
      )}
    </div>
  );
}

function Readings({ aside }: { aside: Extract<HeroAside, { kind: 'readings' }> }) {
  return (
    <ul className={`${panel} grid w-full max-w-[1248px] grid-cols-2 overflow-hidden text-left lg:grid-cols-4`}>
      {aside.items.map((item, i) => (
        <li
          key={item.label}
          className={`flex flex-col gap-2 px-5 py-5 sm:px-7 sm:py-6 ${i % 2 === 1 ? 'border-l border-white/10' : ''} ${
            i >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''
          } ${i === 2 ? 'lg:border-l' : ''}`}
        >
          <span className="text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8]">{item.label}</span>
          <span className="text-[24px] leading-[30px] font-bold tracking-display text-neutral-0 sm:text-[28px] sm:leading-[34px]">
            {item.value}
          </span>
          <span className="text-caption text-[#C9D1E3]">{item.caption}</span>
        </li>
      ))}
    </ul>
  );
}
