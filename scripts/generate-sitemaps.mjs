/**
 * Simple Sitemap Generator (ES Module version)
 * Run with: node scripts/generate-sitemaps.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://www.humanifylab.com';
const MAX_URLS_PER_SITEMAP = 50000;
const OUTPUT_DIR = './public/sitemaps';

// Read keywords from JSON file
const keywordsPath = path.join(__dirname, '../public/data/keywords.json');
const keywordsContent = fs.readFileSync(keywordsPath, 'utf-8');
const seoKeywords = JSON.parse(keywordsContent);

function generateSlug(keyword) {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateSitemapXML(urls) {
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

function generateSitemapIndex(sitemapFiles) {
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

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function generateSitemaps() {
  console.log('🚀 Starting sitemap generation...\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const lastmod = new Date().toISOString();

  // Main pages (high priority)
  const mainPages = [
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
  const slugs = seoKeywords.map(keyword => generateSlug(keyword));
  console.log(`✓ Loaded ${slugs.length.toLocaleString()} keywords\n`);

  // Create keyword page URLs
  const keywordPages = slugs.map((slug) => ({
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
  const sitemapFiles = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const filename = `sitemap-${i + 1}.xml`;
    const xml = generateSitemapXML(chunk);
    
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), xml, 'utf-8');
    sitemapFiles.push(filename);
    
    console.log(`✓ Generated ${filename} (${chunk.length.toLocaleString()} URLs)`);
  }

  // Generate sitemap index
  const indexXML = generateSitemapIndex(sitemapFiles);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-index.xml'), indexXML, 'utf-8');
  console.log(`\n✓ Generated sitemap-index.xml`);

  // Generate main sitemap.xml that points to index
  const mainSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemaps/sitemap-index.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
  
  fs.writeFileSync('./public/sitemap.xml', mainSitemapXML, 'utf-8');
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

// Run
generateSitemaps().catch(console.error);
