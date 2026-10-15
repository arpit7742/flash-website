/**
 * The verticals, as data.
 *
 * Thirteen industries is thirteen pages that each want to rank for their own
 * phrase -- "lightning safety for golf courses" is a different search from
 * "hail alerts for roofing contractors", and a single Industries page ranks
 * for neither. Holding them as data rather than as thirteen hand-written
 * routes means one template, one metadata path, one schema, and adding the
 * fourteenth is an entry in this array.
 *
 * Every entry has the same required core (slug, title, description, headline,
 * intro, risks, faqs). Everything else is optional and drives a designed
 * section of the one template at app/industries-we-serve/[slug]/page.tsx:
 *
 *   hero       the opening block: photo, eyebrow, lead, CTAs and a side panel
 *   sections   the body, in order, built from a small set of section types
 *   faq        heading and layout for the visible FAQ (questions are `faqs`)
 *   related    the "next for this buyer" links
 *   cta        overrides for the closing blue CTA band
 *   card       what the industries index shows for this vertical
 *   software   a named product this vertical is sold, for SoftwareApplication
 *
 * An entry with only the core still renders a complete page: a navy hero,
 * the three risks, the FAQ and the CTA band. A designed entry replaces the
 * risks block with its `sections`.
 */

import type { VideoClip } from '@/components/video-player';

import { industriesMenu } from './navigation';
import { PRESS_PATH } from './press';
import { pressLinks } from './press-links';

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

/** The alert palette. Maps to the alert tokens; `advisory` is the viz gold. */
export type Tone = 'clear' | 'advisory' | 'watch' | 'warning' | 'info' | 'brand';

/** One value on a timeline's scoreboard: plain text, or text with a status dot. */
export type ScoreboardCell = string | { text: string; tone: Tone; compact?: string };

/** A layer of the Construction plan view that its legend can switch on and off. */
export type PlanLayer = 'cell' | 'ring' | 'crane' | 'muster';

export type Link = { label: string; href: string };

/** One warning's lead time in a strip's lead bars (components/industries/lead-bars.tsx). */
export type StripLead = { label: string; minutes: number; tone: 'hail' | 'lightning' };

/** A local image. Width and height are needed wherever it is not a cover fill. */
export type Img = { src: string; alt: string; width?: number; height?: number };

const img = (file: string, alt: string, width?: number, height?: number): Img => ({
  src: `/images/industries/${file}`,
  alt,
  width,
  height,
});

/** A figure image: always has intrinsic dimensions, because it is not a cover fill. */
type SizedImg = Img & { width: number; height: number };

const figure = (file: string, alt: string, width: number, height: number): SizedImg => ({
  src: `/images/industries/${file}`,
  alt,
  width,
  height,
});

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export type HeroAside =
  /** A display number with an optional ring scale beneath it (hail size classes). */
  | {
      kind: 'stat';
      value: string;
      caption: string;
      scale?: { label: string; sub: string; tone: Tone; size: 'sm' | 'md' | 'lg' }[];
    }
  /** A portfolio list of sites and their status. */
  | {
      kind: 'sites';
      title: string;
      status: string;
      columns: [string, string, string];
      rows: { name: string; tone: Tone; status: string; eta: string; etaTone?: Tone | 'muted' }[];
      footer: string;
      link?: Link;
    }
  /** A customer clip in the shared player (components/video-player.tsx). */
  | { kind: 'video'; clip: VideoClip }
  /** A single-field card: a WBGT dial and the day's alert timeline. */
  | {
      kind: 'field-card';
      label: string;
      date: string;
      value: string;
      caption: string;
      rows: { time: string; tone: Tone; text: string }[];
    }
  /** A row of live readings under a centred hero. */
  | { kind: 'readings'; items: { label: string; value: string; caption: string }[] }
  /** The industry's photo as a card, with one alert chip on it (always an illustrative example). */
  | { kind: 'photo'; image: Img; alert: IndustryAlert };

/** The chip on an industry's hero photo card: the page's message as one illustrative alert or record. */
export type IndustryAlert = { label: string; tone: Tone };

export type IndustryHero = {
  /** Dark heroes sit on the photo; light heroes put the photo in a column. */
  theme: 'dark' | 'light';
  /** `split` puts the aside beside the copy; `centered` puts it below. */
  layout: 'split' | 'centered';
  /** Which side the aside sits on in a split hero. */
  asideSide?: 'start' | 'end';
  eyebrow: string;
  lead: string;
  image: Img;
  /** The photo is a storm sky: the hero gets the soft lightning flash. */
  storm?: boolean;
  /** Defaults to "Book a demo". */
  primary?: Link;
  secondary?: Link;
  footnote?: string;
  /** A row of figures between the lead and the buttons; `prefix` is a small "Up to". */
  stats?: { value: string; prefix?: string; label: string }[];
  aside?: HeroAside;
  /** Shows "Illustrative example · not live weather" with the aside. */
  illustrative?: boolean;
};

// ---------------------------------------------------------------------------
// Body sections
// ---------------------------------------------------------------------------

export type SectionTone = 'light' | 'sunken' | 'dark' | 'deep';

export type Card = {
  image?: Img;
  /** Small gold label over the image. */
  imageEyebrow?: string;
  /** Large label over the image. Becomes the card's h3 when there is no `title`. */
  imageTitle?: string;
  kicker?: string;
  title?: string;
  /** Fact chips under the title, each one lifted from the card's own copy. */
  facts?: string[];
  /** A short coloured line above the body (a model's unit, a channel). */
  highlight?: string;
  /** The paragraph under the title; a card may carry only its title and bullets. */
  body?: string;
  bullets?: string[];
  /** Small muted line after the body. */
  meta?: string;
  /** Channel chips. */
  tags?: string[];
  /**
   * With the section's `roles` variant: the alert this role receives, shown as
   * a message bubble. `channel` is one of the card's `tags`, whose chip is
   * highlighted with it (components/industries/alert-roles.tsx).
   */
  alert?: { channel: string; text: string };
  /**
   * With the section's `leadTime` slider: the short red problem shown on the
   * photo before the warning is long enough, drawn from the card's own body,
   * and the minute of warning at which the card turns over to its photo title.
   */
  problem?: string;
  flipAt?: number;
};

export type TableCell =
  | string
  | { kind: 'status'; tone: Tone; text: string }
  | { kind: 'verdict'; yes: boolean; text: string }
  | { kind: 'hail'; tone: Tone; size: 'sm' | 'md' | 'lg'; title: string; sub: string };

type SectionBase = {
  heading: string;
  intro?: string;
  tone?: SectionTone;
  /** Shows "Illustrative example · not live weather". */
  illustrative?: boolean;
};

export type IndustrySection =
  | (SectionBase & {
      type: 'cards';
      /**
       * `boxed` bordered cards; `open` rule-topped features; `chain` numbered steps with arrows;
       * `roles` boxed cards that each show the alert their role receives.
       */
      variant?: 'boxed' | 'open' | 'chain' | 'roles';
      columns: 2 | 3 | 5;
      cards: Card[];
      /**
       * A navy panel under the cards: one partner fact stated in full, its
       * links (the partner's own page is outbound), and a typographic seal.
       */
      callout?: {
        eyebrow: string;
        title: string;
        body: string;
        links: { label: string; href: string; external?: boolean }[];
        seal?: { name: string; label: string; note: string };
      };
      note?: { text: string; link?: Link };
      /** The site's wave reveal and card hover on the row (styles/industry-card-facts.css). */
      wave?: boolean;
      /** A "warning lead time" slider over the cards (components/industries/lead-time-cards.tsx). */
      leadTime?: { label: string; max: number };
    })
  | (SectionBase & {
      type: 'timeline';
      layout: 'row' | 'column';
      /**
       * Turns the row into a swimlane timeline: one lane per team, each step
       * placed in the lane its `lane` names (an index here, or `all` for a
       * marker that crosses every lane).
       */
      lanes?: string[];
      steps: { time: string; tone?: Tone; title: string; body: string; lane?: number | 'all' }[];
      media?: { image: Img; eyebrow: string; title: string };
      /**
       * Adds a scoreboard to the column layout that follows the entry in view:
       * `rows` names every row (the first is the time, taken from the step),
       * and `states` has one entry per step, in step order, with a cell for
       * each row after the time. A `compact` text is used on the phone bar.
       */
      scoreboard?: {
        title: string;
        rows: string[];
        states: { cells: ScoreboardCell[]; note?: string }[];
      };
    })
  | (SectionBase & {
      type: 'table';
      columns: string[];
      /** Index of the column whose header is brand blue (the Flash column). */
      highlight?: number;
      rows: TableCell[][];
      /** A navy summary row under the table. */
      summary?: string;
      /**
       * Makes a YES / NO table fill in as it scrolls into view: questions, the
       * first answer column, then the `highlight` column, then the summary. Rows
       * where only the `highlight` column says YES take a gold wash. Cards on a phone.
       */
      compare?: boolean;
      /** A muted footer row inside the table frame. */
      footer?: string;
      /** A caption under the table. */
      footnote?: string;
      link?: Link;
      /**
       * Makes the table an interactive alert log: filter chips built from one
       * column, a detail line under each row on hover, and an illustrative
       * export (no real file).
       */
      log?: {
        /** The column the filter chips come from, one chip per distinct value. */
        filterColumn: number;
        /** The chip that shows every row. */
        allLabel: string;
        /** One small line per row, in row order: the cell and model run behind it. */
        details: string[];
        exportLabel: string;
        /** The file chip reads "<fileName> · <filter> · PDF". */
        fileName: string;
      };
      /**
       * Makes a hail size-class table selectable beside a roof cross-section
       * (roofing): picking a row draws that class's damage on the roof and
       * lights its "What Flash sends" cell. Every list is in row order.
       */
      roof?: {
        levels: ('severe' | 'damaging' | 'destructive')[];
        /** Numbered on the drawing and listed under it; three per row, matching the drawing's pins. */
        damage: string[][];
        /** Chips under "What Flash sends", read off that cell's copy. */
        channels: string[][];
        /** Selected on load, and where the idle cycle comes to rest. */
        defaultRow: number;
      };
    })
  | (SectionBase & {
      type: 'figure';
      /** `split`: copy and legend beside the image. `stacked`: legend above a wide image. */
      layout: 'split' | 'stacked';
      /** The plan layer a legend key switches, when the figure is drawn `live`. */
      legend: { tone: Tone | 'none'; shape: 'square' | 'ring' | 'ring-dashed'; label: string; layer?: PlanLayer }[];
      caption?: string;
      /** Always the PNG's alt; a `live` figure is drawn in code instead of the image, with this alt as its label. */
      image: SizedImg;
      /** Draws the figure as an interactive component instead of the exported image. */
      live?: 'swath' | 'construction-plan';
    })
  | (SectionBase & {
      type: 'bands';
      card: {
        eyebrow: string;
        title: string;
        rows: { tone: Tone; range: string; text: string }[];
        note: string;
        link: Link;
      };
      aside: { eyebrow: string; items: { title: string; text: string; href?: string }[]; note: string };
    })
  | (SectionBase & {
      type: 'calendar';
      rows: { label: string; tone: Tone; months: number[] }[];
      notes: { kicker: string; title: string; body: string }[];
      /** Describes the chart for screen readers and crawlers. */
      summary: string;
    })
  | (Omit<SectionBase, 'heading'> & {
      type: 'stats';
      heading?: undefined;
      stats: { value: string; caption: string }[];
      note?: { text: string; link?: Link };
    })
  | (SectionBase & {
      type: 'strip';
      stats: { value: string; caption: string }[];
      media?: { image: Img; label: string; labelStyle?: 'eyebrow' | 'title' };
      body: string;
      link?: Link;
      readings?: { title: string; unit: string; rows: { time: string; tone: Tone; text: string }[] };
      /** Warning lead times drawn as bars under the stat; the photo then sits below them. */
      leads?: StripLead[];
    })
  | (Omit<SectionBase, 'heading'> & {
      type: 'press';
      heading?: undefined;
      eyebrow: string;
      text: string;
      /** The photo under the copy; a band without one is the copy and the items alone. */
      media?: { image: Img; title: string };
      /**
       * The pieces: `href` is the original (content/press-links.ts), opened in
       * a new tab; `kind` and `date` say what it is and when.
       */
      items: { name: string; text: string; kind?: string; date?: string; href?: string }[];
      /** The way to the rest of the coverage, on the press page. */
      link: Link;
      /** One line under the copy, with an optional outbound link. */
      note?: { text: string; href?: string };
    });

// ---------------------------------------------------------------------------
// The entry
// ---------------------------------------------------------------------------

/** What a related link offers the reader: learn the product, see it proven, or act. */
export type RelatedIntent = 'learn' | 'prove' | 'act';

export type Industry = {
  /** The URL segment. Permanent: changing it costs the ranking. */
  slug: string;
  name: string;
  /** The <title>, 40 characters or fewer; the layout appends the brand. */
  title: string;
  /** The meta description, 140-158 characters. */
  description: string;
  /** The <h1> and the OG card. */
  headline: string;
  /** Two sentences at most; the hero lead when there is no `hero`. */
  intro: string;
  /** Three, in the industry's own words. Rendered only when there are no `sections`. */
  risks: string[];
  /** One or two sentences under each risk, in the same order. Optional; a risk without one shows its title alone. */
  riskNotes?: string[];
  /**
   * The alert chip on the hero photo card, for a vertical with no designed
   * `hero`: its plain hero shows the industry photo (industries-cycle.ts)
   * as a card with this chip on it.
   */
  alert?: IndustryAlert;
  /** Visible FAQ and FAQPage schema. */
  faqs: { question: string; answer: string }[];

  hero?: IndustryHero;
  sections?: IndustrySection[];
  faq?: {
    heading: string;
    intro?: string;
    link?: Link;
    layout?: 'numbered' | 'split' | 'grid' | 'rows';
  };
  related?: {
    heading: string;
    intro?: string;
    /**
     * `intent`: three cards, Learn / Prove / Act. Every link names its card in
     * `intent`, `intents` gives each card its label and one line, and the Act
     * card leads with a Book a demo button.
     * `cards`: one row of cards that scrolls sideways; each card is tagged by
     * where its link points (content/link-kinds.ts) and shows no `text`.
     */
    layout?: 'row' | 'list' | 'columns' | 'intent' | 'cards';
    links: { title: string; text: string; href: string; intent?: RelatedIntent }[];
    intents?: Record<RelatedIntent, { label: string; line: string }>;
  };
  cta?: { eyebrow?: string; heading?: string; body?: string };
  /**
   * What the industries index shows for this vertical. The summary falls back
   * to the headline. `tag` is the preview label (the hazards this buyer
   * watches). `tone` evens out a photo that is lighter (`dim`) or darker
   * (`lift`) than the rest, so the thirteen read as one set.
   */
  /**
   * What the Industries hub shows for this vertical. `line` is the one-line
   * version for the sector panel rows, where every row is one line tall; it
   * falls back to `summary` (which the hub hero's cycle card also shows).
   */
  card?: { summary?: string; line?: string; image?: Img; tag?: string; tone?: 'lift' | 'dim' };
  software?: { name: string; description: string; path: string };
};

// ---------------------------------------------------------------------------
// Shared copy
// ---------------------------------------------------------------------------

const BOOK_A_DEMO_EYEBROW = 'Book a demo · No sensors required for the forecast';

/** The three figures every lightning hero carries: Golf's, and every vertical on the plain hero. */
export const LIGHTNING_HERO_STATS: NonNullable<IndustryHero['stats']> = [
  { prefix: 'Up to', value: '99.6%', label: 'lightning accuracy' },
  { prefix: 'Up to', value: '60 min', label: 'lead time' },
  { value: '1×1 km', label: 'forecast cell' },
];

// ---------------------------------------------------------------------------
// The thirteen
// ---------------------------------------------------------------------------

export const industries: Industry[] = [
  {
    slug: 'agriculture',
    name: 'Agriculture',
    title: 'Agronomy weather forecasting at 1×1 km',
    description:
      'Flash forecasts frost, evapotranspiration, disease pressure and growing-degree days per 1×1 km cell, so growers and turf managers spray and water on time.',
    headline:
      'Frost, evapotranspiration, disease pressure and growing-degree days at 1×1 km — the Agronomy Suite from the Turf Threat Tracker acquisition.',
    intro:
      'The Turf Threat Tracker models now run on Flash’s 1×1 km grid alongside hail and lightning prediction.',
    risks: ['Frost on new growth', 'Disease pressure after warm, wet nights', 'Spray and harvest crews caught in the open'],
    faqs: [
      {
        question: 'Which crops and turf types are the models built for?',
        answer:
          'The disease models are turf models: dollar spot, pythium blight and brown patch on cool- and warm-season grasses. Frost, ET and GDD are crop-agnostic and run on turf, orchards, vineyards, vegetables and row crops; you set the base temperature and the thresholds per field.',
      },
      {
        question: 'How is disease pressure computed?',
        answer:
          'From per-cell leaf wetness, relative humidity and air and canopy temperature over the preceding days, scored against published infection models for each pathogen and expressed as a pressure index with an outlook for the days ahead.',
      },
      {
        question: 'Does it integrate with irrigation controllers?',
        answer:
          'Daily ET and replacement depth are available through the Flash API and as a scheduled CSV export, and several controller platforms read them directly. Flash does not switch valves itself.',
      },
      {
        question: 'Is pricing per acre or per site?',
        answer:
          'Per site, with the number of 1×1 km cells you register setting the tier. A large golf property or a mid-sized farm is usually a handful of cells. The pricing page lists the tiers and what each includes.',
      },
    ],
    hero: {
      theme: 'dark',
      layout: 'centered',
      eyebrow: 'AGRICULTURE & TURF · FLASH AGRONOMY SUITE',
      lead: 'The Turf Threat Tracker models now run on Flash’s 1×1 km grid alongside hail and lightning prediction. Agronomists, turf managers and farm managers get the forecasts in the Flash web app, mobile app and API.',
      image: img(
        'flash-agriculture-irrigated-crop-rows-dawn-frost-mist-hero.jpg',
        'Irrigated crop rows under dawn frost mist in low golden light, with Flash’s example field readings for frost, evapotranspiration, dollar spot pressure and growing-degree days',
        1376,
        768,
      ),
      secondary: { label: 'See the Agronomy Suite', href: '/products/agronomy-suite/' },
      footnote:
        'Delivered in the Flash web app, mobile app and API · continental U.S. · no sensors required for the forecast',
      illustrative: true,
      aside: {
        kind: 'readings',
        items: [
          { label: 'FROST · FIELD 4 · 03:40', value: '31 °F', caption: 'alert issued the evening before' },
          { label: 'ET · TODAY', value: '4.2 mm', caption: 'irrigation replacement 4.6 mm' },
          { label: 'DOLLAR SPOT · 72 H', value: 'index 71', caption: 'high pressure, preventive window open' },
          { label: 'GDD · BASE 50 °F', value: '1,284', caption: 'cumulative since 1 Mar' },
        ],
      },
    },
    sections: [
      {
        type: 'cards',
        heading: 'Agronomy weather forecasting at 1×1 km: 20+ site-specific metrics on one grid',
        intro:
          'Each model runs per 1×1 km cell for every field, green or block you register, and every output lands in the same alert list your crews already use for lightning.',
        columns: 5,
        cards: [
          {
            image: img(
              'flash-agriculture-hoarfrost-on-young-crop-leaves.png',
              'Hoarfrost crystals edging young crop leaves at first light above frozen soil, the condition Flash’s frost alert predicts hours ahead',
            ),
            imageEyebrow: 'FORECAST 01',
            imageTitle: 'Frost alert',
            highlight: '32 °F · hours ahead',
            body: 'Hours-ahead notice when a cell is forecast to cross your frost threshold, with the expected low and its time.',
          },
          {
            image: img(
              'flash-agriculture-center-pivot-irrigation-boom-dawn.png',
              'A center-pivot irrigation boom throwing fine spray across a field at dawn, the mist catching low light',
            ),
            imageEyebrow: 'FORECAST 02',
            imageTitle: 'ET & irrigation',
            highlight: 'daily mm · multi-day outlook',
            body: 'Reference evapotranspiration per cell and the replacement depth to schedule, so you water to the forecast, not the calendar.',
          },
          {
            image: img(
              'flash-agriculture-dew-leaf-wetness-close-cut-turf.png',
              'Heavy dew beading on close-cut turf at dawn with ground fog over the fairway, the leaf wetness that drives disease pressure',
            ),
            imageEyebrow: 'FORECAST 03',
            imageTitle: 'Disease forecasting',
            highlight: 'pressure index per cell',
            body: 'Dollar spot, pythium and brown patch pressure from leaf wetness, humidity and temperature history, forecast for the days ahead.',
          },
          {
            image: img(
              'flash-agriculture-crop-rows-sunrise-growing-season.png',
              'Rows of young crops running to the horizon as the sun rises through low mist, the growing season Flash’s GDD tracker counts',
            ),
            imageEyebrow: 'FORECAST 04 · AGRONOMY SUITE',
            imageTitle: 'GDD tracker',
            highlight: 'base 50 °F · cumulative',
            body: 'Growing-degree days accumulated per cell from your start date, with the forecast days added so you time growth regulators and seedhead control.',
          },
          {
            image: img(
              'flash-agriculture-lightning-storm-over-farmland.png',
              'A lightning bolt striking beyond a treeline under a dark storm sky over open farmland, the strike a spray or harvest crew clears the field ahead of',
            ),
            imageEyebrow: 'FORECAST 05 · LIGHTNING SUITE',
            imageTitle: 'Hail & lightning for field crews',
            highlight: 'Up to 60 min · 55 min ahead',
            body: 'FirstStrike and Predictive Hail on the same cells, so a spray crew or harvest crew clears the field before the strike or the stones arrive.',
          },
        ],
      },
      {
        type: 'figure',
        tone: 'dark',
        layout: 'stacked',
        heading: 'Spray-window planner: five days, one field, one answer',
        intro:
          'Wind, rain probability, evapotranspiration and disease pressure for one 1×1 km cell, so the agronomist books the sprayer for the hours that will actually work.',
        legend: [
          { tone: 'advisory', shape: 'square', label: 'spray window' },
          { tone: 'watch', shape: 'square', label: 'wind above 10 mph' },
          { tone: 'info', shape: 'square', label: 'rain probability' },
        ],
        illustrative: true,
        image: figure(
          'flash-agronomy-spray-window-planner-5-day-1km.png',
          'Flash Agronomy Suite spray-window planner showing five days of wind, rain probability, evapotranspiration and disease pressure for one 1×1 km field cell, with Tuesday 06:00–09:30 highlighted as the spray window',
          2496,
          686,
        ),
      },
      {
        type: 'calendar',
        tone: 'sunken',
        illustrative: true,
        heading: 'Which model matters when: the agronomy calendar',
        intro:
          'Southeastern turf and row-crop season shown; Flash shifts the windows to your latitude and your start date.',
        summary:
          'Twelve-month calendar strip showing when Flash’s frost, ET, disease-pressure, GDD and hail-lightning models are active in a southeastern turf season',
        rows: [
          { label: 'Frost alert', tone: 'info', months: [1, 2, 3, 9, 10] },
          { label: 'ET & irrigation', tone: 'clear', months: [3, 4, 5, 6, 7, 8] },
          { label: 'Disease pressure', tone: 'watch', months: [4, 5, 6, 7, 8] },
          { label: 'GDD tracker', tone: 'brand', months: [2, 3, 4, 5, 6, 7, 8, 9] },
          { label: 'Hail & lightning', tone: 'warning', months: [2, 3, 4, 5, 6, 7, 8, 9] },
        ],
        notes: [
          {
            kicker: 'SPRING · MAR–MAY',
            title: 'Frost on new growth',
            body: 'Radiational frost on clear, calm nights after green-up. The frost alert names the cell, the expected low and the hour; bloom, seedings and sod are the exposure. GDD accumulation starts.',
          },
          {
            kicker: 'SUMMER · JUN–AUG',
            title: 'Disease pressure and ET',
            body: 'Dollar spot, pythium and brown patch pressure climb with warm nights and leaf wetness; ET peaks and irrigation replacement is scheduled to the forecast, not the clock.',
          },
          {
            kicker: 'FALL · SEP–NOV',
            title: 'GDD, harvest and overseeding',
            body: 'Cumulative GDD times growth regulators and seedhead control; harvest and overseeding windows come from rain probability and wind, and the first frost alert of the season closes the cycle.',
          },
          {
            kicker: 'WINTER · DEC–FEB',
            title: 'Planning from the record',
            body: 'Season summaries per field: frost nights, disease-pressure days, ET totals and final GDD, exported for next year’s budget and program planning.',
          },
        ],
      },
      {
        type: 'cards',
        variant: 'open',
        heading: 'Syngenta and the Turf Threat Tracker acquisition',
        intro:
          'Two names come up in every agronomy conversation with Flash. Here is exactly what each one is, so you do not have to leave this page to find out.',
        columns: 2,
        cards: [
          {
            image: img(
              'flash-agriculture-golf-green-dawn-fog-mower-lines.png',
              'A close-cut golf green with fresh mower stripes under dawn ground fog, dew on the turf and the treeline in silhouette',
            ),
            imageTitle: 'Lightning prediction, delivered through the Flash API',
            kicker: 'SYNGENTA · API LIGHTNING PROVIDER',
            title: 'Flash is the API lightning provider for Syngenta',
            bullets: [
              'Disease-pressure index and spray windows per 1×1 km cell',
              'GDD tracking for growth-regulator timing, per green or per field',
              'Frost and ET on the same 1×1 km grid as Flash’s hail and lightning prediction',
            ],
          },
          {
            image: img(
              'flash-agriculture-crop-rows-1km-grid-dawn-frost-mist.png',
              'An aerial view of a patchwork of square farm fields and irrigation circles under dawn frost mist, echoing the 1×1 km forecast grid',
            ),
            imageTitle: 'Agronomy models on the same 1×1 km grid as hail and lightning',
            kicker: 'TURF THREAT TRACKER · ACQUISITION',
            title: 'The models came with the acquisition, and got a bigger grid',
            body: 'Flash acquired Turf Threat Tracker. Its frost, evapotranspiration, disease-forecasting and growing-degree-day models now run on Flash’s 1×1 km grid as the Flash Agronomy Suite, fed by the same 30+ integrated data signals as FirstStrike and Predictive Hail, across the continental U.S.',
            bullets: [
              'Existing Turf Threat Tracker accounts moved to Flash logins with their field histories intact',
              'Agronomy Suite sold on its own or alongside Lightning and Hail Prediction',
              'Full partner list, coverage and acquisition notes on the press and partners page',
            ],
          },
        ],
      },
      {
        type: 'press',
        tone: 'light',
        eyebrow: 'FEATURES & PODCASTS',
        text: 'The Agronomy Suite, covered by the turf press: the two acquisition stories and two long interviews with Garrett Bastardi.',
        items: [
          {
            kind: 'Coverage',
            date: pressLinks.turfnet.dateLabel,
            name: 'TURFNET',
            text: 'Flash acquires Turf Threat Tracker to enhance forecasting for turf managers.',
            href: pressLinks.turfnet.href,
          },
          {
            kind: 'Coverage',
            date: pressLinks.golfCourseIndustry.dateLabel,
            name: 'GOLF COURSE INDUSTRY',
            text: 'Flash Weather AI expands into the golf industry.',
            href: pressLinks.golfCourseIndustry.href,
          },
          {
            kind: 'Podcast',
            date: pressLinks.groundUpTurf.dateLabel,
            name: 'FROM THE GROUND UP',
            text: 'Turf intelligence in action, with Garrett Bastardi.',
            href: pressLinks.groundUpTurf.href,
          },
          {
            kind: 'Podcast',
            date: pressLinks.turfToday.dateLabel,
            name: 'TURF TODAY · EP. 120',
            text: 'Garrett Bastardi, Head of Innovation and Development. Flash is also a show sponsor.',
            href: pressLinks.turfToday.href,
          },
        ],
        link: { label: 'All coverage on press & partners →', href: PRESS_PATH },
        note: {
          text: 'OutdoorCoffeeShop also interviewed Garrett Bastardi on turf-focused intelligence.',
          href: pressLinks.outdoorCoffeeShopFeature.href,
        },
      },
      {
        type: 'strip',
        tone: 'deep',
        heading: 'Field-crew safety on the same cells as the agronomy models',
        stats: [
          { value: '60 min', caption: 'lightning, up to' },
          { value: '55 min', caption: 'hail, up to' },
        ],
        media: {
          image: img(
            'flash-weather-shield-field-crew-siren.png',
            'The Flash Weather Shield, a solar-powered cellular predictive weather siren, installed out at the edge of a field',
          ),
          label: 'Flash Weather Shield · predictive siren on site',
          labelStyle: 'title',
        },
        body: 'Spray crews, harvest crews and irrigation techs get the same FirstStrike and Predictive Hail pull-off alerts that golf and construction customers use, by SMS and mobile push, for the exact 1×1 km cells they are working in. Lightning refreshes every 2 minutes, hail every five minutes.',
      },
    ],
    faq: { heading: 'Questions agronomists and turf managers ask', layout: 'rows' },
    related: {
      heading: 'Related pages',
      layout: 'row',
      links: [
        { title: 'Flash Agronomy Suite', text: 'Product page for the 20+ site-specific metrics', href: '/products/agronomy-suite/' },
        {
          title: 'Predictive Hail',
          text: 'Hail warning up to 55 minutes ahead for crews and equipment',
          href: '/products/hail-prediction/',
        },
        { title: 'Case study: Troon', text: 'Turf at Troon-managed golf properties', href: '/case-studies/troon/' },
        {
          title: 'Prediction vs sensors vs detection',
          text: 'Why a forecast beats a weather station for crews',
          href: '/why-flash/prediction-vs-sensors-vs-detection/',
        },
        { title: 'Pricing', text: 'Per site, tiered by registered cells', href: '/pricing/' },
        { title: 'Press & partners', text: 'Syngenta, Turf Threat Tracker and the full list', href: '/press-and-partners/' },
      ],
    },
    card: {
      summary: 'Frost, evapotranspiration, disease pressure and growing degree days',
      line: 'Frost, ET, disease pressure and degree days',
      image: img('flash-agriculture-irrigated-crop-rows-dawn-frost-mist-hero.jpg', ''),
      tag: 'Frost · Disease pressure',
      tone: 'dim',
    },
    software: {
      name: 'Flash Agronomy Suite',
      description:
        'Frost, evapotranspiration, disease-pressure and growing-degree-day forecasts per 1×1 km cell, delivered in the Flash web app, mobile app and API.',
      path: '/products/agronomy-suite/',
    },
  },
  {
    slug: 'concrete',
    name: 'Concrete',
    title: 'Storm alerts for concrete pours',
    description:
      'A pour cannot be paused. Flash predicts lightning and hail up to an hour ahead, so crews schedule around the storm instead of losing a slab to it.',
    headline: 'Schedule the pour around the storm',
    intro:
      'Concrete is unforgiving about timing. Knowing up to an hour ahead is the difference between rescheduling a pour and losing one.',
    risks: ['Ruined pours', 'Crew evacuation mid-pour', 'Monitor active conditions'],
    riskNotes: [
      'Curing issues caused by sudden rain, temperature drops, or humidity changes can ruin a pour and create costly rework. Knowing up to an hour ahead is the difference between rescheduling a pour and losing one.',
      'A pour cannot be paused. Flash predicts lightning up to an hour ahead and hail up to 55 minutes ahead, which is the window most crews need to decide whether to start.',
      'Flash monitors active conditions during live pours so you can act fast if conditions shift unexpectedly. Real-time alerts give your crew the visibility to protect quality throughout the entire process.',
    ],
    alert: { label: 'Storm ahead · reschedule the pour', tone: 'warning' },
    faqs: [
      {
        question: 'Is the lead time enough to finish or postpone a pour?',
        answer:
          'Flash predicts lightning up to an hour ahead and hail up to 55 minutes ahead, which is the window most crews need to decide whether to start.',
      },
      {
        question: 'Can I monitor multiple locations at once?',
        answer:
          'Yes. Flash allows you to create and monitor multiple locations, making it easy to track conditions across fields, job sites, facilities, or service areas from a single platform.',
      },
      {
        question: 'How is Flash used during live events or games?',
        answer:
          'Flash is designed for real-time decision-making during active operations. Whether it’s a game, job site, or event, you can monitor conditions, receive alerts, and make immediate calls on delays, pauses, or safety protocols.',
      },
      {
        question: 'How often does the data update?',
        answer:
          'Lightning refreshes every 2 minutes and hail every 5 minutes, so you are always working with the most current and actionable information available.',
      },
      {
        question: 'What types of alerts does Flash provide?',
        answer:
          'Flash provides real-time and predictive alerts, including lightning detection and proximity alerts, first strike and all-clear notifications, lightning probability forecasts (1-hour and 5-hour), and heat risk and environmental condition alerts. These alerts are designed to help you act before conditions become dangerous.',
      },
    ],
    card: {
      image: img('flash-construction-wet-concrete-deck-clearing-sky.png', ''),
      tag: 'Lightning · Hail',
      tone: 'dim',
    },
  },
  {
    slug: 'construction',
    name: 'Construction',
    title: 'Construction lightning alerts',
    description:
      'Lightning alerts for construction sites up to 60 minutes before the first strike, with a notification chain from the superintendent to the crane operator.',
    headline: 'Lightning alerts for construction sites that reach the crane operator before the first strike.',
    intro:
      'A detection-based horn only fires after the first strike. FirstStrike predicts strikes up to 60 minutes ahead, so elevated work stops while the crane operator still has time to land the load.',
    risks: ['Crane operators aloft when the cell arrives', 'Stand-downs nobody can document', 'Crews spread across sites and subcontractors'],
    faqs: [
      {
        question: 'What triggers the horn?',
        answer:
          'A Warning for the site’s 1×1 km cells: a strike predicted inside your policy’s radius and window. You choose the level that fires the horn integration; most sites fire the horn at Warning and use Advisory and Watch for people, not sirens.',
      },
      {
        question: 'Several GCs and subcontractors share one site. Who gets what?',
        answer:
          'The chain is per site, not per company. Add each GC’s superintendent and every sub’s foreman to the steps they belong in; everyone acknowledges in the same log.',
      },
      {
        question: 'Our crews move between sites all day. Do alerts follow them?',
        answer:
          'Alerts follow a person’s assigned sites, and the mobile app can also alert on the phone’s current location. A crew driving toward a site under Watch sees it before they park.',
      },
      {
        question: 'How is this different from a detection horn?',
        answer:
          'A detection horn fires when a sensor registers a strike that has already happened nearby. FirstStrike forecasts the strike up to 60 minutes ahead from 30+ integrated data signals, refreshed every 2 minutes. Accuracy is up to 99.6% on a one-hour prediction window; the prediction vs sensors vs detection page has the full comparison.',
      },
      {
        question: 'How is pricing structured per site?',
        answer:
          'Per active site, with portfolio pricing for multi-site operators. Sites can be paused between phases and reactivated for the next pour. The pricing page lists the tiers; a demo replays last season’s strikes against your sites.',
      },
    ],
    hero: {
      theme: 'dark',
      layout: 'split',
      asideSide: 'end',
      eyebrow: 'CONSTRUCTION · SUPERINTENDENTS & SAFETY MANAGERS',
      lead: 'OSHA guidance and the NWS lightning safety rule tell a superintendent what to do once thunder is heard or a strike is detected — and a detection-based horn only fires after that first strike. FirstStrike predicts strikes up to 60 minutes ahead on 1×1 km cells, refreshed every 2 minutes, so elevated work stops while the crane operator still has time to land the load.',
      image: img(
        'flash-construction-tower-crane-storm-sky-hero.jpg',
        'A tower crane silhouette above a half-built concrete structure against a bruised storm sky, one shaft of gold light breaking through',
        1376,
        768,
      ),
      storm: true,
      secondary: { label: 'See lightning prediction', href: '/products/lightning-prediction/' },
      footnote:
        'FirstStrike · up to 99.6% lightning accuracy on a 60-minute window, measured against NLDN strikes · no sensors required for the forecast',
      illustrative: true,
      aside: {
        kind: 'sites',
        title: 'PORTFOLIO · ACTIVE SITES',
        status: 'Refreshed 2 min ago',
        columns: ['SITE', 'STATUS', 'NEXT STRIKE'],
        rows: [
          { name: 'Midtown Parking Deck', tone: 'watch', status: 'Watch', eta: '18 min', etaTone: 'watch' },
          { name: 'I-285 Bridge Rehab', tone: 'advisory', status: 'Advisory', eta: '41 min' },
          { name: 'Alpharetta Data Hall', tone: 'advisory', status: 'Advisory', eta: '52 min' },
          { name: 'Canton Logistics Hub', tone: 'clear', status: 'Clear', eta: 'none in 5 h', etaTone: 'muted' },
          { name: 'Buford Hwy Mixed-Use', tone: 'clear', status: 'Clear', eta: 'none in 5 h', etaTone: 'muted' },
          { name: 'Marietta Square Hotel', tone: 'clear', status: 'Clear', eta: 'none in 5 h', etaTone: 'muted' },
          { name: 'Dawsonville Solar Yard', tone: 'clear', status: 'Clear', eta: 'none in 5 h', etaTone: 'muted' },
          { name: 'Athens Student Housing', tone: 'clear', status: 'Clear', eta: 'none in 5 h', etaTone: 'muted' },
        ],
        footer: '4 more sites, all clear',
        link: { label: 'Open Weather Command Center →', href: '/products/weather-command-center/' },
      },
    },
    sections: [
      {
        type: 'stats',
        stats: [
          { value: '60 min', caption: 'strike-level lightning lead time, up to' },
          { value: '2 min', caption: 'lightning model refresh, every cell; hail every five minutes' },
          { value: '5 h', caption: 'of lightning probability for every site, on one screen' },
          { value: '1×1 km', caption: 'grid cell, with no sensors required for the forecast' },
        ],
        note: {
          text: 'Lightning accuracy is up to 99.6% on a one-hour prediction window. The method behind the figure is published on the accuracy method page.',
          link: { label: 'Read the accuracy method', href: '/why-flash/accuracy-method/' },
        },
      },
      {
        type: 'cards',
        variant: 'chain',
        tone: 'sunken',
        illustrative: true,
        heading: 'Who hears the lightning alert, in what order, and how',
        intro:
          'You set the chain once per site in the Weather Command Center. Each step names the people, the channel and the trigger, so a new foreman or a night crew inherits the same procedure.',
        columns: 5,
        cards: [
          {
            image: img(
              'flash-weather-command-center-construction-advisory.png',
              'The Flash Weather Command Center on a laptop showing the lightning Advisory a superintendent sees for a job site up to an hour before the strike',
            ),
            imageEyebrow: 'COMMAND CENTER',
            kicker: 'STEP 1 · T–60 MIN',
            title: 'Superintendent',
            body: 'Advisory in the Weather Command Center and by SMS: a strike is predicted within 60 minutes at Midtown Parking Deck. Decides whether elevated work stops at T–30.',
            meta: 'Command Center · SMS',
          },
          {
            image: img(
              'flash-mobile-app-foreman-watch-push.png',
              'The Flash mobile app showing the Watch push notification every foreman on the site receives',
            ),
            imageEyebrow: 'MOBILE APP',
            kicker: 'STEP 2 · T–45 MIN',
            title: 'Foremen',
            body: 'Watch pushed to every foreman on the site. Stage crews, secure loose material, confirm who is on the deck and who is in the excavation.',
            meta: 'Mobile push · SMS',
          },
          {
            image: img(
              'flash-construction-tower-crane-jib-storm-sky.png',
              'A tower crane jib and hook block silhouetted against a churning slate storm sky above a high-rise construction site',
            ),
            imageEyebrow: 'ELEVATED WORK',
            kicker: 'STEP 3 · T–30 MIN',
            title: 'Crane and lift operators',
            body: 'Cease elevated work: land the load, boom down, lock the cab. Called by the foreman on radio and pushed to the operator’s phone at the same moment.',
            meta: 'Radio · mobile push',
          },
          {
            image: img(
              'flash-construction-site-horn-strobe-pole-dark-sky.png',
              'A warning siren horn and amber strobe mounted on a mast at a construction site perimeter beneath a black advancing squall',
            ),
            imageEyebrow: 'SITE WARNING',
            kicker: 'STEP 4 · T–20 MIN',
            title: 'Horn and strobe',
            body: 'The Warning triggers the site horn integration: two blasts, strobe on until the all-clear. Everyone off scaffolds and out of the pit, roll call at the muster point.',
            meta: 'Horn · strobe · SMS',
          },
          {
            image: img(
              'flash-construction-wet-concrete-deck-clearing-sky.png',
              'A wet concrete high-rise deck with rebar and standing rainwater reflecting a clearing sky after the squall passes',
            ),
            imageEyebrow: 'BACK TO WORK',
            kicker: 'STEP 5 · WHEN THE CELL CLEARS',
            title: 'All-clear',
            body: 'One long blast and an all-clear message. Foremen confirm headcount and the alert log closes the event with every acknowledgement attached.',
            meta: 'Horn · Command Center · SMS',
          },
        ],
      },
      {
        type: 'figure',
        tone: 'dark',
        layout: 'split',
        heading: 'One plan view: the 1×1 km cell, the crane radius and the cease-work ring',
        intro:
          'The superintendent drops the site boundary and the crane positions once. Flash overlays its 1×1 km prediction cells and draws the rings from your own lightning policy, so the operator sees which part of the site stops first.',
        legend: [
          { tone: 'advisory', shape: 'square', label: '1×1 km cell with a strike predicted in the next 60 minutes', layer: 'cell' },
          { tone: 'warning', shape: 'ring', label: 'Cease-elevated-work ring, 300 m, from your policy', layer: 'ring' },
          { tone: 'watch', shape: 'ring-dashed', label: 'Crane radius, 60 m jib', layer: 'crane' },
          { tone: 'clear', shape: 'square', label: 'Muster point for roll call after the horn', layer: 'muster' },
        ],
        illustrative: true,
        live: 'construction-plan',
        image: figure(
          'flash-construction-site-lightning-radius-plan.png',
          'Plan view of a construction site in the Flash Weather Command Center showing the 1×1 km cell where a lightning strike is predicted in 18 minutes, the tower crane position and the 300 m cease-elevated-work ring',
          1568,
          960,
        ),
      },
      {
        type: 'table',
        heading: 'Downtime on the record: the alert log for each site',
        intro:
          'Every alert, every decision and every acknowledgement is timestamped against the model run that triggered it, so a weather delay is a documented safety decision rather than an argument.',
        illustrative: true,
        columns: ['TIME', 'SITE', 'ALERT', 'DECISION', 'ACKNOWLEDGED BY'],
        rows: [
          [
            '14:02',
            'Midtown Parking Deck',
            { kind: 'status', tone: 'advisory', text: 'Advisory' },
            'Advisory received; foremen notified; elevated work continues',
            'R. Alvarez, superintendent',
          ],
          [
            '14:17',
            'Midtown Parking Deck',
            { kind: 'status', tone: 'watch', text: 'Watch' },
            'Crews staged; loose material secured; deck headcount taken',
            'J. Okafor, foreman',
          ],
          [
            '14:32',
            'Midtown Parking Deck',
            { kind: 'status', tone: 'watch', text: 'Watch' },
            'Cease elevated work; crane TC-1 boomed down, load landed',
            'D. Pham, crane operator',
          ],
          [
            '14:41',
            'Midtown Parking Deck',
            { kind: 'status', tone: 'warning', text: 'Warning' },
            'Horn sounded; site cleared to muster point; headcount 46 of 46',
            'J. Okafor, foreman',
          ],
          [
            '15:14',
            'Midtown Parking Deck',
            { kind: 'status', tone: 'clear', text: 'All-clear' },
            'Work resumed; 42 minutes of elevated-work downtime logged against the event',
            'R. Alvarez, superintendent',
          ],
          [
            '14:26',
            'I-285 Bridge Rehab',
            { kind: 'status', tone: 'advisory', text: 'Advisory' },
            'No action; strike ETA 41 minutes; monitoring at the next 2-minute refresh',
            'S. Whitfield, safety manager',
          ],
        ],
        footer:
          'Wed 23 Sep 2026 · 6 of 14 entries · each row links to the model run and the 1×1 km cell that triggered it',
        log: {
          filterColumn: 1,
          allLabel: 'All sites',
          details: [
            'Cell 2214 · model run 14:00 · logged 14:03',
            'Cell 2214 · model run 14:16 · logged 14:19',
            'Cell 2214 · model run 14:30 · logged 14:36',
            'Cell 2214 · model run 14:40 · logged 14:44',
            'Cell 2214 · model run 15:12 · logged 15:15',
            'Cell 2231 · model run 14:24 · logged 14:27',
          ],
          exportLabel: 'Export (illustrative)',
          fileName: 'Alert log',
        },
      },
      {
        type: 'strip',
        tone: 'sunken',
        heading: 'Heat: crew rotation and hydration planned at the morning huddle',
        stats: [{ value: 'Hourly', caption: 'WBGT forecast per site' }],
        media: {
          image: img(
            'flash-construction-heat-haze-rebar-deck-hard-sun.png',
            'Heat shimmer over a bare concrete parking deck with rebar mats and a shade canopy in hard midday sun',
          ),
          label: 'MIDTOWN DECK',
        },
        body: 'The WBGT forecast for each site tells the safety manager which hours will cross your heat-illness prevention thresholds, so water, shade and rest cycles are scheduled before the shift instead of read off a thermometer at noon.',
        illustrative: true,
        readings: {
          title: 'MIDTOWN DECK · TODAY',
          unit: 'WBGT °F',
          rows: [
            { time: '10:00', tone: 'advisory', text: '82.4 · normal rotation' },
            { time: '12:00', tone: 'watch', text: '87.9 · 15-min rests hourly' },
            { time: '14:00', tone: 'warning', text: '89.6 · rotate deck crews' },
            { time: '16:00', tone: 'advisory', text: '86.1 · normal rotation' },
          ],
        },
      },
      {
        type: 'press',
        tone: 'dark',
        eyebrow: 'PARTNERS & PODCASTS',
        text: 'Flash in the tools and media construction already uses.',
        items: [
          {
            kind: 'Partner',
            name: 'BUILDTREE · CONSTRUCTION CRM',
            text: 'Featured partner: lightning and hail alerts beside the schedule. “Schedule around storms, not through them.”',
            href: pressLinks.buildTree.href,
          },
          {
            kind: 'Podcast',
            date: pressLinks.groundUpSafety.dateLabel,
            name: 'FROM THE GROUND UP',
            text: 'Safety beyond the standard: rethinking weather risk, with Jameson Allen.',
            href: pressLinks.groundUpSafety.href,
          },
        ],
        link: { label: 'All coverage on press & partners →', href: PRESS_PATH },
      },
    ],
    faq: { heading: 'Questions superintendents and safety managers ask', layout: 'grid' },
    related: {
      heading: 'Where to go next',
      layout: 'intent',
      intents: {
        learn: { label: 'Learn', line: 'The model behind the alerts, and the screen your team runs them from.' },
        prove: { label: 'Prove', line: 'A multi-site customer, and how prediction compares with detection.' },
        act: { label: 'Act', line: 'See Flash on your own sites, or price the portfolio.' },
      },
      links: [
        {
          title: 'Flash Lightning Prediction',
          text: 'The 60-minute, 2-minute-refresh model behind the notification chain',
          href: '/products/lightning-prediction/',
          intent: 'learn',
        },
        {
          title: 'Flash Weather Command Center',
          text: 'The portfolio screen, the plan view and the alert log in one place',
          href: '/products/weather-command-center/',
          intent: 'learn',
        },
        {
          title: 'Case study: Troon',
          text: 'Many properties on one alert chain, the multi-site pattern a GC portfolio follows',
          href: '/case-studies/troon/',
          intent: 'prove',
        },
        {
          title: 'Prediction vs detection',
          text: 'Prediction against detection, with dated and sourced facts only',
          href: '/why-flash/prediction-vs-sensors-vs-detection/',
          intent: 'prove',
        },
        {
          title: 'Pricing',
          text: 'Per active site, portfolio pricing for multi-site operators, pause between phases',
          href: '/pricing/',
          intent: 'act',
        },
      ],
    },
    cta: { eyebrow: BOOK_A_DEMO_EYEBROW },
    card: {
      summary: 'Lightning and gust alerts that reach the crane operator',
      line: 'Lightning and gust alerts to the crane operator',
      image: img('flash-construction-tower-crane-storm-sky-hero.jpg', ''),
      tag: 'Lightning · Wind',
      tone: 'lift',
    },
  },
  {
    slug: 'events-venues',
    name: 'Events & Venues',
    title: 'Lightning alerts for events and venues',
    description:
      'Moving twenty thousand people takes time you only have if you knew early. Flash predicts lightning up to an hour ahead, so venues shelter on a plan.',
    headline: 'Enough warning to move a crowd calmly',
    intro:
      'Crowd egress is measured in tens of minutes. An alert that arrives when the storm does is not a warning, it is a scramble.',
    risks: ['Crowd egress time', 'Liability for open-air events', 'Show cancellation costs'],
    riskNotes: [
      'Crowd egress is measured in tens of minutes. Earlier alerts give you more time to communicate with staff, coordinate safety protocols, and move people to safety before weather turns.',
      'Crowd safety starts with knowing what is coming next. Flash monitors lightning and severe weather in real time so you can act before conditions become dangerous for crowds.',
      'Flash gives you the predictive data to delay, pause, or continue events with confidence. Anticipate weather changes before they impact operations and adjust your plan before disruptions hit.',
    ],
    alert: { label: 'Lightning alert · move the crowd calmly', tone: 'warning' },
    faqs: [
      {
        question: 'How far ahead can a venue be told to shelter?',
        answer:
          'Up to an hour for lightning, which is generally enough to move a full house under cover in an orderly way.',
      },
      {
        question: 'How is Flash used during live events or games?',
        answer:
          'Flash is designed for real-time decision-making during active operations. Whether it’s a game, job site, or event, you can monitor conditions, receive alerts, and make immediate calls on delays, pauses, or safety protocols.',
      },
      {
        question: 'How does Flash help improve safety?',
        answer:
          'Flash helps improve safety by giving you earlier visibility into dangerous conditions. Instead of reacting to weather after it arrives, you can anticipate risks like lightning and extreme heat and take action sooner to protect people, operations, and assets.',
      },
      {
        question: 'Can I monitor multiple locations at once?',
        answer:
          'Yes. Flash allows you to create and monitor multiple locations, making it easy to track conditions across fields, job sites, facilities, or service areas from a single platform.',
      },
      {
        question: 'What types of alerts does Flash provide?',
        answer:
          'Flash provides real-time and predictive alerts, including lightning detection and proximity alerts, first strike and all-clear notifications, lightning probability forecasts (1-hour and 5-hour), and heat risk and environmental condition alerts. These alerts are designed to help you act before conditions become dangerous.',
      },
    ],
    card: {
      image: img('flash-schools-championship-stadium-bowl-dusk-storm.png', ''),
      tag: 'Lightning',
      tone: 'lift',
    },
  },
  {
    slug: 'golf',
    name: 'Golf',
    title: 'Lightning alerts for golf courses',
    description:
      'Golfers are the tallest thing on an open course. Flash predicts lightning up to an hour ahead, so courses sound the horn early and resume play sooner.',
    headline: 'Sound the horn early, resume play sooner',
    intro:
      'A course that clears late takes a risk. A course that clears on every distant cell loses revenue. Flash narrows both.',
    hero: {
      theme: 'dark',
      layout: 'split',
      asideSide: 'end',
      eyebrow: 'GOLF · LIGHTNING ALERTS FOR GOLF COURSES',
      lead: 'A course that clears late takes a risk. A course that clears on every distant cell loses revenue. Flash narrows both.',
      image: {
        src: '/images/products/flash-golf-fairway-rain-industry-golf.webp',
        alt: 'A tree-lined golf fairway under a grey sky, with rain standing in pools on the grass',
      },
      stats: LIGHTNING_HERO_STATS,
      aside: {
        kind: 'video',
        clip: {
          src: '/video/ryan-coll-golf-storm-story.mp4',
          webm: '/video/ryan-coll-golf-storm-story.webm',
          poster: '/video/ryan-coll-golf-storm-story-poster.webp',
          posterAlt: 'Ryan Coll, Director of Golf at Columbus Country Club, telling the story on the course',
          captions: '/video/ryan-coll-golf-storm-story.vtt',
          duration: 18.1,
          // The full story on Flash's channel; this is 1:49–2:07 of it.
          youtubeId: 'RtMyYti2xxA',
          tag: 'Customer story',
          cta: 'Watch the full story',
          label: 'Ryan Coll, Director of Golf at Columbus Country Club, on clearing the course before the lightning came',
          name: 'Ryan Coll',
          title: 'Director of Golf, Columbus Country Club',
        },
      },
    },
    risks: ['Player safety on open holes', 'Revenue lost to over-cautious closures', 'Marshal decisions'],
    riskNotes: [
      'Golfers are the tallest thing on an open course. Flash monitors lightning risk across the course so you can protect players and staff before conditions become dangerous.',
      'A course that clears late takes a risk. A course that clears on every distant cell loses revenue. Flash narrows both.',
      'Automated alerts remove guesswork and reduce risk for players and staff. Instead of waiting for conditions to worsen, you act earlier and communicate with confidence.',
    ],
    faqs: [
      {
        question: 'Does Flash say when it is safe to resume play?',
        answer:
          'Yes. The all-clear is predicted on the same model, so courses reopen on evidence rather than on a fixed countdown after the last strike.',
      },
      {
        question: 'How is Flash used during live events or games?',
        answer:
          'Flash is designed for real-time decision-making during active operations. Whether it’s a game, job site, or event, you can monitor conditions, receive alerts, and make immediate calls on delays, pauses, or safety protocols.',
      },
      {
        question: 'How does Flash help improve safety?',
        answer:
          'Flash helps improve safety by giving you earlier visibility into dangerous conditions. Instead of reacting to weather after it arrives, you can anticipate risks like lightning and extreme heat and take action sooner to protect people, operations, and assets.',
      },
      {
        question: 'Can I monitor multiple locations at once?',
        answer:
          'Yes. Flash allows you to create and monitor multiple locations, making it easy to track conditions across fields, job sites, facilities, or service areas from a single platform.',
      },
      {
        question: 'How accurate is Flash?',
        answer:
          'Flash is built on advanced modeling and real-time data inputs, delivering up to 99.6% prediction accuracy. The platform continuously updates lightning every 2 minutes and hail every 5 minutes, using over 30 integrated data signals to provide highly localized, reliable insights.',
      },
    ],
    card: {
      summary: 'Course-by-course lightning for every property in the portfolio',
      line: 'Course-by-course lightning across the portfolio',
      image: { src: '/images/case-studies/troon-golf-fairway-dusk-storm-cell-horizon.jpg', alt: '' },
      tag: 'Lightning',
      tone: 'lift',
    },
  },
  {
    slug: 'insurance',
    name: 'Insurance',
    title: 'Hail verification for insurers',
    description:
      'Flash forecasts hail at 1×1 km resolution and records what actually fell, giving insurers a basis for triage and policyholder alerts.',
    headline: 'Know what fell, where, and when',
    intro:
      'Hail claims turn on whether hail actually reached that address. Flash records it at 1×1 km resolution.',
    risks: ['Fraudulent hail claims', 'Slow claims triage', 'Reactive policyholder contact'],
    riskNotes: [
      'Real hail footprints flag claims that don’t match the weather.',
      'Flash records predicted and observed hail at 1×1 km resolution with timestamps, which gives a per-address basis for triage.',
      'Warn policyholders before hail hits so they can move vehicles and cut losses.',
    ],
    alert: { label: 'Hail verified at this address · 1×1 km', tone: 'watch' },
    faqs: [
      {
        question: 'Can Flash data support a claims decision?',
        answer:
          'Flash records predicted and observed hail at 1×1 km resolution with timestamps, which gives a per-address basis for triage.',
      },
      {
        question: 'Can Flash warn policyholders before hail hits?',
        answer:
          'Yes. Pre-event alerts warn policyholders before hail hits so they can move vehicles and cut losses.',
      },
      {
        question: 'Can Flash confirm whether hail fell at an address?',
        answer:
          'Yes. Claims validation confirms whether hail actually fell at an address, and what size, before paying out.',
      },
      {
        question: 'How does Flash help with catastrophe response?',
        answer:
          'See an event’s size and footprint in real time to deploy adjusters and set reserves.',
      },
    ],
    card: {
      summary: 'Hail forecasts for claims teams and vehicle staging',
      line: 'Hail forecasts for claims and vehicle staging',
      image: img('flash-insurance-fleets-hail-alerts-card.png', ''),
      tag: 'Hail',
      tone: 'lift',
    },
  },
  {
    slug: 'municipalities',
    name: 'Municipalities',
    title: 'Lightning alerts for municipalities',
    description:
      'Pools, parks, crews and events answer to one storm. Flash predicts lightning up to an hour ahead across every municipal site, from one shared dashboard.',
    headline: 'One storm, every site, one dashboard',
    intro:
      'A city does not clear one field. It clears pools, parks, ballfields and work crews, and it needs them all on the same warning.',
    risks: ['Public liability', 'Scattered sites', 'Crew safety'],
    riskNotes: [
      'Issue proactive warnings before conditions worsen and give your community more time to respond.',
      'A city does not clear one field. It clears pools, parks, ballfields and work crews, and it needs them all on the same warning.',
      'Flash gives you the lead time to stage resources, communicate with departments, and coordinate response before storms arrive.',
    ],
    alert: { label: 'Lightning alert · every site, one warning', tone: 'warning' },
    faqs: [
      {
        question: 'How many sites can a municipality monitor?',
        answer: 'There is no practical limit; each site carries its own thresholds and alert recipients.',
      },
      {
        question: 'Can I monitor multiple locations at once?',
        answer:
          'Yes. Flash allows you to create and monitor multiple locations, making it easy to track conditions across fields, job sites, facilities, or service areas from a single platform.',
      },
      {
        question: 'What is the Weather Command Center?',
        answer:
          'The Weather Command Center is your central dashboard for monitoring weather conditions, tracking multiple locations, and receiving real-time alerts. It is designed for teams and operations that need a complete view of weather activity, allowing you to make faster, more informed decisions across sites.',
      },
      {
        question: 'How does Flash help improve safety?',
        answer:
          'Flash helps improve safety by giving you earlier visibility into dangerous conditions. Instead of reacting to weather after it arrives, you can anticipate risks like lightning and extreme heat and take action sooner to protect people, operations, and assets.',
      },
      {
        question: 'What types of alerts does Flash provide?',
        answer:
          'Flash provides real-time and predictive alerts, including lightning detection and proximity alerts, first strike and all-clear notifications, lightning probability forecasts (1-hour and 5-hour), and heat risk and environmental condition alerts. These alerts are designed to help you act before conditions become dangerous.',
      },
    ],
    card: {
      tag: 'Lightning',
    },
  },
  {
    slug: 'outdoor-sports',
    name: 'Outdoor Sports',
    title: 'Lightning alerts for outdoor sports',
    description:
      'Flash predicts lightning up to an hour ahead, so leagues suspend and resume play on a forecast rather than on a coach reading the sky.',
    headline: 'Suspend on evidence, not on a judgement call',
    intro:
      'Every suspension is a judgement call someone has to defend afterwards. Flash makes it a measurement.',
    risks: ['Athlete safety', 'Fixture congestion from over-cautious calls', 'Officials under pressure'],
    riskNotes: [
      'Flash sends lightning alerts during games and practices so you can act before conditions become dangerous. Earlier visibility means more time to get athletes off the field safely.',
      'Managing multiple fields means weather at one location can affect your entire schedule. Flash lets leagues suspend and resume play on a forecast rather than on a coach reading the sky.',
      'Every suspension is a judgment call someone has to defend afterward. Flash makes it a measurement.',
    ],
    alert: { label: 'Lightning predicted · suspend play', tone: 'warning' },
    faqs: [
      {
        question: 'Does this replace the 30-30 rule?',
        answer:
          'It gives the rule a forecast to work from: rather than counting after a flash, play is suspended before the first strike is possible.',
      },
      {
        question: 'How is Flash used during live events or games?',
        answer:
          'Flash is designed for real-time decision-making during active operations. Whether it’s a game, job site, or event, you can monitor conditions, receive alerts, and make immediate calls on delays, pauses, or safety protocols.',
      },
      {
        question: 'How does Flash help improve safety?',
        answer:
          'Flash helps improve safety by giving you earlier visibility into dangerous conditions. Instead of reacting to weather after it arrives, you can anticipate risks like lightning and extreme heat and take action sooner to protect people, operations, and assets.',
      },
      {
        question: 'How often does the data update?',
        answer:
          'Lightning refreshes every 2 minutes and hail every 5 minutes, so you are always working with the most current and actionable information available.',
      },
      {
        question: 'What types of alerts does Flash provide?',
        answer:
          'Flash provides real-time and predictive alerts, including lightning detection and proximity alerts, first strike and all-clear notifications, lightning probability forecasts (1-hour and 5-hour), and heat risk and environmental condition alerts. These alerts are designed to help you act before conditions become dangerous.',
      },
    ],
    card: {
      image: img('flash-schools-empty-infield-rolled-tarp-floodlights.png', ''),
      tag: 'Lightning',
      tone: 'lift',
    },
  },
  {
    slug: 'parks-rec',
    name: 'Parks & Rec',
    title: 'Lightning alerts for parks and rec',
    description:
      'Flash predicts lightning up to an hour ahead across every park, pool and trail, so recreation departments clear and reopen without guessing.',
    headline: 'Clear the pool before the sky says so',
    intro:
      'Recreation sites are spread out and lightly staffed. The warning has to reach the person at the gate.',
    risks: ['Visitor safety', 'Unstaffed sites', 'Reopening decisions'],
    riskNotes: [
      'Flash sends alerts before conditions become unsafe so you can adjust plans, communicate with staff, and act before weather becomes a problem.',
      'Recreation sites are spread out and lightly staffed. The warning has to reach the person at the gate.',
      'Flash predicts lightning up to an hour ahead across every park, pool and trail, so recreation departments clear and reopen without guessing.',
    ],
    alert: { label: 'Lightning predicted · clear the pool now', tone: 'warning' },
    faqs: [
      {
        question: 'Can alerts go to on-site staff directly?',
        answer: 'Yes, per site, by mobile alert, so the person at the gate is told without a relay.',
      },
      {
        question: 'Can I monitor multiple locations at once?',
        answer:
          'Yes. Flash allows you to create and monitor multiple locations, making it easy to track conditions across fields, job sites, facilities, or service areas from a single platform.',
      },
      {
        question: 'How does Flash help improve safety?',
        answer:
          'Flash helps improve safety by giving you earlier visibility into dangerous conditions. Instead of reacting to weather after it arrives, you can anticipate risks like lightning and extreme heat and take action sooner to protect people, operations, and assets.',
      },
      {
        question: 'How is Flash used during live events or games?',
        answer:
          'Flash is designed for real-time decision-making during active operations. Whether it’s a game, job site, or event, you can monitor conditions, receive alerts, and make immediate calls on delays, pauses, or safety protocols.',
      },
      {
        question: 'What types of alerts does Flash provide?',
        answer:
          'Flash provides real-time and predictive alerts, including lightning detection and proximity alerts, first strike and all-clear notifications, lightning probability forecasts (1-hour and 5-hour), and heat risk and environmental condition alerts. These alerts are designed to help you act before conditions become dangerous.',
      },
    ],
    card: {
      tag: 'Lightning',
    },
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    title: 'Hail alerts for roofing contractors',
    description:
      'Flash predicts hail up to 55 minutes ahead at 1×1 km. Roofing crews get off the roof, canvassers work the right streets and adjusters get a dated record.',
    headline:
      'Hail prediction for roofing contractors: know which streets get hit before the storm arrives.',
    intro:
      'Hail is the roofer’s biggest revenue event and its biggest liability in the same afternoon. Flash treats it as three separate problems with three separate outputs.',
    risks: [
      'Crews on a roof when the cell arrives',
      'Wasted canvassing on streets that never got hit',
      'Disputed claims with no record of the storm',
    ],
    faqs: [
      {
        question: 'Does Flash tell me hail size?',
        answer:
          'Yes. Predictive Hail predicts a size class for each 1×1 km cell, severe, damaging or destructive, and records the observed class as the storm passes, every five minutes. Alerts and the swath report carry the class, not a vague “hail possible”.',
      },
      {
        question: 'Can I get a report for insurance disputes?',
        answer:
          'Yes. The swath report exports as PDF and PNG with the cell, the size class and the timestamp for every address in the event. The adjuster gets the same record you do.',
      },
      {
        question: 'How far ahead is the warning?',
        answer:
          'Up to 55 minutes before hail reaches a site, refreshed every five minutes with timing down to the minute. Lightning is predicted up to 60 minutes ahead on the same 1×1 km cells, refreshed every 2 minutes, with a 5-hour lightning probability for the day.',
      },
      {
        question: 'Do I need a sensor on my trucks or at the yard?',
        answer:
          'No. Flash is software: web app, mobile app, SMS, email and horn integrations. Register the yard, the active jobs and the canvassing territories as sites and the alerts follow them.',
      },
      {
        question: 'Does it cover my whole metro?',
        answer:
          'Yes. Coverage is the full continental U.S. at 1×1 km resolution, so a storm-restoration territory spanning several counties is a few hundred cells on one map.',
      },
    ],
    hero: {
      theme: 'dark',
      layout: 'split',
      asideSide: 'start',
      eyebrow: 'ROOFING · HAIL ALERT FOR ROOFING CONTRACTORS',
      lead: 'Predictive Hail predicts hail up to 55 minutes before it reaches a site, on 1×1 km cells refreshed every five minutes with timing down to the minute. Crews come off the roof before the cell arrives, canvassers work only the streets that were hit, and adjusters get a timestamped cell-level record for every claim.',
      image: img(
        'flash-roofing-hail-shelf-cloud-over-rooftop-hero.jpg',
        'A residential rooftop and ladder under an approaching dark hail shelf cloud, the last sunlight on the shingles',
        1376,
        768,
      ),
      storm: true,
      secondary: { label: 'See hail prediction', href: '/products/hail-prediction/' },
      illustrative: true,
      footnote: 'Predictive Hail · 1-hour hail swath prediction · timing down to the minute · no sensors required for the forecast',
      aside: {
        kind: 'stat',
        value: '55 min',
        caption: 'hail warning before it reaches the neighborhood, up to',
        scale: [
          { label: 'CLASS 1', sub: 'severe', tone: 'advisory', size: 'sm' },
          { label: 'CLASS 2', sub: 'damaging', tone: 'watch', size: 'md' },
          { label: 'CLASS 3', sub: 'destructive', tone: 'warning', size: 'lg' },
        ],
      },
    },
    sections: [
      {
        type: 'cards',
        illustrative: true,
        heading: 'Three ways hail costs a roofer, and what a warning of up to 55 minutes changes',
        intro:
          'Hail is the roofer’s biggest revenue event and its biggest liability in the same afternoon. Flash treats it as three separate problems with three separate outputs.',
        columns: 3,
        leadTime: { label: 'Warning lead time', max: 55 },
        cards: [
          {
            image: img(
              'flash-roofing-open-deck-hail-shelf-cloud.png',
              'A half-torn-off residential shingle roof with a ladder and tarps over the open deck while a dark hail shelf cloud builds low overhead',
            ),
            imageEyebrow: '01 · PRODUCTION',
            imageTitle: 'Land the crew before the cell arrives',
            problem: 'No time to get down',
            flipAt: 15,
            title: 'Crews on a roof when the cell arrives',
            body: 'A crew on a steep-slope job cannot get down in the moments a detection horn gives them. Flash’s lightning prediction gives up to 60 minutes, and the hail pull-off alert fires up to 55 minutes before the cell reaches the address, so the foreman lands the crew, covers the open deck and moves the trucks.',
            meta: 'Alert: SMS, mobile push and horn integration · lightning and hail',
          },
          {
            image: img(
              'flash-roofing-suburban-street-bruised-hail-sky.png',
              'An elevated view along a suburban street of shingle rooftops under a bruised green-grey hail sky, wet asphalt catching the last light',
            ),
            imageEyebrow: '02 · SALES',
            imageTitle: 'Knock the blocks that actually took stones',
            problem: 'Knocking the whole ZIP',
            flipAt: 30,
            title: 'Wasted canvassing on streets that never got hit',
            body: 'Storm-restoration sales teams knock the whole ZIP because nobody can tell which blocks took damaging stones and which took rain. The swath report resolves the storm to 1×1 km cells with a predicted size class for each, so canvassers start on the streets most likely to have fractured shingles.',
            meta: 'Output: 1×1 km swath report, PDF and PNG, ready soon after impact',
          },
          {
            image: img(
              'flash-roofing-hailstones-on-shingles-gutter.png',
              'Hailstones scattered across a bruised asphalt shingle roof and collected in a metal gutter after a storm',
            ),
            imageEyebrow: '03 · CLAIMS',
            imageTitle: 'Attach the storm record, not a memory',
            problem: 'Arguing from memory',
            flipAt: 45,
            title: 'Disputed claims with no record of the storm',
            body: 'Adjusters ask when the hail fell, where, and how big it was. Flash keeps a timestamped, cell-level hail record for every address in the swath, refreshed every five minutes through the event, that you attach to the claim file instead of arguing from memory.',
            meta: 'Record: date, time, 1×1 km cell, size class, model run',
          },
        ],
      },
      {
        type: 'timeline',
        tone: 'sunken',
        layout: 'row',
        heading: 'What a storm day looks like with up to 55 minutes of hail warning',
        intro:
          'Times are relative to hail reaching the Elm Street job. Every step below is an alert or an export Flash produces on its own; nobody on your team has to sit and watch radar.',
        illustrative: true,
        lanes: ['Production crews', 'Sales', 'Claims / office'],
        steps: [
          {
            time: 'T–55',
            lane: 0,
            title: 'Hail cell forecast',
            body: 'Predictive Hail flags a cell tracking toward the Elm Street job, predicted size class ≥1.00 in. Alert to the production manager and the foreman.',
          },
          {
            time: 'T–40',
            lane: 0,
            title: 'Crews pulled off Elm St',
            body: 'The foreman lands the crew, tarps the open deck and moves both trucks off the street. The pull-off is logged with a timestamp.',
          },
          {
            time: 'T–20',
            lane: 1,
            title: 'Sales team staged',
            body: 'Two canvassers park at the predicted edge of the swath with the forecast cell map open on their phones.',
          },
          {
            time: 'T–0',
            lane: 'all',
            tone: 'warning',
            title: 'Impact, 1.25 in',
            body: 'Hail reaches Elm Street. Predictive Hail records the observed size class per 1×1 km cell as the storm crosses the metro, every five minutes.',
          },
          {
            time: 'Evening',
            lane: 2,
            title: 'Swath report exported',
            body: 'PDF and PNG with 1×1 km cells, size class and timestamps, exported from the web app for the sales team and the claims file.',
          },
          {
            time: 'Next am',
            lane: 1,
            title: 'Canvassing list ranked',
            body: 'Streets ranked by predicted size class, largest first. The team knocks the ≥2.00 in cells before the out-of-town crews arrive.',
          },
        ],
      },
      {
        type: 'table',
        heading: 'What each hail size class does to a roof, and what Flash sends',
        intro:
          'Predictive Hail predicts three size classes per 1×1 km cell. Each one maps to a different alert, a different recipient and a different line in the swath report.',
        illustrative: true,
        columns: ['SIZE CLASS', 'WHAT IT DOES TO THE ROOF', 'WHAT FLASH SENDS'],
        highlight: 2,
        rows: [
          [
            { kind: 'hail', tone: 'advisory', size: 'sm', title: '≥0.75 in', sub: 'Severe' },
            'Granule loss and bruising on asphalt shingles; soft-metal dents on vents, gutters and turtle caps. Usually invisible from the street.',
            'Hail Watch to production and sales. The cell shows as class 1 on the swath map and the canvassing list marks the street “inspect”.',
          ],
          [
            { kind: 'hail', tone: 'watch', size: 'md', title: '≥1.00 in', sub: 'Damaging' },
            'Shingle fracture and mat exposure; cracked vent caps, pipe boots and ridge caps.',
            'Hail Warning with the pull-off alert to every crew on a roof in the cell; the horn integration fires. Class 2 in the swath report with timestamps for the adjuster.',
          ],
          [
            { kind: 'hail', tone: 'warning', size: 'lg', title: '≥2.00 in', sub: 'Destructive' },
            'Decking punctures, broken skylights and damaged flashing; tile and slate breakage; interior water damage within hours.',
            'Same Warning, plus a priority flag on the canvassing list. The adjuster record carries the full size-class time series for the cell, every five minutes.',
          ],
        ],
        footnote:
          'Size classes are Predictive Hail’s three thresholds. Hail model refreshed every five minutes, built on four years of convective storm data across the CONUS (2021 through 2024); coverage is the continental U.S.',
        roof: {
          levels: ['severe', 'damaging', 'destructive'],
          damage: [
            ['Granule loss on the shingles', 'Dents in shingles and the vent cap', 'Gutters dented'],
            ['Shingles fractured, mat exposed', 'Vent cap cracked', 'Pipe boot cracked'],
            ['Decking punctured, water gets in', 'Skylight broken', 'Flashing torn loose'],
          ],
          channels: [
            ['Hail Watch', 'Swath map · class 1', 'Canvassing list'],
            ['Hail Warning', 'Crew pull-off', 'Horn', 'Swath report · class 2'],
            ['Hail Warning', 'Priority flag', 'Adjuster record'],
          ],
          defaultRow: 1,
        },
      },
      {
        type: 'figure',
        tone: 'dark',
        layout: 'split',
        live: 'swath',
        heading: 'The swath report: which streets took what, cell by cell',
        intro:
          'Once the storm has crossed the metro the report is ready in the web app: every 1×1 km cell coloured by predicted size class, with the time the hail crossed it. Sales uses it to rank streets; claims attaches it to the file.',
        legend: [
          { tone: 'warning', shape: 'square', label: '≥2.00 in · destructive · knock first' },
          { tone: 'watch', shape: 'square', label: '≥1.00 in · damaging · full inspections' },
          { tone: 'advisory', shape: 'square', label: '≥0.75 in · severe · inspect on request' },
          { tone: 'none', shape: 'square', label: 'No hail predicted or observed' },
        ],
        caption: 'Report generated 17:42 · after the storm cleared',
        illustrative: true,
        image: figure(
          'flash-hail-swath-report-1km-cells-roofing.png',
          'Flash hail swath report over an Atlanta-metro neighborhood grid, each 1×1 km cell coloured by predicted hail size class, with the roofing job site marked and a canvassing route drawn through the largest-hail cells',
          1568,
          960,
        ),
      },
      {
        type: 'strip',
        heading: 'Lightning for crews on the roof, not just hail for the sales team',
        stats: [{ value: '60 min', caption: 'lightning lead time for roof crews, up to' }],
        leads: [
          { label: 'Hail warning', minutes: 55, tone: 'hail' },
          { label: 'Lightning warning', minutes: 60, tone: 'lightning' },
        ],
        media: {
          image: img(
            'flash-mobile-app-lightning-push-roofing.png',
            'The Flash mobile app on a phone showing the lightning prediction alert a roofing foreman receives on site',
          ),
          label: 'FLASH MOBILE APP',
        },
        body: 'FirstStrike’s strike-level prediction, refreshed every 2 minutes, reaches the foreman by SMS and mobile push and fires the yard horn integration. The crew is off the roof before the first strike, not after it. Accuracy is up to 99.6% on a one-hour prediction window; the accuracy method page has the detail.',
        link: { label: 'See lightning prediction', href: '/products/lightning-prediction/' },
      },
      {
        type: 'press',
        tone: 'sunken',
        eyebrow: 'FEATURES & PODCASTS',
        text: 'Hail prediction, in the roofing trade’s own media: the trade coverage, the podcast and the community feature.',
        media: {
          image: img(
            'flash-roofing-work-trucks-parked-under-hail-sky.png',
            'A row of contractor pickup trucks and parked cars on a lot beneath a bruised hail sky as the first stones bounce off the asphalt',
          ),
          title: 'Trucks and equipment moved before impact',
        },
        items: [
          {
            kind: 'Coverage',
            date: pressLinks.carrierManagement.dateLabel,
            name: 'CARRIER MANAGEMENT',
            text: 'Insurance-trade coverage of hail prediction up to 55 minutes ahead and the cell-level record adjusters can use.',
            href: pressLinks.carrierManagement.href,
          },
          {
            kind: 'Coverage',
            date: pressLinks.roofingContractor.dateLabel,
            name: 'ROOFING CONTRACTOR',
            text: 'FLASH Weather AI launches hail forecast tool: the cell, the size class and the arrival window, for roofing contractors.',
            href: pressLinks.roofingContractor.href,
          },
          {
            kind: 'Podcast',
            date: pressLinks.roofingRoadTrips.dateLabel,
            name: 'ROOFING ROAD TRIPS · ROOFERSCOFFEESHOP',
            text: 'How contractors stay ahead of hail, with Jameson Allen.',
            href: pressLinks.roofingRoadTrips.href,
          },
          {
            kind: 'Feature',
            date: pressLinks.roofersCoffeeShopFeature.dateLabel,
            name: 'ROOFERSCOFFEESHOP',
            text: 'Stay ahead of hail with predictive weather intelligence.',
            href: pressLinks.roofersCoffeeShopFeature.href,
          },
        ],
        link: { label: 'All coverage on press & partners →', href: PRESS_PATH },
      },
    ],
    faq: { heading: 'Questions roofing owners ask about hail alerts', layout: 'numbered' },
    related: {
      heading: 'Next for a roofing owner',
      intro: 'The two products on this page, the competitor comparison, pricing and one customer story.',
      layout: 'row',
      links: [
        {
          title: 'Predictive Hail',
          text: 'Predictive Hail, size classes, the swath report',
          href: '/products/hail-prediction/',
        },
        {
          title: 'Flash Lightning Prediction',
          text: 'Pull-off alerts up to 60 minutes ahead for crews on roofs',
          href: '/products/lightning-prediction/',
        },
        {
          title: 'Prediction vs detection',
          text: 'Prediction against detection, sourced and dated',
          href: '/why-flash/prediction-vs-sensors-vs-detection/',
        },
        { title: 'Pricing', text: 'Per site, territories priced by registered cells', href: '/pricing/' },
        { title: 'Case study: Troon', text: 'Many properties, one alert chain', href: '/case-studies/troon/' },
      ],
    },
    cta: { eyebrow: BOOK_A_DEMO_EYEBROW },
    card: {
      summary: 'Hail cells up to 55 minutes before the storm reaches the neighborhood',
      line: 'Hail up to 55 minutes before the neighborhood',
      image: img('flash-roofing-hail-shelf-cloud-over-rooftop-hero.jpg', ''),
      tag: 'Hail · Lightning',
      tone: 'lift',
    },
  },
  {
    slug: 'schools',
    name: 'Schools',
    title: 'School sports lightning and heat safety',
    description:
      'Up to 60 minutes of lightning lead time and a WBGT forecast for athletic directors and trainers, built to work beside your on-site sensor, not replace it.',
    headline:
      'Lightning prediction and WBGT planning for athletic directors — built to work beside your on-site sensor, not replace it.',
    intro:
      'Flash gives you up to 60 minutes of lightning lead time and a WBGT forecast, so you can move practice before the policy forces you to.',
    risks: [
      'Practice held into a WBGT band the policy forbids',
      'Lightning calls made by counting on the sideline',
      'No record when the district or its insurer asks',
    ],
    faqs: [
      {
        question: 'Does Flash replace our on-site WBGT sensor?',
        answer:
          'No. Your state policy sets how the reading is taken, and Flash does not take it. Flash reads your device through the integration, logs the reading, and forecasts what it will read later in the day so you can move practice early instead of cancelling it late.',
      },
      {
        question: 'How does the return-to-play timer work?',
        answer:
          'The timer starts at the last predicted or detected strike inside your radius and counts down the interval your policy sets. A new strike restarts it. At zero, Flash issues the all-clear to everyone on the field’s list and writes it to the log with the time and the model run.',
      },
      {
        question: 'We have several campuses and a dozen fields. Does one account cover them?',
        answer:
          'Yes. Each field is its own 1×1 km cell with its own alert list. The athletic director sees every campus in the Weather Command Center; a coach only gets the field they are standing on.',
      },
      {
        question: 'What does it cost per school?',
        answer:
          'Pricing is per site, with a district plan for multiple campuses; the tiers are on the pricing page. A demo loads your fields and shows the alert log you would have had for last season.',
      },
      {
        question: 'What record does Flash keep of each alert?',
        answer:
          'Every outlook, alert, acknowledgement and all-clear is timestamped in the alert log, by day and by field.',
      },
    ],
    hero: {
      theme: 'light',
      layout: 'split',
      asideSide: 'end',
      eyebrow: 'SCHOOLS · BIG 12 OFFICIAL WEATHER SAFETY PROVIDER',
      lead: 'Flash gives you up to 60 minutes of lightning lead time and a WBGT forecast, so you can move practice before the policy forces you to. Your on-site WBGT device still makes the call at the moment.',
      image: img(
        'flash-school-athletic-field-floodlit-dusk-cumulus-hero.jpg',
        'An empty floodlit high-school athletic field at dusk under building cumulus clouds, with Flash’s practice-field WBGT card showing 88.1 °F and the day’s lightning advisory and all-clear',
        896,
        1200,
      ),
      secondary: { label: 'See lightning prediction', href: '/products/lightning-prediction/' },
      footnote: 'Official weather safety provider of the Big 12 Conference · no sensors required for the forecast',
      illustrative: true,
      aside: {
        kind: 'field-card',
        label: 'TODAY · PRACTICE FIELD B',
        date: 'Thu 24 Sep',
        value: '88.1 °F',
        caption: 'WBGT forecast for 3:00 pm · GHSA bands 82 · 87 · 90',
        rows: [
          { time: '1:00 pm', tone: 'watch', text: 'WBGT forecast 88.1 — practice moved to 5:30 pm' },
          { time: '3:40 pm', tone: 'advisory', text: 'Lightning Advisory — strike predicted within 60 min' },
          { time: '4:28 pm', tone: 'clear', text: 'All-clear — return-to-play timer done' },
        ],
      },
    },
    sections: [
      {
        type: 'table',
        tone: 'sunken',
        heading: 'Heat monitoring for schools: what your sensor measures and what Flash forecasts',
        intro:
          'Each state association sets how the WBGT reading is taken. Georgia (GHSA) and Florida (FHSAA) require a reading from a WBGT device at the practice site; Texas (UIL) accepts a scientifically approved instrument or another scientifically proven method. Flash does not replace that reading; it tells you what the reading is likely to be before you have to take it.',
        columns: ['THE QUESTION', 'ON-SITE WBGT SENSOR', 'FLASH'],
        highlight: 2,
        compare: true,
        rows: [
          [
            'WBGT right now, on this field',
            { kind: 'verdict', yes: true, text: 'The sensor reading is the number of record' },
            { kind: 'verdict', yes: false, text: 'Flash reads your sensor through the integration and writes it to the log' },
          ],
          [
            'WBGT this afternoon, when practice starts',
            { kind: 'verdict', yes: false, text: 'A sensor measures the present' },
            { kind: 'verdict', yes: true, text: 'WBGT forecast for each field, updated through the day' },
          ],
          [
            'Lightning up to 60 minutes ahead',
            { kind: 'verdict', yes: false, text: 'Detection hardware reports strikes that already happened' },
            { kind: 'verdict', yes: true, text: 'FirstStrike, 1×1 km cells, refreshed every 2 minutes, up to 60 minutes ahead' },
          ],
          [
            'Return-to-play timer',
            { kind: 'verdict', yes: false, text: 'Counted by hand on the sideline' },
            {
              kind: 'verdict',
              yes: true,
              text: 'Return-to-play countdown from the last strike on your policy’s interval, restarted automatically on each new one',
            },
          ],
          [
            'Alert log for the athletic director',
            { kind: 'verdict', yes: false, text: 'Paper log, if anyone remembers' },
            {
              kind: 'verdict',
              yes: true,
              text: 'Every outlook, alert, acknowledgement and all-clear, timestamped',
            },
          ],
        ],
        summary: 'Policy compliance uses the reading your state requires. Planning uses Flash.',
        link: { label: 'How Flash forecasts heat and WBGT →', href: '/products/heat-wbgt/' },
      },
      {
        type: 'timeline',
        layout: 'column',
        heading: 'A practice day with Flash, hour by hour',
        intro:
          'The athletic trainer sets the WBGT thresholds from your state policy once. From then on the outlook, the advisory, the warning and the all-clear reach the phones of the people you name, and the log writes itself.',
        illustrative: true,
        media: {
          image: img(
            'flash-schools-heat-haze-turf-field-thunderhead.png',
            'Heat shimmer rising off an empty synthetic turf practice field in hard afternoon sun with a thunderhead climbing behind the bleachers',
          ),
          eyebrow: '2:00 PM · WBGT CLIMBING',
          title: 'Heat first, lightning second, same afternoon',
        },
        scoreboard: {
          title: 'FIELD B',
          rows: ['Time', 'Field status', 'WBGT', 'Lightning'],
          states: [
            { cells: [{ text: 'Open', tone: 'clear' }, 'Outlook in', { text: 'Clear', tone: 'clear' }] },
            {
              cells: [
                { text: 'Practice moved to 5:30', compact: 'Moved to 5:30', tone: 'watch' },
                '88.1 °F at 3 pm',
                { text: 'Clear', tone: 'clear' },
              ],
            },
            { cells: [{ text: 'Open', tone: 'clear' }, '—', { text: 'Advisory', tone: 'advisory' }] },
            { cells: [{ text: 'Cleared', tone: 'warning' }, '—', { text: 'Warning', tone: 'warning' }] },
            { cells: [{ text: 'All-clear', tone: 'clear' }, '84.6 °F on site', { text: 'Clear', tone: 'clear' }] },
            {
              cells: [{ text: 'Practice on', tone: 'clear' }, '—', { text: 'Clear', tone: 'clear' }],
              note: 'Log written',
            },
          ],
        },
        steps: [
          {
            time: '6:00 am',
            tone: 'info',
            title: 'Morning outlook lands',
            body: 'The WBGT forecast for each field and the day’s lightning risk go to the AD and the athletic trainer before first period.',
          },
          {
            time: '1:00 pm',
            tone: 'watch',
            title: 'WBGT forecast pushes practice to 5:30 pm',
            body: 'The outlook for 3:00 pm on Field B is 88.1 °F, inside the GHSA 87.0–89.9 band. The trainer moves varsity to 5:30 pm and the coaches get the change by SMS.',
          },
          {
            time: '3:40 pm',
            tone: 'advisory',
            title: 'Lightning Advisory',
            body: 'FirstStrike forecasts a strike within 60 minutes in the 1×1 km cells around campus. Coaches are told to keep the buses close and the gym unlocked.',
          },
          {
            time: '3:58 pm',
            tone: 'warning',
            title: 'Lightning Warning, field cleared',
            body: 'JV practice clears to the gym, the horn integration sounds two blasts, facilities close the pool deck. Every acknowledgement is stamped.',
          },
          {
            time: '4:28 pm',
            tone: 'clear',
            title: 'All-clear countdown ends',
            body: 'Once your policy’s return-to-play interval has passed since the last predicted or detected strike, Flash issues the all-clear. The trainer’s on-site sensor confirms WBGT at 84.6 °F before anyone goes back out.',
          },
          {
            time: '4:35 pm',
            tone: 'clear',
            title: 'Practice resumes, log written',
            body: 'Every outlook, alert, acknowledgement and sensor reading is in the alert log for the AD.',
          },
        ],
      },
      {
        type: 'bands',
        tone: 'dark',
        heading: 'Your state’s WBGT thresholds, and how to plan for them',
        intro:
          'Every state association publishes its own activity bands. Flash loads the bands for your state, so the WBGT forecast is expressed in your policy’s terms rather than raw degrees.',
        card: {
          eyebrow: 'GEORGIA · GHSA',
          title: 'Georgia High School Association heat policy, as Flash applies it',
          rows: [
            { tone: 'clear', range: 'under 82.0', text: 'Normal activities; at least three rest breaks per hour' },
            { tone: 'advisory', range: '82.0 – 86.9', text: 'Use discretion for intense practice; watch at-risk athletes' },
            { tone: 'watch', range: '87.0 – 89.9', text: 'Maximum 2 hours of practice; four rest breaks per hour' },
            { tone: 'warning', range: '90.0 – 92.0', text: 'Maximum 1 hour; no protective equipment; 20 minutes of rest' },
            { tone: 'warning', range: 'over 92.0', text: 'No outdoor workouts; delay until a cooler WBGT is measured' },
          ],
          note: 'Flash’s outlook tells the trainer at 1:00 pm which band the 3:00 pm reading will fall in. The on-site sensor still confirms it before practice.',
          link: { label: 'Read the Georgia heat policy page →', href: '/resources/state-heat-policies/georgia/' },
        },
        aside: {
          eyebrow: 'MORE STATE POLICY PAGES',
          items: [
            { title: 'Florida', text: 'FHSAA · WBGT monitoring policy and cooling zones' },
            { title: 'Texas', text: 'UIL · heat acclimatization and WBGT guidance' },
            { title: 'Oklahoma', text: 'OSSAA · WBGT instrument or another scientifically proven method' },
          ],
          note: 'Each page lists the association’s bands, the modifications at each band and how Flash’s outlook and alerts map to them.',
        },
      },
      {
        type: 'cards',
        variant: 'roles',
        illustrative: true,
        heading: 'Who gets the alert, and on which channel',
        intro:
          'Roles are set per campus. Each person gets only the alerts for the fields they are responsible for, and each alert asks for a one-tap acknowledgement that goes into the log.',
        columns: 5,
        cards: [
          {
            image: img(
              'flash-weather-command-center-school-athletics.png',
              'The Flash Weather Command Center on a laptop, the screen an athletic director uses to see every field, alert and acknowledgement on one page',
            ),
            imageEyebrow: 'COMMAND CENTER',
            imageTitle: 'Athletic director',
            body: 'Every alert for every field, the daily outlook and the alert log. Weekly summary of alerts and acknowledgements by email.',
            tags: ['WEB APP', 'EMAIL', 'SMS'],
            alert: { channel: 'Web app', text: 'Lightning Warning, Field B, 3:58 pm. Acknowledgements are going into the log.' },
          },
          {
            image: img(
              'flash-mobile-app-wbgt-bands-trainer.png',
              'The Flash mobile app in an athletic trainer’s hand showing the WBGT forecast in policy bands with the return-to-play timer',
            ),
            imageEyebrow: 'MOBILE APP',
            imageTitle: 'Athletic trainer',
            body: 'WBGT forecast in policy bands, Advisory, Warning, all-clear and the return-to-play timer. Sets the thresholds and confirms the sensor reading.',
            tags: ['MOBILE APP', 'SMS'],
            alert: { channel: 'Mobile app', text: 'All-clear, Field B, 4:28 pm. Timer done. Confirm the sensor reading.' },
          },
          {
            image: img(
              'flash-schools-empty-sideline-bench-floodlit-practice-field.png',
              'An empty sideline bench and water coolers beside a floodlit practice field at dusk, storm clouds building beyond the goalposts',
            ),
            imageEyebrow: 'SIDELINE',
            imageTitle: 'Coaches',
            body: 'Practice moves, Warning and all-clear for their own field only. One-tap acknowledgement from the sideline.',
            tags: ['SMS', 'MOBILE PUSH'],
            alert: { channel: 'SMS', text: 'Lightning Warning. Clear Field B now. All-clear est. 4:28 pm.' },
          },
          {
            image: img(
              'flash-schools-stadium-floodlight-tower-siren-horn-storm-sky.png',
              'A stadium floodlight tower and a siren horn on a pole silhouetted against a dark advancing storm sky above an empty pool deck',
            ),
            imageEyebrow: 'HORN AND GATES',
            imageTitle: 'Facilities',
            body: 'Warning and all-clear for the pool deck, stadium and gates; horn integration status and a test button.',
            tags: ['SMS', 'HORN'],
            alert: { channel: 'Horn', text: 'Horn sounded · strobes on · Field B' },
          },
          {
            image: img(
              'flash-schools-empty-infield-rolled-tarp-floodlights.png',
              'An empty baseball infield with the rain tarp rolled at the edge and the floodlights burning under heavy evening storm cloud',
            ),
            imageEyebrow: 'GAME DAY',
            imageTitle: 'Officials',
            body: 'Game-day Advisory, Warning and all-clear through the host school’s channel.',
            tags: ['SMS', 'RADIO'],
            alert: { channel: 'Radio', text: 'Lightning Warning at the stadium. Suspend play. All-clear est. 4:28 pm.' },
          },
        ],
      },
      {
        type: 'cards',
        variant: 'open',
        tone: 'sunken',
        heading: 'Flash, the Big 12 Conference and the NAIA',
        intro: 'Two names an athletic director will recognise, stated as they stand.',
        columns: 2,
        wave: true,
        cards: [
          {
            image: img(
              'flash-schools-championship-stadium-bowl-dusk-storm.png',
              'An empty collegiate championship stadium bowl at dusk, bleachers and scoreboard gantry in silhouette beneath a thick bank of storm cloud',
            ),
            imageEyebrow: 'NAIA · OFFICIAL PARTNER',
            imageTitle: 'Official Weather Monitoring & Alert System of the NAIA',
            title: 'Official Weather Monitoring & Alert System of the NAIA',
            facts: ['Official partner · through October 2028'],
            body: 'The NAIA named Flash its Official Weather Monitoring & Alert System through October 2028, covering the association’s opening rounds and national championships.',
          },
          {
            image: img(
              'flash-schools-college-stadium-upper-deck-distant-lightning.png',
              'A large empty college football stadium seen from the upper deck at twilight, floodlights burning and a distant lightning flash on the horizon',
            ),
            imageEyebrow: 'BIG 12 CONFERENCE · OFFICIAL WEATHER SAFETY PROVIDER',
            imageTitle: 'Official weather safety provider of the Big 12 Conference',
            title: 'Official weather safety provider of the Big 12 Conference',
            facts: ['Official weather safety provider', 'Big 12 Conference'],
            body: 'Flash is the official weather safety provider of the Big 12 Conference.',
          },
        ],
        callout: {
          eyebrow: 'Official partner',
          title: 'Official Weather Monitoring & Alert System of the NAIA',
          body: 'Flash covers the NAIA’s opening rounds and national championships through October 2028: lightning predicted up to 60 minutes ahead for each venue’s 1×1 km cell, WBGT planning for every practice and game, and a written log for every call. The Big 12 Conference runs Flash as its official weather safety provider.',
          links: [
            { label: 'Partner page on naia.org', href: pressLinks.naiaPartner.href, external: true },
            { label: 'All partners', href: PRESS_PATH },
          ],
          seal: { name: 'NAIA', label: 'Official alert system', note: 'Through October 2028 · opening rounds and national championships' },
        },
        note: {
          text: 'Flash does not replace an on-site WBGT device. The full partner list is on the press and partners page.',
          link: { label: 'Press & partners', href: PRESS_PATH },
        },
      },
    ],
    faq: {
      heading: 'Questions athletic directors ask before a demo',
      intro: 'Short answers here; the full FAQ covers procurement, data and integrations.',
      link: { label: 'Read the full FAQ', href: '/resources/frequently-asked-questions/' },
      layout: 'split',
    },
    related: {
      heading: 'Keep reading',
      intro: 'The product, the policy, the comparison, the pricing and one customer story, in that order.',
      layout: 'cards',
      links: [
        {
          title: 'Flash Lightning Prediction',
          text: 'The 60-minute model behind every Advisory and Warning on this page',
          href: '/products/lightning-prediction/',
        },
        {
          title: 'Georgia heat policy (GHSA)',
          text: 'The WBGT bands, the modifications at each band and how Flash maps to them',
          href: '/resources/state-heat-policies/georgia/',
        },
        {
          title: 'Prediction vs sensors vs detection',
          text: 'Why the on-site device and the forecast do different jobs',
          href: '/why-flash/prediction-vs-sensors-vs-detection/',
        },
        { title: 'Pricing', text: 'Per-site tiers and the district plan', href: '/pricing/' },
        {
          title: 'Case study: Troon',
          text: 'Flash is an approved vendor across all 700+ Troon golf properties',
          href: '/case-studies/troon/',
        },
      ],
    },
    card: {
      summary: 'WBGT planning and lightning calls for athletic directors',
      line: 'WBGT and lightning calls for athletic directors',
      image: img('flash-school-athletic-field-floodlit-dusk-cumulus-hero.jpg', ''),
      tag: 'Lightning · Heat',
    },
  },
  {
    slug: 'turf-agronomy',
    name: 'Turf Agronomy',
    title: 'Frost and hail metrics for turf',
    description:
      'Flash pairs hail and lightning prediction with frost and disease-pressure metrics, giving superintendents one source for the conditions of the day.',
    headline: 'Frost, disease pressure and hail, on one screen',
    intro:
      'Turf decisions turn on conditions that change hourly. The agronomy suite puts them next to the hazard forecast.',
    risks: ['Frost delays', 'Disease pressure', 'Hail damage to greens'],
    riskNotes: [
      'Turf decisions turn on conditions that change hourly. Predictive insights help you plan ahead and protect turf health before problems develop.',
      'Frost and disease-pressure metrics alongside lightning and hail, on the same sites.',
      'Flash pairs hail and lightning prediction with frost and disease-pressure metrics, giving superintendents one source for the conditions of the day.',
    ],
    alert: { label: 'Frost, disease pressure, hail · one screen', tone: 'watch' },
    faqs: [
      {
        question: 'What does the agronomy suite add beyond the hazard forecast?',
        answer: 'Frost and disease-pressure metrics alongside lightning and hail, on the same sites.',
      },
      {
        question: 'Can I monitor multiple locations at once?',
        answer:
          'Yes. Flash allows you to create and monitor multiple locations, making it easy to track conditions across fields, job sites, facilities, or service areas from a single platform.',
      },
      {
        question: 'How often does the data update?',
        answer:
          'Lightning refreshes every 2 minutes and hail every 5 minutes, so you are always working with the most current and actionable information available.',
      },
      {
        question: 'Can Flash help with irrigation decisions?',
        answer:
          'Flash gives you real-time rainfall and temperature data so you can adjust irrigation based on actual conditions rather than a fixed schedule.',
      },
    ],
    card: {
      image: img('flash-agriculture-dew-leaf-wetness-close-cut-turf.png', ''),
      tag: 'Frost · Hail',
    },
  },
  {
    slug: 'utilities',
    name: 'Utilities',
    title: 'Lightning alerts for utilities',
    description:
      'Flash predicts lightning up to an hour ahead, so utilities pre-position crews, protect linemen and anticipate the outages a storm is about to cause.',
    headline: 'Pre-position the crews before the outage',
    intro:
      'Utilities do not get to shelter and wait. Knowing up to an hour ahead is the difference between responding and being ready.',
    risks: ['Lineman safety', 'Outage response time', 'Asset damage'],
    riskNotes: [
      'Utilities do not get to shelter and wait. Flash predicts lightning up to an hour ahead, so utilities pre-position crews and protect linemen.',
      'When outages happen, Flash gives you better visibility into conditions so your teams can respond faster and more efficiently.',
      'Flash gives utility teams advance warning of incoming lightning, wind, and severe weather so you can take proactive steps to protect critical assets.',
    ],
    alert: { label: 'Lightning alert · pre-position crews now', tone: 'warning' },
    faqs: [
      {
        question: 'Can Flash feed into an existing operations system?',
        answer: 'Yes, through the API, alongside the dashboard and mobile alerts.',
      },
      {
        question: 'Can I monitor multiple locations at once?',
        answer:
          'Yes. Flash allows you to create and monitor multiple locations, making it easy to track conditions across fields, job sites, facilities, or service areas from a single platform.',
      },
      {
        question: 'What is the Weather Command Center?',
        answer:
          'The Weather Command Center is your central dashboard for monitoring weather conditions, tracking multiple locations, and receiving real-time alerts. It is designed for teams and operations that need a complete view of weather activity, allowing you to make faster, more informed decisions across sites.',
      },
      {
        question: 'How does Flash help improve safety?',
        answer:
          'Flash helps improve safety by giving you earlier visibility into dangerous conditions. Instead of reacting to weather after it arrives, you can anticipate risks like lightning and extreme heat and take action sooner to protect people, operations, and assets.',
      },
      {
        question: 'How accurate is Flash?',
        answer:
          'Flash is built on advanced modeling and real-time data inputs, delivering up to 99.6% prediction accuracy. The platform continuously updates lightning every 2 minutes and hail every 5 minutes, using over 30 integrated data signals to provide highly localized, reliable insights.',
      },
    ],
    card: {
      tag: 'Lightning',
    },
  },
];

export const industrySlugs = industries.map((industry) => industry.slug);

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug);
}

export function industryPath(slug: string): string {
  return `/industries-we-serve/${slug}/`;
}

/** Every other vertical, for the cross-links at the foot of each page. */
export function siblingIndustries(slug: string): Industry[] {
  return industries.filter((industry) => industry.slug !== slug);
}

/**
 * Three closely related verticals for each page's "Related industries" block,
 * near its foot (approved Oct 2026). The order is the order shown. Every
 * vertical is listed here and is named by at least two others; both are
 * checked at the end of this file, so a new vertical left out fails the build.
 */
const RELATED_INDUSTRIES: Record<string, [string, string, string]> = {
  golf: ['turf-agronomy', 'parks-rec', 'events-venues'],
  'turf-agronomy': ['golf', 'parks-rec', 'agriculture'],
  'parks-rec': ['golf', 'turf-agronomy', 'municipalities'],
  construction: ['concrete', 'roofing', 'utilities'],
  concrete: ['construction', 'roofing', 'municipalities'],
  roofing: ['construction', 'concrete', 'insurance'],
  schools: ['outdoor-sports', 'events-venues', 'parks-rec'],
  'outdoor-sports': ['schools', 'events-venues', 'parks-rec'],
  'events-venues': ['outdoor-sports', 'schools', 'parks-rec'],
  utilities: ['municipalities', 'construction', 'insurance'],
  municipalities: ['utilities', 'parks-rec', 'events-venues'],
  insurance: ['roofing', 'agriculture', 'construction'],
  agriculture: ['turf-agronomy', 'insurance', 'golf'],
};

export function relatedIndustries(slug: string): Industry[] {
  return (RELATED_INDUSTRIES[slug] ?? []).map((related) => {
    const industry = getIndustry(related);
    if (!industry) throw new Error(`Related industries for "${slug}" name an unknown industry: ${related}`);
    return industry;
  });
}

/**
 * The order the index shows them in: the verticals with a designed card first,
 * in the order the home page lists them, then the rest alphabetically.
 */
const INDEX_ORDER = ['schools', 'construction', 'roofing', 'golf', 'agriculture', 'insurance'];

export function industriesForIndex(): Industry[] {
  const rank = (slug: string) => {
    const i = INDEX_ORDER.indexOf(slug);
    return i === -1 ? INDEX_ORDER.length : i;
  };
  return [...industries].sort((a, b) => rank(a.slug) - rank(b.slug) || a.name.localeCompare(b.name));
}

// ---------------------------------------------------------------------------
// Sectors
// ---------------------------------------------------------------------------

/**
 * The three sectors the industries index groups the verticals into. Every
 * vertical sits in exactly one (checked below, so a new vertical that is left
 * out fails the build instead of dropping off the index).
 */
export type IndustrySector = {
  id: string;
  name: string;
  /** The panel's header photo; `tone` evens its brightness against the other two. */
  image: Img;
  tone?: 'lift' | 'dim';
  slugs: string[];
};

export const industrySectors: IndustrySector[] = [
  {
    id: 'fields-venues',
    name: 'Fields & venues',
    image: img(
      'flash-schools-college-stadium-upper-deck-distant-lightning.png',
      'A floodlit college football stadium at dusk with lightning in the distance',
    ),
    slugs: ['schools', 'outdoor-sports', 'parks-rec', 'events-venues'],
  },
  {
    id: 'sites-crews',
    name: 'Sites & crews',
    image: img('flash-construction-tower-crane-storm-sky-hero.jpg', 'A tower crane over a building under construction beneath a storm sky'),
    tone: 'lift',
    slugs: ['construction', 'concrete', 'roofing', 'utilities', 'municipalities'],
  },
  {
    id: 'land-turf-risk',
    name: 'Land, turf & risk',
    image: img('flash-agriculture-irrigated-crop-rows-dawn-frost-mist-hero.jpg', 'Frosted crop rows under morning mist at dawn'),
    tone: 'dim',
    slugs: ['agriculture', 'turf-agronomy', 'golf', 'insurance'],
  },
];

/** The order a sector lists its hazards in, whatever order its verticals name them. */
const HAZARD_ORDER = ['Lightning', 'Hail', 'Heat', 'Wind', 'Frost', 'Disease pressure'];

/** A sector's verticals, in its own order. */
export function sectorIndustries(sector: IndustrySector): Industry[] {
  return sector.slugs.map((slug) => {
    const industry = getIndustry(slug);
    if (!industry) throw new Error(`Sector "${sector.name}" lists an unknown industry: ${slug}`);
    return industry;
  });
}

/** The hazards a sector's verticals watch, read from their `card.tag`, each once. */
export function sectorHazards(sector: IndustrySector): string[] {
  const named = new Set(sectorIndustries(sector).flatMap((industry) => industry.card?.tag?.split(' · ') ?? []));
  const rank = (hazard: string) => {
    const i = HAZARD_ORDER.indexOf(hazard);
    return i === -1 ? HAZARD_ORDER.length : i;
  };
  return [...named].sort((a, b) => rank(a) - rank(b));
}

for (const slug of industrySlugs) {
  const related = RELATED_INDUSTRIES[slug];
  if (!related) throw new Error(`Industry "${slug}" has no related industries`);
  if (related.includes(slug)) throw new Error(`Industry "${slug}" lists itself as related`);
  relatedIndustries(slug);
  const namedBy = industrySlugs.filter((other) => RELATED_INDUSTRIES[other]?.includes(slug)).length;
  if (namedBy < 2) throw new Error(`Industry "${slug}" is a related industry on only ${namedBy} page(s)`);
  const homes = industrySectors.filter((sector) => sector.slugs.includes(slug));
  if (homes.length !== 1) throw new Error(`Industry "${slug}" must sit in exactly one sector, found ${homes.length}`);
}

// The header's Industries menu and the footer (content/navigation.ts) are
// hand-written so the client bundle does not carry this file; they must list
// every vertical, under its sector, by its name.
industrySectors.forEach((sector, i) => {
  const group = industriesMenu.columns[i]?.groups[0];
  const expected = sectorIndustries(sector).map((industry) => `${industry.name} ${industryPath(industry.slug)}`);
  const listed = group?.links.map((link) => `${link.label} ${link.href}`) ?? [];
  if (group?.label !== sector.name || expected.join('|') !== listed.join('|'))
    throw new Error(`The Industries menu's column ${i + 1} must be the "${sector.name}" sector: ${expected.join(', ')}`);
});
if (industriesMenu.columns.length !== industrySectors.length)
  throw new Error('The Industries menu has a column that is not a sector');
