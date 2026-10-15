import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Flash is an approved vendor across all 700+ Troon golf properties';

export default async function Image() {
  return ogImage({
    eyebrow: 'Case study · Golf · Troon',
    headline: 'Flash is an approved vendor across all 700+ Troon golf properties',
    footer: 'flashweather.ai',
  });
}
