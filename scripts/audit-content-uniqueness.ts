/**
 * Audits every pSEO page's GENERATED content (not just slugs) for duplicates.
 *
 * Checks, across all ~23.5k pages (v1 bypass/humanizer/howto/usecase,
 * v2 competitor/academic/professional/detector/language/niche,
 * v3 pricing/industry/format/speed/quality/tool/problem/workflow/score/region,
 * v4 comparison/alternative/review/free/detection/writing/education/platform/output/bulk,
 * geo):
 *
 *   1. Duplicate `keyword` or `slug` strings (data-layer bug — would produce
 *      literally identical pages).
 *   2. Duplicate rendered <title> (metaTitle) across the whole site.
 *   3. Duplicate rendered meta description across the whole site.
 *   4. Duplicate rendered H1 across the whole site.
 *   5. Duplicate full-body fingerprint (title+desc+h1+FAQ Q&A concatenated)
 *      — the strongest signal of "this page reads identical to that page".
 *
 * Run: npx tsx scripts/audit-content-uniqueness.ts
 */
import { getAllKeywords } from "../src/lib/pseo-data";
import { getAllV2Keywords } from "../src/lib/pseo-data-v2";
import { getAllV3Keywords } from "../src/lib/pseo-data-v3";
import { getAllV4Entries } from "../src/lib/pseo-data-v4";
import { getAllGeoEntries } from "../src/lib/pseo-data-geo";

import { generateBypassContent } from "../src/lib/content/bypass-content";
import { generateHumanizerContent } from "../src/lib/content/humanizer-content";
import { generateHowToContent } from "../src/lib/content/howto-content";
import { generateUseCaseContent } from "../src/lib/content/usecase-content";
import { generateCompetitorContent } from "../src/lib/content/competitor-content";
import { generateAcademicContent } from "../src/lib/content/academic-content";
import { generateProfessionalContent } from "../src/lib/content/professional-content";
import { generateDetectorContent } from "../src/lib/content/detector-content";
import { generateLanguageContent } from "../src/lib/content/language-content";
import { generateNicheContent } from "../src/lib/content/niche-content";
import { generatePricingContent } from "../src/lib/content/pricing-content";
import { generateIndustryContent } from "../src/lib/content/industry-content";
import { generateFormatContent } from "../src/lib/content/format-content";
import { generateSpeedContent } from "../src/lib/content/speed-content";
import { generateQualityContent } from "../src/lib/content/quality-content";
import { generateToolContent } from "../src/lib/content/tool-content";
import { generateProblemContent } from "../src/lib/content/problem-content";
import { generateWorkflowContent } from "../src/lib/content/workflow-content";
import { generateScoreContent } from "../src/lib/content/score-content";
import { generateRegionContent } from "../src/lib/content/region-content";
import { generateComparisonContent } from "../src/lib/content/comparison-content";
import { generateAlternativeContent } from "../src/lib/content/alternative-content";
import { generateReviewContent } from "../src/lib/content/review-content";
import { generateFreeContent } from "../src/lib/content/free-content";
import { generateDetectionContent } from "../src/lib/content/detection-content";
import { generateWritingContent } from "../src/lib/content/writing-content";
import { generateEducationContent } from "../src/lib/content/education-content";
import { generatePlatformV4Content } from "../src/lib/content/platform-content-v4";
import { generateOutputContent } from "../src/lib/content/output-content";
import { generateBulkContent } from "../src/lib/content/bulk-content";
import { generateGeoContent } from "../src/lib/content/geo-content";

interface Rendered {
  slug: string;
  cluster: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  faqBlob: string;
}

function faqBlob(faqs: { q: string; a: string }[] | undefined): string {
  if (!faqs) return "";
  return faqs.map((f) => `${f.q}|${f.a}`).join("~~");
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

console.log("Loading keyword datasets...");
const v1 = getAllKeywords();
const v2 = getAllV2Keywords();
const v3 = getAllV3Keywords();
const v4 = getAllV4Entries();
const geo = getAllGeoEntries();

console.log(`v1=${v1.length} v2=${v2.length} v3=${v3.length} v4=${v4.length} geo=${geo.length}`);
console.log(`Total pages: ${v1.length + v2.length + v3.length + v4.length + geo.length}`);

// ── 1. Data-layer duplicate check (keyword / slug collisions) ────────────────
const allEntries = [
  ...v1.map((e) => ({ slug: e.slug, keyword: e.keyword, cluster: e.cluster })),
  ...v2.map((e) => ({ slug: e.slug, keyword: e.keyword, cluster: e.cluster })),
  ...v3.map((e) => ({ slug: e.slug, keyword: e.keyword, cluster: e.cluster })),
  ...v4.map((e) => ({ slug: e.slug, keyword: e.keyword, cluster: e.cluster })),
  ...geo.map((e) => ({ slug: e.slug, keyword: e.keyword, cluster: "geo" })),
];

const slugMap = new Map<string, string[]>();
const keywordMap = new Map<string, string[]>();
for (const e of allEntries) {
  const sKey = e.slug;
  const kKey = normalize(e.keyword);
  slugMap.set(sKey, [...(slugMap.get(sKey) ?? []), e.cluster]);
  keywordMap.set(kKey, [...(keywordMap.get(kKey) ?? []), e.slug]);
}

const dupSlugs = [...slugMap.entries()].filter(([, v]) => v.length > 1);
const dupKeywords = [...keywordMap.entries()].filter(([, v]) => v.length > 1);

console.log("\n=== 1. DATA-LAYER DUPLICATES ===");
console.log(`Duplicate slugs: ${dupSlugs.length}`);
dupSlugs.slice(0, 20).forEach(([slug, clusters]) => console.log(`  SLUG COLLISION: ${slug} -> ${clusters.join(", ")}`));
console.log(`Duplicate keyword strings (different slugs, same keyword text): ${dupKeywords.length}`);
dupKeywords.slice(0, 20).forEach(([kw, slugs]) => console.log(`  KEYWORD COLLISION: "${kw}" -> ${slugs.join(", ")}`));

// ── 2. Render every page's content and fingerprint it ────────────────────────
console.log("\nRendering content for all pages (this takes a bit)...");
const rendered: Rendered[] = [];
let errors = 0;

function safePush(slug: string, cluster: string, keyword: string, data: any) {
  try {
    rendered.push({
      slug,
      cluster,
      keyword,
      metaTitle: normalize(data.metaTitle ?? ""),
      metaDescription: normalize(data.metaDescription ?? ""),
      h1: normalize(data.h1 ?? ""),
      faqBlob: normalize(faqBlob(data.faqs)),
    });
  } catch (err) {
    errors++;
    if (errors <= 5) console.error(`  ERROR rendering ${slug}:`, err);
  }
}

for (const e of v1) {
  switch (e.cluster) {
    case "bypass": safePush(e.slug, "bypass", e.keyword, generateBypassContent(e)); break;
    case "humanizer": safePush(e.slug, "humanizer", e.keyword, generateHumanizerContent(e)); break;
    case "howto": safePush(e.slug, "howto", e.keyword, generateHowToContent(e)); break;
    case "usecase": safePush(e.slug, "usecase", e.keyword, generateUseCaseContent(e)); break;
  }
}
for (const e of v2) {
  switch (e.cluster) {
    case "competitor": safePush(e.slug, "competitor", e.keyword, generateCompetitorContent(e)); break;
    case "academic": safePush(e.slug, "academic", e.keyword, generateAcademicContent(e)); break;
    case "professional": safePush(e.slug, "professional", e.keyword, generateProfessionalContent(e)); break;
    case "detector": safePush(e.slug, "detector", e.keyword, generateDetectorContent(e)); break;
    case "language": safePush(e.slug, "language", e.keyword, generateLanguageContent(e)); break;
    case "niche": safePush(e.slug, "niche", e.keyword, generateNicheContent(e)); break;
  }
}
for (const e of v3) {
  switch (e.cluster) {
    case "pricing": safePush(e.slug, "pricing", e.keyword, generatePricingContent(e)); break;
    case "industry": safePush(e.slug, "industry", e.keyword, generateIndustryContent(e)); break;
    case "format": safePush(e.slug, "format", e.keyword, generateFormatContent(e)); break;
    case "speed": safePush(e.slug, "speed", e.keyword, generateSpeedContent(e)); break;
    case "quality": safePush(e.slug, "quality", e.keyword, generateQualityContent(e)); break;
    case "tool": safePush(e.slug, "tool", e.keyword, generateToolContent(e)); break;
    case "problem": safePush(e.slug, "problem", e.keyword, generateProblemContent(e)); break;
    case "workflow": safePush(e.slug, "workflow", e.keyword, generateWorkflowContent(e)); break;
    case "score": safePush(e.slug, "score", e.keyword, generateScoreContent(e)); break;
    case "region": safePush(e.slug, "region", e.keyword, generateRegionContent(e)); break;
  }
}
for (const e of v4) {
  switch (e.cluster) {
    case "comparison": safePush(e.slug, "comparison", e.keyword, generateComparisonContent(e)); break;
    case "alternative": safePush(e.slug, "alternative", e.keyword, generateAlternativeContent(e)); break;
    case "review": safePush(e.slug, "review", e.keyword, generateReviewContent(e)); break;
    case "free": safePush(e.slug, "free", e.keyword, generateFreeContent(e)); break;
    case "detection": safePush(e.slug, "detection", e.keyword, generateDetectionContent(e)); break;
    case "writing": safePush(e.slug, "writing", e.keyword, generateWritingContent(e)); break;
    case "education": safePush(e.slug, "education", e.keyword, generateEducationContent(e)); break;
    case "platform": safePush(e.slug, "platform", e.keyword, generatePlatformV4Content(e)); break;
    case "output": safePush(e.slug, "output", e.keyword, generateOutputContent(e)); break;
    case "bulk": safePush(e.slug, "bulk", e.keyword, generateBulkContent(e)); break;
  }
}
for (const e of geo) {
  safePush(e.slug, "geo", e.keyword, generateGeoContent(e));
}

console.log(`Rendered ${rendered.length} pages (${errors} errors).`);

function reportDuplicateField(field: keyof Rendered, label: string) {
  const map = new Map<string, Rendered[]>();
  for (const r of rendered) {
    const key = r[field] as string;
    if (!key) continue;
    map.set(key, [...(map.get(key) ?? []), r]);
  }
  const dups = [...map.entries()].filter(([, v]) => v.length > 1);
  const totalDupPages = dups.reduce((sum, [, v]) => sum + v.length, 0);
  console.log(`\n=== ${label} ===`);
  console.log(`Duplicate groups: ${dups.length} | Pages involved: ${totalDupPages} / ${rendered.length}`);
  dups
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 15)
    .forEach(([val, group]) => {
      console.log(`  [x${group.length}] "${val.slice(0, 90)}"`);
      group.slice(0, 4).forEach((g) => console.log(`      - /${g.slug} (${g.cluster})`));
    });
  return dups;
}

reportDuplicateField("metaTitle", "2. DUPLICATE <title> TAGS");
reportDuplicateField("metaDescription", "3. DUPLICATE META DESCRIPTIONS");
reportDuplicateField("h1", "4. DUPLICATE H1s");

// ── 5. Full-body fingerprint (title+desc+h1+faqs) ─────────────────────────────
const fpMap = new Map<string, Rendered[]>();
for (const r of rendered) {
  const fp = `${r.metaTitle}||${r.metaDescription}||${r.h1}||${r.faqBlob}`;
  fpMap.set(fp, [...(fpMap.get(fp) ?? []), r]);
}
const fpDups = [...fpMap.entries()].filter(([, v]) => v.length > 1);
const fpDupPages = fpDups.reduce((sum, [, v]) => sum + v.length, 0);
console.log(`\n=== 5. FULL-CONTENT FINGERPRINT DUPLICATES (title+desc+h1+faqs identical) ===`);
console.log(`Duplicate groups: ${fpDups.length} | Pages involved: ${fpDupPages} / ${rendered.length}`);
fpDups.slice(0, 15).forEach(([, group]) => {
  console.log(`  [x${group.length}] cluster=${group[0]!.cluster}`);
  group.slice(0, 5).forEach((g) => console.log(`      - /${g.slug}  kw="${g.keyword}"`));
});

console.log("\nDone.");
