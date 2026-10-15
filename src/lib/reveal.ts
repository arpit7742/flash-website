/**
 * The site's one scroll-reveal trigger, fail-safe by construction.
 *
 * Every entrance on the site starts from markup that is already the final
 * frame; a reveal only adds a short entrance as the element comes into view.
 * What it must never do is leave something blank on screen, so:
 *
 *   - it fires once 10% of the element is in view, counting a strip 10% of
 *     the viewport below it, so it starts just before the element shows
 *   - reached with its top already above LATE of the viewport (a fast scroll,
 *     an anchor jump, a page opened part-way down), or already above the
 *     viewport, it settles: shown at once, final frame, no entrance
 *   - on screen and still waiting after FALLBACK_MS, for any reason: settled
 *   - in view as the page opens at the top: it enters straight away
 *
 * `enter` plays the entrance; `settle` shows the final frame without one
 * (defaults to `enter`). Each runs at most once, and only one of them. The
 * returned function stops watching. With reduced motion, callers should not
 * call this at all: the markup is already final.
 */

/** Fires once this much of the element is in view... */
export const REVEAL_THRESHOLD = 0.1;
/** ...counting a strip just below the viewport. */
const ROOT_MARGIN = '0px 0px 10% 0px';
/** Reached with its top above this share of the viewport: the reader is already looking at it. */
const LATE = 0.85;
/** On screen and still waiting this long: shown, whatever the reason. */
const FALLBACK_MS = 1000;

type Handlers = {
  enter: () => void;
  settle?: () => void;
  /** Called with true/false as the element enters and leaves view (for pausing loops). */
  onView?: (inView: boolean) => void;
  /** At most this much in view before it fires (capped at REVEAL_THRESHOLD). */
  threshold?: number;
};

export function onReveal(el: Element, { enter, settle = enter, onView, threshold = REVEAL_THRESHOLD }: Handlers) {
  let done = false;
  let fallback = 0;
  let unwatch = () => {};

  const finish = (how: () => void) => {
    if (done) return;
    done = true;
    unwatch();
    clearTimeout(fallback);
    how();
  };
  const late = (box: DOMRectReadOnly) => box.bottom <= 0 || box.top < window.innerHeight * LATE;

  const check = () => {
    if (done) return;
    const box = el.getBoundingClientRect();
    if (late(box)) return finish(settle);
    const onScreen = box.top < window.innerHeight && box.bottom > 0;
    if (onScreen && !fallback) fallback = window.setTimeout(() => finish(settle), FALLBACK_MS);
    if (!onScreen && fallback) {
      clearTimeout(fallback);
      fallback = 0;
    }
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      onView?.(entry.isIntersecting);
      if (!entry.isIntersecting || done) return;
      if (late(entry.boundingClientRect)) finish(settle);
      else finish(enter);
    },
    { threshold: Math.min(threshold, REVEAL_THRESHOLD), rootMargin: ROOT_MARGIN },
  );

  const start = el.getBoundingClientRect();
  const openedPartWay = window.scrollY > 0 || location.hash !== '';
  if (start.bottom <= 0 || (start.top < window.innerHeight && openedPartWay)) finish(settle);
  else if (start.top < window.innerHeight) finish(enter);
  else unwatch = watch(check);

  // Kept after it fires when the caller follows view (onView), else let go.
  if (onView || !done) observer.observe(el);
  return () => {
    observer.disconnect();
    unwatch();
    clearTimeout(fallback);
  };
}

/**
 * The fallback alone, for reveals driven by scroll position rather than by
 * entering view (a thermometer filling, a clock scrubbing): once `el` has been
 * on screen for FALLBACK_MS without the scroll having revealed it, `show` runs
 * (once). The caller keeps it shown from then on.
 */
export function onScreenFallback(el: Element, show: () => void) {
  let timer = 0;
  let done = false;
  let unwatch = () => {};
  const check = () => {
    const box = el.getBoundingClientRect();
    const onScreen = box.top < window.innerHeight && box.bottom > 0 && box.height > 0;
    if (onScreen && !timer) {
      timer = window.setTimeout(() => {
        if (done) return;
        done = true;
        unwatch();
        show();
      }, FALLBACK_MS);
    } else if (!onScreen && timer) {
      clearTimeout(timer);
      timer = 0;
    }
  };
  unwatch = watch(check);
  return () => {
    done = true;
    unwatch();
    clearTimeout(timer);
  };
}

/** Whether `el` is still waiting for its reveal: below the fold at first sight. */
export function startsBelowFold(el: Element) {
  return el.getBoundingClientRect().top >= window.innerHeight;
}

/*
 * One scroll and resize listener for everything still waiting: each frame that
 * scrolled, every waiting element runs its check. A fast scroll or an anchor
 * jump can carry an element past the observer's moment; this catches it.
 */
const waiting = new Set<() => void>();
let frame = 0;

const runChecks = () => {
  frame = 0;
  waiting.forEach((check) => check());
};
const schedule = () => {
  if (!frame) frame = requestAnimationFrame(runChecks);
};

function watch(check: () => void) {
  if (!waiting.size) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
  }
  waiting.add(check);
  schedule();
  return () => {
    waiting.delete(check);
    if (!waiting.size) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
