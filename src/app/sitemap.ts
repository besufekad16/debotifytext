import { MetadataRoute } from 'next';
import { getAllSlugs } from '~/lib/pseo-keywords';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.humanifylab.com';
  
  // Get all keyword slugs
  const slugs = getAllSlugs();
  
  // Create sitemap entries for all keyword pages
  const keywordPages = slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];
  
  return [...mainPages, ...keywordPages];
}
