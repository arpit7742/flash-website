'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { FlashAvatar } from '@/components/flash-mark';
import { agentWidgetQuestions } from '@/content/agent-widget';
import { DEMO_HREF } from '@/content/navigation';

/** Typing: a character every 45ms, a 2.5s hold, erased at 18ms a character. */
const TYPE_MS = 45;
const HOLD_MS = 2500;
const ERASE_MS = 18;
/** The beat between one question erased and the next starting. */
const NEXT_MS = 400;
/** With reduced motion: each whole question, for this long. */
const STILL_MS = 4000;
/** After the page's load, so it does not arrive over the hero's own entrance. */
const SHOW_AFTER_MS = 1500;
/** Minimized or not, for the browser tab's session. */
const STORAGE_KEY = 'flash-agent-widget';
/** The demo form's message field takes this much (lib/demo-request.ts). */
const QUESTION_MAX = 4000;

/** Once it has shown, a page reached by a link shows it at once. */
let shown = false;

const withoutSlash = (path: string) => path.replace(/\/+$/, '');

function storedMinimized() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'minimized';
  } catch {
    return false; // No storage (a private window, blocked site data): it starts expanded.
  }
}

/** Book a demo, carrying the visitor's question as `?q=` when there is one. */
function demoHref(question: string) {
  const q = question.trim();
  return q ? `${DEMO_HREF}?q=${encodeURIComponent(q)}` : DEMO_HREF;
}

/**
 * The Flash Agent widget (styles/agent-widget.css), in the root layout behind
 * `AGENT_WIDGET_ENABLED` (content/agent-widget.ts). From md, a card pinned
 * bottom-right: the agent's name and minimize, then a question box whose
 * placeholder types the site's demo questions one after another, beside
 * "Ask now", its one action, in two short rows. "Ask now", or Enter in the
 * box, opens Book a demo in a new tab with the question as `?q=` (the demo
 * form puts it in its message field), or with no query when the box is
 * empty; the box is cleared and the widget stays as it was. It stays put and
 * expanded at every scroll position; only the visitor minimizes it (to its
 * name, remembered for the session), and it is out of sight only while the
 * video lightbox is open. Below md it is a slim bar along the bottom: the
 * bolt, the same question box, and "Ask now"; the bar also steps aside while
 * the mobile menu is open or a text field elsewhere has focus (the keyboard
 * is up), but not for its own box.
 *
 * It is not on Book a demo itself, the one page its action would point at.
 * The footer keeps room for it under its last row (styles/agent-widget.css),
 * so the end of every page scrolls clear of it.
 *
 * The typing loop runs only while there is a question box to see: not before
 * the widget has shown, not while it is minimized (from md), not while the
 * browser tab is hidden. It picks up where it stopped. It writes the box's
 * placeholder, so whatever the visitor types is never touched.
 */
export function AgentWidget() {
  const pathname = usePathname();
  if (withoutSlash(pathname) === withoutSlash(DEMO_HREF)) return null;
  return <Widget />;
}

function Widget() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(shown);
  // Read at once only after it has shown: a page reached by a link mounts it
  // on the client alone. On the first page it is read as it shows, so the
  // server's HTML and the hydrated one agree.
  const [minimized, setMinimized] = useState(() => shown && storedMinimized());
  /** The visitor's question, shared by the card's box and the bar's: only one is on screen. */
  const [question, setQuestion] = useState('');
  /** Where the loop is, kept across pauses: the question, how much of it is typed, and which way. */
  const at = useRef({ question: 0, typed: 0, erasing: false });

  useEffect(() => {
    if (shown) return;
    let timer = 0;
    const later = () => {
      timer = window.setTimeout(() => {
        shown = true;
        setMinimized(storedMinimized());
        setVisible(true);
      }, SHOW_AFTER_MS);
    };
    if (document.readyState === 'complete') later();
    else window.addEventListener('load', later, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', later);
    };
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root || !visible) return;
    const fields = [...root.querySelectorAll<HTMLInputElement>('input[data-agent-typed]')];
    const write = (text: string) => fields.forEach((field) => (field.placeholder = text));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 768px)');
    const s = at.current;
    const count = agentWidgetQuestions.length;
    let timer = 0;

    const later = (ms: number) => {
      timer = window.setTimeout(step, ms);
    };
    function step() {
      if (reduced) {
        s.question = (s.question + 1) % count;
        write(agentWidgetQuestions[s.question]);
        return later(STILL_MS);
      }
      const question = agentWidgetQuestions[s.question];
      s.typed += s.erasing ? -1 : 1;
      write(question.slice(0, s.typed));
      if (!s.erasing && s.typed >= question.length) {
        s.erasing = true;
        return later(HOLD_MS);
      }
      if (s.erasing && s.typed <= 0) {
        s.erasing = false;
        s.question = (s.question + 1) % count;
        return later(NEXT_MS);
      }
      later(s.erasing ? ERASE_MS : TYPE_MS);
    }

    /** Stop while nothing would show it; carry on from the same character after. */
    const sync = () => {
      clearTimeout(timer);
      if (document.hidden || (minimized && wide.matches)) return;
      const question = agentWidgetQuestions[s.question];
      write(reduced ? question : question.slice(0, s.typed));
      later(reduced ? STILL_MS : TYPE_MS);
    };

    sync();
    document.addEventListener('visibilitychange', sync);
    wide.addEventListener('change', sync);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', sync);
      wide.removeEventListener('change', sync);
    };
  }, [visible, minimized]);

  const toggle = () => {
    const next = !minimized;
    setMinimized(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next ? 'minimized' : 'expanded');
    } catch {
      // Not remembered, but it still minimizes.
    }
  };

  /** "Ask now", or Enter in the box: Book a demo in a new tab, then the box is cleared. */
  const ask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(demoHref(question), '_blank', 'noopener,noreferrer');
    setQuestion('');
  };

  const box = {
    type: 'text' as const,
    value: question,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setQuestion(event.target.value),
    maxLength: QUESTION_MAX,
    autoComplete: 'off',
    enterKeyHint: 'go' as const,
    'aria-label': 'Ask Sky a question',
    'data-agent-typed': true,
  };

  return (
    <aside
      ref={ref}
      aria-label="Sky"
      data-visible={visible || undefined}
      data-minimized={minimized || undefined}
      className="agent-widget"
    >
      {/* From md: the card, two short rows. */}
      <div className="agent-widget-card">
        <div className="flex h-6 items-center gap-2">
          <Avatar small />
          <p className="text-micro font-semibold tracking-[0.06em] text-text-on-dark">FLASH AGENT · SKY</p>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={!minimized}
            aria-label={minimized ? 'Expand Sky' : 'Minimize Sky'}
            className="agent-widget-toggle ml-auto"
          >
            <svg aria-hidden viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d={minimized ? 'M1 6h10M6 1v10' : 'M1 6h10'} />
            </svg>
          </button>
        </div>

        <form hidden={minimized} onSubmit={ask} className="mt-2.5 flex items-center gap-2">
          <input {...box} className="agent-widget-ask agent-widget-input h-9 grow px-2.5" />
          <button
            type="submit"
            aria-label="Ask now"
            className="agent-widget-demo bg-gold-button h-8 gap-1.5 rounded-xs px-3 text-micro leading-4 font-extrabold text-brand-navy"
          >
            Ask now
            <span aria-hidden>→</span>
          </button>
        </form>
      </div>

      {/* Below md: the bar. */}
      <form onSubmit={ask} className="agent-widget-bar">
        <Avatar />
        <input {...box} className="agent-widget-ask agent-widget-input h-10 grow px-1" />
        <button
          type="submit"
          aria-label="Ask now"
          className="agent-widget-demo bg-gold-button h-10 gap-1.5 rounded-[8px] px-3 text-caption leading-4 font-extrabold text-brand-navy"
        >
          Ask now
          <span aria-hidden>→</span>
        </button>
      </form>
    </aside>
  );
}

/** The Flash Agent avatar: 36px in the phone bar, 24px in the card's top row. */
function Avatar({ small = false }: { small?: boolean }) {
  return <FlashAvatar className={`rounded-full ${small ? 'size-6' : 'size-9'}`} />;
}
