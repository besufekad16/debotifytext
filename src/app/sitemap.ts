import { MetadataRoute } from 'next';
import { getAllSlugs } from '~/lib/pseo-keywords';

/**
 * Advanced Sitemap Generator for HumanifyLab
 * Generates dynamic sitemap with proper priorities and frequencies
 * Optimized for Google, Bing, and other search engines
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.humanifylab.com';
  const currentDate = new Date();
  
  // Get all keyword slugs (40,000+ pages)
  const slugs = getAllSlugs();
  
  // High-priority main pages (updated frequently)
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/responsible-use`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
  
  // Keyword pages (SEO landing pages)
  // Priority based on keyword importance
  const keywordPages: MetadataRoute.Sitemap = slugs.map((slug) => {
    // High-priority keywords for students
    const highPriorityTerms = [
      'student', 'essay', 'free', 'turnitin', 'bypass', 
      'academic', 'college', 'university', 'assignment'
    ];
    
    const isHighPriority = highPriorityTerms.some(term => 
      slug.toLowerCase().includes(term)
    );
    
    return {
      url: `${baseUrl}/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: isHighPriority ? 0.85 : 0.75,
    };
  });
  
  // Combine all pages
  return [...mainPages, ...keywordPages];
}
