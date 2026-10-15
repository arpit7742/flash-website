import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const eyebrow = `${site.name} · Predictive Hail`;
  return ogImage({
    eyebrow,
    headline: 'Hail prediction up to 55 minutes before impact',
    footer: 'flashweather.ai',
  });
}
