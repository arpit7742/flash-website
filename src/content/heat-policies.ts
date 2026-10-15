/**
 * State heat policies, as data.
 *
 * One template at `app/resources/state-heat-policies/[state]/` renders every
 * entry. Each state page follows the same shape -- verified thresholds, the
 * reading cadence, what to keep on file, where the WBGT forecast fits -- so
 * adding a state is an entry here; the route and sitemap entry follow.
 *
 * This is legal and policy content: copy is verbatim from the approved
 * design and from the association's own documents. Do not paraphrase a
 * threshold, and restate `verified` whenever the source is re-checked.
 */

import type { Image } from './blog';
import { resourcesMenu } from './navigation';

export type ThresholdBand = {
  /** WBGT range as printed, e.g. "82.0 – 86.9". */
  range: string;
  /**
   * The same band in the association's second regional set, where it prints
   * two (UIL's Class 2 beside Class 3). Needs a fifth column.
   */
  range2?: string;
  activity: string;
  rest: string;
  equipment: string;
  /** The Flash alert-scale colour the row carries. */
  tone: 'clear' | 'advisory' | 'watch' | 'warning' | 'extreme';
  /** Cells printed muted because they carry no restriction. */
  mutedActivity?: boolean;
  mutedRest?: boolean;
  mutedEquipment?: boolean;
};

/** A source, with the address it was checked at where the page links it. */
export type HeatPolicySource = string | { text: string; href: string };

export type HeatPolicy = {
  slug: string;
  /**
   * Internal only, never shown on the page: a draft is built and reachable
   * by its URL, but it is noindex, left out of the sitemap and the index, and
   * not linked from anywhere. Say why here, in a comment, until it ships.
   */
  draft?: boolean;
  state: string;
  /** Association short name, e.g. GHSA. */
  association: string;
  associationName: string;
  associationUrl: string;
  /** The rule's formal name, used in citations. */
  ruleName: string;
  title: string;
  description: string;
  headline: string;
  /** Shorter headline for the OG card. */
  shortHeadline: string;
  /** One line for the state's card on the index. */
  summary: string;
  eyebrow: string;
  intro: string;
  byline: string;
  /** ISO date the thresholds were last verified against the source. */
  verified: string;
  hero: Image;
  requires: {
    heading: string;
    paragraphs: string[];
    cards: { title: string; body: string }[];
  };
  table: {
    heading: string;
    intro: string;
    caption: string;
    /** Four columns, or five when the bands carry `range2`. */
    columns: [string, string, string, string] | [string, string, string, string, string];
    bands: ThresholdBand[];
    note: string;
  };
  flashFits: {
    heading: string;
    callout: string;
    points: { title: string; body: string; link?: { label: string; href: string } }[];
    link: { label: string; href: string; note: string };
  };
  planningDay: {
    heading: string;
    disclaimer: string;
    figure: { image: Image; badge: string; overlay: string };
    steps: { time: string; text: string; tone: 'info' | 'warning' | 'clear' }[];
  };
  documentation: { heading: string; intro: string; items: string[] };
  sources: HeatPolicySource[];
  faqs: { question: string; answer: string }[];
  rail: {
    eyebrow: string;
    heading: string;
    href: string;
    points: string[];
    agent: { prompt: string; reply: string; action: string };
    note: string;
    verifiedNote: string;
    contact: string;
  };
  /** Hero chart: an illustrative WBGT forecast, never live weather. */
  outlook: {
    title: string;
    time: string;
    threshold: number;
    points: { label: string; value: number }[];
    /** Index of the highlighted hour. */
    peak: number;
    chips: [string, string];
    caption: string;
    alt: string;
    disclaimer: string;
  };
};

export const heatPolicies: HeatPolicy[] = [
  {
    slug: 'georgia',
    state: 'Georgia',
    association: 'GHSA',
    associationName: 'Georgia High School Association',
    associationUrl: 'https://www.ghsa.net/',
    ruleName: 'GHSA By-Law 2.67, Practice Policy for Heat and Humidity',
    title: 'Georgia high school heat policy (WBGT)',
    description:
      'GHSA 2.67 WBGT thresholds for Georgia high school practice: rest breaks, practice limits and football equipment by band, and how to plan around them.',
    headline:
      'Georgia high school heat policy: GHSA WBGT thresholds, practice limits, and how to plan around them',
    shortHeadline: 'Georgia high school heat policy: GHSA WBGT thresholds and practice limits',
    summary: 'GHSA By-Law 2.67: five WBGT bands for practice length, rest breaks and football equipment.',
    eyebrow: 'State heat policy · Georgia (GHSA) · Verified 21 Sep 2026',
    intro:
      'GHSA By-Law 2.67 sets five WBGT bands that decide how long practice runs, how often players rest and what football players may wear. Here are the verified thresholds, what an athletic director has to keep on file, and how a WBGT forecast lets you move practice instead of cancelling it.',
    byline:
      'Flash Meteorology Desk · Checked against GHSA By-Law 2.67 (current PDF, ghsa.net) · Updated 21 Sep 2026 · 7 min read',
    verified: '2026-09-21',
    hero: {
      src: '/images/heat-policies/flash-georgia-floodlit-athletic-field-heat-policy.png',
      alt: 'An empty floodlit high school football field at dusk with heat haze over the turf, the setting GHSA WBGT practice limits govern',
      width: 1376,
      height: 768,
    },
    requires: {
      heading: 'What does GHSA require?',
      paragraphs: [
        'By-Law 2.67 applies to every sport, year-round, including summer conditioning. The head coach signs the policy at the start of each season and it goes to every player and parent. It follows modified American College of Sports Medicine guidance on three things: when practice can be scheduled, how much rest and hydration time each hour needs, and the level at which practice stops.',
        "A scientifically approved WBGT instrument must be used at each practice. The by-law text sets readings every hour, beginning 30 minutes before practice starts; GHSA's practice reminder tightens that to at least every 30 minutes. Once a reading has stayed in a band for 15 consecutive minutes, that band's restrictions hold for the rest of the session — you can move up to a stricter band, never back down.",
      ],
      cards: [
        {
          title: 'Reading cadence',
          body: "Every hour by the by-law; at least every 30 minutes per GHSA's reminder. First reading 30 minutes before practice.",
        },
        {
          title: 'Band lock-in',
          body: '15 consecutive minutes in a band commits that band for the rest of practice. Stricter bands apply at once; no reverting lower.',
        },
        {
          title: 'The device',
          body: 'A scientifically approved WBGT monitor, calibrated at least every two years. Phone apps are not accepted.',
        },
        {
          title: 'Rest breaks and cooling',
          body: 'In a cool zone out of direct sun, unlimited hydration, never combined with activity. Over 86: ice towels and a cold-immersion tub on hand.',
        },
      ],
    },
    table: {
      heading: 'The GHSA WBGT threshold table',
      intro:
        'Five bands, read in degrees Fahrenheit from the on-site WBGT device. The row colour follows the Flash alert scale your athletic trainers already see in the app.',
      caption:
        'GHSA WBGT threshold table for Georgia high school practice: five bands from under 82.0 to over 92.0 °F with rest-break, practice-length and football-equipment rules',
      columns: ['WBGT (°F)', 'Activity limit', 'Rest breaks', 'Football equipment'],
      bands: [
        {
          range: 'Under 82.0',
          activity: 'Normal activities',
          rest: 'At least 3 separate breaks per hour, minimum 3 min each',
          equipment: 'No restriction',
          tone: 'clear',
          mutedEquipment: true,
        },
        {
          range: '82.0 – 86.9',
          activity: 'Use discretion for intense or prolonged exercise; watch at-risk players closely',
          rest: 'At least 3 separate breaks per hour, minimum 4 min each',
          equipment: 'No restriction',
          tone: 'advisory',
          mutedEquipment: true,
        },
        {
          range: '87.0 – 89.9',
          activity: 'Maximum practice time 2 hours',
          rest: 'At least 4 separate breaks per hour, minimum 4 min each',
          equipment: 'Helmet, shoulder pads and shorts only; all protective equipment off for conditioning',
          tone: 'watch',
        },
        {
          range: '90.0 – 92.0',
          activity: 'Maximum practice time 1 hour; no conditioning activities',
          rest: '20 minutes of breaks distributed through the hour',
          equipment: 'No protective equipment',
          tone: 'warning',
        },
        {
          range: 'Over 92.0',
          activity: 'No outdoor workouts — delay until a cooler WBGT is reached',
          rest: '—',
          equipment: '—',
          tone: 'extreme',
          mutedRest: true,
          mutedEquipment: true,
        },
      ],
      note: 'Source: GHSA By-Law 2.67, Practice Policy for Heat and Humidity — current PDF on ghsa.net, verified 21 Sep 2026. If WBGT rises into 87.0–89.9 during a session, players may finish in football pants without changing to shorts.',
    },
    flashFits: {
      heading: 'Where does Flash fit?',
      callout:
        "GHSA compliance is decided by your on-site WBGT reading. Flash's WBGT forecast tells you at 1 pm what the 4 pm reading is likely to be, so you can move practice instead of cancelling it.",
      points: [
        {
          title: "Heat: plan, don't cancel",
          body: 'The outlook runs per field for every hour of the afternoon, against the five bands above. Shift the start, swap the equipment plan or go indoors before the cars arrive.',
        },
        {
          title: 'Lightning: up to 60 minutes ahead',
          body: 'Strike-level prediction on a 1×1 km cell, refreshed every 2 minutes. Up to 99.6% lightning prediction accuracy on a one-hour window, measured against NLDN ground-truth strikes — method published.',
          link: { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
        },
        {
          title: 'Return to play: the all-clear timer',
          body: "After the last strike inside your radius, Flash runs your policy's all-clear timer and logs it. The practice clock stops for the weather stoppage, as 2.67(c) allows.",
          link: { label: 'Weather Command Center', href: '/products/weather-command-center/' },
        },
      ],
      link: {
        label: 'Flash Heat and WBGT prediction',
        href: '/products/heat-wbgt/',
        note: 'WBGT forecast, heat index, air temperature and dew point per 1×1 km cell',
      },
    },
    planningDay: {
      heading: 'What does a planning day look like?',
      disclaimer: "Illustrative example · Not live weather — the readings are examples, the rules are GHSA's",
      figure: {
        image: {
          src: '/images/heat-policies/flash-georgia-practice-field-heat-planning-day.png',
          alt: 'An empty Georgia high school practice field under a hazy hot sun with a shade canopy and water coolers on the sideline, the setting for a GHSA WBGT planning day',
          width: 1376,
          height: 768,
        },
        badge: '3:15 pm · The reading that decides the day',
        overlay: 'The band you land in at 3 pm sets the pads, the breaks and the water.',
      },
      steps: [
        {
          time: '1:00 pm',
          text: 'Flash WBGT forecast for the practice field: 84 by 3 pm, into 87.0–89.9 by 4 pm. The athletic director flags the football session.',
          tone: 'info',
        },
        {
          time: '1:15 pm',
          text: 'Decision: run at 4 pm under the 2-hour cap with four breaks an hour, or push to 6:30 pm. The AD pushes. The bus, the trainers and the parents hear now, not at 3:45.',
          tone: 'info',
        },
        {
          time: '6:00 pm',
          text: 'First on-site WBGT reading, 30 minutes before practice: 83.4, the 82.0–86.9 band. Three 4-minute breaks per hour go on the plan and the reading goes on the GHSA record chart.',
          tone: 'info',
        },
        {
          time: '7:10 pm',
          text: 'Flash lightning alert: a strike is predicted inside the site radius within the next 60 minutes. The field clears and the practice clock stops.',
          tone: 'warning',
        },
        {
          time: '7:52 pm',
          text: 'Last strike inside the radius. Flash starts the all-clear timer.',
          tone: 'info',
        },
        {
          time: '8:22 pm',
          text: 'All clear. Practice resumes for its remaining time; the alert log records who was warned, when, and when play returned.',
          tone: 'clear',
        },
      ],
    },
    documentation: {
      heading: 'What does the athletic director keep on file?',
      intro:
        'The by-law is enforced from the record. Keep these together for every practice, so a question from the GHSA, the district or a parent is answered from one folder.',
      items: [
        'WBGT readings with times — the first 30 minutes before practice, then every 30 minutes — on the GHSA Heat Index Measurement & Record Chart.',
        'The band each reading fell in and the decision it triggered: practice length, rest-break schedule, equipment plan.',
        'The WBGT monitor used and its calibration date (at least every two years).',
        'The signed policy for the season — head coach, each athlete and a parent or guardian.',
        'The Flash alert log: lightning alerts, who was notified, the all-clear, and the WBGT forecast the schedule decision was based on.',
      ],
    },
    sources: [
      'GHSA — By-Law 2.67, Practice Policy for Heat and Humidity, current PDF on ghsa.net. Thresholds, reading cadence, definitions. Verified 21 Sep 2026.',
      'GHSA — Heat policy FAQ and practice reminder, ghsa.net. 30-minute reading cadence, 15-minute band lock-in, monitor calibration, record chart.',
      'National Weather Service — WBGT and heat-safety guidance, weather.gov.',
      "National Athletic Trainers' Association — Position Statement: Exertional Heat Illnesses, Journal of Athletic Training, 2015.",
    ],
    faqs: [
      {
        question: 'Does Flash replace the on-site WBGT device?',
        answer:
          "No. GHSA compliance is decided by the reading from a scientifically approved monitor at the practice site. Flash's WBGT forecast tells you where that reading is heading — a scheduling tool, not a compliance instrument.",
      },
      {
        question: 'How often do we take readings?',
        answer:
          "By-Law 2.67 says every hour, starting 30 minutes before practice. GHSA's practice reminder says at least every 30 minutes. Plan for every 30 minutes and record each one.",
      },
      {
        question: 'What happens if the WBGT rises during practice?',
        answer:
          "Once a reading has stayed in a higher band for 15 consecutive minutes, that band's limits apply for the rest of practice. Football players already in pants may finish in pants when the reading enters 87.0–89.9. You never drop back to a lower band in the same session.",
      },
      {
        question: 'Does the policy apply to summer conditioning?',
        answer:
          'Yes. By-Law 2.67 is year-round and covers voluntary conditioning workouts as well as in-season practice, for every sport.',
      },
    ],
    rail: {
      eyebrow: 'For athletic directors',
      heading: 'Flash for Georgia schools',
      href: '/industries-we-serve/schools/',
      points: [
        'WBGT forecast for every field, so you move practice before the on-site reading crosses 87.0.',
        'Lightning predicted up to 60 minutes ahead, with your all-clear timer built in.',
        'An alert log for the athletic director.',
      ],
      agent: {
        prompt: '"Move Thursday practice if WBGT tops 87."',
        reply: '88.1 forecast at 4 pm. Practice moved to 5:30 in Google Calendar; trainers notified.',
        action: 'Action · Google Calendar updated',
      },
      note: 'Software only. No sensor to buy — your WBGT device stays. Every agent action is logged and confirmed by a person first.',
      verifiedNote: 'Thresholds checked against GHSA By-Law 2.67 (current PDF on ghsa.net) on 21 Sep 2026.',
      contact: 'Spotted a change?',
    },
    outlook: {
      title: 'WBGT forecast · Field B',
      time: '12:58',
      threshold: 87,
      points: [
        { label: '1 pm', value: 84.2 },
        { label: '2 pm', value: 86.1 },
        { label: '3 pm', value: 87.6 },
        { label: '4 pm', value: 88.1 },
        { label: '5 pm', value: 86.4 },
        { label: '6 pm', value: 84.0 },
      ],
      peak: 3,
      chips: ['4 pm · 88.1 — above 87.0', 'Under 87 after 5:20'],
      caption: 'Move practice to 5:30 — the on-site reading stays the compliance record.',
      alt: 'Flash WBGT forecast for a Georgia high school practice field, showing the 4 pm reading trending into the 87.0–89.9 band',
      disclaimer: 'Illustrative example · Not live weather',
    },
  },
  {
    slug: 'texas',
    state: 'Texas',
    association: 'UIL',
    associationName: 'University Interscholastic League',
    associationUrl: 'https://www.uiltexas.org/',
    ruleName: 'UIL 2026-2027 Heat Stress & Athletic Participation Required Plan',
    title: 'Texas heat policy: WBGT thresholds',
    description:
      'UIL WBGT thresholds for Texas high school practice: Class 2 and Class 3 bands, practice limits, rest breaks, football equipment and rapid cooling zones.',
    headline:
      'Texas high school heat policy: UIL WBGT thresholds, practice limits, and how to plan around them',
    shortHeadline: 'Texas high school heat policy: UIL WBGT thresholds and practice limits',
    summary: 'UIL’s required plan: five WBGT bands in two regional classes, with practice limits and rapid cooling zones.',
    eyebrow: 'State heat policy · Texas (UIL) · Checked 5 Oct 2026',
    intro:
      'Since August 1, 2026, the UIL Heat Stress and Athletic Participation guidelines are required standards for every member school. Five WBGT bands, printed in two regional sets, decide how long practice runs, how often players rest, what football players wear and when a rapid cooling zone must be ready. Here are the bands as UIL prints them, what to keep on file, and how a WBGT forecast lets you move practice instead of cancelling it.',
    byline:
      'Flash Meteorology Desk · Checked against the UIL 2026-2027 Heat Stress & Athletic Participation Required Plan (uiltexas.org) · Checked 5 Oct 2026 · 7 min read',
    verified: '2026-10-05',
    hero: {
      src: '/images/products/athletic-practice-field-dusk-late-summer-haze.jpg',
      alt: 'An empty high school football practice field at dusk under a hazy late-summer sky, the setting UIL WBGT practice limits govern',
      width: 1376,
      height: 768,
    },
    requires: {
      heading: 'What does UIL require?',
      paragraphs: [
        'In June 2026 the UIL Legislative Council made the Heat Stress and Athletic Participation guidelines required standards for all member schools, effective August 1, 2026. They cover all practices held outdoors, including covered pavilions, and indoor facilities that are not climate-controlled. Practice is timed from when players report to the outside practice area until they leave it.',
        'Schools must use a scientifically approved instrument that measures WBGT, or another scientifically proven method such as internet-based weather station software or an application. An on-site instrument is set up 30 minutes before practice and read 15 minutes before it starts; an internet source is checked within 15 minutes of the start. Readings then follow every 30 minutes during practice. UIL’s WBGT map places each area in Class 2 or Class 3, and each class has its own set of bands.',
      ],
      cards: [
        {
          title: 'Reading cadence',
          body: 'On-site instrument set up 30 minutes before practice and read 15 minutes before it. Then every 30 minutes during practice.',
        },
        {
          title: 'Class 2 or Class 3',
          body: 'UIL’s WBGT map decides which bands apply. A school near the line makes a local determination before the year starts and applies it consistently.',
        },
        {
          title: 'Rapid cooling zone',
          body: 'From 82.0 in Class 3 or 79.7 in Class 2, for every contest, practice, workout and conditioning session: cold-water immersion tubs or tarps on hand.',
        },
        {
          title: 'Rest breaks and water',
          body: 'Unrestricted access to water. Rest breaks involve unlimited hydration and rest, with no activity.',
        },
      ],
    },
    table: {
      heading: 'The UIL WBGT threshold table',
      intro:
        'Five bands, read from the WBGT instrument. Find your class on the UIL WBGT map, then read across. The row colour follows the Flash alert scale your athletic trainers already see in the app.',
      caption:
        'UIL WBGT activity guidelines for Texas high school practice: five bands for Class 3, from under 82.0 to 92.1 and above, and for Class 2, from under 79.7 to 89.8 and above, with practice-length, rest-break, football-equipment and cooling-zone rules',
      columns: ['Class 3', 'Class 2', 'Activity limit', 'Rest breaks', 'Football equipment'],
      bands: [
        {
          range: 'Under 82.0',
          range2: 'Under 79.7',
          activity: 'Normal activities',
          rest: 'At least 3 separate breaks each hour, minimum 3 min each',
          equipment: 'None listed',
          tone: 'clear',
          mutedEquipment: true,
        },
        {
          range: '82.0 – 86.9',
          range2: '79.7 – 84.6',
          activity: 'Use discretion for intense or prolonged exercise. Mandatory onsite rapid cooling zone (tub or tarp)',
          rest: 'At least 3 separate breaks each hour, minimum 4 min each',
          equipment: 'None listed',
          tone: 'advisory',
          mutedEquipment: true,
        },
        {
          range: '87.0 – 90.0',
          range2: '84.7 – 87.6',
          activity: 'Maximum practice time 2 hours. Mandatory onsite rapid cooling zone (tub or tarp)',
          rest: 'At least 4 separate breaks each hour, minimum 4 min each',
          equipment: 'Helmet, shoulder pads and shorts only',
          tone: 'watch',
        },
        {
          range: '90.1 – 92.0',
          range2: '87.7 – 89.7',
          activity: 'Maximum practice time 1 hour. Mandatory onsite rapid cooling zone (tub or tarp)',
          rest: '20 minutes of breaks distributed through the hour',
          equipment: 'No protective equipment; no conditioning activities',
          tone: 'warning',
        },
        {
          range: '92.1 and above',
          range2: '89.8 and above',
          activity: 'No outdoor workouts — delay practice until a cooler WBGT is reached',
          rest: '—',
          equipment: '—',
          tone: 'extreme',
          mutedRest: true,
          mutedEquipment: true,
        },
      ],
      note: 'Source: UIL 2026-2027 Heat Stress & Athletic Participation Required Plan, WBGT Activity Guidelines chart (uiltexas.org), checked 5 Oct 2026. Values are WBGT measurements, not temperature or heat index. If WBGT rises into the third band during practice, football players may continue in football pants without changing to shorts. The practice limits do not apply to UIL competitions; the rapid cooling zone does.',
    },
    flashFits: {
      heading: 'Where does Flash fit?',
      callout:
        "Flash is a forecast for planning, not an on-site meter: UIL compliance uses the reading your school takes 15 minutes before and every 30 minutes during practice. Flash's WBGT forecast tells you at 1 pm what the 4 pm reading is likely to be, so you can move practice instead of cancelling it.",
      points: [
        {
          title: "Heat: plan, don't cancel",
          body: 'The outlook runs per field for every hour of the afternoon, against the bands for your class. Shift the start, swap the equipment plan or go indoors before the cars arrive.',
        },
        {
          title: 'Lightning: up to 60 minutes ahead',
          body: 'Strike-level prediction on a 1×1 km cell, refreshed every 2 minutes. Up to 99.6% lightning prediction accuracy on a one-hour window, measured against NLDN ground-truth strikes — method published.',
          link: { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
        },
        {
          title: 'Return to play: the all-clear timer',
          body: "After the last strike inside your radius, Flash runs your policy's all-clear timer and logs it, so play resumes on evidence.",
          link: { label: 'Weather Command Center', href: '/products/weather-command-center/' },
        },
      ],
      link: {
        label: 'Flash Heat and WBGT prediction',
        href: '/products/heat-wbgt/',
        note: 'WBGT forecast, heat index, air temperature and dew point per 1×1 km cell',
      },
    },
    planningDay: {
      heading: 'What does a planning day look like?',
      disclaimer: "Illustrative example · Not live weather — the readings are examples, the rules are UIL's (Class 3)",
      figure: {
        image: {
          src: '/images/heat-policies/flash-georgia-practice-field-heat-planning-day.png',
          alt: 'An empty high school practice field under a hazy hot sun with a shade canopy and water coolers on the sideline, the setting for a UIL WBGT planning day',
          width: 1376,
          height: 768,
        },
        badge: '6:15 pm · The reading that decides the day',
        overlay: 'The band you land in sets the clock, the breaks, the pads and the cooling zone.',
      },
      steps: [
        {
          time: '1:00 pm',
          text: 'Flash WBGT forecast for the practice field: 85 by 3 pm, into 87.0–90.0 by 4 pm. The athletic director flags the football session.',
          tone: 'info',
        },
        {
          time: '1:15 pm',
          text: 'Decision: run at 4 pm under the 2-hour cap with four 4-minute breaks an hour, or push to 6:30 pm. The AD pushes. The bus, the trainers and the parents hear now, not at 3:45.',
          tone: 'info',
        },
        {
          time: '6:15 pm',
          text: 'On-site reading 15 minutes before practice, on an instrument set up at 6:00: 84.1, the 82.0–86.9 band. Three 4-minute breaks per hour go on the plan and the rapid cooling zone, tub or tarp, is set up.',
          tone: 'info',
        },
        {
          time: '7:10 pm',
          text: 'Flash lightning alert: a strike is predicted inside the site radius within the next 60 minutes. The field clears.',
          tone: 'warning',
        },
        {
          time: '7:52 pm',
          text: 'Last strike inside the radius. Flash starts the all-clear timer.',
          tone: 'info',
        },
        {
          time: '8:22 pm',
          text: 'All clear. Practice resumes; the alert log records who was warned, when, and when play returned.',
          tone: 'clear',
        },
      ],
    },
    documentation: {
      heading: 'What should the athletic director keep on file?',
      intro:
        'UIL recommends, rather than requires, that schools record and keep WBGT readings on file. Keeping these together means a question from the district, the District Executive Committee or a parent is answered from one folder.',
      items: [
        'WBGT readings with times — 15 minutes before practice, then every 30 minutes — taken by the same person where possible.',
        'Which class the school follows, Class 2 or Class 3, and near the line the local determination made before the year started.',
        'The band each reading fell in and the decision it triggered: practice length, rest breaks, football equipment, the cooling zone.',
        'The emergency action plan, including onsite rapid cooling by cold-water immersion or equivalent means.',
        'The Flash alert log: lightning alerts, who was notified, the all-clear, and the WBGT forecast the schedule decision was based on.',
      ],
    },
    sources: [
      {
        text: 'UIL — 2026-2027 Heat Stress & Athletic Participation Required Plan, with the WBGT Activity Guidelines chart and the WBGT map. Thresholds, reading cadence, rapid cooling zones. Checked 5 Oct 2026.',
        href: 'https://www.uiltexas.org/health/info/heat-stress-and-athletic-participation',
      },
      {
        text: 'UIL — Heat Stress & Athletic Participation FAQs. Covered settings, records, the Class 2 / Class 3 line, violations. Checked 5 Oct 2026.',
        href: 'https://www.uiltexas.org/health/info/heat-stress-and-athletic-participation-faqs',
      },
      {
        text: 'UIL — Legislative Council General Session packet, June 2026, pp. 13–14. The guidelines become required standards from August 1, 2026. Checked 5 Oct 2026.',
        href: 'https://www.uiltexas.org/files/policy/Legislative-Council-General-Session-Packet-June-2026.pdf',
      },
      {
        text: 'UIL Constitution & Contest Rules — Section 1250, Football: acclimatization and practice limits. Checked 5 Oct 2026.',
        href: 'https://www.uiltexas.org/policy/constitution/athletics/football',
      },
    ],
    faqs: [
      {
        question: 'Does Flash replace the WBGT instrument?',
        answer:
          "No. UIL compliance is decided by the reading your school takes with a scientifically approved instrument or method, 15 minutes before practice and every 30 minutes during it. Flash's WBGT forecast tells you where that reading is heading — a scheduling tool, not a compliance instrument.",
      },
      {
        question: 'Which class is my school in?',
        answer:
          'The UIL WBGT map places each area in Class 2 or Class 3. UIL does not publish a county list; a school near the line between them makes a local determination before the year starts and applies it consistently.',
      },
      {
        question: 'Do the limits apply to games?',
        answer:
          'No. The WBGT practice guidelines and limitations do not apply to UIL competitions. A rapid cooling zone is still required at any contest at or above 82.0 in Class 3 or 79.7 in Class 2.',
      },
      {
        question: 'Are the guidelines required or recommended?',
        answer:
          'Required. In June 2026 the UIL Legislative Council made them required standards for all member schools, effective August 1, 2026. Keeping WBGT records on file is still a recommendation.',
      },
    ],
    rail: {
      eyebrow: 'For athletic directors',
      heading: 'Flash for Texas schools',
      href: '/industries-we-serve/schools/',
      points: [
        'WBGT forecast for every field, so you move practice before the reading crosses into the 2-hour band.',
        'Lightning predicted up to 60 minutes ahead, with your all-clear timer built in.',
        'An alert log for the athletic director.',
      ],
      agent: {
        prompt: '"Move Thursday practice if WBGT tops 87."',
        reply: '88.1 forecast at 4 pm. Practice moved to 5:30 in Google Calendar; trainers notified.',
        action: 'Action · Google Calendar updated',
      },
      note: 'Software only. No sensor to buy — your WBGT device stays. Every agent action is logged and confirmed by a person first.',
      verifiedNote:
        'Thresholds checked against the UIL 2026-2027 Heat Stress & Athletic Participation Required Plan (uiltexas.org) on 5 Oct 2026.',
      contact: 'Spotted a change?',
    },
    outlook: {
      title: 'WBGT forecast · Field B',
      time: '12:58',
      threshold: 87,
      points: [
        { label: '1 pm', value: 84.2 },
        { label: '2 pm', value: 86.1 },
        { label: '3 pm', value: 87.6 },
        { label: '4 pm', value: 88.1 },
        { label: '5 pm', value: 86.4 },
        { label: '6 pm', value: 84.0 },
      ],
      peak: 3,
      chips: ['4 pm · 88.1 — in 87.0–90.0', 'Under 87.0 after 5:20'],
      caption: 'Move practice to 5:30 — the on-site reading stays the compliance record.',
      alt: 'Flash WBGT forecast for a Texas high school practice field in UIL Class 3, showing the 4 pm reading trending into the 87.0–90.0 band',
      disclaimer: 'Illustrative example · Not live weather',
    },
  },
  {
    slug: 'florida',
    state: 'Florida',
    association: 'FHSAA',
    associationName: 'Florida High School Athletic Association',
    associationUrl: 'https://fhsaa.com/',
    ruleName: 'FHSAA Handbook Policy 41, Exertional Heat Illness (2026-27 edition)',
    title: 'Florida heat policy: WBGT thresholds',
    description:
      'FHSAA Policy 41 WBGT thresholds for Florida high school practice: activity limits, rest breaks, equipment and cooling zones, and how to plan around them.',
    headline:
      'Florida high school heat policy: FHSAA WBGT thresholds, practice limits, and how to plan around them',
    shortHeadline: 'Florida high school heat policy: FHSAA WBGT thresholds and practice limits',
    summary: 'FHSAA Policy 41 and the Zachary Martin Act: five statewide WBGT bands for practice, plus contest rules.',
    eyebrow: 'State heat policy · Florida (FHSAA) · Checked 5 Oct 2026',
    intro:
      'FHSAA Policy 41 sets five WBGT bands that decide how long practice runs, how many rest breaks each hour needs and what equipment players may wear, under the heat rules Florida law directs the FHSAA to set. Here are the bands as the 2026-27 Handbook prints them, what to keep on file, and how a WBGT forecast lets you move practice instead of cancelling it.',
    byline:
      'Flash Meteorology Desk · Checked against the FHSAA 2026-27 Handbook, Policy 41, and Florida Statute 1006.165 · Checked 5 Oct 2026 · 7 min read',
    verified: '2026-10-05',
    hero: {
      src: '/images/home/stadium-heat-wbgt-outlook.png',
      alt: 'Heat haze rising off a stadium running track under a hard sun, the conditions FHSAA WBGT practice limits are written for',
      width: 1376,
      height: 768,
    },
    requires: {
      heading: 'What does the FHSAA require?',
      paragraphs: [
        'Florida Statute 1006.165, amended by the Zachary Martin Act in 2020, directs the FHSAA to set heat-stress rules that apply year-round: monitoring heat stress and modifying, suspending or moving activities, hydration, cooling zones with cold-water immersion and a trained person, and onsite cold-water immersion in every emergency action plan. Policy 41 of the FHSAA Handbook is where those rules live.',
        'Each member school monitors heat stress with a WBGT device that has a black globe. Anytime the WBGT reading is reasonably expected to exceed 82 degrees, the device is used to record conditions and modifications are implemented. It is set up at least 15–20 minutes beforehand, three feet above the surface, in the sun, and monitored approximately every 30 minutes.',
      ],
      cards: [
        {
          title: 'Reading cadence',
          body: 'Set up at least 15–20 minutes ahead, three feet above the surface, in the sun, not under shade. Monitored approximately every 30 minutes.',
        },
        {
          title: 'The device',
          body: 'A WBGT device with a black globe; a fan is recommended. Indoor mode in gyms that are not climate-controlled.',
        },
        {
          title: 'Cooling zones',
          body: 'Cold-water immersion tubs or equivalent, an adequate supply of ice, and an individual trained to administer cold-water immersion present.',
        },
        {
          title: 'Heat illness education',
          body: 'Coaches and student-athletes complete the NFHS Heat Illness Prevention course every year.',
        },
      ],
    },
    table: {
      heading: 'The FHSAA WBGT threshold table',
      intro:
        'Five bands for practice, read from the on-site WBGT device: one table for the whole state, with no regional categories. The row colour follows the Flash alert scale your athletic trainers already see in the app.',
      caption:
        'FHSAA Policy 41 WBGT index for practices in Florida: five bands from under 82.0 to 92.1 and above, with activity-time, rest-break and equipment rules',
      columns: ['WBGT', 'Activity limit', 'Rest breaks', 'Equipment'],
      bands: [
        {
          range: 'Under 82.0',
          activity: 'Normal activities',
          rest: 'None listed',
          equipment: 'None listed',
          tone: 'clear',
          mutedRest: true,
          mutedEquipment: true,
        },
        {
          range: '82.1 – 87.0',
          activity: 'No time limit listed',
          rest: 'Three separate 4-minute breaks per hour of activity',
          equipment: 'None listed',
          tone: 'advisory',
          mutedActivity: true,
          mutedEquipment: true,
        },
        {
          range: '87.1 – 90.0',
          activity: 'Maximum 2 hours of activity time',
          rest: 'Four separate 4-minute breaks per hour of activity',
          equipment: 'Football: helmet, shoulder pads and shorts only',
          tone: 'watch',
        },
        {
          range: '90.1 – 92.0',
          activity: 'Maximum 1 hour of activity time; no conditioning activities',
          rest: 'Five separate 4-minute breaks',
          equipment: 'No protective equipment permitted',
          tone: 'warning',
        },
        {
          range: '92.1 and above',
          activity: 'No outdoor activities',
          rest: '—',
          equipment: '—',
          tone: 'extreme',
          mutedRest: true,
          mutedEquipment: true,
        },
      ],
      note: 'Source: FHSAA 2026-27 Handbook, Policy 41.8, WBGT Index for Practices (p. 106), checked 5 Oct 2026. Ranges as printed. If the WBGT rises into 87.1–90.0 after practice has begun, football players may continue in football pants without changing into shorts. Contests follow a separate FHSAA table (Policy 41.9.5), with breaks set sport by sport.',
    },
    flashFits: {
      heading: 'Where does Flash fit?',
      callout:
        "Flash is a forecast for planning, not an on-site meter: FHSAA compliance uses the on-site WBGT reading. Flash's WBGT forecast tells you at 1 pm what the 4 pm reading is likely to be, so you can move practice instead of cancelling it.",
      points: [
        {
          title: "Heat: plan, don't cancel",
          body: 'The outlook runs per field for every hour of the afternoon, against the five FHSAA bands. Shift the start, swap the equipment plan or go indoors before the cars arrive.',
        },
        {
          title: 'Lightning: up to 60 minutes ahead',
          body: 'Strike-level prediction on a 1×1 km cell, refreshed every 2 minutes. Up to 99.6% lightning prediction accuracy on a one-hour window, measured against NLDN ground-truth strikes — method published.',
          link: { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
        },
        {
          title: 'Return to play: the all-clear timer',
          body: "After the last strike inside your radius, Flash runs your policy's all-clear timer and logs it, so play resumes on evidence.",
          link: { label: 'Weather Command Center', href: '/products/weather-command-center/' },
        },
      ],
      link: {
        label: 'Flash Heat and WBGT prediction',
        href: '/products/heat-wbgt/',
        note: 'WBGT forecast, heat index, air temperature and dew point per 1×1 km cell',
      },
    },
    planningDay: {
      heading: 'What does a planning day look like?',
      disclaimer: "Illustrative example · Not live weather — the readings are examples, the rules are the FHSAA's",
      figure: {
        image: {
          src: '/images/heat-policies/flash-georgia-practice-field-heat-planning-day.png',
          alt: 'An empty high school practice field under a hazy hot sun with a shade canopy and water coolers on the sideline, the setting for an FHSAA WBGT planning day',
          width: 1376,
          height: 768,
        },
        badge: '6:30 pm · The reading that decides the day',
        overlay: 'The band you land in sets the clock, the breaks and the pads.',
      },
      steps: [
        {
          time: '1:00 pm',
          text: 'Flash WBGT forecast for the practice field: 86 by 3 pm, into 87.1–90.0 by 4 pm. The athletic director flags the football session.',
          tone: 'info',
        },
        {
          time: '1:15 pm',
          text: 'Decision: run at 4 pm under the 2-hour cap with four 4-minute breaks an hour, or push to 6:30 pm. The AD pushes. The bus, the trainers and the parents hear now, not at 3:45.',
          tone: 'info',
        },
        {
          time: '6:30 pm',
          text: 'Practice starts on a reading of 84.6, the 82.1–87.0 band, from a device set up in the sun, three feet above the field, 20 minutes earlier. Three 4-minute breaks per hour, the cooling zone ready; the next reading is at 7:00.',
          tone: 'info',
        },
        {
          time: '7:10 pm',
          text: 'Flash lightning alert: a strike is predicted inside the site radius within the next 60 minutes. The field clears.',
          tone: 'warning',
        },
        {
          time: '7:52 pm',
          text: 'Last strike inside the radius. Flash starts the all-clear timer.',
          tone: 'info',
        },
        {
          time: '8:22 pm',
          text: 'All clear. Practice resumes; the alert log records who was warned, when, and when play returned.',
          tone: 'clear',
        },
      ],
    },
    documentation: {
      heading: 'What should the athletic director keep on file?',
      intro:
        'Policy 41 has the WBGT device record conditions whenever the reading is expected to exceed 82, and sets sanctions for head coaches who break it. Keep these together so a question from the FHSAA, the district or a parent is answered from one folder.',
      items: [
        'WBGT readings with times, about every 30 minutes whenever the reading is expected to exceed 82, and the modification each one triggered.',
        'Where the device was set up: in the sun, three feet above the surface, at least 15–20 minutes before activity.',
        'NFHS Heat Illness Prevention course completion for every coach and student-athlete, each year.',
        'The emergency action plan, with onsite cold-water immersion before a student is transported to a hospital.',
        'The Flash alert log: lightning alerts, who was notified, the all-clear, and the WBGT forecast the schedule decision was based on.',
      ],
    },
    sources: [
      {
        text: 'FHSAA — 2026-27 Handbook, Policy 41, Exertional Heat Illness, pp. 103–109. Practice and contest WBGT tables, monitoring, cooling zones, acclimatization. Checked 5 Oct 2026.',
        href: 'https://s3.amazonaws.com/fhsaa.org/documents/2026/7/22/2627_handbook_website_7_22.pdf',
      },
      {
        text: 'Florida Statutes — s. 1006.165, Well-being of students participating in extracurricular activities; training (2026). Checked 5 Oct 2026.',
        href: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=1000-1099/1006/Sections/1006.165.html',
      },
      {
        text: 'Laws of Florida — ch. 2020-91, the Zachary Martin Act. Checked 5 Oct 2026.',
        href: 'http://laws.flrules.org/2020/91',
      },
    ],
    faqs: [
      {
        question: 'Does Flash replace the on-site WBGT device?',
        answer:
          "No. FHSAA compliance is decided by the reading from the WBGT device at the practice site. Flash's WBGT forecast tells you where that reading is heading — a scheduling tool, not a compliance instrument.",
      },
      {
        question: 'When do we have to take readings?',
        answer:
          'Anytime the WBGT reading is reasonably expected to exceed 82 degrees, Policy 41 has the device record conditions and modifications implemented. Set it up at least 15–20 minutes ahead and monitor it approximately every 30 minutes.',
      },
      {
        question: 'Do the same limits apply to games?',
        answer:
          'No. Contests follow a separate FHSAA table, Policy 41.9.5, with breaks set sport by sport. In football, for example, from 87.1 to 90.0 there is a mandatory 3-minute hydration break at or near the six-minute mark of each quarter.',
      },
      {
        question: 'Is there an acclimatization period?',
        answer:
          'Yes. The first 14 calendar days are an acclimatization period for all sports. In football, the first two days are helmets only, days 3–5 add shoulder pads with shorts, and full gear begins on day six.',
      },
    ],
    rail: {
      eyebrow: 'For athletic directors',
      heading: 'Flash for Florida schools',
      href: '/industries-we-serve/schools/',
      points: [
        'WBGT forecast for every field, so you move practice before the reading crosses into the 2-hour band.',
        'Lightning predicted up to 60 minutes ahead, with your all-clear timer built in.',
        'An alert log for the athletic director.',
      ],
      agent: {
        prompt: '"Move Thursday practice if WBGT tops 87."',
        reply: '88.1 forecast at 4 pm. Practice moved to 5:30 in Google Calendar; trainers notified.',
        action: 'Action · Google Calendar updated',
      },
      note: 'Software only. No sensor to buy — your WBGT device stays. Every agent action is logged and confirmed by a person first.',
      verifiedNote: 'Thresholds checked against the FHSAA 2026-27 Handbook, Policy 41 (fhsaa.com), on 5 Oct 2026.',
      contact: 'Spotted a change?',
    },
    outlook: {
      title: 'WBGT forecast · Field B',
      time: '12:58',
      threshold: 87.1,
      points: [
        { label: '1 pm', value: 84.2 },
        { label: '2 pm', value: 86.1 },
        { label: '3 pm', value: 87.6 },
        { label: '4 pm', value: 88.1 },
        { label: '5 pm', value: 86.4 },
        { label: '6 pm', value: 84.0 },
      ],
      peak: 3,
      chips: ['4 pm · 88.1 — in 87.1–90.0', 'Under 87.1 after 5:20'],
      caption: 'Move practice to 5:30 — the on-site reading stays the compliance record.',
      alt: 'Flash WBGT forecast for a Florida high school practice field, showing the 4 pm reading trending into the 87.1–90.0 band',
      disclaimer: 'Illustrative example · Not live weather',
    },
  },
  {
    /*
     * DRAFT, pending official confirmation (checked 5 Oct 2026). The figures
     * below are verbatim from OSSAA's WBGT policy and 2026-27 football packet,
     * but OSSAA's "2026-2027 Board of Directors' Policies" still carry the old
     * heat-index rule (2½-hour sessions, a phone app, no WBGT bands), no
     * published minutes record the WBGT policy's adoption, and the policy does
     * not define Region 2 and Region 3. Publish only once OSSAA's documents
     * agree: remove `draft`, re-check every figure, restate `verified`.
     */
    slug: 'oklahoma',
    draft: true,
    state: 'Oklahoma',
    association: 'OSSAA',
    associationName: 'Oklahoma Secondary School Activities Association',
    associationUrl: 'https://www.ossaa.com/',
    ruleName: 'OSSAA Extreme Heat Policy, Wet Bulb Globe Temperature (WBGT) Policy',
    title: 'Oklahoma heat policy: WBGT thresholds',
    description:
      'OSSAA WBGT thresholds for Oklahoma high school practice: Region 2 and Region 3 bands, practice limits, rest breaks, football equipment and cooling zones.',
    headline:
      'Oklahoma high school heat policy: OSSAA WBGT thresholds, practice limits, and how to plan around them',
    shortHeadline: 'Oklahoma high school heat policy: OSSAA WBGT thresholds and practice limits',
    summary: 'OSSAA’s WBGT policy: five bands in two regional sets, with practice limits, records and cooling zones.',
    eyebrow: 'State heat policy · Oklahoma (OSSAA) · Checked 5 Oct 2026',
    intro:
      "OSSAA's WBGT policy sets five bands, printed for two regions, that decide how long practice runs, how often players rest and what football players wear. Here are the bands as OSSAA prints them, what to keep on file, and how a WBGT forecast lets you move practice instead of cancelling it.",
    byline: 'Flash Meteorology Desk · Checked against the OSSAA Extreme Heat Policy (ossaa.com) · Checked 5 Oct 2026 · 6 min read',
    verified: '2026-10-05',
    hero: {
      src: '/images/heat-policies/flash-georgia-floodlit-athletic-field-heat-policy.png',
      alt: 'An empty floodlit high school football field at dusk with heat haze over the turf, the setting OSSAA WBGT practice limits govern',
      width: 1376,
      height: 768,
    },
    requires: {
      heading: 'What does OSSAA require?',
      paragraphs: [
        'OSSAA member schools must use a scientifically approved instrument that measures WBGT, or another scientifically proven method. An on-site instrument is set up 30 minutes before practice and read 15 minutes before it starts; an internet tool is checked at the 15-minute mark before practice. Readings then follow every 30 minutes during practice, and schools are required to record and keep on file the WBGT readings for outside practices.',
        'The policy prints its bands for two regions, Region 3 and Region 2. Check with OSSAA which applies to your school.',
      ],
      cards: [
        {
          title: 'Reading cadence',
          body: 'On-site instrument set up 30 minutes before practice and read 15 minutes before it. Then every 30 minutes during practice.',
        },
        {
          title: 'Records on file',
          body: 'Required: the WBGT readings for outside practices, taken before and during practice.',
        },
        {
          title: 'Rapid cooling zone',
          body: 'At a WBGT of 82.0 or higher, for every contest, practice, workout and conditioning session: cold-water immersion tubs or tarps.',
        },
        {
          title: 'Coach education',
          body: 'Coaches complete the NFHS heat illness course every year and keep the certificate on file.',
        },
      ],
    },
    table: {
      heading: 'The OSSAA WBGT threshold table',
      intro:
        'Five bands, read from the WBGT instrument, printed for two regions. The row colour follows the Flash alert scale your athletic trainers already see in the app.',
      caption:
        'OSSAA WBGT activity guidelines for Oklahoma high school practice: five bands for Region 3, from under 82.0 to over 92.1, and Region 2, from under 79.7 to over 89.8, with practice-length, rest-break and football-equipment rules',
      columns: ['Region 3', 'Region 2', 'Activity limit', 'Rest breaks', 'Football equipment'],
      bands: [
        {
          range: 'Under 82.0',
          range2: 'Under 79.7',
          activity: 'Normal activities',
          rest: 'At least 3 separate breaks each hour, minimum 3 min each',
          equipment: 'None listed',
          tone: 'clear',
          mutedEquipment: true,
        },
        {
          range: '82.0 – 86.9',
          range2: '79.7 – 84.6',
          activity: 'Use discretion for intense prolonged exercise',
          rest: 'At least 3 separate breaks each hour, minimum 4 min each',
          equipment: 'None listed',
          tone: 'advisory',
          mutedEquipment: true,
        },
        {
          range: '87.0 – 90.0',
          range2: '84.7 – 87.6',
          activity: 'Maximum practice time 2 hours',
          rest: 'At least 4 separate breaks each hour, minimum 4 min each',
          equipment: 'Helmet, shoulder pads and shorts only',
          tone: 'watch',
        },
        {
          range: '90.1 – 92.0',
          range2: '87.7 – 89.7',
          activity: 'Maximum practice time 1 hour',
          rest: '20 minutes of breaks distributed through the hour',
          equipment: 'No protective equipment; no conditioning activities',
          tone: 'warning',
        },
        {
          range: 'Over 92.1',
          range2: 'Over 89.8',
          activity: 'No outdoor activity — delay activity until a cooler WBGT is reached',
          rest: '—',
          equipment: '—',
          tone: 'extreme',
          mutedRest: true,
          mutedEquipment: true,
        },
      ],
      note: 'Source: OSSAA Extreme Heat Policy, Wet Bulb Globe Temperature (WBGT) Policy (ossaa.com), checked 5 Oct 2026. Ranges as printed. If the WBGT rises into the third band during practice, football players may continue in football pants without changing into shorts. A rapid cooling zone is required at a WBGT of 82.0 or higher.',
    },
    flashFits: {
      heading: 'Where does Flash fit?',
      callout:
        "Flash is a forecast for planning, not an on-site meter: OSSAA compliance uses the reading your school takes before and during practice. Flash's WBGT forecast tells you at 1 pm what the 4 pm reading is likely to be, so you can move practice instead of cancelling it.",
      points: [
        {
          title: "Heat: plan, don't cancel",
          body: 'The outlook runs per field for every hour of the afternoon, against the OSSAA bands. Shift the start, swap the equipment plan or go indoors before the cars arrive.',
        },
        {
          title: 'Lightning: up to 60 minutes ahead',
          body: 'Strike-level prediction on a 1×1 km cell, refreshed every 2 minutes. Up to 99.6% lightning prediction accuracy on a one-hour window, measured against NLDN ground-truth strikes — method published.',
          link: { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
        },
        {
          title: 'Return to play: the all-clear timer',
          body: "After the last strike inside your radius, Flash runs your policy's all-clear timer and logs it, so play resumes on evidence.",
          link: { label: 'Weather Command Center', href: '/products/weather-command-center/' },
        },
      ],
      link: {
        label: 'Flash Heat and WBGT prediction',
        href: '/products/heat-wbgt/',
        note: 'WBGT forecast, heat index, air temperature and dew point per 1×1 km cell',
      },
    },
    planningDay: {
      heading: 'What does a planning day look like?',
      disclaimer: "Illustrative example · Not live weather — the readings are examples, the rules are OSSAA's (Region 3)",
      figure: {
        image: {
          src: '/images/heat-policies/flash-georgia-practice-field-heat-planning-day.png',
          alt: 'An empty high school practice field under a hazy hot sun with a shade canopy and water coolers on the sideline, the setting for an OSSAA WBGT planning day',
          width: 1376,
          height: 768,
        },
        badge: '6:15 pm · The reading that decides the day',
        overlay: 'The band you land in sets the clock, the breaks and the pads.',
      },
      steps: [
        {
          time: '1:00 pm',
          text: 'Flash WBGT forecast for the practice field: 85 by 3 pm, into 87.0–90.0 by 4 pm. The athletic director flags the football session.',
          tone: 'info',
        },
        {
          time: '1:15 pm',
          text: 'Decision: run at 4 pm under the 2-hour cap with four 4-minute breaks an hour, or push to 6:30 pm. The AD pushes. The bus, the trainers and the parents hear now, not at 3:45.',
          tone: 'info',
        },
        {
          time: '6:15 pm',
          text: 'On-site reading 15 minutes before practice: 84.1, the 82.0–86.9 band. Three 4-minute breaks per hour go on the plan, the cooling zone is set up and the reading goes on file.',
          tone: 'info',
        },
        {
          time: '7:10 pm',
          text: 'Flash lightning alert: a strike is predicted inside the site radius within the next 60 minutes. The field clears.',
          tone: 'warning',
        },
        {
          time: '8:22 pm',
          text: 'All clear after the all-clear timer runs out. Practice resumes; the alert log records who was warned, when, and when play returned.',
          tone: 'clear',
        },
      ],
    },
    documentation: {
      heading: 'What should the athletic director keep on file?',
      intro:
        'OSSAA requires schools to record and keep on file the WBGT readings for outside practices. Keep these together so a question from OSSAA, the district or a parent is answered from one folder.',
      items: [
        'WBGT readings with times: before practice and every 30 minutes during it.',
        'The band each reading fell in and the decision it triggered: practice length, rest breaks, football equipment.',
        "Each coach's NFHS heat illness course certificate for the year.",
        'The emergency action plan, including onsite cold-water immersion or equivalent.',
        'The Flash alert log: lightning alerts, who was notified, the all-clear, and the WBGT forecast the schedule decision was based on.',
      ],
    },
    sources: [
      {
        text: 'OSSAA — Extreme Heat Policy, Wet Bulb Globe Temperature (WBGT) Policy. Thresholds, reading cadence, records, cooling zones. Checked 5 Oct 2026.',
        href: 'https://ossaaillustrated.com/wp-content/uploads/2026/07/MF_2025-26_ExtremeHeatPolicy-1.pdf',
      },
      {
        text: 'OSSAA — 2026-27 Football Coaches Packet, heat policy and acclimatization. Checked 5 Oct 2026.',
        href: 'https://ossaaillustrated.com/wp-content/uploads/2026/07/FB_2026-27_CoachesPacketInfo.pdf',
      },
    ],
    faqs: [
      {
        question: 'Does Flash replace the WBGT instrument?',
        answer:
          "No. OSSAA compliance is decided by the reading your school takes before and during practice, and that reading is the one kept on file. Flash's WBGT forecast tells you where it is heading — a scheduling tool, not a compliance instrument.",
      },
      {
        question: 'Do we have to keep the readings?',
        answer:
          'Yes. OSSAA requires schools to record and keep on file the WBGT readings for outside practices, taken before and during practice.',
      },
      {
        question: 'Do the limits apply to games?',
        answer:
          'No. The practice limits do not apply to contests, but a rapid cooling zone is required at a WBGT of 82.0 or higher.',
      },
    ],
    rail: {
      eyebrow: 'For athletic directors',
      heading: 'Flash for Oklahoma schools',
      href: '/industries-we-serve/schools/',
      points: [
        'WBGT forecast for every field, so you move practice before the reading crosses into the 2-hour band.',
        'Lightning predicted up to 60 minutes ahead, with your all-clear timer built in.',
        'An alert log for the athletic director.',
      ],
      agent: {
        prompt: '"Move Thursday practice if WBGT tops 87."',
        reply: '88.1 forecast at 4 pm. Practice moved to 5:30 in Google Calendar; trainers notified.',
        action: 'Action · Google Calendar updated',
      },
      note: 'Software only. No sensor to buy — your WBGT device stays. Every agent action is logged and confirmed by a person first.',
      verifiedNote: 'Thresholds checked against the OSSAA Extreme Heat Policy (ossaa.com) on 5 Oct 2026.',
      contact: 'Spotted a change?',
    },
    outlook: {
      title: 'WBGT forecast · Field B',
      time: '12:58',
      threshold: 87,
      points: [
        { label: '1 pm', value: 84.2 },
        { label: '2 pm', value: 86.1 },
        { label: '3 pm', value: 87.6 },
        { label: '4 pm', value: 88.1 },
        { label: '5 pm', value: 86.4 },
        { label: '6 pm', value: 84.0 },
      ],
      peak: 3,
      chips: ['4 pm · 88.1 — in 87.0–90.0', 'Under 87.0 after 5:20'],
      caption: 'Move practice to 5:30 — the on-site reading stays the compliance record.',
      alt: 'Flash WBGT forecast for an Oklahoma high school practice field in Region 3, showing the 4 pm reading trending into the 87.0–90.0 band',
      disclaimer: 'Illustrative example · Not live weather',
    },
  },
];

export function getHeatPolicy(slug: string): HeatPolicy | undefined {
  return heatPolicies.find((policy) => policy.slug === slug);
}

/** The pages that are live: listed on the index, in the sitemap, linked. */
export const publishedHeatPolicies = heatPolicies.filter((policy) => !policy.draft);

export const HEAT_POLICIES_PATH = '/resources/state-heat-policies/';

export function heatPolicyPath(slug: string): string {
  return `${HEAT_POLICIES_PATH}${slug}/`;
}

/**
 * "Which other states publish WBGT policies?", the same on every state page:
 * the other published states as links, then states with no live page as
 * plain labels, never dead links (a draft is one of those).
 */
export const otherStatesSection = {
  heading: 'Which other states publish WBGT policies?',
  intro:
    'Every state page follows this template: verified thresholds, the reading cadence, what to keep on file, and where the WBGT forecast fits.',
  figure: {
    image: {
      src: '/images/heat-policies/flash-wbgt-heat-outlook-state-policies.png',
      alt: "Heat haze over an open field at midday, the conditions each state association's WBGT policy sets practice limits for",
      width: 1376,
      height: 768,
    },
    badge: 'State by state',
    overlay: 'Same instrument, different bands — the WBGT forecast travels with you.',
  },
};

/** States with no page yet, shown as labels after the live ones. */
const UPCOMING_STATES = ['Arkansas (AAA)', 'New Jersey (NJSIAA)', 'North Carolina (NCHSAA)'];

export function otherStates(slug: string): { label: string; href?: string }[] {
  const others = heatPolicies.filter((policy) => policy.slug !== slug);
  return [
    ...others
      .filter((policy) => !policy.draft)
      .map((policy) => ({ label: `${policy.state} (${policy.association})`, href: heatPolicyPath(policy.slug) })),
    ...others.filter((policy) => policy.draft).map((policy) => ({ label: `${policy.state} (${policy.association})` })),
    ...UPCOMING_STATES.map((label) => ({ label })),
  ];
}

// The header's Resources menu (content/navigation.ts) is hand-written so the
// client bundle does not carry this file; its heat-policy column must be the
// index, then every published state page by its state's name, in this order.
{
  const group = resourcesMenu.columns.flatMap((column) => column.groups).find((g) => g.label === 'Heat policies');
  const expected = [
    `State heat policies ${HEAT_POLICIES_PATH}`,
    ...publishedHeatPolicies.map((policy) => `${policy.state} ${heatPolicyPath(policy.slug)}`),
  ];
  const listed = group?.links.map((link) => `${link.label} ${link.href}`) ?? [];
  if (expected.join('|') !== listed.join('|'))
    throw new Error(`The Resources menu's heat policies must be: ${expected.join(', ')}`);
}
