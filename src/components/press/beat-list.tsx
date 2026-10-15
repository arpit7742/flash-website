'use client';

import { useEffect, useRef, useState } from 'react';

import { LogoBox, type LogoFile } from '@/components/press/logo-box';
import { SiteLink } from '@/components/site-link';
import { onReveal, startsBelowFold } from '@/lib/reveal';

export type BeatLogo = Omit<LogoFile, 'alt'>;
export type BeatRow = {
  id: string;
  href: string;
  title: string;
  date: string;
  dateLabel: string;
  tag?: string;
  /** The outlet names in the row's label, each with its logo (content/press-logos.ts). */
  outlets: { name: string; logo?: BeatLogo }[];
};
export type Beat = { id: string; name: string; intro: string; rows: BeatRow[] };

/** How long the list takes to fade out, then in, when the filter changes. */
const FADE_MS = 200;

/**
 * "More coverage, by beat": the filter pills, then one row per beat with
 * its name and subtitle sticky in the left column and its items on the
 * right. Each item is one link to the piece: the outlet's logo in the same
 * left-aligned box the partner table uses (<LogoBox>), the title on one
 * line, its tag and the date in a fixed column.
 *
 * Filtering: "All" or one beat, as buttons with aria-pressed; the list fades
 * out and in over 200ms (no fade with reduced motion) and the section
 * shrinks to the beats shown.
 *
 * Scroll motion, once per beat, on the site's fail-safe reveal (lib/reveal):
 * the markup is final by default; after hydration a beat still below the
 * fold has its items held (`data-reveal="wait"`), then they enter one after
 * another (`"in"`, styles/press.css) once 10% of the beat is in view, or
 * simply show (`"done"`) if reached late or still waiting after 1s. A beat
 * that has played is not held again when the filter brings it back. With
 * reduced motion nothing is held and nothing moves.
 */
export function BeatList({ beats }: { beats: Beat[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [shown, setShown] = useState<string>('all');
  const [fading, setFading] = useState(false);
  const total = beats.reduce((n, beat) => n + beat.rows.length, 0);
  const visible = shown === 'all' ? beats : beats.filter((beat) => beat.id === shown);

  const pick = (id: string) => {
    if (id === filter) return;
    setFilter(id);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(id);
      return;
    }
    setFading(true);
    window.setTimeout(() => {
      setShown(id);
      setFading(false);
    }, FADE_MS);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div role="group" aria-label="Filter coverage by beat" className="press-filters -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        <FilterPill id="all" label="All" count={total} selected={filter === 'all'} onPick={pick} />
        {beats.map((beat) => (
          <FilterPill key={beat.id} id={beat.id} label={beat.name} count={beat.rows.length} selected={filter === beat.id} onPick={pick} />
        ))}
      </div>

      <div className="press-beats flex flex-col gap-6 md:gap-8" data-fading={fading || undefined} aria-live="polite">
        {visible.map((beat) => (
          <BeatBlock key={beat.id} beat={beat} />
        ))}
      </div>
    </div>
  );
}

function FilterPill({ id, label, count, selected, onPick }: { id: string; label: string; count: number; selected: boolean; onPick: (id: string) => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onPick(id)}
      className={`press-filter inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-caption leading-5 font-semibold whitespace-nowrap ${
        selected ? 'border-brand-navy bg-brand-navy text-text-on-dark' : 'border-border bg-neutral-0 text-text'
      }`}
    >
      {label}
      <span className={selected ? 'text-text-on-dark-muted' : 'text-text-muted'}>{count}</span>
    </button>
  );
}

/** Beats that have already played their entrance, so a filter change does not replay them. */
const played = new Set<string>();

function BeatBlock({ beat }: { beat: Beat }) {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const block = ref.current;
    const list = listRef.current;
    if (!block || !list || played.has(beat.id)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!startsBelowFold(block)) {
      played.add(beat.id);
      return;
    }
    list.dataset.reveal = 'wait';
    return onReveal(block, {
      enter: () => {
        list.dataset.reveal = 'in';
        played.add(beat.id);
      },
      settle: () => {
        list.dataset.reveal = 'done';
        played.add(beat.id);
      },
    });
  }, [beat.id]);

  return (
    <div ref={ref} id={`coverage-group-${beat.id}`} className="press-beat grid scroll-mt-24 gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
      <div className="press-beat-head md:sticky md:top-24 md:self-start">
        <h4 className="text-h4 leading-h4 font-bold tracking-heading text-text">{beat.name}</h4>
        <p className="mt-1 text-body-s leading-5 text-text-muted">{beat.intro}</p>
      </div>
      <ul ref={listRef} className="press-beat-items flex flex-col gap-2.5">
        {beat.rows.map((row, i) => (
          <li key={row.id} id={`coverage-${row.id}`} className="press-beat-item scroll-mt-24" style={{ '--i': i } as React.CSSProperties}>
            <SiteLink
              href={row.href}
              title={row.title}
              aria-label={`${row.title}, ${row.outlets.map((o) => o.name).join(' · ')}, ${row.dateLabel}`}
              className="press-row"
            >
              <span className="press-row-logo" aria-hidden>
                <Logos outlets={row.outlets} />
              </span>
              <span className="press-row-title">{row.title}</span>
              <span className="press-row-meta">
                {row.tag && <span className="press-row-tag">{row.tag}</span>}
                <time dateTime={row.date} className="press-row-date">
                  {row.dateLabel}
                </time>
              </span>
            </SiteLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The row's logo box: the outlet's logo, or two outlets side by side in one
 * box (Golfweek · Yahoo Sports). Two outlets that share one file (GCM
 * carries GCSAA's) show it once. An outlet with no file yet shows nothing:
 * industries-audit/pending-confirmation.md lists it.
 */
function Logos({ outlets }: { outlets: BeatRow['outlets'] }) {
  const seen = new Set<string>();
  const logos = outlets.filter((o) => o.logo && !seen.has(o.logo.src) && seen.add(o.logo.src));
  if (logos.length === 0) return <span className="press-row-logo-empty" />;
  if (logos.length === 1) {
    const [o] = logos;
    return <LogoBox size="press" logo={{ ...o.logo!, alt: `${o.name} logo` }} />;
  }
  return (
    <span className="press-row-pair">
      {logos.map((o) => (
        <LogoBox key={o.name} size="press" logo={{ ...o.logo!, alt: `${o.name} logo` }} className="press-row-pair-box" />
      ))}
    </span>
  );
}
