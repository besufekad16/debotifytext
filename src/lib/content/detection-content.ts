import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats } from '~/lib/content/content-combinator';

export interface DetectionPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  detector: string;
  aiTool: string;
  answer: string;
  howItWorks: { icon: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const DETECTORS_META: Record<string, { name: string; usedBy: string }> = {
  turnitin: { name: 'Turnitin', usedBy: 'universities and colleges' },
  gptzero: { name: 'GPTZero', usedBy: 'educators and institutions' },
  'originality.ai': { name: 'Originality.AI', usedBy: 'publishers and agencies' },
  zerogpt: { name: 'ZeroGPT', usedBy: 'teachers and content teams' },
  copyleaks: { name: 'Copyleaks', usedBy: 'enterprises and LMS platforms' },
  'winston ai': { name: 'Winston AI', usedBy: 'media companies and publishers' },
  sapling: { name: 'Sapling', usedBy: 'HR teams and recruiters' },
  'content at scale': { name: 'Content at Scale', usedBy: 'SEO agencies and bloggers' },
};

const META_TITLES: ((kw: string, det: string, tool: string) => string)[] = [
  (kw, det, tool) => `Does ${det} Detect ${tool}? Full Answer + How to Bypass | HumanifyLab`,
  (kw, det, tool) => `${kw}: Yes — And Here's How to Fix It | HumanifyLab`,
  (kw, det, tool) => `Can ${det} Detect ${tool} Text? 2026 Answer | HumanifyLab`,
  (kw, det, tool) => `${kw} — The Answer + 99.9% Bypass Solution`,
  (kw, det, tool) => `${det} ${tool} Detection: What You Need to Know | HumanifyLab`,
  (kw, det, tool) => `${kw}: How to Make ${tool} Undetectable on ${det}`,
  (kw, det, tool) => `${tool} Detected by ${det}? Here's the Fix | HumanifyLab`,
  (kw, det, tool) => `${kw} — Bypass ${det} ${tool} Detection in Seconds`,
];

const META_DESCS: ((kw: string, det: string, tool: string) => string)[] = [
  (kw, det, tool) => `${kw}: yes, ${det} detects ${tool} text. But HumanifyLab bypasses ${det} with 99.9% success. Free plan, no sign-up, results in under 10 seconds.`,
  (kw, det, tool) => `${kw} — ${det} can detect ${tool} output. HumanifyLab makes ${tool} text undetectable on ${det} with 99.9% bypass rate. Try free today.`,
  (kw, det, tool) => `${kw}: ${det} detects ${tool} using perplexity and burstiness analysis. HumanifyLab defeats both signals with 99.9% bypass rate. Free plan available.`,
  (kw, det, tool) => `${kw} — yes, ${det} detects ${tool}. The fix: HumanifyLab's 47-dimensional transformation makes ${tool} text undetectable. 99.9% bypass rate.`,
  (kw, det, tool) => `${kw}: ${det} flags ${tool} content. HumanifyLab bypasses ${det} with 99.9% success. Zero data stored. Free plan, no card needed.`,
  (kw, det, tool) => `${kw} — ${det} detects ${tool} text. HumanifyLab makes it undetectable with 99.9% bypass rate. 450,000+ users trust HumanifyLab. Try free.`,
  (kw, det, tool) => `${kw}: ${det} can detect ${tool} output. HumanifyLab bypasses ${det} detection with 99.9% accuracy. Free plan, instant results, zero data stored.`,
  (kw, det, tool) => `${kw} — ${det} detects ${tool}. HumanifyLab's deep transformation makes ${tool} text pass ${det} with 99.9% success. Start free today.`,
];

const H1S: ((kw: string, det: string, tool: string) => string)[] = [
  (kw, det, tool) => `Does ${det} Detect ${tool}? Yes — Here's the Fix`,
  (kw, det, tool) => `${kw}: The Answer + How to Bypass ${det}`,
  (kw, det, tool) => `Can ${det} Detect ${tool} Text? (2026 Answer)`,
  (kw, det, tool) => `${tool} Detected by ${det}? Make It Undetectable`,
  (kw, det, tool) => `${kw} — How to Pass ${det} with ${tool} Content`,
  (kw, det, tool) => `${det} ${tool} Detection: What It Means & How to Fix It`,
  (kw, det, tool) => `${kw}: Bypass ${det} ${tool} Detection in Seconds`,
  (kw, det, tool) => `${tool} on ${det}: Why It Gets Flagged & How to Fix It`,
];

const ANSWERS: ((det: string, tool: string) => string)[] = [
  (det, tool) => `Yes — ${det} detects ${tool} text with high accuracy. ${det} uses perplexity analysis, burstiness detection, and semantic fingerprinting to identify AI-generated content. ${tool} output scores abnormally low on all three metrics. HumanifyLab corrects all three simultaneously, achieving a 99.9% bypass rate against ${det}.`,
  (det, tool) => `Yes. ${det} is specifically trained to detect ${tool} output. It measures the statistical patterns that ${tool} produces — including unnaturally low perplexity, uniform sentence lengths, and predictable vocabulary. HumanifyLab's 47-dimensional transformation addresses every one of these signals, making ${tool} text undetectable on ${det}.`,
  (det, tool) => `${det} can detect ${tool} text with 95-99% accuracy in its current form. The detection works by measuring how "predictable" each word choice is — ${tool} text is far more predictable than human writing. HumanifyLab introduces authentic unpredictability that matches human writing profiles, achieving a 99.9% bypass rate against ${det}.`,
];

const HOW_IT_WORKS_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '📊', title: 'Perplexity Analysis', description: 'AI detectors measure how predictable each word choice is. AI text scores abnormally low. HumanifyLab raises perplexity to human range.' },
    { icon: '📏', title: 'Burstiness Detection', description: 'AI produces uniform sentence lengths. Detectors flag this pattern. HumanifyLab introduces natural variation that matches human writing.' },
    { icon: '🧬', title: 'Semantic Fingerprinting', description: 'Detectors map semantic patterns against known AI model outputs. HumanifyLab disrupts this mapping completely.' },
    { icon: '🎯', title: 'Token Probability Scoring', description: 'Detectors analyze token probability distributions. HumanifyLab redistributes these into human norms.' },
  ],
  [
    { icon: '🔬', title: 'Statistical Pattern Analysis', description: 'AI detectors measure statistical patterns across the entire document. HumanifyLab transforms every pattern simultaneously.' },
    { icon: '🧮', title: 'Entropy Measurement', description: 'AI text has unnaturally low entropy. HumanifyLab introduces authentic variation that matches human writing profiles.' },
    { icon: '📡', title: 'Sentence-Level Scoring', description: 'Detectors score each sentence individually. HumanifyLab ensures every sentence falls within human statistical ranges.' },
    { icon: '🔍', title: 'Vocabulary Distribution', description: 'AI text has unnaturally consistent vocabulary. HumanifyLab diversifies word choice to match human writing patterns.' },
  ],
];

const FAQ_POOL: ((kw: string, det: string, tool: string) => { q: string; a: string }[])[] = [
  (kw, det, tool) => [
    { q: `Does ${det} detect ${tool}?`, a: `Yes. ${det} detects ${tool} text with high accuracy using perplexity analysis, burstiness detection, and semantic fingerprinting. HumanifyLab bypasses all three detection methods with a 99.9% success rate.` },
    { q: `How does ${det} detect ${tool} text?`, a: `${det} measures statistical patterns in text — specifically perplexity (word predictability), burstiness (sentence length variation), and semantic entropy. ${tool} text scores abnormally on all three. HumanifyLab corrects all three simultaneously.` },
    { q: `How do I make ${tool} text undetectable on ${det}?`, a: `Use HumanifyLab. Paste your ${tool} text, click Humanize, and get 0-3% AI score on ${det} in under 10 seconds. HumanifyLab achieves a 99.9% bypass rate against ${det}, verified weekly.` },
    { q: `Is HumanifyLab free for bypassing ${det}?`, a: `Yes. HumanifyLab's free plan handles up to 500 words per run with no credit card or sign-up required. The same 99.9% bypass rate applies on the free plan.` },
    { q: `Will ${det} detect my content after using HumanifyLab?`, a: `No. HumanifyLab's transformation is permanent. Your humanized content will not be re-flagged by ${det} on future scans.` },
    { q: `How often does HumanifyLab update to stay ahead of ${det}?`, a: `HumanifyLab is updated weekly to monitor ${det} algorithm changes and maintain the 99.9% bypass rate. As ${det} evolves, so does HumanifyLab.` },
  ],
];

export function generateDetectionContent(entry: KeywordEntryV4): DetectionPageData {
  const { keyword, entity, seed } = entry;
  const capitalizedKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const combo = buildPageStrings(capitalizedKeyword, seed, entity, 'detection');

  // Extract detector and AI tool from keyword
  const kl = keyword.toLowerCase();
  let detector = 'Turnitin';
  let aiTool = 'ChatGPT';

  const detectorKeys = Object.keys(DETECTORS_META);
  for (const dk of detectorKeys) {
    if (kl.includes(dk)) { detector = DETECTORS_META[dk]!.name; break; }
  }
  const aiTools = ['chatgpt', 'gpt-4', 'gpt-4o', 'claude', 'gemini', 'llama', 'mistral', 'copilot', 'perplexity', 'grok', 'bard'];
  for (const t of aiTools) {
    if (kl.includes(t)) { aiTool = t.charAt(0).toUpperCase() + t.slice(1); break; }
  }

  return {
    metaTitle: META_TITLES[uniqueIdx(seed, keyword, META_TITLES.length, 0)]!(capitalizedKeyword, detector, aiTool),
    metaDescription: META_DESCS[uniqueIdx(seed, keyword, META_DESCS.length, 1)]!(capitalizedKeyword, detector, aiTool),
    h1: H1S[uniqueIdx(seed, keyword, H1S.length, 2)]!(capitalizedKeyword, detector, aiTool),
    heroSubtitle: `${detector} is used by ${DETECTORS_META[detector.toLowerCase()]?.usedBy ?? 'institutions worldwide'} to flag AI-generated content. It detects ${aiTool} text with high accuracy. HumanifyLab defeats ${detector} with a 99.9% bypass rate — transforming your ${aiTool} content into authentic human writing in under 10 seconds.`,
    badge: combo.badge,
    detector,
    aiTool,
    answer: ANSWERS[uniqueIdx(seed, keyword, ANSWERS.length, 3)]!(detector, aiTool),
    howItWorks: HOW_IT_WORKS_POOL[uniqueIdx(seed, keyword, HOW_IT_WORKS_POOL.length, 4)]!,
    stats: buildStats(keyword, seed),
    faqs: FAQ_POOL[uniqueIdx(seed, keyword, FAQ_POOL.length, 5)]!(keyword, detector, aiTool),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
