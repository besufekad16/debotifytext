import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx, smartTitleCase } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats, buildSteps, buildFeaturePoints, buildFaqs } from '~/lib/content/content-combinator';

export interface WritingPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  contentType: string;
  features: { icon: string; title: string; description: string }[];
  steps: { number: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const META_TITLES: ((kw: string, ct: string) => string)[] = [
  (kw, ct) => `${kw} — 99.9% Undetectable ${ct} | HumanifyLab`,
  (kw, ct) => `${kw}: Best AI Humanizer for ${ct} | HumanifyLab`,
  (kw, ct) => `${kw} — Make AI ${ct} Undetectable | HumanifyLab`,
  (kw, ct) => `${kw}: Humanize AI ${ct} in Seconds | HumanifyLab`,
  (kw, ct) => `${kw} — Bypass AI Detection for ${ct} | HumanifyLab`,
  (kw, ct) => `${kw}: Undetectable AI ${ct} | HumanifyLab`,
  (kw, ct) => `${kw} — Free AI Humanizer for ${ct} | HumanifyLab`,
  (kw, ct) => `${kw}: ${ct} AI Humanizer with 99.9% Bypass Rate`,
];

const META_DESCS: ((kw: string, ct: string) => string)[] = [
  (kw, ct) => `${kw}: HumanifyLab makes your AI ${ct} undetectable with 99.9% bypass rate. Free plan, no sign-up, results in under 10 seconds. Try now.`,
  (kw, ct) => `${kw} — humanize AI ${ct} with HumanifyLab. 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. Free to start, no card needed.`,
  (kw, ct) => `${kw}: the best AI humanizer for ${ct}. 99.9% bypass rate, meaning preserved, zero data stored. Free plan available today.`,
  (kw, ct) => `${kw} — bypass AI detection for ${ct} with HumanifyLab. 99.9% success rate, free plan, no sign-up. Results in under 10 seconds.`,
  (kw, ct) => `${kw}: make AI ${ct} undetectable with HumanifyLab. 99.9% bypass rate, 450,000+ users, free plan. No credit card required.`,
  (kw, ct) => `${kw} — undetectable AI ${ct} with HumanifyLab. 99.9% bypass rate, instant results, zero data stored. Free to start.`,
  (kw, ct) => `${kw}: free AI humanizer for ${ct}. 99.9% bypass rate, no credit card, no sign-up. Start humanizing in seconds.`,
  (kw, ct) => `${kw} — bypass AI detection for ${ct} in seconds. HumanifyLab: 99.9% bypass rate, free plan, meaning preserved.`,
];

const H1S: ((kw: string, ct: string) => string)[] = [
  (kw, ct) => `${kw}: Make AI ${ct} 99.9% Undetectable`,
  (kw, ct) => `${kw} — The Best AI Humanizer for ${ct}`,
  (kw, ct) => `${kw}: Humanize AI ${ct} in Seconds`,
  (kw, ct) => `${kw} — Bypass AI Detection for ${ct}`,
  (kw, ct) => `${kw}: Undetectable AI ${ct} Every Time`,
  (kw, ct) => `${kw} — Free AI Humanizer for ${ct}`,
  (kw, ct) => `${kw}: ${ct} AI Humanizer with 99.9% Bypass`,
  (kw, ct) => `${kw} — AI ${ct} That Passes Every Detector`,
];

const HERO_SUBTITLES: ((ct: string) => string)[] = [
  (ct) => `AI-generated ${ct} gets flagged by Turnitin, GPTZero, and Originality.AI. HumanifyLab transforms your AI ${ct} into authentic human writing that passes every detector — 99.9% bypass rate, meaning preserved, free plan available.`,
  (ct) => `Whether you're writing a ${ct} for work, school, or content creation, HumanifyLab makes your AI text undetectable. Paste your AI ${ct}, humanize in seconds, get 0% AI score. 99.9% bypass rate, zero data stored.`,
  (ct) => `Your AI ${ct} is great — but AI detectors will flag it. HumanifyLab fixes that. Our 47-dimensional transformation makes your AI ${ct} statistically indistinguishable from human writing. 99.9% bypass rate, free plan.`,
  (ct) => `Thousands of writers use HumanifyLab to make their AI ${ct} undetectable. The workflow is simple: paste your AI ${ct} → click Humanize → get 0% AI score. 99.9% bypass rate, results in under 10 seconds.`,
];

export function generateWritingContent(entry: KeywordEntryV4): WritingPageData {
  const { keyword, entity, seed } = entry;
  const displayKeyword = smartTitleCase(keyword);
  const contentType = entity !== 'Content' ? entity : 'content';
  const combo = buildPageStrings(keyword, seed, entity, 'writing');

  const ti = uniqueIdx(seed, keyword, META_TITLES.length, 0);
  const di = uniqueIdx(seed, keyword, META_DESCS.length, 1);
  const hi = uniqueIdx(seed, keyword, H1S.length, 2);
  const hsi = uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3);

  return {
    metaTitle: META_TITLES[ti]!(displayKeyword, contentType),
    metaDescription: META_DESCS[di]!(displayKeyword, contentType),
    h1: H1S[hi]!(displayKeyword, contentType),
    heroSubtitle: HERO_SUBTITLES[hsi]!(contentType),
    badge: combo.badge,
    contentType,
    features: buildFeaturePoints(keyword, seed, 'writing'),
    steps: buildSteps(keyword, seed, 'writing'),
    stats: buildStats(keyword, seed),
    faqs: buildFaqs(keyword, seed, entity, 'writing'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
