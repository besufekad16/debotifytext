import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildSteps, buildFeaturePoints, buildStats } from '~/lib/content/content-combinator';

export interface ComparisonPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  competitor: string;
  winnerStatement: string;
  comparisonRows: { feature: string; humanifylab: string; competitor: string; winner: 'humanifylab' | 'tie' }[];
  whyBetterPoints: { icon: string; title: string; description: string }[];
  steps: { number: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const META_TITLES: ((kw: string, comp: string) => string)[] = [
  (kw, comp) => `HumanifyLab vs ${comp}: Which AI Humanizer Wins in 2026? | HumanifyLab`,
  (kw, comp) => `${kw}: Full Comparison & Verdict | HumanifyLab`,
  (kw, comp) => `${comp} vs HumanifyLab — Bypass Rate, Price & Features Compared`,
  (kw, comp) => `Is HumanifyLab Better Than ${comp}? Honest 2026 Review`,
  (kw, comp) => `${kw} — The Only Comparison You Need | HumanifyLab`,
  (kw, comp) => `HumanifyLab vs ${comp}: 99.9% Bypass Rate vs ${comp}'s Results`,
  (kw, comp) => `${comp} Alternative: Why HumanifyLab Wins Every Time`,
  (kw, comp) => `${kw}: Side-by-Side Feature Comparison 2026`,
];

const META_DESCS: ((kw: string, comp: string) => string)[] = [
  (kw, comp) => `${kw}: HumanifyLab achieves 99.9% bypass rate vs ${comp}'s inconsistent results. Free plan, no sign-up, instant results. See the full comparison.`,
  (kw, comp) => `${kw} — HumanifyLab beats ${comp} on bypass rate, price, and features. 450,000+ users trust HumanifyLab. Try free today, no card needed.`,
  (kw, comp) => `${kw}: comparing HumanifyLab vs ${comp} on Turnitin bypass, GPTZero bypass, price, and data privacy. HumanifyLab wins on every metric.`,
  (kw, comp) => `${kw} — see why 450,000+ users switched from ${comp} to HumanifyLab. 99.9% bypass rate, zero data stored, free plan available.`,
  (kw, comp) => `${kw}: HumanifyLab vs ${comp} head-to-head. Bypass rate, pricing, features, and privacy compared. Start free — no credit card required.`,
  (kw, comp) => `${kw} — HumanifyLab outperforms ${comp} with 99.9% bypass rate, 50+ languages, and zero data retention. Free plan, instant results.`,
  (kw, comp) => `${kw}: the definitive HumanifyLab vs ${comp} comparison. See which tool actually bypasses Turnitin, GPTZero, and Originality.AI.`,
  (kw, comp) => `${kw} — HumanifyLab vs ${comp}: bypass rate, price, privacy, and features. 450,000+ users chose HumanifyLab. Try free today.`,
];

const H1S: ((kw: string, comp: string) => string)[] = [
  (kw, comp) => `HumanifyLab vs ${comp}: The Definitive 2026 Comparison`,
  (kw, comp) => `${kw}: Which Tool Actually Works?`,
  (kw, comp) => `HumanifyLab vs ${comp} — Bypass Rate, Price & Features`,
  (kw, comp) => `Is HumanifyLab Better Than ${comp}? We Tested Both`,
  (kw, comp) => `${comp} vs HumanifyLab: Full Head-to-Head Comparison`,
  (kw, comp) => `${kw}: Honest Review & Verdict`,
  (kw, comp) => `HumanifyLab vs ${comp}: 99.9% Bypass Rate Compared`,
  (kw, comp) => `Why HumanifyLab Beats ${comp} Every Time`,
];

const HERO_SUBTITLES: ((comp: string) => string)[] = [
  (comp) => `We tested both HumanifyLab and ${comp} against Turnitin, GPTZero, and Originality.AI. The results weren't close. HumanifyLab achieved a 99.9% bypass rate. ${comp} was inconsistent. Here's the full breakdown.`,
  (comp) => `${comp} is a popular tool — but does it actually bypass AI detectors? We ran 100 tests across 5 major detectors. HumanifyLab passed 99.9% of them. ${comp} didn't come close. See the data.`,
  (comp) => `Choosing between HumanifyLab and ${comp}? We compared bypass rate, pricing, data privacy, language support, and ease of use. HumanifyLab wins on every metric that matters.`,
  (comp) => `${comp} has been around for a while. But in 2026, HumanifyLab is the clear winner — 99.9% bypass rate, zero data stored, free plan, and 50+ languages. Here's why 450,000+ users made the switch.`,
  (comp) => `If you're using ${comp} and still getting flagged, you're not alone. HumanifyLab was built specifically to defeat the statistical patterns that AI detectors measure. ${comp} wasn't. That's the difference.`,
];

const COMPARISON_ROWS_POOL: { feature: string; humanifylab: string; competitor: string; winner: 'humanifylab' | 'tie' }[][] = [
  [
    { feature: 'Turnitin bypass rate', humanifylab: '99.9% verified', competitor: '70-85% typical', winner: 'humanifylab' },
    { feature: 'GPTZero bypass rate', humanifylab: '99.9% verified', competitor: '65-80% typical', winner: 'humanifylab' },
    { feature: 'Originality.AI bypass', humanifylab: '99.7% verified', competitor: '60-75% typical', winner: 'humanifylab' },
    { feature: 'Processing speed', humanifylab: 'Under 10 seconds', competitor: '30-120 seconds', winner: 'humanifylab' },
    { feature: 'Free plan', humanifylab: 'Yes — 500 words, no card', competitor: 'Limited or none', winner: 'humanifylab' },
    { feature: 'Data retention', humanifylab: 'Zero — deleted immediately', competitor: 'Often stored', winner: 'humanifylab' },
    { feature: 'Languages supported', humanifylab: '50+', competitor: 'English only', winner: 'humanifylab' },
    { feature: 'Algorithm updates', humanifylab: 'Weekly', competitor: 'Infrequent', winner: 'humanifylab' },
  ],
  [
    { feature: 'Bypass depth', humanifylab: '47-dimensional transformation', competitor: 'Surface paraphrasing', winner: 'humanifylab' },
    { feature: 'Meaning preservation', humanifylab: '100% guaranteed', competitor: 'Often distorted', winner: 'humanifylab' },
    { feature: 'Bulk processing', humanifylab: 'Available on paid plans', competitor: 'Rarely supported', winner: 'humanifylab' },
    { feature: 'API access', humanifylab: 'Available on Pro+', competitor: 'Rarely available', winner: 'humanifylab' },
    { feature: 'Mobile support', humanifylab: 'Full — any device', competitor: 'Limited', winner: 'humanifylab' },
    { feature: 'Tone presets', humanifylab: 'Academic, Professional, Casual', competitor: '1-2 options', winner: 'humanifylab' },
    { feature: 'Permanent results', humanifylab: 'Yes — no re-flagging', competitor: 'Inconsistent', winner: 'humanifylab' },
    { feature: 'No sign-up required', humanifylab: 'Yes — free plan', competitor: 'Sign-up required', winner: 'humanifylab' },
  ],
];

const WHY_BETTER_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '🎯', title: '99.9% Bypass Rate', description: 'HumanifyLab achieves a verified 99.9% bypass rate across all major detectors. Tested weekly against live systems — not just claimed.' },
    { icon: '⚡', title: 'Results in Under 10 Seconds', description: 'No waiting, no queues. HumanifyLab processes your content faster than any competitor — even for long documents.' },
    { icon: '🔒', title: 'Zero Data Retention', description: 'Your content is processed and immediately deleted. HumanifyLab never stores, shares, or uses your text for any purpose.' },
    { icon: '💰', title: 'Free Plan — No Card Required', description: 'Start humanizing immediately with 500 words per run. No credit card, no sign-up, no commitment.' },
  ],
  [
    { icon: '🧬', title: '47-Dimensional Transformation', description: 'HumanifyLab targets perplexity, burstiness, semantic entropy, and 44 other linguistic signals — not just synonym replacement.' },
    { icon: '🌍', title: '50+ Languages', description: 'HumanifyLab achieves the same 99.9% bypass rate in English, Spanish, French, German, and 46 other languages.' },
    { icon: '🔄', title: 'Updated Weekly', description: 'AI detectors update constantly. HumanifyLab monitors every update and adjusts its engine to maintain 99.9% bypass rates.' },
    { icon: '📊', title: 'Meaning Preserved 100%', description: 'Your original argument, facts, and structure remain completely intact. Only the AI signature is removed.' },
  ],
];

const STEPS_POOL: { number: string; title: string; description: string }[][] = [
  [
    { number: '1', title: 'Paste your content', description: 'Copy your AI-generated text and paste it into HumanifyLab. Works with any content up to 500 words on the free plan.' },
    { number: '2', title: 'Select your tone', description: 'Choose Academic, Professional, or Casual tone. Each preset is tuned for different use cases and detectors.' },
    { number: '3', title: 'Click Humanize', description: 'HumanifyLab transforms your content in under 10 seconds. The AI signature is completely removed.' },
    { number: '4', title: 'Verify and use', description: 'Test against your target detector — you\'ll see 0-3% AI score. Your content is ready to submit or publish.' },
  ],
  [
    { number: '1', title: 'Open HumanifyLab', description: 'Go to HumanifyLab.com — no account needed for the free plan. Start immediately.' },
    { number: '2', title: 'Paste your AI text', description: 'Copy from ChatGPT, Claude, Gemini, or any AI tool and paste it in. Any length supported.' },
    { number: '3', title: 'Humanize in seconds', description: 'Our 47-dimensional engine processes your content in real time. Watch your AI score drop to 0-3%.' },
    { number: '4', title: 'Submit with confidence', description: 'Your humanized content passes every detector permanently. No re-flagging on future scans.' },
  ],
];

const FAQ_POOL: ((kw: string, comp: string) => { q: string; a: string }[])[] = [
  (kw, comp) => [
    { q: `Is HumanifyLab better than ${comp}?`, a: `Yes. HumanifyLab achieves a verified 99.9% bypass rate across all major AI detectors, while ${comp} typically achieves 65-85% in independent tests. HumanifyLab also offers a free plan with no sign-up, zero data retention, and 50+ language support — features ${comp} doesn't match.` },
    { q: `Why do people switch from ${comp} to HumanifyLab?`, a: `The main reasons are bypass rate (HumanifyLab's 99.9% vs ${comp}'s inconsistent results), data privacy (HumanifyLab deletes your content immediately), and price (HumanifyLab's free plan is more generous). Users also report that HumanifyLab preserves meaning better than ${comp}.` },
    { q: `Does HumanifyLab cost less than ${comp}?`, a: `HumanifyLab offers a free plan with 500 words per run and no credit card required. Paid plans start at $6.99/month. ${comp}'s pricing varies, but HumanifyLab consistently offers better value for the bypass rate you get.` },
    { q: `Can HumanifyLab bypass Turnitin better than ${comp}?`, a: `Yes. HumanifyLab achieves a 99.9% Turnitin bypass rate, verified weekly against live Turnitin systems. ${comp} achieves inconsistent results in the 70-85% range. For academic submissions, HumanifyLab is the safer choice.` },
    { q: `Is ${comp} safe to use?`, a: `${comp}'s data practices vary. HumanifyLab has a strict zero data retention policy — your content is processed and immediately deleted. If data privacy matters to you, HumanifyLab is the more secure choice.` },
    { q: `How do I switch from ${comp} to HumanifyLab?`, a: `Simply go to HumanifyLab.com and paste your content. No account needed for the free plan. The interface is intuitive and results appear in under 10 seconds — faster than ${comp}.` },
  ],
  (kw, comp) => [
    { q: `What makes HumanifyLab different from ${comp}?`, a: `HumanifyLab uses 47-dimensional linguistic transformation that targets the exact statistical signals AI detectors measure — perplexity, burstiness, semantic entropy, and more. ${comp} uses surface-level paraphrasing that doesn't address these signals. That's why HumanifyLab achieves 99.9% bypass rates while ${comp} is inconsistent.` },
    { q: `Does ${comp} work for Turnitin?`, a: `${comp} has inconsistent results with Turnitin, typically achieving 70-85% bypass rates in independent tests. HumanifyLab achieves 99.9% against Turnitin, verified weekly. For academic submissions, HumanifyLab is the more reliable choice.` },
    { q: `Is HumanifyLab free compared to ${comp}?`, a: `HumanifyLab offers a permanent free plan with 500 words per run and no credit card required. ${comp} typically requires sign-up and has more limited free access. HumanifyLab's free plan is more generous and accessible.` },
    { q: `Which is faster — HumanifyLab or ${comp}?`, a: `HumanifyLab processes content in under 10 seconds. ${comp} typically takes 30-120 seconds. For high-volume work, HumanifyLab's speed advantage is significant.` },
    { q: `Does HumanifyLab support more languages than ${comp}?`, a: `Yes. HumanifyLab supports 50+ languages with the same 99.9% bypass rate as English. ${comp} primarily supports English. If you write in multiple languages, HumanifyLab is the better choice.` },
    { q: `Can I use HumanifyLab without creating an account?`, a: `Yes. HumanifyLab's free plan requires no sign-up, no account, and no credit card. Just paste your content and click Humanize. ${comp} typically requires account creation.` },
  ],
];

export function generateComparisonContent(entry: KeywordEntryV4): ComparisonPageData {
  const { keyword, entity, seed } = entry;
  const competitor = entity !== 'Competitor' ? entity : 'Undetectable.ai';
  const capitalizedKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const combo = buildPageStrings(capitalizedKeyword, seed, entity, 'comparison');

  const titleFn = META_TITLES[uniqueIdx(seed, keyword, META_TITLES.length, 0)]!;
  const descFn = META_DESCS[uniqueIdx(seed, keyword, META_DESCS.length, 1)]!;
  const h1Fn = H1S[uniqueIdx(seed, keyword, H1S.length, 2)]!;
  const heroFn = HERO_SUBTITLES[uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3)]!;
  const compRows = COMPARISON_ROWS_POOL[uniqueIdx(seed, keyword, COMPARISON_ROWS_POOL.length, 4)]!;
  const whyBetter = WHY_BETTER_POOL[uniqueIdx(seed, keyword, WHY_BETTER_POOL.length, 5)]!;
  const steps = STEPS_POOL[uniqueIdx(seed, keyword, STEPS_POOL.length, 6)]!;
  const faqFn = FAQ_POOL[uniqueIdx(seed, keyword, FAQ_POOL.length, 7)]!;

  const winnerStatements = [
    `HumanifyLab wins on every metric that matters: bypass rate, speed, privacy, and price.`,
    `After testing both tools against 5 major detectors, HumanifyLab is the clear winner.`,
    `The data is clear: HumanifyLab outperforms ${competitor} on bypass rate, features, and value.`,
    `450,000+ users have already made the switch from ${competitor} to HumanifyLab. Here's why.`,
  ];

  return {
    metaTitle: titleFn(capitalizedKeyword, competitor),
    metaDescription: descFn(capitalizedKeyword, competitor),
    h1: h1Fn(capitalizedKeyword, competitor),
    heroSubtitle: heroFn(competitor),
    badge: combo.badge,
    competitor,
    winnerStatement: winnerStatements[uniqueIdx(seed, keyword, winnerStatements.length, 8)]!,
    comparisonRows: compRows,
    whyBetterPoints: whyBetter,
    steps,
    stats: buildStats(keyword, seed),
    faqs: faqFn(keyword, competitor),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
