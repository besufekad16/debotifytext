/**
 * Generates the 6 v2 sitemap XML files into public/sitemaps/
 * Run: node scripts/generate-v2-sitemaps.mjs
 *
 * This script is a standalone Node.js script that doesn't use TypeScript imports.
 * It reads the keyword data directly from the compiled output or uses a simplified
 * version of the slug generation logic.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.humanifylab.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'sitemaps');

function toSlug(k) {
  return k.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function generateXml(urls) {
  const now = new Date().toISOString().split('T')[0];
  const urlEntries = urls.map(({ url, priority, changefreq }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}

// Import keyword arrays from a simplified inline version
// (avoids TypeScript compilation requirement)
const CLUSTERS = {
  competitor: { priority: '0.88', changefreq: 'weekly' },
  academic:   { priority: '0.85', changefreq: 'weekly' },
  professional: { priority: '0.83', changefreq: 'weekly' },
  detector:   { priority: '0.87', changefreq: 'weekly' },
  language:   { priority: '0.82', changefreq: 'weekly' },
  niche:      { priority: '0.80', changefreq: 'weekly' },
};

// Read the pseo-data-v2.ts file and extract keywords using regex
const v2DataPath = path.join(__dirname, '..', 'src', 'lib', 'pseo-data-v2.ts');
const v2Content = fs.readFileSync(v2DataPath, 'utf-8');

// Extract each cluster array
function extractArray(content, varName) {
  const regex = new RegExp(`const ${varName}: string\\[\\] = \\[([\\s\\S]*?)\\];\\s*\\/\\/`, 'g');
  const match = regex.exec(content);
  if (!match) return [];
  const arrayContent = match[1];
  const strings = arrayContent.match(/"([^"]+)"/g) ?? [];
  return strings.map(s => s.replace(/"/g, ''));
}

// Also read v1 slugs to deduplicate
const v1DataPath = path.join(__dirname, '..', 'src', 'lib', 'pseo-data.ts');
const v1Content = fs.readFileSync(v1DataPath, 'utf-8');
const v1Strings = v1Content.match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) ?? [];
const v1Slugs = new Set(v1Strings.map(toSlug));

const clusterNames = ['COMPETITOR', 'ACADEMIC', 'PROFESSIONAL', 'DETECTOR', 'LANGUAGE', 'NICHE'];
const clusterKeys  = ['competitor', 'academic', 'professional', 'detector', 'language', 'niche'];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const globalSeen = new Set(v1Slugs);
let totalGenerated = 0;

clusterNames.forEach((name, i) => {
  const key = clusterKeys[i];
  const config = CLUSTERS[key];
  const keywords = extractArray(v2Content, name);

  const urls = [];
  const seen = new Set();

  for (const kw of keywords) {
    const slug = toSlug(kw);
    if (!slug || globalSeen.has(slug) || seen.has(slug)) continue;
    seen.add(slug);
    globalSeen.add(slug);
    urls.push({
      url: `${BASE_URL}/${slug}`,
      priority: config.priority,
      changefreq: config.changefreq,
    });
  }

  const xml = generateXml(urls);
  const filename = `sitemap-${key}.xml`;
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), xml, 'utf-8');
  console.log(`✓ ${filename}: ${urls.length} URLs`);
  totalGenerated += urls.length;
});

console.log(`\nTotal v2 URLs generated: ${totalGenerated}`);
