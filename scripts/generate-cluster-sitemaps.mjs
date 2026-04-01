/**
 * HumanifyLab — Cluster Sitemap Generator
 * Generates 4 standalone sitemaps (one per cluster) in /public
 * Each sitemap is a complete, self-contained urlset — NOT a sitemap index
 * Submit all 4 directly to Google Search Console and Bing Webmaster Tools
 *
 * Run: node scripts/generate-cluster-sitemaps.mjs
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const BASE_URL = 'https://www.humanifylab.com';
const NOW = new Date().toISOString();
const TODAY = NOW.split('T')[0];

// Priority by cluster (bypass = highest commercial intent)
const CLUSTER_CONFIG = {
  bypass: {
    filename: 'sitemap-bypass.xml',
    priority: '0.9',
    changefreq: 'weekly',
    label: 'Bypass Cluster (AI Detector Bypass)',
  },
  humanizer: {
    filename: 'sitemap-humanizer.xml',
    priority: '0.85',
    changefreq: 'weekly',
    label: 'Humanizer Cluster (AI Humanizer Tools)',
  },
  howto: {
    filename: 'sitemap-howto.xml',
    priority: '0.8',
    changefreq: 'weekly',
    label: 'How-To Cluster (Educational Guides)',
  },
  usecase: {
    filename: 'sitemap-usecase.xml',
    priority: '0.75',
    changefreq: 'weekly',
    label: 'Use Case Cluster (Audience-Specific)',
  },
};

// Spread lastmod dates across 2025-2026 for natural crawl signals
function getLastmod(index, total) {
  const start = new Date('2025-06-01').getTime();
  const end = new Date('2026-03-01').getTime();
  const ts = start + ((index / total) * (end - start));
  return new Date(ts).toISOString().split('T')[0];
}

function buildSitemapXml(urls, priority, changefreq) {
  const urlEntries = urls
    .map((url, i) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${getLastmod(i, urls.length)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}

async function run() {
  // Load slug data
  const slugsPath = join(ROOT, 'public', 'data', 'pseo-slugs.json');
  let slugData;
  try {
    slugData = JSON.parse(readFileSync(slugsPath, 'utf-8'));
  } catch {
    console.error('❌ public/data/pseo-slugs.json not found.');
    console.error('   Run: npx tsx scripts/export-slugs.ts first');
    process.exit(1);
  }

  const { bypass, humanizer, howto, usecase } = slugData;
  const total = bypass.length + humanizer.length + howto.length + usecase.length;

  console.log(`\n🚀 HumanifyLab Cluster Sitemap Generator`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`📊 Total unique URLs: ${total.toLocaleString()}`);
  console.log(`   bypass:    ${bypass.length}`);
  console.log(`   humanizer: ${humanizer.length}`);
  console.log(`   howto:     ${howto.length}`);
  console.log(`   usecase:   ${usecase.length}`);
  console.log(`${'─'.repeat(50)}\n`);

  const clusterData = { bypass, humanizer, howto, usecase };

  for (const [cluster, config] of Object.entries(CLUSTER_CONFIG)) {
    const slugs = clusterData[cluster];
    const urls = slugs.map(slug => `${BASE_URL}/${slug}`);
    const xml = buildSitemapXml(urls, config.priority, config.changefreq);
    const outPath = join(ROOT, 'public', config.filename);
    writeFileSync(outPath, xml, 'utf-8');
    console.log(`✅ ${config.filename}`);
    console.log(`   ${config.label}`);
    console.log(`   ${urls.length} URLs | priority ${config.priority} | ${config.changefreq}`);
    console.log(`   Submit to: https://search.google.com/search-console`);
    console.log(`   URL: ${BASE_URL}/${config.filename}\n`);
  }

  // Also update robots.txt sitemap references
  console.log(`${'─'.repeat(50)}`);
  console.log(`📋 Add these to your robots.txt Sitemap directives:`);
  for (const config of Object.values(CLUSTER_CONFIG)) {
    console.log(`   Sitemap: ${BASE_URL}/${config.filename}`);
  }
  console.log(`${'─'.repeat(50)}`);
  console.log(`\n✅ All 4 cluster sitemaps generated in /public`);
  console.log(`   Submit each one individually to Google Search Console`);
  console.log(`   and Bing Webmaster Tools for maximum indexing speed.\n`);
}

run().catch(console.error);
