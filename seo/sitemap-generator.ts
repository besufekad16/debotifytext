/**
 * Production-Grade Sitemap Generator
 * Splits sitemaps into 50k URL chunks per Google guidelines
 * Generates sitemap index for all chunks
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import keywords directly
import seoKeywords from '../src/seo-keywords-100k.js';

function generateSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getAllSlugs(): string[] {
  return seoKeywords.map(keyword => generateSlug(keyword));
}

const BASE_URL = 'https://www.unrobotictext.com';
const MAX_URLS_PER_SITEMAP = 50000;
const OUTPUT_DIR = './public/sitemaps';

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

function generateSitemapXML(urls: SitemapURL[]): string {
  const urlEntries = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function generateSitemapIndex(sitemapFiles: string[]): string {
  const lastmod = new Date().toISOString();
  const sitemapEntries = sitemapFiles
    .map(
      (file) => `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/${file}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function generateSitemaps() {
  console.log('🚀 Starting sitemap generation...\n');

  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const lastmod = new Date().toISOString();

  // Main pages (high priority)
  const mainPages: SitemapURL[] = [
    {
      loc: BASE_URL,
      lastmod,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${BASE_URL}/pricing`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.9,
    },
  ];

  // Get all keyword slugs
  console.log('📊 Loading keywords...');
  const slugs = getAllSlugs();
  console.log(`✓ Loaded ${slugs.length.toLocaleString()} keywords\n`);

  // Create keyword page URLs
  const keywordPages: SitemapURL[] = slugs.map((slug) => ({
    loc: `${BASE_URL}/${slug}`,
    lastmod,
    changefreq: 'weekly',
    priority: 0.8,
  }));

  // Combine all URLs
  const allURLs = [...mainPages, ...keywordPages];
  console.log(`📝 Total URLs: ${allURLs.length.toLocaleString()}\n`);

  // Split into chunks
  const chunks = chunkArray(allURLs, MAX_URLS_PER_SITEMAP);
  console.log(`📦 Split into ${chunks.length} sitemap files\n`);

  // Generate individual sitemaps
  const sitemapFiles: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    const filename = `sitemap-${i + 1}.xml`;
    const xml = generateSitemapXML(chunk);
    
    writeFileSync(join(OUTPUT_DIR, filename), xml, 'utf-8');
    sitemapFiles.push(filename);
    
    console.log(`✓ Generated ${filename} (${chunk.length.toLocaleString()} URLs)`);
  }

  // Generate sitemap index
  const indexXML = generateSitemapIndex(sitemapFiles);
  writeFileSync(join(OUTPUT_DIR, 'sitemap-index.xml'), indexXML, 'utf-8');
  console.log(`\n✓ Generated sitemap-index.xml`);

  // Generate main sitemap.xml that points to index
  const mainSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemaps/sitemap-index.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
  
  writeFileSync('./public/sitemap.xml', mainSitemapXML, 'utf-8');
  console.log(`✓ Generated public/sitemap.xml (index pointer)\n`);

  // Generate stats
  console.log('📊 SITEMAP STATISTICS:');
  console.log(`   Total URLs: ${allURLs.length.toLocaleString()}`);
  console.log(`   Sitemap files: ${sitemapFiles.length}`);
  console.log(`   Max URLs per file: ${MAX_URLS_PER_SITEMAP.toLocaleString()}`);
  console.log(`   Output directory: ${OUTPUT_DIR}\n`);

  console.log('✅ Sitemap generation complete!');
  
  return {
    totalURLs: allURLs.length,
    sitemapCount: sitemapFiles.length,
    files: sitemapFiles,
  };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemaps().catch(console.error);
}
