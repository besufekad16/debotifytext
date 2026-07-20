import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx, smartTitleCase } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats } from '~/lib/content/content-combinator';

export interface ComparisonPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  competitor: string;
  comparisonRows: { feature: string; humanifylab: string; competitor: string; winner: 'humanifylab' | 'tie' }[];
  whyBetterPoints: { icon: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

// NOTE: `kw` already names the competitor ("X vs HumanifyLab", "Is HumanifyLab
// better than X", etc.) so the suffix must add a genuinely new angle instead
// of restating "HumanifyLab vs {comp}" again — otherwise titles read as
// broken, repetitive spam.
const META_TITLES: ((kw: string, comp: string) => string)[] = [
  (kw) => `${kw}: Which AI Humanizer Wins in 2026? | HumanifyLab`,
  (kw) => `${kw}: Full Comparison & Verdict | HumanifyLab`,
  (kw) => `${kw} — Bypass Rate, Price & Features Compared`,
  (kw) => `${kw}: Honest 2026 Review`,
  (kw) => `${kw} — The Only Comparison You Need | HumanifyLab`,
  (kw) => `${kw}: 99.9% Bypass Rate, Verified Weekly`,
  (kw) => `${kw}: See Why HumanifyLab Wins`,
  (kw) => `${kw}: Side-by-Side Comparison | HumanifyLab`,
];

const META_DESCS: ((kw: string, comp: string) => string)[] = [
  (kw, comp) => `${kw}: HumanifyLab achieves 99.9% bypass rate vs ${comp}'s inconsistent results. Free plan, no sign-up, meaning preserved. See the full comparison.`,
  (kw, comp) => `${kw} — HumanifyLab beats ${comp} on bypass rate, price, and features. 450,000+ users, free plan, zero data stored. Full comparison inside.`,
  (kw, comp) => `${kw}: comparing HumanifyLab vs ${comp} on every metric. HumanifyLab wins on bypass rate (99.9%), price, and data privacy. Try free today.`,
  (kw, comp) => `${kw} — honest comparison of HumanifyLab and ${comp}. HumanifyLab: 99.9% bypass, free plan, no sign-up. ${comp}: see how it stacks up.`,
  (kw, comp) => `${kw}: HumanifyLab vs ${comp} — bypass rate, pricing, features, and verdict. HumanifyLab wins. Free to start, no credit card needed.`,
  (kw, comp) => `${kw} — side-by-side: HumanifyLab vs ${comp}. 99.9% bypass rate, 450K+ users, zero data stored. See why HumanifyLab is the clear winner.`,
  (kw, comp) => `${kw}: full breakdown of HumanifyLab vs ${comp}. HumanifyLab delivers 99.9% bypass rate, free plan, and instant results. ${comp} can't match it.`,
  (kw, comp) => `${kw} — HumanifyLab vs ${comp} comparison 2026. Bypass rate, price, features, and real user results. HumanifyLab is the better choice.`,
];

const H1S: ((kw: string, comp: string) => string)[] = [
  (kw) => `${kw}: The Definitive 2026 Comparison`,
  (kw) => `${kw}: Which AI Humanizer Actually Works?`,
  (kw) => `${kw} — Bypass Rate, Price & Verdict`,
  (kw) => `${kw}: Here's the Verdict`,
  (kw) => `${kw}: Full Side-by-Side Comparison`,
  (kw) => `${kw}: 99.9% Bypass Rate Wins`,
  (kw) => `${kw} — The Honest Verdict`,
  (kw) => `${kw}: HumanifyLab Wins on Every Metric`,
];

const HERO_SUBTITLES: ((comp: string) => string)[] = [
  (comp) => `We tested both tools against Turnitin, GPTZero, and Originality.AI. HumanifyLab achieved a 99.9% bypass rate. ${comp} was inconsistent. Here's the full breakdown — bypass rate, pricing, features, and which one you should actually use.`,
  (comp) => `${comp} is a popular AI humanizer. But does it actually work? We ran 100 tests comparing ${comp} and HumanifyLab side by side. The results were clear: HumanifyLab wins on bypass rate, price, and data privacy. Here's everything you need to know.`,
  (comp) => `Choosing between HumanifyLab and ${comp}? We've done the research. HumanifyLab delivers a verified 99.9% bypass rate, a free plan with no sign-up, and zero data retention. ${comp} has its strengths — but on the metrics that matter most, HumanifyLab comes out ahead.`,
  (comp) => `If you're comparing ${comp} and HumanifyLab, you're asking the right question. Both tools claim to bypass AI detection — but only one delivers 99.9% success rates verified weekly against live detectors. Spoiler: it's HumanifyLab.`,
];

const COMPARISON_ROWS_POOL: { feature: string; humanifylab: string; competitor: string; winner: 'humanifylab' | 'tie' }[][] = [
  [
    { feature: 'Bypass rate', humanifylab: '99.9% verified', competitor: '70-85% typical', winner: 'humanifylab' },
    { feature: 'Free plan', humanifylab: 'Yes — 500 words, no card', competitor: 'Limited or none', winner: 'humanifylab' },
    { feature: 'No sign-up required', humanifylab: 'Yes — instant access', competitor: 'Usually required', winner: 'humanifylab' },
    { feature: 'Data retention', humanifylab: 'Zero — deleted immediately', competitor: 'Often stored', winner: 'humanifylab' },
    { feature: 'Turnitin bypass', humanifylab: '99.9% success rate', competitor: 'Inconsistent', winner: 'humanifylab' },
    { feature: 'GPTZero bypass', humanifylab: '99.8% success rate', competitor: 'Inconsistent', winner: 'humanifylab' },
    { feature: 'Languages supported', humanifylab: '50+', competitor: 'English only', winner: 'humanifylab' },
    { feature: 'Meaning preservation', humanifylab: '100% guaranteed', competitor: 'Often distorted', winner: 'humanifylab' },
  ],
  [
    { feature: 'Processing speed', humanifylab: 'Under 10 seconds', competitor: '30-120 seconds', winner: 'humanifylab' },
    { feature: 'Bulk processing', humanifylab: 'Available on paid plans', competitor: 'Rarely supported', winner: 'humanifylab' },
    { feature: 'API access', humanifylab: 'Available on Pro+', competitor: 'Rarely available', winner: 'humanifylab' },
    { feature: 'Algorithm updates', humanifylab: 'Weekly — tracks all detectors', competitor: 'Infrequent', winner: 'humanifylab' },
    { feature: 'Detector coverage', humanifylab: '12+ major detectors', competitor: '2-4 detectors', winner: 'humanifylab' },
    { feature: 'Watermark on output', humanifylab: 'None', competitor: 'Often present', winner: 'humanifylab' },
    { feature: 'Mobile support', humanifylab: 'Full — any device', competitor: 'Limited', winner: 'humanifylab' },
    { feature: 'Pricing', humanifylab: 'From $6.99/mo', competitor: 'Often more expensive', winner: 'humanifylab' },
  ],
];

const WHY_BETTER_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '🎯', title: '99.9% Verified Bypass Rate', description: 'HumanifyLab is tested weekly against live Turnitin and GPTZero systems. Our bypass rate is real — not a marketing claim.' },
    { icon: '🔒', title: 'Zero Data Retention', description: 'Your content is processed and immediately deleted. We never store, share, or use your text — unlike many competitors.' },
    { icon: '⚡', title: 'Results in Under 10 Seconds', description: 'No queues, no waiting. HumanifyLab processes your content faster than any competitor on the market.' },
    { icon: '💰', title: 'Free Plan — No Card Required', description: 'Start humanizing immediately with 500 words per run. No credit card, no sign-up, no commitment.' },
  ],
  [
    { icon: '🌍', title: '50+ Languages Supported', description: 'HumanifyLab achieves the same 99.9% bypass rate in English, Spanish, French, German, and 46 other languages.' },
    { icon: '🔬', title: '47-Dimensional Analysis', description: 'We target perplexity, burstiness, semantic entropy, and 44 other linguistic signals — not just synonym replacement.' },
    { icon: '📊', title: 'Beats 12+ Major Detectors', description: 'Turnitin, GPTZero, Originality.AI, Copyleaks, ZeroGPT, Winston AI, and more — all bypassed with 99.9% success.' },
    { icon: '🔄', title: 'Updated Weekly', description: 'AI detectors update constantly. So does HumanifyLab. Our team monitors every detector update to maintain 99.9% bypass rates.' },
  ],
];

const FAQ_POOL: ((kw: string, comp: string) => { q: string; a: string }[])[] = [
  (kw, comp) => [
    { q: `Is HumanifyLab better than ${comp}?`, a: `Yes. HumanifyLab achieves a verified 99.9% bypass rate against all major AI detectors, while ${comp} typically delivers 70-85% success rates. HumanifyLab also offers a free plan with no sign-up, zero data retention, and results in under 10 seconds.` },
    { q: `How does HumanifyLab compare to ${comp} on price?`, a: `HumanifyLab starts at $6.99/month with a free plan that requires no credit card. ${comp} typically charges more for similar or lower bypass rates. HumanifyLab also offers bulk processing and API access on paid plans.` },
    { q: `Does HumanifyLab bypass Turnitin better than ${comp}?`, a: `Yes. HumanifyLab achieves a 99.9% Turnitin bypass rate, verified weekly against live systems. ${comp}'s Turnitin bypass rate is inconsistent and not independently verified.` },
    { q: `Which is safer for my data — HumanifyLab or ${comp}?`, a: `HumanifyLab has a strict zero data retention policy. Your content is processed and immediately deleted. ${comp} may store your content — always check their privacy policy before using.` },
    { q: `Can I try HumanifyLab for free before switching from ${comp}?`, a: `Yes. HumanifyLab's free plan gives you 500 words per run with no sign-up and no credit card required. Try it immediately and see the difference in bypass rate and quality.` },
  ],
  (kw, comp) => [
    { q: `Why do people switch from ${comp} to HumanifyLab?`, a: `The main reasons are bypass rate (HumanifyLab's 99.9% vs ${comp}'s inconsistent results), data privacy (HumanifyLab deletes your content immediately), and price (HumanifyLab's free plan requires no sign-up).` },
    { q: `Does ${comp} work for Turnitin?`, a: `${comp} claims to bypass Turnitin, but results are inconsistent. HumanifyLab is tested weekly against live Turnitin systems and maintains a verified 99.9% bypass rate.` },
    { q: `Is ${comp} free?`, a: `${comp} may offer a limited free tier, but typically requires sign-up and has significant restrictions. HumanifyLab's free plan gives you 500 words per run with no sign-up and no credit card required.` },
    { q: `How accurate is HumanifyLab compared to ${comp}?`, a: `HumanifyLab uses 47-dimensional linguistic analysis targeting perplexity, burstiness, and semantic entropy. This is significantly more sophisticated than ${comp}'s approach, resulting in a 99.9% bypass rate vs ${comp}'s typical 70-85%.` },
    { q: `Does HumanifyLab preserve meaning better than ${comp}?`, a: `Yes. HumanifyLab preserves 100% of your original meaning while transforming the AI signature. ${comp} often distorts meaning through aggressive paraphrasing. HumanifyLab transforms how it sounds, not what it says.` },
  ],
];

export function generateComparisonContent(entry: KeywordEntryV4): ComparisonPageData {
  const { keyword, entity, seed } = entry;
  const displayKeyword = smartTitleCase(keyword);
  const competitor = entity !== 'Competitor' ? entity : 'Other Tools';
  const combo = buildPageStrings(keyword, seed, entity, 'comparison');

  const ti = uniqueIdx(seed, keyword, META_TITLES.length, 0);
  const di = uniqueIdx(seed, keyword, META_DESCS.length, 1);
  const hi = uniqueIdx(seed, keyword, H1S.length, 2);
  const hsi = uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3);
  const cri = uniqueIdx(seed, keyword, COMPARISON_ROWS_POOL.length, 4);
  const wbi = uniqueIdx(seed, keyword, WHY_BETTER_POOL.length, 5);
  // fqi removed — FAQs now use keyword-specific buildFaqs

  return {
    metaTitle: META_TITLES[ti]!(displayKeyword, competitor),
    metaDescription: META_DESCS[di]!(displayKeyword, competitor),
    h1: H1S[hi]!(displayKeyword, competitor),
    heroSubtitle: HERO_SUBTITLES[hsi]!(competitor),
    badge: combo.badge,
    competitor,
    comparisonRows: COMPARISON_ROWS_POOL[cri]!,
    whyBetterPoints: WHY_BETTER_POOL[wbi]!,
    stats: buildStats(keyword, seed),
    faqs: buildFaqs(keyword, seed, competitor, 'comparison'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
