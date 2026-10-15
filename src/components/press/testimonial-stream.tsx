'use client';

import { useEffect, useRef } from 'react';

import { onReveal, startsBelowFold } from '@/lib/reveal';

/**
 * The list the testimonial cards stack in. Each card sweeps in once as it
 * scrolls into view, from its own side (`data-side`), driven by the card's
 * `data-reveal` and the keyframes in styles/press-testimonials.css:
 *   idle  held off-screen-side and transparent, waiting
 *   run   sweeping in
 *   done  resting, no entrance
 *
 * Fail-safe, by the site's one reveal rule (lib/reveal.ts): the markup is
 * the final frame, so without JavaScript or with reduced motion every card
 * simply shows. Only a card below the fold is held, and only after
 * hydration; it plays as it comes into view, or shows at once if a fast
 * scroll or an anchor jump got there first, and any card on screen and still
 * waiting after a second is shown. Nothing replays on the way back up.
 */
export function TestimonialStream({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const stops = Array.from(list.querySelectorAll<HTMLElement>('.tq-card')).map((card) => {
      if (!startsBelowFold(card)) return () => {};
      card.dataset.reveal = 'idle';
      return onReveal(card, {
        enter: () => (card.dataset.reveal = 'run'),
        settle: () => (card.dataset.reveal = 'done'),
      });
    });

    return () => {
      stops.forEach((stop) => stop());
      list.querySelectorAll<HTMLElement>('.tq-card').forEach((card) => delete card.dataset.reveal);
    };
  }, []);

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}
