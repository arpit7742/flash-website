/**
 * About page content, as data (Paper "19b · About", copy verbatim).
 *
 * Every figure here is on the approved fact sheet; the page says so in its
 * own H2. Do not add an outcome claim (downtime, losses avoided) until it is
 * sourced and dated. Outbound links come from the audited list
 * (content/press-links.ts).
 */

import type { PressLinkId } from '@/content/press-links';

export const founder = {
  name: 'Jason Deese',
  jobTitle: 'Founder and Chief Meteorologist',
  description:
    "Founder and Chief Meteorologist of Flash Weather, and a former forecaster at NOAA's National Weather Service.",
  facts: [
    { value: 'Forecasters', label: 'by trade' },
    { value: 'NWS', label: "NOAA's National Weather Service" },
    { value: 'Predict', label: 'not detect' },
    { value: 'Canton, GA', label: 'Atlanta metro' },
  ],
  /** Third-party pages that record the founder's appearances, each one link. */
  credentials: {
    label: 'Heard and seen',
    items: [
      { text: 'Guest, The ModGolf Podcast, 2024 PGA Show media stage', id: 'modGolf' },
      { text: 'Speaker, Golf Inc. Strategies Summit 2026', id: 'golfIncSummit' },
      { text: "Featured on public television's Viewpoint with Dennis Quaid", id: 'viewpoint' },
    ] as { text: string; id: PressLinkId }[],
  },
};

export const principles = [
  {
    title: "Predict, don't detect.",
    body: 'A detector tells you a strike has already happened. A prediction tells you which 1×1 km cell is about to take one, up to 60 minutes ahead. Everything Flash builds starts from the second, because that is the one a coach, a foreman or a superintendent can act on.',
    link: { text: 'prediction', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
  },
  {
    title: 'Publish the method.',
    body: 'Every accuracy figure we quote comes with its window: up to 99.6% lightning prediction accuracy on the one-hour window. The accuracy method page shows how the number is computed and when it was last refreshed.',
    link: { text: 'accuracy method page', href: '/why-flash/accuracy-method/' },
  },
  {
    title: "Act in the customer's tools.",
    body: 'A forecast is only useful when it changes a decision. Sky answers in plain language and acts in the calendar, ERP or CRM you already run — Google Calendar, Procore, HubSpot, NetSuite — with a human confirming any change to a schedule or a record.',
    link: { text: 'Sky', href: '/products/flash-agent/' },
  },
];

export const companyNumbers = [
  { value: '15+', label: 'proprietary prediction products', gold: false },
  { value: '100+', label: 'atmospheric parameters in the Flash API and Edge Model', gold: false },
  { value: '1×1 km', label: 'grid cells across the continental U.S.', gold: false },
  { value: '55 min', label: 'hail lead time, up to 55 min before the first stone falls', gold: true },
  { value: '180 h', label: 'of forecasts in the Flash API', gold: false },
];

export type Milestone = {
  name: string;
  title: string;
  body: string;
  /** One phrase of the body, linked to the Flash page it names. */
  link?: { text: string; href: string };
  /** The third-party page that records the milestone, as a trailing link. */
  external?: { label: string; id: PressLinkId };
  gold: boolean;
};

/** Six milestones, in order; the gold dot stays on Accuracy. */
export const milestones: Milestone[] = [
  {
    name: 'Origin',
    title: 'Founded by a forecaster',
    body: "Flash Scientific Technology Inc. is founded by Jason Deese in Canton, Georgia, after a career at NOAA's National Weather Service.",
    gold: false,
  },
  {
    name: 'Agronomy',
    title: 'Turf Threat Tracker acquisition',
    body: 'Frost, evapotranspiration, disease forecasting and growing-degree-day tracking join the platform as the Flash Agronomy Suite.',
    link: { text: 'Flash Agronomy Suite', href: '/products/agronomy-suite/' },
    external: { label: 'Covered by TurfNet', id: 'turfnet' },
    gold: false,
  },
  {
    name: 'Athletics',
    title: 'Official alert system of the NAIA',
    body: 'The NAIA names Flash its Official Weather Monitoring & Alert System through October 2028, covering opening rounds and national championships.',
    link: { text: 'NAIA', href: '/industries-we-serve/schools/' },
    external: { label: 'Partner page on naia.org', id: 'naiaPartner' },
    gold: false,
  },
  {
    name: 'Hail',
    title: 'Predictive Hail launch',
    body: 'Hail predicted up to 55 minutes before the first stone falls, with size class, timing and swath; covered by Insurance Innovation Reporter, Carrier Management, Roofing Contractor and Automotive Fleet.',
    link: { text: 'Hail predicted', href: '/products/hail-prediction/' },
    external: { label: 'Read the launch coverage', id: 'iir' },
    gold: false,
  },
  {
    name: 'Golf',
    title: 'Preferred Vendor Partner of Troon',
    body: 'Troon names Flash a Preferred Vendor Partner (Sep 2026), and Flash wins the eMYRge Golf Tech Accelerator Challenge in Myrtle Beach (Oct 2026).',
    link: { text: 'Preferred Vendor Partner', href: '/case-studies/troon/' },
    external: { label: 'Golfweek on Yahoo Sports', id: 'yahooWin' },
    gold: false,
  },
  {
    name: 'Accuracy',
    title: 'Accuracy method published',
    body: 'Up to 99.6% lightning prediction accuracy on the one-hour window, published with its method and refresh date.',
    link: { text: 'published with its method', href: '/why-flash/accuracy-method/' },
    gold: true,
  },
];

export const aboutCustomers = [
  { name: 'Troon', use: 'Approved vendor across all 700+ Troon golf properties', href: '/case-studies/troon/' },
  { name: 'Big 12', use: 'Official weather safety provider of the Big 12 Conference' },
  { name: 'Syngenta', use: 'API lightning provider' },
  { name: 'NAIA', use: 'Official weather alert system' },
];

/** Customers whose quotes from the old About page now live on Press & Partners. */
export const quotedCustomers = [
  'the Big 12 Conference',
  'Infinity Roofing',
  'The Edge Zipline',
  'Glenwood Community High School',
];
