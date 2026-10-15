import Image from 'next/image';

import { Eyebrow } from '@/components/eyebrow';
import { SiteLink } from '@/components/site-link';
import { testimonials } from '@/content/press';
import { pressLinks } from '@/content/press-links';

import { TestimonialStream } from './testimonial-stream';

/** Quotes past this length set smaller, so a long card keeps the same shape as a short one. */
const LONG_QUOTE = 300;

/**
 * "What do the people running the sites say?" -- a navy band with the six
 * quotes as tilted cards stacked down it, each sweeping in from its own side
 * as it scrolls into view (testimonial-stream.tsx; the rules and motion in
 * styles/press-testimonials.css). Odd cards sit right with the picture on
 * the right, even cards sit left with the picture on the left. The picture
 * is Flash's own imagery for the speaker's industry until an official
 * headshot (`photo`, content/press.ts) replaces it.
 *
 * It sits between the coverage and the partner list, all three on white.
 * The coverage above has no bottom padding, so this section's top padding is
 * the one gap there, and the partner list's own top padding is the one gap
 * below.
 */
export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="scroll-mt-6 bg-neutral-0">
      <div className="container-page pt-20 lg:pt-28">
        <div className="tq-band flex flex-col gap-12 overflow-x-clip px-4 py-14 md:gap-16 md:px-10 md:py-20 lg:py-24">
          <div className="mx-auto flex max-w-[760px] flex-col items-center gap-4 text-center">
            <Eyebrow>In the field</Eyebrow>
            <h2
              id="testimonials-heading"
              className="text-h2 leading-h2 font-extrabold tracking-display text-balance text-text-on-dark md:text-h1 md:leading-h1"
            >
              What do the people running the sites say?
            </h2>
            <p className="text-body-l leading-body-l text-pretty text-text-on-dark-muted">
              The people making the call are outside, with a sky like this over them.
            </p>
          </div>

          <TestimonialStream className="tq-stream flex flex-col">
            {testimonials.map((t, i) => {
              const side = i % 2 === 0 ? 'right' : 'left';
              const picture = t.photo ?? t.image;
              return (
                <li
                  key={t.name}
                  className="tq-card"
                  data-side={side}
                >
                  <figure className="tq-figure">
                    <div className="tq-picture">
                      <Image
                        src={picture.src}
                        alt={picture.alt}
                        fill
                        sizes="(min-width: 1440px) 420px, (min-width: 1024px) 28vw, (min-width: 768px) 30vw, calc(100vw - 48px)"
                        className="object-cover"
                      />
                    </div>
                    <div className="tq-text">
                      <blockquote className={t.quote.length > LONG_QUOTE ? 'tq-quote tq-quote-long' : 'tq-quote'}>
                        <p>“{t.quote}”</p>
                      </blockquote>
                      <figcaption className="tq-caption">
                        <span className="tq-name">{t.name}</span>
                        <span className="tq-role">{t.role}</span>
                        {t.source && (
                          <SiteLink href={pressLinks[t.source.id].href} className="tq-source">
                            {t.source.label} <span aria-hidden>&nbsp;↗</span>
                            <span className="sr-only"> (opens in a new tab)</span>
                          </SiteLink>
                        )}
                      </figcaption>
                    </div>
                  </figure>
                </li>
              );
            })}
          </TestimonialStream>
        </div>
      </div>
    </section>
  );
}
