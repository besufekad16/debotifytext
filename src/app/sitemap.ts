import { MetadataRoute } from 'next';
import { getAllSlugs, getClusterKeywords } from '~/lib/pseo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.humanifylab.com';
  const now = new Date();

  const mainPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/responsible-use`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Cluster 1 — bypass: highest priority (commercial intent)
  const bypassPages: MetadataRoute.Sitemap = getClusterKeywords('bypass').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Cluster 2 — humanizer tools: high priority (product intent)
  const humanizerPages: MetadataRoute.Sitemap = getClusterKeywords('humanizer').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Cluster 3 — how-to guides: medium-high priority (informational intent)
  const howtoPages: MetadataRoute.Sitemap = getClusterKeywords('howto').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Cluster 4 — use cases: medium priority (audience intent)
  const usecasePages: MetadataRoute.Sitemap = getClusterKeywords('usecase').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...mainPages, ...bypassPages, ...humanizerPages, ...howtoPages, ...usecasePages];
}
