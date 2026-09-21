import fs from "fs";
import path from "path";

const BASE_URL = "https://www.humanifylab.com";

interface KeywordContract {
  primaryKeyword: string;
  slug: string;
  decision: "GENERATE" | "REJECT";
  indexing: {
    indexEligibility: boolean;
  };
}

const REGISTRY_PATH = path.join(process.cwd(), "src/data/pseo-registry.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const CORE_PAGES = [
  "",
  "/ai-humanizer",
  "/ai-detector",
  "/bypass-ai-detectors",
  "/research/2026-ai-detector-efficacy-report",
  "/pricing",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
  "/responsible-use",
];

const URLS_PER_SITEMAP = 5000;

function generateSitemapXml(urls: string[]): string {
  const urlBlocks = urls
    .map((url) => {
      return `  <url>\n    <loc>${BASE_URL}${url}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks}
</urlset>`;
}

function generateSitemapIndexXml(sitemaps: string[]): string {
  const sitemapBlocks = sitemaps
    .map((sitemap) => {
      return `  <sitemap>\n    <loc>${BASE_URL}/${sitemap}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapBlocks}
</sitemapindex>`;
}

async function buildSitemaps() {
  console.log("Generating sitemaps...");

  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error("pseo-registry.json not found! Please run build-pseo-index.ts first.");
    process.exit(1);
  }

  const rawData = fs.readFileSync(REGISTRY_PATH, "utf-8");
  const registry: Record<string, KeywordContract> = JSON.parse(rawData);

  // Filter for approved & indexable keywords
  const pseoUrls = Object.values(registry)
    .filter((contract) => contract.decision === "GENERATE" && contract.indexing.indexEligibility)
    .map((contract) => `/${contract.slug}`);

  console.log(`Found ${pseoUrls.length} valid PSEO URLs.`);

  const sitemapFiles: string[] = [];

  // Generate Core Sitemap
  const coreSitemapContent = generateSitemapXml(CORE_PAGES);
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap-core.xml"), coreSitemapContent);
  sitemapFiles.push("sitemap-core.xml");
  console.log("Generated sitemap-core.xml");

  // Chunk PSEO URLs and generate sitemaps
  for (let i = 0; i < pseoUrls.length; i += URLS_PER_SITEMAP) {
    const chunk = pseoUrls.slice(i, i + URLS_PER_SITEMAP);
    const sitemapIndex = Math.floor(i / URLS_PER_SITEMAP) + 1;
    const sitemapName = `sitemap-pseo-${sitemapIndex}.xml`;

    const sitemapContent = generateSitemapXml(chunk);
    fs.writeFileSync(path.join(PUBLIC_DIR, sitemapName), sitemapContent);
    sitemapFiles.push(sitemapName);
    console.log(`Generated ${sitemapName} (${chunk.length} URLs)`);
  }

  // Generate Sitemap Index
  const sitemapIndexContent = generateSitemapIndexXml(sitemapFiles);
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), sitemapIndexContent);
  console.log("Generated sitemap.xml (Index)");

  console.log("Sitemap generation complete!");
}

buildSitemaps().catch(console.error);
