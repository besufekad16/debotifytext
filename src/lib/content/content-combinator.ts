import { uniqueIdx } from '~/lib/content/content-utils';

// ── Part pools ────────────────────────────────────────────────────────────────

const TITLE_VERBS = ['Beat', 'Bypass', 'Pass', 'Defeat', 'Eliminate', 'Outsmart', 'Fool', 'Evade', 'Trick', 'Circumvent', 'Remove', 'Fix'];
const TITLE_ADVERBS = ['Instantly', 'in Seconds', 'for Free', 'in 2026', 'Guaranteed', 'Every Time', 'Permanently', 'Without Effort', 'Right Now', 'Today', 'in Under 10 Seconds', 'with 99.9% Success'];
const TITLE_SUFFIXES = ['| HumanifyLab', '— HumanifyLab', '| Free Tool', '| HumanifyLab 2026', '— Free & Instant', '| AI Humanizer', '— No Sign-up', '| Try Free'];
const TITLE_FORMATS = [
  '{verb} {keyword} {adverb} {suffix}',
  '{keyword}: {verb} AI Detection {adverb} {suffix}',
  '{keyword} — {verb} Every Detector {adverb} {suffix}',
  'How to {verb} {keyword} {adverb} {suffix}',
  '{keyword}: The {adverb} Solution {suffix}',
  '{verb} {keyword} — {adverb} {suffix}',
  '{keyword} {adverb} — {verb} AI Detection {suffix}',
  '{keyword}: {verb} Turnitin & GPTZero {adverb} {suffix}',
  'Best Way to {verb} {keyword} {adverb} {suffix}',
  '{keyword} — {verb} AI Flags {adverb} {suffix}',
];

const DESC_OPENERS: ((kw: string) => string)[] = [
  (kw) => `${kw} with HumanifyLab.`,
  (kw) => `Need to ${kw.toLowerCase()}?`,
  (kw) => `${kw}: solved.`,
  (kw) => `Struggling with ${kw.toLowerCase()}?`,
  (kw) => `The best way to ${kw.toLowerCase()} is HumanifyLab.`,
  (kw) => `${kw} — done right.`,
  (kw) => `Fix ${kw.toLowerCase()} in seconds.`,
  (kw) => `${kw}: here's the solution.`,
  (kw) => `Stop worrying about ${kw.toLowerCase()}.`,
  (kw) => `${kw} — we've got you covered.`,
];
const DESC_STATS = [
  '99.9% bypass rate.',
  'Trusted by 450,000+ users.',
  'Results in under 10 seconds.',
  'Zero data retention.',
  '50+ languages supported.',
  'Free plan available.',
  'No sign-up required.',
  'Verified weekly against live detectors.',
  'Passes Turnitin, GPTZero, Originality.AI.',
  '0-3% AI score guaranteed.',
];
const DESC_CLOSERS = [
  'Free to try — no sign-up required.',
  'Start free today.',
  'No credit card needed.',
  'Try it now — instant results.',
  'Free plan available.',
  'No account needed.',
  'Get started free.',
  'Instant results, no commitment.',
  'Free, fast, and reliable.',
  'Join 450,000+ users today.',
];

const H1_FORMATS = [
  '{keyword}: {verb} AI Detection {adverb}',
  '{verb} {keyword} — {adverb}',
  '{keyword} — {verb} Every Detector {adverb}',
  'How to {verb} {keyword} {adverb}',
  '{keyword}: The {adverb} Fix',
  '{verb} {keyword} with 99.9% Success',
  '{keyword} — {verb} AI Flags {adverb}',
  '{keyword}: {adverb} AI Detection Solution',
  'The Best Way to {verb} {keyword}',
  '{verb} {keyword} — Proven Results',
];

const HERO_PARTS_A = [
  'HumanifyLab is the most reliable AI humanizer in 2026.',
  'Over 450,000 users trust HumanifyLab to bypass AI detection.',
  'HumanifyLab achieves a 99.9% bypass rate across all major detectors.',
  'Deep linguistic transformation — not just synonym replacement.',
  'HumanifyLab targets perplexity, burstiness, and semantic entropy simultaneously.',
  'The fastest AI humanizer available — results in under 10 seconds.',
  'HumanifyLab is tested weekly against live Turnitin and GPTZero systems.',
  'Zero data retention — your content is never stored or shared.',
  'HumanifyLab supports 50+ languages with the same 99.9% bypass rate.',
  'Free plan available — no credit card, no sign-up required.',
];
const HERO_PARTS_B = [
  'Paste your content, click Humanize, get 0% AI score.',
  'No waiting, no queues — instant results every time.',
  'Your original meaning is preserved 100%.',
  'Works on any device — desktop, tablet, or mobile.',
  'Passes Turnitin, GPTZero, Originality.AI, Copyleaks, and more.',
  'Free plan handles up to 500 words per run.',
  'Upgrade for unlimited words, bulk processing, and API access.',
  'Academic, Professional, and Casual tone presets available.',
  'Maximum intensity for the strictest detectors.',
  'Results are permanent — not a temporary fix.',
];

const BADGE_PREFIXES = ['AI Humanizer', 'Bypass Tool', 'Detection Fix', 'Score Reducer', 'Content Tool', 'Humanization Engine', 'AI Detector Bypass', 'Undetectable AI'];
const BADGE_SUFFIXES = ['2026', 'Free', 'Instant', 'Verified', 'Pro', 'Trusted', 'Top Rated', '#1 Tool'];

const FAQ_TITLE_FORMATS = [
  'Frequently Asked Questions',
  'Common Questions Answered',
  'Everything You Need to Know',
  'Your Questions, Answered',
  'FAQs About {keyword}',
  '{keyword}: Common Questions',
  'What People Ask About {keyword}',
  'Questions & Answers',
  'Need Help? Read This First',
  'Quick Answers',
];

const CTA_TITLE_FORMATS = [
  'Get Started with {keyword} Today',
  '{keyword} — Start Free Now',
  'Try HumanifyLab Free',
  'Fix {keyword} in Seconds',
  'Start Bypassing AI Detection',
  'Get 0% AI Score Now',
  'Join 450,000+ Users',
  '{keyword} — No Sign-up Needed',
  'Start Free — Instant Results',
  'Try HumanifyLab for {keyword}',
];

const CTA_SUBTITLE_FORMATS = [
  'Free plan available. No sign-up required. Results in under 10 seconds.',
  'Join 450,000+ users who trust HumanifyLab. Start free — no credit card needed.',
  '99.9% bypass rate. Zero data stored. Instant results. Try free today.',
  'No account needed. Paste your content and get 0% AI score in seconds.',
  'Free plan, instant results, meaning preserved. Start now.',
  'Trusted by students and professionals worldwide. Free to start.',
  '99.9% bypass rate across Turnitin, GPTZero, Originality.AI. Free plan.',
  'Deep transformation, permanent results, zero data stored. Try free.',
  'No credit card. No sign-up. No watermark. Just results.',
  'Start free, upgrade when you need more. No commitment required.',
];

// ── FAQ pools ─────────────────────────────────────────────────────────────────

const FAQ_QUESTION_TEMPLATES = [
  (kw: string) => `Does HumanifyLab really work for ${kw.toLowerCase()}?`,
  (kw: string) => `How long does it take to ${kw.toLowerCase()} with HumanifyLab?`,
  (kw: string) => `Is HumanifyLab free for ${kw.toLowerCase()}?`,
  (kw: string) => `Will my content still make sense after using HumanifyLab for ${kw.toLowerCase()}?`,
  (kw: string) => `Which AI detectors does HumanifyLab beat when I need to ${kw.toLowerCase()}?`,
  (kw: string) => `Do I need to create an account to ${kw.toLowerCase()}?`,
  (kw: string) => `How does HumanifyLab achieve ${kw.toLowerCase()} without ruining my text?`,
  (kw: string) => `Is it safe to use HumanifyLab to ${kw.toLowerCase()}?`,
  (kw: string) => `What's the word limit when I use HumanifyLab to ${kw.toLowerCase()}?`,
  (kw: string) => `Can I ${kw.toLowerCase()} in languages other than English?`,
  (kw: string) => `How is HumanifyLab different from other tools for ${kw.toLowerCase()}?`,
  (kw: string) => `Will the results for ${kw.toLowerCase()} be permanent?`,
  (kw: string) => `Does HumanifyLab store my content when I ${kw.toLowerCase()}?`,
  (kw: string) => `What success rate does HumanifyLab have for ${kw.toLowerCase()}?`,
  (kw: string) => `Can I use HumanifyLab to ${kw.toLowerCase()} on mobile?`,
  (kw: string) => `How many times can I ${kw.toLowerCase()} for free?`,
  (kw: string) => `Does HumanifyLab work for academic content when I need to ${kw.toLowerCase()}?`,
  (kw: string) => `What tone options are available when I ${kw.toLowerCase()}?`,
  (kw: string) => `Is there an API for bulk ${kw.toLowerCase()}?`,
  (kw: string) => `How does HumanifyLab handle ${kw.toLowerCase()} for long documents?`,
];

const FAQ_ANSWER_TEMPLATES = [
  'Yes. HumanifyLab achieves a 99.9% bypass rate across all major AI detectors, verified weekly against live systems.',
  'Results are instant — under 10 seconds for most documents. No queues, no waiting.',
  'Yes. The free plan handles up to 500 words per run with no sign-up required. Upgrade for unlimited access.',
  'Absolutely. HumanifyLab preserves 100% of your original meaning while transforming the linguistic signature.',
  'HumanifyLab beats Turnitin, GPTZero, Originality.AI, Copyleaks, ZeroGPT, and all other major detectors.',
  'No account needed. Paste your content, click Humanize, and get results instantly — no sign-up required.',
  'HumanifyLab uses deep linguistic transformation targeting perplexity, burstiness, and semantic entropy simultaneously.',
  'Completely safe. HumanifyLab uses zero data retention — your content is never stored, logged, or shared.',
  'The free plan handles up to 500 words. Pro and Unlimited plans remove all word limits.',
  'Yes. HumanifyLab supports 50+ languages with the same 99.9% bypass rate as English.',
  'Unlike basic paraphrasers, HumanifyLab targets the statistical patterns detectors actually measure — not just word choice.',
  'Yes. The transformation is permanent. Detectors will not flag the output even on re-scan.',
  'Never. HumanifyLab has a strict zero data retention policy. Your content is processed and immediately discarded.',
  '99.9% bypass rate across all major detectors, with results verified weekly against live Turnitin and GPTZero systems.',
  'Yes. HumanifyLab works on any device — desktop, tablet, or mobile — with no app download required.',
  'The free plan gives you unlimited runs up to 500 words each. No daily cap, no credit card required.',
  'Yes. HumanifyLab includes an Academic tone preset specifically tuned for university-level writing standards.',
  'Academic, Professional, and Casual tone presets are available. Choose the one that fits your context.',
  'Yes. The HumanifyLab API supports bulk processing for teams and developers. Available on Pro and Unlimited plans.',
  'HumanifyLab processes long documents in chunks, ensuring consistent bypass rates throughout the entire text.',
];

// ── Step pools ────────────────────────────────────────────────────────────────

const STEP_TITLE_TEMPLATES = [
  (kw: string) => `Paste Your Content`,
  (kw: string) => `Select Your Tone`,
  (kw: string) => `Click Humanize`,
  (kw: string) => `Get Your Results`,
  (kw: string) => `Copy & Use`,
  (kw: string) => `Choose Intensity`,
  (kw: string) => `Verify Your Score`,
  (kw: string) => `Upload Your Document`,
  (kw: string) => `Select Language`,
  (kw: string) => `Review the Output`,
  (kw: string) => `Run the Detector`,
  (kw: string) => `Adjust if Needed`,
  (kw: string) => `Download Your Text`,
  (kw: string) => `Set Word Limit`,
  (kw: string) => `Enable Bulk Mode`,
  (kw: string) => `Access the API`,
  (kw: string) => `Check Your Score`,
  (kw: string) => `Submit Your Work`,
  (kw: string) => `Share Your Results`,
  (kw: string) => `Upgrade for More`,
];

const STEP_DESC_TEMPLATES = [
  (kw: string) => `Copy your AI-generated text and paste it into the HumanifyLab editor. Works with any content up to 500 words on the free plan.`,
  (kw: string) => `Choose Academic, Professional, or Casual tone to match your context. Each preset is tuned for different use cases.`,
  (kw: string) => `Hit the Humanize button and let HumanifyLab transform your text. Deep linguistic processing starts immediately.`,
  (kw: string) => `Your humanized content is ready in under 10 seconds. The AI signature has been completely removed.`,
  (kw: string) => `Copy the output and use it anywhere. The transformation is permanent — no re-flagging on future scans.`,
  (kw: string) => `Set the intensity level to match your detector's strictness. Maximum intensity for Turnitin and GPTZero.`,
  (kw: string) => `Run your text through any AI detector to confirm the 0% AI score. HumanifyLab guarantees the result.`,
  (kw: string) => `Upload a .txt or .docx file directly. HumanifyLab processes the full document and returns the humanized version.`,
  (kw: string) => `Select from 50+ supported languages. HumanifyLab achieves the same 99.9% bypass rate in every language.`,
  (kw: string) => `Read through the output to confirm your meaning is preserved. HumanifyLab maintains 100% semantic accuracy.`,
  (kw: string) => `Test the output in Turnitin, GPTZero, or Originality.AI. Expect a 0-3% AI score every time.`,
  (kw: string) => `If you want further adjustments, run the text through HumanifyLab again. Each pass adds more variation.`,
  (kw: string) => `Download the humanized text as a .txt or .docx file. Ready to submit or publish immediately.`,
  (kw: string) => `Set a custom word limit for your run. The free plan handles up to 500 words per submission.`,
  (kw: string) => `Enable bulk mode to process multiple documents at once. Available on Pro and Unlimited plans.`,
  (kw: string) => `Integrate HumanifyLab into your workflow via API. Supports batch processing for high-volume needs.`,
  (kw: string) => `Check your AI score before and after. HumanifyLab consistently delivers 0-3% AI scores.`,
  (kw: string) => `Submit your humanized content with confidence. HumanifyLab's results are verified weekly against live detectors.`,
  (kw: string) => `Share your results with your team. HumanifyLab's output is clean, professional, and ready to use.`,
  (kw: string) => `Upgrade to Pro or Unlimited for unlimited words, bulk processing, API access, and priority support.`,
];

// ── Feature pools ─────────────────────────────────────────────────────────────

const FEATURE_ICONS = ['🚀', '🛡️', '⚡', '🎯', '🔬', '🌍', '🔒', '📊', '✅', '💡', '🧬', '📈', '🤖', '🔑', '💎', '⚙️', '📝', '🏆', '🔥', '💯'];

const FEATURE_TITLE_TEMPLATES = [
  '99.9% Bypass Rate',
  'Instant Results',
  'Zero Data Retention',
  '50+ Languages',
  'Meaning Preserved',
  'Free Plan Available',
  'No Sign-up Required',
  'Weekly Verification',
  'Deep Transformation',
  'Permanent Results',
  'Academic Tone Preset',
  'Professional Tone Preset',
  'Bulk Processing',
  'API Access',
  'Mobile Friendly',
  'Turnitin Verified',
  'GPTZero Verified',
  'Originality.AI Verified',
  'Maximum Intensity Mode',
  'Unlimited Word Plans',
];

const FEATURE_DESC_TEMPLATES = [
  (kw: string) => `HumanifyLab achieves a 99.9% bypass rate across all major AI detectors, verified weekly against live systems.`,
  (kw: string) => `Get humanized content in under 10 seconds. No queues, no waiting — instant results every time.`,
  (kw: string) => `Your content is never stored, logged, or shared. Strict zero data retention policy on every plan.`,
  (kw: string) => `HumanifyLab supports 50+ languages with the same 99.9% bypass rate as English content.`,
  (kw: string) => `Deep linguistic transformation preserves 100% of your original meaning while removing AI signatures.`,
  (kw: string) => `The free plan handles up to 500 words per run. No credit card, no sign-up, no commitment.`,
  (kw: string) => `Paste your content and get results immediately. No account creation required to get started.`,
  (kw: string) => `HumanifyLab is tested weekly against live Turnitin and GPTZero systems to ensure continued effectiveness.`,
  (kw: string) => `Targets perplexity, burstiness, and semantic entropy simultaneously — not just synonym replacement.`,
  (kw: string) => `The transformation is permanent. Your humanized content will not be re-flagged on future scans.`,
  (kw: string) => `Academic tone preset is tuned for university-level writing, passing Turnitin with 0-3% AI scores.`,
  (kw: string) => `Professional tone preset delivers polished, business-ready content that passes all workplace AI checks.`,
  (kw: string) => `Process multiple documents at once with bulk mode. Available on Pro and Unlimited plans.`,
  (kw: string) => `Integrate HumanifyLab into your workflow via REST API. Supports high-volume batch processing.`,
  (kw: string) => `Works on any device — desktop, tablet, or mobile — with no app download required.`,
  (kw: string) => `Verified to achieve 0-3% AI scores on Turnitin, the world's most widely used academic detector.`,
  (kw: string) => `Verified to achieve 0-3% AI scores on GPTZero, trusted by educators and institutions worldwide.`,
  (kw: string) => `Verified to achieve 0-3% AI scores on Originality.AI, the standard for publishers and agencies.`,
  (kw: string) => `Maximum intensity mode targets the strictest detectors with the most aggressive transformation available.`,
  (kw: string) => `Pro and Unlimited plans remove all word limits. Process entire books, reports, or datasets in one run.`,
];

// ── Stat pools ────────────────────────────────────────────────────────────────

const STAT_VALUES = ['99.9%', '450,000+', '<10s', '50+', '0-3%', '100%', '5M+', '2026', '500', '24/7', '#1', '3x', '10x', '99%', '0', '1M+', '48h', '5★', '30+', '1B+'];
const STAT_LABELS = [
  'Bypass Rate',
  'Users Worldwide',
  'Average Processing Time',
  'Languages Supported',
  'AI Score Guaranteed',
  'Meaning Preserved',
  'Documents Processed',
  'Verified & Updated',
  'Free Words Per Run',
  'Support Available',
  'Ranked AI Humanizer',
  'Faster Than Competitors',
  'More Effective Than Paraphrasers',
  'Detector Pass Rate',
  'Data Stored',
  'Monthly Active Users',
  'Average Response Time',
  'User Rating',
  'Detector Integrations',
  'Words Humanized',
];

// ── Helper ────────────────────────────────────────────────────────────────────

function pick<T>(pool: T[], seed: number, keyword: string, offset: number): T {
  return pool[uniqueIdx(seed, keyword, pool.length, offset)]!;
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

// ── Main page strings builder ─────────────────────────────────────────────────

export function buildPageStrings(
  keyword: string,
  seed: number,
  entity: string,
  cluster: string,
): {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
} {
  const verb = pick(TITLE_VERBS, seed, keyword, 0);
  const adverb = pick(TITLE_ADVERBS, seed, keyword, 1);
  const suffix = pick(TITLE_SUFFIXES, seed, keyword, 2);
  const titleFormat = pick(TITLE_FORMATS, seed, keyword, 3);
  const h1Format = pick(H1_FORMATS, seed, keyword, 4);

  const vars = { verb, adverb, suffix, keyword };

  const metaTitle = fillTemplate(titleFormat, vars);
  const h1 = fillTemplate(h1Format, { verb, adverb, keyword });

  const opener = pick(DESC_OPENERS, seed, keyword, 5)(keyword);
  const stat = pick(DESC_STATS, seed, keyword, 6);
  const closer = pick(DESC_CLOSERS, seed, keyword, 7);
  const metaDescription = `${opener} ${stat} ${closer}`;

  const heroA = pick(HERO_PARTS_A, seed, keyword, 8);
  const heroB = pick(HERO_PARTS_B, seed, keyword, 9);
  const heroSubtitle = `${heroA} ${heroB}`;

  const badgePrefix = pick(BADGE_PREFIXES, seed, keyword, 10);
  const badgeSuffix = pick(BADGE_SUFFIXES, seed, keyword, 11);
  const badge = `${badgePrefix} ${badgeSuffix}`;

  const faqTitleTemplate = pick(FAQ_TITLE_FORMATS, seed, keyword, 12);
  const faqTitle = fillTemplate(faqTitleTemplate, { keyword });

  const ctaTitleTemplate = pick(CTA_TITLE_FORMATS, seed, keyword, 13);
  const finalCtaTitle = fillTemplate(ctaTitleTemplate, { keyword });

  const finalCtaSubtitle = pick(CTA_SUBTITLE_FORMATS, seed, keyword, 14);

  return { metaTitle, metaDescription, h1, heroSubtitle, badge, faqTitle, finalCtaTitle, finalCtaSubtitle };
}

// ── FAQ builder ───────────────────────────────────────────────────────────────

export function buildFaqs(
  keyword: string,
  seed: number,
  entity: string,
  cluster: string,
): { q: string; a: string }[] {
  const count = 5;
  const result: { q: string; a: string }[] = [];
  const usedQ = new Set<number>();
  const usedA = new Set<number>();

  for (let i = 0; i < count; i++) {
    // Pick unique question index
    let qIdx = uniqueIdx(seed, keyword, FAQ_QUESTION_TEMPLATES.length, i * 3);
    let attempts = 0;
    while (usedQ.has(qIdx) && attempts < FAQ_QUESTION_TEMPLATES.length) {
      qIdx = (qIdx + 1) % FAQ_QUESTION_TEMPLATES.length;
      attempts++;
    }
    usedQ.add(qIdx);

    // Pick unique answer index (different offset so q and a vary independently)
    let aIdx = uniqueIdx(seed, keyword, FAQ_ANSWER_TEMPLATES.length, i * 3 + 100);
    attempts = 0;
    while (usedA.has(aIdx) && attempts < FAQ_ANSWER_TEMPLATES.length) {
      aIdx = (aIdx + 1) % FAQ_ANSWER_TEMPLATES.length;
      attempts++;
    }
    usedA.add(aIdx);

    result.push({
      q: FAQ_QUESTION_TEMPLATES[qIdx]!(keyword),
      a: FAQ_ANSWER_TEMPLATES[aIdx]!,
    });
  }

  return result;
}

// ── Steps builder ─────────────────────────────────────────────────────────────

export function buildSteps(
  keyword: string,
  seed: number,
  cluster: string,
): { number: string; title: string; description: string }[] {
  const count = 4;
  const result: { number: string; title: string; description: string }[] = [];
  const used = new Set<number>();

  for (let i = 0; i < count; i++) {
    let idx = uniqueIdx(seed, keyword, STEP_TITLE_TEMPLATES.length, i * 5 + 200);
    let attempts = 0;
    while (used.has(idx) && attempts < STEP_TITLE_TEMPLATES.length) {
      idx = (idx + 1) % STEP_TITLE_TEMPLATES.length;
      attempts++;
    }
    used.add(idx);

    result.push({
      number: String(i + 1),
      title: STEP_TITLE_TEMPLATES[idx]!(keyword),
      description: STEP_DESC_TEMPLATES[idx]!(keyword),
    });
  }

  return result;
}

// ── Feature points builder ────────────────────────────────────────────────────

export function buildFeaturePoints(
  keyword: string,
  seed: number,
  cluster: string,
): { icon: string; title: string; description: string }[] {
  const count = 4;
  const result: { icon: string; title: string; description: string }[] = [];
  const used = new Set<number>();

  for (let i = 0; i < count; i++) {
    let idx = uniqueIdx(seed, keyword, FEATURE_TITLE_TEMPLATES.length, i * 5 + 300);
    let attempts = 0;
    while (used.has(idx) && attempts < FEATURE_TITLE_TEMPLATES.length) {
      idx = (idx + 1) % FEATURE_TITLE_TEMPLATES.length;
      attempts++;
    }
    used.add(idx);

    const iconIdx = uniqueIdx(seed, keyword, FEATURE_ICONS.length, i * 5 + 350);

    result.push({
      icon: FEATURE_ICONS[iconIdx]!,
      title: FEATURE_TITLE_TEMPLATES[idx]!,
      description: FEATURE_DESC_TEMPLATES[idx]!(keyword),
    });
  }

  return result;
}

// ── Stats builder ─────────────────────────────────────────────────────────────

export function buildStats(
  keyword: string,
  seed: number,
): { value: string; label: string }[] {
  const count = 4;
  const result: { value: string; label: string }[] = [];
  const usedV = new Set<number>();
  const usedL = new Set<number>();

  for (let i = 0; i < count; i++) {
    let vIdx = uniqueIdx(seed, keyword, STAT_VALUES.length, i * 5 + 400);
    let attempts = 0;
    while (usedV.has(vIdx) && attempts < STAT_VALUES.length) {
      vIdx = (vIdx + 1) % STAT_VALUES.length;
      attempts++;
    }
    usedV.add(vIdx);

    let lIdx = uniqueIdx(seed, keyword, STAT_LABELS.length, i * 5 + 450);
    attempts = 0;
    while (usedL.has(lIdx) && attempts < STAT_LABELS.length) {
      lIdx = (lIdx + 1) % STAT_LABELS.length;
      attempts++;
    }
    usedL.add(lIdx);

    result.push({
      value: STAT_VALUES[vIdx]!,
      label: STAT_LABELS[lIdx]!,
    });
  }

  return result;
}
