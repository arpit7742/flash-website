/**
 * The controls under a <ComparisonSwipe> row of cards, below md only: the
 * arrows, one dot per comparison (the active dot fills while its card is
 * shown), the pause button (shown once the row plays on its own), the count
 * line, and the silent status line the script fills in. Shared by the home
 * page comparison and the Everyone else vs Flash page, so the two carousels
 * are the same carousel. `labels` are the comparisons' names, one per card.
 */
export function SwipeControls({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-col items-center gap-2 md:hidden">
      <div className="cmpc-nav">
        <SwipeArrow dir="prev" />
        <div role="group" aria-label="Comparisons" className="cmpc-dots">
          {labels.map((label, i) => (
            <button
              key={label}
              type="button"
              data-cmp-dot
              aria-label={`Comparison ${i + 1}: ${label}`}
              aria-current={i === 0 ? 'true' : undefined}
              data-on={i === 0 ? '' : undefined}
              className="cmpc-dot"
            >
              <span aria-hidden className="cmpc-dot-mark">
                <span className="cmpc-dot-fill" />
              </span>
            </button>
          ))}
        </div>
        <button type="button" data-cmp-toggle aria-label="Pause the comparisons" className="cmpc-toggle">
          <svg aria-hidden viewBox="0 0 16 16" className="cmpc-toggle-pause size-3">
            <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
          </svg>
          <svg aria-hidden viewBox="0 0 16 16" className="cmpc-toggle-play size-3">
            <path d="M5 2.75v10.5L13.25 8z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </button>
        <SwipeArrow dir="next" />
      </div>
      <p className="text-body-s leading-5 text-text-muted">{labels.length} calls · tap or swipe to explore</p>
      <p data-cmp-status aria-live="polite" className="sr-only" />
    </div>
  );
}

function SwipeArrow({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <button
      type="button"
      {...{ [`data-cmp-${dir}`]: '' }}
      aria-label={dir === 'prev' ? 'Previous comparison' : 'Next comparison'}
      className="cmpc-arrow"
    >
      <svg aria-hidden viewBox="0 0 16 16" className="size-4">
        <path
          d={dir === 'prev' ? 'M10 3 5 8l5 5' : 'm6 3 5 5-5 5'}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
