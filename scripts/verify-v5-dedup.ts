/**
 * Verifies the v5 dataset: per-cluster yield, global slug uniqueness across
 * v1+v2+v3+v4+geo+v5, and content-generation smoke test on sample entries.
 *
 * Run: npx tsx scripts/verify-v5-dedup.ts
 */
import { getAllSlugs } from "../src/lib/pseo-data";
import { getAllV2Slugs } from "../src/lib/pseo-data-v2";
import { getAllV3Slugs } from "../src/lib/pseo-data-v3";
import { getAllV4Slugs } from "../src/lib/pseo-data-v4";
import { getAllGeoSlugs } from "../src/lib/pseo-data-geo";
import { getAllV5Entries } from "../src/lib/pseo-data-v5";
import { generateCityContent } from "../src/lib/content/city-content";
import { generateQuestionContent } from "../src/lib/content/question-content";
import { generateFeatureContent } from "../src/lib/content/feature-content";
import { generateLengthContent } from "../src/lib/content/length-content";
import { generateScenarioContent } from "../src/lib/content/scenario-content";

const t0 = Date.now();

const prior = new Set<string>([
  ...getAllSlugs(),
  ...getAllV2Slugs(),
  ...getAllV3Slugs(),
  ...getAllV4Slugs(),
  ...getAllGeoSlugs(),
]);
console.log(`prior slugs (v1-v4 + geo): ${prior.size}`);

const v5 = getAllV5Entries();
console.log(`v5 entries: ${v5.length}`);

// Per-cluster counts
const byCluster = new Map<string, number>();
for (const e of v5) byCluster.set(e.cluster, (byCluster.get(e.cluster) ?? 0) + 1);
for (const [c, n] of byCluster) console.log(`  ${c.padEnd(10)} ${n}`);

// Collision checks
let collisionsWithPrior = 0;
const v5Seen = new Set<string>();
let internalDupes = 0;
for (const e of v5) {
  if (prior.has(e.slug)) collisionsWithPrior++;
  if (v5Seen.has(e.slug)) internalDupes++;
  v5Seen.add(e.slug);
}
console.log(`collisions with v1-v4/geo: ${collisionsWithPrior}`);
console.log(`internal v5 duplicates:    ${internalDupes}`);

// Slug quality: length bounds used by sitemap generation (5..120)
const badSlugs = v5.filter((e) => e.slug.length < 5 || e.slug.length > 120);
console.log(`slugs outside 5-120 chars: ${badSlugs.length}`);
if (badSlugs.length > 0) {
  for (const b of badSlugs.slice(0, 5)) console.log(`  BAD: "${b.slug}" (${b.slug.length})`);
}

// Content-generation smoke test: run every generator over a spread of entries
// from its cluster and assert the required V4PageData fields are non-empty.
const generators: Record<string, (e: (typeof v5)[number]) => { metaTitle: string; metaDescription: string; h1: string; faqs: { q: string; a: string }[] }> = {
  city: generateCityContent,
  question: generateQuestionContent,
  feature: generateFeatureContent,
  length: generateLengthContent,
  scenario: generateScenarioContent,
};

let generated = 0;
let failures = 0;
for (const [cluster, gen] of Object.entries(generators)) {
  const entries = v5.filter((e) => e.cluster === cluster);
  // sample: first, last, and every 250th entry
  const sample = entries.filter((_, i) => i === 0 || i === entries.length - 1 || i % 250 === 0);
  for (const entry of sample) {
    const d = gen(entry);
    generated++;
    if (!d.metaTitle || !d.metaDescription || !d.h1 || !d.faqs || d.faqs.length === 0) {
      failures++;
      console.log(`  FAIL [${cluster}] ${entry.slug}`);
    }
    if (d.metaTitle.length > 75) {
      // Not fatal; just informative for SEO title-length review
    }
  }
}
console.log(`content smoke test: generated ${generated} pages, failures: ${failures}`);
console.log(`total site pages after v5: ${prior.size + v5.length}`);
console.log(`done in ${Date.now() - t0}ms`);

if (collisionsWithPrior > 0 || internalDupes > 0 || failures > 0 || badSlugs.length > 0) {
  process.exit(1);
}
