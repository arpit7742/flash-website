/**
 * The outlet logos in "More coverage, by beat" (components/press/beat-list.tsx),
 * keyed by the outlet name as content/press-links.ts prints it. Files are
 * public/press-logos/<slug>.<ext>, each trimmed to the visible logo (empty
 * transparent or white margins removed; nothing redrawn or recoloured);
 * width and height are the trimmed file's own (an SVG's viewBox), so the
 * shared <LogoBox> (components/press/logo-box.tsx) can lay out before the
 * file loads. Where each came from: industries-audit/press-logo-sources.md.
 *
 * `scale` is the optical trim the partner table also uses: a wide, solid
 * wordmark comes down a little so it weighs the same as a crest at full
 * height. `rounded` gives square cover art and marks their 4px corners.
 * GCM (Golf Course Management) is GCSAA's magazine and serves only a white
 * logo, so it carries its publisher's. An outlet with no entry has no usable
 * official artwork yet (industries-audit/pending-confirmation.md).
 */
export type PressLogo = { file: string; width: number; height: number; scale?: number; rounded?: boolean };

export const pressLogos: Record<string, PressLogo> = {
  'Insurance Innovation Reporter': { file: 'insurance-innovation-reporter.png', width: 293, height: 91 },
  'Roofing Contractor': { file: 'roofing-contractor.png', width: 2093, height: 543, scale: 0.9 },
  'Carrier Management': { file: 'carrier-management.png', width: 926, height: 334 },
  'Automotive Fleet': { file: 'automotive-fleet.svg', width: 371, height: 81 },
  Golfweek: { file: 'golfweek.svg', width: 766.5, height: 147.1, scale: 0.9 },
  'Yahoo Sports': { file: 'yahoo-sports.svg', width: 137, height: 20, scale: 0.9 },
  GCM: { file: 'gcsaa.png', width: 322, height: 79 },
  GCSAA: { file: 'gcsaa.png', width: 322, height: 79 },
  TurfNet: { file: 'turfnet.png', width: 142, height: 37, scale: 0.86 },
  'Meteorological Technology International': { file: 'meteorological-technology-international.png', width: 497, height: 204 },
  'Business Air News': { file: 'business-air-news.svg', width: 391.76, height: 64.06 },
  'Roofing Road Trips': { file: 'roofing-road-trips.png', width: 1200, height: 1200, rounded: true },
  'From the Ground Up': { file: 'from-the-ground-up.png', width: 1200, height: 591 },
  'Turf Today': { file: 'turf-today.jpg', width: 1200, height: 1200, rounded: true },
  'The ModGolf Podcast': { file: 'the-modgolf-podcast.jpg', width: 1400, height: 1400, rounded: true },
  'Viewpoint with Dennis Quaid': { file: 'viewpoint-with-dennis-quaid.png', width: 1920, height: 318 },
  OutdoorCoffeeShop: { file: 'outdoorcoffeeshop.png', width: 180, height: 125, rounded: true },
  RoofersCoffeeShop: { file: 'rooferscoffeeshop.png', width: 462, height: 104 },
  'Golf Inc. Strategies Summit': { file: 'golf-inc-strategies-summit.png', width: 1261, height: 414, scale: 0.9 },
  'Gulf States PGA': { file: 'gulf-states-pga.svg', width: 87.35, height: 81.1 },
  GlobeNewswire: { file: 'globenewswire.svg', width: 119.95, height: 39.25 },
  ABNewswire: { file: 'abnewswire.png', width: 268, height: 64 },
  'The Golf Wire': { file: 'the-golf-wire.png', width: 5384, height: 958 },
  'PR Newswire': { file: 'pr-newswire.png', width: 168, height: 20, scale: 0.9 },
  'QBE North America': { file: 'qbe.svg', width: 80.71, height: 74.71 },
};
