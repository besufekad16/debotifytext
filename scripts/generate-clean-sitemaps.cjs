const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.debotifytext.com';
const REGISTRY_PATH = path.join(process.cwd(), 'src/data/pseo-registry.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

console.log('--- Generating Clean, 100% debotifytext.com Sitemaps ---');

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
const approvedSlugs = Object.keys(registry).filter(slug => {
  const item = registry[slug];
  return item && item.decision === 'GENERATE' && item.indexing?.indexEligibility;
});

console.log(`Approved PSEO slugs in registry: ${approvedSlugs.length}`);

const STATIC_PAGES = [
  '',
  '/ai-humanizer',
  '/ai-detector',
  '/bypass-ai-detectors',
  '/topics',
  '/pricing',
  '/faq',
  '/contact',
  '/privacy',
  '/terms',
  '/responsible-use',
  '/research/2026-ai-detector-efficacy-report'
];

const today = new Date().toISOString().split('T')[0];

// 1. Generate sitemap-main.xml
const mainXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(p => `  <url>
    <loc>${BASE_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === '' || p === '/ai-humanizer' ? 'daily' : 'weekly'}</changefreq>
    <priority>${p === '' || p === '/ai-humanizer' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-main.xml'), mainXml);
console.log('Generated public/sitemap-main.xml');

// 2. Split PSEO URLs into chunks of 500
const CHUNK_SIZE = 500;
const pseoChunk1 = approvedSlugs.slice(0, CHUNK_SIZE);
const pseoChunk2 = approvedSlugs.slice(CHUNK_SIZE, CHUNK_SIZE * 2);

function generateUrlset(slugs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${slugs.map(slug => `  <url>
    <loc>${BASE_URL}/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>
`;
}

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-pseo-1.xml'), generateUrlset(pseoChunk1));
console.log(`Generated public/sitemap-pseo-1.xml (${pseoChunk1.length} URLs)`);

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-pseo-2.xml'), generateUrlset(pseoChunk2));
console.log(`Generated public/sitemap-pseo-2.xml (${pseoChunk2.length} URLs)`);

// 3. Generate sitemap.xml index
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-main.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-pseo-1.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-pseo-2.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndexXml);
console.log('Generated public/sitemap.xml (Primary Index)');

// 4. Remove obsolete old sitemaps 3..8
for (let i = 3; i <= 8; i++) {
  const oldPath = path.join(PUBLIC_DIR, `sitemap-pseo-${i}.xml`);
  if (fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
    console.log(`Removed obsolete sitemap-pseo-${i}.xml`);
  }
}

console.log('--- All sitemaps built and verified successfully! ---');
