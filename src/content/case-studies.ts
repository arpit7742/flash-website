/**
 * Case studies, as data.
 *
 * Copy is the design's, verbatim. Testimonials are quoted exactly and carry
 * only the attribution the client supplied, or the public source they were
 * published in (the September 2026 Troon release, content/press-links.ts).
 * No outcome percentages are published for Troon: the deployment facts and
 * the per-event log are the evidence.
 */

import { PRESS_PATH } from '@/content/press';
import type { PressLinkId } from '@/content/press-links';
import { links } from '@/content/why-flash';

type Img = { src: string; alt: string };

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Where the quote was published, when it was not given to Flash directly. */
  source?: { label: string; id: PressLinkId };
};

/** A line in the "In the golf press" strip: one outbound link each. */
export type GolfPressCard = { kind: string; id: PressLinkId; outlet: string; title: string };

const IMG = '/images/case-studies';

export const troon = {
  eyebrow: 'Case study · Golf · Troon',
  headline: 'Flash is an approved vendor across all 700+ Troon golf properties.',
  intro:
    'One Weather Command Center for the whole portfolio: every course in its own 1×1 km cell, a 60-minute strike-level forecast refreshed every 2 minutes, and a written log for every decision — from the horn relay to the tee sheet.',
  productsLine: 'Flash Lightning Prediction · Weather Command Center · Flash Mobile App · Sky',
  hero: {
    src: `${IMG}/troon-golf-fairway-dusk-storm-cell-horizon.jpg`,
    alt: 'A manicured golf fairway at dusk with a dark storm cell building on the horizon and gold light on the flag, the hero photograph of the Troon case study',
  } satisfies Img,
  heroQuote: {
    quote:
      'With Flash Weather AI, we’ve moved from guessing to confidently managing the weather. It’s like having a pocket weather expert, assuring our members’ safety and satisfaction.',
    name: 'Ryan Coll',
    role: 'Director of Golf, Columbus Country Club',
  } satisfies Testimonial,

  atAGlance: [
    { label: 'Customer', value: 'Troon' },
    { label: 'Status', value: 'Preferred Vendor Partner, September 2026' },
    { label: 'Segment', value: 'Golf course management' },
    { label: 'Footprint', value: 'A portfolio of golf properties' },
    { label: 'Products', value: 'Flash Lightning Prediction · Flash Weather Command Center · Flash Mobile App' },
    { label: 'Alert channels', value: 'App · SMS · on-course horn relays' },
    { label: 'Live since', value: 'Multi-year customer' },
  ],

  /** `chapter` puts the block on the chapter markers beside the story. */
  narrative: [
    {
      id: 'story-problem',
      chapter: 'Problem',
      heading: 'What was the problem across the portfolio?',
      paragraphs: [
        'Troon manages a portfolio of courses under one duty of care. On most of them the lightning horn was wired to a detection feed, so it fired after the first strike inside the radius. Until then the superintendent, the pro shop and the general manager each made their own call about when to pull crews and players, and when to let play resume.',
        'The result was inconsistency: early on some courses, late on others, and no shared record of why a course was cleared or reopened. A portfolio that size needs one trigger, one clock and one log.',
      ],
    },
    {
      id: 'story-rollout',
      heading: 'What did Troon roll out?',
      paragraphs: [
        'One Flash Weather Command Center for the whole portfolio. Every course sits in its own 1×1 km cell with a 60-minute strike-level forecast that refreshes every 2 minutes, plus a 5-hour lightning probability for the day’s tee sheet and maintenance windows.',
        'Roles are set per property. The general manager sees the portfolio view; the superintendent gets crew alerts by app and SMS; the pro shop gets the tee-sheet call. The all-clear timer runs from the last strike on the club’s own policy, and the relay to the on-course horns fires from the same rule, so a horn never sounds for a different reason than the app.',
      ],
    },
    {
      id: 'story-change',
      chapter: 'Change',
      heading: 'What changed on the ground?',
      paragraphs: [
        'Decisions are made earlier and on the same trigger. Blanket closures gave way to per-course calls, because a cell forecast for one property does not clear or close another.',
        'Every event now leaves a written log: the alert level, the time, the channel, who acted.  We do not publish downtime or loss percentages for Troon; the log is the evidence.',
      ],
    },
    {
      id: 'story-scale',
      chapter: 'Scale',
      heading: 'How did it scale across the portfolio?',
      paragraphs: [
        'A portfolio view for the company, bulk onboarding from a property list, and the Flash API for properties that route alerts into their own systems. A new course is a pin on the map, not a hardware install: no station, no mast, no site visit.',
        'In September 2026 Troon named Flash a Preferred Vendor Partner. Westchester Hills Golf Club in White Plains was the first Troon facility live on the platform; its maintenance team now uses the same forecast for spray and irrigation planning. Setup took about a day.',
      ],
      source: { label: 'Source: GlobeNewswire, 22 Sep 2026', id: 'troonRelease' },
    },
  ] as {
    id: string;
    chapter?: string;
    heading: string;
    paragraphs: string[];
    /** The published source behind the block's facts, where there is one. */
    source?: { label: string; id: PressLinkId };
  }[],

  screens: [
    {
      badge: '01 · Weather Command Center',
      caption: 'Every course on one screen',
      role: 'The general manager',
      body: 'One portfolio view: every course in its own 1×1 km cell, the alert level, the time the call was made and who acted on it.',
      image: {
        src: `${IMG}/flash-weather-command-center-troon-portfolio-view.png`,
        alt: 'The Flash Weather Command Center on a laptop showing a storm on a 1×1 km grid, the portfolio view the general manager watches',
      },
      link: links.commandCenter,
    },
    {
      badge: '02 · Flash Mobile App',
      caption: '18 hours of future radar, in the pocket',
      role: 'The superintendent and the crew',
      body: 'The same cell by app and SMS, with up to 60 minutes of strike-level lead, so mowers and members move before the horn relay fires.',
      image: {
        src: `${IMG}/flash-mobile-app-superintendent-lightning-alert.png`,
        alt: "Four Flash Mobile App screens showing lightning probability, future radar, live radar and a seven-day forecast, the same call in the superintendent's pocket",
      },
      link: links.mobileApp,
    },
  ],

  map: {
    alt: 'Flash Weather Command Center portfolio map showing Troon golf properties as 1×1 km cells, a 60-minute lightning warning cell over one course, and the written event log beside it',
    log: [
      { time: '14:02', property: '0412', entry: 'Advisory · cell flagged · app + SMS to superintendent' },
      { time: '14:21', property: '0412', entry: 'Warning · horns relayed · pro shop clears the course' },
      { time: '14:33', property: '0412', entry: 'First CG strike detected · 12 min after Warning' },
      { time: '14:58', property: '0412', entry: 'All-clear timer running · resets on each strike' },
    ],
  },

  agent: {
    body: 'Sky, Flash Weather’s AI weather agent, reads the same 1×1 km cells as the portfolio map and acts in the tools Troon already runs: the Golf Genius tee sheet, the crew calendar and SMS. Every action is permissioned, logged, and confirmed by a person before a tee sheet changes.',
    question: 'Which Troon properties have a lightning Watch before Sunday’s tee times?',
    answer:
      'Two. Property 0412 has a Watch from 07:40 to 09:10 with a first tee at 08:00, and Property 0433 has a Watch from 09:10 to 10:30 that covers its 09:12 and later groups. Both tee sheets are flagged in Golf Genius and both superintendents were texted. Every other property is clear through noon.',
    /** What the agent did and what it read, as the conversation's chips (label, then value). */
    chips: [
      { label: 'Golf Genius', value: 'tee sheet flagged' },
      { label: 'SMS', value: 'both superintendents' },
      { label: 'Source', value: 'cells 0412 · 0433 · 06:02 run' },
    ],
    placeholder: 'Ask about any property, any day…',
  },

  stats: [
    { value: '99.6%', prefix: 'Up to', label: 'lightning prediction accuracy in the one-hour window' },
    { value: '60 min', label: 'strike-level lead of up to 60 min on every course' },
    { value: '2 min', label: 'lightning-model refresh, portfolio-wide' },
    { value: '1×1 km', label: 'forecast cell per course, not per region' },
  ],

  /** The proof-bar customer this page is about: tagged "This case study", the others sit back. */
  proofCurrent: 'Troon',
  proof: [
    { name: 'Troon', use: 'Approved vendor across all 700+ Troon golf properties' },
    { name: 'Big 12', use: 'Official weather safety provider of the Big 12 Conference' },
    { name: 'Syngenta', use: 'API lightning provider' },
    { name: 'NAIA', use: 'Official weather alert system' },
  ],

  testimonialPhoto: {
    src: `${IMG}/flash-rain-on-putting-green-flagstick.jpg`,
    alt: 'Heavy rain sheeting across an empty putting green with a flagstick and standing water, shown beside what golf operators say about running Flash',
  } satisfies Img,
  testimonials: [
    {
      // Word for word from the flashweather.ai homepage testimonials.
      quote:
        'Flash Weather AI provides dependable, real-time insights and proactive alerts that give us the confidence to act quickly when conditions change.',
      name: 'Adam Greeno',
      role: 'Executive Director, Midwest PGA',
    },
    {
      // His line in the customer video (home page clip, components/home/proof.tsx).
      quote: 'I think it’s the best weather technology in the country.',
      name: 'Ryan Coll',
      role: 'Director of Golf, Columbus Country Club',
    },
    {
      quote:
        'Flash gives our teams a predictive picture rather than a reactive one, and we are pleased to make it available to Troon-managed properties through our preferred vendor program.',
      name: 'Ryan Pensy',
      role: 'Vice President, Strategic Partnerships, Troon',
      source: { label: 'Source: GlobeNewswire, 22 Sep 2026', id: 'troonRelease' },
    },
    {
      quote:
        'Knowing what is coming before it forms changes how we manage the golf calendar and how quickly we can get members and guests back out.',
      name: 'Josh Lowney',
      role: 'General Manager, Westchester Hills Golf Club',
      source: { label: 'Source: GlobeNewswire, 22 Sep 2026', id: 'troonRelease' },
    },
  ] satisfies Testimonial[],

  otherSports: [
    {
      name: 'Big 12 Conference',
      body: 'Flash is the official weather safety provider of the Big 12 Conference.',
      image: {
        src: `${IMG}/flash-floodlit-athletic-field-storm-building.jpg`,
        alt: 'A floodlit empty athletic field at dusk with storm clouds building beyond the light towers',
      },
    },
    {
      name: 'NAIA',
      body: 'Official Weather Monitoring & Alert System of the NAIA through October 2028.',
      image: {
        src: `${IMG}/flash-floodlight-towers-championship-host-site.jpg`,
        alt: 'Floodlight towers over an empty outdoor sports complex at dusk with a rain shaft approaching',
      },
      partnerPage: { label: 'Partner page', id: 'naiaPartner' as PressLinkId },
    },
  ],

  /**
   * "In the golf press": what the golf trade and Golfweek have said, each line
   * one outbound link from the audited list, before Keep reading.
   */
  golfPress: {
    label: 'In the golf press',
    heading: 'What the golf press has said about Flash',
    allLink: { label: 'All coverage', href: PRESS_PATH },
    cards: [
      {
        kind: 'Award',
        id: 'yahooWin',
        outlet: 'Golfweek · Yahoo Sports',
        title: 'Flash wins the eMYRge Golf Tech Accelerator Challenge',
      },
      {
        kind: 'Coverage',
        id: 'golfweekRoundup',
        outlet: 'Golfweek · Yahoo Sports',
        title: '“Best in Show” among eight presenters in Myrtle Beach',
      },
      {
        kind: 'Coverage',
        id: 'turfnet',
        outlet: 'TurfNet',
        title: 'Flash acquires Turf Threat Tracker for turf managers',
      },
      {
        kind: 'Name-check',
        id: 'gcm',
        outlet: 'GCM · GCSAA',
        title: 'Named among AI tools for course maintenance at GCSAA 2026',
      },
    ] satisfies GolfPressCard[],
    /** One line under the cards: the webinar and the podcast. */
    footline: [
      { text: 'Also presented in the Gulf States PGA Professional Development Webinar Series', id: 'gulfStatesPga' as PressLinkId },
      { text: 'heard on The ModGolf Podcast from the 2024 PGA Show', id: 'modGolf' as PressLinkId },
    ],
  },

  related: [
    { kind: 'Product', title: 'Flash Lightning Prediction', href: links.lightning.href },
    { kind: 'Industry', title: 'Golf courses and clubs', href: links.golf.href },
    { kind: 'Comparison', title: 'Everyone else vs Flash', href: '/why-flash/everyone-else-vs-flash/' },
    { kind: 'Pricing', title: 'Plans for one course or a portfolio', href: links.pricing.href },
  ],
};
