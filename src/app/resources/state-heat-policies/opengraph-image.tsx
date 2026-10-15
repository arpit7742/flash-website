import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt = `${site.name} — State heat policies`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: 'State heat policies',
    headline: 'WBGT thresholds for high school athletics, state by state',
    footer: 'flashweather.ai',
  });
}
