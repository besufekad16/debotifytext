// Lazy-load keywords from JSON file (not compiled with TypeScript)
// This prevents the 11.6 MB keyword file from slowing down builds
import fs from 'fs';
import path from 'path';

let cachedKeywords: string[] | null = null;

export interface KeywordData {
  keyword: string;
  slug: string;
  category: 'humanizer' | 'ai-tool' | 'brand' | 'how-to';
  volume: 'high' | 'medium' | 'low';
  variations: string[];
}

// Get base keywords from JSON file (lazy-loaded and cached)
export function getBaseKeywords(): string[] {
  if (cachedKeywords) {
    return cachedKeywords;
  }

  // Read from public/data/keywords.json
  const keywordsPath = path.join(process.cwd(), 'public', 'data', 'keywords.json');
  const keywordsContent = fs.readFileSync(keywordsPath, 'utf-8');
  cachedKeywords = JSON.parse(keywordsContent);
  
  return cachedKeywords!;
}

// Generate slug from keyword
export function generateSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Categorize keyword
export function categorizeKeyword(keyword: string): KeywordData['category'] {
  const lower = keyword.toLowerCase();

  if (lower.includes('how to') || lower.includes('guide')) {
    return 'how-to';
  }

  if (
    lower.includes('naturalwrite') ||
    lower.includes('quillbot') ||
    lower.includes('grammarly') ||
    lower.includes('chatgpt') ||
    lower.includes('gpt')
  ) {
    return 'brand';
  }

  if (
    lower.includes('tool') ||
    lower.includes('software') ||
    lower.includes('app') ||
    lower.includes('platform')
  ) {
    return 'ai-tool';
  }

  return 'humanizer';
}

// Estimate search volume
export function estimateVolume(keyword: string): KeywordData['volume'] {
  const lower = keyword.toLowerCase();

  // High volume keywords
  const highVolumeTerms = [
    'best', 'free', 'chatgpt', 'quillbot', 'grammarly',
    'essay', 'ai humanizer', 'humanize ai', 'bypass'
  ];

  if (highVolumeTerms.some(term => lower.includes(term))) {
    return 'high';
  }

  // Low volume keywords
  if (lower.includes('2025') || lower.includes('2026') || lower.includes('pro')) {
    return 'low';
  }

  return 'medium';
}

// Generate keyword variations
export function generateVariations(baseKeyword: string): string[] {
  // No need to generate variations since we already have 100k keywords
  return [baseKeyword];
}

// Get all expanded keywords
export function getAllKeywords(): KeywordData[] {
  const baseKeywords = getBaseKeywords();
  const allKeywords: KeywordData[] = [];

  baseKeywords.forEach(keyword => {
    allKeywords.push({
      keyword,
      slug: generateSlug(keyword),
      category: categorizeKeyword(keyword),
      volume: estimateVolume(keyword),
      variations: []
    });
  });

  return allKeywords;
}

// Get keyword by slug (optimized - doesn't load all keywords)
export function getKeywordBySlug(slug: string): KeywordData | undefined {
  const baseKeywords = getBaseKeywords();
  
  // Find the keyword that matches the slug
  for (const keyword of baseKeywords) {
    const keywordSlug = generateSlug(keyword);
    if (keywordSlug === slug) {
      return {
        keyword,
        slug: keywordSlug,
        category: categorizeKeyword(keyword),
        volume: estimateVolume(keyword),
        variations: []
      };
    }
  }
  
  return undefined;
}

// Get all slugs for static generation
export function getAllSlugs(): string[] {
  const allKeywords = getAllKeywords();
  return allKeywords.map(k => k.slug);
}
