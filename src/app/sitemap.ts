import { MetadataRoute } from 'next';
import { getAllSlugs, getClusterKeywords } from '~/lib/pseo-data';
import { getV2ClusterKeywords } from '~/lib/pseo-data-v2';
import { getV3ClusterKeywords } from '~/lib/pseo-data-v3';
import { getV4ClusterKeywords } from '~/lib/pseo-data-v4';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.humanifylab.com';
  const now = new Date();

  // Main pages - High priority, updated frequently
  const mainPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/affiliate`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/responsible-use`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Helper function to create realistic lastModified dates
  // Spreads dates across last 90 days for natural appearance
  function getRealisticDate(index: number, total: number): Date {
    const daysAgo = Math.floor((index / total) * 90); // Spread across 90 days
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  // V1 - Core keywords (highest priority) - DAILY crawl for fresh content
  const bypassKeywords = getClusterKeywords('bypass');
  const bypassPages = bypassKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, bypassKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.95 
  }));

  const humanizerKeywords = getClusterKeywords('humanizer');
  const humanizerPages = humanizerKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, humanizerKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.92 
  }));

  const howtoKeywords = getClusterKeywords('howto');
  const howtoPages = howtoKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, howtoKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.90 
  }));

  const usecaseKeywords = getClusterKeywords('usecase');
  const usecasePages = usecaseKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, usecaseKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.88 
  }));

  // V2 - Secondary keywords - DAILY crawl
  const competitorKeywords = getV2ClusterKeywords('competitor');
  const competitorPages = competitorKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, competitorKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.93 
  }));

  const academicKeywords = getV2ClusterKeywords('academic');
  const academicPages = academicKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, academicKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.91 
  }));

  const professionalKeywords = getV2ClusterKeywords('professional');
  const professionalPages = professionalKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, professionalKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.90 
  }));

  const detectorKeywords = getV2ClusterKeywords('detector');
  const detectorPages = detectorKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, detectorKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.92 
  }));

  const languageKeywords = getV2ClusterKeywords('language');
  const languagePages = languageKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, languageKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.88 
  }));

  const nicheKeywords = getV2ClusterKeywords('niche');
  const nichePages = nicheKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, nicheKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.87 
  }));

  // V3 - Tertiary keywords - DAILY crawl
  const pricingKeywords = getV3ClusterKeywords('pricing');
  const pricingPages = pricingKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, pricingKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.88 
  }));

  const industryKeywords = getV3ClusterKeywords('industry');
  const industryPages = industryKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, industryKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.87 
  }));

  const formatKeywords = getV3ClusterKeywords('format');
  const formatPages = formatKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, formatKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.86 
  }));

  const speedKeywords = getV3ClusterKeywords('speed');
  const speedPages = speedKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, speedKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.86 
  }));

  const qualityKeywords = getV3ClusterKeywords('quality');
  const qualityPages = qualityKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, qualityKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.86 
  }));

  const toolKeywords = getV3ClusterKeywords('tool');
  const toolPages = toolKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, toolKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.85 
  }));

  const problemKeywords = getV3ClusterKeywords('problem');
  const problemPages = problemKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, problemKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.88 
  }));

  const workflowKeywords = getV3ClusterKeywords('workflow');
  const workflowPages = workflowKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, workflowKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.85 
  }));

  const scoreKeywords = getV3ClusterKeywords('score');
  const scorePages = scoreKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, scoreKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.90 
  }));

  const regionKeywords = getV3ClusterKeywords('region');
  const regionPages = regionKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, regionKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.87 
  }));

  // V4 - Latest keywords (high commercial intent) - DAILY crawl
  const comparisonKeywords = getV4ClusterKeywords('comparison');
  const comparisonPages = comparisonKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, comparisonKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.95 
  }));

  const alternativeKeywords = getV4ClusterKeywords('alternative');
  const alternativePages = alternativeKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, alternativeKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.94 
  }));

  const reviewKeywords = getV4ClusterKeywords('review');
  const reviewPages = reviewKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, reviewKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.93 
  }));

  const freeKeywords = getV4ClusterKeywords('free');
  const freePages = freeKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, freeKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.92 
  }));

  const detectionKeywords = getV4ClusterKeywords('detection');
  const detectionPages = detectionKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, detectionKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.91 
  }));

  const writingKeywords = getV4ClusterKeywords('writing');
  const writingPages = writingKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, writingKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.90 
  }));

  const educationKeywords = getV4ClusterKeywords('education');
  const educationPages = educationKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, educationKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.90 
  }));

  const platformKeywords = getV4ClusterKeywords('platform');
  const platformV4Pages = platformKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, platformKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.89 
  }));

  const outputKeywords = getV4ClusterKeywords('output');
  const outputPages = outputKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, outputKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.91 
  }));

  const bulkKeywords = getV4ClusterKeywords('bulk');
  const bulkPages = bulkKeywords.map((e, i) => ({ 
    url: `${baseUrl}/${e.slug}`, 
    lastModified: getRealisticDate(i, bulkKeywords.length), 
    changeFrequency: 'daily' as const, 
    priority: 0.88 
  }));

  return [
    ...mainPages,
    ...bypassPages, ...humanizerPages, ...howtoPages, ...usecasePages,
    ...competitorPages, ...academicPages, ...professionalPages,
    ...detectorPages, ...languagePages, ...nichePages,
    ...pricingPages, ...industryPages, ...formatPages, ...speedPages, ...qualityPages,
    ...toolPages, ...problemPages, ...workflowPages, ...scorePages, ...regionPages,
    // V4
    ...comparisonPages, ...alternativePages, ...reviewPages, ...freePages, ...detectionPages,
    ...writingPages, ...educationPages, ...platformV4Pages, ...outputPages, ...bulkPages,
  ];
}
