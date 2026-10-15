import { SiteLink } from '@/components/site-link';

import { Motion } from '@/components/motion';
import { FigurePrefix } from '@/components/stats/figure-prefix';
import type { receipts } from '@/content/why-flash-hub';

/** When each part starts, after its block scrolls in (styles/why-flash-proof.css). */
const at = (ms: number) => ({ '--wfx-at': `${ms}ms` }) as React.CSSProperties;
const ROW_MS = 60;

/**
 * The hub's "The receipts." as editorial proof (Paper: "Why Flash hub — The
 * receipts · proof states"): the accuracy figure on its own (about 40% from
 * lg) with the link into how it is measured, the other figures as a ruled
 * list beside it, the partners who already run on Flash as three equal text
 * cards under their lead line, and who built it, as an attributed line on a
 * gold rule. One column below lg, in that order.
 *
 * The figures are definition lists, each label (dt) before its value (dd) in
 * the markup and after it on screen. Only Troon's card is a link.
 *
 * Motion (styles/why-flash-proof.css): once, as each block scrolls in, 99.6%
 * fades up first, then the rows 60ms apart; then the lead line, the cards
 * 60ms apart and the founder line. Nothing counts or prints: every number is
 * real text from the start. Hovering a card lifts it 4px. Without JavaScript
 * or with reduced motion it is all simply there.
 */
export function Proof({
  featured,
  stats,
  partnersLead,
  partners,
  founder,
}: Omit<typeof receipts, 'kicker' | 'heading'>) {
  return (
    <div className="flex flex-col gap-14 lg:gap-20">
      <Motion replay={false} threshold={0.3} className="motion flex flex-col gap-10 lg:flex-row lg:gap-[72px]">
        <div className="wfx-rise flex flex-col gap-5 border-t border-border-strong pt-7 lg:w-[38%] lg:shrink-0" style={at(0)}>
          <dl className="flex flex-col-reverse gap-5">
            <dt className="max-w-[360px] text-[19px] leading-[26px] font-bold text-text md:text-[22px] md:leading-[30px] md:tracking-[-0.01em]">
              {featured.label}
            </dt>
            <dd className="text-[88px] leading-[84px] font-extrabold tracking-[-0.06em] whitespace-nowrap text-brand-navy min-[1280px]:text-[112px] min-[1280px]:leading-[108px] min-[1440px]:text-[136px] min-[1440px]:leading-[128px]">
              <span className="mr-2.5 text-body font-normal tracking-normal text-text-muted md:text-body-l">
                {featured.prefix}
              </span>
              {featured.value}
            </dd>
          </dl>
          <SiteLink
            href={featured.method.href}
            className="inline-flex min-h-11 w-fit items-center gap-1.5 text-[15px] leading-5 font-bold text-brand-blue hover:underline"
          >
            {featured.method.text} <span aria-hidden>→</span>
          </SiteLink>
        </div>

        <dl className="flex min-w-0 grow basis-0 flex-col border-t border-border-strong">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="wfx-rise flex flex-row-reverse items-baseline justify-end gap-4 border-b border-border py-4 md:gap-8 md:py-[22px]"
              style={at(120 + i * ROW_MS)}
            >
              <dt className="min-w-0 text-[15px] leading-[22px] text-pretty text-neutral-700 md:text-body-l md:leading-[26px]">
                {stat.label}
              </dt>
              <dd className="w-[132px] shrink-0 text-[26px] leading-[30px] font-extrabold tracking-[-0.04em] whitespace-nowrap text-brand-navy md:w-[190px] md:text-[36px] md:leading-10">
                {stat.prefix && <FigurePrefix>{stat.prefix}</FigurePrefix>}
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Motion>

      <Motion replay={false} threshold={0.3} className="motion flex flex-col gap-4 md:gap-6">
        <p className="wfx-rise text-body-l leading-7 font-semibold text-text" style={at(0)}>
          {partnersLead}
        </p>
        <ul className="flex flex-col gap-4 md:flex-row md:gap-6">
          {partners.map((partner, i) => {
            const body = (
              <>
                <span className="flex items-center justify-between gap-3 text-[20px] leading-[26px] font-extrabold tracking-[-0.02em] text-text md:text-[24px] md:leading-[30px]">
                  {partner.name}
                  {partner.href && (
                    <span aria-hidden className="text-brand-blue">
                      →
                    </span>
                  )}
                </span>
                <span className="text-[15px] leading-[22px] text-pretty text-text-muted md:text-body md:leading-6">
                  {partner.role}
                </span>
              </>
            );
            return (
              <li
                key={partner.name}
                className="wfx-rise wfx-card flex rounded-lg border border-border bg-neutral-0 hover:border-border-strong md:grow md:basis-0"
                style={at(60 + i * ROW_MS)}
              >
                {partner.href ? (
                  <SiteLink href={partner.href} className="flex grow flex-col gap-1.5 rounded-lg p-[22px] md:gap-2.5 md:p-7">
                    {body}
                  </SiteLink>
                ) : (
                  <p className="flex grow flex-col gap-1.5 p-[22px] md:gap-2.5 md:p-7">{body}</p>
                )}
              </li>
            );
          })}
        </ul>
        <p
          className="wfx-rise mt-4 max-w-[760px] border-l-2 border-gold-on-light pl-5 text-body leading-[26px] text-pretty text-text-muted"
          style={at(60 + partners.length * ROW_MS)}
        >
          {founder}
        </p>
      </Motion>
    </div>
  );
}
