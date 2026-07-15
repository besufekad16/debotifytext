/**
 * Internal linking engine for pSEO pages.
 *
 * The old approach linked every one of ~23,500 pages to 8 items drawn from a
 * fixed pool of 24 URLs — meaning the vast majority of pages received almost
 * no internal links and were discoverable only via the XML sitemap. That is
 * one of the main reasons a large share of pages never get indexed: orphaned
 * pages with weak internal link signals are exactly what Google deprioritizes.
 *
 * This engine instead links each page to:
 *  - 5 real same-cluster sibling pages (deterministic per-keyword selection)
 *    so link equity actually spreads across the long tail instead of pooling
 *    on a fixed 24 URLs.
 *  - 2 curated high-value "flagship" pages, to keep some equity concentrated
 *    on the pages we most want to rank.
 *  - 1 link to the cluster's hub page (/topics/{cluster}), so every page is
 *    reachable within two clicks of a real crawlable HTML index, not just
 *    the sitemap.
 */
import { toSlug } from "~/lib/pseo-data";
import { smartTitleCase } from "~/lib/content/content-utils";
import { CLUSTER_REGISTRY, type AnyClusterKey, type LiteEntry } from "~/lib/pseo-clusters";

export interface RelatedLink {
  label: string;
  href: string;
}

let _index: Map<string, LiteEntry[]> | null = null;

function buildIndex(): Map<string, LiteEntry[]> {
  if (_index) return _index;
  const map = new Map<string, LiteEntry[]>();
  for (const key of Object.keys(CLUSTER_REGISTRY) as AnyClusterKey[]) {
    map.set(key, CLUSTER_REGISTRY[key].getEntries());
  }
  _index = map;
  return map;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Curated high-value pages we want to consistently receive internal links,
// regardless of which cluster a given page belongs to.
const FLAGSHIP_POOL: RelatedLink[] = [
  { label: "Bypass AI Detectors", href: "/bypass-ai-detectors" },
  { label: "AI Detector Guide", href: "/ai-detector" },
  { label: "Free AI Humanizer", href: "/free-ai-humanizer" },
  { label: "Best AI Humanizer", href: "/best-ai-humanizer" },
  { label: "Bypass Turnitin AI Detection", href: "/bypass-turnitin-ai-detection" },
  { label: "Does Turnitin Detect ChatGPT?", href: "/does-turnitin-detect-chatgpt" },
  { label: "AI Humanizer for Students in the USA", href: "/ai-humanizer-usa" },
  { label: "AI Humanizer for the UK", href: "/ai-humanizer-uk" },
];

function pickFromPool(pool: RelatedLink[], keyword: string, count: number, offset = 0): RelatedLink[] {
  const start = hashStr(keyword + offset) % pool.length;
  const step = 1 + (hashStr(keyword + "step" + offset) % (pool.length - 1 || 1));
  const picked: RelatedLink[] = [];
  const seen = new Set<number>();
  let idx = start;
  while (picked.length < Math.min(count, pool.length) && seen.size < pool.length) {
    if (!seen.has(idx)) {
      seen.add(idx);
      picked.push(pool[idx]!);
    }
    idx = (idx + step) % pool.length;
  }
  return picked;
}

export function getRelatedLinks(cluster: string, keyword: string, count = 5): RelatedLink[] {
  const idx = buildIndex();
  const siblings = (idx.get(cluster as AnyClusterKey) ?? []).filter((e) => e.slug !== toSlug(keyword));
  if (siblings.length === 0) return [];
  const start = hashStr(keyword) % siblings.length;
  const step = 1 + (hashStr(keyword + "s") % (siblings.length - 1 || 1));
  const picked: LiteEntry[] = [];
  const seen = new Set<number>();
  let idx2 = start;
  while (picked.length < Math.min(count, siblings.length) && seen.size < siblings.length) {
    if (!seen.has(idx2)) {
      seen.add(idx2);
      picked.push(siblings[idx2]!);
    }
    idx2 = (idx2 + step) % siblings.length;
  }
  return picked.map((e) => ({ label: smartTitleCase(e.keyword), href: `/${e.slug}` }));
}

export function buildRelatedLinks(cluster: string, keyword: string): RelatedLink[] {
  const siblings = getRelatedLinks(cluster, keyword, 5);
  const flagship = pickFromPool(FLAGSHIP_POOL, keyword, 2, 1);
  const meta = CLUSTER_REGISTRY[cluster as AnyClusterKey];
  const hub: RelatedLink = {
    label: meta ? `Browse All ${meta.label}` : "Browse All Guides",
    href: meta ? `/topics/${cluster}` : "/topics",
  };
  return [...siblings, ...flagship, hub];
}
