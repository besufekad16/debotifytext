export const CLUSTER_KEYS = [
  "humanizer",
  "bypass",
  "essay",
  "detectors",
  "writing",
  "guides",
  "compare",
  "usecases",
] as const;

export type ClusterKey = (typeof CLUSTER_KEYS)[number];

export interface KeywordEntry {
  keyword: string;
  slug: string;
  cluster: ClusterKey;
  /** Primary entity used for hub grouping and unique copy. */
  entity: string;
  secondary: string;
  tertiary: string;
  seed: number;
  priority: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface GuideSection {
  title: string;
  body: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface TableRow {
  label: string;
  value: string;
}

export interface PseoPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  directAnswer: string;
  heroSubtitle: string;
  takeaways: string[];
  sections: GuideSection[];
  steps: StepItem[];
  table: TableRow[];
  exampleTitle: string;
  exampleBody: string;
  mistakes: string[];
  faqs: FaqItem[];
  stats: StatItem[];
  ctaTitle: string;
  ctaSubtitle: string;
  readTime: number;
}

export const HUB_PAGE_SIZE = 80;
export const BASE_URL = "https://www.humanifylab.com";
export const TARGET_PER_CLUSTER = 5000;
export const TARGET_TOTAL = TARGET_PER_CLUSTER * CLUSTER_KEYS.length;
