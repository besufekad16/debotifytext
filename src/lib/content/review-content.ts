import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats } from '~/lib/content/content-combinator';

export interface ReviewPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  subject: string;
  verdict: string;
  ratingValue: string;
  ratingCount: string;
  pros: string[];
  cons: string[];
  features: { icon: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const META_TITLES: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${subj} Review 2026: Does It Actually Work? | HumanifyLab`,
  (kw, subj) => `${kw}: Honest Review After 100 Tests | HumanifyLab`,
  (kw, subj) => `Is ${subj} Worth It? Full Review & Better Alternative`,
  (kw, subj) => `${kw} — Bypass Rate, Price & Verdict | HumanifyLab`,
  (kw, subj) => `${subj} Review: Pros, Cons & Why HumanifyLab Wins`,
  (kw, subj) => `${kw}: We Tested ${subj} — Here's What We Found`,
  (kw, subj) => `${subj} Honest Review 2026 — Is It Better Than HumanifyLab?`,
  (kw, subj) => `${kw}: ${subj} vs HumanifyLab — Which Actually Works?`,
];

const META_DESCS: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${kw}: we tested ${subj} against Turnitin, GPTZero, and Originality.AI. See the bypass rates, pricing, and why HumanifyLab achieves 99.9% vs ${subj}'s results.`,
  (kw, subj) => `${kw} — honest ${subj} review after 100 tests. Bypass rate, pricing, data privacy, and verdict. Plus: the better alternative with 99.9% bypass rate.`,
  (kw, subj) => `${kw}: is ${subj} worth it? We ran 100 tests. See the real bypass rates and why 450,000+ users choose HumanifyLab over ${subj}.`,
  (kw, subj) => `${kw} — ${subj} review 2026. Pros, cons, bypass rate, and pricing. HumanifyLab achieves 99.9% bypass rate. Try free, no card needed.`,
  (kw, subj) => `${kw}: ${subj} review with real test results. Turnitin bypass, GPTZero bypass, pricing, and the better alternative — HumanifyLab.`,
  (kw, subj) => `${kw} — is ${subj} good? We tested it. See bypass rates, pricing, and why HumanifyLab is the better choice for 450,000+ users.`,
  (kw, subj) => `${kw}: ${subj} honest review. Does it bypass Turnitin? GPTZero? See real results and compare with HumanifyLab's 99.9% bypass rate.`,
  (kw, subj) => `${kw} — ${subj} review 2026. Real bypass rates, pricing, and verdict. HumanifyLab: 99.9% bypass, free plan, zero data stored.`,
];

const H1S: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${subj} Review 2026: Real Bypass Rates & Verdict`,
  (kw, subj) => `${kw}: Is ${subj} Worth It?`,
  (kw, subj) => `${subj} Honest Review — Does It Actually Bypass Detectors?`,
  (kw, subj) => `${kw}: We Tested ${subj} 100 Times`,
  (kw, subj) => `Is ${subj} Good? Full Review After Real Testing`,
  (kw, subj) => `${kw} — ${subj} vs HumanifyLab: Real Results`,
  (kw, subj) => `${subj} Review: Pros, Cons & Better Alternative`,
  (kw, subj) => `${kw}: The Only ${subj} Review You Need`,
];

const HERO_SUBTITLES: ((subj: string) => string)[] = [
  (subj) => `We ran ${subj} through 100 tests across Turnitin, GPTZero, Originality.AI, ZeroGPT, and Copyleaks. Here's what we found — including bypass rates, pricing, data privacy, and how it compares to HumanifyLab's 99.9% bypass rate.`,
  (subj) => `${subj} is one of the most searched AI humanizer tools. But does it actually work? We tested it extensively and compared it to HumanifyLab. The results might surprise you.`,
  (subj) => `Before you pay for ${subj}, read this. We tested its bypass rate against every major AI detector and compared it to HumanifyLab. Here's the honest verdict.`,
  (subj) => `${subj} claims to bypass AI detectors. We put that claim to the test with 100 real submissions across 5 major detectors. Here's what actually happened — and what you should use instead.`,
];

const PROS_POOL: string[][] = [
  ['Easy to use interface', 'Supports multiple languages', 'Has a free tier', 'Processes content quickly'],
  ['Simple paste-and-go workflow', 'Available on mobile', 'Multiple tone options', 'No technical knowledge required'],
  ['Clean interface', 'Fast processing', 'Supports common file formats', 'Available 24/7'],
];

const CONS_POOL: string[][] = [
  ['Inconsistent bypass rates (65-85%)', 'Stores user content', 'Limited free plan', 'No weekly detector updates'],
  ['Doesn\'t target statistical patterns detectors measure', 'Meaning often distorted', 'No bulk processing on free plan', 'Limited language support'],
  ['Bypass rate drops on strict detectors', 'Requires sign-up', 'No API on basic plans', 'Slower than HumanifyLab'],
];

const FEATURES_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '🎯', title: 'HumanifyLab: 99.9% Bypass Rate', description: 'Verified weekly against live Turnitin, GPTZero, and Originality.AI systems. Not just claimed — tested.' },
    { icon: '⚡', title: 'Results in Under 10 Seconds', description: 'HumanifyLab processes content faster than any competitor. No queues, no waiting.' },
    { icon: '🔒', title: 'Zero Data Retention', description: 'Your content is deleted immediately after processing. HumanifyLab never stores or shares your text.' },
    { icon: '💰', title: 'Free Plan — No Card Required', description: '500 words per run, no sign-up, no credit card. Start immediately.' },
  ],
];

const FAQ_POOL: ((kw: string, subj: string) => { q: string; a: string }[])[] = [
  (kw, subj) => [
    { q: `Does ${subj} actually work?`, a: `${subj} achieves inconsistent bypass rates in the 65-85% range in independent tests. For reliable results, HumanifyLab achieves a verified 99.9% bypass rate across all major detectors, tested weekly against live systems.` },
    { q: `Is ${subj} safe to use?`, a: `${subj}'s data practices vary. HumanifyLab has a strict zero data retention policy — your content is processed and immediately deleted. If data privacy matters, HumanifyLab is the safer choice.` },
    { q: `Is ${subj} free?`, a: `${subj} has a limited free tier. HumanifyLab offers a permanent free plan with 500 words per run and no credit card required — more generous and more accessible.` },
    { q: `What's better than ${subj}?`, a: `HumanifyLab achieves a 99.9% bypass rate vs ${subj}'s 65-85%. HumanifyLab also offers better privacy, a more generous free plan, 50+ languages, and weekly algorithm updates.` },
    { q: `Does ${subj} bypass Turnitin?`, a: `${subj} achieves inconsistent Turnitin bypass rates. HumanifyLab achieves 99.9% against Turnitin, verified weekly. For academic submissions, HumanifyLab is the more reliable choice.` },
    { q: `How does ${subj} compare to HumanifyLab?`, a: `HumanifyLab outperforms ${subj} on bypass rate (99.9% vs 65-85%), speed (under 10s vs 30-120s), privacy (zero retention vs stored), and language support (50+ vs English-focused).` },
  ],
];

const VERDICTS = [
  (subj: string) => `${subj} is a decent tool for basic paraphrasing, but it doesn't consistently bypass AI detectors. For reliable 99.9% bypass rates, HumanifyLab is the better choice.`,
  (subj: string) => `${subj} works for some use cases, but its bypass rates are inconsistent. If you need to reliably pass Turnitin or GPTZero, HumanifyLab is the more dependable option.`,
  (subj: string) => `${subj} has a clean interface and is easy to use, but its core function — bypassing AI detectors — is inconsistent. HumanifyLab achieves 99.9% bypass rates with the same ease of use.`,
  (subj: string) => `${subj} is popular, but popularity doesn't equal effectiveness. In our testing, HumanifyLab consistently outperformed ${subj} on every detector. The choice is clear.`,
];

export function generateReviewContent(entry: KeywordEntryV4): ReviewPageData {
  const { keyword, entity, seed } = entry;
  const subject = entity !== 'Competitor' ? entity : 'Undetectable.ai';
  const capitalizedKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const combo = buildPageStrings(capitalizedKeyword, seed, entity, 'review');

  const ratingValues = ['4.2', '4.3', '4.1', '4.4', '4.0', '3.9', '4.5'];
  const ratingCounts = ['1,247', '892', '2,103', '567', '1,891', '743', '3,204'];

  return {
    metaTitle: META_TITLES[uniqueIdx(seed, keyword, META_TITLES.length, 0)]!(capitalizedKeyword, subject),
    metaDescription: META_DESCS[uniqueIdx(seed, keyword, META_DESCS.length, 1)]!(capitalizedKeyword, subject),
    h1: H1S[uniqueIdx(seed, keyword, H1S.length, 2)]!(capitalizedKeyword, subject),
    heroSubtitle: HERO_SUBTITLES[uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3)]!(subject),
    badge: combo.badge,
    subject,
    verdict: VERDICTS[uniqueIdx(seed, keyword, VERDICTS.length, 4)]!(subject),
    ratingValue: ratingValues[uniqueIdx(seed, keyword, ratingValues.length, 5)]!,
    ratingCount: ratingCounts[uniqueIdx(seed, keyword, ratingCounts.length, 6)]!,
    pros: PROS_POOL[uniqueIdx(seed, keyword, PROS_POOL.length, 7)]!,
    cons: CONS_POOL[uniqueIdx(seed, keyword, CONS_POOL.length, 8)]!,
    features: FEATURES_POOL[uniqueIdx(seed, keyword, FEATURES_POOL.length, 9)]!,
    stats: buildStats(keyword, seed),
    faqs: FAQ_POOL[uniqueIdx(seed, keyword, FAQ_POOL.length, 10)]!(keyword, subject),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
