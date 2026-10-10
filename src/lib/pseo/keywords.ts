import 'server-only';
import fs from 'fs';
import path from 'path';

// Note: In Next.js App Router, this will run server-side.
// We load the JSON registry built by the pipeline.

export interface PSEOPageContract {
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  decision: 'GENERATE' | 'REJECT' | 'MERGE';
  mappedTo?: string;
  pageStrategy: {
    intent: string;
    targetAudience: string;
    tone: string;
  };
  content: {
    heroTitle: string;
    directAnswer: string;
    toolCallToAction: string;
  };
  indexing: {
    indexEligibility: boolean;
  };
}

const REGISTRY_PATH = path.join(process.cwd(), 'src/data/pseo-registry.json');
let registryCache: Record<string, PSEOPageContract> | null = null;

function loadRegistry(): Record<string, PSEOPageContract> {
  if (registryCache) return registryCache;
  try {
    const file = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    registryCache = JSON.parse(file);
    return registryCache!;
  } catch (err) {
    console.error("Failed to load PSEO registry:", err);
    return {};
  }
}

export function getKeywordBySlug(slug: string): PSEOPageContract | undefined {
  const reg = loadRegistry();
  return reg[slug];
}

export function getAllApprovedSlugs(): string[] {
  const reg = loadRegistry();
  return Object.values(reg)
    .filter(contract => contract.decision === 'GENERATE' && contract.indexing.indexEligibility)
    .map(contract => contract.slug);
}

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.debotifytext.com";

// Keep some utilities alive for compatibility with anything outside of the old templates
export function pseoPath(slug: string): string {
  return `/${slug}`;
}

export function getRandomApprovedSlugs(count: number, excludeSlug?: string): string[] {
  const slugs = getAllApprovedSlugs().filter(s => s !== excludeSlug);
  
  // Deterministic shuffle based on the excludeSlug (so the related links stay static per page)
  let h = 0;
  if (excludeSlug) {
    for (let i = 0; i < excludeSlug.length; i++) {
      h = Math.imul(31, h) + excludeSlug.charCodeAt(i) | 0;
    }
  }

  // Shuffle using LCG
  const shuffled = [...slugs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    h = Math.imul(1664525, h) + 1013904223 | 0;
    const rnd = Math.abs(h) / 2147483648;
    const j = Math.floor(rnd * (i + 1));
    const temp = shuffled[i] as string;
    shuffled[i] = shuffled[j] as string;
    shuffled[j] = temp;
  }

  return shuffled.slice(0, count);
}
