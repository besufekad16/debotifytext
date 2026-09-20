/**
 * Writes sitemap-main.xml plus 8 PSEO sitemaps (5,000 URLs each) and the index.
 * Run: npx tsx scripts/generate-all-sitemaps.ts
 */
import { writeFileSync, readdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getClusterEntries } from "../src/lib/pseo/keywords";
import { CLUSTER_KEYS } from "../src/lib/pseo/types";
import { CLUSTER_ORDER as HUBS } from "../src/lib/pseo/clusters";
import { clusterPageCount, hubPath } from "../src/lib/pseo/hubs";
import { pseoPath } from "../src/lib/pseo/paths";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://www.humanifylab.com";
const PUBLIC_DIR = join(__dirname, "../public");
const TODAY = new Date().toISOString().split("T")[0]!;

function lastmod(seed: number): string {
  const end = Date.now();
  const start = end - 240 * 24 * 60 * 60 * 1000;
  const ts = start + ((Math.abs(seed) % 500) / 500) * (end - start);
  return new Date(ts).toISOString().split("T")[0]!;
}

function urlset(urls: { loc: string; lastmod: string; changefreq: string; priority: string }[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

for (const file of readdirSync(PUBLIC_DIR)) {
  if (/^sitemap.*\.xml$/i.test(file)) {
    unlinkSync(join(PUBLIC_DIR, file));
  }
}

const written: string[] = [];

const allPriority: any[] = [];
const allSecondary: any[] = [];

for (const cluster of CLUSTER_KEYS) {
  const entries = getClusterEntries(cluster);
  for (const e of entries) {
    if (e.priority) {
      allPriority.push(e);
    } else {
      allSecondary.push(e);
    }
  }
}

function chunkArray(array: any[], size: number) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

const priorityChunks = chunkArray(allPriority, 5000);
priorityChunks.forEach((chunk, i) => {
  const xml = urlset(chunk.map((e) => ({
    loc: `${BASE_URL}${pseoPath(e.slug)}`,
    lastmod: lastmod(e.seed),
    changefreq: "weekly",
    priority: "0.9",
  })));
  const name = `sitemap-priority-${i + 1}.xml`;
  writeFileSync(join(PUBLIC_DIR, name), xml, "utf8");
  written.push(name);
  console.log(`${name.padEnd(28)} ${chunk.length}`);
});

const secondaryChunks = chunkArray(allSecondary, 5000);
secondaryChunks.forEach((chunk, i) => {
  const xml = urlset(chunk.map((e) => ({
    loc: `${BASE_URL}${pseoPath(e.slug)}`,
    lastmod: lastmod(e.seed),
    changefreq: "monthly",
    priority: "0.7",
  })));
  const name = `sitemap-secondary-${i + 1}.xml`;
  writeFileSync(join(PUBLIC_DIR, name), xml, "utf8");
  written.push(name);
  console.log(`${name.padEnd(28)} ${chunk.length}`);
});

const mainPages = [
  { path: "", priority: "1.0" },
  { path: "/ai-humanizer", priority: "1.0" },
  { path: "/pricing", priority: "0.9" },
  { path: "/faq", priority: "0.8" },
  { path: "/contact", priority: "0.6" },
  { path: "/responsible-use", priority: "0.5" },
  { path: "/terms", priority: "0.3" },
  { path: "/privacy", priority: "0.3" },
  { path: "/bypass-ai-detectors", priority: "0.9" },
  { path: "/ai-detector", priority: "0.9" },
  { path: "/llms.txt", priority: "0.7" },
  { path: "/topics", priority: "0.8" },
];

const hubPages: { path: string; priority: string }[] = [];
for (const cluster of HUBS) {
  const total = clusterPageCount(cluster);
  for (let p = 1; p <= total; p++) {
    hubPages.push({ path: hubPath(cluster, p), priority: p === 1 ? "0.75" : "0.55" });
  }
}

const mainXml = urlset(
  [...mainPages, ...hubPages].map((p) => ({
    loc: `${BASE_URL}${p.path}`,
    lastmod: TODAY,
    changefreq: "weekly",
    priority: p.priority,
  })),
);
writeFileSync(join(PUBLIC_DIR, "sitemap-main.xml"), mainXml, "utf8");
written.unshift("sitemap-main.xml");
console.log(`${"sitemap-main.xml".padEnd(28)} ${mainPages.length + hubPages.length}`);

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${written.map((f) => `  <sitemap>
    <loc>${BASE_URL}/${f}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>
`;
writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), indexXml, "utf8");
console.log("sitemap.xml index", written.length, "sitemaps");
