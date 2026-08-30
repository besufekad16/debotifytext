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

// Deterministically picks up to `count` distinct indices in [0, length) by
// walking forward from a keyword-derived starting point.
//
// NOTE: this used to walk with a keyword-derived `step` and loop "while
// (picked.length < count && seen.size < length)". That only terminates if
// step is coprime with length — whenever they share a common factor (which
// happens for a large fraction of cluster sizes/keywords, since most
// clusters have hundreds to thousands of entries with lots of small
// factors), the walk cycles through a strict subset of indices forever,
// `seen.size` gets stuck below `length`, and the loop never exits. That
// infinite loop is what was hanging the build partway through (every page
// calls this via SEOPageWrapper -> buildRelatedLinks, so hitting one
// unlucky keyword/length combination froze that render forever). Stepping
// by a fixed +1 always visits every residue exactly once per full cycle
// through `length`, so this always terminates in at most `length` steps.
function pickIndices(length: number, seed: number, count: number): number[] {
  if (length <= 0) return [];
  const n = Math.min(count, length);
  const start = seed % length;
  const indices: number[] = [];
  for (let i = 0; i < length && indices.length < n; i++) {
    indices.push((start + i) % length);
  }
  return indices;
}

// Curated high-value pages we want to consistently receive internal links,
// regardless of which cluster a given page belongs to.
const FLAGSHIP_POOL: RelatedLink[] = [
  { label: "HumanifyLab AI Humanizer", href: "/" },
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
  const seed = hashStr(keyword + offset);
  return pickIndices(pool.length, seed, count).map((i) => pool[i]!);
}

export function getRelatedLinks(cluster: string, keyword: string, count = 5): RelatedLink[] {
  const idx = buildIndex();
  const all = idx.get(cluster as AnyClusterKey) ?? [];
  const length = all.length;
  if (length === 0) return [];
  const selfSlug = toSlug(keyword);
  const start = hashStr(keyword) % length;
  // Walk forward from `start`, skipping self, lazily — avoids allocating a
  // filtered O(length) copy of the cluster on every single page render
  // (clusters can have thousands of entries; this runs for all ~23.6k
  // pages). Bounded by `length` so it always terminates even if every
  // entry were somehow excluded.
  const picked: LiteEntry[] = [];
  for (let i = 0; i < length && picked.length < count; i++) {
    const entry = all[(start + i) % length]!;
    if (entry.slug !== selfSlug) picked.push(entry);
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
