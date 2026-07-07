import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx, smartTitleCase } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats, buildSteps, buildFeaturePoints, buildFaqs } from '~/lib/content/content-combinator';

export interface BulkPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  features: { icon: string; title: string; description: string }[];
  steps: { number: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const META_TITLES: ((kw: string) => string)[] = [
  (kw) => `${kw} — Process Thousands of Documents | HumanifyLab`,
  (kw) => `${kw}: Enterprise AI Humanizer with API | HumanifyLab`,
  (kw) => `${kw} — 99.9% Bypass Rate at Scale | HumanifyLab`,
  (kw) => `${kw}: Bulk AI Humanizer for Teams & Agencies | HumanifyLab`,
  (kw) => `${kw} — Automate AI Humanization at Scale | HumanifyLab`,
  (kw) => `${kw}: High-Volume AI Humanizer | HumanifyLab`,
  (kw) => `${kw} — Bulk Process AI Content | HumanifyLab`,
  (kw) => `${kw}: Scale AI Humanization with HumanifyLab API`,
];

const META_DESCS: ((kw: string) => string)[] = [
  (kw) => `${kw}: HumanifyLab processes thousands of documents with 99.9% bypass rate. API access, bulk mode, enterprise plans. Start free today.`,
  (kw) => `${kw} — HumanifyLab's bulk processing handles high-volume AI humanization. 99.9% bypass rate, API access, team plans. Free to start.`,
  (kw) => `${kw}: enterprise AI humanizer with bulk processing and API access. 99.9% bypass rate, zero data stored, unlimited plans available.`,
  (kw) => `${kw} — automate AI humanization at scale with HumanifyLab. 99.9% bypass rate, REST API, bulk mode, team and agency plans.`,
  (kw) => `${kw}: HumanifyLab scales to any volume. Bulk processing, API access, 99.9% bypass rate. Enterprise plans with unlimited words available.`,
  (kw) => `${kw} — high-volume AI humanization with HumanifyLab. 99.9% bypass rate, API integration, bulk mode. Free plan to start.`,
  (kw) => `${kw}: bulk AI humanizer for teams and agencies. 99.9% bypass rate, REST API, unlimited plans. Start free, scale as needed.`,
  (kw) => `${kw} — scale AI humanization with HumanifyLab's API. 99.9% bypass rate, bulk processing, enterprise plans. Free to start.`,
];

const H1S: ((kw: string) => string)[] = [
  (kw) => `${kw}: Process Thousands of Documents at 99.9% Bypass Rate`,
  (kw) => `${kw} — Enterprise AI Humanizer with API Access`,
  (kw) => `${kw}: Bulk AI Humanization at Scale`,
  (kw) => `${kw} — Automate AI Humanization for Teams & Agencies`,
  (kw) => `${kw}: High-Volume AI Humanizer`,
  (kw) => `${kw} — Scale AI Humanization with HumanifyLab`,
  (kw) => `${kw}: Bulk Process AI Content with 99.9% Bypass`,
  (kw) => `${kw} — The Enterprise AI Humanizer`,
];

const HERO_SUBTITLES: ((kw: string) => string)[] = [
  (kw) => `HumanifyLab scales to any volume. Whether you need to ${kw.toLowerCase()} for 10 documents or 10,000, our bulk processing and REST API handle it with the same 99.9% bypass rate. Enterprise plans with unlimited words, dedicated support, and custom API limits available.`,
  (kw) => `Teams and agencies use HumanifyLab to ${kw.toLowerCase()} at scale. Our REST API integrates into any workflow — Zapier, Make.com, n8n, or custom pipelines. 99.9% bypass rate, zero data stored, unlimited plans available.`,
  (kw) => `${kw.charAt(0).toUpperCase() + kw.slice(1)} with HumanifyLab's enterprise-grade infrastructure. Bulk mode processes multiple documents simultaneously. The API supports batch requests for high-volume automation. 99.9% bypass rate, every time.`,
  (kw) => `Content teams, SEO agencies, and developers use HumanifyLab to ${kw.toLowerCase()} at scale. REST API, bulk mode, webhook support, and enterprise plans with unlimited words. 99.9% bypass rate, zero data retention.`,
];

export function generateBulkContent(entry: KeywordEntryV4): BulkPageData {
  const { keyword, seed } = entry;
  const displayKeyword = smartTitleCase(keyword);
  const combo = buildPageStrings(keyword, seed, 'Bulk', 'bulk');

  const ti = uniqueIdx(seed, keyword, META_TITLES.length, 0);
  const di = uniqueIdx(seed, keyword, META_DESCS.length, 1);
  const hi = uniqueIdx(seed, keyword, H1S.length, 2);
  const hsi = uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3);

  return {
    metaTitle: META_TITLES[ti]!(displayKeyword),
    metaDescription: META_DESCS[di]!(displayKeyword),
    h1: H1S[hi]!(displayKeyword),
    heroSubtitle: HERO_SUBTITLES[hsi]!(displayKeyword),
    badge: combo.badge,
    features: buildFeaturePoints(keyword, seed, 'bulk'),
    steps: buildSteps(keyword, seed, 'bulk'),
    stats: buildStats(keyword, seed),
    faqs: buildFaqs(keyword, seed, 'Bulk', 'bulk'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
