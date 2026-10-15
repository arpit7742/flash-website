import { type Img, type Industry, industriesForIndex, industryPath } from './industries';

/** One industry as the hub hero's cycle card shows it. */
export type CycleIndustry = {
  slug: string;
  name: string;
  /** The one line the index card below shows for it. */
  line: string;
  href: string;
  image: string;
};

/**
 * Photos for the verticals that have no `card.image` yet. A card image, once
 * one is added in industries.ts, takes over. Municipalities, Parks & Recreation
 * and Utilities are stand-ins from elsewhere on the site, awaiting approval:
 * nothing on the site shows a city crew, a park or a power line.
 */
const STAND_INS: Record<string, string> = {
  concrete: '/images/industries/flash-construction-wet-concrete-deck-clearing-sky.png',
  'events-venues': '/images/industries/flash-schools-championship-stadium-bowl-dusk-storm.png',
  'outdoor-sports': '/images/industries/flash-schools-empty-infield-rolled-tarp-floodlights.png',
  'turf-agronomy': '/images/industries/flash-agriculture-dew-leaf-wetness-close-cut-turf.png',
  municipalities: '/images/why-flash/flash-on-site-warning-siren-open-field.jpg',
  'parks-rec': '/images/products/flash-clearing-sky-empty-field-all-clear.png',
  utilities: '/images/products/flash-open-plain-layered-storms-coverage-card.png',
};

const LAST_RESORT = '/images/products/flash-storm-cell-open-ground-platform-hero.png';

/**
 * What each vertical's photo shows, for where the photo carries meaning (the
 * plain hero's photo card). The hub's cards leave theirs decorative.
 */
const PHOTO_ALT: Record<string, string> = {
  concrete: 'A freshly poured, wet concrete deck under a clearing storm sky',
  'events-venues': 'A floodlit championship stadium bowl at dusk with a storm building over it',
  insurance: 'Rows of parked vehicles in an open lot under a dark storm sky',
  municipalities:
    'An outdoor warning siren and strobe head on a pole at the edge of an open field under a storm sky',
  'outdoor-sports': 'An empty ballfield infield with the tarp rolled up, under floodlights',
  'parks-rec': 'A clearing sky at dusk over an empty grass field with puddles reflecting the light',
  'turf-agronomy': 'Dew on close-cut turf, the leaf wetness that drives disease pressure',
  utilities: 'A vast open plain under layered storm systems at dusk',
};

/** An industry's photo: its card image if it has one, else its stand-in (above). */
export function industryPhoto(industry: Industry): Img {
  return {
    src: industry.card?.image?.src ?? STAND_INS[industry.slug] ?? LAST_RESORT,
    alt: PHOTO_ALT[industry.slug] ?? industry.card?.image?.alt ?? '',
  };
}

/** Every vertical in the index's order, with the index card's own line. */
export function industryCycle(): CycleIndustry[] {
  return industriesForIndex().map((industry) => ({
    slug: industry.slug,
    name: industry.name,
    line: industry.card?.summary ?? industry.headline,
    href: industryPath(industry.slug),
    image: industryPhoto(industry).src,
  }));
}
