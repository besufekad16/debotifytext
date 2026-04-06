import { MetadataRoute } from 'next';
import { getAllSlugs, getClusterKeywords } from '~/lib/pseo-data';
import { getV2ClusterKeywords } from '~/lib/pseo-data-v2';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.humanifylab.com';
  const now = new Date();

  const mainPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/affiliate`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/responsible-use`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // V1 Clusters
  const bypassPages: MetadataRoute.Sitemap = getClusterKeywords('bypass').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const humanizerPages: MetadataRoute.Sitemap = getClusterKeywords('humanizer').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const howtoPages: MetadataRoute.Sitemap = getClusterKeywords('howto').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const usecasePages: MetadataRoute.Sitemap = getClusterKeywords('usecase').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  // V2 Clusters
  const competitorPages: MetadataRoute.Sitemap = getV2ClusterKeywords('competitor').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.88,
  }));

  const academicPages: MetadataRoute.Sitemap = getV2ClusterKeywords('academic').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const professionalPages: MetadataRoute.Sitemap = getV2ClusterKeywords('professional').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.83,
  }));

  const detectorPages: MetadataRoute.Sitemap = getV2ClusterKeywords('detector').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.87,
  }));

  const languagePages: MetadataRoute.Sitemap = getV2ClusterKeywords('language').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.82,
  }));

  const nichePages: MetadataRoute.Sitemap = getV2ClusterKeywords('niche').map((e) => ({
    url: `${baseUrl}/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.80,
  }));

  return [
    ...mainPages,
    ...bypassPages, ...humanizerPages, ...howtoPages, ...usecasePages,
    ...competitorPages, ...academicPages, ...professionalPages,
    ...detectorPages, ...languagePages, ...nichePages,
  ];
}
