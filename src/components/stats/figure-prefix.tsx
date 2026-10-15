/**
 * The small words before a headline figure, such as "Up to" in "Up to 99.6%":
 * caption-sized and regular weight beside the large number, on its baseline,
 * in the muted text colour of the ground it sits on. It sits outside the
 * figure's `[data-count]` span, so only the number counts up.
 */
export function FigurePrefix({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <span
      className={`mr-1.5 text-caption font-normal tracking-normal ${onDark ? 'text-text-on-dark-muted' : 'text-text-muted'}`}
    >
      {children}
    </span>
  );
}
