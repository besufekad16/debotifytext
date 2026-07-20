import { getV4ClusterKeywords } from "../src/lib/pseo-data-v4";
import { generateFreeContent } from "../src/lib/content/free-content";
import { generateAlternativeContent } from "../src/lib/content/alternative-content";
import { generateComparisonContent } from "../src/lib/content/comparison-content";
import { generateDetectionContent } from "../src/lib/content/detection-content";
import { generatePlatformV4Content } from "../src/lib/content/platform-content-v4";
import { generateReviewContent } from "../src/lib/content/review-content";
import { getClusterKeywords } from "../src/lib/pseo-data";
import { getV2ClusterKeywords } from "../src/lib/pseo-data-v2";
import { getV3ClusterKeywords } from "../src/lib/pseo-data-v3";

const checks = [
  { cluster:'free', entries: getV4ClusterKeywords('free') as any[], gen: generateFreeContent as any },
  { cluster:'alternative', entries: getV4ClusterKeywords('alternative') as any[], gen: generateAlternativeContent as any },
  { cluster:'comparison', entries: getV4ClusterKeywords('comparison') as any[], gen: generateComparisonContent as any },
  { cluster:'detection', entries: getV4ClusterKeywords('detection') as any[], gen: generateDetectionContent as any },
  { cluster:'platform', entries: getV4ClusterKeywords('platform') as any[], gen: generatePlatformV4Content as any },
  { cluster:'review', entries: getV4ClusterKeywords('review') as any[], gen: generateReviewContent as any },
];

let totalDupes = 0;
for (const {cluster, entries, gen} of checks) {
  const fp = new Map<string,number>();
  for (const e of entries) {
    const d = gen(e);
    const q = d.faqs?.[0]?.q ?? '';
    fp.set(q, (fp.get(q)??0)+1);
  }
  const dups = [...fp.entries()].filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]);
  const dupCount = dups.reduce((s,[,n])=>s+n,0);
  totalDupes += dupCount;
  if (dups.length > 0) {
    console.log(`${cluster}: ${dups.length} dup questions, ${dupCount} affected pages`);
    for (const [q,n] of dups.slice(0,3)) console.log(`  x${n}: ${q.slice(0,110)}`);
  } else {
    console.log(`${cluster}: OK`);
  }
}
console.log("total dup pages from these 6 clusters:", totalDupes);