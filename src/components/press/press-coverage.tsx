import Image from 'next/image';
import { BeatList, type Beat, type BeatRow } from '@/components/press/beat-list';
import { SiteLink } from '@/components/site-link';

import { coverage, coverageGroups, featuredCoverage, otherMentions } from '@/content/press';
import { pressLinks, type PressLink } from '@/content/press-links';
import { pressLogos } from '@/content/press-logos';
import { productPaths, products } from '@/content/products';

const h2 = 'text-h2 leading-h2 font-extrabold tracking-display text-text md:text-h1 md:leading-h1';
/** The coverage blue: outlet names, headlines and the pill. The colour alone marks a link; nothing is underlined. */
const blue = 'text-[#1B3A8C]';
const outletLabel = `text-micro font-semibold tracking-label uppercase ${blue}`;
const headline = `text-[22px] leading-[30px] font-semibold tracking-heading text-pretty md:text-h3 md:leading-h3 ${blue}`;
const pill = `inline-flex min-h-6 items-center rounded-full border border-[#D9DFEA] px-3 text-caption leading-5 font-semibold ${blue}`;
/** Which part of the featured photo the cover crop keeps. */
const focus = { top: 'object-top', middle: 'object-[center_40%]', bottom: 'object-[center_70%]' } as const;

/** The hail product page's own name, so the three hail cards carry the same tag. */
const hailName = products.find((p) => p.href === productPaths.hail)?.name ?? 'Predictive Hail';

/** The URLs of the five story cards: a beat-list item with one of these is left out, so each piece appears once. */
const cardUrls = new Set([...featuredCoverage, ...coverage].map((item) => pressLinks[item.id].href));

/**
 * The names in a link's outlet line, each with the article on that outlet's
 * own site (`outlets` in content/press-links.ts) or, for a single outlet, the
 * link itself. A name without an article stays plain text.
 */
function outletNames(link: PressLink, override?: string): { name: string; href?: string }[] {
  if (override) return [{ name: override, href: link.href }];
  return link.outlets ?? [{ name: link.outlet, href: link.href }];
}

/** A beat-list item as the row draws it: the piece, its outlets and their logos (content/press-logos.ts). */
function toRow(id: keyof typeof pressLinks, override?: string, title?: string, tag?: string): BeatRow {
  const link = pressLinks[id];
  return {
    id,
    href: link.href,
    title: title ?? link.title,
    date: link.date,
    dateLabel: link.dateLabel,
    tag,
    outlets: outletNames(link, override).map(({ name }) => {
      const logo = pressLogos[name];
      return logo
        ? { name, logo: { src: `/press-logos/${logo.file}`, width: logo.width, height: logo.height, scale: logo.scale, rounded: logo.rounded } }
        : { name };
    }),
  };
}

/** The outlet line: each name a link to its own article in a new tab, a name without one in grey, separators plain. */
function OutletLine({ link, override }: { link: PressLink; override?: string }) {
  return (
    <span className={outletLabel}>
      {outletNames(link, override).map((outlet, i) => (
        <span key={outlet.name}>
          {i > 0 && <span aria-hidden> · </span>}
          {outlet.href ? (
            <SiteLink href={outlet.href} aria-label={`${outlet.name} article about Flash`}>
              {outlet.name}
            </SiteLink>
          ) : (
            <span className="text-text-muted">{outlet.name}</span>
          )}
        </span>
      ))}
    </span>
  );
}

/**
 * What sits under every card's image: a two-line label (the outlet names in
 * blue, then "Type · Date" in grey, always on its own line), the blue
 * headline, one pill. In a row of cards each of the four is a track of the
 * row's grid (`row-span-4` on a subgrid), so labels, headlines and pills
 * start at the same height across the row whatever wraps, and every pill
 * sits at the foot of its card.
 */
function CardText({
  link,
  outlet,
  beat,
  title,
  tag,
}: {
  link: PressLink;
  outlet: string;
  beat: string;
  title: string;
  tag: { label: string; href: string };
}) {
  return (
    <>
      <p className="flex flex-col gap-1">
        <OutletLine link={link} override={outlet === link.outlet || link.outlets ? undefined : outlet} />
        <span className="text-caption leading-caption text-text-muted">
          {beat} · {link.dateLabel}
        </span>
      </p>
      <h3 className={headline}>
        <SiteLink href={link.href} aria-label={`Read on ${outlet}: ${title}`}>
          {title}
        </SiteLink>
      </h3>
      <p className="mt-auto flex">
        <SiteLink href={tag.href} className={pill}>
          {tag.label} <span aria-hidden>&nbsp;→</span>
        </SiteLink>
      </p>
    </>
  );
}

/**
 * "Where Flash has been covered": three featured pieces, the two hail cards,
 * then the rest of the coverage grouped by beat, with any story that already
 * has a card left out so each appears once. Every outbound link is the
 * original piece (content/press-links.ts) and opens in a new tab; each card
 * has an id so the "As seen in" strip can point at it.
 *
 * Under each image: the outlet line, the headline and one product pill, all
 * in the coverage blue with no underline. Rendering only: the kickers,
 * summaries and captions stay in content/press.ts for other uses (a caption
 * is read into its image's alt text).
 */
export function PressCoverage() {
  // Each beat's items newest first, the carded stories left out; an emptied beat is dropped.
  const groups: Beat[] = coverageGroups
    .map((group) => ({
      ...group,
      rows: group.rows
        .filter((row) => !cardUrls.has(pressLinks[row.id].href))
        .map((row) => toRow(row.id, row.outlet, row.title, row.tag))
        .sort((a, b) => b.date.localeCompare(a.date)),
    }))
    .filter((group) => group.rows.length > 0);

  return (
    <section id="coverage" aria-labelledby="coverage-heading" className="scroll-mt-6 bg-neutral-0">
      {/* No bottom padding: the testimonials follow on the same white, and its top padding is the one gap between them. */}
      <div className="container-page flex flex-col gap-12 pt-20 lg:gap-16 lg:pt-28">
        <h2 id="coverage-heading" className={h2}>
          Where Flash has been covered
        </h2>

        {/* Featured: national, insurtech, aviation */}
        <ul className="grid gap-10 lg:grid-cols-3 lg:gap-x-8">
          {featuredCoverage.map((item) => {
            const link = pressLinks[item.id];
            return (
              <li
                key={item.id}
                id={`featured-${item.id}`}
                className="flex scroll-mt-24 flex-col gap-4 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-y-4"
              >
                <div className="relative aspect-[576/230] w-full overflow-hidden rounded-lg bg-brand-navy">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1440px) 405px, (min-width: 1024px) 30vw, calc(100vw - 32px)"
                    className={`object-cover ${focus[item.image.focus]}`}
                  />
                </div>
                <CardText
                  link={link}
                  outlet={item.outlet}
                  beat={item.beat}
                  title={item.headline}
                  tag={{ label: item.next.href === productPaths.hail ? hailName : item.next.label, href: item.next.href }}
                />
              </li>
            );
          })}
        </ul>

        {/* The two hail cards with product imagery */}
        <ul className="grid gap-12 lg:grid-cols-2 lg:gap-x-12">
          {coverage.map((item) => {
            const link = pressLinks[item.id];
            return (
              <li
                key={item.id}
                id={`featured-${item.id}`}
                className="flex scroll-mt-24 flex-col gap-[14px] lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-y-[14px]"
              >
                <div className="relative aspect-[576/230] overflow-hidden rounded-lg bg-brand-navy">
                  <Image
                    src={item.image.src}
                    alt={`${item.image.alt}. ${item.image.caption}`}
                    fill
                    sizes="(min-width: 1440px) 576px, (min-width: 1024px) 45vw, calc(100vw - 32px)"
                    className={`${item.image.fit === 'contain' ? 'object-contain' : 'object-cover'} ${item.image.position ?? ''}`}
                  />
                </div>
                <CardText
                  link={link}
                  outlet={item.outlet}
                  beat={item.beat}
                  title={item.headline}
                  tag={{ label: hailName, href: productPaths.hail }}
                />
              </li>
            );
          })}
        </ul>

        {/* Grouped list */}
        <div className="flex flex-col gap-7 md:gap-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-10">
            <h3 className="text-h3 leading-h3 font-extrabold tracking-display text-text md:text-h2 md:leading-h2">
              More coverage, by beat
            </h3>
            <p className="text-body-s leading-body-s text-text-muted">Every link opens the original piece in a new tab.</p>
          </div>
          <BeatList beats={groups} />
        </div>

        {/* Also: the company's own channels, each with its brand mark, in a new tab */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-10">
          <p className="shrink-0 text-micro font-semibold tracking-label text-text-muted uppercase">Also</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {otherMentions.map((mention) => {
              const name = mention.text.split(' · ')[0];
              const Icon = name === 'LinkedIn' ? LinkedInIcon : name === 'YouTube' ? YouTubeIcon : null;
              return (
                <li key={mention.text}>
                  <SiteLink
                    href={mention.href}
                    aria-label={`Flash Weather on ${name}`}
                    className="inline-flex min-h-11 items-center gap-2 text-body-s leading-5 font-semibold text-[#1B3A8C] md:min-h-6"
                  >
                    {Icon && <Icon />}
                    {name}
                    <span aria-hidden className="text-[13px]">
                      ↗
                    </span>
                  </SiteLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** LinkedIn's "in" mark, 16px. */
function LinkedInIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** YouTube's play mark, 16px. */
function YouTubeIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
