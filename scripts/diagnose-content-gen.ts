/**
 * Standalone diagnostic: exercises every content generator for every slug
 * across all pSEO datasets, OUTSIDE of `next build`, so we can find a slow
 * or hanging page in seconds instead of waiting through a full build.
 *
 * Run with: npx tsx scripts/diagnose-content-gen.ts
 */
import { getAllSlugs, getKeywordBySlug } from "~/lib/pseo-data";
import { getAllV2Slugs, getV2KeywordBySlug } from "~/lib/pseo-data-v2";
import { getAllV3Slugs, getV3KeywordBySlug } from "~/lib/pseo-data-v3";
import { getAllV4Slugs, getV4KeywordBySlug } from "~/lib/pseo-data-v4";
import { getAllGeoSlugs, getGeoKeywordBySlug } from "~/lib/pseo-data-geo";
import { generateGeoContent } from "~/lib/content/geo-content";
import { generateBypassContent } from "~/lib/content/bypass-content";
import { generateHumanizerContent } from "~/lib/content/humanizer-content";
import { generateHowToContent } from "~/lib/content/howto-content";
import { generateUseCaseContent } from "~/lib/content/usecase-content";
import { generateCompetitorContent } from "~/lib/content/competitor-content";
import { generateAcademicContent } from "~/lib/content/academic-content";
import { generateProfessionalContent } from "~/lib/content/professional-content";
import { generateDetectorContent } from "~/lib/content/detector-content";
import { generateLanguageContent } from "~/lib/content/language-content";
import { generateNicheContent } from "~/lib/content/niche-content";
import { generatePricingContent } from "~/lib/content/pricing-content";
import { generateIndustryContent } from "~/lib/content/industry-content";
import { generateFormatContent } from "~/lib/content/format-content";
import { generateSpeedContent } from "~/lib/content/speed-content";
import { generateQualityContent } from "~/lib/content/quality-content";
import { generateToolContent } from "~/lib/content/tool-content";
import { generateProblemContent } from "~/lib/content/problem-content";
import { generateWorkflowContent } from "~/lib/content/workflow-content";
import { generateScoreContent } from "~/lib/content/score-content";
import { generateRegionContent } from "~/lib/content/region-content";
import { generateComparisonContent } from "~/lib/content/comparison-content";
import { generateAlternativeContent } from "~/lib/content/alternative-content";
import { generateReviewContent } from "~/lib/content/review-content";
import { generateFreeContent } from "~/lib/content/free-content";
import { generateDetectionContent } from "~/lib/content/detection-content";
import { generateWritingContent } from "~/lib/content/writing-content";
import { generateEducationContent } from "~/lib/content/education-content";
import { generatePlatformV4Content } from "~/lib/content/platform-content-v4";
import { generateOutputContent } from "~/lib/content/output-content";
import { generateBulkContent } from "~/lib/content/bulk-content";
import { buildRelatedLinks } from "~/lib/related-links";

const SLOW_MS = 200;

function run(label: string, slug: string, fn: () => unknown) {
  const start = Date.now();
  fn();
  const elapsed = Date.now() - start;
  if (elapsed > SLOW_MS) {
    console.log(`SLOW (${elapsed}ms): [${label}] ${slug}`);
  }
}

let processed = 0;
const started = Date.now();

console.log("=== v1 (pseo-data.ts) ===");
for (const slug of getAllSlugs()) {
  const entry = getKeywordBySlug(slug)!;
  switch (entry.cluster) {
    case "bypass": run("bypass", slug, () => generateBypassContent(entry)); break;
    case "humanizer": run("humanizer", slug, () => generateHumanizerContent(entry)); break;
    case "howto": run("howto", slug, () => generateHowToContent(entry)); break;
    case "usecase": run("usecase", slug, () => generateUseCaseContent(entry)); break;
  }
  run(`related:${entry.cluster}`, slug, () => buildRelatedLinks(entry.cluster, entry.keyword));
  processed++;
  if (processed % 500 === 0) console.log(`  ...${processed} done (${Date.now() - started}ms elapsed)`);
}

console.log("=== v2 (pseo-data-v2.ts) ===");
for (const slug of getAllV2Slugs()) {
  const entry = getV2KeywordBySlug(slug)!;
  switch (entry.cluster) {
    case "competitor": run("competitor", slug, () => generateCompetitorContent(entry)); break;
    case "academic": run("academic", slug, () => generateAcademicContent(entry)); break;
    case "professional": run("professional", slug, () => generateProfessionalContent(entry)); break;
    case "detector": run("detector", slug, () => generateDetectorContent(entry)); break;
    case "language": run("language", slug, () => generateLanguageContent(entry)); break;
    case "niche": run("niche", slug, () => generateNicheContent(entry)); break;
  }
  run(`related:${entry.cluster}`, slug, () => buildRelatedLinks(entry.cluster, entry.keyword));
  processed++;
  if (processed % 500 === 0) console.log(`  ...${processed} done (${Date.now() - started}ms elapsed)`);
}

console.log("=== v3 (pseo-data-v3.ts) ===");
for (const slug of getAllV3Slugs()) {
  const entry = getV3KeywordBySlug(slug)!;
  switch (entry.cluster) {
    case "pricing": run("pricing", slug, () => generatePricingContent(entry)); break;
    case "industry": run("industry", slug, () => generateIndustryContent(entry)); break;
    case "format": run("format", slug, () => generateFormatContent(entry)); break;
    case "speed": run("speed", slug, () => generateSpeedContent(entry)); break;
    case "quality": run("quality", slug, () => generateQualityContent(entry)); break;
    case "tool": run("tool", slug, () => generateToolContent(entry)); break;
    case "problem": run("problem", slug, () => generateProblemContent(entry)); break;
    case "workflow": run("workflow", slug, () => generateWorkflowContent(entry)); break;
    case "score": run("score", slug, () => generateScoreContent(entry)); break;
    case "region": run("region", slug, () => generateRegionContent(entry)); break;
  }
  run(`related:${entry.cluster}`, slug, () => buildRelatedLinks(entry.cluster, entry.keyword));
  processed++;
  if (processed % 500 === 0) console.log(`  ...${processed} done (${Date.now() - started}ms elapsed)`);
}

console.log("=== v4 (pseo-data-v4.ts) ===");
for (const slug of getAllV4Slugs()) {
  const entry = getV4KeywordBySlug(slug)!;
  switch (entry.cluster) {
    case "comparison": run("comparison", slug, () => generateComparisonContent(entry)); break;
    case "alternative": run("alternative", slug, () => generateAlternativeContent(entry)); break;
    case "review": run("review", slug, () => generateReviewContent(entry)); break;
    case "free": run("free", slug, () => generateFreeContent(entry)); break;
    case "detection": run("detection", slug, () => generateDetectionContent(entry)); break;
    case "writing": run("writing", slug, () => generateWritingContent(entry)); break;
    case "education": run("education", slug, () => generateEducationContent(entry)); break;
    case "platform": run("platform", slug, () => generatePlatformV4Content(entry)); break;
    case "output": run("output", slug, () => generateOutputContent(entry)); break;
    case "bulk": run("bulk", slug, () => generateBulkContent(entry)); break;
  }
  run(`related:${entry.cluster}`, slug, () => buildRelatedLinks(entry.cluster, entry.keyword));
  processed++;
  if (processed % 500 === 0) console.log(`  ...${processed} done (${Date.now() - started}ms elapsed)`);
}

console.log("=== geo (pseo-data-geo.ts) ===");
for (const slug of getAllGeoSlugs()) {
  const entry = getGeoKeywordBySlug(slug)!;
  run("geo", slug, () => generateGeoContent(entry));
  processed++;
}

console.log(`\nDONE. Processed ${processed} pages in ${Date.now() - started}ms (${((Date.now() - started) / processed).toFixed(2)}ms/page avg)`);
