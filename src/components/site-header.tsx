'use client';

import { SiteLink } from '@/components/site-link';
import { useEffect, useRef, ViewTransition } from 'react';

import { DEMO_HREF, navItems } from '@/content/navigation';
import { onScrollFrame } from '@/lib/scroll';
import { site } from '@/lib/seo/site';

import { Logo } from './logo';
import { DesktopNav, MobileMegaGroup } from './site-header-mega';

/** This close to the top of the page the nav always shows. */
const TOP = 100;
/** Past this share of the page's scroll, scrolling down slides the nav away. */
const HIDE_PAST = 0.5;
/** Scroll movement smaller than this is ignored, so the nav does not jitter. */
const JITTER = 10;

/**
 * The global nav (C01 dark, C02 light): a floating bar, detached from the
 * screen's edges, the width of the page's content, over the top of every
 * page. Nothing is reserved for it: the page's first section starts behind
 * it and is padded clear of it (styles/header.css).
 *
 * `tone` is the page's header as its Paper design draws it -- dark glass on
 * pages that open on a hero, light glass on reading pages -- and it holds for
 * the whole page, whatever section scrolls under the bar.
 *
 * The one exception is the page's ending, the closing band and the footer
 * (<SiteFooter>), which is the same dark ground on every page: while that is
 * under the bar the bar takes its tone (`data-header-tone`), so a light
 * page's bar turns dark over it and back above it. No section inside a page
 * changes the bar.
 *
 * Scrolling: the nav stays for the first half of the page. Past that,
 * scrolling down slides it up out of view and scrolling up brings it back;
 * within 100px of the top it always shows. It also shows while the mobile
 * menu is open and when keyboard focus moves into it. The state is
 * `data-nav-hidden` on <html>, which sticky bars under the nav follow too
 * (`--site-header-stick`).
 *
 * Every link is in the HTML, which is what lets a crawler reach every page
 * from every page. Products, Industries, Why Flash, Resources and Company
 * open mega menus, Pricing is a plain link (<DesktopNav>, site-header-mega.tsx).
 * The mobile menu is a <details>, so it opens without JavaScript too, with
 * the five menus as accordions inside it, styled alike. With JavaScript it also
 * locks the page behind it and closes on Escape or a link.
 */
export function SiteHeader({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    const menu = header?.querySelector<HTMLDetailsElement>('details.site-menu');
    if (!header || !menu) return;

    const root = document.documentElement;
    const show = (on: boolean) => root.toggleAttribute('data-nav-hidden', !on);
    /** Where the page was when the nav last answered a scroll. */
    let mark = window.scrollY;

    const stopReading = onScrollFrame(() => {
      // Over the page's ending: its tone. The bar's own place, not where a slide has it.
      const ending = document.querySelector<HTMLElement>('[data-header-tone]');
      const over = ending && ending.getBoundingClientRect().top <= header.offsetTop + header.offsetHeight / 2;
      const theme = (over && ending.dataset.headerTone) || tone;
      if (header.dataset.theme !== theme) header.dataset.theme = theme;

      // Away past half the page on the way down, back on the way up.
      const range = root.scrollHeight - window.innerHeight;
      const y = Math.min(Math.max(window.scrollY, 0), range);
      if (y <= TOP || menu.open) {
        show(true);
        mark = y;
        return;
      }
      const moved = y - mark;
      if (Math.abs(moved) < JITTER) return;
      mark = y;
      if (moved < 0) show(true);
      else if (y > range * HIDE_PAST) show(false);
    });
    // Tabbing into a nav that has slid away brings it back.
    const onFocus = () => {
      show(true);
      mark = window.scrollY;
    };

    // Mobile menu: lock the page while it is open.
    const lock = () => document.documentElement.classList.toggle('site-menu-open', menu.open);
    const close = () => {
      if (menu.open) menu.open = false;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.open) {
        close();
        menu.querySelector('summary')?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('nav a')) close();
    };
    const wide = window.matchMedia('(min-width: 1024px)');
    header.addEventListener('focusin', onFocus);
    menu.addEventListener('toggle', lock);
    menu.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    wide.addEventListener('change', close);

    return () => {
      stopReading();
      show(true);
      header.removeEventListener('focusin', onFocus);
      menu.removeEventListener('toggle', lock);
      menu.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', close);
      document.documentElement.classList.remove('site-menu-open');
      header.dataset.theme = tone;
    };
  }, [tone]);

  return (
    /* Its own layer in a page transition: the page fades under it. */
    <ViewTransition name="site-header" share="site-header" default="none">
      <header ref={ref} data-theme={tone} className="site-header container-page">
        <div className="site-header-bar flex items-center justify-between gap-6 pr-2.5 pl-4 sm:pr-2 md:pl-5">
          <Logo variant={tone} size="header" priority themed={tone === 'light'} />

          <DesktopNav />

          <div className="flex items-center gap-3 sm:gap-5">
            <SiteLink href={site.appUrl} className="site-header-muted hidden text-[15px] leading-caption font-medium sm:block">
              Log in
            </SiteLink>
            <SiteLink
              href={DEMO_HREF}
              className="site-header-demo hidden h-10 items-center px-5 text-body-s leading-caption tracking-[0.02em] sm:flex"
            >
              Book a demo
            </SiteLink>

            <details className="site-menu group/menu lg:hidden">
              <summary
                className="site-header-toggle flex size-11 cursor-pointer list-none items-center justify-center rounded-[12px] border [&::-webkit-details-marker]:hidden"
                aria-label="Menu"
              >
                <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden className="group-open/menu:hidden">
                  <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="2" />
                </svg>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="hidden group-open/menu:block">
                  <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="2" />
                </svg>
              </summary>
              <nav
                aria-label="Mobile"
                data-lenis-prevent
                className="site-header-menu overflow-y-auto px-8 pb-8 md:px-[60px]"
              >
                <ul className="flex flex-col">
                  {navItems.map((item) =>
                    item.kind === 'mega' ? (
                      <MobileMegaGroup key={item.menu.id} menu={item.menu} />
                    ) : (
                      <li key={item.link.href} className="site-header-rule border-b py-3">
                        <SiteLink href={item.link.href} className="site-header-link block py-1 text-body font-bold">
                          {item.link.label}
                        </SiteLink>
                      </li>
                    ),
                  )}
                </ul>
                <div className="mt-6 flex flex-col gap-3">
                  <SiteLink
                    href={DEMO_HREF}
                    className="site-header-demo flex h-[54px] items-center justify-center text-body-s leading-caption tracking-[0.02em]"
                  >
                    Book a demo
                  </SiteLink>
                  <SiteLink href={site.appUrl} className="site-header-muted py-2 text-center text-body-s">
                    Log in
                  </SiteLink>
                </div>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </ViewTransition>
  );
}
