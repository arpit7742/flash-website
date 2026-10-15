'use client';

import { SiteLink } from '@/components/site-link';
import { useState } from 'react';

import { ButtonLink } from '@/components/button';
import { FlashMark } from '@/components/flash-mark';
import { useDetectionFit } from '@/components/why-flash/detection-fit';
import { options, optionsBadge } from '@/content/why-flash';

/**
 * "Your options": the three cards, each ending in one next step, with a
 * "Start here" badge that follows the self-check above (styles/why-flash-options.css,
 * `opt-*`). Nothing checked puts it on Flash Weather; any box checked
 * moves it to Detection-only tools, with "Many sites run both". Do it
 * yourself is never badged. Without JavaScript the Flash default renders.
 *
 * Both badges are always in the markup so they can crossfade; the one not in
 * use is hidden from assistive tech, and a polite live line names the pick.
 */
export function OptionCards() {
  const picked = useDetectionFit().some(Boolean) ? 1 : 0;
  // Once the badge has moved, a newly badged card animates it in (CSS keys off data-moved).
  const [first] = useState(picked);
  const [moved, setMoved] = useState(false);
  if (!moved && picked !== first) setMoved(true);

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {optionsBadge.label}: {options[picked].name}
      </p>
      <ul className="opt-list flex flex-col gap-6 pt-4 lg:flex-row" data-moved={moved || undefined}>
        {options.map((option, i) => {
          const badged = i < 2;
          const on = i === picked;
          return (
            <li key={option.name} className="opt-card" data-picked={on || undefined}>
              {badged && (
                <div aria-hidden={!on} className="opt-badges">
                  <span className="opt-badge">
                    <FlashMark size={12} variant="current" />
                    {optionsBadge.label}
                  </span>
                  {i === 1 && <span className="opt-note">{optionsBadge.both}</span>}
                </div>
              )}
              <h3 className="text-h4 leading-h4 font-extrabold tracking-heading text-text">{option.name}</h3>
              <p className="text-[10px] leading-3 font-bold tracking-[0.13em] text-brand-blue">FITS WHEN</p>
              <p className="text-[15px] leading-body-s text-text">{option.fits}</p>
              <p className="text-[10px] leading-3 font-bold tracking-[0.13em] text-text-muted">WATCH FOR</p>
              <p className="text-[15px] leading-body-s text-text-muted">{option.watch}</p>
              <div className="mt-auto flex pt-4">
                {option.action.primary ? (
                  <ButtonLink href={option.action.href} variant="blue" size="sm">
                    {option.action.label}
                  </ButtonLink>
                ) : (
                  <SiteLink
                    href={option.action.href}
                    className="inline-flex min-h-11 items-center text-body-s leading-caption font-bold text-brand-blue hover:underline"
                  >
                    {option.action.label}&nbsp;<span aria-hidden>→</span>
                  </SiteLink>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
