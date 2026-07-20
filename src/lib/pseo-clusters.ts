/**
 * Unified pSEO cluster registry.
 *
 * Every keyword cluster (v1-v4 + geo) is registered here once with a label,
 * a short unique description, and a lookup into its underlying keyword
 * array. This is the single source of truth used by:
 *  - /topics and /topics/[cluster] hub pages (crawl path + internal links)
 *  - SEOPageWrapper breadcrumbs (cluster hub link)
 *  - src/lib/related-links.ts (same-cluster sibling links)
 *  - scripts/generate-all-sitemaps.ts (sitemap file naming/priority)
 */
import { getClusterKeywords, type Cluster } from "~/lib/pseo-data";
import { getV2ClusterKeywords, type ClusterV2 } from "~/lib/pseo-data-v2";
import { getV3ClusterKeywords, type ClusterV3 } from "~/lib/pseo-data-v3";
import { getV4ClusterKeywords, type ClusterV4 } from "~/lib/pseo-data-v4";
import { getV5ClusterKeywords, type ClusterV5 } from "~/lib/pseo-data-v5";
import { getGeoClusterKeywords } from "~/lib/pseo-data-geo";

export type AnyClusterKey = Cluster | ClusterV2 | ClusterV3 | ClusterV4 | ClusterV5 | "geo";

export interface LiteEntry {
  keyword: string;
  slug: string;
  entity: string;
  seed: number;
}

export interface ClusterMeta {
  key: AnyClusterKey;
  label: string;
  /** One unique sentence describing what this cluster covers — used as the
   * hub page intro so /topics/[cluster] pages aren't themselves thin. */
  description: string;
  group: "Bypass & Detection" | "Humanizer & Use Cases" | "Comparisons & Reviews" | "Content & Industry" | "Regions";
  getEntries: () => LiteEntry[];
}

export const CLUSTER_REGISTRY: Record<AnyClusterKey, ClusterMeta> = {
  bypass: {
    key: "bypass", label: "AI Detection Bypass", group: "Bypass & Detection",
    description: "Guides for beating specific AI detectors — Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks and more — with step-by-step bypass methods.",
    getEntries: () => getClusterKeywords("bypass"),
  },
  humanizer: {
    key: "humanizer", label: "AI Humanizer Tools", group: "Humanizer & Use Cases",
    description: "Every way to humanize AI-generated text — by AI model (ChatGPT, Claude, Gemini), by feature, and by use case.",
    getEntries: () => getClusterKeywords("humanizer"),
  },
  howto: {
    key: "howto", label: "How-To Guides", group: "Humanizer & Use Cases",
    description: "Step-by-step tutorials that walk through humanizing AI text and bypassing detection, written for people who want the exact process.",
    getEntries: () => getClusterKeywords("howto"),
  },
  usecase: {
    key: "usecase", label: "Use Cases & Audiences", group: "Humanizer & Use Cases",
    description: "AI humanizer guidance tailored to specific audiences — students, bloggers, marketers, freelancers, and professional writers.",
    getEntries: () => getClusterKeywords("usecase"),
  },
  competitor: {
    key: "competitor", label: "Competitor Comparisons", group: "Comparisons & Reviews",
    description: "Head-to-head comparisons between HumanifyLab and other AI humanizer and paraphrasing tools on the market.",
    getEntries: () => getV2ClusterKeywords("competitor"),
  },
  academic: {
    key: "academic", label: "Academic Writing", group: "Humanizer & Use Cases",
    description: "Humanizing AI-assisted essays, theses, and research papers for university-level academic integrity requirements.",
    getEntries: () => getV2ClusterKeywords("academic"),
  },
  professional: {
    key: "professional", label: "Professional Content", group: "Humanizer & Use Cases",
    description: "Humanizing AI content for professional contexts — SEO writing, business communication, and workplace documents.",
    getEntries: () => getV2ClusterKeywords("professional"),
  },
  detector: {
    key: "detector", label: "AI Detector Deep Dives", group: "Bypass & Detection",
    description: "Deep dives into how specific AI detection tools (QuillBot, Grammarly, and others) score text, and how to stay under their threshold.",
    getEntries: () => getV2ClusterKeywords("detector"),
  },
  language: {
    key: "language", label: "Multilingual Humanizing", group: "Regions",
    description: "AI humanizer guidance for specific languages — Spanish, French, German, Portuguese, and 50+ others.",
    getEntries: () => getV2ClusterKeywords("language"),
  },
  niche: {
    key: "niche", label: "Niche Content Types", group: "Content & Industry",
    description: "Humanizing AI content for specific niches and platforms, from YouTube scripts to niche blog verticals.",
    getEntries: () => getV2ClusterKeywords("niche"),
  },
  pricing: {
    key: "pricing", label: "Pricing & Plans", group: "Comparisons & Reviews",
    description: "Answers to every pricing question — free plans, trials, per-word cost, and plan comparisons.",
    getEntries: () => getV3ClusterKeywords("pricing"),
  },
  industry: {
    key: "industry", label: "Industries", group: "Content & Industry",
    description: "AI humanizer use cases broken down by industry — healthcare, legal, finance, real estate, and more.",
    getEntries: () => getV3ClusterKeywords("industry"),
  },
  format: {
    key: "format", label: "Content Formats", group: "Content & Industry",
    description: "Humanizing specific content formats — emails, LinkedIn posts, resumes, ad copy, and press releases.",
    getEntries: () => getV3ClusterKeywords("format"),
  },
  speed: {
    key: "speed", label: "Speed & Instant Results", group: "Humanizer & Use Cases",
    description: "For anyone on a deadline — how fast HumanifyLab processes text and what to expect turnaround-wise.",
    getEntries: () => getV3ClusterKeywords("speed"),
  },
  quality: {
    key: "quality", label: "Output Quality", group: "Humanizer & Use Cases",
    description: "What makes humanized output read naturally, and how HumanifyLab's transformation compares on accuracy and quality.",
    getEntries: () => getV3ClusterKeywords("quality"),
  },
  tool: {
    key: "tool", label: "Tool Integrations", group: "Content & Industry",
    description: "Using HumanifyLab alongside the tools you already write in — ChatGPT, Google Docs, Word, and browser extensions.",
    getEntries: () => getV3ClusterKeywords("tool"),
  },
  problem: {
    key: "problem", label: "Fixing AI Flags", group: "Bypass & Detection",
    description: "What to do when your content has already been flagged as AI-written, and how to fix it before resubmitting.",
    getEntries: () => getV3ClusterKeywords("problem"),
  },
  workflow: {
    key: "workflow", label: "Team Workflows", group: "Content & Industry",
    description: "Humanizing AI content at scale for agencies, content teams, and multi-writer workflows.",
    getEntries: () => getV3ClusterKeywords("workflow"),
  },
  score: {
    key: "score", label: "AI Score Reduction", group: "Bypass & Detection",
    description: "Practical guidance on getting a specific detector's AI score down to 0%, cluster by cluster.",
    getEntries: () => getV3ClusterKeywords("score"),
  },
  region: {
    key: "region", label: "Student Regions", group: "Regions",
    description: "AI humanizer guidance for students at universities in specific countries and their local detection policies.",
    getEntries: () => getV3ClusterKeywords("region"),
  },
  comparison: {
    key: "comparison", label: "HumanifyLab vs Competitors", group: "Comparisons & Reviews",
    description: "Direct side-by-side comparisons of HumanifyLab against every major competing AI humanizer tool.",
    getEntries: () => getV4ClusterKeywords("comparison"),
  },
  alternative: {
    key: "alternative", label: "Tool Alternatives", group: "Comparisons & Reviews",
    description: "If you're searching for an alternative to another AI humanizer tool, here's how HumanifyLab compares.",
    getEntries: () => getV4ClusterKeywords("alternative"),
  },
  review: {
    key: "review", label: "Reviews", group: "Comparisons & Reviews",
    description: "Honest reviews of HumanifyLab and competing tools — what works, what doesn't, and real bypass rates.",
    getEntries: () => getV4ClusterKeywords("review"),
  },
  free: {
    key: "free", label: "Free & No Sign-up", group: "Humanizer & Use Cases",
    description: "Every free-tier variation — no sign-up, no credit card, free trial, and free forever options explained.",
    getEntries: () => getV4ClusterKeywords("free"),
  },
  detection: {
    key: "detection", label: "Detector vs AI Model", group: "Bypass & Detection",
    description: "Which detectors catch which AI models — a matrix of Turnitin, GPTZero, and others against ChatGPT, Claude, Gemini and more.",
    getEntries: () => getV4ClusterKeywords("detection"),
  },
  writing: {
    key: "writing", label: "Content Types", group: "Content & Industry",
    description: "Humanizing AI-generated writing by content type — essays, blog posts, cover letters, scripts, and more.",
    getEntries: () => getV4ClusterKeywords("writing"),
  },
  education: {
    key: "education", label: "Subjects & Degrees", group: "Regions",
    description: "AI humanizer guidance broken down by academic subject and degree level, from high school to PhD.",
    getEntries: () => getV4ClusterKeywords("education"),
  },
  platform: {
    key: "platform", label: "Platforms", group: "Content & Industry",
    description: "Using HumanifyLab with the platform you publish to — Google Docs, WordPress, Shopify, LMS tools, and more.",
    getEntries: () => getV4ClusterKeywords("platform"),
  },
  output: {
    key: "output", label: "Make AI Sound Human", group: "Humanizer & Use Cases",
    description: "Turning specific AI models' raw output into natural human writing — model by model.",
    getEntries: () => getV4ClusterKeywords("output"),
  },
  bulk: {
    key: "bulk", label: "Bulk & Enterprise", group: "Content & Industry",
    description: "Processing AI content at volume — bulk uploads, API access, and enterprise/agency workflows.",
    getEntries: () => getV4ClusterKeywords("bulk"),
  },
  city: {
    key: "city", label: "Cities", group: "Regions",
    description: "Hyperlocal AI humanizer guidance for students and professionals in major cities worldwide.",
    getEntries: () => getV5ClusterKeywords("city"),
  },
  question: {
    key: "question", label: "Common Questions", group: "Bypass & Detection",
    description: "Direct answers to the questions people actually ask about AI humanizers and AI detectors.",
    getEntries: () => getV5ClusterKeywords("question"),
  },
  feature: {
    key: "feature", label: "Features", group: "Comparisons & Reviews",
    description: "Which AI humanizer features matter, and how HumanifyLab delivers on every one of them.",
    getEntries: () => getV5ClusterKeywords("feature"),
  },
  length: {
    key: "length", label: "Content Length", group: "Content & Industry",
    description: "Humanizing AI content at specific word counts, from short social posts to full-length theses.",
    getEntries: () => getV5ClusterKeywords("length"),
  },
  scenario: {
    key: "scenario", label: "Before You Submit", group: "Humanizer & Use Cases",
    description: "What to do when you're worried a professor, boss, editor, or client will flag your writing as AI-generated.",
    getEntries: () => getV5ClusterKeywords("scenario"),
  },
  geo: {
    key: "geo", label: "Countries & Regions", group: "Regions",
    description: "Flagship AI humanizer landing pages for students and professionals in the United States, Canada, the UK, Europe, Australia, South Africa and Asia.",
    getEntries: () => getGeoClusterKeywords(),
  },
};

export const CLUSTER_ORDER: AnyClusterKey[] = [
  "bypass", "detector", "problem", "score", "detection",
  "humanizer", "howto", "usecase", "speed", "quality", "free", "output",
  "competitor", "alternative", "review", "pricing",
  "industry", "format", "tool", "workflow", "niche", "writing", "platform", "bulk",
  "language", "region", "education", "geo", "academic", "professional",
  "question", "feature", "scenario", "length", "city",
];

let _sizeCache: Record<string, number> | null = null;

export function getClusterSize(key: AnyClusterKey): number {
  if (!_sizeCache) _sizeCache = {};
  if (_sizeCache[key] === undefined) {
    _sizeCache[key] = CLUSTER_REGISTRY[key].getEntries().length;
  }
  return _sizeCache[key]!;
}

export function getTotalPseoCount(): number {
  return CLUSTER_ORDER.reduce((sum, k) => sum + getClusterSize(k), 0);
}
