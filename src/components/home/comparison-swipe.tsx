'use client';

import { useEffect, useRef } from 'react';

/** How long each card stays: its diagrams (~1.9s, styles/why-flash.css), then ~2s to read. */
const DWELL_MS = 4500;
/** The slide from one card to the next. */
const SLIDE_MS = 500;
/** After a touch, a swipe, an arrow or a dot, the row waits this long before playing on. */
const IDLE_MS = 6000;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * The comparison as a row of cards that plays on its own, below md only
 * (styles/home-comparison-swipe.css). The markup arrives as the table and a
 * row of controls; the cards are the table's rows in a scroll-snap row
 * (`[data-cmp-track]`), which swipes with no JavaScript at all.
 *
 * Once half the row is in view, each card stays for DWELL_MS, then slides to
 * the next in SLIDE_MS (scripted, so the duration and easing are ours; snap
 * is off while it runs), and after the last it goes back to the first. The
 * active dot fills over the dwell: that fill is the timer, a Web Animation
 * whose end moves the row on, so pausing it pauses both. A card's diagrams
 * replay each time it becomes the active one.
 *
 * It pauses while the row is less than half in view or the tab is hidden,
 * and for IDLE_MS after any touch, swipe, arrow, dot or keyboard focus, then
 * plays on from the card it is on. The `[data-cmp-toggle]` button pauses it
 * until pressed again. The status line is silent while it plays. With
 * reduced motion it never plays (no toggle, no fill) and arrows and dots
 * jump.
 */
export function ComparisonSwipe({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const track = root?.querySelector<HTMLElement>('[data-cmp-track]');
    if (!root || !track) return;
    const cards = [...track.children] as HTMLElement[];
    const dots = [...root.querySelectorAll<HTMLElement>('[data-cmp-dot]')];
    const prev = root.querySelector<HTMLElement>('[data-cmp-prev]');
    const next = root.querySelector<HTMLElement>('[data-cmp-next]');
    const toggle = root.querySelector<HTMLElement>('[data-cmp-toggle]');
    const status = root.querySelector<HTMLElement>('[data-cmp-status]');
    const phone = window.matchMedia('(width < 48rem)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    /** How far the row has scrolled when card `i` is the one shown. */
    const offset = (i: number) => cards[i].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;

    // The slide.
    let slideFrame = 0;
    const stopSlide = () => {
      if (!slideFrame) return;
      cancelAnimationFrame(slideFrame);
      slideFrame = 0;
      track.removeAttribute('data-sliding');
    };
    const slideTo = (to: number) => {
      stopSlide();
      const from = track.scrollLeft;
      const target = offset(to);
      if (reduced.matches) {
        track.scrollLeft = target;
        return;
      }
      track.setAttribute('data-sliding', '');
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / SLIDE_MS);
        track.scrollLeft = from + (target - from) * easeInOut(t);
        if (t < 1) {
          slideFrame = requestAnimationFrame(step);
          return;
        }
        slideFrame = 0;
        track.removeAttribute('data-sliding');
        sync();
      };
      slideFrame = requestAnimationFrame(step);
    };

    // The dwell: the active dot's fill, whose end moves the row on.
    let index = -1;
    let dwell: Animation | undefined;
    const startDwell = () => {
      dwell?.cancel();
      const fill = dots[index]?.querySelector<HTMLElement>('.cmpc-dot-fill');
      if (!fill) return;
      dwell = fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
        duration: DWELL_MS,
        easing: 'linear',
        fill: 'both',
      });
      dwell.onfinish = () => {
        if (playing()) slideTo((index + 1) % cards.length);
      };
    };

    // When it plays.
    let inView = false;
    let userPaused = false;
    let interacting = false;
    let idleTimer = 0;
    let wasPlaying = false;
    const auto = () => phone.matches && !reduced.matches;
    const playing = () => auto() && inView && !document.hidden && !userPaused && !interacting;
    const update = () => {
      const now = playing();
      root.toggleAttribute('data-auto', auto());
      root.toggleAttribute('data-paused', userPaused);
      toggle?.setAttribute('aria-label', userPaused ? 'Play the comparisons' : 'Pause the comparisons');
      status?.setAttribute('aria-live', now ? 'off' : 'polite');
      // Playing again: a fresh dwell on the card it is on.
      if (now && !wasPlaying) startDwell();
      if (!now && wasPlaying) {
        dwell?.pause();
        stopSlide();
      }
      wasPlaying = now;
    };
    const interact = () => {
      interacting = true;
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        interacting = false;
        update();
      }, IDLE_MS);
      update();
    };

    /**
     * Replays a card's diagrams when it comes back. A card's first play is
     * <Motion>'s, as it slides into view; replaying that at the slide's end
     * would restart it mid-draw.
     */
    const visited = new Set<HTMLElement>();
    const replay = (card: HTMLElement) => {
      const back = visited.has(card);
      visited.add(card);
      if (!back || reduced.matches || card.dataset.anim !== 'run') return;
      card.dataset.delay = '0';
      card.dataset.anim = 'reset';
      void card.getBoundingClientRect(); // commit the reset so the animations restart
      card.dataset.anim = 'run';
    };

    /** Where the row has come to rest: the dots, the arrows, the status line, the dwell. */
    const sync = () => {
      const at = track.scrollLeft;
      const nearest = cards.reduce((best, _, i) => (Math.abs(offset(i) - at) < Math.abs(offset(best) - at) ? i : best), 0);
      if (nearest === index) return;
      const first = index === -1;
      // Not on the first pass: the status line only speaks once the row has moved.
      if (!first && status) status.textContent = `Comparison ${nearest + 1} of ${cards.length}`;
      index = nearest;
      dots.forEach((dot, i) => {
        dot.toggleAttribute('data-on', i === index);
        if (i === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      prev?.setAttribute('aria-disabled', String(index === 0));
      next?.setAttribute('aria-disabled', String(index === cards.length - 1));
      if (first) visited.add(cards[index]);
      else replay(cards[index]);
      dwell?.cancel();
      dwell = undefined;
      if (playing()) startDwell();
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (toggle?.contains(target)) {
        userPaused = !userPaused;
        if (!userPaused) {
          interacting = false;
          clearTimeout(idleTimer);
        }
        update();
        return;
      }
      const button = target.closest('button');
      const dot = target.closest<HTMLElement>('[data-cmp-dot]');
      const by = button === prev ? -1 : button === next ? 1 : 0;
      if (!dot && !by) return;
      interact();
      const to = dot ? dots.indexOf(dot) : Math.min(cards.length - 1, Math.max(0, index + by));
      slideTo(to);
    };

    let frame = 0;
    const onScroll = () => {
      // Mid-slide, the row settles once the slide ends.
      if (slideFrame) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    const onInteract = () => {
      stopSlide();
      interact();
    };
    const onFocus = (event: FocusEvent) => {
      if (!toggle?.contains(event.target as Node)) interact();
    };

    const seen = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio >= 0.5;
        update();
      },
      { threshold: [0, 0.5] },
    );

    sync();
    update();
    seen.observe(track);
    root.addEventListener('click', onClick);
    root.addEventListener('focusin', onFocus);
    track.addEventListener('touchstart', onInteract, { passive: true });
    track.addEventListener('pointerdown', onInteract, { passive: true });
    track.addEventListener('wheel', onInteract, { passive: true });
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    document.addEventListener('visibilitychange', update);
    phone.addEventListener('change', update);
    reduced.addEventListener('change', update);

    return () => {
      seen.disconnect();
      stopSlide();
      dwell?.cancel();
      clearTimeout(idleTimer);
      cancelAnimationFrame(frame);
      root.removeAttribute('data-auto');
      root.removeAttribute('data-paused');
      root.removeEventListener('click', onClick);
      root.removeEventListener('focusin', onFocus);
      track.removeEventListener('touchstart', onInteract);
      track.removeEventListener('pointerdown', onInteract);
      track.removeEventListener('wheel', onInteract);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('visibilitychange', update);
      phone.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
