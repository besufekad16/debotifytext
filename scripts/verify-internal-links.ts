/**
 * Verifies the internal linking system is sound:
 *  - every cluster in the registry resolves to a non-empty entry list
 *  - every curated FLAGSHIP_POOL href in related-links.ts resolves to either
 *    a real pSEO slug or a known hand-authored static route
 *  - every geo slug resolves via the geo dataset
 *
 * Run: npx tsx scripts/verify-internal-links.ts
 */
import { getKeywordBySlug } from "../src/lib/pseo-data";
import { getV2KeywordBySlug } from "../src/lib/pseo-data-v2";
import { getV3KeywordBySlug } from "../src/lib/pseo-data-v3";
import { getV4KeywordBySlug } from "../src/lib/pseo-data-v4";
import { getGeoKeywordBySlug, getAllGeoSlugs } from "../src/lib/pseo-data-geo";
import { CLUSTER_REGISTRY, CLUSTER_ORDER } from "../src/lib/pseo-clusters";

// Hand-authored static routes that are NOT part of any pSEO dataset —
// these live as real folders under src/app/.
const STATIC_ROUTES = new Set([
  "bypass-ai-detectors",
  "ai-detector",
  "topics",
  ...getAllGeoSlugs(),
]);

function resolvesToPseoSlug(slug: string): boolean {
  return Boolean(
    getKeywordBySlug(slug) ?? getV2KeywordBySlug(slug) ?? getV3KeywordBySlug(slug) ?? getV4KeywordBySlug(slug) ?? getGeoKeywordBySlug(slug),
  );
}

let problems = 0;

console.log("--- Cluster registry sanity ---");
for (const key of CLUSTER_ORDER) {
  const count = CLUSTER_REGISTRY[key].getEntries().length;
  if (count === 0) {
    console.log(`EMPTY CLUSTER: ${key}`);
    problems++;
  }
}
console.log(`${CLUSTER_ORDER.length} clusters checked.`);

console.log("\n--- Flagship pool links (src/lib/related-links.ts) ---");
const FLAGSHIP_HREFS = [
  "/bypass-ai-detectors",
  "/ai-detector",
  "/free-ai-humanizer",
  "/best-ai-humanizer",
  "/bypass-turnitin-ai-detection",
  "/does-turnitin-detect-chatgpt",
  "/ai-humanizer-usa",
  "/ai-humanizer-uk",
];
for (const href of FLAGSHIP_HREFS) {
  const slug = href.replace(/^\//, "");
  const ok = STATIC_ROUTES.has(slug) || resolvesToPseoSlug(slug);
  if (!ok) {
    console.log("MISSING:", href);
    problems++;
  }
}
console.log(`${FLAGSHIP_HREFS.length} flagship links checked.`);

console.log("\n--- Geo slugs ---");
for (const slug of getAllGeoSlugs()) {
  if (!getGeoKeywordBySlug(slug)) {
    console.log("MISSING GEO:", slug);
    problems++;
  }
}
console.log(`${getAllGeoSlugs().length} geo slugs checked.`);

console.log(problems === 0 ? "\nALL LINKS OK" : `\n${problems} PROBLEM(S) FOUND`);
process.exit(problems === 0 ? 0 : 1);
