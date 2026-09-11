/**
 * Prove every sitemap PSEO URL is a real, renderable page.
 * Run: npx tsx scripts/verify-sitemap-pages.ts
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { CLUSTER_KEYS, TARGET_PER_CLUSTER, TARGET_TOTAL, BASE_URL } from "../src/lib/pseo/types";
import { getAllEntries, getKeywordBySlug, getClusterEntries } from "../src/lib/pseo/keywords";
import { buildPseoContent } from "../src/lib/pseo/content";
import { buildRelatedLinks } from "../src/lib/pseo/related";
import { pseoPath } from "../src/lib/pseo/paths";
import { CLUSTER_META } from "../src/lib/pseo/clusters";
import { clusterPageCount, hubPath } from "../src/lib/pseo/hubs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(ROOT, "../public");

function locs(file: string): string[] {
  const xml = readFileSync(join(PUBLIC_DIR, file), "utf8");
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]!);
}

let problems = 0;
function fail(msg: string) {
  console.error("FAIL", msg);
  problems++;
}

const clusterFiles = CLUSTER_KEYS.map((k) => `sitemap-${k}.xml`);
const sitemapSlugs = new Map<string, string>();

console.log("--- Sitemap vs catalog ---");
for (const file of clusterFiles) {
  const cluster = file.replace("sitemap-", "").replace(".xml", "") as (typeof CLUSTER_KEYS)[number];
  const urls = locs(file);
  const entries = getClusterEntries(cluster);
  console.log(file.padEnd(28), urls.length);
  if (urls.length !== TARGET_PER_CLUSTER) fail(`${file} has ${urls.length} URLs, expected ${TARGET_PER_CLUSTER}`);
  const seen = new Set<string>();
  for (const url of urls) {
    const prefix = `${BASE_URL}/`;
    if (!url.startsWith(prefix)) {
      fail(`${file} bad host ${url}`);
      continue;
    }
    const slug = url.slice(prefix.length);
    if (!slug || slug.includes("/") || slug.startsWith("guides")) fail(`${file} bad slug ${url}`);
    if (seen.has(slug)) fail(`${file} duplicate ${slug}`);
    seen.add(slug);
    if (sitemapSlugs.has(slug)) fail(`slug ${slug} in both ${sitemapSlugs.get(slug)} and ${file}`);
    sitemapSlugs.set(slug, file);
    const entry = getKeywordBySlug(slug);
    if (!entry) fail(`${file} unknown slug ${slug}`);
    else if (entry.cluster !== cluster) fail(`${slug} cluster ${entry.cluster} != ${cluster}`);
    else if (pseoPath(entry.slug) !== `/${slug}`) fail(`path mismatch ${slug}`);
  }
  for (const entry of entries) {
    if (!seen.has(entry.slug)) fail(`${file} missing catalog slug ${entry.slug}`);
  }
}

if (sitemapSlugs.size !== TARGET_TOTAL) fail(`unique sitemap slugs ${sitemapSlugs.size} != ${TARGET_TOTAL}`);

console.log("\n--- Render every PSEO page ---");
const h1s = new Set<string>();
const titles = new Set<string>();
let rendered = 0;
for (const entry of getAllEntries()) {
  try {
    const data = buildPseoContent(entry);
    if (!data.metaTitle || data.metaTitle.length < 20) fail(`short title ${entry.slug}`);
    if (!data.metaDescription || data.metaDescription.length < 50) fail(`short description ${entry.slug}`);
    if (!data.h1) fail(`missing h1 ${entry.slug}`);
    if (!data.directAnswer || data.directAnswer.length < 40) fail(`weak answer ${entry.slug}`);
    if (!data.sections || data.sections.length < 4) fail(`few sections ${entry.slug}`);
    if (data.sections.some((s) => !s.title || !s.body || s.body.length < 80)) fail(`thin section ${entry.slug}`);
    if (!data.faqs || data.faqs.length < 4) fail(`few faqs ${entry.slug}`);
    if (data.faqs.some((f) => !f.q || !f.a || f.a.length < 40)) fail(`thin faq ${entry.slug}`);
    if (!data.steps || data.steps.length < 4) fail(`few steps ${entry.slug}`);
    if (!data.takeaways || data.takeaways.length < 4) fail(`few takeaways ${entry.slug}`);
    if (!CLUSTER_META[entry.cluster]) fail(`missing cluster meta ${entry.slug}`);
    if (h1s.has(data.h1)) fail(`duplicate h1 ${entry.slug} :: ${data.h1}`);
    h1s.add(data.h1);
    if (titles.has(data.metaTitle)) fail(`duplicate title ${entry.slug} :: ${data.metaTitle}`);
    titles.add(data.metaTitle);
    const related = buildRelatedLinks(entry.cluster, entry.keyword);
    if (related.length < 4) fail(`few related links ${entry.slug}`);
    for (const link of related) {
      if (!link.href.startsWith("/")) fail(`bad related href ${entry.slug} ${link.href}`);
      if (/^\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(link.href)) {
        const relSlug = link.href.slice(1);
        const staticOk = new Set(["bypass-ai-detectors", "ai-detector", "pricing", "faq", "topics", "contact"]);
        if (!staticOk.has(relSlug) && !getKeywordBySlug(relSlug)) fail(`related dead ${entry.slug} -> ${link.href}`);
      }
    }
    rendered++;
  } catch (err) {
    fail(`render threw ${entry.slug}: ${err instanceof Error ? err.message : String(err)}`);
  }
}
console.log("rendered", rendered);

console.log("\n--- Hub pages in sitemap-main ---");
const mainLocs = new Set(locs("sitemap-main.xml"));
if (!mainLocs.has(`${BASE_URL}/topics`)) fail("sitemap-main missing /topics");
for (const cluster of CLUSTER_KEYS) {
  const total = clusterPageCount(cluster);
  for (let page = 1; page <= total; page++) {
    const url = `${BASE_URL}${hubPath(cluster, page)}`;
    if (!mainLocs.has(url)) fail(`sitemap-main missing hub ${url}`);
  }
}

const otherXml = readdirSync(PUBLIC_DIR).filter((f) => /^sitemap.*\.xml$/i.test(f));
const allowed = new Set(["sitemap.xml", "sitemap-main.xml", ...clusterFiles]);
for (const file of otherXml) {
  if (!allowed.has(file)) fail(`unexpected sitemap file ${file}`);
}

console.log(problems === 0 ? "\nALL SITEMAP PAGES OK" : `\n${problems} PROBLEM(S) FOUND`);
process.exit(problems === 0 ? 0 : 1);
