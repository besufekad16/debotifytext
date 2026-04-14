import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats, buildSteps, buildFeaturePoints } from '~/lib/content/content-combinator';

export interface AlternativePageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  competitor: string;
  whySwitchPoints: { icon: string; title: string; description: string }[];
  steps: { number: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const META_TITLES: ((kw: string, comp: string) => string)[] = [
  (kw, comp) => `Best ${comp} Alternative in 2026: HumanifyLab | 99.9% Bypass Rate`,
  (kw, comp) => `${kw}: HumanifyLab is the #1 ${comp} Alternative`,
  (kw, comp) => `${comp} Not Working? Try HumanifyLab — 99.9% Bypass Rate`,
  (kw, comp) => `${kw} — Free, Fast & More Accurate Than ${comp}`,
  (kw, comp) => `${comp} Alternative: HumanifyLab Beats It on Every Metric`,
  (kw, comp) => `${kw}: The ${comp} Alternative That Actually Works`,
  (kw, comp) => `Looking for a ${comp} Alternative? HumanifyLab Has 99.9% Bypass`,
  (kw, comp) => `${kw} — Why HumanifyLab is the Best ${comp} Replacement`,
];

const META_DESCS: ((kw: string, comp: string) => string)[] = [
  (kw, comp) => `${kw}: HumanifyLab is the best ${comp} alternative with a verified 99.9% bypass rate. Free plan, no sign-up, zero data stored. Switch today.`,
  (kw, comp) => `${kw} — tired of ${comp}? HumanifyLab delivers 99.9% bypass rate, free plan, and instant results. The ${comp} alternative that actually works.`,
  (kw, comp) => `${kw}: switch from ${comp} to HumanifyLab. 99.9% bypass rate, 450,000+ users, free plan with no credit card. Better results, lower price.`,
  (kw, comp) => `${kw} — HumanifyLab is the top ${comp} alternative. 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. Free to start.`,
  (kw, comp) => `${kw}: the best ${comp} alternative for 2026. HumanifyLab: 99.9% bypass rate, free plan, no sign-up, zero data retention. Try it now.`,
  (kw, comp) => `${kw} — looking for a ${comp} alternative? HumanifyLab beats ${comp} on bypass rate, price, and privacy. Free plan available today.`,
  (kw, comp) => `${kw}: HumanifyLab vs ${comp} — HumanifyLab wins. 99.9% bypass rate, free plan, instant results. The ${comp} replacement you've been looking for.`,
  (kw, comp) => `${kw} — the #1 ${comp} alternative. HumanifyLab: 99.9% bypass rate, 450K+ users, free plan, no card needed. Switch in seconds.`,
];

const H1S: ((kw: string, comp: string) => string)[] = [
  (kw, comp) => `The Best ${comp} Alternative: HumanifyLab`,
  (kw, comp) => `${kw}: Why HumanifyLab is the #1 ${comp} Replacement`,
  (kw, comp) => `${comp} Not Working? HumanifyLab Has 99.9% Bypass Rate`,
  (kw, comp) => `${kw} — Switch to HumanifyLab Today`,
  (kw, comp) => `${comp} Alternative: HumanifyLab Wins on Every Metric`,
  (kw, comp) => `${kw}: The ${comp} Alternative That Actually Delivers`,
  (kw, comp) => `Why HumanifyLab is the Best ${comp} Alternative in 2026`,
  (kw, comp) => `${kw} — HumanifyLab: Better Than ${comp} in Every Way`,
];

const HERO_SUBTITLES: ((comp: string) => string)[] = [
  (comp) => `${comp} has its fans — but if you need a verified 99.9% bypass rate, a free plan with no sign-up, and zero data retention, HumanifyLab is the clear alternative. We've tested both tools against Turnitin, GPTZero, and Originality.AI. HumanifyLab wins every time.`,
  (comp) => `Frustrated with ${comp}? You're not alone. Thousands of users have switched to HumanifyLab for its verified 99.9% bypass rate, instant results, and free plan that requires no credit card. Here's why HumanifyLab is the best ${comp} alternative in 2026.`,
  (comp) => `If ${comp} isn't delivering the bypass rates you need, HumanifyLab is the answer. Our 47-dimensional linguistic transformation achieves a verified 99.9% bypass rate against all major AI detectors — consistently, not occasionally. Free plan available, no sign-up required.`,
  (comp) => `${comp} is a decent tool. HumanifyLab is better. 99.9% bypass rate, free plan, zero data stored, results in under 10 seconds. If you're looking for a ${comp} alternative that actually works, you've found it.`,
];

const WHY_SWITCH_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '🎯', title: 'Higher Bypass Rate', description: 'HumanifyLab achieves a verified 99.9% bypass rate — significantly higher than most alternatives. Tested weekly against live Turnitin and GPTZero systems.' },
    { icon: '💰', title: 'Better Value', description: 'HumanifyLab offers a free plan with 500 words per run and no credit card required. Paid plans start at $6.99/month — often cheaper than alternatives.' },
    { icon: '🔒', title: 'Stronger Privacy', description: 'Zero data retention — your content is deleted immediately after processing. Many alternatives store your content. HumanifyLab never does.' },
    { icon: '⚡', title: 'Faster Results', description: 'Results in under 10 seconds. No queues, no waiting. HumanifyLab processes your content faster than any alternative on the market.' },
  ],
  [
    { icon: '🌍', title: 'More Languages', description: 'HumanifyLab supports 50+ languages with the same 99.9% bypass rate. Most alternatives only support English.' },
    { icon: '🔬', title: 'Deeper Transformation', description: 'HumanifyLab uses 47-dimensional analysis — not just synonym replacement. This is why our bypass rate is consistently higher than alternatives.' },
    { icon: '📊', title: 'More Detectors Covered', description: 'HumanifyLab bypasses 12+ major detectors including Turnitin, GPTZero, Originality.AI, Copyleaks, ZeroGPT, and Winston AI.' },
    { icon: '🔄', title: 'Always Up to Date', description: 'HumanifyLab is updated weekly as detectors evolve. Many alternatives fall behind and stop working. HumanifyLab stays ahead.' },
  ],
];

const FAQ_POOL: ((kw: string, comp: string) => { q: string; a: string }[])[] = [
  (kw, comp) => [
    { q: `Why should I switch from ${comp} to HumanifyLab?`, a: `HumanifyLab delivers a verified 99.9% bypass rate vs ${comp}'s inconsistent results. HumanifyLab also offers a free plan with no sign-up, zero data retention, and results in under 10 seconds — advantages ${comp} can't match.` },
    { q: `Is HumanifyLab free like ${comp}?`, a: `HumanifyLab offers a permanent free plan with 500 words per run and no credit card required. No expiry, no hidden limits. Paid plans start at $6.99/month for higher word limits and bulk processing.` },
    { q: `Does HumanifyLab bypass Turnitin better than ${comp}?`, a: `Yes. HumanifyLab achieves a 99.9% Turnitin bypass rate, verified weekly against live systems. ${comp}'s Turnitin bypass rate is inconsistent and not independently verified.` },
    { q: `How do I switch from ${comp} to HumanifyLab?`, a: `It takes 30 seconds. Go to HumanifyLab.com, paste your content, and click Humanize. No account needed for the free plan. Your first result will be ready in under 10 seconds.` },
    { q: `Is HumanifyLab a good ${comp} alternative for students?`, a: `Yes. HumanifyLab is widely used by students for academic writing. The Academic tone preset is specifically tuned for university-level writing and passes Turnitin with 0-3% AI scores.` },
  ],
  (kw, comp) => [
    { q: `What makes HumanifyLab better than ${comp}?`, a: `Three things: bypass rate (99.9% vs ${comp}'s inconsistent results), privacy (zero data retention vs ${comp}'s storage practices), and price (free plan with no sign-up vs ${comp}'s restrictions).` },
    { q: `Does ${comp} work for GPTZero?`, a: `${comp} claims GPTZero bypass, but results vary. HumanifyLab is tested weekly against live GPTZero systems and maintains a verified 99.8% bypass rate consistently.` },
    { q: `Can I use HumanifyLab for the same things I use ${comp} for?`, a: `Yes — and more. HumanifyLab handles essays, research papers, blog posts, marketing copy, and any other content type. It also supports 50+ languages and offers bulk processing on paid plans.` },
    { q: `Is HumanifyLab safe to use as a ${comp} alternative?`, a: `Completely safe. HumanifyLab has a strict zero data retention policy. Your content is processed in memory and immediately deleted. We never store, share, or use your content.` },
    { q: `How accurate is HumanifyLab compared to ${comp}?`, a: `HumanifyLab uses 47-dimensional linguistic analysis — significantly more sophisticated than ${comp}. This results in a 99.9% bypass rate and 100% meaning preservation, consistently.` },
  ],
];

export function generateAlternativeContent(entry: KeywordEntryV4): AlternativePageData {
  const { keyword, entity, seed } = entry;
  const competitor = entity !== 'Competitor' ? entity : 'Other Tools';
  const combo = buildPageStrings(keyword, seed, entity, 'alternative');

  const ti = uniqueIdx(seed, keyword, META_TITLES.length, 0);
  const di = uniqueIdx(seed, keyword, META_DESCS.length, 1);
  const hi = uniqueIdx(seed, keyword, H1S.length, 2);
  const hsi = uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3);
  const wsi = uniqueIdx(seed, keyword, WHY_SWITCH_POOL.length, 5);
  const fqi = uniqueIdx(seed, keyword, FAQ_POOL.length, 6);

  return {
    metaTitle: META_TITLES[ti]!(keyword, competitor),
    metaDescription: META_DESCS[di]!(keyword, competitor),
    h1: H1S[hi]!(keyword, competitor),
    heroSubtitle: HERO_SUBTITLES[hsi]!(competitor),
    badge: combo.badge,
    competitor,
    whySwitchPoints: WHY_SWITCH_POOL[wsi]!,
    steps: buildSteps(keyword, seed, 'alternative'),
    stats: buildStats(keyword, seed),
    faqs: FAQ_POOL[fqi]!(keyword, competitor),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
