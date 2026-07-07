/**
 * Verifies that every internal link used in SEOPageWrapper (link pool +
 * cluster hub hrefs) resolves to a real PSEO slug. Run: npx tsx scripts/verify-internal-links.ts
 */
import { getKeywordBySlug } from "../src/lib/pseo-data";
import { getV2KeywordBySlug } from "../src/lib/pseo-data-v2";
import { getV3KeywordBySlug } from "../src/lib/pseo-data-v3";
import { getV4KeywordBySlug } from "../src/lib/pseo-data-v4";

const slugs = [
  // cluster hub hrefs
  "bypass-ai-detection", "ai-humanizer", "how-to-humanize-ai-text", "ai-humanizer-for-students",
  "best-ai-humanizer", "humanize-ai-essay-for-college", "humanize-ai-for-seo-content", "bypass-turnitin-ai-detection",
  "ai-humanizer-spanish", "ai-humanizer-for-youtube", "humanifylab-pricing", "ai-humanizer-for-healthcare",
  "humanize-ai-blog-post", "instant-ai-humanizer", "most-accurate-ai-humanizer", "ai-humanizer-for-chatgpt",
  "how-to-fix-ai-flagged-my-essay", "ai-humanizer-for-agencies", "get-0-percent-ai-score", "ai-humanizer-for-uk-students",
  "humanifylab-vs-undetectable-ai", "undetectable-ai-alternative", "humanifylab-review", "ai-humanizer-free-no-sign-up",
  "does-turnitin-detect-chatgpt", "ai-humanizer-for-essay", "history-essay-ai-humanizer", "ai-humanizer-for-google-docs",
  "make-chatgpt-sound-human", "bulk-ai-humanizer",
  // link pool
  "bypass-gptzero", "free-ai-humanizer", "chatgpt-humanizer", "bypass-originality-ai",
  "bypass-zerogpt", "bypass-copyleaks",
];

let missing = 0;
for (const s of slugs) {
  const found = getKeywordBySlug(s) ?? getV2KeywordBySlug(s) ?? getV3KeywordBySlug(s) ?? getV4KeywordBySlug(s);
  if (!found) {
    console.log("MISSING:", s);
    missing++;
  }
}
console.log(missing === 0 ? "ALL LINKS OK" : `${missing} MISSING`);
