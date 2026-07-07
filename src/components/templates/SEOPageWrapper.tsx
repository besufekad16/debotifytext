"use client";
import Link from "next/link";
import { ChevronRight, Home, Clock, Calendar } from "lucide-react";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";

interface SEOPageWrapperProps {
  keyword: string;
  cluster: string;
  publishDate?: string;
  readTime?: number;
  children: React.ReactNode;
}

const CLUSTER_LABELS: Record<string, string> = {
  bypass: "AI Detection Bypass",
  humanizer: "AI Humanizer",
  howto: "How-To Guide",
  usecase: "Use Cases",
  competitor: "Comparisons",
  academic: "Academic Writing",
  professional: "Professional",
  detector: "AI Detectors",
  language: "Languages",
  niche: "Niche Content",
  pricing: "Pricing",
  industry: "Industries",
  format: "Content Formats",
  speed: "Speed",
  quality: "Quality",
  tool: "Tool Integration",
  problem: "Problem Solving",
  workflow: "Workflows",
  score: "AI Scores",
  region: "Regions",
  // V4 clusters
  comparison: "Tool Comparisons",
  alternative: "Alternatives",
  review: "Reviews",
  free: "Free Tools",
  detection: "AI Detection",
  writing: "Writing Types",
  education: "Education",
  platform: "Platforms",
  output: "AI Output",
  bulk: "Bulk Processing",
};

const CLUSTER_HREFS: Record<string, string> = {
  bypass: "/bypass-ai-detection",
  humanizer: "/ai-humanizer",
  howto: "/how-to-humanize-ai-text",
  usecase: "/ai-humanizer-for-students",
  competitor: "/best-ai-humanizer",
  academic: "/humanize-ai-essay-for-college",
  professional: "/humanize-ai-for-seo-content",
  detector: "/bypass-turnitin-ai-detection",
  language: "/ai-humanizer-spanish",
  niche: "/ai-humanizer-for-youtube",
  pricing: "/humanifylab-pricing",
  industry: "/ai-humanizer-for-healthcare",
  format: "/humanize-ai-blog-post",
  speed: "/instant-ai-humanizer",
  quality: "/most-accurate-ai-humanizer",
  tool: "/ai-humanizer-for-chatgpt",
  problem: "/how-to-fix-ai-flagged-my-essay",
  workflow: "/ai-humanizer-for-agencies",
  score: "/get-0-percent-ai-score",
  region: "/ai-humanizer-for-uk-students",
  // V4 clusters
  comparison: "/humanifylab-vs-undetectable-ai",
  alternative: "/undetectable-ai-alternative",
  review: "/humanifylab-review",
  free: "/ai-humanizer-free-no-sign-up",
  detection: "/does-turnitin-detect-chatgpt",
  writing: "/ai-humanizer-for-essay",
  education: "/history-essay-ai-humanizer",
  platform: "/ai-humanizer-for-google-docs",
  output: "/make-chatgpt-sound-human",
  bulk: "/bulk-ai-humanizer",
};

// Pool of internal links. Each page shows a deterministic subset of 8,
// varied per keyword so link equity spreads across the whole site instead
// of every page pointing at the same 8 URLs.
const LINK_POOL: { label: string; href: string }[] = [
  { label: "Bypass Turnitin AI Detection", href: "/bypass-turnitin-ai-detection" },
  { label: "Bypass GPTZero", href: "/bypass-gptzero" },
  { label: "Free AI Humanizer", href: "/free-ai-humanizer" },
  { label: "AI Humanizer for Students", href: "/ai-humanizer-for-students" },
  { label: "ChatGPT Humanizer", href: "/chatgpt-humanizer" },
  { label: "Bypass Originality.AI", href: "/bypass-originality-ai" },
  { label: "Best AI Humanizer", href: "/best-ai-humanizer" },
  { label: "Humanize AI Essay", href: "/humanize-ai-essay-for-college" },
  { label: "How to Humanize AI Text", href: "/how-to-humanize-ai-text" },
  { label: "Bypass ZeroGPT", href: "/bypass-zerogpt" },
  { label: "Bypass Copyleaks", href: "/bypass-copyleaks" },
  { label: "Does Turnitin Detect ChatGPT?", href: "/does-turnitin-detect-chatgpt" },
  { label: "Make ChatGPT Sound Human", href: "/make-chatgpt-sound-human" },
  { label: "Undetectable AI Alternative", href: "/undetectable-ai-alternative" },
  { label: "Instant AI Humanizer", href: "/instant-ai-humanizer" },
  { label: "Get 0% AI Score", href: "/get-0-percent-ai-score" },
  { label: "AI Humanizer for Essays", href: "/ai-humanizer-for-essay" },
  { label: "Humanize AI Blog Posts", href: "/humanize-ai-blog-post" },
  { label: "AI Humanizer for Google Docs", href: "/ai-humanizer-for-google-docs" },
  { label: "Bulk AI Humanizer", href: "/bulk-ai-humanizer" },
  { label: "Most Accurate AI Humanizer", href: "/most-accurate-ai-humanizer" },
  { label: "Humanize AI for SEO Content", href: "/humanize-ai-for-seo-content" },
  { label: "AI Humanizer for Agencies", href: "/ai-humanizer-for-agencies" },
  { label: "AI Flagged My Essay — Fix It", href: "/how-to-fix-ai-flagged-my-essay" },
];

function pickRelatedLinks(keyword: string): { label: string; href: string }[] {
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = ((hash << 5) - hash + keyword.charCodeAt(i)) | 0;
  }
  const start = Math.abs(hash) % LINK_POOL.length;
  const step = 1 + (Math.abs(hash >> 3) % 5);
  const links: { label: string; href: string }[] = [];
  const seen = new Set<number>();
  let idx = start;
  while (links.length < 8 && seen.size < LINK_POOL.length) {
    if (!seen.has(idx)) {
      seen.add(idx);
      links.push(LINK_POOL[idx]!);
    }
    idx = (idx + step) % LINK_POOL.length;
    // If step cycles back to a visited index, advance by one
    while (seen.has(idx) && seen.size < LINK_POOL.length) {
      idx = (idx + 1) % LINK_POOL.length;
    }
  }
  return links;
}

export default function SEOPageWrapper({ keyword, cluster, publishDate, readTime, children }: SEOPageWrapperProps) {
  const clusterLabel = CLUSTER_LABELS[cluster] ?? "AI Humanizer";
  const clusterHref = CLUSTER_HREFS[cluster] ?? "/ai-humanizer";
  const relatedLinks = pickRelatedLinks(keyword);

  return (
    <article className="min-h-screen">
      <PageNavbar />
      {/* Breadcrumb nav — visible; structured data lives in the page JSON-LD */}
      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <ol className="mx-auto max-w-4xl flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-500">
          <li>
            <Link href="/" className="flex items-center gap-1 hover:text-[#8b6f47] transition-colors min-h-[44px] py-2">
              <Home className="w-3 h-3" />
              <span>HumanifyLab</span>
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
          <li>
            <Link href={clusterHref} className="hover:text-[#8b6f47] transition-colors min-h-[44px] py-2 inline-block">
              <span>{clusterLabel}</span>
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
          <li className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
            {keyword}
          </li>
        </ol>
      </nav>

      {/* Article meta bar */}
      {(publishDate ?? readTime) && (
        <div className="bg-white border-b border-gray-100 px-4 py-2">
          <div className="mx-auto max-w-4xl flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {publishDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <time dateTime={publishDate}>Published {publishDate}</time>
              </span>
            )}
            {readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime} min read
              </span>
            )}
          </div>
        </div>
      )}

      {/* Page content */}
      <div>{children}</div>

      {/* Internal links footer — improves crawl depth and topical authority */}
      <aside className="bg-gray-50 border-t border-gray-200 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Related Guides</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm text-[#8b6f47] hover:text-[#6d5a3a] hover:underline py-1 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <SiteFooter />
    </article>
  );
}
