/**
 * The weather bolt, in a 26×34 box: lightning as weather, never Flash. It
 * draws strikes on the maps (accuracy, risk map, Command Center), the hazard
 * bolt in a "Lightning predicted" notice, and the NLDN strike chip. Where a
 * bolt stands for Flash, use <FlashMark /> (components/flash-mark.tsx).
 *
 * One place cannot import it and carries the same points by hand: the
 * `.home-gold-bolt` mask (styles/home.css). Change both together.
 */
export const BOLT_PATH = 'M19.6 0L0 19.6h8.9L6.4 34 26 12.6H15.8z';
