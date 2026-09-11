/**
 * Verifies the rebuilt 40k PSEO catalog and flagship links.
 * Run: npx tsx scripts/verify-internal-links.ts
 */
import { getKeywordBySlug, getAllSlugs } from "../src/lib/pseo/keywords";
import { CLUSTER_META, CLUSTER_ORDER, getClusterSize, getTotalPseoCount } from "../src/lib/pseo/clusters";
import { TARGET_PER_CLUSTER } from "../src/lib/pseo/types";
import { RESERVED_SLUGS } from "../src/lib/pseo/reserved";

const STATIC_ROUTES = new Set([
  "bypass-ai-detectors",
  "ai-detector",
  "topics",
  "pricing",
  "faq",
]);

const FLAGSHIP_HREFS = [
  "/bypass-ai-detectors",
  "/ai-detector",
  "/guides/free-ai-humanizer",
  "/guides/best-ai-humanizer",
  "/guides/bypass-turnitin-ai-detection",
  "/guides/does-turnitin-detect-chatgpt",
  "/guides/ai-humanizer-usa",
  "/guides/ai-humanizer-uk",
  "/guides/chatgpt-humanizer",
];

let problems = 0;

console.log("--- Cluster sizes ---");
for (const key of CLUSTER_ORDER) {
  const count = getClusterSize(key);
  console.log(key, count);
  if (count !== TARGET_PER_CLUSTER) {
    console.log("BAD COUNT", key, count);
    problems++;
  }
}
console.log("total", getTotalPseoCount());

console.log("\n--- Flagship links ---");
for (const href of FLAGSHIP_HREFS) {
  const slug = href.replace(/^\/guides\//, "").replace(/^\//, "");
  const ok = STATIC_ROUTES.has(slug) || Boolean(getKeywordBySlug(slug));
  if (!ok) {
    console.log("MISSING:", href);
    problems++;
  }
}

console.log("\n--- Reserved collisions ---");
for (const slug of getAllSlugs()) {
  if (RESERVED_SLUGS.has(slug)) {
    console.log("RESERVED COLLISION", slug);
    problems++;
  }
}

console.log("\n--- Hub meta ---");
for (const key of CLUSTER_ORDER) {
  if (!CLUSTER_META[key]) {
    console.log("MISSING META", key);
    problems++;
  }
}

console.log(problems === 0 ? "\nALL LINKS OK" : `\n${problems} PROBLEM(S) FOUND`);
process.exit(problems === 0 ? 0 : 1);
