import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats, buildSteps, buildFeaturePoints, buildFaqs } from '~/lib/content/content-combinator';

export interface EducationPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  subject: string;
  features: { icon: string; title: string; description: string }[];
  steps: { number: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const META_TITLES: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${kw} — Bypass Turnitin for ${subj} | HumanifyLab`,
  (kw, subj) => `${kw}: Best AI Humanizer for ${subj} Students | HumanifyLab`,
  (kw, subj) => `${kw} — Make AI ${subj} Writing Undetectable | HumanifyLab`,
  (kw, subj) => `${kw}: Humanize AI ${subj} Essays in Seconds | HumanifyLab`,
  (kw, subj) => `${kw} — 99.9% Turnitin Bypass for ${subj} | HumanifyLab`,
  (kw, subj) => `${kw}: Undetectable AI for ${subj} Writing | HumanifyLab`,
  (kw, subj) => `${kw} — Free AI Humanizer for ${subj} Essays | HumanifyLab`,
  (kw, subj) => `${kw}: ${subj} AI Humanizer with 99.9% Bypass Rate`,
];

const META_DESCS: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${kw}: HumanifyLab makes your AI ${subj} writing undetectable with 99.9% bypass rate. Free plan, no sign-up, results in under 10 seconds.`,
  (kw, subj) => `${kw} — humanize AI ${subj} essays with HumanifyLab. 99.9% bypass rate against Turnitin and GPTZero. Free to start, no card needed.`,
  (kw, subj) => `${kw}: the best AI humanizer for ${subj} students. 99.9% bypass rate, meaning preserved, zero data stored. Free plan available.`,
  (kw, subj) => `${kw} — bypass Turnitin for ${subj} writing with HumanifyLab. 99.9% success rate, free plan, no sign-up. Results in under 10 seconds.`,
  (kw, subj) => `${kw}: make AI ${subj} essays undetectable with HumanifyLab. 99.9% bypass rate, 450,000+ users, free plan. No credit card required.`,
  (kw, subj) => `${kw} — undetectable AI ${subj} writing with HumanifyLab. 99.9% bypass rate, instant results, zero data stored. Free to start.`,
  (kw, subj) => `${kw}: free AI humanizer for ${subj} essays. 99.9% bypass rate, no credit card, no sign-up. Start humanizing in seconds.`,
  (kw, subj) => `${kw} — bypass AI detection for ${subj} writing in seconds. HumanifyLab: 99.9% bypass rate, free plan, meaning preserved.`,
];

const H1S: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${kw}: Make AI ${subj} Writing 99.9% Undetectable`,
  (kw, subj) => `${kw} — The Best AI Humanizer for ${subj} Students`,
  (kw, subj) => `${kw}: Humanize AI ${subj} Essays in Seconds`,
  (kw, subj) => `${kw} — Bypass Turnitin for ${subj} Writing`,
  (kw, subj) => `${kw}: Undetectable AI ${subj} Writing Every Time`,
  (kw, subj) => `${kw} — Free AI Humanizer for ${subj} Essays`,
  (kw, subj) => `${kw}: ${subj} AI Humanizer with 99.9% Bypass`,
  (kw, subj) => `${kw} — AI ${subj} Writing That Passes Turnitin`,
];

const HERO_SUBTITLES: ((subj: string) => string)[] = [
  (subj) => `${subj} students use AI to draft essays and research papers — but Turnitin and GPTZero flag it instantly. HumanifyLab transforms your AI ${subj} writing into authentic human text that passes every detector. 99.9% bypass rate, free plan, no sign-up.`,
  (subj) => `Writing ${subj} essays with AI is efficient. Getting flagged by Turnitin is not. HumanifyLab solves this — paste your AI ${subj} content, click Humanize, get 0% AI score. 99.9% bypass rate, meaning preserved, free plan available.`,
  (subj) => `Thousands of ${subj} students trust HumanifyLab to make their AI writing undetectable. Our Academic tone preset is specifically tuned for university-level ${subj} writing. 99.9% Turnitin bypass rate, zero data stored.`,
  (subj) => `Your AI ${subj} essay is great — but Turnitin will flag it. HumanifyLab fixes that in under 10 seconds. 47-dimensional transformation, 99.9% bypass rate, free plan with no sign-up required.`,
];

export function generateEducationContent(entry: KeywordEntryV4): EducationPageData {
  const { keyword, entity, seed } = entry;
  const subject = entity !== 'Academic' ? entity : 'Academic';
  const combo = buildPageStrings(keyword, seed, entity, 'education');

  const ti = uniqueIdx(seed, keyword, META_TITLES.length, 0);
  const di = uniqueIdx(seed, keyword, META_DESCS.length, 1);
  const hi = uniqueIdx(seed, keyword, H1S.length, 2);
  const hsi = uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3);

  return {
    metaTitle: META_TITLES[ti]!(keyword, subject),
    metaDescription: META_DESCS[di]!(keyword, subject),
    h1: H1S[hi]!(keyword, subject),
    heroSubtitle: HERO_SUBTITLES[hsi]!(subject),
    badge: combo.badge,
    subject,
    features: buildFeaturePoints(keyword, seed, 'education'),
    steps: buildSteps(keyword, seed, 'education'),
    stats: buildStats(keyword, seed),
    faqs: buildFaqs(keyword, seed, entity, 'education'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
