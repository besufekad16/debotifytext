/**
 * Regenerates ALL sitemaps from the live PSEO data (v1–v5).
 *
 * Output:
 *   public/sitemap.xml          — sitemap index referencing every cluster sitemap
 *   public/sitemap-main.xml     — core marketing pages
 *   public/sitemap-{cluster}.xml — one per PSEO cluster (35 total)
 *
 * Run: npx tsx scripts/generate-all-sitemaps.ts
 */
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getClusterKeywords } from "../src/lib/pseo-data";
import { getV2ClusterKeywords } from "../src/lib/pseo-data-v2";
import { getV3ClusterKeywords } from "../src/lib/pseo-data-v3";
import { getV4ClusterKeywords } from "../src/lib/pseo-data-v4";
import { getV5ClusterKeywords } from "../src/lib/pseo-data-v5";
import { getGeoClusterKeywords } from "../src/lib/pseo-data-geo";
import { CLUSTER_ORDER } from "../src/lib/pseo-clusters";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://www.humanifylab.com";
const PUBLIC_DIR = join(__dirname, "../public");
const TODAY = new Date().toISOString().split("T")[0]!;

interface SlugEntry {
  slug: string;
  seed: number;
}

// Mirrors getModifiedDate in src/app/[keyword]/page.tsx: "updated" always
// reflects the current date (today), since it is only ever consumed by
// structured data, not rendered in the UI.
function getLastMod(_seed: number): string {
  return TODAY;
}

function urlsetXml(entries: SlugEntry[], priority: string): string {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const e of entries) {
    if (seen.has(e.slug) || e.slug.length < 5 || e.slug.length > 120) continue;
    seen.add(e.slug);
    urls.push(`  <url>
    <loc>${BASE_URL}/${e.slug}</loc>
    <lastmod>${getLastMod(e.seed)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

// ── Cluster definitions ──────────────────────────────────────────────────────
const V1_CLUSTERS = ["bypass", "humanizer", "howto", "usecase"] as const;
const V2_CLUSTERS = ["competitor", "academic", "professional", "detector", "language", "niche"] as const;
const V3_CLUSTERS = ["pricing", "industry", "format", "speed", "quality", "tool", "problem", "workflow", "score", "region"] as const;
const V4_CLUSTERS = ["comparison", "alternative", "review", "free", "detection", "writing", "education", "platform", "output", "bulk"] as const;
const V5_CLUSTERS = ["city", "question", "feature", "length", "scenario"] as const;

const PRIORITIES: Record<string, string> = {
  bypass: "0.9", humanizer: "0.9", howto: "0.8", usecase: "0.8",
  competitor: "0.9", academic: "0.8", professional: "0.8", detector: "0.9", language: "0.7", niche: "0.7",
  pricing: "0.8", industry: "0.7", format: "0.7", speed: "0.7", quality: "0.7",
  tool: "0.7", problem: "0.8", workflow: "0.7", score: "0.8", region: "0.7",
  comparison: "0.9", alternative: "0.9", review: "0.8", free: "0.8", detection: "0.8",
  writing: "0.8", education: "0.8", platform: "0.7", output: "0.8", bulk: "0.7",
  city: "0.7", question: "0.8", feature: "0.7", length: "0.7", scenario: "0.8",
  geo: "0.9",
};

// platform cluster keeps its historical filename to preserve indexed sitemap URLs
function sitemapFilename(cluster: string): string {
  return cluster === "platform" ? "sitemap-platform-v4.xml" : `sitemap-${cluster}.xml`;
}

const written: { file: string; count: number }[] = [];

function writeSitemap(cluster: string, entries: SlugEntry[]) {
  const file = sitemapFilename(cluster);
  const xml = urlsetXml(entries, PRIORITIES[cluster] ?? "0.7");
  writeFileSync(join(PUBLIC_DIR, file), xml, "utf8");
  written.push({ file, count: new Set(entries.map((e) => e.slug)).size });
}

for (const c of V1_CLUSTERS) writeSitemap(c, getClusterKeywords(c).map((e) => ({ slug: e.slug, seed: e.seed })));
for (const c of V2_CLUSTERS) writeSitemap(c, getV2ClusterKeywords(c).map((e) => ({ slug: e.slug, seed: e.seed })));
for (const c of V3_CLUSTERS) writeSitemap(c, getV3ClusterKeywords(c).map((e) => ({ slug: e.slug, seed: e.seed })));
for (const c of V4_CLUSTERS) writeSitemap(c, getV4ClusterKeywords(c).map((e) => ({ slug: e.slug, seed: e.seed })));
for (const c of V5_CLUSTERS) writeSitemap(c, getV5ClusterKeywords(c).map((e) => ({ slug: e.slug, seed: e.seed })));
// Geo pages are hand-authored, high-priority flagship pages — small enough
// to fold into sitemap-main.xml rather than warranting their own file.
const GEO_ENTRIES = getGeoClusterKeywords().map((e) => ({ slug: e.slug, seed: e.seed }));

// ── Main pages sitemap ───────────────────────────────────────────────────────
const MAIN_PAGES = [
  { path: "", priority: "1.0", changefreq: "weekly" },
  { path: "/pricing", priority: "0.9", changefreq: "weekly" },
  { path: "/faq", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/responsible-use", priority: "0.5", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/bypass-ai-detectors", priority: "0.9", changefreq: "weekly" },
  { path: "/ai-detector", priority: "0.9", changefreq: "weekly" },
  { path: "/topics", priority: "0.8", changefreq: "weekly" },
  ...CLUSTER_ORDER.map((c) => ({ path: `/topics/${c}`, priority: "0.7", changefreq: "weekly" })),
  ...GEO_ENTRIES.map((e) => ({ path: `/${e.slug}`, priority: "0.9", changefreq: "weekly" })),
];

const mainXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${MAIN_PAGES.map((p) => `  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
writeFileSync(join(PUBLIC_DIR, "sitemap-main.xml"), mainXml, "utf8");
written.push({ file: "sitemap-main.xml", count: MAIN_PAGES.length });

// ── Sitemap index ────────────────────────────────────────────────────────────
const allFiles = ["sitemap-main.xml", ...[...V1_CLUSTERS, ...V2_CLUSTERS, ...V3_CLUSTERS, ...V4_CLUSTERS, ...V5_CLUSTERS].map(sitemapFilename)];
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allFiles.map((f) => `  <sitemap>
    <loc>${BASE_URL}/${f}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;
writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), indexXml, "utf8");

let total = 0;
for (const w of written) {
  console.log(`${w.file.padEnd(30)} ${w.count} urls`);
  total += w.count;
}
console.log(`\nsitemap.xml (index)            ${allFiles.length} sitemaps`);
console.log(`TOTAL URLS: ${total}`);
