import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt = 'Sky: agentic weather AI that answers from the forecast and acts in your tools';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const eyebrow = `${site.name} · Sky`;
  return ogImage({
    eyebrow,
    headline: 'Ask Flash. It answers from the forecast and acts in your tools.',
    footer: 'flashweather.ai',
  });
}
