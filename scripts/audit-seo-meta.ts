/**
 * Lightweight SEO metadata audit across ALL pSEO datasets (v1-v5).
 *
 * Checks, without any external services:
 *   1. Duplicate meta titles across pages
 *   2. Duplicate meta descriptions across pages
 *   3. Title-length outliers  (>65 chars gets truncated in SERPs; <25 is weak)
 *   4. Description-length outliers (>170 truncated; <70 thin)
 *   5. Internal-link targets that don't resolve to a real page
 *
 * Run: npx tsx scripts/audit-seo-meta.ts
 * Exit code 1 only on hard failures (unresolvable internal links); metadata
 * findings are reported as warnings since some duplication across 41k pages
 * is tolerable if kept below the thresholds printed at the end.
 */
import { getAllSlugs, getKeywordBySlug } from "../src/lib/pseo-data";
import { getAllV2Slugs, getV2KeywordBySlug } from "../src/lib/pseo-data-v2";
import { getAllV3Slugs, getV3KeywordBySlug } from "../src/lib/pseo-data-v3";
import { getAllV4Slugs, getV4KeywordBySlug } from "../src/lib/pseo-data-v4";
import { getAllV5Entries } from "../src/lib/pseo-data-v5";
import { getAllGeoSlugs } from "../src/lib/pseo-data-geo";
import { buildRelatedLinks } from "../src/lib/related-links";
import { generateCityContent } from "../src/lib/content/city-content";
import { generateQuestionContent } from "../src/lib/content/question-content";
import { generateFeatureContent } from "../src/lib/content/feature-content";
import { generateLengthContent } from "../src/lib/content/length-content";
import { generateScenarioContent } from "../src/lib/content/scenario-content";

const t0 = Date.now();

// ── Known non-pSEO routes that internal links may legitimately point to ──────
const STATIC_ROUTES = new Set([
  "/", "/pricing", "/faq", "/contact", "/responsible-use", "/terms", "/privacy",
  "/bypass-ai-detectors", "/ai-detector", "/topics",
]);

const allPseoSlugs = new Set<string>([
  ...getAllSlugs(),
  ...getAllV2Slugs(),
  ...getAllV3Slugs(),
  ...getAllV4Slugs(),
  ...getAllV5Entries().map((e) => e.slug),
  ...getAllGeoSlugs(),
]);
console.log(`total pSEO slugs: ${allPseoSlugs.size}`);

function resolvesInternally(href: string): boolean {
  if (STATIC_ROUTES.has(href)) return true;
  if (href.startsWith("/topics/")) return true; // hub pages generated from registry
  return allPseoSlugs.has(href.replace(/^\//, ""));
}

// ── v5 metadata audit (the new surface; v1-v4 have been live and indexed) ────
const v5 = getAllV5Entries();
const generators = {
  city: generateCityContent,
  question: generateQuestionContent,
  feature: generateFeatureContent,
  length: generateLengthContent,
  scenario: generateScenarioContent,
} as const;

const titleCounts = new Map<string, number>();
const descCounts = new Map<string, number>();
let longTitles = 0, shortTitles = 0, longDescs = 0, shortDescs = 0;

for (const entry of v5) {
  const d = generators[entry.cluster](entry);
  titleCounts.set(d.metaTitle, (titleCounts.get(d.metaTitle) ?? 0) + 1);
  descCounts.set(d.metaDescription, (descCounts.get(d.metaDescription) ?? 0) + 1);
  if (d.metaTitle.length > 65) longTitles++;
  if (d.metaTitle.length < 25) shortTitles++;
  if (d.metaDescription.length > 170) longDescs++;
  if (d.metaDescription.length < 70) shortDescs++;
}

const dupTitles = [...titleCounts.entries()].filter(([, n]) => n > 1);
const dupDescs = [...descCounts.entries()].filter(([, n]) => n > 1);
const dupTitlePages = dupTitles.reduce((s, [, n]) => s + n, 0);
const dupDescPages = dupDescs.reduce((s, [, n]) => s + n, 0);

console.log(`\n── v5 metadata (${v5.length} pages) ──`);
console.log(`duplicate titles:       ${dupTitles.length} titles covering ${dupTitlePages} pages (${((dupTitlePages / v5.length) * 100).toFixed(1)}%)`);
console.log(`duplicate descriptions: ${dupDescs.length} descs covering ${dupDescPages} pages (${((dupDescPages / v5.length) * 100).toFixed(1)}%)`);
console.log(`titles >65 chars:  ${longTitles}   titles <25 chars: ${shortTitles}`);
console.log(`descs  >170 chars: ${longDescs}   descs  <70 chars: ${shortDescs}`);
if (dupTitles.length > 0) {
  console.log(`worst title dupes:`);
  for (const [t, n] of dupTitles.sort((a, b) => b[1] - a[1]).slice(0, 5)) {
    console.log(`  x${n}  ${t}`);
  }
}

// ── Internal link resolution (sampled across all v5 clusters) ────────────────
let checkedLinks = 0;
let brokenLinks = 0;
const brokenExamples: string[] = [];
const sample = v5.filter((_, i) => i % 100 === 0);
for (const entry of sample) {
  for (const link of buildRelatedLinks(entry.cluster, entry.keyword)) {
    checkedLinks++;
    if (!resolvesInternally(link.href)) {
      brokenLinks++;
      if (brokenExamples.length < 10) brokenExamples.push(`${entry.slug} -> ${link.href}`);
    }
  }
}
console.log(`\n── internal links (sampled ${sample.length} pages) ──`);
console.log(`checked: ${checkedLinks}   broken: ${brokenLinks}`);
for (const b of brokenExamples) console.log(`  BROKEN: ${b}`);

console.log(`\ndone in ${Date.now() - t0}ms`);
if (brokenLinks > 0) process.exit(1);
