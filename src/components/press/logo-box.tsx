import Image from 'next/image';

/**
 * The one logo treatment for the press page's tables: a fixed, left-aligned
 * box with the logo contained inside it on the white, so wordmarks run to
 * the box's width and crests and square marks to its height. Both the
 * partner table and the coverage list use it, so the two read as one set.
 *
 *   partner   112x32 on phones, 140x40 from md (partner-list.tsx)
 *   press      96x30 on phones, 120x36 from md (beat-list.tsx)
 *
 * `scale` is the optical trim from the data file: the logo's share of its
 * box, 1 by default, so a wide solid wordmark comes down a little and weighs
 * the same as a crest at full height. `rounded` gives square cover art its
 * 4px corners. An SVG is served as is; a raster goes through the image
 * optimizer.
 */
export type LogoFile = { src: string; alt: string; width: number; height: number; scale?: number; rounded?: boolean };

const BOX = {
  partner: 'relative h-8 w-28 md:h-10 md:w-[140px]',
  press: 'relative h-[30px] w-24 md:h-9 md:w-[120px]',
} as const;
const IMG = 'h-[calc(100%*var(--s,1))] w-[calc(100%*var(--s,1))] object-contain object-left';

export function LogoBox({ logo, size, className = '' }: { logo: LogoFile; size: keyof typeof BOX; className?: string }) {
  const style = logo.scale ? ({ '--s': logo.scale } as React.CSSProperties) : undefined;
  return (
    <div className={`${BOX[size]} ${className}`}>
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        sizes="140px"
        unoptimized={logo.src.endsWith('.svg')}
        className={`${IMG} ${logo.rounded ? 'rounded-[4px]' : ''}`}
        style={style}
      />
    </div>
  );
}
