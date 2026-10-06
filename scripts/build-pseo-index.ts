import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Setup Paths
const CSV_PATH = path.join(process.cwd(), 'debotifytext_40000_professional_keywords.csv');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'pseo-registry.json');

// Reserved Slugs
const RESERVED_SLUGS = new Set([
  'api', 'pricing', 'contact', 'about', 'blog', 
  'affiliates', 'login', 'signup', 'dashboard', 
  'terms', 'privacy'
]);

// Brand & Core Keywords
const BRAND_KEYWORDS = ['debotifytext', 'debotify lab'];
const CORE_KEYWORDS = ['ai text humanizer', 'ai humanizer', 'text humanizer'];

// Define the contract
interface PSEOPageContract {
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  decision: 'GENERATE' | 'REJECT' | 'MERGE';
  mappedTo?: string; // If rejected or merged, where does it go?
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

// Tokenize a keyword to create a sortable "signature" for clustering
// e.g. "best ai humanizer" -> ["ai", "best", "humanizer"] -> "ai best humanizer"
function getClusterSignature(keyword: string): string {
  const tokens = keyword.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);
  // Remove common stop words for clustering purposes
  const stopWords = new Set(['for', 'the', 'to', 'and', 'in', 'of', 'a', 'an', 'is', 'it']);
  const filtered = tokens.filter(t => !stopWords.has(t) && t.length > 0);
  filtered.sort();
  return filtered.join('-');
}

function toSlug(keyword: string): string {
  return keyword.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim().replace(/\s+/g, '-');
}

async function main() {
  console.log('Reading CSV file...');
  const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`Parsed ${records.length} records. Starting clustering engine...`);

  // Cluster map: signature -> Array of keywords
  const clusters = new Map<string, string[]>();

  for (const row of records) {
    const record = row as Record<string, any>;
    const rawKeyword = record.keyword || record.Keyword;
    if (!rawKeyword) continue;
    
    const keyword = rawKeyword.toString().toLowerCase().trim();
    const signature = getClusterSignature(keyword);

    if (!clusters.has(signature)) {
      clusters.set(signature, []);
    }
    clusters.get(signature)!.push(keyword);
  }

  console.log(`Created ${clusters.size} unique clusters. Applying decision engine...`);

  const registry: Record<string, PSEOPageContract> = {};
  let generatedCount = 0;
  let rejectedCount = 0;

  for (const [signature, keywords] of clusters.entries()) {
    // Sort keywords by length to pick the most concise/natural one as primary
    keywords.sort((a, b) => a.length - b.length);
    
    const primaryKeyword = keywords[0];
    if (!primaryKeyword) continue;
    const slug = toSlug(primaryKeyword);
    const secondaryKeywords = keywords.slice(1, 21); // Max 20 secondary keywords

    const contract: PSEOPageContract = {
      slug,
      primaryKeyword,
      secondaryKeywords,
      decision: 'GENERATE',
      pageStrategy: {
        intent: 'Commercial/Transactional',
        targetAudience: 'Content creators, students, and professionals seeking AI text humanization.',
        tone: 'Professional, authoritative, and direct'
      },
      content: {
        heroTitle: `The Most Advanced ${primaryKeyword.replace(/\b\w/g, l => l.toUpperCase())} in 2026`,
        directAnswer: `DebotifyText is the ultimate solution for "${primaryKeyword}". Our proprietary AI bypasses major detectors by naturally rewriting content without losing original meaning.`,
        toolCallToAction: `Try the ${primaryKeyword.replace(/\b\w/g, l => l.toUpperCase())} now for free.`
      },
      indexing: {
        indexEligibility: true
      }
    };

    // Decision Engine Logic
    if (RESERVED_SLUGS.has(slug)) {
      contract.decision = 'REJECT';
      contract.mappedTo = `/${slug}`;
      contract.indexing.indexEligibility = false;
      rejectedCount++;
    } else if (BRAND_KEYWORDS.some(bk => primaryKeyword.includes(bk))) {
      contract.decision = 'REJECT';
      contract.mappedTo = `/`;
      contract.indexing.indexEligibility = false;
      rejectedCount++;
    } else if (CORE_KEYWORDS.includes(primaryKeyword)) {
      contract.decision = 'REJECT';
      contract.mappedTo = `/ai-humanizer`;
      contract.indexing.indexEligibility = false;
      rejectedCount++;
    } else {
      generatedCount++;
    }

    // Store in registry
    registry[slug] = contract;
  }

  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2));

  console.log('=============================================');
  console.log('PSEO Registry Generation Complete!');
  console.log(`Total Clusters (Canonical Pages): ${clusters.size}`);
  console.log(`Pages Approved to GENERATE: ${generatedCount}`);
  console.log(`Pages REJECTED (Mapped to Core/Reserved): ${rejectedCount}`);
  console.log(`Registry saved to: ${OUTPUT_FILE}`);
  console.log('=============================================');
}

main().catch(console.error);
