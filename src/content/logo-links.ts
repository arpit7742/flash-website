/**
 * Where each organization's logo links, site-wide: one entry per press outlet,
 * partner and customer, read by <OrgLogoLink> (components/org-logo-link.tsx).
 * Every logo on the site goes through that component, so a link is set here
 * once and is the same everywhere.
 *
 * The rules (October 2026 logo-link pass):
 * - A press outlet links to its own article about Flash. Its entry here is
 *   its most recent one, taken from the audited record in content/
 *   press-links.ts, never retyped. A logo tied to one story (a coverage row)
 *   links to that story instead and does not read this file.
 * - A partner or customer links to its own announcement, post, release or
 *   partner page about Flash: on its own site, or on the official wire for a
 *   press release.
 * - Every URL was loaded and read on the day and mentions Flash. None is a
 *   homepage and none is guessed. An organization with no such page is
 *   `null`: its logo shows unlinked, and the pages checked are listed in
 *   industries-audit/pending-confirmation.md.
 *
 * Keys are the organization's name as the site prints it. Lookup ignores
 * case, so "ANNIKA Women's All Pro Tour" (home slider) and "Annika Women's
 * All Pro Tour" (partner table) are one entry.
 */

import { pressLinks, type PressLinkId } from './press-links';

export type LogoLink = {
  /** The organization, as the aria-label names it. */
  name: string;
  url: string;
  /** The linked page's own title, for the aria-label. */
  pageTitle: string;
};

/** A press outlet's article, from the audited record; `outlet` picks one outlet's version of a shared story. */
function article(name: string, id: PressLinkId, outlet?: string): LogoLink {
  const link = pressLinks[id];
  const versions: { name: string; href?: string }[] = 'outlets' in link ? link.outlets : [];
  const url = (outlet && versions.find((o) => o.name === outlet)?.href) || link.href;
  return { name, url, pageTitle: link.title };
}

/** A partner or customer page verified for this pass (not in the press record). */
function page(name: string, url: string, pageTitle: string): LogoLink {
  return { name, url, pageTitle };
}

const links: Record<string, LogoLink | null> = {
  // Press outlets: each one's most recent article about Flash.
  'Yahoo Sports': article('Yahoo Sports', 'yahooWin', 'Yahoo Sports'),
  'Aviation International News': article('Aviation International News', 'ain'),
  'Carrier Management': article('Carrier Management', 'carrierManagement'),
  'Automotive Fleet': article('Automotive Fleet', 'automotiveFleet'),
  'Roofing Contractor': article('Roofing Contractor', 'roofingContractor'),
  'Golf Course Industry': article('Golf Course Industry', 'golfCourseIndustry'),
  TurfNet: article('TurfNet', 'turfnet'),
  'Insurance Innovation Reporter': article('Insurance Innovation Reporter', 'iir'),

  // Partners and customers with a verified page about Flash.
  Troon: article('Troon', 'troonRelease'),
  NAIA: page('NAIA', pressLinks.naiaPartner.href, 'Flash Weather AI - NAIA'),
  'Golf Genius': page('Golf Genius', pressLinks.golfGeniusGuide.href, 'Flash Weather AI | Tournament Management Help Center'),
  'PGA of America, New England Section': page(
    'PGA of America, New England Section',
    'https://nepga.com/partners/',
    'Partners – New England',
  ),
  'PGA of America, Western New York Section': page(
    'PGA of America, Western New York Section',
    'https://westernnewyork.pga.com/wp-content/uploads/sites/16/2026/04/Flash-Weather-2026-WNYPGA-Press-Release.pdf',
    'Flash Weather - 2026 WNYPGA Press Release',
  ),
  'PGA of America, Northern Ohio Section': page(
    'PGA of America, Northern Ohio Section',
    'https://thenorthernohiopga.com/sponsors/',
    'Partners – Thenorthernohiopga',
  ),
  'PGA of America, Kentucky Section': page(
    'PGA of America, Kentucky Section',
    'https://kentuckypga.com/sponsors/',
    'Sponsors – Kentucky PGA',
  ),

  // No verified page about Flash on the organization's own site (or an
  // official wire): unlinked. What was checked is in
  // industries-audit/pending-confirmation.md.
  'Portland Sea Dogs': null,
  "ANNIKA Women's All Pro Tour": null,
  Syngenta: null,
  'K12 Sports Tech': null,
  'Big 12 Conference': null,
  'McClatchy Media': null,
  'PGA of America, Southern Ohio Section': null,
  'Kansas City Chiefs': null,
  'PGA of America, South Florida Section': null,
  'Turf Assistant': null,
  'NGCOA North Carolina': null,
  'Hanse Golf Course Design': null,
  'Club Caddie': null,
  'Invited Clubs': null,
  'Philadelphia Eagles': null,
  'Chicago Cubs': null,
  BuildTree: null,
};

const byKey = new Map(Object.entries(links).map(([name, link]) => [name.toLowerCase(), link]));

/** The organization's link, or null when no verified page exists (the logo stays unlinked). */
export function logoLinkFor(name: string): LogoLink | null {
  return byKey.get(name.toLowerCase()) ?? null;
}
