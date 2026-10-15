/**
 * Press & Partners at /press-and-partners/, as data.
 *
 * The page is the home of every approved third-party link (content/press-links.ts):
 * an "As seen in" strip, three featured pieces, the two hail cards, the
 * coverage grouped by beat, the partners with their own announcements, and the
 * testimonials. Other pages carry a strip of three or four and link back here,
 * so the outbound authority sits on one URL.
 *
 * Partner rows link to the Flash page that explains the work first, and to the
 * partner's own announcement second: the audit found the old partners page
 * sent visitors away to partner homepages.
 *
 * The page no longer has a press kit section. Its files stay under
 * /public/press/ so old outside links to them keep working, but nothing on
 * the site links to them; the old "flash-weather-ai-" names redirect to them
 * (next.config.ts).
 */

import type { PressLinkId } from '@/content/press-links';
import { productPaths } from '@/content/products';
import { site } from '@/lib/seo/site';

export const PRESS_PATH = '/press-and-partners/';

/** Title (41 chars; the layout appends the brand), description (152 chars), H1 and lede. */
export const pressPage = {
  title: 'Press coverage, partners and testimonials',
  description:
    'Flash Weather in Yahoo Sports, Aviation International News and the golf, roofing, insurance and fleet trade press, plus partners and what customers say.',
  eyebrow: 'Press & partners',
  headline: 'Flash Weather in the press, and what each partner does with Flash.',
  lede: 'Flash in Yahoo Sports, Aviation International News and Insurance Innovation Reporter, in the golf, roofing, insurance and fleet trade press, and a partner list that says what each partner does.',
};

/** The outlets whose logos the site carries (components/press/outlet-logos.tsx). */
export type OutletLogoId =
  | 'yahoo'
  | 'ain'
  | 'carrierManagement'
  | 'automotiveFleet'
  | 'roofingContractor'
  | 'golfCourseIndustry'
  | 'turfnet'
  | 'iir';

/**
 * "As seen in", under the press hero: eight outlets, each an anchor to its
 * entry further down the page (the entry carries the outbound link, so the
 * strip itself sends nobody away).
 */
export const asSeenIn: { logo: OutletLogoId; name: string; beat: string; target: string }[] = [
  { logo: 'yahoo', name: 'Yahoo Sports', beat: 'Golfweek · USA TODAY', target: '#featured-yahooWin' },
  { logo: 'ain', name: 'Aviation International News', beat: 'Aviation International News', target: '#featured-ain' },
  { logo: 'carrierManagement', name: 'Carrier Management', beat: 'Insurance', target: '#featured-carrierManagement' },
  { logo: 'automotiveFleet', name: 'Automotive Fleet', beat: 'Fleet trade', target: '#featured-automotiveFleet' },
  { logo: 'roofingContractor', name: 'Roofing Contractor', beat: 'Roofing', target: '#coverage-roofingContractor' },
  { logo: 'golfCourseIndustry', name: 'Golf Course Industry', beat: 'Golf', target: '#coverage-golfCourseIndustry' },
  { logo: 'turfnet', name: 'TurfNet', beat: 'Turf', target: '#coverage-turfnet' },
  { logo: 'iir', name: 'Insurance Innovation Reporter', beat: 'Insurtech', target: '#featured-iir' },
];

/** The home page's row: six logos, all pointing at this page. */
export const homeAsSeenIn: OutletLogoId[] = [
  'yahoo',
  'ain',
  'carrierManagement',
  'automotiveFleet',
  'golfCourseIndustry',
  'roofingContractor',
];

export type FeaturedCoverage = {
  /** The audited link the card opens. */
  id: PressLinkId;
  kicker: string;
  outlet: string;
  beat: string;
  headline: string;
  summary: string;
  /** The outbound link's text; the arrow is added. */
  cta: string;
  /** The Flash page the piece is about. */
  next: { label: string; href: string };
  /** Flash imagery behind the kicker and outlet name; never a stock photo or a publication logo. */
  image: { src: string; alt: string; focus: 'top' | 'middle' | 'bottom' };
};

/** Three featured pieces: national, insurtech, aviation. */
export const featuredCoverage: FeaturedCoverage[] = [
  {
    id: 'yahooWin',
    kicker: 'Myrtle Beach · eMYRge showcase',
    outlet: 'Yahoo Sports',
    beat: 'National',
    headline: 'Flash Weather AI wins the Myrtle Beach golf tech challenge',
    summary:
      "Golfweek's David Dusek, syndicated on Yahoo Sports, reports Flash won the pitch showcase at the eMYRge Golf Tech Accelerator Challenge, beating seven companies. The piece cites forecasts refreshed every two minutes on roughly one-square-kilometre cells, and an Alabama case where a strike was predicted 22 minutes out and landed 23 minutes later.",
    cta: 'Read it on Yahoo Sports',
    next: { label: 'Flash for golf', href: '/industries-we-serve/golf/' },
    image: {
      src: '/images/case-studies/troon-golf-fairway-dusk-storm-cell-horizon.jpg',
      alt: 'A golf green and flagstick at dusk under a dark storm cell building on the horizon',
      focus: 'bottom',
    },
  },
  {
    id: 'iir',
    kicker: 'Predictive Hail · launch coverage',
    outlet: 'Insurance Innovation Reporter',
    beat: 'Insurtech trade',
    headline: 'FLASH Weather AI launches hail prediction model',
    summary:
      "Anthony R. O'Donnell reports the Predictive Hail launch: hail size and arrival time predicted up to 55 minutes ahead on a 1×1 km grid, refreshed every five minutes, with lead meteorologist Dave Downey on why he trusts the model after a month in beta.",
    cta: 'Read it on IIR',
    next: { label: 'Hail Prediction', href: productPaths.hail },
    image: {
      src: '/images/press/flash-weather-predictive-hail-two-laptops.webp',
      alt: 'Flash Predictive Hail on two laptops: a hail-size swath over a county map and the hail history search',
      focus: 'middle',
    },
  },
  {
    id: 'ain',
    kicker: 'Business aviation · EBACE 2022',
    outlet: 'Aviation International News',
    beat: 'Aviation trade',
    headline: 'JetNet partners with Flash for lightning prediction',
    summary:
      "James Wynbrandt reports JetNet's partnership with Flash (then Flash Scientific Technology) to bring lightning prediction to business aviation: ground handlers off the ramp before the first strike, and an all-clear that is predicted rather than counted down.",
    cta: 'Read it on AIN',
    next: { label: 'Lightning Prediction', href: productPaths.lightning },
    image: {
      src: '/images/products/flash-weather-command-center-map.png',
      alt: 'The Flash lightning probability map over north Texas, with storm cells shaded by predicted strike risk on the 1×1 km grid',
      focus: 'middle',
    },
  },
];

export type Coverage = {
  /** The audited link the card opens. */
  id: PressLinkId;
  outlet: string;
  beat: string;
  headline: string;
  summary: string;
  /**
   * `position` is the cover crop, a Tailwind object-position class chosen so
   * no label in the picture is cut in half at the card's 576:230 frame.
   */
  image: { src: string; alt: string; caption: string; fit: 'cover' | 'contain'; position?: string };
};

/** The two hail-launch pieces with product imagery, as the design first drew them. */
export const coverage: Coverage[] = [
  {
    id: 'carrierManagement',
    outlet: 'Carrier Management',
    beat: 'Insurance trade',
    headline: 'Predictive Hail launches: hail predicted up to 55 minutes before it reaches a site',
    summary:
      "Carrier Management covered the launch of Predictive Hail, Flash Weather's hail-prediction engine, for its carrier and adjuster readership: hail size, timing and swath up to 55 minutes before the first stone falls, refreshed every five minutes, delivered by API and webhook so claims teams can position adjusters before a hail cell arrives.",
    // flashweather.ai/wp-content/uploads/2026/08/hail-forecast-e1787773994773.png, unedited.
    image: {
      src: '/images/press/flash-weather-predictive-hail-swath-map-hail-size.png',
      alt: "Flash's Predictive Hail map: a hail swath shaded by size class across north Arkansas, with a predicted hail size of 2.03 inches at its core, illustrating the Carrier Management coverage of the Predictive Hail launch",
      caption: 'Predictive Hail: the swath and the predicted hail size at a point. Product imagery.',
      fit: 'cover',
      position: 'object-[center_16%]',
    },
  },
  {
    id: 'automotiveFleet',
    outlet: 'Automotive Fleet',
    beat: 'Fleet trade',
    headline: 'Hail forecasts for fleet staging: move vehicles before the cell, not after',
    summary:
      "Automotive Fleet reported on Predictive Hail for fleet managers: 1×1 km hail predictions let dealers, rental yards and service fleets move exposed vehicles under cover up to 55 minutes before hail is forecast to reach the lot, with the alert routed to the yard supervisor's phone.",
    // flashweather.ai/wp-content/uploads/2026/05/laptop-phones.png, unedited.
    image: {
      src: '/images/press/flash-weather-command-center-mobile-app-lightning-alert.png',
      alt: 'The Flash Command Center radar map on a laptop beside two phones: an emailed Flash alert timeline and the lightning threat forecast in the mobile app, illustrating the Automotive Fleet coverage of alerts for yard staging',
      caption: 'The Command Center and the mobile app: the alert that reaches the person on site. Product imagery.',
      fit: 'cover',
      position: 'object-[center_20%]',
    },
  },
];

export type CoverageRow = {
  id: PressLinkId;
  /** Overrides the link's outlet or title where the row reads better another way. */
  outlet?: string;
  title?: string;
  /** A small label after the outlet (what the piece is, when it is not coverage). */
  tag?: string;
};

export type CoverageGroup = { id: string; name: string; intro: string; rows: CoverageRow[] };

/** The rest of the coverage, by beat: one line per piece, every link the original. */
export const coverageGroups: CoverageGroup[] = [
  {
    id: 'insurance',
    name: 'Insurance, roofing & fleets',
    intro: 'The Predictive Hail launch, May 2026',
    rows: [{ id: 'iir' }, { id: 'roofingContractor' }, { id: 'automotiveFleet' }, { id: 'carrierManagement' }],
  },
  {
    id: 'golf',
    name: 'Golf & turf',
    intro: 'eMYRge 2026, GCSAA 2026 and the Turf Threat Tracker acquisition',
    rows: [{ id: 'golfweekRoundup' }, { id: 'gcm' }, { id: 'turfnet' }, { id: 'golfCourseIndustry' }],
  },
  {
    id: 'aviation',
    name: 'Aviation',
    intro: 'The SmartSky and JETNET integrations',
    rows: [{ id: 'meteorologicalTechnology' }, { id: 'businessAirNews' }],
  },
  {
    id: 'podcasts',
    name: 'Podcasts & interviews',
    intro: 'Long-form conversations with the Flash team',
    rows: [
      { id: 'roofingRoadTrips', outlet: 'Roofing Road Trips' },
      { id: 'groundUpTurf' },
      { id: 'groundUpPrecision' },
      { id: 'groundUpSafety' },
      { id: 'turfToday' },
      { id: 'modGolf' },
    ],
  },
  {
    id: 'features',
    name: 'Features & video',
    intro: 'Partner media and television',
    rows: [
      { id: 'viewpoint', tag: 'Public TV feature' },
      { id: 'outdoorCoffeeShopFeature', tag: 'Feature' },
      { id: 'roofersCoffeeShopFeature', tag: 'Feature' },
    ],
  },
  {
    id: 'awards',
    name: 'Awards & speaking',
    intro: 'Third-party pages that record the credential',
    rows: [
      {
        id: 'yahooWin',
        outlet: 'eMYRge Golf Tech Accelerator',
        title: 'Winner, pitch showcase, Myrtle Beach (Golfweek on Yahoo Sports)',
      },
      { id: 'qbeFinalist' },
      { id: 'golfIncSummit' },
      { id: 'gulfStatesPga' },
    ],
  },
  {
    id: 'releases',
    name: 'Press releases',
    intro: 'Issued by Flash and its partners',
    rows: [
      { id: 'troonRelease' },
      { id: 'shieldRelease' },
      { id: 't3Release' },
      { id: 'golfGeniusAnnouncement' },
      { id: 'smartSkyRelease' },
    ],
  },
];

/** The "Also" line under the coverage: Flash's own channels. */
export const otherMentions: { text: string; href: string }[] = [
  { text: 'LinkedIn · Flash Weather company page', href: site.social.linkedin },
  { text: 'YouTube · Flash Weather channel', href: site.social.youtube },
];

export const heroStats = [
  { value: '99.6%', prefix: 'Up to', label: 'Lightning prediction accuracy on the one-hour window' },
  { value: '55 min', label: 'Hail lead time of up to 55 min before the first stone falls' },
  { value: '15+', label: 'Proprietary prediction products, all on one platform' },
];

export type Partner = {
  name: string;
  work: string;
  /** The Flash page that explains the work. Internal, always, and first. */
  link: { label: string; href: string };
  /** The partner's own announcement or page, where one exists. Outbound, quieter. */
  external?: { label: string; id: PressLinkId }[];
};

export const partners: Partner[] = [
  {
    name: 'Troon',
    work: 'Preferred Vendor Partner of Troon and an approved vendor across all 700+ Troon golf properties. Westchester Hills Golf Club in White Plains was the first Troon facility live on the platform, in September 2026.',
    link: { label: 'Case study · Troon', href: '/case-studies/troon/' },
    external: [{ label: 'Announcement · GlobeNewswire', id: 'troonRelease' }],
  },
  {
    name: 'Big 12 Conference',
    work: 'Flash is the official weather safety provider of the Big 12 Conference.',
    link: { label: 'Schools', href: '/industries-we-serve/schools/' },
  },
  {
    name: 'Syngenta',
    work: 'Flash is the API lightning provider for Syngenta.',
    link: { label: 'Agriculture', href: '/industries-we-serve/agriculture/' },
  },
  {
    name: 'NAIA',
    work: 'Official Weather Monitoring & Alert System of the NAIA through October 2028, covering the association’s opening rounds and national championships.',
    link: { label: 'Schools', href: '/industries-we-serve/schools/' },
    external: [{ label: 'Partner page · naia.org', id: 'naiaPartner' }],
  },
  {
    name: 'McClatchy Media',
    work: 'Publishes Flash-powered weather content across its local news titles. Readers get the same lightning and hail outlooks that Flash customers see for their sites.',
    link: { label: 'Products', href: productPaths.index },
  },
  {
    name: 'Golf Genius',
    work: 'Integrates Flash lightning alerts into its tournament-management software, so committees see the prediction next to the tee sheet. Suspension and resumption decisions are logged with the round.',
    link: { label: 'Golf', href: '/industries-we-serve/golf/' },
    external: [
      { label: 'Marketplace listing', id: 'golfGeniusMarketplace' },
      { label: 'Integration guide', id: 'golfGeniusGuide' },
    ],
  },
  {
    name: "Annika Women's All Pro Tour",
    work: 'Runs event-day forecasting with Flash: a written outlook the day before each round and live strike prediction on site. Tournament staff receive the alert before the first group is called in.',
    link: { label: 'Golf', href: '/industries-we-serve/golf/' },
  },
  {
    name: 'Turf Assistant',
    work: 'Distributes the Flash Agronomy Suite to its superintendent customers as part of the Turf Assistant subscription. The Turf Threat Tracker acquisition brought the two products together.',
    link: { label: 'Agronomy Suite', href: productPaths.agronomy },
  },
  {
    name: 'BuildTree',
    work: 'Features Flash as a partner for construction scheduling: lightning predicted up to 60 minutes ahead and hail up to 55, so crews schedule around storms instead of through them.',
    link: { label: 'Construction', href: '/industries-we-serve/construction/' },
    external: [{ label: 'Partner page · BuildTree', id: 'buildTree' }],
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Where the quote was published, when it was not given to Flash directly. */
  source?: { label: string; id: PressLinkId };
  /** The picture on the card: Flash's own imagery for the industry the speaker works in. */
  image: { src: string; alt: string };
  /** An official headshot, once one is approved; it replaces `image` on the card. */
  photo?: { src: string; alt: string };
};

/**
 * The Troon release's two quotes (verbatim, with their source), then
 * customer quotes word for word as flashweather.ai publishes them (its
 * homepage testimonials), with the names and titles it gives. The Edge
 * Zipline quote is reinstated from the pre-migration flashweather.ai/about/
 * page. Quotes keep the brand name the customer used.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      'Flash gives our teams a predictive picture rather than a reactive one, and we are pleased to make it available to Troon-managed properties through our preferred vendor program.',
    name: 'Ryan Pensy',
    role: 'Vice President, Strategic Partnerships · Troon',
    source: { label: 'Source: GlobeNewswire, 22 Sep 2026', id: 'troonRelease' },
    image: {
      src: '/images/products/flash-golf-fairway-rain-industry-golf.webp',
      alt: 'A tree-lined golf fairway under a grey sky, with rain standing in pools on the grass',
    },
  },
  {
    quote:
      'Knowing what is coming before it forms changes how we manage the golf calendar and how quickly we can get members and guests back out.',
    name: 'Josh Lowney',
    role: 'General Manager · Westchester Hills Golf Club',
    source: { label: 'Source: GlobeNewswire, 22 Sep 2026', id: 'troonRelease' },
    image: {
      src: '/images/case-studies/troon-golf-fairway-dusk-storm-cell-horizon.jpg',
      alt: 'A golf fairway at dusk with a storm cell building on the horizon',
    },
  },
  {
    quote:
      'Flash Weather AI has completely transformed how we’ve operated events this year, from the spot-on lightning prediction and return-to-play guidance, to pinpoint timing from the Flash forecasts while looking at incoming precipitation and severe weather. The stress of adjusting event schedules on the fly is now a thing of the past. There’s been simply no contest to Flash AI’s real-time insights since adding it to our event workflows.',
    name: 'Nick Williams',
    role: 'Big 12 Director of Competitions',
    image: {
      src: '/images/industries/flash-schools-championship-stadium-bowl-dusk-storm.png',
      alt: 'An empty collegiate championship stadium bowl at dusk, bleachers and scoreboard gantry in silhouette beneath a thick bank of storm cloud',
    },
  },
  {
    quote:
      'Flash AI is one of the greatest technologies I’ve seen in a while. It’s more accurate than any other hail map. I stand behind it 100%. This is a game-changer for the industry.',
    name: 'Will Gamble',
    role: 'Infinity Roofing',
    image: {
      src: '/images/industries/flash-roofing-hail-shelf-cloud-over-rooftop-hero.jpg',
      alt: 'A residential rooftop and ladder under an approaching dark hail shelf cloud, the last sunlight on the shingles',
    },
  },
  {
    quote:
      "Flash Weather AI's real-time, highly accurate data and 'All Clear' feature have streamlined our operations, maximizing operating time and guest satisfaction.",
    name: 'Chris Wahle',
    role: 'Manager · The Edge Zipline, Castle Rock, Colorado',
    image: {
      src: '/images/industries/flash-schools-empty-infield-rolled-tarp-floodlights.png',
      alt: 'An empty baseball infield with the rain tarp rolled at the edge and the floodlights burning under heavy evening storm cloud',
    },
  },
  {
    quote:
      'Flash Weather has been a tremendous resource for helping us plan and make informed decisions around weather conditions, especially lightning and heat. Being able to see when lightning is predicted in our area allows us to plan ahead and keep our athletes, coaches, and staff safe. The five-day Wet Bulb Globe Temperature (WBGT) forecast has also been extremely valuable for our fall sports, giving our coaches the information they need to prepare for heat conditions well in advance.',
    name: 'Jeff Bissen',
    role: 'Activities Director, Glenwood Community HS',
    image: {
      src: '/images/industries/flash-school-athletic-field-floodlit-dusk-cumulus-hero.jpg',
      alt: 'An empty floodlit high-school athletic field at dusk under building cumulus clouds, with Flash’s practice-field WBGT card showing 88.1 °F and the day’s lightning advisory and all-clear',
    },
  },
];
