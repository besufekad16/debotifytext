import type { KeywordEntryV3 } from '~/lib/pseo-data-v3';
import { uniqueIdx, uniqueNum } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildSteps, buildStats } from '~/lib/content/content-combinator';

export interface ScoreContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  stats: { value: string; label: string }[];
  scoreTitle: string;
  scorePoints: { icon: string; title: string; description: string }[];
  stepsTitle: string;
  steps: { number: string; title: string; description: string }[];
  detectorScoresTitle: string;
  detectorScores: { detector: string; before: string; after: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const TITLES = [
  (kw: string) => `${kw} — Get 0% AI Score | HumanifyLab`,
  (kw: string) => `${kw}: Reduce to Zero Instantly | HumanifyLab 2026`,
  (kw: string) => `${kw} — AI Score Reducer | HumanifyLab`,
  (kw: string) => `${kw}: 0% AI Detection Guaranteed | HumanifyLab`,
  (kw: string) => `${kw} — Eliminate AI Flags | HumanifyLab`,
  (kw: string) => `${kw}: The Proven Score Reducer | HumanifyLab`,
  (kw: string) => `${kw} — Drop to 0% in Seconds | HumanifyLab`,
  (kw: string) => `${kw}: Deep Transformation, Zero Detection | HumanifyLab`,
  (kw: string) => `${kw} — Verified 0% AI Score | HumanifyLab`,
  (kw: string) => `${kw}: Score Reducer That Actually Works | HumanifyLab`,
  (kw: string) => `${kw} — Pass Every Detector | HumanifyLab`,
  (kw: string) => `${kw}: From 100% to 0% AI Score | HumanifyLab`,
];

const DESCRIPTIONS = [
  (kw: string) => `${kw} with HumanifyLab. Reduce your AI score to 0% across Turnitin, GPTZero, and Originality.AI in under 10 seconds. Free to try.`,
  (kw: string) => `Need to ${kw}? HumanifyLab achieves a 99.9% bypass rate — reducing AI scores to 0-3% on every major detector. Free plan available.`,
  (kw: string) => `${kw}: HumanifyLab is the proven AI score reducer. Get 0% on Turnitin, GPTZero, Originality.AI, and more. Instant results, no sign-up.`,
  (kw: string) => `${kw} — HumanifyLab reduces AI detection scores to zero. Tested on 10,000+ documents. 99.9% success rate. Free to try today.`,
  (kw: string) => `The fastest way to ${kw}. HumanifyLab transforms AI writing patterns in under 10 seconds. 0% AI score guaranteed. No sign-up needed.`,
  (kw: string) => `${kw}: HumanifyLab's deep linguistic transformation eliminates AI flags completely. 99.9% bypass rate, free plan, instant results.`,
  (kw: string) => `${kw} with HumanifyLab — the only tool that consistently achieves 0-3% AI scores. Verified weekly. Free plan, no credit card needed.`,
  (kw: string) => `${kw}: HumanifyLab targets perplexity, burstiness, and semantic entropy simultaneously. 0% AI score in under 10 seconds. Try free.`,
  (kw: string) => `Stop failing AI detection. ${kw} with HumanifyLab — 99.9% bypass rate, instant results, zero data stored. Free to start today.`,
  (kw: string) => `${kw} — HumanifyLab has helped 450,000+ users achieve 0% AI scores. Deep transformation, meaning preserved. Free plan available.`,
  (kw: string) => `${kw}: Get from 100% AI to 0% in under 10 seconds with HumanifyLab. Passes Turnitin, GPTZero, Originality.AI. No sign-up needed.`,
  (kw: string) => `${kw} — HumanifyLab is the most reliable AI score reducer in 2026. 99.9% bypass rate, 50+ languages, free plan. Try now.`,
];

const H1S = [
  (kw: string) => `${kw}: Get to 0% in Under 10 Seconds`,
  (kw: string) => `${kw} — The Proven AI Score Reducer`,
  (kw: string) => `${kw}: Eliminate Every AI Flag`,
  (kw: string) => `${kw} — 0% AI Score Guaranteed`,
  (kw: string) => `${kw}: Deep Transformation, Zero Detection`,
  (kw: string) => `${kw} — Reduce to Zero Instantly`,
  (kw: string) => `${kw}: From 100% AI to 0% in Seconds`,
  (kw: string) => `${kw} — The Score Reducer That Works`,
  (kw: string) => `${kw}: Verified 0% AI Score Every Time`,
  (kw: string) => `${kw} — Pass Every Detector`,
  (kw: string) => `${kw}: The Fastest AI Score Fix`,
  (kw: string) => `${kw} — Permanently Eliminate AI Flags`,
];

const HERO_SUBTITLES = [
  'Deep linguistic transformation that reduces AI scores to 0-3% on every major detector. Verified weekly.',
  'From 100% AI to 0% in under 10 seconds. HumanifyLab targets the exact patterns detectors measure.',
  'The most reliable AI score reducer in 2026. 99.9% bypass rate, zero data stored, free to start.',
  'HumanifyLab eliminates AI scores permanently — not temporarily. Tested on 10,000+ documents.',
  'Trusted by 450,000+ users to achieve 0% AI scores. Free plan, instant results, no sign-up required.',
  'Stop failing AI detection. HumanifyLab reduces your score to 0-3% in seconds — guaranteed.',
  '99.9% bypass rate across Turnitin, GPTZero, Originality.AI, and all major detectors. Free to try.',
  'The only AI score reducer that targets perplexity, burstiness, and semantic entropy simultaneously.',
];

const SCORE_POINT_SETS = [
  [
    { icon: '🎯', title: 'Target 0% AI Score', description: 'HumanifyLab is specifically designed to reduce AI scores to 0-3% on every major detector. Not just lower — eliminated.' },
    { icon: '🔬', title: 'Deep Pattern Analysis', description: 'AI detectors measure perplexity, burstiness, and semantic entropy. HumanifyLab corrects all three simultaneously for a complete score reduction.' },
    { icon: '✅', title: 'Verified Weekly', description: 'We test HumanifyLab against live detection systems every week. Our 99.9% bypass rate is maintained as detectors update their algorithms.' },
    { icon: '⚡', title: 'Instant Score Drop', description: 'From 100% AI to 0-3% in under 10 seconds. The fastest and most reliable AI score reducer available.' },
    { icon: '🔒', title: 'Permanent Reduction', description: 'The score reduction is permanent. Humanized content will continue to score 0-3% indefinitely — not a temporary fix.' },
    { icon: '🌍', title: 'All Detectors Covered', description: 'Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks, Winston AI, Sapling — all covered with a 99.9% bypass rate.' },
  ],
  [
    { icon: '📊', title: 'Perplexity Correction', description: 'AI text has abnormally low perplexity — words are too predictable. HumanifyLab raises perplexity to human range, eliminating this detection signal.' },
    { icon: '📏', title: 'Burstiness Restoration', description: 'AI produces uniform sentence lengths. HumanifyLab introduces natural variation in sentence structure, defeating burstiness-based detection.' },
    { icon: '🧬', title: 'Semantic Entropy Boost', description: 'AI text has low semantic entropy — vocabulary is too consistent. HumanifyLab diversifies vocabulary patterns to match human writing profiles.' },
    { icon: '🔄', title: 'Multi-Detector Targeting', description: 'Different detectors use different algorithms. HumanifyLab\'s transformation defeats all of them simultaneously in a single pass.' },
    { icon: '📈', title: 'Score Verification', description: 'After humanization, test your content on any detector. You\'ll consistently see 0-3% AI — a dramatic improvement from the original score.' },
    { icon: '🏆', title: 'Industry-Leading Results', description: 'HumanifyLab achieves the highest bypass rate in the industry — 99.9% across all major AI detectors. No other tool comes close.' },
  ],
  [
    { icon: '🚀', title: 'Instant Processing', description: 'HumanifyLab reduces AI scores in under 10 seconds. Even a 10,000-word document is processed in under a minute.' },
    { icon: '💡', title: 'Smart Transformation', description: 'HumanifyLab doesn\'t just replace synonyms — it restructures the statistical fingerprint of your content at a deep linguistic level.' },
    { icon: '🎓', title: 'Academic Score Reduction', description: 'Specifically optimized for academic content. HumanifyLab\'s Academic tone achieves 0-3% on Turnitin and GPTZero consistently.' },
    { icon: '💼', title: 'Professional Score Reduction', description: 'Professional tone preset achieves 0-3% on detectors used by publishers, agencies, and corporate review systems.' },
    { icon: '🌐', title: 'Multilingual Score Reduction', description: 'HumanifyLab reduces AI scores in 50+ languages. The same 99.9% bypass rate applies to non-English content.' },
    { icon: '🔐', title: 'Private Processing', description: 'Your content is never stored. Zero data retention means your sensitive documents are completely safe during score reduction.' },
  ],
];

const STEP_SETS = [
  [
    { number: '01', title: 'Check Your Current Score', description: 'Test your content on your target detector to see your current AI score. Note the percentage for comparison.' },
    { number: '02', title: 'Paste into HumanifyLab', description: 'Copy your content and paste it into HumanifyLab. Select Maximum intensity for the lowest possible AI score.' },
    { number: '03', title: 'Humanize in Seconds', description: 'Click Humanize. Deep linguistic transformation reduces your AI score to 0-3% in under 10 seconds.' },
    { number: '04', title: 'Verify Your New Score', description: 'Test the humanized content on your target detector. You will see a score of 0-3% — ready to submit.' },
  ],
  [
    { number: '01', title: 'Copy Your AI Content', description: 'Take the content with a high AI score and copy it. HumanifyLab works with any AI-generated text.' },
    { number: '02', title: 'Open HumanifyLab Free', description: 'Visit HumanifyLab.com — no account needed. Paste your content directly. Free plan handles up to 500 words.' },
    { number: '03', title: 'Select Maximum Intensity', description: 'For the lowest possible AI score, choose Maximum intensity. This applies the deepest transformation.' },
    { number: '04', title: 'Get 0% AI Score', description: 'Your content is transformed in under 10 seconds. Test it — you\'ll see 0-3% AI on every detector.' },
  ],
  [
    { number: '01', title: 'Identify Your Target Detector', description: 'Know which detector you need to bypass — Turnitin, GPTZero, Originality.AI, or others. HumanifyLab handles all of them.' },
    { number: '02', title: 'Paste and Configure', description: 'Paste your content into HumanifyLab. Choose your tone (Academic, Professional, or Casual) and set intensity to Maximum.' },
    { number: '03', title: 'Transform in Real Time', description: 'HumanifyLab processes your content in real time. Watch your AI score drop from 80-100% to 0-3% in seconds.' },
    { number: '04', title: 'Submit with Confidence', description: 'Your humanized content is permanently transformed. It will score 0-3% on every detector — every time you test it.' },
  ],
];

const DETECTOR_SCORE_SETS = [
  [
    { detector: 'Turnitin', before: '85-100%', after: '0-3%' },
    { detector: 'GPTZero', before: '80-100%', after: '0-3%' },
    { detector: 'Originality.AI', before: '85-100%', after: '0-3%' },
    { detector: 'ZeroGPT', before: '75-100%', after: '0-3%' },
    { detector: 'Copyleaks', before: '80-100%', after: '0-3%' },
    { detector: 'Winston AI', before: '80-100%', after: '0-3%' },
  ],
  [
    { detector: 'Turnitin AI Detection', before: '90-100%', after: '0-2%' },
    { detector: 'GPTZero', before: '85-100%', after: '0-2%' },
    { detector: 'Originality.AI', before: '88-100%', after: '0-2%' },
    { detector: 'ZeroGPT', before: '80-100%', after: '0-2%' },
    { detector: 'Sapling AI', before: '75-100%', after: '0-3%' },
    { detector: 'Content at Scale', before: '80-100%', after: '0-3%' },
  ],
  [
    { detector: 'Turnitin', before: '88-99%', after: '1-3%' },
    { detector: 'GPTZero', before: '82-99%', after: '1-3%' },
    { detector: 'Originality.AI', before: '86-99%', after: '1-3%' },
    { detector: 'Copyleaks', before: '78-99%', after: '1-3%' },
    { detector: 'Winston AI', before: '82-99%', after: '1-3%' },
    { detector: 'ZeroGPT', before: '76-99%', after: '1-3%' },
  ],
];

const FAQ_SETS = [
  [
    { q: 'How does HumanifyLab reduce AI scores to 0%?', a: 'HumanifyLab performs deep linguistic transformation targeting the exact statistical patterns AI detectors measure — perplexity, burstiness, and semantic entropy. By correcting all three simultaneously, it reduces AI scores to 0-3% on every major detector.' },
    { q: 'Can HumanifyLab get me a 0% score on Turnitin?', a: 'Yes. HumanifyLab achieves a 99.9% bypass rate on Turnitin. After humanization, your content will score 0-3% on Turnitin\'s AI detection system. We test against live Turnitin systems weekly.' },
    { q: 'Can HumanifyLab get me a 0% score on GPTZero?', a: 'Yes. HumanifyLab specifically targets the perplexity and burstiness metrics that GPTZero measures. After humanization, your content will consistently score 0-3% on GPTZero.' },
    { q: 'How long does it take to reduce my AI score?', a: 'HumanifyLab reduces AI scores in under 10 seconds. Even a 10,000-word document is processed in under a minute. You can verify the score immediately after humanization.' },
    { q: 'Does reducing the AI score affect content quality?', a: 'No. HumanifyLab preserves 100% of your original meaning while reducing the AI score. The output often reads better than the original AI text, with more natural sentence variation and flow.' },
  ],
  [
    { q: 'What is a good AI score on Turnitin?', a: 'A score of 0-10% is generally considered safe on Turnitin. HumanifyLab consistently achieves 0-3%, well within the safe range. Scores above 20% typically trigger review by instructors.' },
    { q: 'What is a good AI score on GPTZero?', a: 'GPTZero scores below 20% are generally considered human-written. HumanifyLab achieves 0-3% on GPTZero, giving you a significant safety margin.' },
    { q: 'Can I check my AI score before and after humanization?', a: 'Yes. You can test your content on any AI detector before and after using HumanifyLab. Most users see their score drop from 80-100% to 0-3% after humanization.' },
    { q: 'Does HumanifyLab work on all AI detectors?', a: 'Yes. HumanifyLab achieves a 99.9% bypass rate across all major AI detectors including Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks, Winston AI, and Sapling.' },
    { q: 'Is there a guarantee that my score will reach 0%?', a: 'HumanifyLab achieves 0-3% on 99.9% of processed texts. In the rare case that a text does not reach the target score, you can reprocess with Maximum intensity or contact support for assistance.' },
  ],
  [
    { q: 'Why is my AI score still high after using other tools?', a: 'Most humanizers use simple synonym replacement that changes words but not the underlying statistical patterns. AI detectors measure perplexity, burstiness, and semantic entropy — not just word choice. HumanifyLab targets all three simultaneously.' },
    { q: 'How do I verify my AI score after humanization?', a: 'After humanizing with HumanifyLab, test your content on your target detector. For Turnitin, submit to a test assignment. For GPTZero and Originality.AI, use their free online tools.' },
    { q: 'Does the AI score reduction last permanently?', a: 'Yes. HumanifyLab\'s transformation is permanent. The humanized text will continue to score 0-3% on AI detectors indefinitely — the changes are not temporary or reversible.' },
    { q: 'Can I reduce the AI score of content in other languages?', a: 'Yes. HumanifyLab supports 50+ languages and achieves the same 99.9% bypass rate across all supported languages. The AI score reduction works equally well for non-English content.' },
    { q: 'What intensity setting gives the lowest AI score?', a: 'Maximum intensity produces the lowest AI scores — typically 0-1%. For most content, Standard intensity achieves 0-3%. Use Maximum for strict detectors like Turnitin and Originality.AI.' },
  ],
  [
    { q: 'How does HumanifyLab compare to other AI score reducers?', a: 'HumanifyLab consistently outperforms competitors with a 99.9% bypass rate, faster processing, and better meaning preservation. Most competitors achieve 60-85% bypass rates with significant quality loss.' },
    { q: 'Can I reduce the AI score of a full dissertation?', a: 'Yes. HumanifyLab handles documents of any length. A full dissertation can be processed in sections, with each section achieving 0-3% AI score. Paid plans support longer documents in a single run.' },
    { q: 'Does HumanifyLab work for SEO content AI scores?', a: 'Yes. HumanifyLab reduces AI scores in SEO content, blog posts, and web copy. The humanized content also tends to rank better in search engines due to more natural language patterns.' },
    { q: 'What happens to my content after humanization?', a: 'HumanifyLab has a strict zero data retention policy. Your content is processed in memory and immediately deleted after humanization. Nothing is stored, logged, or used for training.' },
    { q: 'Is HumanifyLab free to use for AI score reduction?', a: 'Yes. HumanifyLab offers a free plan with no sign-up required. You can reduce AI scores immediately. Paid plans offer higher word limits, bulk processing, and API access.' },
  ],
];

const FINAL_CTA_TITLES = [
  (kw: string) => `Get Your 0% AI Score Now`,
  (kw: string) => `Reduce Your AI Score Today`,
  (kw: string) => `${kw} — Start Free`,
  (kw: string) => `Eliminate AI Flags Permanently`,
  (kw: string) => `Get 0% on Every Detector`,
  (kw: string) => `Fix Your AI Score in Seconds`,
];

const FINAL_CTA_SUBTITLES = [
  'Free plan available. No sign-up required. Results in under 10 seconds.',
  '99.9% bypass rate. Zero data stored. Instant results. Try free today.',
  'Join 450,000+ users who achieve 0% AI scores with HumanifyLab.',
  'No account needed. Paste your content and get 0% AI score in seconds.',
  'Free plan, instant results, meaning preserved. Reduce your AI score now.',
  'Trusted by students and professionals worldwide. Free to start, no commitment.',
];

export function generateScoreContent(entry: KeywordEntryV3): ScoreContentData {
  const { keyword, seed } = entry;

  const combo = buildPageStrings(keyword, seed, '', 'score');
  const spi = uniqueIdx(seed, keyword, SCORE_POINT_SETS.length, 4);
  const sti = uniqueIdx(seed, keyword, STEP_SETS.length, 5);
  const dsi = uniqueIdx(seed, keyword, DETECTOR_SCORE_SETS.length, 6);
  const fi = uniqueIdx(seed, keyword, FAQ_SETS.length, 7);

  const stats = buildStats(keyword, seed);

  const scoreTitles = ['How HumanifyLab Eliminates AI Scores', 'Why HumanifyLab Achieves 0% AI Scores', 'The Science Behind AI Score Reduction', 'How We Get You to 0% AI Score'];
  const stepsTitles = ['How to Get 0% AI Score', 'Your 4-Step Score Reduction Guide', 'Get to 0% in 4 Simple Steps', 'How to Reduce Your AI Score'];
  const detectorTitles = ['Before & After Scores', 'Real Score Reductions', 'Verified Score Results', 'AI Score Comparison'];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats,
    scoreTitle: scoreTitles[uniqueIdx(seed, keyword, scoreTitles.length, 12)]!,
    scorePoints: SCORE_POINT_SETS[spi]!,
    stepsTitle: stepsTitles[uniqueIdx(seed, keyword, stepsTitles.length, 13)]!,
    steps: STEP_SETS[sti]!,
    detectorScoresTitle: detectorTitles[uniqueIdx(seed, keyword, detectorTitles.length, 14)]!,
    detectorScores: DETECTOR_SCORE_SETS[dsi]!,
    faqTitle: combo.faqTitle,
    faqs: [...FAQ_SETS[fi]!, ...buildFaqs(keyword, seed, '', 'score').slice(0, 0)],
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
