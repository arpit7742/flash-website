import { useId } from 'react';

/**
 * The Flash mark: the bolt that forms the "A" in the FLASH wordmark, as one
 * SVG. Its outline is traced from the logo itself (public/brand/
 * flash-logo-for-light-bg.png, the gold bolt, 8 corners) and matches the live
 * site's standalone icon edge for edge; its gradient is the wordmark's gold,
 * sampled along the bolt from its top point to its bottom one.
 *
 * Use it wherever a bolt stands for Flash, never for weather: a lightning
 * strike on a map or a "lightning" hazard chip stays a weather icon.
 *
 * The rules, so it reads as one mark everywhere:
 *   - the same outline and proportions (267 × 331) at every size; only
 *     `size` and `variant` change. Never stretch, rotate or redraw it
 *   - `variant` by ground: `gradient` (the default) or `gold` on dark;
 *     `navy` on gold or light; `white` on a photo or a saturated colour;
 *     `current` takes the text colour, for a mark whose colour CSS changes
 *     with its state (a selected item turning gold)
 *   - keep clear space around it of about a quarter of its height
 *
 * `size` is its height in px; the width follows (×0.81). Below 20px the two
 * needle points would fall under a pixel and blur away, so `detail="auto"`
 * draws the small cut: the same outline with both points blunted where they
 * thin to under a pixel. Decorative by default (aria-hidden); pass `title`
 * where the mark itself has to be announced.
 */

/** The outline, traced from the wordmark: top point, notch, peak, bottom point, and back up. */
const OUTLINE = 'M0 0L99 116L137 38L267 331L135 241L180 240L136 139L98 223Z';
/** The same outline with both points blunted, for sizes under SMALL_BELOW. */
const OUTLINE_SMALL = 'M26 30.4L99 116L137 38L257.3 309.1L247.2 317.5L135 241L180 240L136 139L98 223L16.1 36.6Z';
const WIDTH = 267;
const HEIGHT = 331;
const SMALL_BELOW = 20;

/** The wordmark's gold, top point to bottom point. */
const GOLD_STOPS = [
  ['0', '#c9a548'],
  ['0.15', '#e3c961'],
  ['0.25', '#ecd76c'],
  ['0.35', '#d3b95a'],
  ['0.45', '#b99a48'],
  ['0.55', '#9a7432'],
  ['0.65', '#9a7431'],
  ['0.75', '#caac51'],
  ['0.85', '#ebd467'],
  ['1', '#d7b652'],
] as const;

const FILL = {
  gold: 'var(--color-viz-gold)',
  navy: 'var(--color-brand-navy)',
  white: '#ffffff',
  current: 'currentColor',
} as const;

export type FlashMarkVariant = 'gradient' | keyof typeof FILL;

export function FlashMark({
  size = 24,
  variant = 'gradient',
  detail = 'auto',
  title,
  className,
}: {
  /** Height in px; the width follows the mark's own proportions. A class may size it instead (`h-1/2 w-auto`). */
  size?: number;
  variant?: FlashMarkVariant;
  /** `auto` draws the small cut below 20px. */
  detail?: 'auto' | 'full' | 'small';
  /** Announce the mark (role="img"); leave out where it is decoration beside a label. */
  title?: string;
  className?: string;
}) {
  const id = useId();
  const small = detail === 'small' || (detail === 'auto' && size < SMALL_BELOW);
  const gradient = `flash-mark-${id}`;

  return (
    <svg
      width={Math.round((size * WIDTH) / HEIGHT * 10) / 10}
      height={size}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
      focusable="false"
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={WIDTH} y2={HEIGHT}>
            {GOLD_STOPS.map(([offset, color]) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
      )}
      <path d={small ? OUTLINE_SMALL : OUTLINE} fill={variant === 'gradient' ? `url(#${gradient})` : FILL[variant]} />
    </svg>
  );
}

/**
 * The Flash Agent avatar: the navy mark on the gold metallic ground, the mark
 * half the avatar's height so a quarter of it stays clear above and below.
 * Shape and size come from `className` (a disc by default; `rounded-lg` for a
 * tile); the mark scales with it, in its small cut, since avatars run 24-44px.
 */
export function FlashAvatar({ className = 'size-8 rounded-full' }: { className?: string }) {
  return (
    <span aria-hidden className={`bg-gold-metallic flex shrink-0 items-center justify-center ${className}`}>
      <FlashMark variant="navy" detail="small" className="h-1/2 w-auto" />
    </span>
  );
}
