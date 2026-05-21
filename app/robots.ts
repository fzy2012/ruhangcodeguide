import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Claude-Bot',
          'anthropic-ai',
          'PerplexityBot',
          'Bytespider',
          'Baiduspider',
          'Googlebot',
          'Bingbot'
        ],
        allow: '/',
      }
    ],
    sitemap: 'https://ruhangcodeguide.ruhang365.cn/sitemap.xml',
  };
}
