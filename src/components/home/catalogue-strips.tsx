'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Logo } from '@/components/logo';
import { Motion } from '@/components/motion';
import { SiteLink } from '@/components/site-link';
import type { CatalogueCard } from '@/content/home';

/**
 * Where each photo is cut for a strip: the strip shows the photo's full
 * width and about half its height, so this is the height that keeps the
 * subject in it. Keyed by the card's tag.
 */
const CUT: Record<string, string> = {
  severe: '46%',
  heat: '28%',
  water: '52%',
  wind: '36%',
  agronomy: '44%',
  'visibility and winter': '72%',
  delivery: '50%',
};

/**
 * "What we predict" below md: the catalogue as photo-strip accordion rows
 * (styles/home-catalogue-strips.css). A strip is a button, so the whole of
 * it opens its row; one row is open at a time, the first on load, and the
 * open one closes on a second tap. The panels are in the server HTML with
 * the first one open, so the page reads the same without JavaScript.
 *
 * A panel animates to its content's height, which CSS cannot name: each
 * row's is measured into `--pacc-h`, and kept right as the text reflows.
 * The rows fade up as they scroll in (<Motion>); nothing else moves here.
 */
export function CatalogueStrips({ cards, className }: { cards: CatalogueCard[]; className: string }) {
  const [open, setOpen] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const inners = [...(list.current?.querySelectorAll<HTMLElement>('.pacc-inner') ?? [])];
    const measure = (inner: HTMLElement) =>
      inner.parentElement?.style.setProperty('--pacc-h', `${inner.offsetHeight}px`);
    const sizes = new ResizeObserver((entries) => entries.forEach((entry) => measure(entry.target as HTMLElement)));
    inners.forEach((inner) => {
      measure(inner);
      sizes.observe(inner);
    });
    return () => sizes.disconnect();
  }, []);

  return (
    <ul ref={list} className={`pacc ${className}`}>
      {cards.map((card, i) => {
        const id = `predict-${card.tag.toLowerCase().replaceAll(' ', '-')}`;
        const links = card.phoneLinks ?? (card.link ? [card.link] : []);
        const cut = CUT[card.tag.toLowerCase()];
        return (
          <Motion as="li" key={card.tag} threshold={0.2} replay={false} className="motion pacc-item">
            <div className="pacc-row" data-open={open === i ? '' : undefined}>
              <h3>
                <button
                  type="button"
                  id={id}
                  aria-expanded={open === i}
                  aria-controls={`${id}-panel`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="pacc-strip"
                >
                  {cut ? (
                    <>
                      {/* Decorative here: the strip's name is its text. */}
                      <span className="pacc-photo" style={{ '--pacc-y': cut } as React.CSSProperties}>
                        <Image src={card.image.src} alt="" fill sizes="100vw" />
                      </span>
                      <span aria-hidden className="pacc-fade" />
                      <span aria-hidden className="pacc-grade" />
                    </>
                  ) : (
                    <>
                      <span aria-hidden className="pacc-glow" />
                      <span className="pacc-logo">
                        <Logo variant="dark" size="strip" decorative />
                      </span>
                    </>
                  )}
                  <span className="pacc-text">
                    <span className="text-[11px] leading-[14px] font-extrabold tracking-[0.13em] text-viz-gold uppercase">
                      {card.tag}
                    </span>
                    <span className="text-body leading-[22px] font-bold text-text-on-dark">{card.caption}</span>
                  </span>
                  <svg aria-hidden viewBox="0 0 20 20" className="pacc-chevron">
                    <path
                      d="m5 7.5 5 5 5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </h3>
              <div id={`${id}-panel`} role="region" aria-labelledby={id} className="pacc-panel">
                <div className="pacc-inner">
                  {card.items.map((item) => (
                    <div key={item.title} className="flex flex-col gap-[2px]">
                      <h4 className="text-[15px] leading-[21px] font-bold text-text">{item.title}</h4>
                      <p className="text-[13.5px] leading-[19px] text-text-muted">{item.body}</p>
                    </div>
                  ))}
                  {links.length > 0 && (
                    <p className="-my-2 flex flex-wrap items-center gap-x-2 text-body-s leading-5 font-bold text-brand-blue">
                      {links.map((link, n) => (
                        <span key={link.href} className="flex items-center gap-2">
                          {n > 0 && <span aria-hidden>·</span>}
                          <SiteLink href={link.href} className="flex min-h-11 items-center hover:underline">
                            {link.label}&nbsp;<span aria-hidden>→</span>
                          </SiteLink>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Motion>
        );
      })}
    </ul>
  );
}
