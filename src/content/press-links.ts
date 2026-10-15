/**
 * Every third-party link the site may point at, in one place.
 *
 * These are the 34 links approved in the October 2026 press and authority
 * audit (the spreadsheet in the repo root): one canonical copy per story,
 * read on the day, with the outlet's own headline. Pages compose from this
 * record -- the press page lists them, the product and industry pages show
 * the few that belong to their reader -- so a dead or changed link is fixed
 * here once.
 *
 * Rules the audit set, so they are not re-litigated per page:
 * - One link per piece. Mirrors, wire copies, art19/Spotify duplicates and
 *   aggregators were rejected, not hidden.
 * - Anchor text names the outlet and the piece, never "read more".
 * - External links are followed (no `nofollow`), open in a new tab, and carry
 *   `rel="noopener"`: these are editorial and partner pages we vouch for.
 * - The site's own figures stay the site's: older pieces quote 2022-2023
 *   numbers, and nothing here repeats them.
 * - The Weather Channel is a competitor. Nothing of its appears on the site.
 */

export type PressLinkKind =
  | 'Coverage'
  | 'Podcast'
  | 'Feature'
  | 'Video'
  | 'Award'
  | 'Speaking'
  | 'Webinar'
  | 'Release'
  | 'Partner page';

export type PressLink = {
  outlet: string;
  /** The piece's own headline, as the site prints it. */
  title: string;
  /** ISO date, for ordering and for schema; `dateLabel` is what the page shows. */
  date: string;
  dateLabel: string;
  href: string;
  kind: PressLinkKind;
  /**
   * When `outlet` names more than one outlet ("Yahoo Sports · Golfweek"):
   * each name, with the piece on that outlet's own site. A name without an
   * `href` has no article of its own and is printed plain.
   */
  outlets?: { name: string; href?: string }[];
};

const link = <T extends Record<string, PressLink>>(links: T) => links;

export const pressLinks = link({
  // --- National and trade coverage --------------------------------------
  yahooWin: {
    outlet: 'Yahoo Sports · Golfweek',
    title: 'Flash Weather AI wins the Myrtle Beach golf tech challenge',
    date: '2026-10-12',
    dateLabel: '12 Oct 2026',
    href: 'https://sports.yahoo.com/articles/flash-weather-ai-wins-myrtle-180104892.html',
    kind: 'Coverage',
    // Golfweek's original (golfweek.usatoday.com/story/sports/golf/2026/10/12/
    // flash-weather-ai-brings-lightning-forecasts-to-golf-courses/92219091007/)
    // is behind a 402 wall and has no archive copy, so it could not be checked
    // for the Flash mention: industries-audit/pending-confirmation.md.
    outlets: [
      { name: 'Yahoo Sports', href: 'https://sports.yahoo.com/articles/flash-weather-ai-wins-myrtle-180104892.html' },
      { name: 'Golfweek' },
    ],
  },
  golfweekRoundup: {
    outlet: 'Golfweek · Yahoo Sports',
    title: 'Myrtle Beach hosts the eMYRge Golf Tech Accelerator Challenge. Who won?',
    date: '2026-10-10',
    dateLabel: '10 Oct 2026',
    href: 'https://sports.yahoo.com/articles/myrtle-beach-hosts-emyrge-golf-153042349.html',
    kind: 'Coverage',
    outlets: [
      {
        name: 'Golfweek',
        href: 'https://golfweek.usatoday.com/story/sports/golf/equipment/2026/10/10/myrtle-beach-hosts-emyrge-golf-tech-accelerator-challenge/92168407007/',
      },
      { name: 'Yahoo Sports', href: 'https://sports.yahoo.com/articles/myrtle-beach-hosts-emyrge-golf-153042349.html' },
    ],
  },
  iir: {
    outlet: 'Insurance Innovation Reporter',
    title: 'FLASH Weather AI launches hail prediction model',
    date: '2026-05-05',
    dateLabel: '5 May 2026',
    href: 'https://iireporter.com/flash-weather-ai-launches-hail-prediction-model/',
    kind: 'Coverage',
  },
  roofingContractor: {
    outlet: 'Roofing Contractor',
    title: 'FLASH Weather AI launches hail forecast tool',
    date: '2026-05-13',
    dateLabel: '13 May 2026',
    href: 'https://www.roofingcontractor.com/articles/102211-flash-weather-ai-launches-hail-forecast-tool',
    kind: 'Coverage',
  },
  automotiveFleet: {
    outlet: 'Automotive Fleet',
    title: 'First deep-learning hail prediction model with high-resolution forecasting',
    date: '2026-05-13',
    dateLabel: '13 May 2026',
    href: 'https://www.automotive-fleet.com/news/flash-weather-ai-launches-first-deep-learning-hail-prediction-model-with-high-resolution-forecasting',
    kind: 'Coverage',
  },
  carrierManagement: {
    outlet: 'Carrier Management',
    title: 'FLASH Weather AI launches hail prediction model',
    date: '2026-05-15',
    dateLabel: '15 May 2026',
    href: 'https://www.carriermanagement.com/news/2026/05/15/288050.htm',
    kind: 'Coverage',
  },
  gcm: {
    outlet: 'GCM · GCSAA',
    title: 'AI in golf course maintenance: Flash named among the tools at GCSAA 2026',
    date: '2026-02-04',
    dateLabel: '4 Feb 2026',
    href: 'https://gcmonline.com/course/environment/news/ai-in-golf-course-maintenance-not-perfect-but--it-s-pretty-good',
    kind: 'Coverage',
    // GCM is GCSAA's magazine: the piece is GCM's; GCSAA itself has no article.
    outlets: [
      { name: 'GCM', href: 'https://gcmonline.com/course/environment/news/ai-in-golf-course-maintenance-not-perfect-but--it-s-pretty-good' },
      { name: 'GCSAA' },
    ],
  },
  turfnet: {
    outlet: 'TurfNet',
    title: 'Flash Weather AI acquires Turf Threat Tracker to enhance forecasting for turf managers',
    date: '2024-11-27',
    dateLabel: '27 Nov 2024',
    href: 'https://turfnet.com/news/flash-weather-ai-acquires-turf-threat-tracker-to-enhance-forecasting-for-turf-managers/',
    kind: 'Coverage',
  },
  golfCourseIndustry: {
    outlet: 'Golf Course Industry',
    title: 'Flash Weather AI expands into the golf industry',
    date: '2024-11-26',
    dateLabel: 'Nov 2024',
    href: 'https://www.golfcourseindustry.com/news/flash-weather-ai-golf-data/',
    kind: 'Coverage',
  },
  meteorologicalTechnology: {
    outlet: 'Meteorological Technology International',
    title: 'Flash Weather AI and SmartSky to bring predictive lightning data to aviation',
    date: '2023-09-07',
    dateLabel: '7 Sep 2023',
    href: 'https://www.meteorologicaltechnologyinternational.com/news/aviation/flash-weather-ai-and-smartsky-to-bring-predictive-lightning-data-to-aviation.html',
    kind: 'Coverage',
  },
  businessAirNews: {
    outlet: 'Business Air News',
    title: 'Flash gives JETNET the heads up on lightning',
    date: '2022-06-06',
    dateLabel: '6 Jun 2022',
    href: 'https://www.businessairnews.com/mag_story.html?ident=24629',
    kind: 'Coverage',
  },
  ain: {
    outlet: 'Aviation International News',
    title: 'JetNet partners with Flash for lightning prediction',
    date: '2022-05-25',
    dateLabel: '25 May 2022',
    href: 'https://www.ainonline.com/aviation-news/business-aviation/2022-05-25/jetnet-partners-flash-lightning-prediction',
    kind: 'Coverage',
  },

  // --- Podcasts and interviews -------------------------------------------
  roofingRoadTrips: {
    outlet: 'Roofing Road Trips · RoofersCoffeeShop',
    title: 'How contractors stay ahead of hail, with Jameson Allen',
    date: '2026-08-10',
    dateLabel: '10 Aug 2026',
    href: 'https://www.rooferscoffeeshop.com/podcast/jameson-allen-how-contractors-stay-ahead-of-hail',
    kind: 'Podcast',
  },
  groundUpTurf: {
    outlet: 'From the Ground Up',
    title: 'Turf intelligence in action, with Garrett Bastardi',
    date: '2026-06-16',
    dateLabel: '16 Jun 2026',
    href: 'https://www.outdoorcoffeeshop.com/podcast/garrett-bastardi-turf-intelligence-in-action',
    kind: 'Podcast',
  },
  groundUpPrecision: {
    outlet: 'From the Ground Up',
    title: 'Precision weather and the future of outdoor work, with Jameson Allen',
    date: '2026-03-03',
    dateLabel: '3 Mar 2026',
    href: 'https://www.outdoorcoffeeshop.com/podcast/jameson-allen-precision-weather-and-the-future-of-outdoor-work',
    kind: 'Podcast',
  },
  groundUpSafety: {
    outlet: 'From the Ground Up',
    title: 'Safety beyond the standard: rethinking weather risk, with Jameson Allen',
    date: '2026-03-03',
    dateLabel: '3 Mar 2026',
    href: 'https://www.outdoorcoffeeshop.com/podcast/jameson-allen-safety-beyond-the-standard-rethinking-weather-risk',
    kind: 'Podcast',
  },
  turfToday: {
    outlet: 'Turf Today',
    title: 'Ep. 120: Garrett Bastardi, Head of Innovation and Development',
    date: '2025-11-11',
    dateLabel: '11 Nov 2025',
    href: 'https://podcasts.apple.com/us/podcast/garrett-bastardi/id1677998239?i=1000736214452',
    kind: 'Podcast',
  },
  modGolf: {
    outlet: 'The ModGolf Podcast',
    title: 'Live from the 2024 PGA Show media stage: Jason Deese from 14:45',
    date: '2024-02-21',
    dateLabel: '21 Feb 2024',
    href: 'https://modgolf.fireside.fm/pgashow2024-part-01',
    kind: 'Podcast',
  },

  // --- Features and video -------------------------------------------------
  viewpoint: {
    outlet: 'Viewpoint with Dennis Quaid',
    title: 'FLASH Weather AI on lightning-strike safety',
    date: '2023-06-10',
    dateLabel: 'Jun 2023',
    href: 'https://www.youtube.com/watch?v=fdoQxP7tQxM',
    kind: 'Video',
  },
  outdoorCoffeeShopFeature: {
    outlet: 'OutdoorCoffeeShop',
    title: 'The power of turf-focused intelligence: Garrett Bastardi interviewed',
    date: '2026-07-12',
    dateLabel: '12 Jul 2026',
    href: 'https://www.outdoorcoffeeshop.com/post/the-power-of-turf-focused-intelligence',
    kind: 'Feature',
  },
  roofersCoffeeShopFeature: {
    outlet: 'RoofersCoffeeShop',
    title: 'Stay ahead of hail with predictive weather intelligence',
    date: '2026-09-20',
    dateLabel: '20 Sep 2026',
    href: 'https://www.rooferscoffeeshop.com/post/stay-ahead-of-hail-with-predictive-weather-intelligence',
    kind: 'Feature',
  },

  // --- Awards and speaking -------------------------------------------------
  qbeFinalist: {
    outlet: 'QBE North America',
    title: 'QBE AcceliCITY Resilience Challenge 2023: finalist, main track and property-tech track',
    date: '2023-09-27',
    dateLabel: '27 Sep 2023',
    href: 'https://www.qbe.com/us/newsroom/press-releases/qbe-north-america-announces-finalists-for-main-track-of-the-qbe-accelicity-resilience-challenge',
    kind: 'Award',
  },
  golfIncSummit: {
    outlet: 'Golf Inc. Strategies Summit',
    title: 'Jason Deese, speaker, Golf Inc. Strategies Summit 2026',
    date: '2026-09-15',
    dateLabel: 'Sep 2026',
    href: 'https://golfincmagazine.com/speaker/jason-deese/',
    kind: 'Speaking',
  },
  gulfStatesPga: {
    outlet: 'Gulf States PGA',
    title: 'Professional Development Webinar Series: Revolutionizing golf course management with Flash',
    date: '2025-04-23',
    dateLabel: '23 Apr 2025',
    href: 'https://gspga.com/professional-development/professional-development-webinar-series-pg-2/',
    kind: 'Webinar',
  },

  // --- Press releases (Flash's own and its partners') ---------------------
  troonRelease: {
    outlet: 'GlobeNewswire',
    title: 'Flash Weather named Preferred Vendor Partner of Troon as Westchester Hills Golf Club goes live',
    date: '2026-09-22',
    dateLabel: '22 Sep 2026',
    href: 'https://www.globenewswire.com/news-release/2026/09/22/3366606/0/en/flash-weather-named-preferred-vendor-partner-of-troon-as-westchester-hills-golf-club-goes-live.html',
    kind: 'Release',
  },
  shieldRelease: {
    outlet: 'ABNewswire',
    title: 'Flash Weather AI launches FLASH Shield Portable',
    date: '2025-05-14',
    dateLabel: '14 May 2025',
    href: 'https://www.abnewswire.com/pressreleases/flash-weather-ai-launches-flash-shield-portable-predictive-weather-safety-for-every-outdoor-operation_743184.html',
    kind: 'Release',
  },
  t3Release: {
    outlet: 'ABNewswire',
    title: 'Flash Weather AI boosts precision weather for turf and agriculture with the T3 acquisition',
    date: '2024-11-19',
    dateLabel: '19 Nov 2024',
    href: 'https://www.abnewswire.com/pressreleases/flash-weather-ai-boosts-precision-weather-solutions-for-turf-and-agriculture-with-t3-acquisition_721166.html',
    kind: 'Release',
  },
  golfGeniusAnnouncement: {
    outlet: 'The Golf Wire',
    title: 'Golf Genius announces partnership with Flash Weather AI',
    date: '2024-01-09',
    dateLabel: '9 Jan 2024',
    href: 'https://thegolfwire.com/golf-genius-flash-weather-ai/',
    kind: 'Release',
  },
  smartSkyRelease: {
    outlet: 'PR Newswire',
    title: 'FLASH Weather AI and SmartSky team up to bring predictive lightning to aviation',
    date: '2023-09-05',
    dateLabel: '5 Sep 2023',
    href: 'https://www.prnewswire.com/news-releases/flash-weather-ai-and-smartsky-team-up-to-bring-predictive-lightning-capabilities-to-aviation-301918150.html',
    kind: 'Release',
  },

  // --- Partner pages (the partner's own site) ------------------------------
  naiaPartner: {
    outlet: 'naia.org',
    title: 'Flash Weather AI: Official Weather Monitoring & Alert System of the NAIA',
    date: '2025-11-14',
    dateLabel: 'Nov 2025',
    href: 'https://www.naia.org/partner/flash-weather-ai/',
    kind: 'Partner page',
  },
  golfGeniusMarketplace: {
    outlet: 'Golf Genius',
    title: 'Golf Genius Marketplace: Flash Weather AI, strategic partner',
    date: '2024-01-10',
    dateLabel: '2024',
    href: 'https://www.golfgenius.com/products/marketplace',
    kind: 'Partner page',
  },
  golfGeniusGuide: {
    outlet: 'Golf Genius Help Center',
    title: 'Flash Weather AI integration guide',
    date: '2025-04-06',
    dateLabel: '6 Apr 2025',
    href: 'https://docs.golfgenius.com/en/articles/10777495-flash-weather-ai',
    kind: 'Partner page',
  },
  buildTree: {
    outlet: 'BuildTree',
    title: 'BuildTree: Flash Weather AI, featured partner',
    date: '2026-01-01',
    dateLabel: '2026',
    href: 'https://mybuildtree.com/',
    kind: 'Partner page',
  },
});

export type PressLinkId = keyof typeof pressLinks;
