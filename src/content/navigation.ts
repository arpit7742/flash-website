/**
 * The global nav and footer, as data.
 *
 * Every href here is a real, built route -- the audit this redesign answers
 * found dead /features and /pricing links, so nothing points at a page that
 * does not exist. Paths are the live site's, so existing rankings carry over.
 */

import { site } from '@/lib/seo/site';

export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; href: string; links: NavLink[] };

/**
 * The five mega menus (components/site-header-mega.tsx): Products,
 * Industries, Why Flash, Resources and Company, one family -- the same panel,
 * behaviour, columns, featured card and closing row. Hand-written rather
 * than read from the content files, because the header is a client
 * component and those files would ship whole to every page; coverage is
 * checked against them instead (the ends of industries.ts, products.ts,
 * heat-policies.ts and blog.ts), so a page missing from a menu, or a menu
 * link to a page that is gone, fails the build.
 *
 * Industry columns are the Industries hub's sectors, in its order; product
 * columns are the Products page's layers. `line` is the one-line descriptor,
 * drawn from the page's own intro; the menus list links only and do not show it.
 */
export type MegaLink = NavLink & { line?: string };
export type MegaColumn = { groups: { label: string; links: MegaLink[] }[] };
/**
 * The card on the right of a menu (from 1280px): a 16:9 picture, or a
 * `figure` tile in its place (a large figure with a small line under it),
 * then an eyebrow, a title and a call to action. The whole card is one link.
 */
export type MegaFeature = {
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
  image?: { src: string; alt: string };
  figure?: { value: string; prefix?: string; caption: string };
  /**
   * A sales address in place of the picture, in a compact menu: one card
   * with the address (a mailto link), the caption and the call to action
   * (to `href`). The card shows no title.
   */
  contact?: { email: string; caption: string };
};
export type MegaMenu = {
  id: 'products' | 'industries' | 'why-flash' | 'resources' | 'company';
  label: string;
  /**
   * The menu's closing link, left of "Book a demo": its hub ("All …"), or the
   * nearest thing to one. A menu without one has no closing row.
   */
  all?: NavLink;
  columns: MegaColumn[];
  feature: MegaFeature;
  /**
   * A menu with only a few links: a panel the width of its content, under
   * its own trigger, instead of the bar's width. `start` lines its left edge
   * up with the trigger's, `end` its right edge; either way it moves over
   * to stay inside the bar. The card shows at every width, and the closing
   * row has no "Book a demo" (the header's own button is beside it).
   */
  compact?: 'start' | 'end';
};

const industry = (label: string, slug: string, line: string): MegaLink => ({
  label,
  href: `/industries-we-serve/${slug}/`,
  line,
});

export const industriesMenu: MegaMenu & { all: NavLink } = {
  id: 'industries',
  label: 'Industries',
  all: { label: 'All industries', href: '/industries-we-serve/' },
  columns: [
    {
      groups: [
        {
          label: 'Fields & venues',
          links: [
            industry('Schools', 'schools', 'Lightning and heat risk for recess and sports'),
            industry('Outdoor Sports', 'outdoor-sports', 'Lightning alerts during games and practices'),
            industry('Parks & Rec', 'parks-rec', 'Lightning risk tracked across your parks'),
            industry('Events & Venues', 'events-venues', 'Delay, pause or continue events with confidence'),
          ],
        },
      ],
    },
    {
      groups: [
        {
          label: 'Sites & crews',
          links: [
            industry('Construction', 'construction', 'Lightning, wind and heat risk for crews'),
            industry('Concrete', 'concrete', 'Plan pours around temperature and rain'),
            industry('Roofing', 'roofing', 'Lightning and wind risk for roof crews'),
            industry('Utilities', 'utilities', 'Stage crews ahead of storms'),
            industry('Municipalities', 'municipalities', 'City-wide conditions, tracked in real time'),
          ],
        },
      ],
    },
    {
      groups: [
        {
          label: 'Land, turf & risk',
          links: [
            industry('Agriculture', 'agriculture', 'Rainfall, temperature swings and lightning risk'),
            industry('Turf Agronomy', 'turf-agronomy', 'Irrigation, heat stress and playability'),
            industry('Golf', 'golf', 'Delay or resume play with confidence'),
            industry('Insurance', 'insurance', 'Confirm whether hail fell at an address'),
          ],
        },
      ],
    },
  ],
  feature: {
    eyebrow: 'Case study · Troon',
    title: 'Approved vendor across 700+ golf properties',
    cta: 'Read the case study',
    href: '/case-studies/troon/',
    image: {
      src: '/images/case-studies/troon-golf-fairway-dusk-storm-cell-horizon.jpg',
      alt: 'A golf fairway at dusk with a storm cell building on the horizon',
    },
  },
};

export const productsMenu: MegaMenu & { all: NavLink } = {
  id: 'products',
  label: 'Products',
  all: { label: 'All products', href: '/products/' },
  columns: [
    {
      groups: [
        {
          label: 'Predictions',
          links: [
            {
              label: 'Lightning Prediction',
              href: '/products/lightning-prediction/',
              line: 'FirstStrike, up to 60 minutes in advance',
            },
            {
              label: 'Hail Prediction',
              href: '/products/hail-prediction/',
              line: 'Predictive Hail: size and location, up to 55 minutes',
            },
            { label: 'Heat & WBGT', href: '/products/heat-wbgt/', line: 'WBGT and heat risk, to adjust schedules' },
            {
              label: 'Flash Edge Model',
              href: '/products/flash-edge-model/',
              line: 'Best, most likely and worst case, 100+ parameters',
            },
            {
              label: 'Agronomy Suite',
              href: '/products/agronomy-suite/',
              line: '20+ site-specific metrics and frost forecasts',
            },
          ],
        },
      ],
    },
    {
      groups: [
        {
          label: 'Delivery',
          links: [
            {
              label: 'Weather Command Center',
              href: '/products/weather-command-center/',
              line: 'One platform, every weather risk',
            },
            { label: 'Mobile App', href: '/products/mobile-app/', line: '18-hour future radar in your pocket' },
            { label: 'Flash API', href: '/products/api-offerings/', line: '100+ weather parameters, tiered access' },
            {
              label: 'Flash Weather Shield',
              href: '/products/flash-weather-shield/',
              line: 'Predictive sirens, solar and cellular',
            },
          ],
        },
      ],
    },
    {
      groups: [
        {
          label: 'Intelligence',
          // Pending confirmation from Flash (industries-audit/pending-confirmation.md, item 1): removed before
          // launch unless Flash confirms it is live. No source describes it, so its line claims nothing.
          links: [
            {
              label: 'Flash Agent · Sky',
              href: '/products/flash-agent/',
              line: 'Weather questions, answered in plain language',
            },
          ],
        },
      ],
    },
    {
      groups: [
        {
          label: 'Services',
          links: [
            {
              label: 'Consulting Meteorology',
              href: '/products/consulting-meteorology/',
              line: 'A meteorologist for your highest-stakes days',
            },
          ],
        },
      ],
    },
  ],
  feature: {
    eyebrow: 'Product overview · 1:26',
    title: 'Watch Flash in 90 seconds',
    cta: 'Watch the overview',
    href: '/why-flash/',
    image: {
      src: '/video/flash-product-overview-poster.webp',
      alt: 'A Flash Weather presenter in front of the Flash logo and a U.S. forecast map',
    },
  },
};

export const whyFlashMenu: MegaMenu = {
  id: 'why-flash',
  label: 'Why Flash',
  all: { label: 'Why Flash overview', href: '/why-flash/' },
  columns: [
    {
      groups: [
        {
          label: 'The case',
          links: [
            { label: 'The Flash difference', href: '/why-flash/' },
            { label: 'Everyone else vs Flash', href: '/why-flash/everyone-else-vs-flash/' },
            { label: 'Prediction vs sensors vs detection', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
          ],
        },
      ],
    },
    {
      groups: [
        {
          label: 'Proof',
          links: [
            { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
            { label: 'Case study: Troon', href: '/case-studies/troon/' },
          ],
        },
      ],
    },
  ],
  feature: {
    eyebrow: 'Accuracy method',
    title: 'Up to 99.6% accuracy',
    cta: 'See how it’s measured',
    href: '/why-flash/accuracy-method/',
    // The audited qualifier (content/home.ts): lightning, on the one-hour window.
    figure: { prefix: 'Up to', value: '99.6%', caption: 'Lightning prediction accuracy on the one-hour window' },
  },
};

/**
 * The state pages listed are the published ones (`publishedHeatPolicies`),
 * in the hub's order; the featured post is the newest post that may sit
 * beside a sales link (not a `noPromotion` tribute). Both are checked at the
 * ends of heat-policies.ts and blog.ts.
 */
export const resourcesMenu: MegaMenu = {
  id: 'resources',
  label: 'Resources',
  compact: 'start',
  all: { label: 'All resources', href: '/resources/' },
  columns: [
    {
      groups: [
        {
          label: 'Learn',
          links: [
            { label: 'Blog', href: '/resources/blog/' },
            { label: 'FAQ', href: '/resources/frequently-asked-questions/' },
          ],
        },
      ],
    },
    {
      groups: [
        {
          label: 'Heat policies',
          links: [
            { label: 'State heat policies', href: '/resources/state-heat-policies/' },
            { label: 'Georgia', href: '/resources/state-heat-policies/georgia/' },
            { label: 'Texas', href: '/resources/state-heat-policies/texas/' },
            { label: 'Florida', href: '/resources/state-heat-policies/florida/' },
          ],
        },
      ],
    },
  ],
  feature: {
    eyebrow: 'Latest post',
    title: 'Midwest storm deaths, an Ohio near miss',
    cta: 'Read the post',
    href: '/resources/blog/blog-violent-week-midwest-storms-ohio-lightning/',
    image: {
      src: '/images/blog/posts/midwest-storm-downed-tree-on-house.jpg',
      alt: 'A large tree brought down by a severe storm lying across the roof and garage of a house',
    },
  },
};

export const companyMenu: MegaMenu = {
  id: 'company',
  label: 'Company',
  compact: 'end',
  columns: [
    {
      groups: [
        {
          label: 'Company',
          links: [
            { label: 'About us', href: '/about-us/' },
            { label: 'Press & partners', href: '/press-and-partners/' },
            { label: 'Contact', href: '/contact/' },
          ],
        },
      ],
    },
  ],
  feature: {
    eyebrow: 'Sales',
    title: 'Talk to our team',
    cta: 'Contact us',
    href: '/contact/',
    // The caption is the contact page's own promise (app/contact/page.tsx).
    contact: { email: site.salesEmail, caption: 'We reply within one business day' },
  },
};

/**
 * The desktop nav and the mobile menu, in order: five mega menus, with
 * Pricing a plain link between Why Flash and Resources.
 */
export type NavItem = { kind: 'mega'; menu: MegaMenu } | { kind: 'link'; link: NavLink };
export const navItems: NavItem[] = [
  { kind: 'mega', menu: productsMenu },
  { kind: 'mega', menu: industriesMenu },
  { kind: 'mega', menu: whyFlashMenu },
  { kind: 'link', link: { label: 'Pricing', href: '/pricing/' } },
  { kind: 'mega', menu: resourcesMenu },
  { kind: 'mega', menu: companyMenu },
];
export const megaMenus: MegaMenu[] = navItems.flatMap((item) => (item.kind === 'mega' ? [item.menu] : []));

/** Every link a mega menu lists, then its hub (if it has one): what the footer's two columns show. */
export function megaLinks(menu: MegaMenu): NavLink[] {
  return [
    ...menu.columns.flatMap((column) =>
      column.groups.flatMap((group) => group.links.map(({ label, href }) => ({ label, href }))),
    ),
    ...(menu.all ? [menu.all] : []),
  ];
}

export const footerNav: NavGroup[] = [
  { label: 'Products', href: productsMenu.all.href, links: megaLinks(productsMenu) },
  { label: 'Industries', href: industriesMenu.all.href, links: megaLinks(industriesMenu) },
  {
    label: 'Why Flash',
    href: '/why-flash/',
    links: [
      { label: 'The Flash difference', href: '/why-flash/' },
      { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
      { label: 'Prediction vs sensors vs detection', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
      { label: 'Everyone else vs Flash', href: '/why-flash/everyone-else-vs-flash/' },
      { label: 'Case studies', href: '/case-studies/troon/' },
      { label: 'Pricing', href: '/pricing/' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources/',
    links: [
      { label: 'Blog', href: '/resources/blog/' },
      { label: 'State heat policies', href: '/resources/state-heat-policies/' },
      { label: 'FAQ', href: '/resources/frequently-asked-questions/' },
      { label: 'About us', href: '/about-us/' },
      { label: 'Press & partners', href: '/press-and-partners/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

/** The footer's bottom row. Live-site URLs, unchanged. */
export const legalNav: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Legal information', href: '/flash-weather-ai-legal-information/' },
];

/** Where every "Book a demo" button goes. */
export const DEMO_HREF = '/contact/';
