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
  '/research',
  '/research/2026-ai-detector-efficacy-report',
  '/topics',
  '/topics/guides',
  '/topics/detectors',
  '/topics/bypass',
  '/topics/humanizer',
  '/pricing',
  '/faq',
  '/contact',
  '/privacy',
  '/terms',
  '/responsible-use'
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

// 2. Put core high-priority target slugs first
const priorityPrefixes = [
  'free-ai-humanizer',
  'bypass-turnitin-ai-detection',
  'bypass-gptzero',
  'bypass-originality-ai',
  'bypass-zerogpt',
  'bypass-copyleaks',
  'bypass-winston-ai',
  'bypass-sapling',
  'ai-humanizer-2026',
  'ai-text-humanizer',
  'bypass-ai-detection',
  'ai-humanizer-usa',
  'ai-humanizer-uk',
  'ai-humanizer-canada'
];

const prioritySlugs = approvedSlugs.filter(s => priorityPrefixes.includes(s));
const otherSlugs = approvedSlugs.filter(s => !priorityPrefixes.includes(s));
const sortedSlugs = [...prioritySlugs, ...otherSlugs];

const CHUNK_SIZE = 550;
const chunks = [];
for (let i = 0; i < sortedSlugs.length; i += CHUNK_SIZE) {
  chunks.push(sortedSlugs.slice(i, i + CHUNK_SIZE));
}

function generateUrlset(slugs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${slugs.map(slug => `  <url>
    <loc>${BASE_URL}/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>
`;
}

chunks.forEach((chunk, idx) => {
  const filename = `sitemap-pseo-${idx + 1}.xml`;
  fs.writeFileSync(path.join(PUBLIC_DIR, filename), generateUrlset(chunk));
  console.log(`Generated public/${filename} (${chunk.length} URLs)`);
});

// 3. Generate sitemap.xml index
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-main.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
${chunks.map((_, idx) => `  <sitemap>
    <loc>${BASE_URL}/sitemap-pseo-${idx + 1}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')}
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
