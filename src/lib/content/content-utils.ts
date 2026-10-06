/**
 * Content uniqueness utilities.
 * 
 * The core problem: with seed % 8, pages 0, 8, 16, 24... all get the same content.
 * Solution: use a compound hash of seed + keyword characters to get a much larger
 * variation space, ensuring every page gets unique content.
 */

/**
 * Generates a stable but unique index for content selection.
 * Combines seed with keyword hash to ensure no two pages share the same variant.
 * 
 * @param seed - The page's numeric seed (0-499)
 * @param keyword - The full keyword string
 * @param poolSize - The size of the content pool to index into
 * @param offset - Optional offset to get different selections from the same page
 */
export function uniqueIdx(seed: number, keyword: string, poolSize: number, offset = 0): number {
  // Hash the keyword into a number
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = ((hash << 5) - hash + keyword.charCodeAt(i)) | 0;
  }
  // Combine seed, hash, and offset — ensure positive
  const combined = Math.abs(seed * 31 + hash * 17 + offset * 7);
  return combined % poolSize;
}

/**
 * Picks N unique items from a pool using the compound seed.
 * Guarantees different selections for different keywords even with the same seed.
 */
export function pickUnique<T>(pool: T[], seed: number, keyword: string, count: number, offset = 0): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  
  for (let i = 0; i < count && result.length < pool.length; i++) {
    let idx = uniqueIdx(seed, keyword, pool.length, offset + i);
    // Avoid duplicates
    let attempts = 0;
    while (used.has(idx) && attempts < pool.length) {
      idx = (idx + 1) % pool.length;
      attempts++;
    }
    used.add(idx);
    result.push(pool[idx]!);
  }
  return result;
}

/**
 * Generates a unique number in a range based on seed + keyword.
 */
export function uniqueNum(seed: number, keyword: string, min: number, max: number, offset = 0): number {
  const idx = uniqueIdx(seed, keyword, max - min + 1, offset);
  return min + idx;
}

// Correct casing for brands, acronyms and detector names that naive
// word-capitalization gets wrong ("Ai" → "AI", "Gptzero" → "GPTZero").
const CASING_MAP: Record<string, string> = {
  ai: "AI",
  api: "API",
  seo: "SEO",
  pdf: "PDF",
  docx: "DOCX",
  faq: "FAQ",
  hr: "HR",
  pr: "PR",
  b2b: "B2B",
  b2c: "B2C",
  saas: "SaaS",
  cv: "CV",
  uk: "UK",
  usa: "USA",
  us: "US",
  eu: "EU",
  uae: "UAE",
  gpt: "GPT",
  gpt4: "GPT-4",
  "gpt-4": "GPT-4",
  gpt5: "GPT-5",
  "gpt-5": "GPT-5",
  chatgpt: "ChatGPT",
  gptzero: "GPTZero",
  zerogpt: "ZeroGPT",
  copyleaks: "Copyleaks",
  turnitin: "Turnitin",
  quillbot: "QuillBot",
  grammarly: "Grammarly",
  debotifytext: "DebotifyText",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  wordpress: "WordPress",
  llm: "LLM",
  llms: "LLMs",
  ieee: "IEEE",
  apa: "APA",
  mla: "MLA",
};

// Small words stay lowercase in titles unless they start the string.
const SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in", "of",
  "on", "or", "the", "to", "vs", "via", "with", "your", "my", "per",
]);

/**
 * Title-cases a keyword with correct brand/acronym casing.
 * "bypass turnitin ai detection" → "Bypass Turnitin AI Detection"
 * "debotifytext vs undetectable ai" → "DebotifyText vs Undetectable AI"
 */
export function smartTitleCase(text: string): string {
  const words = text.split(" ").filter(Boolean);
  return words
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (CASING_MAP[lower]) return CASING_MAP[lower];
      if (i !== 0 && SMALL_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

/**
 * Generates a unique date string between two dates based on seed + keyword.
 */
export function uniqueDate(seed: number, keyword: string): string {
  const start = new Date("2025-01-01").getTime();
  const end = new Date("2026-04-01").getTime();
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = ((hash << 5) - hash + keyword.charCodeAt(i)) | 0;
  }
  const combined = Math.abs(seed * 86400000 + Math.abs(hash) * 3600000);
  const ts = start + (combined % (end - start));
  return new Date(ts).toISOString().split("T")[0]!;
}
