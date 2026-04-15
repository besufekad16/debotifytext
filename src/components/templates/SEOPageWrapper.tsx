"use client";
import Link from "next/link";
import { ChevronRight, Home, Clock, Calendar, Star } from "lucide-react";

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
  professional: "/humanize-ai-for-seo",
  detector: "/bypass-turnitin-ai-detection",
  language: "/ai-humanizer-in-spanish",
  niche: "/ai-humanizer-for-youtube",
  pricing: "/humanifylab-pricing",
  industry: "/ai-humanizer-for-healthcare",
  format: "/humanize-ai-blog-post",
  speed: "/instant-ai-humanizer",
  quality: "/most-accurate-ai-humanizer",
  tool: "/ai-humanizer-for-chatgpt",
  problem: "/ai-flagged-my-essay",
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

// Internal links shown at bottom of every page — drives crawl depth
const RELATED_LINKS = [
  { label: "Bypass Turnitin", href: "/bypass-turnitin-ai-detection" },
  { label: "Bypass GPTZero", href: "/bypass-gptzero" },
  { label: "Free AI Humanizer", href: "/free-ai-humanizer" },
  { label: "AI Humanizer for Students", href: "/ai-humanizer-for-students" },
  { label: "ChatGPT Humanizer", href: "/chatgpt-humanizer" },
  { label: "Bypass Originality.AI", href: "/bypass-originality-ai" },
  { label: "Best AI Humanizer 2026", href: "/best-ai-humanizer" },
  { label: "Humanize AI Essay", href: "/humanize-ai-essay-for-college" },
];

export default function SEOPageWrapper({ keyword, cluster, publishDate, readTime, children }: SEOPageWrapperProps) {
  const clusterLabel = CLUSTER_LABELS[cluster] ?? "AI Humanizer";
  const clusterHref = CLUSTER_HREFS[cluster] ?? "/ai-humanizer";

  return (
    <article itemScope itemType="https://schema.org/Article" className="min-h-screen">
      {/* Breadcrumb nav — semantic + visible */}
      <nav
        aria-label="Breadcrumb"
        className="bg-gray-50 border-b border-gray-200 px-4 py-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="mx-auto max-w-4xl flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-500">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="flex items-center gap-1 hover:text-[#8b6f47] transition-colors min-h-[44px] py-2" itemProp="item">
              <Home className="w-3 h-3" />
              <span itemProp="name">HumanifyLab</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href={clusterHref} className="hover:text-[#8b6f47] transition-colors min-h-[44px] py-2 inline-block" itemProp="item">
              <span itemProp="name">{clusterLabel}</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
            <span itemProp="name">{keyword}</span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      {/* Article meta bar — signals freshness to Google */}
      {(publishDate ?? readTime) && (
        <div className="bg-white border-b border-gray-100 px-4 py-2">
          <div className="mx-auto max-w-4xl flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {publishDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <time dateTime={publishDate} itemProp="datePublished">Updated {publishDate}</time>
              </span>
            )}
            {readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime} min read
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#8b6f47] text-[#8b6f47]" />
              <span>4.9/5 · 450,000+ users</span>
            </span>
          </div>
        </div>
      )}

      {/* Page content */}
      <div itemProp="articleBody">
        {children}
      </div>

      {/* Internal links footer — improves crawl depth and topical authority */}
      <aside className="bg-gray-50 border-t border-gray-200 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Related Guides</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RELATED_LINKS.map((link, i) => (
              <li key={i}>
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
    </article>
  );
}
