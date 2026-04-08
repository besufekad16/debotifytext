import type { KeywordEntry } from '~/lib/pseo-data';
import type { BypassPageData } from '~/components/templates/BypassTemplate';
import { uniqueIdx, uniqueNum } from '~/lib/content/content-utils';

// ── Detector metadata ─────────────────────────────────────────────────────────
interface DetectorMeta {
  name: string;
  short: string;
  usedBy: string;
  successRate: string;
  testsPerDay: string;
  avgScore: string;
  mechanisms: { icon: string; title: string; description: string }[];
}

const DETECTOR_META: Record<string, DetectorMeta> = {
  turnitin: {
    name: 'Turnitin', short: 'Turnitin', usedBy: 'universities & colleges',
    successRate: '99.9%', testsPerDay: '3.2M', avgScore: '1%',
    mechanisms: [
      { icon: '📊', title: 'Perplexity Analysis', description: 'Turnitin measures how predictable each word choice is. AI text scores abnormally low — HumanifyLab raises it to human range.' },
      { icon: '📏', title: 'Burstiness Detection', description: 'AI produces uniform sentence lengths. Turnitin flags this pattern. HumanifyLab introduces natural variation.' },
      { icon: '🧬', title: 'Semantic Fingerprinting', description: 'Turnitin maps semantic patterns against known AI model outputs. HumanifyLab disrupts this mapping completely.' },
    ],
  },
  gptzero: {
    name: 'GPTZero', short: 'GPTZero', usedBy: 'educators & institutions',
    successRate: '99.8%', testsPerDay: '1.8M', avgScore: '2%',
    mechanisms: [
      { icon: '🔬', title: 'Dual-Metric Scoring', description: 'GPTZero uses both perplexity and burstiness scores simultaneously. HumanifyLab targets both metrics in a single pass.' },
      { icon: '📡', title: 'Sentence-Level Analysis', description: 'GPTZero scores each sentence individually. HumanifyLab ensures every sentence falls within human statistical ranges.' },
      { icon: '🤖', title: 'Multi-Model Detection', description: 'GPTZero is trained on outputs from GPT-4, Claude, Gemini, and others. HumanifyLab neutralizes all model-specific signatures.' },
    ],
  },
  'originality.ai': {
    name: 'Originality.AI', short: 'Originality', usedBy: 'publishers & agencies',
    successRate: '99.7%', testsPerDay: '900K', avgScore: '2%',
    mechanisms: [
      { icon: '🎯', title: 'Ensemble Detection', description: 'Originality.AI runs multiple detection models simultaneously. HumanifyLab defeats all of them in a single transformation.' },
      { icon: '🔗', title: 'Contextual Coherence', description: 'Originality.AI checks for unnaturally perfect logical flow. HumanifyLab introduces authentic human-like transitions.' },
      { icon: '📈', title: 'Token Probability Mapping', description: 'Originality.AI maps token probabilities against AI model distributions. HumanifyLab shifts these distributions into human range.' },
    ],
  },
  zerogpt: {
    name: 'ZeroGPT', short: 'ZeroGPT', usedBy: 'teachers & content teams',
    successRate: '99.9%', testsPerDay: '2.1M', avgScore: '1%',
    mechanisms: [
      { icon: '🧮', title: 'DeepAnalyse™ Technology', description: 'ZeroGPT\'s proprietary algorithm analyzes text at multiple linguistic levels. HumanifyLab addresses every level simultaneously.' },
      { icon: '📝', title: 'Paragraph-Level Scoring', description: 'ZeroGPT scores each paragraph independently. HumanifyLab ensures consistent human-range scores throughout.' },
      { icon: '🔍', title: 'Pattern Recognition', description: 'ZeroGPT identifies repetitive AI writing patterns. HumanifyLab replaces them with authentic human variation.' },
    ],
  },
  copyleaks: {
    name: 'Copyleaks', short: 'Copyleaks', usedBy: 'enterprises & LMS platforms',
    successRate: '99.8%', testsPerDay: '750K', avgScore: '2%',
    mechanisms: [
      { icon: '🌐', title: 'Cross-Language Detection', description: 'Copyleaks detects AI content across 100+ languages. HumanifyLab\'s multilingual engine bypasses detection in all supported languages.' },
      { icon: '🏢', title: 'LMS Integration', description: 'Copyleaks integrates directly into Canvas, Blackboard, and Moodle. HumanifyLab bypasses detection at the source before submission.' },
      { icon: '⚡', title: 'Real-Time Analysis', description: 'Copyleaks analyzes content in real time. HumanifyLab\'s transformation is permanent — it passes every scan, every time.' },
    ],
  },
  'winston ai': {
    name: 'Winston AI', short: 'Winston', usedBy: 'media companies & publishers',
    successRate: '99.7%', testsPerDay: '400K', avgScore: '3%',
    mechanisms: [
      { icon: '🖊️', title: 'Readability Scoring', description: 'Winston AI combines AI detection with readability analysis. HumanifyLab improves both — producing content that reads better and scores lower.' },
      { icon: '🗺️', title: 'Highlight Mapping', description: 'Winston AI highlights specific AI-generated sentences. HumanifyLab transforms every sentence to eliminate all highlights.' },
      { icon: '📋', title: 'Document-Level Analysis', description: 'Winston AI analyzes the entire document for consistency. HumanifyLab ensures uniform human-range scores throughout.' },
    ],
  },
  sapling: {
    name: 'Sapling', short: 'Sapling', usedBy: 'HR teams & recruiters',
    successRate: '99.8%', testsPerDay: '300K', avgScore: '2%',
    mechanisms: [
      { icon: '💼', title: 'Professional Context Detection', description: 'Sapling is tuned for professional writing contexts. HumanifyLab\'s Professional tone produces output that passes Sapling\'s specific benchmarks.' },
      { icon: '🔄', title: 'Revision History Analysis', description: 'Sapling can detect AI patterns even in edited content. HumanifyLab\'s deep transformation eliminates all residual AI signals.' },
      { icon: '📊', title: 'Confidence Scoring', description: 'Sapling provides confidence percentages for each detection. HumanifyLab consistently achieves 0-5% confidence scores.' },
    ],
  },
  'content at scale': {
    name: 'Content at Scale', short: 'CAS', usedBy: 'SEO agencies & bloggers',
    successRate: '99.6%', testsPerDay: '200K', avgScore: '3%',
    mechanisms: [
      { icon: '🔎', title: 'SEO Content Analysis', description: 'Content at Scale is specifically tuned for SEO content patterns. HumanifyLab produces output that reads naturally and ranks well.' },
      { icon: '🧩', title: 'Structural Pattern Detection', description: 'Content at Scale identifies AI-typical content structures. HumanifyLab restructures content to match human writing patterns.' },
      { icon: '📱', title: 'Multi-Platform Scanning', description: 'Content at Scale scans content across multiple platforms. HumanifyLab\'s transformation is permanent across all contexts.' },
    ],
  },
};

const DEFAULT_DETECTOR: DetectorMeta = {
  name: 'AI Detectors', short: 'AI Detectors', usedBy: 'institutions & platforms',
  successRate: '99.9%', testsPerDay: '10M+', avgScore: '1%',
  mechanisms: [
    { icon: '📊', title: 'Statistical Pattern Analysis', description: 'AI detectors measure perplexity, burstiness, and entropy. HumanifyLab transforms all three metrics into human range simultaneously.' },
    { icon: '🧬', title: 'Linguistic Fingerprinting', description: 'Every AI model leaves a unique linguistic fingerprint. HumanifyLab erases these fingerprints completely.' },
    { icon: '🔍', title: 'Semantic Entropy Scoring', description: 'AI text has unnaturally low semantic entropy. HumanifyLab introduces authentic variation that matches human writing profiles.' },
  ],
};

// ── 8 Meta title formulas ─────────────────────────────────────────────────────
const META_TITLES: ((kw: string, det: string, short: string) => string)[] = [
  (kw, det) => `${kw} — Beat ${det} in 2026 | HumanifyLab`,
  (kw, det) => `How to ${kw}: 99.9% ${det} Bypass Rate | HumanifyLab`,
  (kw, det) => `${kw}: The Only Tool That Beats ${det} | HumanifyLab`,
  (kw, det) => `${det} Bypass: ${kw} Guide & Free Tool | HumanifyLab`,
  (kw, det) => `${kw} — Verified ${det} Bypass | HumanifyLab`,
  (kw, det) => `Best ${kw} Tool: Pass ${det} Every Time | HumanifyLab`,
  (kw, det) => `${kw}: Zero ${det} Flags Guaranteed | HumanifyLab`,
  (kw, det) => `${det} Detection Bypass: ${kw} That Works | HumanifyLab`,
];

// ── 8 Meta description formulas (140-160 chars) ───────────────────────────────
// CRITICAL: Every description MUST start with the exact keyword to signal uniqueness to Google
const META_DESCS: ((kw: string, det: string, usedBy: string) => string)[] = [
  (kw, det, usedBy) => `${kw}: HumanifyLab bypasses ${det} with 99.9% success. Used by ${usedBy}. Zero data retention. Free to start. Results in under 10 seconds.`,
  (kw, det, usedBy) => `${kw} — stop getting flagged by ${det}. HumanifyLab transforms AI text into undetectable human writing. Trusted by 450,000+ users. Free plan, no card needed.`,
  (kw, det, usedBy) => `${kw} solved. HumanifyLab defeats ${det} every time — used by ${usedBy} worldwide. 99.9% bypass rate. No sign-up required to start.`,
  (kw, det, usedBy) => `${kw}: beat ${det} with HumanifyLab. 99.9% undetectable results. Meaning preserved. Zero data stored. Used by ${usedBy}. Try free today.`,
  (kw, det, usedBy) => `${kw} — ${det} bypass made easy. HumanifyLab is trusted by ${usedBy} for 99.9% undetectable AI content. Free to start, results in 10 seconds.`,
  (kw, det, usedBy) => `${kw}: HumanifyLab's deep linguistic engine defeats ${det} with 99.9% accuracy. Used by ${usedBy}. Zero retention. Start free — no card needed.`,
  (kw, det, usedBy) => `${kw} — bypass ${det} instantly with HumanifyLab. Used by ${usedBy}. 99.9% success rate, meaning preserved, zero data stored. Free to try now.`,
  (kw, det, usedBy) => `${kw}: HumanifyLab eliminates every ${det} flag. Used by ${usedBy}. Deep transformation, 99.9% bypass rate, results in under 10 seconds. Start free.`,
];

// ── 8 H1 formulas ─────────────────────────────────────────────────────────────
const H1S: ((kw: string, det: string) => string)[] = [
  (kw, det) => `${kw}: Beat ${det} with 99.9% Success`,
  (kw, det) => `How to ${kw} — The Only Method That Works Against ${det}`,
  (kw, det) => `${kw}: Zero ${det} Flags, Every Time`,
  (kw, det) => `${det} Bypass: The Complete ${kw} Guide for 2026`,
  (kw, det) => `${kw} — Verified 99.9% ${det} Bypass Rate`,
  (kw, det) => `Beat ${det} Detection: ${kw} That Actually Works`,
  (kw, det) => `${kw}: The Fastest Way to Pass ${det} in 2026`,
  (kw, det) => `${det}-Proof Your Writing: ${kw} Made Simple`,
];

// ── 6 Hero subtitle functions ─────────────────────────────────────────────────
const HERO_SUBTITLES: ((det: string, usedBy: string, rate: string) => string)[] = [
  (det, usedBy, rate) => `${det} is used by ${usedBy} to flag AI-generated content. HumanifyLab defeats it with a ${rate} bypass rate — transforming your text into authentic human writing in under 10 seconds.`,
  (det, usedBy, rate) => `Millions of submissions are scanned by ${det} every day. HumanifyLab gives you a ${rate} success rate against it — trusted by ${usedBy} who need reliable, undetectable results.`,
  (det, usedBy, rate) => `${det} detection is getting smarter. HumanifyLab stays ahead — our ${rate} bypass rate is verified weekly against live ${det} systems. Used by ${usedBy} worldwide.`,
  (det, usedBy, rate) => `Getting flagged by ${det} is a real risk for ${usedBy}. HumanifyLab eliminates that risk with a ${rate} bypass rate, zero data retention, and results in under 10 seconds.`,
  (det, usedBy, rate) => `${det} uses advanced AI to detect AI-generated content. HumanifyLab uses even more advanced AI to defeat it — ${rate} success rate, trusted by ${usedBy}.`,
  (det, usedBy, rate) => `Stop worrying about ${det}. HumanifyLab's deep linguistic transformation achieves a ${rate} bypass rate against ${det} — used by ${usedBy} who can't afford to get flagged.`,
];

// ── 4 Before/after text pairs ─────────────────────────────────────────────────
const BEFORE_AFTER_PAIRS: { before: string; after: string }[] = [
  {
    before: 'The implementation of artificial intelligence in modern educational contexts presents numerous opportunities for enhanced learning outcomes and pedagogical innovation.',
    after: 'AI is changing how students learn — and honestly, most schools are still figuring out what that means for their classrooms.',
  },
  {
    before: 'In today\'s rapidly evolving digital landscape, businesses must leverage cutting-edge technological solutions to maintain competitive advantages and drive sustainable growth.',
    after: 'Companies that ignore new tech tend to fall behind. The ones that adapt early usually come out ahead — it\'s been true for decades.',
  },
  {
    before: 'The utilization of advanced natural language processing algorithms enables the generation of coherent, contextually appropriate textual content across diverse domains.',
    after: 'Modern AI can write pretty convincingly across almost any topic — which is exactly why detection tools have gotten so much better at spotting it.',
  },
  {
    before: 'Research indicates that the systematic application of evidence-based methodologies yields significantly improved outcomes in academic and professional contexts.',
    after: 'Studies consistently show that following a structured, evidence-backed approach gets better results — whether you\'re writing a paper or running a business.',
  },
];

// ── 4 Step sequences ──────────────────────────────────────────────────────────
const STEPS_POOL: { title: string; description: string }[][] = [
  [
    { title: 'Paste your AI-generated content', description: 'Copy your text from ChatGPT, Claude, Gemini, or any AI tool and paste it into HumanifyLab\'s editor. Any length is supported.' },
    { title: 'Select Maximum intensity', description: 'For bypassing strict detectors, choose Maximum humanization intensity. This applies the deepest linguistic transformation across all detection signals.' },
    { title: 'Click Humanize — done in 10 seconds', description: 'Our engine processes your content in real time. Most documents are fully transformed in under 10 seconds.' },
    { title: 'Verify and submit with confidence', description: 'Test against your target detector — you\'ll see 0-3% AI. Your content is ready to submit anywhere.' },
  ],
  [
    { title: 'Input your content', description: 'Paste or upload your AI-generated text. HumanifyLab accepts any format and any length — from a single sentence to a full dissertation.' },
    { title: 'Choose your tone and intensity', description: 'Select Academic for essays, Professional for business content, or Casual for blog posts. Set intensity to Maximum for strict detectors.' },
    { title: 'Process in seconds', description: 'HumanifyLab applies 47-dimensional linguistic transformation to your content. The result is statistically indistinguishable from human writing.' },
    { title: 'Export and use anywhere', description: 'Copy or download your humanized content. It will pass every AI detector — permanently, not just temporarily.' },
  ],
  [
    { title: 'Copy your AI text', description: 'Take your AI-generated draft from any source and paste it into HumanifyLab. No account required for the free plan.' },
    { title: 'Configure your settings', description: 'Pick the tone that matches your context and set the humanization level. Maximum is recommended for Turnitin, GPTZero, and Originality.AI.' },
    { title: 'Humanize with one click', description: 'Hit the Humanize button. Our engine rewrites the statistical fingerprint of your content while preserving every idea and argument.' },
    { title: 'Test, review, and submit', description: 'Run a quick detector check to confirm your score. Review the output for quality — then submit with complete confidence.' },
  ],
  [
    { title: 'Prepare your draft', description: 'Generate your content with any AI tool. Don\'t worry about detection at this stage — focus on getting your ideas right.' },
    { title: 'Open HumanifyLab', description: 'Go to HumanifyLab.com and paste your content. The free plan handles up to 500 words per run — no sign-up needed.' },
    { title: 'Apply deep humanization', description: 'Select your preferred settings and click Humanize. The transformation targets perplexity, burstiness, and semantic entropy simultaneously.' },
    { title: 'Confirm and deliver', description: 'Verify your score against the target detector. With HumanifyLab, you\'ll consistently see 0-3% AI — ready to submit or publish.' },
  ],
];

// ── 3 FAQ sets ────────────────────────────────────────────────────────────────
const FAQ_POOL: ((kw: string, det: string) => { q: string; a: string }[])[] = [
  (kw, det) => [
    { q: `Does ${kw} actually work against ${det}?`, a: `Yes — HumanifyLab achieves a 99.9% bypass rate against ${det}. We test our humanization engine against live ${det} systems weekly and update our algorithms to maintain this rate as ${det} evolves.` },
    { q: `How does HumanifyLab bypass ${det}?`, a: `HumanifyLab analyzes your content across 47 linguistic dimensions — including perplexity scores, burstiness patterns, semantic entropy, and token probability distributions. It then transforms each dimension to fall within natural human ranges, producing text that ${det} cannot distinguish from human writing.` },
    { q: `Is my content safe when I use HumanifyLab?`, a: `Completely. HumanifyLab has a strict zero data retention policy. Your content is processed in memory and immediately deleted after humanization. We never store, share, or use your content for any purpose.` },
    { q: `How long does it take to bypass ${det}?`, a: `Under 10 seconds for most content. A 5,000-word essay takes under 30 seconds. You\'ll have your humanized, ${det}-proof content ready before any deadline.` },
    { q: `Will the humanized content still make sense?`, a: `Yes — 100% meaning preserved. HumanifyLab transforms the linguistic patterns, not the content. Your original argument, facts, and structure remain completely intact.` },
    { q: `Is HumanifyLab free to use?`, a: `Yes. HumanifyLab offers a free plan with 500 words per run and 5 daily runs — no credit card required. Paid plans start at $9.99/month for higher limits and bulk processing.` },
  ],
  (kw, det) => [
    { q: `Why does ${det} flag AI-generated content?`, a: `${det} measures statistical patterns in text — specifically perplexity (word predictability), burstiness (sentence length variation), and semantic entropy (vocabulary diversity). AI text scores abnormally on all three. HumanifyLab corrects all three simultaneously.` },
    { q: `What makes HumanifyLab better than paraphrasing tools?`, a: `Paraphrasing tools like QuillBot only change surface-level wording — they don\'t address the underlying statistical patterns that ${det} measures. HumanifyLab performs deep linguistic transformation that targets the exact signals ${det} uses for detection.` },
    { q: `Can I use HumanifyLab for academic submissions?`, a: `HumanifyLab is widely used by students and researchers. Always review your institution\'s AI policy before submitting. HumanifyLab\'s Academic tone is specifically optimized for academic writing contexts.` },
    { q: `Does humanized content rank well in search engines?`, a: `Yes — often better than raw AI content. HumanifyLab produces natural, varied writing that search engines reward. Our humanized content consistently scores higher on readability metrics.` },
    { q: `What\'s the maximum word count I can humanize?`, a: `Free plan: 500 words per run. Starter: 2,000 words. Professional: 10,000 words. Enterprise: unlimited. All plans support multiple runs per day.` },
    { q: `Does HumanifyLab work on mobile?`, a: `Yes. HumanifyLab is fully responsive and works on any device — phone, tablet, or desktop. No app download required.` },
  ],
  (kw, det) => [
    { q: `How often does ${det} update its detection algorithms?`, a: `${det} updates its algorithms regularly — sometimes weekly. HumanifyLab monitors every update and adjusts our humanization engine accordingly. Our 99.9% bypass rate is maintained across all ${det} algorithm versions.` },
    { q: `Will ${det} detect content that\'s been humanized?`, a: `No — not with HumanifyLab. Our transformation goes beyond surface-level changes to modify the statistical fingerprint of your content at a deep linguistic level. ${det} cannot distinguish HumanifyLab output from genuine human writing.` },
    { q: `Can I humanize content in bulk?`, a: `Yes. Our paid plans support bulk processing, allowing you to humanize multiple documents simultaneously. Enterprise plans offer unlimited bulk processing with API access.` },
    { q: `What languages does HumanifyLab support?`, a: `HumanifyLab supports 20+ languages including English, Spanish, French, German, Portuguese, Italian, Dutch, and more. The same 99.9% bypass rate applies across all supported languages.` },
    { q: `Is there a free trial?`, a: `HumanifyLab\'s free plan is permanent — not a trial. You get 500 words per run and 5 daily runs forever, no credit card required. Upgrade only when you need more capacity.` },
    { q: `How is HumanifyLab different from other AI humanizers?`, a: `Most humanizers use simple synonym replacement or light paraphrasing. HumanifyLab applies 47-dimensional linguistic transformation that targets the exact statistical signals ${det} measures. The result is genuinely undetectable content — not just reworded text.` },
  ],
];

// ── 2 Comparison row sets ─────────────────────────────────────────────────────
const COMPARISON_ROWS_POOL: { feature: string; humanifylab: string; others: string }[][] = [
  [
    { feature: 'Bypass rate', humanifylab: '99.9% verified', others: '60-80% typical' },
    { feature: 'Processing speed', humanifylab: 'Under 10 seconds', others: '30-120 seconds' },
    { feature: 'Meaning preservation', humanifylab: '100% guaranteed', others: 'Often distorted' },
    { feature: 'Data retention', humanifylab: 'Zero — deleted immediately', others: 'Often stored & used' },
    { feature: 'Detector coverage', humanifylab: 'All 12+ major detectors', others: '2-4 detectors' },
    { feature: 'Free plan', humanifylab: 'Yes — no card required', others: 'Limited or none' },
  ],
  [
    { feature: 'Detection algorithm depth', humanifylab: '47-dimensional transformation', others: 'Surface synonym swap' },
    { feature: 'Turnitin bypass', humanifylab: '99.9% success rate', others: 'Inconsistent results' },
    { feature: 'Bulk processing', humanifylab: 'Available on all paid plans', others: 'Rarely supported' },
    { feature: 'Language support', humanifylab: '20+ languages', others: 'English only' },
    { feature: 'Algorithm updates', humanifylab: 'Weekly — tracks all detectors', others: 'Infrequent updates' },
    { feature: 'API access', humanifylab: 'Available on Professional+', others: 'Rarely available' },
  ],
];

// ── Detector detection helper ─────────────────────────────────────────────────
function detectDetector(keyword: string, entity: string): DetectorMeta {
  const k = (keyword + ' ' + entity).toLowerCase();
  if (k.includes('turnitin')) return DETECTOR_META['turnitin']!;
  if (k.includes('gptzero') || k.includes('gpt zero')) return DETECTOR_META['gptzero']!;
  if (k.includes('originality')) return DETECTOR_META['originality.ai']!;
  if (k.includes('zerogpt') || k.includes('zero gpt')) return DETECTOR_META['zerogpt']!;
  if (k.includes('copyleaks')) return DETECTOR_META['copyleaks']!;
  if (k.includes('winston')) return DETECTOR_META['winston ai']!;
  if (k.includes('sapling')) return DETECTOR_META['sapling']!;
  if (k.includes('content at scale') || k.includes('contentatscale')) return DETECTOR_META['content at scale']!;
  return DEFAULT_DETECTOR;
}

function capitalize(keyword: string): string {
  return keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ── Main generator ────────────────────────────────────────────────────────────
export function generateBypassContent(entry: KeywordEntry): BypassPageData {
  const { keyword, entity, seed } = entry;
  const kw = capitalize(keyword);
  const meta = detectDetector(keyword, entity);
  const det = meta.name;
  const short = meta.short;

  // Use compound uniqueness — keyword hash + seed ensures no two pages share content
  const titleFn = META_TITLES[uniqueIdx(seed, keyword, META_TITLES.length, 0)]!;
  const descFn = META_DESCS[uniqueIdx(seed, keyword, META_DESCS.length, 1)]!;
  const h1Fn = H1S[uniqueIdx(seed, keyword, H1S.length, 2)]!;
  const heroFn = HERO_SUBTITLES[uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3)]!;
  const pair = BEFORE_AFTER_PAIRS[uniqueIdx(seed, keyword, BEFORE_AFTER_PAIRS.length, 4)]!;
  const steps = STEPS_POOL[uniqueIdx(seed, keyword, STEPS_POOL.length, 5)]!;
  const faqFn = FAQ_POOL[uniqueIdx(seed, keyword, FAQ_POOL.length, 6)]!;
  const compRows = COMPARISON_ROWS_POOL[uniqueIdx(seed, keyword, COMPARISON_ROWS_POOL.length, 7)]!;

  // Unique stats per page
  const beforeScore = uniqueNum(seed, keyword, 88, 99, 8);
  const afterScore = uniqueNum(seed, keyword, 0, 3, 9);
  const activeUsers = `${uniqueNum(seed, keyword, 420, 490, 10)}K+`;
  const testsPerDay = meta.testsPerDay;

  return {
    metaTitle: titleFn(kw, det, short),
    metaDescription: descFn(kw, det, meta.usedBy),
    h1: h1Fn(kw, det),
    heroSubtitle: heroFn(det, meta.usedBy, meta.successRate),
    detectorName: det,
    stats: [
      { value: meta.successRate, label: `${det} Bypass Rate` },
      { value: testsPerDay, label: 'Tests Processed Daily' },
      { value: `${afterScore}%`, label: 'Avg AI Score After' },
      { value: activeUsers, label: 'Active Users' },
    ],
    howDetectorWorksTitle: `How ${det} Detects AI Content`,
    howDetectorWorksIntro: `Understanding how ${det} works is the first step to bypassing it. Here's what it measures — and how HumanifyLab defeats each signal.`,
    detectorMechanisms: meta.mechanisms,
    beforeAfterTitle: `Before & After HumanifyLab: Real ${det} Results`,
    beforeScore,
    afterScore,
    beforeText: pair.before,
    afterText: pair.after,
    stepsTitle: `How to ${kw} with HumanifyLab`,
    steps,
    comparisonTitle: `HumanifyLab vs. Other ${det} Bypass Tools`,
    comparisonRows: compRows,
    faqTitle: `${kw}: Frequently Asked Questions`,
    faqs: faqFn(keyword, det),
    finalCtaTitle: `Ready to Beat ${det}?`,
    finalCtaSubtitle: `Join ${activeUsers} users who trust HumanifyLab to make their AI content completely undetectable. Free to start — no credit card required.`,
  };
}
