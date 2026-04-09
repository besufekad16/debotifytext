import { MetadataRoute } from 'next';
import { getAllSlugs, getClusterKeywords } from '~/lib/pseo-data';
import { getV2ClusterKeywords } from '~/lib/pseo-data-v2';
import { getV3ClusterKeywords } from '~/lib/pseo-data-v3';

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

  // V1
  const bypassPages = getClusterKeywords('bypass').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 }));
  const humanizerPages = getClusterKeywords('humanizer').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.85 }));
  const howtoPages = getClusterKeywords('howto').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 }));
  const usecasePages = getClusterKeywords('usecase').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.75 }));

  // V2
  const competitorPages = getV2ClusterKeywords('competitor').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.88 }));
  const academicPages = getV2ClusterKeywords('academic').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.85 }));
  const professionalPages = getV2ClusterKeywords('professional').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.83 }));
  const detectorPages = getV2ClusterKeywords('detector').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.87 }));
  const languagePages = getV2ClusterKeywords('language').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.82 }));
  const nichePages = getV2ClusterKeywords('niche').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.80 }));

  // V3
  const pricingPages = getV3ClusterKeywords('pricing').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.82 }));
  const industryPages = getV3ClusterKeywords('industry').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.80 }));
  const formatPages = getV3ClusterKeywords('format').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.78 }));
  const speedPages = getV3ClusterKeywords('speed').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.78 }));
  const qualityPages = getV3ClusterKeywords('quality').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.78 }));
  const toolPages = getV3ClusterKeywords('tool').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.77 }));
  const problemPages = getV3ClusterKeywords('problem').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.80 }));
  const workflowPages = getV3ClusterKeywords('workflow').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.77 }));
  const scorePages = getV3ClusterKeywords('score').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.82 }));
  const regionPages = getV3ClusterKeywords('region').map(e => ({ url: `${baseUrl}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.79 }));

  return [
    ...mainPages,
    ...bypassPages, ...humanizerPages, ...howtoPages, ...usecasePages,
    ...competitorPages, ...academicPages, ...professionalPages,
    ...detectorPages, ...languagePages, ...nichePages,
    ...pricingPages, ...industryPages, ...formatPages, ...speedPages, ...qualityPages,
    ...toolPages, ...problemPages, ...workflowPages, ...scorePages, ...regionPages,
  ];
}
