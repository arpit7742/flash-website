import { FlashAvatar } from '@/components/flash-mark';

/**
 * A weather bolt (lightning strikes, not Flash) filled with the metallic gold:
 * `.home-gold-bolt` (src/styles/home.css) masks bg-gold-metallic with the
 * BOLT_PATH glyph. Where a bolt stands for Flash, use <FlashMark />.
 */
export function GoldBolt({ className = 'h-4 w-3' }: { className?: string }) {
  return <span aria-hidden className={`home-gold-bolt bg-gold-metallic block shrink-0 ${className}`} />;
}

/** The Flash Agent avatar as a tile (<FlashAvatar />, rounded-lg by default). */
export function AgentBadge({ className = 'size-8 rounded-lg' }: { className?: string }) {
  return <FlashAvatar className={className} />;
}
