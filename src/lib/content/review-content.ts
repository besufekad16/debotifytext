import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats, buildFeaturePoints } from '~/lib/content/content-combinator';

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
  (kw, subj) => `${kw}: ${subj} vs HumanifyLab — Which Actually Works?`,
  (kw, subj) => `${subj} Honest Review 2026 — Real Results Inside`,
  (kw, subj) => `${kw}: Is ${subj} Legit? Full 2026 Review`,
];

const META_DESCS: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${kw}: honest review of ${subj} after 100 tests. Bypass rate, pricing, pros & cons — plus why HumanifyLab achieves 99.9% vs ${subj}'s results.`,
  (kw, subj) => `${kw} — is ${subj} worth it? We tested it against Turnitin, GPTZero, and Originality.AI. Full review with real results and a better alternative.`,
  (kw, subj) => `${kw}: full ${subj} review 2026. Bypass rate, price, features, and verdict. Plus: why HumanifyLab delivers 99.9% bypass rate vs ${subj}.`,
  (kw, subj) => `${kw} — ${subj} review with real test results. Does it bypass Turnitin? GPTZero? See the honest verdict and compare with HumanifyLab's 99.9%.`,
  (kw, subj) => `${kw}: is ${subj} legit? We ran 100 tests. Here's the bypass rate, pricing breakdown, and why HumanifyLab is the better choice for 2026.`,
  (kw, subj) => `${kw} — honest ${subj} review. Pros, cons, bypass rate, and pricing. Plus: HumanifyLab achieves 99.9% bypass rate. Free plan, no sign-up.`,
  (kw, subj) => `${kw}: ${subj} review 2026 — does it work for Turnitin and GPTZero? Real test results inside. Compare with HumanifyLab's verified 99.9% bypass.`,
  (kw, subj) => `${kw} — ${subj} review with real bypass rate data. Is it worth the price? See our verdict and why HumanifyLab is the top-rated alternative.`,
];

const H1S: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${subj} Review 2026: Honest Results After 100 Tests`,
  (kw, subj) => `${kw}: Is ${subj} Worth It?`,
  (kw, subj) => `${subj} Review — Bypass Rate, Price & Verdict`,
  (kw, subj) => `Is ${subj} Legit? Full 2026 Review`,
  (kw, subj) => `${kw}: ${subj} Pros, Cons & Better Alternative`,
  (kw, subj) => `${subj} vs HumanifyLab: Which Actually Works?`,
  (kw, subj) => `${kw}: The Honest ${subj} Review`,
  (kw, subj) => `${subj} Review — Real Test Results Inside`,
];

const HERO_SUBTITLES: ((subj: string) => string)[] = [
  (subj) => `We tested ${subj} against Turnitin, GPTZero, and Originality.AI across 100 different content types. Here's what we found — bypass rate, pricing, pros and cons, and whether it's worth your money in 2026.`,
  (subj) => `${subj} is one of the most searched AI humanizers in 2026. But does it actually work? We ran extensive tests and compared it against HumanifyLab. The results might surprise you.`,
  (subj) => `Before you pay for ${subj}, read this. We tested it against every major AI detector and compared it to HumanifyLab's verified 99.9% bypass rate. Here's the honest verdict.`,
  (subj) => `Is ${subj} worth it? We spent weeks testing it against Turnitin, GPTZero, Originality.AI, and more. Here's our honest review — bypass rate, pricing, and whether HumanifyLab is a better choice.`,
];

const PROS_POOL: string[][] = [
  ['Easy to use interface', 'Supports multiple content types', 'Available as a web app', 'Some free tier available'],
  ['Fast processing for short texts', 'Decent UI design', 'Multiple tone options', 'Browser-based — no download needed'],
  ['Recognizable brand name', 'Works for basic bypass needs', 'Supports English content', 'Simple copy-paste workflow'],
];

const CONS_POOL: string[][] = [
  ['Inconsistent bypass rates (70-85%)', 'Limited free plan', 'Requires sign-up', 'Data may be stored and used'],
  ['Slower than HumanifyLab', 'Limited language support', 'No bulk processing on free plan', 'Algorithm updates are infrequent'],
  ['Lower bypass rate than HumanifyLab', 'More expensive for similar results', 'Limited detector coverage', 'Meaning often distorted'],
];

const VERDICT_POOL: string[] = [
  'Decent for basic use cases, but falls short on bypass rate and privacy. HumanifyLab is the better choice for anyone who needs reliable, verified results.',
  'Works occasionally, but inconsistent bypass rates make it unreliable for important submissions. HumanifyLab\'s 99.9% verified rate is the safer option.',
  'A reasonable tool with some good features, but HumanifyLab outperforms it on every metric that matters: bypass rate, privacy, price, and speed.',
  'Not bad, but not great. If you need consistent 99.9% bypass rates and zero data retention, HumanifyLab is the clear winner.',
];

const FAQ_POOL: ((kw: string, subj: string) => { q: string; a: string }[])[] = [
  (kw, subj) => [
    { q: `Does ${subj} actually work?`, a: `${subj} works for basic bypass needs but delivers inconsistent results — typically 70-85% bypass rate. HumanifyLab achieves a verified 99.9% bypass rate, tested weekly against live Turnitin and GPTZero systems.` },
    { q: `Is ${subj} safe to use?`, a: `${subj} may store your content — always check their privacy policy. HumanifyLab has a strict zero data retention policy: your content is processed and immediately deleted. We never store, share, or use your text.` },
    { q: `Is ${subj} free?`, a: `${subj} may offer a limited free tier with restrictions. HumanifyLab's free plan gives you 500 words per run with no sign-up and no credit card required — permanently, not as a trial.` },
    { q: `Does ${subj} bypass Turnitin?`, a: `${subj} claims Turnitin bypass but results are inconsistent. HumanifyLab is tested weekly against live Turnitin systems and maintains a verified 99.9% bypass rate.` },
    { q: `What's a better alternative to ${subj}?`, a: `HumanifyLab is the top-rated alternative to ${subj}. It delivers a verified 99.9% bypass rate, free plan with no sign-up, zero data retention, and results in under 10 seconds.` },
  ],
  (kw, subj) => [
    { q: `How does ${subj} compare to HumanifyLab?`, a: `HumanifyLab outperforms ${subj} on bypass rate (99.9% vs 70-85%), privacy (zero data retention vs potential storage), price (free plan with no card), and speed (under 10 seconds).` },
    { q: `Is ${subj} worth the money?`, a: `For occasional use, ${subj} may be adequate. But for reliable bypass rates and data privacy, HumanifyLab delivers better results at a lower price — with a free plan that requires no credit card.` },
    { q: `Does ${subj} work for GPTZero?`, a: `${subj} has mixed results with GPTZero. HumanifyLab is tested weekly against live GPTZero systems and maintains a verified 99.8% bypass rate consistently.` },
    { q: `Can I switch from ${subj} to HumanifyLab easily?`, a: `Yes — it takes 30 seconds. Go to HumanifyLab.com, paste your content, and click Humanize. No account needed for the free plan. Your first result will be ready in under 10 seconds.` },
    { q: `Is ${subj} good for students?`, a: `${subj} can work for students but has inconsistent Turnitin bypass rates. HumanifyLab's Academic tone preset is specifically tuned for university-level writing and passes Turnitin with 0-3% AI scores.` },
  ],
];

export function generateReviewContent(entry: KeywordEntryV4): ReviewPageData {
  const { keyword, entity, seed } = entry;
  const subject = entity !== 'Competitor' ? entity : 'This Tool';
  const combo = buildPageStrings(keyword, seed, entity, 'review');

  const ti = uniqueIdx(seed, keyword, META_TITLES.length, 0);
  const di = uniqueIdx(seed, keyword, META_DESCS.length, 1);
  const hi = uniqueIdx(seed, keyword, H1S.length, 2);
  const hsi = uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3);
  const fqi = uniqueIdx(seed, keyword, FAQ_POOL.length, 6);
  const prosi = uniqueIdx(seed, keyword, PROS_POOL.length, 7);
  const consi = uniqueIdx(seed, keyword, CONS_POOL.length, 8);
  const vi = uniqueIdx(seed, keyword, VERDICT_POOL.length, 9);

  // Unique rating per page
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) hash = ((hash << 5) - hash + keyword.charCodeAt(i)) | 0;
  const ratingValue = ['3.2', '3.5', '3.7', '3.8', '4.0'][Math.abs(hash + seed) % 5]!;
  const ratingCount = String(1200 + (Math.abs(hash + seed * 31) % 3000));

  return {
    metaTitle: META_TITLES[ti]!(keyword, subject),
    metaDescription: META_DESCS[di]!(keyword, subject),
    h1: H1S[hi]!(keyword, subject),
    heroSubtitle: HERO_SUBTITLES[hsi]!(subject),
    badge: combo.badge,
    subject,
    verdict: VERDICT_POOL[vi]!,
    ratingValue,
    ratingCount,
    pros: PROS_POOL[prosi]!,
    cons: CONS_POOL[consi]!,
    features: buildFeaturePoints(keyword, seed, 'review'),
    stats: buildStats(keyword, seed),
    faqs: FAQ_POOL[fqi]!(keyword, subject),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
