import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Main crawlers - Full access to all public content
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/account/',
          '/team/',
          '/api-keys/',
          '/_next/static/',
          '/admin/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/account/',
          '/team/',
          '/api-keys/',
          '/_next/static/',
          '/admin/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Slurp', // Yahoo
        allow: '/',
        disallow: ['/api/', '/account/', '/team/', '/api-keys/', '/admin/'],
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/api/', '/account/', '/team/', '/api-keys/', '/admin/'],
      },
      {
        userAgent: 'Baiduspider', // Baidu (China)
        allow: '/',
        disallow: ['/api/', '/account/', '/team/', '/api-keys/', '/admin/'],
      },
      {
        userAgent: 'YandexBot', // Yandex (Russia)
        allow: '/',
        disallow: ['/api/', '/account/', '/team/', '/api-keys/', '/admin/'],
      },
      // AI Crawlers - Allow for training (good for visibility)
      {
        userAgent: 'GPTBot', // OpenAI
        allow: '/',
        disallow: ['/api/', '/account/', '/team/', '/api-keys/', '/admin/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/account/', '/team/', '/api-keys/', '/admin/'],
      },
      {
        userAgent: 'Google-Extended', // Google Bard/Gemini
        allow: '/',
        disallow: ['/api/', '/account/', '/team/', '/api-keys/', '/admin/'],
      },
      {
        userAgent: 'anthropic-ai', // Claude
        allow: '/',
        disallow: ['/api/', '/account/', '/team/', '/api-keys/', '/admin/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/account/', '/team/', '/api-keys/', '/admin/'],
      },
      // Block bad bots and scrapers
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
        ],
        disallow: ['/'],
      },
      // Default rule for all other bots - Allow everything except private areas
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/account/',
          '/team/',
          '/api-keys/',
          '/_next/static/',
          '/admin/',
        ],
      },
    ],
    sitemap: [
      'https://www.humanifylab.com/sitemap.xml',
      // V1 Cluster Sitemaps
      'https://www.humanifylab.com/sitemap-bypass.xml',
      'https://www.humanifylab.com/sitemap-humanizer.xml',
      'https://www.humanifylab.com/sitemap-howto.xml',
      'https://www.humanifylab.com/sitemap-usecase.xml',
      // V2 Cluster Sitemaps
      'https://www.humanifylab.com/sitemap-competitor.xml',
      'https://www.humanifylab.com/sitemap-academic.xml',
      'https://www.humanifylab.com/sitemap-professional.xml',
      'https://www.humanifylab.com/sitemap-detector.xml',
      'https://www.humanifylab.com/sitemap-language.xml',
      'https://www.humanifylab.com/sitemap-niche.xml',
      // V3 Cluster Sitemaps
      'https://www.humanifylab.com/sitemap-pricing.xml',
      'https://www.humanifylab.com/sitemap-industry.xml',
      'https://www.humanifylab.com/sitemap-format.xml',
      'https://www.humanifylab.com/sitemap-speed.xml',
      'https://www.humanifylab.com/sitemap-quality.xml',
      'https://www.humanifylab.com/sitemap-tool.xml',
      'https://www.humanifylab.com/sitemap-problem.xml',
      'https://www.humanifylab.com/sitemap-workflow.xml',
      'https://www.humanifylab.com/sitemap-score.xml',
      'https://www.humanifylab.com/sitemap-region.xml',
      // V4 Cluster Sitemaps
      'https://www.humanifylab.com/sitemap-comparison.xml',
      'https://www.humanifylab.com/sitemap-alternative.xml',
      'https://www.humanifylab.com/sitemap-review.xml',
      'https://www.humanifylab.com/sitemap-free.xml',
      'https://www.humanifylab.com/sitemap-detection.xml',
      'https://www.humanifylab.com/sitemap-writing.xml',
      'https://www.humanifylab.com/sitemap-education.xml',
      'https://www.humanifylab.com/sitemap-platform-v4.xml',
      'https://www.humanifylab.com/sitemap-output.xml',
      'https://www.humanifylab.com/sitemap-bulk.xml',
    ],
    host: 'https://www.humanifylab.com',
  };
}
