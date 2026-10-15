'use client';

import { useEffect, useRef } from 'react';

import { onReveal, startsBelowFold } from '@/lib/reveal';

import type { comparison } from '@/content/why-flash-hub';

/** The row sequence ends about 3.2s in; the list is released after it. */
const LIST_MS = 3400;
const CARD_MS = 1500;

/**
 * "Everyone else reacts. Flash knows." as pairs: each row is what everyone
 * else does beside what Flash does instead, still read as two columns.
 *
 * Once, as it scrolls in, everyone else's items fade in muted, then the Flash
 * items check in one by one, a thin connector briefly drawing across from each
 * one's pair, and the closing line fades in last. Hovering a row highlights
 * both items, draws the connector between them and dims the other rows.
 * Below 768px each pair is a mini card, everyone else above Flash, and each
 * card plays on its own (styles/why-flash-hub-compare.css).
 *
 * The markup is the finished list. The script holds it on the first frame
 * (`data-anim="idle"`), runs it on sight and then removes the attribute, so
 * without JavaScript or with reduced motion every item is simply there.
 */
export function ReactsPredicts({ labels, pairs, tagline }: Pick<typeof comparison, 'labels' | 'pairs' | 'tagline'>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = [...root.querySelectorAll<HTMLElement>('[data-rp-card]')];
    const blocks = [root, ...cards];
    const timers: number[] = [];
    // CSS picks the driver by width: the list's own state from 768px, each
    // card's below. Both are set, so a resize needs no script. A block waits
    // (`idle`) only while it is below the fold; the shared fail-safe trigger
    // (lib/reveal.ts) runs it as it comes into view, or shows it at once if a
    // fast scroll or a jump got there first.
    const stops = blocks.map((block) => {
      const ms = block === root ? LIST_MS : CARD_MS;
      if (startsBelowFold(block)) block.dataset.anim = 'idle';
      return onReveal(block, {
        enter: () => {
          block.dataset.anim = 'run';
          timers.push(window.setTimeout(() => delete block.dataset.anim, ms));
        },
        settle: () => delete block.dataset.anim,
      });
    });

    return () => {
      stops.forEach((stop) => stop());
      timers.forEach(clearTimeout);
      for (const block of blocks) delete block.dataset.anim;
    };
  }, []);

  return (
    <div ref={ref} className="rp">
      <div className="rp-board">
        <div aria-hidden className="rp-panel rp-panel-others" />
        <div aria-hidden className="rp-panel rp-panel-flash why-flash-hub-win-card" />
        {/* Column heads for the eye; each item carries its own label for assistive tech and phones. */}
        <div aria-hidden className="rp-heads">
          <span className="rp-head text-micro font-bold tracking-label-wide text-text-on-dark-muted uppercase">
            {labels.others}
          </span>
          <span className="rp-head font-logo text-caption font-bold tracking-label-wide text-viz-gold uppercase">
            {labels.flash}
          </span>
        </div>
        <ul aria-label={`${labels.others} compared with ${labels.flash}`} className="rp-list">
          {pairs.map((pair) => (
            <li key={pair.flash} data-rp-card className="rp-pair">
              <div className="rp-cell rp-others">
                <span className="rp-label text-[11px] leading-4 font-bold tracking-label-wide text-text-on-dark-muted uppercase">
                  {labels.others}
                </span>
                <span className="rp-item">
                  <span aria-hidden className="rp-mark">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4.5 4.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="rp-text">{pair.others}</span>
                </span>
              </div>
              <span aria-hidden className="rp-link" />
              <div className="rp-cell rp-flash">
                <span className="rp-label font-logo text-[11px] leading-4 font-bold tracking-label-wide text-viz-gold uppercase">
                  {labels.flash}
                </span>
                <span className="rp-item">
                  <span aria-hidden className="rp-mark">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        className="rp-check"
                        pathLength={1}
                        d="M3 8.5l3.25 3.25L13 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="rp-text">{pair.flash}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p data-rp-card className="rp-tagline text-body-l font-semibold text-text-on-dark">
        {tagline}
      </p>
    </div>
  );
}
