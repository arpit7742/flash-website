import { SiteLink } from '@/components/site-link';
import { FigurePrefix } from '@/components/stats/figure-prefix';
import { StatTile } from '@/components/stats/stat-tile';
import { stats } from '@/content/home';

/**
 * The six headline numbers, each with the small diagram the design draws
 * above it, on the hero's navy (`stats-dark` recolours the diagrams for it,
 * styles/home.css). The tile, its diagrams and their motion are the shared
 * <StatTile> (components/stats/stat-tile.tsx), which the Lightning page's
 * spec tiles use too.
 *
 * Phones (below md) get one centred column, a short rule between stats
 * (`.stats-dark` in home.css); two columns from md, three from lg, and all
 * six in one row from 1240px. A rule divides the columns of each row.
 */
const columns = (i: number) =>
  [
    i % 2 === 0 ? 'md:pl-0' : 'md:border-l md:border-white/12',
    i % 3 === 0 ? 'lg:border-l-0 lg:pl-0' : 'lg:border-l lg:border-white/12 lg:pl-6',
    i === 0 ? 'min-[1240px]:pl-0' : 'min-[1240px]:border-l min-[1240px]:border-white/12 min-[1240px]:pl-5',
  ].join(' ');

export function Numbers() {
  return (
    <section id="numbers" aria-label="Flash in numbers" className="stats-dark scroll-mt-4 bg-brand-navy">
      <dl className="container-page grid grid-cols-1 gap-y-10 py-14 md:grid-cols-2 lg:grid-cols-3 lg:py-16 min-[1240px]:grid-cols-6">
        {stats.map((stat, i) => (
          <StatTile
            key={stat.id}
            diagram={stat.id}
            value={stat.value}
            prefix={stat.prefix && <FigurePrefix onDark>{stat.prefix}</FigurePrefix>}
            className={`gap-4 max-md:items-center max-md:text-center md:px-6 min-[1240px]:pr-5 min-[1240px]:last:pr-0 ${columns(i)}`}
            valueClassName={`whitespace-nowrap text-[34px] leading-9 font-extrabold tracking-[-0.03em] md:text-[46px] md:leading-12 md:tracking-[-0.05em] ${
              stat.id === 'products' ? 'text-[#6f9bff]' : 'text-text-on-dark'
            }`}
          >
            {/* The label is the term, the number its value; CSS puts the label last. */}
            <dt className="order-last text-caption text-text-on-dark-muted max-md:max-w-[300px] max-md:text-balance md:leading-[19px]">
              {stat.href ? (
                <SiteLink href={stat.href} className="underline-offset-4 hover:text-text-on-dark hover:underline">
                  {stat.label}
                </SiteLink>
              ) : (
                stat.label
              )}
            </dt>
          </StatTile>
        ))}
      </dl>
    </section>
  );
}
