import { MetadataRoute } from 'next';
import { guideData } from '@/lib/guide-data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ruhangcodeguide.ruhang365.cn';
  const lastModified = new Date();

  // Static routes
  const routes = [
    '',
    '/guide',
    '/tools',
    '/resources',
    '/search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic guide chapters
  const guideRoutes = guideData.map((section) => ({
    url: `${baseUrl}/guide/${section.id}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...guideRoutes];
}
