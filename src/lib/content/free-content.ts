import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx, smartTitleCase } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats, buildSteps, buildFeaturePoints, buildDeepGuide } from '~/lib/content/content-combinator';

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
  guideIntro?: string;
  guideSections?: { title: string; body: string }[];
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
  (kw) => `${kw}: HumanifyLab is 100% free to start — no sign-up, no credit card, no watermark. 99.9% bypass rate, results in under 10 seconds. Try it now.`,
  (kw) => `${kw} — HumanifyLab's free plan gives you 500 words per run with no restrictions. 99.9% bypass rate, zero data stored. Start free today.`,
  (kw) => `${kw}: the best free option in 2026. HumanifyLab: 99.9% bypass rate, free plan with no card, instant results. No sign-up required.`,
  (kw) => `${kw} — free, instant, and 99.9% effective. HumanifyLab's free plan: 500 words per run, no sign-up, no credit card, zero data stored.`,
  (kw) => `${kw}: HumanifyLab is free to start. 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. No card, no sign-up, no watermark.`,
  (kw) => `${kw} — the free AI humanizer that actually works. HumanifyLab: 99.9% bypass rate, free plan, no sign-up, results in under 10 seconds.`,
  (kw) => `${kw}: start free with HumanifyLab. 500 words per run, no credit card, no sign-up. 99.9% bypass rate, zero data retention. Try now.`,
  (kw) => `${kw} — HumanifyLab's free plan is permanent, not a trial. 99.9% bypass rate, no card, no sign-up, no watermark. Start humanizing now.`,
];

const H1S: ((kw: string) => string)[] = [
  (kw) => `${kw}: 100% Free, No Sign-Up Required`,
  (kw) => `${kw} — Free Forever with 99.9% Bypass Rate`,
  (kw) => `${kw}: The Best Free Tool in 2026`,
  (kw) => `${kw} — Instant, Free & 99.9% Effective`,
  (kw) => `${kw}: Free Plan, No Card, No Watermark`,
  (kw) => `${kw} — Free AI Humanizer That Delivers`,
  (kw) => `${kw}: Start Free Today`,
  (kw) => `${kw} — No Sign-Up, No Credit Card, Just Results`,
];

const HERO_SUBTITLES: ((kw: string) => string)[] = [
  (kw) => `HumanifyLab's free plan gives you everything you need to ${kw.toLowerCase()} — 500 words per run, no sign-up, no credit card, no watermark. 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. Start in seconds.`,
  (kw) => `Looking for a free way to ${kw.toLowerCase()}? HumanifyLab's free plan is permanent — not a trial. 500 words per run, instant results, zero data stored. No credit card, no sign-up, no commitment.`,
  (kw) => `${kw.charAt(0).toUpperCase() + kw.slice(1)} for free with HumanifyLab. Our free plan includes 500 words per run, 99.9% bypass rate, and zero data retention. No sign-up required — start immediately.`,
  (kw) => `HumanifyLab makes it free to ${kw.toLowerCase()}. 500 words per run, no credit card, no sign-up, no watermark. 99.9% bypass rate verified weekly against live detectors. The best free option in 2026.`,
];

const FAQ_POOL: ((kw: string) => { q: string; a: string }[])[] = [
  (kw) => [
    { q: `Is HumanifyLab really free for ${kw.toLowerCase()}?`, a: `Yes. HumanifyLab's free plan is permanent — not a trial. You get 500 words per run with no sign-up and no credit card required. No expiry, no hidden limits.` },
    { q: `Do I need to sign up to ${kw.toLowerCase()} for free?`, a: `No. HumanifyLab's free plan requires no sign-up and no account creation. Just go to HumanifyLab.com, paste your content, and click Humanize. Results in under 10 seconds.` },
    { q: `Is there a watermark on free results?`, a: `No. HumanifyLab never adds watermarks to your output — on any plan, including the free plan. Your humanized content is completely clean and ready to use.` },
    { q: `What's the word limit on the free plan?`, a: `The free plan handles up to 500 words per run. There's no daily cap — you can run as many times as you need. Upgrade to paid plans for higher word limits and bulk processing.` },
    { q: `Does the free plan have the same bypass rate as paid plans?`, a: `Yes. HumanifyLab's free plan achieves the same 99.9% bypass rate as paid plans. The difference is word limit per run, not quality or effectiveness.` },
  ],
  (kw) => [
    { q: `How long is HumanifyLab's free plan available?`, a: `Forever. HumanifyLab's free plan is permanent — not a limited trial. You can use it indefinitely with 500 words per run and no credit card required.` },
    { q: `Does the free plan work for Turnitin?`, a: `Yes. HumanifyLab's free plan achieves the same 99.9% Turnitin bypass rate as paid plans. The free plan is fully functional — just limited to 500 words per run.` },
    { q: `Can I ${kw.toLowerCase()} on mobile for free?`, a: `Yes. HumanifyLab works on any device — desktop, tablet, or mobile — with no app download required. The free plan is fully accessible on mobile.` },
    { q: `Is my content safe on the free plan?`, a: `Yes. HumanifyLab has a strict zero data retention policy on all plans, including the free plan. Your content is processed and immediately deleted. We never store or share your text.` },
    { q: `What do I get if I upgrade from the free plan?`, a: `Paid plans start at $6.99/month and offer higher word limits (up to unlimited), bulk processing, API access, and priority processing speed. The free plan is a great starting point.` },
  ],
];

export function generateFreeContent(entry: KeywordEntryV4): FreePageData {
  const { keyword, seed } = entry;
  const displayKeyword = smartTitleCase(keyword);
  const combo = buildPageStrings(keyword, seed, 'Free', 'free');
  const deep = buildDeepGuide(keyword, seed);

  const ti = uniqueIdx(seed, keyword, META_TITLES.length, 0);
  const di = uniqueIdx(seed, keyword, META_DESCS.length, 1);
  const hi = uniqueIdx(seed, keyword, H1S.length, 2);
  const hsi = uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3);
  // fqi removed — FAQs now use keyword-specific buildFaqs

  return {
    metaTitle: META_TITLES[ti]!(displayKeyword),
    metaDescription: META_DESCS[di]!(displayKeyword),
    h1: H1S[hi]!(displayKeyword),
    heroSubtitle: HERO_SUBTITLES[hsi]!(displayKeyword),
    badge: combo.badge,
    features: buildFeaturePoints(keyword, seed, 'free'),
    steps: buildSteps(keyword, seed, 'free'),
    stats: buildStats(keyword, seed),
    faqs: buildFaqs(keyword, seed, '', 'free'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
    guideIntro: deep.guideIntro,
    guideSections: deep.guideSections,
  };
}
