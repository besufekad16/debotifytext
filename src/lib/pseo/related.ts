import { CLUSTER_META, CLUSTER_ORDER, type AnyClusterKey, type LiteEntry } from "./clusters";
import { getClusterEntries } from "./keywords";
import { smartTitleCase } from "~/lib/content/content-utils";
import { toSlug } from "./reserved";
import { pseoPath } from "./paths";

export interface RelatedLink {
  label: string;
  href: string;
}

const FLAGSHIP_POOL: RelatedLink[] = [
  { label: "HumanifyLab AI Humanizer", href: "/" },
  { label: "Bypass AI Detectors", href: "/bypass-ai-detectors" },
  { label: "AI Detector Guide", href: "/ai-detector" },
  { label: "Free AI Humanizer", href: "/guides/free-ai-humanizer" },
  { label: "Best AI Humanizer", href: "/guides/best-ai-humanizer" },
  { label: "Bypass Turnitin AI Detection", href: "/guides/bypass-turnitin-ai-detection" },
  { label: "Does Turnitin Detect ChatGPT?", href: "/guides/does-turnitin-detect-chatgpt" },
  { label: "ChatGPT Humanizer", href: "/guides/chatgpt-humanizer" },
  { label: "AI Humanizer for Students", href: "/guides/ai-humanizer-for-students" },
  { label: "AI Humanizer in the USA", href: "/guides/ai-humanizer-usa" },
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickStride<T>(list: T[], seed: number, count: number, skip?: (item: T) => boolean): T[] {
  if (list.length === 0) return [];
  const n = Math.min(count, list.length);
  const start = seed % list.length;
  const step = list.length % 7 === 0 ? 11 : 7;
  const out: T[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < list.length && out.length < n; i++) {
    const idx = (start + i * step) % list.length;
    if (seen.has(idx)) continue;
    seen.add(idx);
    const item = list[idx]!;
    if (skip?.(item)) continue;
    out.push(item);
  }
  return out;
}

export function buildRelatedLinks(cluster: string, keyword: string): RelatedLink[] {
  const key = cluster as AnyClusterKey;
  const siblings = getClusterEntries(key) as LiteEntry[];
  const self = toSlug(keyword);
  const sibLinks = pickStride(siblings, hashStr(keyword), 6, (e) => e.slug === self).map((e) => ({
    label: smartTitleCase(e.keyword),
    href: pseoPath(e.slug),
  }));

  const otherClusters = CLUSTER_ORDER.filter((c) => c !== key);
  const cross = pickStride(otherClusters, hashStr(keyword + "x"), 2).flatMap((c) => {
    const entries = getClusterEntries(c);
    const hit = pickStride(entries, hashStr(keyword + c), 1)[0];
    if (!hit) return [];
    return [{ label: smartTitleCase(hit.keyword), href: pseoPath(hit.slug) }];
  });

  const flagship = pickStride(FLAGSHIP_POOL, hashStr(keyword + "f"), 2, (l) => l.href === pseoPath(self));
  const meta = CLUSTER_META[key];
  const hub: RelatedLink = {
    label: meta ? `All ${meta.label}` : "All guides",
    href: meta ? `/topics/${key}` : "/topics",
  };

  const seen = new Set<string>();
  const merged: RelatedLink[] = [];
  for (const link of [...sibLinks, ...cross, ...flagship, hub]) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    merged.push(link);
  }
  return merged;
}
