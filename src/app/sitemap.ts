import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.lovewall.space';
  const now = '2026-05-22';

  return [
    { url: base,           lastModified: now, changeFrequency: 'hourly',  priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
