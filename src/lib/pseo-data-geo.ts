/**
 * Geo-targeted flagship landing pages.
 *
 * Unlike v1-v4 clusters, this set is intentionally small and hand-authored
 * (see src/lib/content/geo-content.ts) rather than combinatorially spun.
 * These are strategic country pages for HumanifyLab's core growth markets:
 * the US, Canada, UK, wider Europe, Australia, South Africa and Asia.
 */

export type GeoCluster = "geo";

export interface KeywordEntryGeo {
  keyword: string;
  slug: string;
  cluster: GeoCluster;
  entity: string;
  seed: number;
}

const GEO_ENTRIES: Omit<KeywordEntryGeo, "cluster">[] = [
  { keyword: "ai humanizer usa", slug: "ai-humanizer-usa", entity: "USA", seed: 0 },
  { keyword: "ai humanizer canada", slug: "ai-humanizer-canada", entity: "Canada", seed: 1 },
  { keyword: "ai humanizer uk", slug: "ai-humanizer-uk", entity: "UK", seed: 2 },
  { keyword: "ai humanizer europe", slug: "ai-humanizer-europe", entity: "Europe", seed: 3 },
  { keyword: "ai humanizer australia", slug: "ai-humanizer-australia", entity: "Australia", seed: 4 },
  { keyword: "ai humanizer south africa", slug: "ai-humanizer-south-africa", entity: "South Africa", seed: 5 },
  { keyword: "ai humanizer asia", slug: "ai-humanizer-asia", entity: "Asia", seed: 6 },
];

export function getAllGeoEntries(): KeywordEntryGeo[] {
  return GEO_ENTRIES.map((e) => ({ ...e, cluster: "geo" }));
}

export function getAllGeoSlugs(): string[] {
  return GEO_ENTRIES.map((e) => e.slug);
}

export function getGeoKeywordBySlug(slug: string): KeywordEntryGeo | undefined {
  return getAllGeoEntries().find((e) => e.slug === slug);
}

export function getGeoClusterKeywords(): KeywordEntryGeo[] {
  return getAllGeoEntries();
}
