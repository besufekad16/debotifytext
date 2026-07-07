import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx, smartTitleCase } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats, buildSteps, buildFeaturePoints, buildFaqs } from '~/lib/content/content-combinator';

export interface OutputPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  aiTool: string;
  features: { icon: string; title: string; description: string }[];
  steps: { number: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const META_TITLES: ((kw: string, tool: string) => string)[] = [
  (kw, tool) => `${kw} — Make ${tool} Sound Human | HumanifyLab`,
  (kw, tool) => `${kw}: Best ${tool} Humanizer in 2026 | HumanifyLab`,
  (kw, tool) => `${kw} — Make ${tool} Output Undetectable | HumanifyLab`,
  (kw, tool) => `${kw}: Humanize ${tool} Text in Seconds | HumanifyLab`,
  (kw, tool) => `${kw} — ${tool} AI Humanizer with 99.9% Bypass Rate`,
  (kw, tool) => `${kw}: Undetectable ${tool} Content | HumanifyLab`,
  (kw, tool) => `${kw} — Free ${tool} Humanizer | HumanifyLab`,
  (kw, tool) => `${kw}: ${tool} to Human Text Converter | HumanifyLab`,
];

const META_DESCS: ((kw: string, tool: string) => string)[] = [
  (kw, tool) => `${kw}: HumanifyLab makes ${tool} output sound human with 99.9% bypass rate. Free plan, no sign-up, results in under 10 seconds. Try now.`,
  (kw, tool) => `${kw} — humanize ${tool} text with HumanifyLab. 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. Free to start.`,
  (kw, tool) => `${kw}: the best ${tool} humanizer in 2026. 99.9% bypass rate, meaning preserved, zero data stored. Free plan available today.`,
  (kw, tool) => `${kw} — make ${tool} output undetectable with HumanifyLab. 99.9% success rate, free plan, no sign-up. Results in under 10 seconds.`,
  (kw, tool) => `${kw}: convert ${tool} text to human writing with HumanifyLab. 99.9% bypass rate, 450,000+ users, free plan. No credit card required.`,
  (kw, tool) => `${kw} — undetectable ${tool} content with HumanifyLab. 99.9% bypass rate, instant results, zero data stored. Free to start.`,
  (kw, tool) => `${kw}: free ${tool} humanizer. 99.9% bypass rate, no credit card, no sign-up. Start humanizing ${tool} output in seconds.`,
  (kw, tool) => `${kw} — ${tool} to human text converter. HumanifyLab: 99.9% bypass rate, free plan, meaning preserved. Try now.`,
];

const H1S: ((kw: string, tool: string) => string)[] = [
  (kw, tool) => `${kw}: Make ${tool} Sound Human`,
  (kw, tool) => `${kw} — The Best ${tool} Humanizer in 2026`,
  (kw, tool) => `${kw}: Make ${tool} Output 99.9% Undetectable`,
  (kw, tool) => `${kw} — Humanize ${tool} Text in Seconds`,
  (kw, tool) => `${kw}: ${tool} AI Humanizer with 99.9% Bypass`,
  (kw, tool) => `${kw} — Undetectable ${tool} Content Every Time`,
  (kw, tool) => `${kw}: Free ${tool} Humanizer`,
  (kw, tool) => `${kw} — ${tool} to Human Text Converter`,
];

const HERO_SUBTITLES: ((tool: string) => string)[] = [
  (tool) => `${tool} produces clean, structured text — but AI detectors spot it instantly. HumanifyLab transforms ${tool} output into authentic human writing that passes every detector. 99.9% bypass rate, meaning preserved, free plan available.`,
  (tool) => `The problem with ${tool} isn't the ideas — it's the patterns. Every AI model leaves a statistical fingerprint. HumanifyLab erases that fingerprint completely, achieving a 99.9% bypass rate against all major detectors.`,
  (tool) => `${tool} is a powerful writing tool. HumanifyLab makes it undetectable. Paste your ${tool} output, click Humanize, get 0% AI score in under 10 seconds. 99.9% bypass rate, zero data stored.`,
  (tool) => `Millions of ${tool} users face the same problem: great content that gets flagged. HumanifyLab solves it permanently — 99.9% bypass rate, free plan, zero data retention, results in under 10 seconds.`,
];

export function generateOutputContent(entry: KeywordEntryV4): OutputPageData {
  const { keyword, entity, seed } = entry;
  const displayKeyword = smartTitleCase(keyword);
  const aiTool = entity !== 'AI Tool' ? entity : 'AI';
  const combo = buildPageStrings(keyword, seed, entity, 'output');

  const ti = uniqueIdx(seed, keyword, META_TITLES.length, 0);
  const di = uniqueIdx(seed, keyword, META_DESCS.length, 1);
  const hi = uniqueIdx(seed, keyword, H1S.length, 2);
  const hsi = uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3);

  return {
    metaTitle: META_TITLES[ti]!(displayKeyword, aiTool),
    metaDescription: META_DESCS[di]!(displayKeyword, aiTool),
    h1: H1S[hi]!(displayKeyword, aiTool),
    heroSubtitle: HERO_SUBTITLES[hsi]!(aiTool),
    badge: combo.badge,
    aiTool,
    features: buildFeaturePoints(keyword, seed, 'output'),
    steps: buildSteps(keyword, seed, 'output'),
    stats: buildStats(keyword, seed),
    faqs: buildFaqs(keyword, seed, entity, 'output'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
