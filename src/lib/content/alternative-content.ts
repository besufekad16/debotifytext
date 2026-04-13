import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats, buildSteps, buildFeaturePoints } from '~/lib/content/content-combinator';

export interface AlternativePageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  competitor: string;
  whySwitch: { icon: string; title: string; description: string }[];
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
  (kw, comp) => `${kw}: HumanifyLab achieves 99.9% bypass rate — far better than ${comp}. Free plan, no sign-up, instant results. 450,000+ users trust HumanifyLab.`,
  (kw, comp) => `${kw} — tired of ${comp}'s inconsistent results? HumanifyLab bypasses Turnitin, GPTZero, and Originality.AI with 99.9% success. Try free today.`,
  (kw, comp) => `${kw}: HumanifyLab is the best ${comp} alternative — 99.9% bypass rate, zero data stored, 50+ languages, free plan. No card needed.`,
  (kw, comp) => `${kw} — switch from ${comp} to HumanifyLab. Better bypass rate, better privacy, better price. 450,000+ users already made the switch.`,
  (kw, comp) => `${kw}: if ${comp} isn't working for you, HumanifyLab will. 99.9% bypass rate against Turnitin, GPTZero, Originality.AI. Free to start.`,
  (kw, comp) => `${kw} — HumanifyLab is the #1 ${comp} alternative. 47-dimensional transformation, 99.9% bypass rate, zero data retention. Try free.`,
  (kw, comp) => `${kw}: the best ${comp} alternative for students and professionals. 99.9% bypass rate, free plan, no sign-up. Start in seconds.`,
  (kw, comp) => `${kw} — HumanifyLab outperforms ${comp} on bypass rate, speed, and privacy. Free plan available. No credit card required.`,
];

const H1S: ((kw: string, comp: string) => string)[] = [
  (kw, comp) => `The Best ${comp} Alternative: HumanifyLab`,
  (kw, comp) => `${kw}: Why HumanifyLab is the #1 Choice`,
  (kw, comp) => `${comp} Not Working? HumanifyLab Has 99.9% Bypass Rate`,
  (kw, comp) => `${kw} — The ${comp} Alternative That Actually Bypasses Detectors`,
  (kw, comp) => `Switch from ${comp} to HumanifyLab — Better Results, Better Price`,
  (kw, comp) => `${kw}: The Only ${comp} Alternative You Need`,
  (kw, comp) => `HumanifyLab: The Best ${comp} Alternative in 2026`,
  (kw, comp) => `${kw} — 99.9% Bypass Rate vs ${comp}'s Inconsistent Results`,
];

const HERO_SUBTITLES: ((comp: string) => string)[] = [
  (comp) => `${comp} is a popular tool, but it doesn't consistently bypass Turnitin, GPTZero, or Originality.AI. HumanifyLab does — with a verified 99.9% bypass rate, tested weekly against live detector systems. If you're looking for a ${comp} alternative that actually works, you've found it.`,
  (comp) => `Thousands of users have switched from ${comp} to HumanifyLab — and the reason is simple: results. HumanifyLab achieves 99.9% bypass rates across all major detectors. ${comp} doesn't come close. Free plan available, no sign-up required.`,
  (comp) => `If ${comp} is letting you down, HumanifyLab is the upgrade you need. Our 47-dimensional linguistic transformation targets the exact signals AI detectors measure — not just surface-level paraphrasing. The result: 99.9% bypass rate, every time.`,
  (comp) => `${comp} was built as a general writing tool. HumanifyLab was built specifically to defeat AI detectors. That's why HumanifyLab achieves 99.9% bypass rates while ${comp} is inconsistent. 450,000+ users have already made the switch.`,
  (comp) => `Looking for a ${comp} alternative that actually bypasses Turnitin and GPTZero? HumanifyLab achieves 99.9% bypass rates, processes content in under 10 seconds, and offers a free plan with no sign-up required. Start now.`,
];

const WHY_SWITCH_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '🎯', title: '99.9% Bypass Rate', description: 'HumanifyLab achieves a verified 99.9% bypass rate across all major AI detectors — far higher than most alternatives.' },
    { icon: '⚡', title: 'Faster Results', description: 'HumanifyLab processes content in under 10 seconds. No waiting, no queues, no delays.' },
    { icon: '🔒', title: 'Better Privacy', description: 'Zero data retention — your content is deleted immediately after processing. No storage, no sharing.' },
    { icon: '💰', title: 'Better Value', description: 'Free plan with 500 words per run, no credit card required. Paid plans start at $6.99/month.' },
  ],
  [
    { icon: '🧬', title: 'Deeper Transformation', description: '47-dimensional linguistic analysis targets the exact signals detectors measure — not just synonym replacement.' },
    { icon: '🌍', title: 'More Languages', description: '50+ languages supported with the same 99.9% bypass rate. Most alternatives only support English.' },
    { icon: '🔄', title: 'Always Updated', description: 'HumanifyLab is updated weekly as detectors evolve. Your bypass rate stays at 99.9% regardless of detector updates.' },
    { icon: '✅', title: 'Meaning Preserved', description: '100% of your original meaning, facts, and structure are preserved. Only the AI signature is removed.' },
  ],
];

const STEPS_POOL: { number: string; title: string; description: string }[][] = [
  [
    { number: '1', title: 'Go to HumanifyLab.com', description: 'No account needed. The free plan is available immediately — just open the site and start.' },
    { number: '2', title: 'Paste your content', description: 'Copy your AI-generated text and paste it in. Works with any content up to 500 words on the free plan.' },
    { number: '3', title: 'Click Humanize', description: 'Results appear in under 10 seconds. The AI signature is completely removed.' },
    { number: '4', title: 'Verify and submit', description: 'Test against your target detector — you\'ll see 0-3% AI score. Ready to submit or publish.' },
  ],
  [
    { number: '1', title: 'Open HumanifyLab', description: 'Visit HumanifyLab.com — no sign-up, no credit card. Start immediately with the free plan.' },
    { number: '2', title: 'Select your tone', description: 'Choose Academic, Professional, or Casual tone to match your context.' },
    { number: '3', title: 'Humanize in seconds', description: 'Our engine processes your content in real time. Watch your AI score drop to 0-3%.' },
    { number: '4', title: 'Use with confidence', description: 'Your humanized content passes every detector permanently. No re-flagging on future scans.' },
  ],
];

const FAQ_POOL: ((kw: string, comp: string) => { q: string; a: string }[])[] = [
  (kw, comp) => [
    { q: `Why should I use HumanifyLab instead of ${comp}?`, a: `HumanifyLab achieves a verified 99.9% bypass rate across all major AI detectors, while ${comp} typically achieves 65-85% in independent tests. HumanifyLab also offers better data privacy (zero retention), a more generous free plan, and 50+ language support.` },
    { q: `Is HumanifyLab free like ${comp}?`, a: `HumanifyLab offers a permanent free plan with 500 words per run and no credit card required. No sign-up needed. ${comp}'s free access is typically more limited. HumanifyLab's free plan is more accessible and more generous.` },
    { q: `Does HumanifyLab bypass Turnitin better than ${comp}?`, a: `Yes. HumanifyLab achieves a 99.9% Turnitin bypass rate, verified weekly against live systems. ${comp} achieves inconsistent results. For academic submissions, HumanifyLab is the more reliable choice.` },
    { q: `How do I switch from ${comp} to HumanifyLab?`, a: `Just go to HumanifyLab.com and paste your content. No account needed for the free plan. The switch takes seconds and results appear in under 10 seconds.` },
    { q: `Is HumanifyLab safe to use?`, a: `Yes. HumanifyLab has a strict zero data retention policy — your content is processed and immediately deleted. We never store, share, or use your text for any purpose.` },
    { q: `What makes HumanifyLab a better ${comp} alternative?`, a: `HumanifyLab uses 47-dimensional linguistic transformation that targets the exact statistical signals AI detectors measure. ${comp} uses surface-level paraphrasing. That's why HumanifyLab achieves 99.9% bypass rates while ${comp} is inconsistent.` },
  ],
];

export function generateAlternativeContent(entry: KeywordEntryV4): AlternativePageData {
  const { keyword, entity, seed } = entry;
  const competitor = entity !== 'Competitor' ? entity : 'Undetectable.ai';
  const capitalizedKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const combo = buildPageStrings(capitalizedKeyword, seed, entity, 'alternative');

  return {
    metaTitle: META_TITLES[uniqueIdx(seed, keyword, META_TITLES.length, 0)]!(capitalizedKeyword, competitor),
    metaDescription: META_DESCS[uniqueIdx(seed, keyword, META_DESCS.length, 1)]!(capitalizedKeyword, competitor),
    h1: H1S[uniqueIdx(seed, keyword, H1S.length, 2)]!(capitalizedKeyword, competitor),
    heroSubtitle: HERO_SUBTITLES[uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3)]!(competitor),
    badge: combo.badge,
    competitor,
    whySwitch: WHY_SWITCH_POOL[uniqueIdx(seed, keyword, WHY_SWITCH_POOL.length, 4)]!,
    steps: STEPS_POOL[uniqueIdx(seed, keyword, STEPS_POOL.length, 5)]!,
    stats: buildStats(keyword, seed),
    faqs: FAQ_POOL[uniqueIdx(seed, keyword, FAQ_POOL.length, 6)]!(keyword, competitor),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
