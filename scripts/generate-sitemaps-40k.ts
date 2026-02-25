/**
 * Professional Sitemap Generator for 40,000 Keywords
 * - Main pages in sitemap.xml (homepage, pricing)
 * - Keyword pages in sitemaps 1-8 (5,000 URLs each)
 */

import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://www.humanifylab.com';
const MAX_URLS_PER_SITEMAP = 5000;
const OUTPUT_DIR = './public/sitemaps';

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

function generateSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateSitemapXML(urls: SitemapURL[]): string {
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function generateSitemapIndex(sitemapFiles: string[]): string {
  const lastmod = new Date().toISOString();
  const sitemapEntries = sitemapFiles
    .map(
      (file) => `  <sitemap>
    <loc>${BASE_URL}/${file}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

async function generateSitemaps() {
  console.log('🚀 Starting professional sitemap generation...\n');

  // Clean up old sitemaps
  console.log('🧹 Cleaning up old sitemaps...');
  try {
    const files = readdirSync(OUTPUT_DIR);
    files.forEach(file => {
      if (file.endsWith('.xml')) {
        unlinkSync(join(OUTPUT_DIR, file));
      }
    });
    console.log('✓ Old sitemaps removed\n');
  } catch (error) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✓ Created sitemaps directory\n');
  }

  const lastmod = new Date().toISOString();

  // Main pages (will go in separate sitemap.xml)
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
    {
      loc: `${BASE_URL}/faq`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${BASE_URL}/contact`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${BASE_URL}/sign-up`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${BASE_URL}/sign-in`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${BASE_URL}/terms`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: `${BASE_URL}/privacy`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: `${BASE_URL}/responsible-use`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: `${BASE_URL}/account`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.5,
    },
  ];

  // Load keywords from JSON
  console.log('📊 Loading keywords...');
  const keywordsPath = join(process.cwd(), 'public', 'data', 'keywords.json');
  const keywordsContent = await import('fs').then(fs => 
    fs.promises.readFile(keywordsPath, 'utf-8')
  );
  const keywords: string[] = JSON.parse(keywordsContent);
  console.log(`✓ Loaded ${keywords.length.toLocaleString()} keywords\n`);

  // Create keyword page URLs
  const keywordPages: SitemapURL[] = keywords.map((keyword) => ({
    loc: `${BASE_URL}/${generateSlug(keyword)}`,
    lastmod,
    changefreq: 'weekly',
    priority: 0.8,
  }));

  console.log(`📝 Main pages: ${mainPages.length}`);
  console.log(`📝 Keyword pages: ${keywordPages.length.toLocaleString()}\n`);

  // Split keyword pages into 8 sitemaps (5,000 URLs each)
  const chunks: SitemapURL[][] = [];
  
  for (let i = 0; i < 8; i++) {
    const start = i * 5000;
    const end = Math.min(start + 5000, keywordPages.length);
    chunks.push(keywordPages.slice(start, end));
  }
  
  console.log(`📦 Creating 8 keyword sitemaps + 1 main sitemap\n`);

  // Generate keyword sitemaps (sitemap-1.xml through sitemap-8.xml)
  const sitemapFiles: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i] || [];
    if (chunk.length === 0) continue;
    
    const filename = `sitemap-${i + 1}.xml`;
    const xml = generateSitemapXML(chunk);
    
    writeFileSync(join(OUTPUT_DIR, filename), xml, 'utf-8');
    sitemapFiles.push(`sitemaps/${filename}`);
    
    console.log(`✓ Generated sitemaps/${filename} (${chunk.length.toLocaleString()} keyword URLs)`);
  }

  // Generate main sitemap.xml (only main pages)
  const mainSitemapXML = generateSitemapXML(mainPages);
  writeFileSync('./public/sitemap.xml', mainSitemapXML, 'utf-8');
  console.log(`\n✓ Generated public/sitemap.xml (${mainPages.length} main pages)`);

  // Generate sitemap index (references main sitemap + keyword sitemaps)
  const allSitemapFiles = ['sitemap.xml', ...sitemapFiles];
  const indexXML = generateSitemapIndex(allSitemapFiles);
  writeFileSync(join(OUTPUT_DIR, 'sitemap-index.xml'), indexXML, 'utf-8');
  console.log(`✓ Generated sitemaps/sitemap-index.xml (references ${allSitemapFiles.length} sitemaps)\n`);

  // Update robots.txt
  const robotsTxt = `# HumanifyLab - Professional SEO Configuration
# Website: https://www.humanifylab.com
# Last Updated: ${new Date().toISOString().split('T')[0]}

User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /account/
Disallow: /team/
Disallow: /api-keys/

# Main Sitemap (10 main pages)
Sitemap: ${BASE_URL}/sitemap.xml

# Sitemap Index (references all sitemaps)
Sitemap: ${BASE_URL}/sitemaps/sitemap-index.xml

# Keyword Sitemaps (40,000 keyword pages)
Sitemap: ${BASE_URL}/sitemaps/sitemap-1.xml
Sitemap: ${BASE_URL}/sitemaps/sitemap-2.xml
Sitemap: ${BASE_URL}/sitemaps/sitemap-3.xml
Sitemap: ${BASE_URL}/sitemaps/sitemap-4.xml
Sitemap: ${BASE_URL}/sitemaps/sitemap-5.xml
Sitemap: ${BASE_URL}/sitemaps/sitemap-6.xml
Sitemap: ${BASE_URL}/sitemaps/sitemap-7.xml
Sitemap: ${BASE_URL}/sitemaps/sitemap-8.xml

# Crawl Settings
Crawl-delay: 0

# Host
Host: ${BASE_URL}
`;
  
  writeFileSync('./public/robots.txt', robotsTxt, 'utf-8');
  console.log(`✓ Updated robots.txt with all sitemaps\n`);

  // Generate stats
  const totalKeywordURLs = keywordPages.length;
  const totalURLs = mainPages.length + totalKeywordURLs;
  
  console.log('📊 SITEMAP STATISTICS:');
  console.log(`   Main pages: ${mainPages.length} (in sitemap.xml)`);
  console.log(`   Keyword pages: ${totalKeywordURLs.toLocaleString()} (in sitemaps 1-8)`);
  console.log(`   Total URLs: ${totalURLs.toLocaleString()}`);
  console.log(`   Keyword sitemaps: 8`);
  console.log(`   URLs per keyword sitemap: ~${Math.floor(totalKeywordURLs / 8).toLocaleString()}`);
  console.log(`   Max URLs per sitemap: ${MAX_URLS_PER_SITEMAP.toLocaleString()}`);
  console.log(`   Output directory: ${OUTPUT_DIR}\n`);

  // Verify all sitemaps are under limit
  let allValid = true;
  chunks.forEach((chunk, i) => {
    if (chunk.length > MAX_URLS_PER_SITEMAP) {
      console.log(`❌ sitemap-${i + 1}.xml exceeds limit: ${chunk.length} URLs`);
      allValid = false;
    }
  });

  if (allValid) {
    console.log('✅ All sitemaps are within Google\'s 5,000 URL limit!');
  }

  console.log('\n✅ Professional sitemap generation complete!');
  console.log('\n📋 Sitemap Structure:');
  console.log('   public/sitemap.xml → Main pages (homepage, pricing)');
  console.log('   public/sitemaps/sitemap-1.xml → Keywords 1-5,000');
  console.log('   public/sitemaps/sitemap-2.xml → Keywords 5,001-10,000');
  console.log('   public/sitemaps/sitemap-3.xml → Keywords 10,001-15,000');
  console.log('   public/sitemaps/sitemap-4.xml → Keywords 15,001-20,000');
  console.log('   public/sitemaps/sitemap-5.xml → Keywords 20,001-25,000');
  console.log('   public/sitemaps/sitemap-6.xml → Keywords 25,001-30,000');
  console.log('   public/sitemaps/sitemap-7.xml → Keywords 30,001-35,000');
  console.log('   public/sitemaps/sitemap-8.xml → Keywords 35,001-40,000');
  console.log('   public/sitemaps/sitemap-index.xml → Index of all sitemaps\n');
  
  return {
    totalURLs,
    mainPages: mainPages.length,
    keywordPages: totalKeywordURLs,
    sitemapCount: 8,
    files: sitemapFiles,
  };
}

// Run if called directly
generateSitemaps().catch(console.error);
