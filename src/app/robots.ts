import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Main crawlers - Full access to public content
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/', '/sign-in', '/sign-up'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/', '/sign-in', '/sign-up'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Slurp', // Yahoo
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/'],
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/'],
      },
      {
        userAgent: 'Baiduspider', // Baidu (China)
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/'],
      },
      {
        userAgent: 'YandexBot', // Yandex (Russia)
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/'],
      },
      // AI Crawlers - Allow for training (good for visibility)
      {
        userAgent: 'GPTBot', // OpenAI
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/', '/sign-in', '/sign-up'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/'],
      },
      {
        userAgent: 'Google-Extended', // Google Bard/Gemini
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/'],
      },
      {
        userAgent: 'anthropic-ai', // Claude
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/'],
      },
      // Block bad bots and scrapers
      {
        userAgent: 'AhrefsBot',
        disallow: ['/'],
      },
      {
        userAgent: 'SemrushBot',
        disallow: ['/'],
      },
      {
        userAgent: 'MJ12bot',
        disallow: ['/'],
      },
      {
        userAgent: 'DotBot',
        disallow: ['/'],
      },
      // Default rule for all other bots
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/account/', '/team/', '/api-keys/', '/sign-in', '/sign-up'],
      },
    ],
    sitemap: [
      'https://www.humanifylab.com/sitemap-bypass.xml',
      'https://www.humanifylab.com/sitemap-humanizer.xml',
      'https://www.humanifylab.com/sitemap-howto.xml',
      'https://www.humanifylab.com/sitemap-usecase.xml',
    ],
    host: 'https://www.humanifylab.com',
  };
}
