import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats, buildFeaturePoints } from '~/lib/content/content-combinator';

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

const META_TITLES: ((kw: string, det: string, tool: string) => string)[] = [
  (kw, det, tool) => `Does ${det} Detect ${tool}? Yes — Here's How to Fix It | HumanifyLab`,
  (kw, det, tool) => `${kw}: The Answer + How to Bypass ${det} | HumanifyLab`,
  (kw, det, tool) => `Can ${det} Detect ${tool}? Yes — Beat It with HumanifyLab`,
  (kw, det, tool) => `${kw} — ${det} Detection Explained & Bypassed | HumanifyLab`,
  (kw, det, tool) => `${det} Detects ${tool}: How to Make It Undetectable | HumanifyLab`,
  (kw, det, tool) => `${kw}: Beat ${det}'s ${tool} Detection | HumanifyLab`,
  (kw, det, tool) => `${det} vs ${tool}: How Detection Works & How to Bypass It`,
  (kw, det, tool) => `${kw} — 99.9% ${det} Bypass for ${tool} Content | HumanifyLab`,
];

const META_DESCS: ((kw: string, det: string, tool: string) => string)[] = [
  (kw, det, tool) => `${kw}: yes, ${det} detects ${tool} content. HumanifyLab bypasses ${det} with 99.9% success rate. Free plan, no sign-up, results in under 10 seconds.`,
  (kw, det, tool) => `${kw} — ${det} can detect ${tool} output. HumanifyLab transforms ${tool} content to bypass ${det} with 99.9% accuracy. Free to start, no card needed.`,
  (kw, det, tool) => `${kw}: ${det} detects ${tool} using perplexity and burstiness analysis. HumanifyLab defeats both signals with 99.9% bypass rate. Try free today.`,
  (kw, det, tool) => `${kw} — can ${det} detect ${tool}? Yes. HumanifyLab bypasses ${det} for ${tool} content with 99.9% success. Free plan, zero data stored.`,
  (kw, det, tool) => `${kw}: ${det} flags ${tool} content. HumanifyLab makes ${tool} output undetectable to ${det} with 99.9% bypass rate. Free, instant, no sign-up.`,
  (kw, det, tool) => `${kw} — ${det} detects ${tool}. HumanifyLab's 47-dimensional transformation bypasses ${det} with 99.9% accuracy. Free plan available today.`,
  (kw, det, tool) => `${kw}: yes, ${det} detects ${tool}. Fix it with HumanifyLab — 99.9% bypass rate, free plan, no credit card. Results in under 10 seconds.`,
  (kw, det, tool) => `${kw} — ${det} detection of ${tool} content explained. HumanifyLab bypasses it with 99.9% success. Free to start, meaning preserved.`,
];

const H1S: ((kw: string, det: string, tool: string) => string)[] = [
  (kw, det, tool) => `Does ${det} Detect ${tool}? Yes — Here's How to Fix It`,
  (kw, det, tool) => `${kw}: Beat ${det}'s ${tool} Detection`,
  (kw, det, tool) => `Can ${det} Detect ${tool}? The Answer + Solution`,
  (kw, det, tool) => `${det} Detects ${tool}: Make It Undetectable`,
  (kw, det, tool) => `${kw} — ${det} Detection Explained & Bypassed`,
  (kw, det, tool) => `${det} vs ${tool}: How to Win`,
  (kw, det, tool) => `${kw}: 99.9% ${det} Bypass for ${tool} Content`,
  (kw, det, tool) => `${det} Flags ${tool}? HumanifyLab Fixes It`,
];

const HERO_SUBTITLES: ((det: string, tool: string) => string)[] = [
  (det, tool) => `Yes — ${det} detects ${tool} content. It measures perplexity, burstiness, and semantic entropy to identify AI-generated text. HumanifyLab targets all three signals simultaneously, achieving a 99.9% bypass rate against ${det}. Free plan, no sign-up, results in under 10 seconds.`,
  (det, tool) => `${det} is specifically trained to detect ${tool} output. The good news: HumanifyLab's 47-dimensional transformation defeats ${det}'s detection algorithms with a 99.9% bypass rate. Paste your ${tool} content, click Humanize, get 0% AI score.`,
  (det, tool) => `If ${det} is flagging your ${tool} content, you need HumanifyLab. Our deep linguistic transformation targets the exact statistical patterns ${det} measures — perplexity, burstiness, token probability — and brings them all into the human range. 99.9% bypass rate, verified weekly.`,
  (det, tool) => `${det} detects ${tool} by analyzing statistical patterns in your text. HumanifyLab disrupts those patterns completely, producing output that ${det} cannot distinguish from human writing. 99.9% bypass rate, free plan, zero data stored.`,
];

const ANSWERS: string[] = [
  'Yes — and it\'s getting better at it. But HumanifyLab bypasses it with 99.9% success.',
  'Yes. But HumanifyLab\'s 47-dimensional transformation defeats the detection completely.',
  'Yes, with high accuracy. HumanifyLab is the solution — 99.9% bypass rate, verified weekly.',
  'Yes. The detection is real. So is HumanifyLab\'s 99.9% bypass rate.',
];

const HOW_IT_WORKS_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '📊', title: 'Perplexity Analysis', description: 'AI detectors measure how predictable each word choice is. AI text scores abnormally low. HumanifyLab raises perplexity to human range.' },
    { icon: '📏', title: 'Burstiness Detection', description: 'AI produces uniform sentence lengths. Detectors flag this pattern. HumanifyLab introduces natural variation that matches human writing.' },
    { icon: '🧬', title: 'Semantic Fingerprinting', description: 'Detectors map semantic patterns against known AI model outputs. HumanifyLab disrupts this mapping completely.' },
    { icon: '🔬', title: 'Token Probability Scoring', description: 'Detectors analyze token probability distributions. HumanifyLab redistributes these into human norms.' },
  ],
  [
    { icon: '🎯', title: 'Statistical Pattern Analysis', description: 'AI detectors measure statistical patterns across your text. HumanifyLab transforms all patterns simultaneously to match human writing profiles.' },
    { icon: '🔍', title: 'Vocabulary Distribution', description: 'Detectors check for unnaturally consistent vocabulary. HumanifyLab diversifies word choice to match natural human distribution.' },
    { icon: '📡', title: 'Sentence Entropy', description: 'Detectors measure entropy across sentence boundaries. HumanifyLab introduces authentic entropy variation that mirrors human authorship.' },
    { icon: '🧮', title: 'Coherence Scoring', description: 'Detectors check for unnaturally perfect logical flow. HumanifyLab introduces natural human-like transitions and imperfections.' },
  ],
];

const FAQ_POOL: ((kw: string, det: string, tool: string) => { q: string; a: string }[])[] = [
  (kw, det, tool) => [
    { q: `Does ${det} detect ${tool} content?`, a: `Yes. ${det} is specifically trained to detect ${tool} output using perplexity analysis, burstiness detection, and semantic fingerprinting. HumanifyLab bypasses all three detection methods with a 99.9% success rate.` },
    { q: `How does HumanifyLab bypass ${det} for ${tool} content?`, a: `HumanifyLab analyzes your ${tool} content across 47 linguistic dimensions and transforms each one to fall within natural human ranges. This defeats ${det}'s detection algorithms completely, achieving a 99.9% bypass rate.` },
    { q: `Is it safe to use HumanifyLab to bypass ${det}?`, a: `HumanifyLab has a strict zero data retention policy. Your content is processed and immediately deleted. We never store, share, or use your text. The tool is completely safe to use.` },
    { q: `How long does it take to make ${tool} content undetectable to ${det}?`, a: `Under 10 seconds for most content. Paste your ${tool} output into HumanifyLab, click Humanize, and get ${det}-proof content in seconds. No sign-up required.` },
    { q: `Will ${det} detect my content after using HumanifyLab?`, a: `No. HumanifyLab's transformation is permanent. Your humanized content will not be flagged by ${det} even on re-scan. The bypass is not temporary — it's a complete transformation.` },
  ],
  (kw, det, tool) => [
    { q: `Why does ${det} flag ${tool} content?`, a: `${det} measures statistical patterns in text — specifically perplexity (word predictability), burstiness (sentence length variation), and semantic entropy. ${tool} output scores abnormally on all three. HumanifyLab corrects all three simultaneously.` },
    { q: `What's the best way to bypass ${det} for ${tool} content?`, a: `HumanifyLab is the most effective solution. It achieves a 99.9% bypass rate against ${det}, verified weekly against live systems. Paste your ${tool} content, click Humanize, get 0% AI score.` },
    { q: `Does HumanifyLab preserve the meaning of my ${tool} content?`, a: `Yes — 100%. HumanifyLab transforms the linguistic patterns, not the content. Your original argument, facts, and structure remain completely intact after humanization.` },
    { q: `Is HumanifyLab free for bypassing ${det}?`, a: `Yes. HumanifyLab's free plan gives you 500 words per run with no sign-up and no credit card required. The free plan achieves the same 99.9% ${det} bypass rate as paid plans.` },
    { q: `How often does ${det} update its detection algorithms?`, a: `${det} updates regularly — sometimes weekly. HumanifyLab monitors every update and adjusts our humanization engine accordingly. Our 99.9% bypass rate is maintained across all ${det} algorithm versions.` },
  ],
];

export function generateDetectionContent(entry: KeywordEntryV4): DetectionPageData {
  const { keyword, entity, seed } = entry;
  const parts = keyword.toLowerCase().split(' ');
  const detectors = ['turnitin', 'gptzero', 'originality', 'zerogpt', 'copyleaks', 'winston', 'sapling', 'scribbr'];
  const tools = ['chatgpt', 'gpt-4', 'gpt-4o', 'claude', 'gemini', 'llama', 'mistral', 'copilot', 'grok', 'bard'];
  const detector = detectors.find(d => parts.some(p => p.includes(d))) ?? 'Turnitin';
  const aiTool = tools.find(t => parts.some(p => p.includes(t))) ?? 'ChatGPT';
  const detectorDisplay = detector.charAt(0).toUpperCase() + detector.slice(1);
  const toolDisplay = aiTool.charAt(0).toUpperCase() + aiTool.slice(1);

  const combo = buildPageStrings(keyword, seed, entity, 'detection');
  const ti = uniqueIdx(seed, keyword, META_TITLES.length, 0);
  const di = uniqueIdx(seed, keyword, META_DESCS.length, 1);
  const hi = uniqueIdx(seed, keyword, H1S.length, 2);
  const hsi = uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3);
  const ai = uniqueIdx(seed, keyword, ANSWERS.length, 4);
  const hwi = uniqueIdx(seed, keyword, HOW_IT_WORKS_POOL.length, 5);
  const fqi = uniqueIdx(seed, keyword, FAQ_POOL.length, 6);

  return {
    metaTitle: META_TITLES[ti]!(keyword, detectorDisplay, toolDisplay),
    metaDescription: META_DESCS[di]!(keyword, detectorDisplay, toolDisplay),
    h1: H1S[hi]!(keyword, detectorDisplay, toolDisplay),
    heroSubtitle: HERO_SUBTITLES[hsi]!(detectorDisplay, toolDisplay),
    badge: combo.badge,
    detector: detectorDisplay,
    aiTool: toolDisplay,
    answer: ANSWERS[ai]!,
    howItWorks: HOW_IT_WORKS_POOL[hwi]!,
    stats: buildStats(keyword, seed),
    faqs: FAQ_POOL[fqi]!(keyword, detectorDisplay, toolDisplay),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
