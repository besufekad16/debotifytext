import { CLUSTER_KEYS, TARGET_PER_CLUSTER } from "../src/lib/pseo/types";
import { getAllEntries, getClusterEntries } from "../src/lib/pseo/keywords";

const slugs = new Set<string>();
const keywords = new Set<string>();
let dupSlug = 0;
let dupKw = 0;

for (const cluster of CLUSTER_KEYS) {
  const entries = getClusterEntries(cluster);
  console.log(`${cluster.padEnd(12)} ${entries.length}`);
  if (entries.length !== TARGET_PER_CLUSTER) {
    console.error(`EXPECTED ${TARGET_PER_CLUSTER}`);
    process.exit(1);
  }
  for (const e of entries) {
    if (slugs.has(e.slug)) dupSlug++;
    if (keywords.has(e.keyword)) dupKw++;
    slugs.add(e.slug);
    keywords.add(e.keyword);
  }
}

const all = getAllEntries();
console.log("total", all.length);
console.log("unique slugs", slugs.size);
console.log("dup slugs", dupSlug, "dup keywords", dupKw);
console.log("priority", all.filter((e) => e.priority).length);
console.log("samples", all.filter((e) => e.priority).slice(0, 8).map((e) => e.slug));
if (all.length !== 40000 || slugs.size !== 40000 || dupSlug || dupKw) {
  process.exit(1);
}
console.log("CATALOG OK");
