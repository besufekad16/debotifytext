import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats, buildSteps, buildFeaturePoints, buildFaqs } from '~/lib/content/content-combinator';

export interface FreePageData {
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
  (kw) => `${kw} — 100% Free, No Sign-Up | HumanifyLab`,
  (kw) => `${kw}: Free Tool with 99.9% Bypass Rate | HumanifyLab`,
  (kw) => `${kw} — Free Forever, No Credit Card | HumanifyLab`,
  (kw) => `${kw}: The Best Free Option in 2026 | HumanifyLab`,
  (kw) => `${kw} — Instant, Free & 99.9% Effective | HumanifyLab`,
  (kw) => `${kw}: Free Plan, No Watermark, No Limits | HumanifyLab`,
  (kw) => `${kw} — Free AI Humanizer That Actually Works`,
  (kw) => `${kw}: Start Free Today — No Card, No Sign-Up`,
];

const META_DESCS: ((kw: string) => string)[] = [
  (kw) => `${kw} with HumanifyLab — completely free, no sign-up required. 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. 500 words per run, instant results.`,
  (kw) => `${kw}: HumanifyLab's free plan gives you 500 words per run, no credit card, no account. 99.9% bypass rate. Start in seconds.`,
  (kw) => `${kw} — free forever with HumanifyLab. No sign-up, no watermark, no credit card. 99.9% bypass rate, results in under 10 seconds.`,
  (kw) => `${kw}: the best free option in 2026. HumanifyLab's free plan — 500 words, no card, no sign-up. 99.9% bypass rate. Try now.`,
  (kw) => `${kw} — HumanifyLab is free to start. No credit card, no account, no watermark. 99.9% bypass rate against all major AI detectors.`,
  (kw) => `${kw}: free plan available at HumanifyLab. 500 words per run, instant results, 99.9% bypass rate. No sign-up required.`,
  (kw) => `${kw} — free AI humanizer with 99.9% bypass rate. No sign-up, no credit card, no watermark. 450,000+ users trust HumanifyLab.`,
  (kw) => `${kw}: start free today with HumanifyLab. 500 words per run, no card needed, instant results. 99.9% bypass rate guaranteed.`,
];

const H1S: ((kw: string) => string)[] = [
  (kw) => `${kw} — 100% Free, No Sign-Up Required`,
  (kw) => `${kw}: Free Plan with 99.9% Bypass Rate`,
  (kw) => `${kw} — Free Forever, No Credit Card`,
  (kw) => `${kw}: The Best Free AI Humanizer in 2026`,
  (kw) => `${kw} — Instant, Free & 99.9% Effective`,
  (kw) => `${kw}: Free, Fast & Undetectable`,
  (kw) => `${kw} — Free AI Humanizer That Actually Works`,
  (kw) => `${kw}: Start Free — No Card, No Sign-Up`,
];

const HERO_SUBTITLES: ((kw: string) => string)[] = [
  (kw) => `HumanifyLab's free plan gives you everything you need to ${kw.toLowerCase()} — 500 words per run, no credit card, no sign-up, no watermark. Just paste your content and get 0% AI score in under 10 seconds. 450,000+ users trust HumanifyLab's free plan.`,
  (kw) => `You don't need to pay to ${kw.toLowerCase()}. HumanifyLab's free plan includes 500 words per run, instant results, and a 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. No account required — start immediately.`,
  (kw) => `The best things in life are free — including the ability to ${kw.toLowerCase()} with HumanifyLab. Our free plan gives you 500 words per run, zero data retention, and a 99.9% bypass rate. No credit card, no sign-up, no catch.`,
  (kw) => `HumanifyLab is the only free tool that actually delivers on ${kw.toLowerCase()}. 99.9% bypass rate, results in under 10 seconds, and a free plan that never expires. No credit card, no sign-up, no watermark.`,
];

const FEATURES_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '🆓', title: 'Free Forever Plan', description: '500 words per run, unlimited runs, no expiry. The free plan never expires and requires no credit card.' },
    { icon: '🚫', title: 'No Sign-Up Required', description: 'Paste your content and click Humanize. No account, no email, no registration needed.' },
    { icon: '🎯', title: '99.9% Bypass Rate', description: 'The free plan achieves the same 99.9% bypass rate as paid plans. No compromise on quality.' },
    { icon: '⚡', title: 'Instant Results', description: 'Results in under 10 seconds. No queues, no waiting — even on the free plan.' },
  ],
  [
    { icon: '💧', title: 'No Watermark', description: 'Your humanized content has no watermark, no branding, no indication it was processed by HumanifyLab.' },
    { icon: '🔒', title: 'Zero Data Retention', description: 'Your content is deleted immediately after processing — even on the free plan. Complete privacy.' },
    { icon: '🌍', title: '50+ Languages Free', description: 'The free plan supports all 50+ languages with the same 99.9% bypass rate.' },
    { icon: '📱', title: 'Works on Any Device', description: 'Use HumanifyLab free on desktop, tablet, or mobile. No app download required.' },
  ],
];

const STEPS_POOL: { number: string; title: string; description: string }[][] = [
  [
    { number: '1', title: 'Open HumanifyLab.com', description: 'No account needed. The free plan is available immediately — just open the site.' },
    { number: '2', title: 'Paste your content', description: 'Copy your AI-generated text and paste it in. Up to 500 words on the free plan.' },
    { number: '3', title: 'Click Humanize — free', description: 'Results appear in under 10 seconds. No payment, no sign-up, no waiting.' },
    { number: '4', title: 'Copy and use', description: 'Your humanized content is ready. 0% AI score, no watermark, ready to submit.' },
  ],
];

const FAQ_POOL: ((kw: string) => { q: string; a: string }[])[] = [
  (kw) => [
    { q: `Is HumanifyLab really free for ${kw.toLowerCase()}?`, a: `Yes. HumanifyLab's free plan gives you 500 words per run with no credit card, no sign-up, and no expiry. The free plan is permanent — not a trial.` },
    { q: `What's the word limit on the free plan?`, a: `The free plan handles up to 500 words per run. There's no daily cap on the number of runs. Upgrade to Pro or Ultra for higher word limits per run.` },
    { q: `Do I need to create an account to ${kw.toLowerCase()} for free?`, a: `No. HumanifyLab's free plan requires no account, no email, and no registration. Just paste your content and click Humanize.` },
    { q: `Is the free plan as effective as paid plans?`, a: `Yes. The free plan uses the same 47-dimensional transformation engine as paid plans, achieving the same 99.9% bypass rate. The only difference is the 500-word limit per run.` },
    { q: `Does the free plan have a watermark?`, a: `No. HumanifyLab's free plan produces clean output with no watermark, no branding, and no indication it was processed by HumanifyLab.` },
    { q: `How long does the free plan last?`, a: `Forever. HumanifyLab's free plan never expires. You can use it indefinitely with no credit card required.` },
  ],
];

export function generateFreeContent(entry: KeywordEntryV4): FreePageData {
  const { keyword, seed } = entry;
  const capitalizedKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const combo = buildPageStrings(capitalizedKeyword, seed, 'Free', 'free');

  return {
    metaTitle: META_TITLES[uniqueIdx(seed, keyword, META_TITLES.length, 0)]!(capitalizedKeyword),
    metaDescription: META_DESCS[uniqueIdx(seed, keyword, META_DESCS.length, 1)]!(capitalizedKeyword),
    h1: H1S[uniqueIdx(seed, keyword, H1S.length, 2)]!(capitalizedKeyword),
    heroSubtitle: HERO_SUBTITLES[uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3)]!(capitalizedKeyword),
    badge: combo.badge,
    features: FEATURES_POOL[uniqueIdx(seed, keyword, FEATURES_POOL.length, 4)]!,
    steps: STEPS_POOL[uniqueIdx(seed, keyword, STEPS_POOL.length, 5)]!,
    stats: buildStats(keyword, seed),
    faqs: FAQ_POOL[uniqueIdx(seed, keyword, FAQ_POOL.length, 6)]!(keyword),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
