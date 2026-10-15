'use client';

import Image from 'next/image';
import { SiteLink } from '@/components/site-link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type {
  FocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent,
} from 'react';

import { DEMO_HREF, megaMenus, navItems } from '@/content/navigation';
import type { MegaMenu } from '@/content/navigation';

/** A pointer resting on a trigger this long opens its menu (styles/header-mega.css). */
const OPEN_DELAY = 120;
/** A pointer away from the trigger and its panel this long closes the menu. */
const CLOSE_GRACE = 250;

type MenuId = MegaMenu['id'];

const trim = (path: string) => path.replace(/\/+$/, '') || '/';
const slug = (text: string) => text.replace(/\W+/g, '-').toLowerCase();

function Chevron({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={className}>
      <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The desktop nav (from lg): Products, Industries, Why Flash, Resources and
 * Company each open a mega menu, one family -- a compact panel joined to the
 * underside of the bar so the two read as one surface, with the page dimmed
 * behind it. Pricing is a plain link (content/navigation.ts `navItems`).
 *
 * A mega menu opens when the pointer rests on its trigger for 120ms, or on a
 * click, Enter, Space or ↓ (the keyboard ones move focus to the first link).
 * It closes when the pointer has been off the trigger and the panel for
 * 250ms, on Escape (focus back to the trigger), a click outside, focus
 * leaving it, a link, another menu opening, or the nav sliding away on
 * scroll (`data-nav-hidden` on <html>, set by <SiteHeader>). One at a time.
 * In the panel ↑↓ move within a column, ←→ between columns, Home/End to the
 * ends. The current page's link carries `aria-current="page"`.
 *
 * Each panel sits in the HTML after its trigger, closed or not: the tab
 * order runs trigger, panel, next item, and every link is there for a
 * crawler on every page.
 *
 * A compact menu (Resources, Company: `compact` in content/navigation.ts)
 * is only as wide as its content and opens under its own trigger; where it
 * goes is measured as it opens, and again on a resize while it is open.
 */
export function DesktopNav() {
  const [open, setOpen] = useState<MenuId | null>(null);
  /** `open` for the listeners and timers, which outlive a render. */
  const openRef = useRef<MenuId | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const openTimer = useRef<number>(undefined);
  const closeTimer = useRef<number>(undefined);
  /** How the open menu was opened: a hover-opened menu stays open when its trigger is then clicked. */
  const via = useRef<'hover' | 'click'>('hover');
  /** Set when the keyboard opened the menu: the first link takes focus once it shows. */
  const focusFirst = useRef(false);
  const pathname = trim(usePathname() ?? '/');

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };

  const item = (id: MenuId) => navRef.current?.querySelector<HTMLElement>(`[data-mega='${id}']`);
  const links = (id: MenuId) => [...(item(id)?.querySelectorAll<HTMLAnchorElement>('[data-mega-panel] a') ?? [])];

  const close = useCallback((returnFocus = false) => {
    clearTimers();
    const current = openRef.current;
    if (!current) return;
    if (returnFocus)
      navRef.current?.querySelector<HTMLElement>(`[data-mega='${current}'] [data-mega-trigger]`)?.focus();
    openRef.current = null;
    setOpen(null);
  }, []);

  // Escape, a click outside, the nav sliding away, a new page.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const inside = item(open)?.contains(document.activeElement);
      close(inside);
    };
    const onPointer = (event: globalThis.PointerEvent) => {
      if (!item(open)?.contains(event.target as Node)) close();
    };
    const root = document.documentElement;
    const watch = new MutationObserver(() => {
      if (root.hasAttribute('data-nav-hidden')) close();
    });
    watch.observe(root, { attributes: true, attributeFilter: ['data-nav-hidden'] });
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      watch.disconnect();
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open, close]);

  useEffect(() => clearTimers, []);

  // A compact panel: under its trigger (its left edge, or its right for
  // `end`), moved over as far as it must to stay inside the bar. Set before
  // the panel paints, so it fades in where it belongs.
  useLayoutEffect(() => {
    const align = megaMenus.find((menu) => menu.id === open)?.compact;
    if (!open || !align) return;
    const place = () => {
      const panel = item(open)?.querySelector<HTMLElement>('[data-mega-panel]');
      const trigger = item(open)?.querySelector<HTMLElement>('[data-mega-trigger]');
      const bar = navRef.current?.closest<HTMLElement>('.site-header-bar');
      if (!panel || !trigger || !bar) return;
      // The panel is placed against the bar's padding box; -1 and `max` are
      // its outer edges, where the full-width panels sit.
      const origin = bar.getBoundingClientRect().left + bar.clientLeft;
      const box = trigger.getBoundingClientRect();
      const max = bar.clientWidth + 1 - panel.offsetWidth;
      const want = align === 'end' ? box.right - origin - panel.offsetWidth : box.left - origin;
      const x = Math.round(Math.max(-1, Math.min(want, max)));
      panel.style.setProperty('--mega-x', `${x}px`);
      panel.toggleAttribute('data-flush-start', x <= -1);
      panel.toggleAttribute('data-flush-end', x >= Math.round(max));
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open]);

  // Keyboard-opened: focus the first link once the panel is visible.
  useEffect(() => {
    if (!open || !focusFirst.current) return;
    focusFirst.current = false;
    navRef.current?.querySelector<HTMLElement>(`[data-mega='${open}'] [data-mega-panel] a`)?.focus();
  }, [open]);

  const show = (id: MenuId, how: 'hover' | 'click', focus = false) => {
    clearTimers();
    via.current = how;
    focusFirst.current = focus;
    openRef.current = id;
    setOpen(id);
  };

  const onEnter = (id: MenuId) => (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    clearTimers();
    if (open === id) return;
    // Already in a menu: the other one swaps in at once.
    if (open) show(id, 'hover');
    else openTimer.current = window.setTimeout(() => show(id, 'hover'), OPEN_DELAY);
  };

  const onLeave = (id: MenuId) => (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    window.clearTimeout(openTimer.current);
    if (open !== id) return;
    // Keyboard focus inside the panel keeps it: hiding it would drop focus to the page.
    const focused = document.activeElement;
    if (focused?.closest('[data-mega-panel]') && item(id)?.contains(focused)) return;
    closeTimer.current = window.setTimeout(() => close(), CLOSE_GRACE);
  };

  const onTriggerClick = (id: MenuId) => (event: ReactMouseEvent) => {
    const keyboard = event.detail === 0;
    if (open === id && (via.current === 'click' || keyboard)) close();
    else show(id, 'click', keyboard);
  };

  const onTriggerKey = (id: MenuId) => (event: ReactKeyboardEvent) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    if (open === id) links(id)[0]?.focus();
    else show(id, 'click', true);
  };

  const onPanelKey = (id: MenuId) => (event: ReactKeyboardEvent) => {
    const columns = [...(item(id)?.querySelectorAll<HTMLElement>('[data-mega-col]') ?? [])].map((column) => [
      ...column.querySelectorAll<HTMLAnchorElement>('a'),
    ]);
    const all = columns.flat();
    const here = document.activeElement as HTMLAnchorElement;
    const col = columns.findIndex((column) => column.includes(here));
    if (col === -1) return;
    const row = columns[col].indexOf(here);
    const wrap = (n: number, length: number) => (n + length) % length;
    let next: HTMLAnchorElement | undefined;
    switch (event.key) {
      case 'ArrowDown':
        next = columns[col][wrap(row + 1, columns[col].length)];
        break;
      case 'ArrowUp':
        next = columns[col][wrap(row - 1, columns[col].length)];
        break;
      case 'ArrowRight':
      case 'ArrowLeft': {
        const to = columns[wrap(col + (event.key === 'ArrowRight' ? 1 : -1), columns.length)];
        next = to[Math.min(row, to.length - 1)];
        break;
      }
      case 'Home':
        next = all[0];
        break;
      case 'End':
        next = all.at(-1);
        break;
      default:
        return;
    }
    event.preventDefault();
    next?.focus();
  };

  // Focus leaving a menu (Tab past its last link, or Shift+Tab out of it) closes it.
  const onBlur = (id: MenuId) => (event: FocusEvent) => {
    if (open === id && !item(id)?.contains(event.relatedTarget as Node | null)) close();
  };

  return (
    <nav ref={navRef} aria-label="Primary" className="hidden h-full lg:block">
      {/* The page behind an open menu, dimmed and softened; a click on it closes the menu. */}
      <div aria-hidden className="mega-scrim" data-open={open ? '' : undefined} />
      <ul className="flex h-full items-center gap-7 xl:gap-9">
        {navItems.map((navItem) => {
          if (navItem.kind === 'link')
            return (
              <li
                key={navItem.link.href}
                className="flex h-full items-center"
                // Only one menu at a time: moving on to a plain link closes the open one.
                onPointerEnter={(event) => event.pointerType === 'mouse' && open && close()}
                onFocus={() => open && close()}
              >
                <SiteLink
                  href={navItem.link.href}
                  aria-current={trim(navItem.link.href) === pathname ? 'page' : undefined}
                  className="site-header-link flex h-full items-center text-[15px] leading-caption font-medium"
                >
                  {navItem.link.label}
                </SiteLink>
              </li>
            );
          const { menu } = navItem;
          const isOpen = open === menu.id;
          const panelId = `mega-${menu.id}`;
          return (
            <li
              key={menu.id}
              data-mega={menu.id}
              className="flex h-full items-center"
              onPointerEnter={onEnter(menu.id)}
              onPointerLeave={onLeave(menu.id)}
              onBlur={onBlur(menu.id)}
            >
              <button
                type="button"
                data-mega-trigger
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={onTriggerClick(menu.id)}
                onKeyDown={onTriggerKey(menu.id)}
                className="site-header-link mega-trigger flex h-full cursor-pointer items-center gap-1.5 text-[15px] leading-caption font-medium"
              >
                {menu.label}
                <Chevron className="mega-chevron" />
              </button>
              <MegaPanel
                id={panelId}
                menu={menu}
                open={isOpen}
                pathname={pathname}
                onKeyDown={onPanelKey(menu.id)}
                onNavigate={() => close()}
              />
            </li>
          );
        })}

      </ul>
    </nav>
  );
}

function MegaPanel({
  id,
  menu,
  open,
  pathname,
  onKeyDown,
  onNavigate,
}: {
  id: string;
  menu: MegaMenu;
  open: boolean;
  pathname: string;
  onKeyDown: (event: ReactKeyboardEvent) => void;
  onNavigate: () => void;
}) {
  const current = (href: string) => (trim(href) === pathname ? ('page' as const) : undefined);
  return (
    <div
      id={id}
      data-mega-panel
      data-open={open || undefined}
      data-lenis-prevent
      data-compact={menu.compact ? '' : undefined}
      className="mega-panel"
      onKeyDown={onKeyDown}
      onClick={(event) => (event.target as HTMLElement).closest('a') && onNavigate()}
    >
      {/* At least three column slots, so a menu with fewer columns keeps the others' rhythm (header-mega.css).
          A compact menu's columns take their content's width instead. */}
      <div
        className="mega-body"
        style={menu.compact ? undefined : ({ '--mega-cols': Math.max(3, menu.columns.length) } as React.CSSProperties)}
      >
        {menu.columns.map((column, i) => (
          <div key={i} data-mega-col className="mega-col">
            {column.groups.map((group) => (
              <div key={group.label}>
                <p className="mega-label" id={`${id}-${slug(group.label)}`}>
                  {group.label}
                </p>
                <ul aria-labelledby={`${id}-${slug(group.label)}`}>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <SiteLink href={link.href} aria-current={current(link.href)} className="mega-link">
                        {link.label}
                        <span aria-hidden className="mega-arrow">
                          →
                        </span>
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}

        {menu.compact ? (
          <CompactFeature menu={menu} panelId={id} current={current} />
        ) : (
          <div data-mega-col className="mega-feature">
            <SiteLink href={menu.feature.href} aria-current={current(menu.feature.href)} className="mega-card">
              {menu.feature.image ? (
                <span className="mega-card-image">
                  <Image src={menu.feature.image.src} alt="" width={560} height={315} sizes="280px" />
                  {menu.id === 'products' && (
                    <span aria-hidden className="mega-play">
                      <svg width="12" height="12" viewBox="0 0 14 14">
                        <path d="M3 1.5v11l9.5-5.5z" fill="currentColor" />
                      </svg>
                    </span>
                  )}
                </span>
              ) : (
                menu.feature.figure && (
                  // In the picture's place, the same size: a figure and a line under it.
                  <span className="mega-card-figure" data-long={menu.feature.figure.value.length > 8 || undefined}>
                    {menu.feature.figure.prefix && (
                      <span className="mega-card-figure-prefix">{menu.feature.figure.prefix}</span>
                    )}
                    <span className="mega-card-figure-value">{menu.feature.figure.value}</span>
                    <span className="mega-card-figure-caption">{menu.feature.figure.caption}</span>
                  </span>
                )
              )}
              <span className="mega-card-eyebrow">{menu.feature.eyebrow}</span>
              <span className="mega-card-title">{menu.feature.title}</span>
              <span className="mega-card-cta">
                {menu.feature.cta} <span aria-hidden>→</span>
              </span>
            </SiteLink>
          </div>
        )}
      </div>

      {/* The closing row: the menu's hub link and, in a full-width menu, the demo. A compact menu with no hub link has none. */}
      {(menu.all || !menu.compact) && (
        <div className="mega-foot">
          {menu.all && (
            <SiteLink href={menu.all.href} aria-current={current(menu.all.href)} className="mega-foot-link">
              {menu.all.label} <span aria-hidden>→</span>
            </SiteLink>
          )}
          {!menu.compact && (
            <SiteLink href={DEMO_HREF} className="mega-foot-demo">
              Book a demo
            </SiteLink>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * A compact menu's card column: the eyebrow as a column label, like the
 * link columns', then the card. A picture card (Resources' latest post) is
 * one link: a small 16:9 picture, the title, the call to action. A contact
 * card (Company's sales) holds two: the address as a mailto link, then the
 * caption and the call to action.
 */
function CompactFeature({
  menu,
  panelId,
  current,
}: {
  menu: MegaMenu;
  panelId: string;
  current: (href: string) => 'page' | undefined;
}) {
  const { feature } = menu;
  const labelId = `${panelId}-${slug(feature.eyebrow)}`;
  return (
    <div data-mega-col className="mega-feature-compact" role="group" aria-labelledby={labelId}>
      <p className="mega-label" id={labelId}>
        {feature.eyebrow}
      </p>
      {feature.contact ? (
        <div className="mega-sales">
          <a href={`mailto:${feature.contact.email}`} className="mega-sales-email">
            {feature.contact.email}
          </a>
          <span className="mega-sales-caption">{feature.contact.caption}</span>
          <SiteLink href={feature.href} aria-current={current(feature.href)} className="mega-sales-cta">
            {feature.cta} <span aria-hidden>→</span>
          </SiteLink>
        </div>
      ) : (
        <SiteLink href={feature.href} aria-current={current(feature.href)} className="mega-card">
          {feature.image && (
            <span className="mega-card-image">
              <Image src={feature.image.src} alt="" width={400} height={225} sizes="200px" />
            </span>
          )}
          <span className="mega-card-title">{feature.title}</span>
          <span className="mega-card-cta">
            {feature.cta} <span aria-hidden>→</span>
          </span>
        </SiteLink>
      )}
    </div>
  );
}

/**
 * A mega menu's row in the mobile menu: an accordion, one open at a time
 * (`name`), native <details> so it opens without JavaScript. The same groups
 * as the desktop panel, as sub-headings, without the descriptors or the
 * featured card; then the menu's closing link.
 */
export function MobileMegaGroup({ menu }: { menu: MegaMenu }) {
  const pathname = trim(usePathname() ?? '/');
  return (
    <li className="site-header-rule border-b py-3">
      <details name="site-menu-section" className="mega-acc group/acc">
        <summary className="site-header-link flex cursor-pointer list-none items-center justify-between py-1 text-body font-bold [&::-webkit-details-marker]:hidden">
          {menu.label}
          <Chevron className="mega-chevron size-3 transition-transform group-open/acc:rotate-180" />
        </summary>
        <div className="flex flex-col gap-4 pt-2 pb-1 sm:grid sm:grid-cols-2 sm:gap-x-4">
          {menu.columns
            .flatMap((column) => column.groups)
            .map((group) => (
              <div key={group.label}>
                <p className="mega-label pl-0">{group.label}</p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <SiteLink
                        href={link.href}
                        aria-current={trim(link.href) === pathname ? 'page' : undefined}
                        className="mega-acc-link block py-1.5 text-body-s"
                      >
                        {link.label}
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
        {menu.all && (
          <SiteLink href={menu.all.href} className="site-header-link mt-2 block py-1.5 text-body-s font-semibold">
            {menu.all.label} <span aria-hidden>→</span>
          </SiteLink>
        )}
      </details>
    </li>
  );
}
