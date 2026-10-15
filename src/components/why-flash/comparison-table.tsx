import { ComparisonSwipe } from '@/components/home/comparison-swipe';
import { SwipeControls } from '@/components/home/comparison-swipe-controls';
import { FlashMark } from '@/components/flash-mark';
import { Logo } from '@/components/logo';
import { Motion } from '@/components/motion';
import { type ComparisonIcon, comparisonRows } from '@/content/why-flash';

/**
 * Everyone else vs Flash, capability by capability. A real table: the
 * capability is the (visually hidden) row header, the two sides are columns.
 * The pictograms are decorative; every fact in them is in the cell text.
 *
 * Each row's pictograms animate when the row scrolls in (and replay on
 * hover); hooks and keyframes are the `cmp-*` rules in styles/why-flash.css,
 * shared with the home page comparison.
 */

/** The diagram: 190px wide on a phone card (as on the home carousel), 128×72 in the table. */
const ICON = 'h-auto w-[190px] shrink-0 md:h-[72px] md:w-32';

const T = { fontFamily: 'var(--font-manrope), system-ui, sans-serif', fontSize: 10, fontWeight: 700 } as const;
function ElseIcon({ kind }: { kind: ComparisonIcon }) {
  return (
    <svg viewBox="0 0 128 72" aria-hidden className={ICON}>
      {kind === 'timing' && (
        <>
          <line x1="8" y1="46" x2="120" y2="46" stroke="#CBD2DE" strokeWidth="2" />
          <path className="cmp-strike-bolt" d="M96 14l-15 20h8l-4 16 15-22h-8.5z" fill="#8A93A8" />
          <g className="cmp-strike-hit">
            <circle cx="90" cy="46" r="7" fill="#C22E22" />
            <path d="M86 54v-6a4 4 0 018 0v6" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
          <text x="118" y="68" textAnchor="end" fill="#5F6B85" {...T}>ALERT = STRIKE</text>
        </>
      )}
      {kind === 'resolution' && (
        <>
          <g className="cmp-county">
            <path
              d="M14 22 C30 6, 70 4, 92 14 C118 26, 118 52, 92 62 C66 72, 22 70, 12 52 C6 42, 6 30, 14 22Z"
              fill="#EEF1F7"
              stroke="#CBD2DE"
              strokeWidth="1.5"
            />
            <text x="64" y="41" textAnchor="middle" fill="#5F6B85" {...T}>WHOLE COUNTY</text>
          </g>
        </>
      )}
      {kind === 'refresh' && (
        <>
          <line x1="8" y1="40" x2="120" y2="40" stroke="#CBD2DE" strokeWidth="2" />
          <circle cx="12" cy="40" r="5" fill="#8A93A8" />
          <circle cx="116" cy="40" r="5" fill="#8A93A8" />
          <circle className="cmp-hourly-crawl motion-loop" cx="12" cy="40" r="5" fill="#8A93A8" />
          <text x="12" y="62" fill="#5F6B85" {...T}>:00</text>
          <text x="116" y="62" textAnchor="end" fill="#5F6B85" {...T}>:60</text>
          <text x="64" y="24" textAnchor="middle" fill="#5F6B85" {...T}>ONE UPDATE AN HOUR</text>
        </>
      )}
      {kind === 'forecast' && (
        <>
          <g className="cmp-chance-cloud">
            <path d="M36 54h56a14 14 0 000-28 20 20 0 00-38-6 16 16 0 00-18 34z" fill="#EEF1F7" stroke="#CBD2DE" strokeWidth="1.5" />
            <text className="cmp-chance-q" x="64" y="44" textAnchor="middle" fill="#8A93A8" {...T} fontSize={16} fontWeight={800}>?</text>
          </g>
          <text x="64" y="68" textAnchor="middle" fill="#5F6B85" {...T}>SOMEWHERE, SOMETIME</text>
        </>
      )}
      {kind === 'decision' && (
        <>
          <g className="cmp-hope">
            <circle cx="64" cy="34" r="22" fill="#EEF1F7" stroke="#CBD2DE" strokeWidth="1.5" />
            <path d="M56 30a8 8 0 0116 0c0 5-8 6-8 12" fill="none" stroke="#8A93A8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="64" cy="48" r="1.8" fill="#8A93A8" />
          </g>
          <text x="64" y="70" textAnchor="middle" fill="#5F6B85" {...T}>WAIT AND SEE</text>
        </>
      )}
    </svg>
  );
}

function FlashIcon({ kind }: { kind: ComparisonIcon }) {
  const gold = 'var(--color-viz-gold)';
  return (
    <svg viewBox="0 0 128 72" aria-hidden className={ICON}>
      {kind === 'timing' && (
        <>
          <line x1="8" y1="46" x2="120" y2="46" stroke="#1C2340" strokeWidth="2" />
          <clipPath id="cmp-lead-line">
            <rect className="cmp-lead-line" x="16" y="42" width="88" height="8" />
          </clipPath>
          <line x1="16" y1="46" x2="104" y2="46" stroke={gold} strokeWidth="2" strokeDasharray="4 4" clipPath="url(#cmp-lead-line)" />
          <circle className="cmp-lead-ping" cx="16" cy="46" r="7" fill="none" stroke={gold} strokeWidth="2" />
          <g className="cmp-lead-alert">
            <circle cx="16" cy="46" r="7" fill={gold} />
            {/* Flash's alert: the mark, half the disc's height, centred on it. */}
            <g transform="translate(13.2 42.5)">
              <FlashMark size={7} variant="navy" detail="small" />
            </g>
          </g>
          <path className="cmp-lead-bolt" d="M110 14l-15 20h8l-4 16 15-22h-8.5z" fill="#FFFFFF" />
          <path d="M16 34 L16 28 L104 28 L104 34" fill="none" stroke={gold} strokeWidth="1.5" />
          <text x="60" y="22" textAnchor="middle" fill={gold} {...T}>UP TO 60 MIN</text>
          <text x="16" y="68" fill="#AEB8C7" {...T}>ALERT</text>
          <text x="104" y="68" textAnchor="middle" fill="#AEB8C7" {...T}>STRIKE</text>
        </>
      )}
      {kind === 'resolution' && (
        <>
          <path
            d="M8 8H120M8 24H120M8 40H120M8 56H120M8 8V56M24 8V56M40 8V56M56 8V56M72 8V56M88 8V56M104 8V56M120 8V56"
            fill="none"
            stroke="#1C2340"
          />
          <rect className="cmp-cell-scan" x="8" y="8" width="16" height="16" fill={gold} fillOpacity="0.25" stroke={gold} strokeWidth="1.5" />
          <rect className="cmp-cell-fill" x="40" y="24" width="16" height="16" fill={gold} />
          <rect className="cmp-cell-fill" x="56" y="24" width="16" height="16" fill={gold} opacity="0.45" />
          <rect className="cmp-cell-fill" x="40" y="40" width="16" height="16" fill={gold} opacity="0.3" />
          <circle className="cmp-cell-dot" cx="48" cy="32" r="3" fill="#070D26" />
          <text x="64" y="70" textAnchor="middle" fill="#AEB8C7" {...T}>YOUR 1×1 KM CELL</text>
        </>
      )}
      {kind === 'refresh' && (
        <>
          <line x1="8" y1="40" x2="120" y2="40" stroke="#1C2340" strokeWidth="2" />
          <g className="cmp-refresh-dots">
            {Array.from({ length: 14 }, (_, i) => (
              <circle key={i} className="motion-loop" cx={12 + i * 8} cy="40" r="3" fill="#0B63CE" />
            ))}
          </g>
          <circle className="cmp-refresh-end motion-loop" cx="116" cy="40" r="5" fill={gold} />
          <text x="12" y="62" fill="#AEB8C7" {...T}>:00</text>
          <text x="116" y="62" textAnchor="end" fill="#AEB8C7" {...T}>:28</text>
          <text x="64" y="24" textAnchor="middle" fill={gold} {...T}>EVERY 2 MINUTES</text>
        </>
      )}
      {kind === 'forecast' && (
        <>
          <path
            className="cmp-pin-grid"
            pathLength="1"
            d="M8 12H120M8 30H120M8 48H120M8 66H120M26 12V66M44 12V66M62 12V66M80 12V66M98 12V66"
            fill="none"
            stroke="#1C2340"
          />
          <g className="cmp-pin-drop">
            <path d="M44 52c0-8 5-13 12-13s12 5 12 13c0 9-12 18-12 18S44 61 44 52z" fill="#FFFFFF" />
            <circle cx="56" cy="52" r="4" fill="#070D26" />
          </g>
          <g className="cmp-pin-tag">
            <rect x="62" y="14" width="56" height="20" rx="4" fill={gold} />
            <text x="90" y="28" textAnchor="middle" fill="#070D26" {...T} fontSize={11} fontWeight={800}>3:47 PM</text>
          </g>
        </>
      )}
      {kind === 'decision' && (
        <>
          <g className="cmp-go-badge">
            <rect x="4" y="14" width="120" height="40" rx="8" fill="#128A5E" />
            <text x="44" y="39" fill="#FFFFFF" {...T} fontSize={12} fontWeight={800}>GO · 3:20 PM</text>
          </g>
          <path
            className="cmp-go-check"
            pathLength="1"
            d="M18 34l6 6 12-12"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="64" y="70" textAnchor="middle" fill="#AEB8C7" {...T}>DECIDE EARLY, LOG IT</text>
        </>
      )}
    </svg>
  );
}

export function ComparisonTable() {
  const last = comparisonRows.length - 1;
  return (
    // From md, the table as it always was. Below md, the home page's
    // comparison carousel (<ComparisonSwipe>, styles/home-comparison-swipe.css):
    // each row is a card, everyone else on white over Flash on navy, swiped
    // one at a time, playing on its own while in view, with the same dots,
    // arrows and pause button under it.
    <ComparisonSwipe className="cmpc md:relative md:overflow-x-auto md:rounded-xl md:border md:border-border md:bg-neutral-0">
      <table className="block w-full border-collapse text-left md:table md:min-w-[560px]">
        <caption className="sr-only">
          Everyone else vs Flash: alert timing, resolution, refresh rate, forecast and decision. Detection-based tools
          and hourly forecasts in the left column, Flash in the right. Illustrative times, not live weather.
        </caption>
        <thead className="max-md:sr-only">
          <tr>
            <th scope="col" className="sr-only">Capability</th>
            <th scope="col" className="w-1/2 border-b border-border px-5 py-[22px] md:px-8">
              <span className="flex items-center gap-[10px] text-micro font-bold tracking-[0.13em] text-text-muted uppercase">
                <span aria-hidden className="size-[10px] shrink-0 rounded-full bg-neutral-300" />
                Everyone else
              </span>
            </th>
            <th scope="col" className="w-1/2 bg-brand-navy px-5 py-[22px] md:px-8">
              <Logo variant="dark" size="column" link={false} alt="Flash" />
            </th>
          </tr>
        </thead>
        <tbody data-cmp-track className="cmpc-track">
          {comparisonRows.map((row, i) => (
            <Motion as="tr" key={row.capability} className="motion cmp-row cmpc-card">
              <th scope="row" className="sr-only">
                {row.capability}
              </th>
              <td className={`cmp-them align-middle md:px-8 md:py-7 ${i < last ? 'md:border-b md:border-border' : ''}`}>
                {/* Names the card where the rows are swiped one at a time. */}
                <span className="sr-only md:hidden">
                  Comparison {i + 1} of {comparisonRows.length}
                </span>
                <Cell side="them" title={row.else.title} body={row.else.body}>
                  <ElseIcon kind={row.icon} />
                </Cell>
              </td>
              <td
                className={`cmp-flash bg-brand-navy align-middle md:px-8 md:py-7 ${i < last ? 'md:border-b md:border-border-on-dark' : ''}`}
              >
                <Cell side="flash" title={row.flash.title} body={row.flash.body}>
                  <FlashIcon kind={row.icon} />
                </Cell>
              </td>
            </Motion>
          ))}
        </tbody>
      </table>

      <SwipeControls labels={comparisonRows.map((row) => row.flash.title)} />
    </ComparisonSwipe>
  );
}

/** One side of a comparison: in the table a diagram beside the text; on a phone card, centred under its column label. */
function Cell({
  side,
  title,
  body,
  children,
}: {
  side: 'them' | 'flash';
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  const flash = side === 'flash';
  return (
    <div className="flex flex-col items-center gap-3 text-center md:flex-row md:gap-6 md:text-left">
      {/* The column label, shown only where the table header is hidden. */}
      <span aria-hidden className="flex items-center gap-2 text-body-s leading-5 font-bold text-text-muted md:hidden">
        {flash ? (
          <Logo variant="dark" size="label" decorative />
        ) : (
          <>
            <span className="size-2 rounded-full bg-neutral-300" />
            Everyone else
          </>
        )}
      </span>
      {children}
      <div className="flex flex-col gap-1">
        <p
          className={`text-body-l leading-6 font-bold max-md:text-balance ${
            flash ? 'text-text-on-dark' : 'text-neutral-700'
          }`}
        >
          {title}
        </p>
        <p className={`text-body-s leading-5 max-md:text-balance ${flash ? 'text-text-on-dark-muted' : 'text-text-muted'}`}>
          {body}
        </p>
      </div>
    </div>
  );
}
