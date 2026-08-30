/** Reports v6 cluster yields, dedupe status, and sample slugs. */
import { getAllV6Entries, getV6ClusterKeywords, V6_CLUSTER_KEYS } from "../src/lib/pseo-data-v6";
import { generateV6Content } from "../src/lib/content/v6-content";

const all = getAllV6Entries();
const slugSet = new Set(all.map((e) => e.slug));

console.log("v6 clusters:");
let total = 0;
for (const c of V6_CLUSTER_KEYS) {
  const n = getV6ClusterKeywords(c).length;
  total += n;
  console.log(`  ${c.padEnd(18)} ${n}`);
}
console.log(`TOTAL v6: ${total}`);
console.log(`unique slugs: ${slugSet.size} (dupes: ${total - slugSet.size})`);

// layout distribution
const layoutCount = new Array<number>(20).fill(0);
const titleSet = new Set<string>();
const sample = all.filter((_, i) => i % 199 === 0).slice(0, 300);
for (const e of sample) {
  const d = generateV6Content(e);
  layoutCount[d.layoutId] = (layoutCount[d.layoutId] ?? 0) + 1;
  titleSet.add(d.metaTitle);
}
console.log(`sampled ${sample.length} pages -> ${titleSet.size} unique meta titles`);
console.log("layout spread (20 variants):", layoutCount.join(","));
console.log("sample slugs:");
for (const e of all.filter((_, i) => i % 6001 === 0).slice(0, 10)) {
  console.log(`  [${e.cluster}] /${e.slug}`);
}
