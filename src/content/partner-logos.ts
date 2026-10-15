/**
 * The partner logos in "What each partner does with Flash" (components/press/
 * partner-list.tsx), keyed by the partner's name in content/press.ts. Files
 * are public/partners/<slug>.<ext>; width and height are the file's own, so
 * the box can be laid out before the file loads. The PNGs are the trimmed
 * marks the home page slider already uses (public/logos/customers); the
 * BuildTree mark is the SVG symbol mybuildtree.com ships, path data verbatim.
 * Where they came from: industries-audit/partner-logo-sources.md.
 *
 * A partner with no entry here renders as its name only, no placeholder.
 */
export type PartnerLogo = {
  file: string;
  width: number;
  height: number;
  /** Optical trim: the logo's share of its box, 1 by default. Wide, solid wordmarks come down a little so they weigh the same as a crest at full height. */
  scale?: number;
};

export const partnerLogos: Record<string, PartnerLogo> = {
  Troon: { file: 'troon.png', width: 351, height: 97, scale: 0.86 },
  'Big 12 Conference': { file: 'big-12-conference.png', width: 318, height: 192 },
  Syngenta: { file: 'syngenta.png', width: 360, height: 101, scale: 0.86 },
  NAIA: { file: 'naia.png', width: 324, height: 192 },
  'McClatchy Media': { file: 'mcclatchy-media.png', width: 360, height: 51 },
  'Golf Genius': { file: 'golf-genius.png', width: 360, height: 61, scale: 0.94 },
  "Annika Women's All Pro Tour": { file: 'annika-womens-all-pro-tour.png', width: 326, height: 106 },
  'Turf Assistant': { file: 'turf-assistant.png', width: 360, height: 128 },
  BuildTree: { file: 'buildtree.svg', width: 438, height: 477 },
};
