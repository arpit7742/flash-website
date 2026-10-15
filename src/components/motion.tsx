'use client';

import { useEffect, useRef } from 'react';

import { onReveal, startsBelowFold } from '@/lib/reveal';

/** How long a counted-up number takes; the diagrams run ~1-1.5s. */
const COUNT_MS = 1200;
/** Blocks that scroll in together stagger by at most this many steps, so an entrance stays short. */
const MAX_STAGGER = 3;

/**
 * Scroll-in, replay-on-hover motion for one block of SVG diagrams (a stats
 * card, a table row). The markup arrives finished, so without JavaScript or
 * with reduced motion the block simply shows its end state.
 *
 * The element's `data-anim` drives the keyframes in global CSS:
 *   idle   every animation held on its first frame, waiting to scroll in
 *   run    playing
 *   reset  no animation, for one reflow, so a hover can replay from zero
 * Blocks that scroll in together are staggered in document order: each gets
 * `data-delay` 0, 1, 2... which CSS turns into `--motion-delay` using the
 * block's own `--motion-stagger`. A hover replays with no delay.
 *
 * `count` names the finished text of a `[data-count]` element inside the
 * block, which then counts up from zero with the diagrams, or later by the
 * block's `--motion-count-delay` if CSS sets one. `replay={false}`
 * plays the block once, with no hover replay. A `[data-motion-replay]`
 * button inside the block replays it on click either way (CSS keeps such a
 * button hidden until the block has `data-anim`). `label` names the block for
 * assistive tech (a list's aria-label).
 *
 * Fail-safe: no block is ever left blank on screen.
 *   - It plays once 10% of it is in view, counting a strip 10% of the
 *     viewport below it, so it starts just before it shows (`threshold`
 *     can only lower that).
 *   - Already in view or above it when the page opens part-way down (a
 *     reload, an anchor), or when a fast scroll carries it past the
 *     observer: it shows at once, in its final frame, with no entrance.
 *   - On screen and still waiting after 1s for any reason: shown.
 *   - Only a block below the fold waits (`data-anim="idle"`); everything
 *     else is never held.
 * The rules live in lib/reveal.ts, shared with every other reveal.
 *
 * `catchUp` is for a tall block whose build runs top to bottom over seconds
 * (the Flash Agent diagram): while it plays, any piece that is on screen and
 * still waiting for its turn starts its entrance now, so a reader who
 * scrolls ahead of the build never finds a piece missing. Each piece's
 * entrance stays an entrance; only the wait before it is skipped.
 *
 * `phoneThreshold` marks a tall block that must never sit blank on a phone:
 * below 768px, while it waits below the fold, it carries `data-below` for CSS
 * to veil it, lifted the moment any of it is on screen.
 */
export function Motion({
  as: Tag = 'div',
  id,
  label,
  className,
  count,
  replay: replayOnHover = true,
  threshold = 0.35,
  phoneThreshold,
  catchUp = false,
  children,
}: {
  as?: 'div' | 'tr' | 'ol' | 'ul' | 'li' | 'h1' | 'h2' | 'figcaption';
  id?: string;
  label?: string;
  className: string;
  count?: string;
  replay?: boolean;
  threshold?: number;
  /** Below 768px, play at this much in view instead (and mark `data-below` until any of it shows). */
  phoneThreshold?: number;
  /** While it plays, a piece on screen that is still waiting for its turn starts its entrance now. */
  catchUp?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const block = ref.current;
    if (!block || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const number = count ? block.querySelector<HTMLElement>('[data-count]') : null;

    // "99.6%" -> ["", "99.6", "%"]: numbers count, everything else is kept, and
    // each number keeps its own decimals.
    const parts = count?.split(/(\d+(?:\.\d+)?)/) ?? [];
    const render = (progress: number) =>
      parts
        .map((part, i) => (i % 2 ? (Number(part) * progress).toFixed(part.split('.')[1]?.length ?? 0) : part))
        .join('');

    let frame = 0;
    let timer = 0;
    let played = false;

    // catchUp: each frame that scrolled while the build plays, every finite
    // animation still in its delay whose element is on screen jumps to the
    // start of its entrance. Watching stops once nothing is left waiting.
    let catching = false;
    let catchFrame = 0;
    const catchUpNow = () => {
      catchFrame = 0;
      let waiting = 0;
      for (const animation of block.getAnimations({ subtree: true })) {
        const timing = animation.effect?.getComputedTiming();
        const target = (animation.effect as KeyframeEffect | null)?.target;
        if (!timing || !target || timing.iterations === Infinity || animation.playState !== 'running') continue;
        const delay = Number(timing.delay) || 0;
        const local = Number(timing.localTime ?? 0);
        if (local >= delay) continue;
        const box = target.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) animation.currentTime = Number(animation.currentTime ?? 0) + (delay - local);
        else waiting++;
      }
      if (!waiting) stopCatching();
    };
    const scheduleCatch = () => {
      if (!catchFrame) catchFrame = requestAnimationFrame(catchUpNow);
    };
    const startCatching = () => {
      if (!catchUp || catching) return;
      catching = true;
      window.addEventListener('scroll', scheduleCatch, { passive: true });
      window.addEventListener('resize', scheduleCatch);
      scheduleCatch();
    };
    const stopCatching = () => {
      if (!catching) return;
      catching = false;
      window.removeEventListener('scroll', scheduleCatch);
      window.removeEventListener('resize', scheduleCatch);
      cancelAnimationFrame(catchFrame);
      catchFrame = 0;
    };

    const countUp = (delay: number) => {
      if (!number) return;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      number.textContent = render(0);
      timer = window.setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / COUNT_MS);
          number.textContent = render(1 - (1 - t) ** 4); // ease-out
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, delay);
    };

    const play = (order: number, instant = false) => {
      played = true;
      block.removeAttribute('data-below');
      block.dataset.delay = String(instant ? 0 : order);
      block.dataset.anim = 'reset';
      void block.getBoundingClientRect(); // commit the reset so the animations restart
      block.dataset.anim = 'run';
      if (instant) {
        // Shown at once, no entrance: every finite animation jumps to its end
        // frame. Ambient loops (infinite) keep running as they would have.
        for (const animation of block.getAnimations({ subtree: true })) {
          if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
        }
        if (number && count) number.textContent = count;
        return;
      }
      const style = getComputedStyle(block);
      countUp(toMs(style.getPropertyValue('--motion-delay')) + toMs(style.getPropertyValue('--motion-count-delay')));
      startCatching();
    };
    // data-inview also pauses ambient loops while the block is off screen,
    // or the tab is hidden.
    let inView = false;
    const syncInView = () => block.toggleAttribute('data-inview', inView && !document.hidden);
    const phone = phoneThreshold !== undefined && window.matchMedia('(max-width: 767px)').matches;

    // Only a block below the fold waits (first frame, `idle`); the shared
    // trigger (lib/reveal.ts) plays it as it comes into view, or shows it at
    // once if a fast scroll or a jump got there first.
    if (startsBelowFold(block)) {
      block.dataset.anim = 'idle';
      if (number) number.textContent = render(0);
      if (phone) block.setAttribute('data-below', '');
    }
    const stopReveal = onReveal(block, {
      enter: () => enqueue(block, play),
      settle: () => play(0, true),
      threshold,
      onView: (visible) => {
        inView = visible;
        if (visible) block.removeAttribute('data-below');
        syncInView();
      },
    });
    document.addEventListener('visibilitychange', syncInView);

    const replay = (event: PointerEvent) => {
      if (replayOnHover && event.pointerType === 'mouse' && played) play(0);
    };
    block.addEventListener('pointerenter', replay);

    const replayClick = (event: MouseEvent) => {
      if (played && (event.target as Element).closest('[data-motion-replay]')) play(0);
    };
    block.addEventListener('click', replayClick);

    return () => {
      stopCatching();
      stopReveal();
      block.removeAttribute('data-below');
      document.removeEventListener('visibilitychange', syncInView);
      block.removeEventListener('pointerenter', replay);
      block.removeEventListener('click', replayClick);
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      if (number && count) number.textContent = count;
      delete block.dataset.anim;
    };
  }, [count, replayOnHover, threshold, phoneThreshold, catchUp]);

  return (
    // The element union keeps the ref typed as the shared HTMLElement.
    <Tag
      ref={
        ref as React.Ref<
          HTMLDivElement &
            HTMLTableRowElement &
            HTMLOListElement &
            HTMLUListElement &
            HTMLLIElement &
            HTMLHeadingElement
        >
      }
      id={id}
      aria-label={label}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** A CSS time ("0.9s", "250ms") in milliseconds. */
function toMs(time: string) {
  const value = parseFloat(time);
  if (Number.isNaN(value)) return 0;
  return time.trim().endsWith('ms') ? value : value * 1000;
}

/**
 * Blocks that scroll in during the same frame play as one staggered group,
 * in document order, so a row reached on its own starts at once.
 */
let queue: { block: HTMLElement; play: (order: number) => void }[] = [];

function enqueue(block: HTMLElement, play: (order: number) => void) {
  if (!queue.length) {
    requestAnimationFrame(() => {
      const group = queue.sort((a, b) =>
        a.block.compareDocumentPosition(b.block) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );
      queue = [];
      group.forEach((item, order) => item.play(Math.min(order, MAX_STAGGER)));
    });
  }
  queue.push({ block, play });
}
