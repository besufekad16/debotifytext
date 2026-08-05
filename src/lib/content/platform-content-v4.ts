import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx, smartTitleCase } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats, buildDeepGuide } from '~/lib/content/content-combinator';

export interface PlatformV4PageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  platform: string;
  features: { icon: string; title: string; description: string }[];
  steps: { number: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  guideIntro?: string;
  guideSections?: { title: string; body: string }[];
}

const META_TITLES: ((kw: string, plat: string) => string)[] = [
  (kw, plat) => `${kw} — Bypass AI Detection in ${plat} | HumanifyLab`,
  (kw, plat) => `${kw}: Best AI Humanizer for ${plat} Users | HumanifyLab`,
  (kw, plat) => `${kw} — Make ${plat} AI Content Undetectable | HumanifyLab`,
  (kw, plat) => `${kw}: Humanize AI Text in ${plat} | HumanifyLab`,
  (kw, plat) => `${kw} — ${plat} AI Humanizer with 99.9% Bypass Rate`,
  (kw, plat) => `${kw}: Undetectable AI for ${plat} | HumanifyLab`,
  (kw, plat) => `${kw} — Free AI Humanizer for ${plat} | HumanifyLab`,
  (kw, plat) => `${kw}: Bypass AI Detection in ${plat} in Seconds`,
];

const META_DESCS: ((kw: string, plat: string) => string)[] = [
  (kw, plat) => `${kw}: HumanifyLab makes your ${plat} AI content undetectable with 99.9% bypass rate. Free plan, no sign-up, results in under 10 seconds.`,
  (kw, plat) => `${kw} — humanize AI content for ${plat} with HumanifyLab. 99.9% bypass rate, meaning preserved, zero data stored. Free to start.`,
  (kw, plat) => `${kw}: the best AI humanizer for ${plat} users. 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. Free plan available.`,
  (kw, plat) => `${kw} — bypass AI detection in ${plat} with HumanifyLab. 99.9% success rate, free plan, no credit card needed. Start now.`,
  (kw, plat) => `${kw}: HumanifyLab integrates seamlessly with ${plat}. 99.9% bypass rate, 450,000+ users, free plan. No sign-up required.`,
  (kw, plat) => `${kw} — undetectable AI content for ${plat} with HumanifyLab. 99.9% bypass rate, instant results, zero data stored.`,
  (kw, plat) => `${kw}: free AI humanizer for ${plat} users. 99.9% bypass rate, no credit card, no sign-up. Start humanizing in seconds.`,
  (kw, plat) => `${kw} — bypass AI detection in ${plat} in seconds. HumanifyLab: 99.9% bypass rate, free plan, meaning preserved.`,
];

const H1S: ((kw: string, plat: string) => string)[] = [
  (kw, plat) => `${kw}: Bypass AI Detection in ${plat}`,
  (kw, plat) => `${kw} — The Best AI Humanizer for ${plat}`,
  (kw, plat) => `${kw}: Make ${plat} AI Content Undetectable`,
  (kw, plat) => `${kw} — Humanize AI Text in ${plat}`,
  (kw, plat) => `${kw}: ${plat} AI Humanizer with 99.9% Bypass`,
  (kw, plat) => `${kw} — Undetectable AI for ${plat} Users`,
  (kw, plat) => `${kw}: Free AI Humanizer for ${plat}`,
  (kw, plat) => `${kw} — ${plat} AI Detection Bypass in Seconds`,
];

const HERO_SUBTITLES: ((plat: string) => string)[] = [
  (plat) => `${plat} users create AI content every day — and AI detectors flag it. HumanifyLab integrates seamlessly with ${plat}: copy your AI content, paste it into HumanifyLab, and get undetectable output in under 10 seconds. 99.9% bypass rate, free plan available.`,
  (plat) => `Whether you're writing in ${plat} for work, school, or content creation, HumanifyLab makes your AI text undetectable. Paste from ${plat}, humanize in seconds, paste back. 99.9% bypass rate, zero data stored, free plan.`,
  (plat) => `${plat} is where you write. HumanifyLab is where you make it undetectable. Our seamless workflow: copy from ${plat} → paste into HumanifyLab → get 0% AI score → paste back. 99.9% bypass rate, free to start.`,
  (plat) => `Thousands of ${plat} users trust HumanifyLab to make their AI content undetectable. The workflow is simple: copy from ${plat}, humanize with HumanifyLab, paste back. 99.9% bypass rate, results in under 10 seconds.`,
];

const FEATURES_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '🔌', title: `Works with ${'{plat}'}`, description: 'Copy from your platform, paste into HumanifyLab, paste back. Seamless workflow, no integration required.' },
    { icon: '🎯', title: '99.9% Bypass Rate', description: 'Verified against Turnitin, GPTZero, Originality.AI, and all major detectors. Tested weekly.' },
    { icon: '⚡', title: 'Results in Under 10 Seconds', description: 'No waiting. HumanifyLab processes your content faster than any competitor.' },
    { icon: '🔒', title: 'Zero Data Retention', description: 'Your content is deleted immediately after processing. Complete privacy.' },
  ],
];

const STEPS_POOL: { number: string; title: string; description: string }[][] = [
  [
    { number: '1', title: 'Copy from your platform', description: 'Select your AI-generated content in your platform and copy it to clipboard.' },
    { number: '2', title: 'Paste into HumanifyLab', description: 'Open HumanifyLab.com and paste your content. No account needed for the free plan.' },
    { number: '3', title: 'Humanize in seconds', description: 'Click Humanize and get 0% AI score in under 10 seconds. Meaning preserved.' },
    { number: '4', title: 'Paste back and use', description: 'Copy the humanized output and paste it back into your platform. Done.' },
  ],
];

const FAQ_POOL: ((kw: string, plat: string) => { q: string; a: string }[])[] = [
  (kw, plat) => [
    { q: `Does HumanifyLab work with ${plat}?`, a: `Yes. HumanifyLab works with any platform including ${plat}. The workflow is simple: copy your AI content from ${plat}, paste it into HumanifyLab, humanize in seconds, and paste the undetectable output back into ${plat}.` },
    { q: `Is there a ${plat} integration for HumanifyLab?`, a: `HumanifyLab works via copy-paste with any platform including ${plat}. For automated workflows, the HumanifyLab API is available on Pro and Ultra plans.` },
    { q: `Is HumanifyLab free for ${plat} users?`, a: `Yes. The free plan handles up to 500 words per run with no credit card or sign-up required. Perfect for individual ${plat} content pieces.` },
    { q: `How do I use HumanifyLab with ${plat}?`, a: `Copy your AI content from ${plat}, paste it into HumanifyLab.com, select your tone, click Humanize, and paste the undetectable output back into ${plat}. The whole process takes under 15 seconds.` },
    { q: `Does HumanifyLab bypass AI detection for ${plat} content?`, a: `Yes. HumanifyLab achieves a 99.9% bypass rate against all major AI detectors for content created in ${plat}. The bypass is permanent — your content won't be re-flagged.` },
    { q: `Can I bulk humanize ${plat} content?`, a: `Yes. HumanifyLab's paid plans support bulk processing for high-volume ${plat} content. The API is available on Pro and Ultra plans for automated workflows.` },
  ],
];

export function generatePlatformV4Content(entry: KeywordEntryV4): PlatformV4PageData {
  const { keyword, entity, seed } = entry;
  const platform = entity !== 'Platform' ? entity : 'Google Docs';
  const capitalizedKeyword = smartTitleCase(keyword);
  const combo = buildPageStrings(capitalizedKeyword, seed, entity, 'platform');
  const deep = buildDeepGuide(keyword, seed);

  const features = FEATURES_POOL[0]!.map(f => ({
    ...f,
    description: f.description.replace('{plat}', platform),
  }));

  return {
    metaTitle: META_TITLES[uniqueIdx(seed, keyword, META_TITLES.length, 0)]!(capitalizedKeyword, platform),
    metaDescription: META_DESCS[uniqueIdx(seed, keyword, META_DESCS.length, 1)]!(capitalizedKeyword, platform),
    h1: H1S[uniqueIdx(seed, keyword, H1S.length, 2)]!(capitalizedKeyword, platform),
    heroSubtitle: HERO_SUBTITLES[uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3)]!(platform),
    badge: combo.badge,
    platform,
    features,
    steps: STEPS_POOL[uniqueIdx(seed, keyword, STEPS_POOL.length, 4)]!,
    stats: buildStats(keyword, seed),
    faqs: buildFaqs(keyword, seed, platform, 'platform'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
    guideIntro: deep.guideIntro,
    guideSections: deep.guideSections,
  };
}
