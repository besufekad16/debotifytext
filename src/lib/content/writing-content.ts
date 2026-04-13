import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats, buildSteps, buildFeaturePoints } from '~/lib/content/content-combinator';

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
  (kw, ct) => `${kw}: Best AI Humanizer for ${ct} in 2026 | HumanifyLab`,
  (kw, ct) => `${kw} — Make Your AI ${ct} Undetectable | HumanifyLab`,
  (kw, ct) => `${kw}: Bypass AI Detection in Your ${ct} | HumanifyLab`,
  (kw, ct) => `${kw} — Free ${ct} AI Humanizer | HumanifyLab`,
  (kw, ct) => `${kw}: Humanize AI ${ct} in Seconds | HumanifyLab`,
  (kw, ct) => `${kw} — Undetectable AI ${ct} Tool | HumanifyLab`,
  (kw, ct) => `${kw}: 0% AI Score on Your ${ct} | HumanifyLab`,
];

const META_DESCS: ((kw: string, ct: string) => string)[] = [
  (kw, ct) => `${kw}: HumanifyLab makes your AI ${ct.toLowerCase()} undetectable with 99.9% bypass rate. Free plan, no sign-up, results in under 10 seconds.`,
  (kw, ct) => `${kw} — humanize your AI ${ct.toLowerCase()} with HumanifyLab. 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. Free to start.`,
  (kw, ct) => `${kw}: the best tool for ${ct.toLowerCase()} AI humanization. 99.9% bypass rate, meaning preserved, zero data stored. Try free today.`,
  (kw, ct) => `${kw} — make your AI ${ct.toLowerCase()} pass every detector. HumanifyLab: 99.9% bypass rate, free plan, no card needed.`,
  (kw, ct) => `${kw}: HumanifyLab humanizes AI ${ct.toLowerCase()} in under 10 seconds. 99.9% bypass rate, 450,000+ users, free plan available.`,
  (kw, ct) => `${kw} — bypass AI detection in your ${ct.toLowerCase()} with HumanifyLab. 99.9% success rate, zero data stored, free to start.`,
  (kw, ct) => `${kw}: undetectable AI ${ct.toLowerCase()} with HumanifyLab. 99.9% bypass rate, meaning preserved, instant results. No sign-up required.`,
  (kw, ct) => `${kw} — get 0% AI score on your ${ct.toLowerCase()} with HumanifyLab. 99.9% bypass rate, free plan, no credit card needed.`,
];

const H1S: ((kw: string, ct: string) => string)[] = [
  (kw, ct) => `${kw}: Make Your AI ${ct} 99.9% Undetectable`,
  (kw, ct) => `${kw} — The Best AI Humanizer for ${ct}`,
  (kw, ct) => `${kw}: Bypass AI Detection in Your ${ct}`,
  (kw, ct) => `${kw} — Undetectable AI ${ct} in Seconds`,
  (kw, ct) => `${kw}: Get 0% AI Score on Your ${ct}`,
  (kw, ct) => `${kw} — Free ${ct} AI Humanizer`,
  (kw, ct) => `${kw}: Humanize AI ${ct} with 99.9% Success`,
  (kw, ct) => `${kw} — AI ${ct} That Passes Every Detector`,
];

const HERO_SUBTITLES: ((ct: string) => string)[] = [
  (ct) => `AI-generated ${ct.toLowerCase()} gets flagged by Turnitin, GPTZero, and Originality.AI. HumanifyLab transforms your AI ${ct.toLowerCase()} into authentic human writing that passes every detector — 99.9% bypass rate, meaning preserved, results in under 10 seconds.`,
  (ct) => `Your AI ${ct.toLowerCase()} is great — but it gets flagged. HumanifyLab fixes that. Our 47-dimensional transformation removes the AI signature from your ${ct.toLowerCase()} while preserving every idea, fact, and argument. 99.9% bypass rate, free plan available.`,
  (ct) => `Writing a ${ct.toLowerCase()} with AI is fast. Making it undetectable is even faster with HumanifyLab. Paste your AI ${ct.toLowerCase()}, click Humanize, and get 0% AI score in under 10 seconds. Free plan, no sign-up required.`,
  (ct) => `AI detectors are specifically trained to flag ${ct.toLowerCase()} content. HumanifyLab is specifically built to defeat them. 99.9% bypass rate, 450,000+ users, free plan. Your AI ${ct.toLowerCase()} will pass every detector.`,
];

const FEATURES_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '📝', title: 'Optimized for Your Content Type', description: 'HumanifyLab\'s transformation is tuned for different content types — essays, blog posts, emails, and more.' },
    { icon: '🎯', title: '99.9% Bypass Rate', description: 'Verified against Turnitin, GPTZero, Originality.AI, and all major detectors. Tested weekly.' },
    { icon: '✅', title: 'Meaning Preserved', description: 'Your original argument, facts, and structure remain intact. Only the AI signature is removed.' },
    { icon: '⚡', title: 'Results in Under 10 Seconds', description: 'No waiting, no queues. Your humanized content is ready faster than you can open a new tab.' },
  ],
  [
    { icon: '🎓', title: 'Academic Tone Available', description: 'Academic tone preset is tuned for university-level writing, passing Turnitin with 0-3% AI scores.' },
    { icon: '💼', title: 'Professional Tone Available', description: 'Professional tone delivers polished, business-ready content that passes all workplace AI checks.' },
    { icon: '🔒', title: 'Zero Data Retention', description: 'Your content is deleted immediately after processing. Complete privacy on every plan.' },
    { icon: '🆓', title: 'Free Plan Available', description: '500 words per run, no credit card, no sign-up. Start humanizing your content immediately.' },
  ],
];

const STEPS_POOL: { number: string; title: string; description: string }[][] = [
  [
    { number: '1', title: 'Paste your AI content', description: 'Copy your AI-generated text and paste it into HumanifyLab. Works with any content type.' },
    { number: '2', title: 'Choose your tone', description: 'Select Academic, Professional, or Casual tone to match your content type and context.' },
    { number: '3', title: 'Humanize in seconds', description: 'Click Humanize and get 0% AI score in under 10 seconds. Meaning preserved.' },
    { number: '4', title: 'Submit with confidence', description: 'Your humanized content passes every detector permanently. Ready to submit or publish.' },
  ],
];

const FAQ_POOL: ((kw: string, ct: string) => { q: string; a: string }[])[] = [
  (kw, ct) => [
    { q: `Does HumanifyLab work for ${ct.toLowerCase()}?`, a: `Yes. HumanifyLab is optimized for all content types including ${ct.toLowerCase()}. It achieves a 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI for ${ct.toLowerCase()} content.` },
    { q: `Will my ${ct.toLowerCase()} still make sense after humanization?`, a: `Yes. HumanifyLab preserves 100% of your original meaning, facts, and structure. Only the AI signature is removed. Your ${ct.toLowerCase()} will read naturally and professionally.` },
    { q: `Which tone should I use for ${ct.toLowerCase()}?`, a: `For academic ${ct.toLowerCase()}, use the Academic tone preset. For business ${ct.toLowerCase()}, use Professional. For blog posts and social content, use Casual. Each preset is tuned for different contexts.` },
    { q: `Is HumanifyLab free for ${ct.toLowerCase()}?`, a: `Yes. The free plan handles up to 500 words per run with no credit card or sign-up required. The same 99.9% bypass rate applies on the free plan.` },
    { q: `How long does it take to humanize a ${ct.toLowerCase()}?`, a: `Under 10 seconds for most ${ct.toLowerCase()} content. Long-form documents take under 60 seconds. Results appear in real time.` },
    { q: `Does HumanifyLab work for ${ct.toLowerCase()} in other languages?`, a: `Yes. HumanifyLab supports 50+ languages for ${ct.toLowerCase()} humanization with the same 99.9% bypass rate as English.` },
  ],
];

export function generateWritingContent(entry: KeywordEntryV4): WritingPageData {
  const { keyword, entity, seed } = entry;
  const contentType = entity !== 'Content' ? entity : 'Content';
  const capitalizedKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const combo = buildPageStrings(capitalizedKeyword, seed, entity, 'writing');

  return {
    metaTitle: META_TITLES[uniqueIdx(seed, keyword, META_TITLES.length, 0)]!(capitalizedKeyword, contentType),
    metaDescription: META_DESCS[uniqueIdx(seed, keyword, META_DESCS.length, 1)]!(capitalizedKeyword, contentType),
    h1: H1S[uniqueIdx(seed, keyword, H1S.length, 2)]!(capitalizedKeyword, contentType),
    heroSubtitle: HERO_SUBTITLES[uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3)]!(contentType),
    badge: combo.badge,
    contentType,
    features: FEATURES_POOL[uniqueIdx(seed, keyword, FEATURES_POOL.length, 4)]!,
    steps: STEPS_POOL[uniqueIdx(seed, keyword, STEPS_POOL.length, 5)]!,
    stats: buildStats(keyword, seed),
    faqs: FAQ_POOL[uniqueIdx(seed, keyword, FAQ_POOL.length, 6)]!(keyword, contentType),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
