import type { KeywordEntryV3 } from '~/lib/pseo-data-v3';
import { uniqueIdx, uniqueNum } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildSteps, buildFeaturePoints, buildStats } from '~/lib/content/content-combinator';

export interface ProblemContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  stats: { value: string; label: string }[];
  problemTitle: string;
  problemPoints: { icon: string; title: string; description: string }[];
  solutionTitle: string;
  solutionSteps: { number: string; title: string; description: string }[];
  reassuranceTitle: string;
  reassurancePoints: { icon: string; title: string; description: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const TITLES = [
  (kw: string) => `${kw} — Fix It Now | HumanifyLab`,
  (kw: string) => `${kw}: The Complete Solution | HumanifyLab 2026`,
  (kw: string) => `${kw} — How to Solve It Fast | HumanifyLab`,
  (kw: string) => `${kw}: Step-by-Step Fix | HumanifyLab`,
  (kw: string) => `${kw} — Proven Solution | HumanifyLab`,
  (kw: string) => `${kw}: What to Do Right Now | HumanifyLab`,
  (kw: string) => `${kw} — Solved in Under 10 Seconds | HumanifyLab`,
  (kw: string) => `${kw}: Expert Fix & Free Tool | HumanifyLab`,
  (kw: string) => `${kw} — Stop Getting Flagged | HumanifyLab`,
  (kw: string) => `${kw}: Instant AI Detection Fix | HumanifyLab`,
  (kw: string) => `${kw} — The Only Fix That Works | HumanifyLab`,
  (kw: string) => `${kw}: 99.9% Success Rate | HumanifyLab`,
];

const DESCRIPTIONS = [
  (kw: string) => `Dealing with ${kw}? HumanifyLab solves it instantly. 99.9% bypass rate, results in under 10 seconds. Free to try — no sign-up required.`,
  (kw: string) => `${kw} is a common problem. HumanifyLab fixes it with a 99.9% bypass rate across Turnitin, GPTZero, and Originality.AI. Free plan available.`,
  (kw: string) => `If you're facing ${kw}, HumanifyLab is the solution. Humanize your AI text in under 10 seconds and pass every detector. Start free today.`,
  (kw: string) => `${kw}? HumanifyLab has helped thousands of users solve this exact problem. 99.9% bypass rate, zero data stored. Try free now.`,
  (kw: string) => `The proven fix for ${kw}. HumanifyLab transforms AI-generated text into undetectable human writing in under 10 seconds. No sign-up needed.`,
  (kw: string) => `${kw} — solved. HumanifyLab achieves a 99.9% bypass rate across all major AI detectors. Free plan, instant results, no watermark.`,
  (kw: string) => `Stop struggling with ${kw}. HumanifyLab reduces AI scores to 0-3% in seconds. Trusted by 450,000+ users. Free to start today.`,
  (kw: string) => `${kw}: HumanifyLab's deep linguistic engine eliminates AI flags permanently. 99.9% bypass rate, zero data retention. No credit card needed.`,
  (kw: string) => `Fix ${kw} with HumanifyLab — the fastest AI detection solution in 2026. Results in under 10 seconds, free plan, no sign-up required.`,
  (kw: string) => `${kw} doesn't have to ruin your submission. HumanifyLab fixes it in seconds with a 99.9% bypass rate. Try free — no account needed.`,
  (kw: string) => `Thousands of users have solved ${kw} with HumanifyLab. 99.9% bypass rate, instant results, meaning preserved. Start free today.`,
  (kw: string) => `${kw}: HumanifyLab is the #1 solution. Deep transformation, 0% AI score, zero data stored. Free plan available — no credit card.`,
];

const H1S = [
  (kw: string) => `${kw}: Here's the Fix`,
  (kw: string) => `How to Solve ${kw} — Fast`,
  (kw: string) => `${kw}: The Complete Solution`,
  (kw: string) => `Fix ${kw} in Under 10 Seconds`,
  (kw: string) => `${kw} — What Actually Works`,
  (kw: string) => `${kw}: Step-by-Step Solution`,
  (kw: string) => `${kw} — Solved Permanently`,
  (kw: string) => `The Fastest Fix for ${kw}`,
  (kw: string) => `${kw}: Stop Getting Flagged Today`,
  (kw: string) => `${kw} — Expert Solution 2026`,
  (kw: string) => `How to Fix ${kw} Right Now`,
  (kw: string) => `${kw}: Proven Fix with 99.9% Success`,
];

const HERO_SUBTITLES = [
  'The proven solution for AI detection problems. 99.9% bypass rate, results in under 10 seconds, free to try.',
  'Stop getting flagged. HumanifyLab eliminates AI detection issues permanently — 99.9% bypass rate, zero data stored.',
  'AI detection problems solved in seconds. HumanifyLab transforms flagged content into undetectable human writing.',
  'Trusted by 450,000+ users to fix AI detection issues. Free plan, instant results, no sign-up required.',
  'The fastest fix for AI detection problems. HumanifyLab reduces AI scores to 0-3% in under 10 seconds.',
  'Don\'t let AI detection ruin your work. HumanifyLab fixes it permanently — 99.9% bypass rate, free to start.',
  'AI detection flagged your content? HumanifyLab solves it in seconds. 99.9% success rate, meaning preserved.',
  'Fix AI detection problems before your deadline. HumanifyLab processes any text in under 10 seconds. Free plan.',
];

const PROBLEM_POINT_SETS = [
  [
    { icon: '🚨', title: 'AI Detection Flags', description: 'AI detectors flag content based on statistical patterns — perplexity, burstiness, and semantic entropy. HumanifyLab corrects all three simultaneously.' },
    { icon: '📉', title: 'High AI Scores', description: 'A high AI score on Turnitin, GPTZero, or Originality.AI can have serious consequences. HumanifyLab reduces scores to 0-3% reliably.' },
    { icon: '❌', title: 'False Positives', description: 'AI detectors sometimes flag human writing incorrectly. HumanifyLab helps you produce content that passes every detector, eliminating false positive risk.' },
    { icon: '⏰', title: 'Tight Deadlines', description: 'Facing a deadline with flagged content? HumanifyLab fixes the problem in under 10 seconds — fast enough for any deadline.' },
  ],
  [
    { icon: '🔍', title: 'Statistical Pattern Detection', description: 'AI detectors measure perplexity, burstiness, and entropy — not just word choice. Simple paraphrasing won\'t fix this. HumanifyLab targets all three metrics.' },
    { icon: '📊', title: 'Detector Algorithm Updates', description: 'AI detectors update their algorithms regularly. HumanifyLab monitors every update and adjusts weekly to maintain a 99.9% bypass rate.' },
    { icon: '🎓', title: 'Academic Consequences', description: 'AI detection flags can lead to grade penalties or academic integrity violations. HumanifyLab eliminates this risk before you submit.' },
    { icon: '💼', title: 'Professional Credibility', description: 'AI-flagged content damages professional credibility. HumanifyLab produces output that passes every detector and reads as genuinely human-authored.' },
  ],
  [
    { icon: '⚠️', title: 'Turnitin AI Flags', description: 'Turnitin\'s AI detection is used by millions of institutions. HumanifyLab achieves a 99.9% bypass rate against Turnitin — tested weekly against live systems.' },
    { icon: '🔬', title: 'GPTZero Detection', description: 'GPTZero measures perplexity and burstiness simultaneously. HumanifyLab targets both metrics in a single transformation pass.' },
    { icon: '🎯', title: 'Originality.AI Flags', description: 'Originality.AI runs multiple detection models at once. HumanifyLab defeats all of them with a single humanization.' },
    { icon: '🌐', title: 'Platform-Specific Detection', description: 'Different platforms use different detectors. HumanifyLab bypasses all major detectors — Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks, and more.' },
  ],
];

const SOLUTION_STEP_SETS = [
  [
    { number: '01', title: 'Paste Your Flagged Content', description: 'Copy the content that was flagged by AI detection and paste it into HumanifyLab. Any length is supported.' },
    { number: '02', title: 'Select Maximum Intensity', description: 'For content flagged by strict detectors like Turnitin, select Maximum intensity for the deepest transformation.' },
    { number: '03', title: 'Humanize in Seconds', description: 'Click Humanize. HumanifyLab transforms the statistical patterns that triggered the flag in under 10 seconds.' },
    { number: '04', title: 'Verify and Resubmit', description: 'Test the output against your target detector — you will see 0-3% AI. Your content is ready to resubmit.' },
  ],
  [
    { number: '01', title: 'Copy Your AI-Generated Text', description: 'Take the content that was flagged and copy it. HumanifyLab works with any AI-generated text regardless of source.' },
    { number: '02', title: 'Open HumanifyLab', description: 'Go to HumanifyLab.com — no account needed. Paste your content directly into the editor.' },
    { number: '03', title: 'Click Humanize', description: 'Select your tone and intensity, then click Humanize. Deep linguistic transformation begins immediately.' },
    { number: '04', title: 'Get 0% AI Score', description: 'Your transformed content is ready in under 10 seconds. Test it — you\'ll see 0-3% AI on every detector.' },
  ],
  [
    { number: '01', title: 'Identify the Problem', description: 'Note which detector flagged your content and what score it gave. This helps you choose the right intensity setting.' },
    { number: '02', title: 'Paste into HumanifyLab', description: 'Copy your flagged content and paste it into HumanifyLab. The free plan handles up to 500 words per run.' },
    { number: '03', title: 'Apply Deep Transformation', description: 'HumanifyLab targets perplexity, burstiness, and semantic entropy — the exact signals your detector measured.' },
    { number: '04', title: 'Confirm and Submit', description: 'Verify the new score on your target detector. With HumanifyLab, you\'ll consistently see 0-3% AI — safe to submit.' },
  ],
];

const REASSURANCE_POINT_SETS = [
  [
    { icon: '🔒', title: 'Complete Privacy', description: 'Zero data retention. Your content is processed in memory and immediately deleted. Nothing is stored or shared.' },
    { icon: '✅', title: 'Meaning Preserved', description: '100% of your original meaning, arguments, and facts are preserved. Only the AI patterns are transformed.' },
    { icon: '🎯', title: 'Proven Results', description: '99.9% bypass rate verified weekly against live detection systems. Tested on 10,000+ documents.' },
    { icon: '💰', title: 'Free to Try', description: 'No sign-up required. Start fixing your AI detection problem immediately with the free plan.' },
  ],
  [
    { icon: '⚡', title: 'Instant Fix', description: 'HumanifyLab processes your content in under 10 seconds — fast enough for any deadline, any time.' },
    { icon: '🌍', title: 'Works Globally', description: 'HumanifyLab bypasses AI detectors used by institutions worldwide. Available in 50+ languages.' },
    { icon: '📈', title: 'Permanent Solution', description: 'The transformation is permanent. Your content will continue to score 0-3% on AI detectors indefinitely.' },
    { icon: '🛡️', title: 'No Risk', description: 'Free plan, no credit card, no sign-up. Try HumanifyLab with zero commitment before upgrading.' },
  ],
  [
    { icon: '🏆', title: '99.9% Success Rate', description: 'HumanifyLab achieves a 99.9% bypass rate across all major AI detectors. The highest success rate in the industry.' },
    { icon: '🔬', title: 'Deep Transformation', description: 'Unlike simple paraphrasers, HumanifyLab targets the statistical patterns AI detectors actually measure.' },
    { icon: '📝', title: 'Quality Maintained', description: 'Your content reads better after humanization — more natural, more varied, and more engaging.' },
    { icon: '🤝', title: 'Trusted by 450K+ Users', description: 'Over 450,000 students, writers, and professionals trust HumanifyLab to fix their AI detection problems.' },
  ],
];

const FAQ_SETS = [
  [
    { q: 'What causes AI detection flags on my content?', a: 'AI detectors analyze statistical patterns in text — including perplexity (word predictability), burstiness (sentence length variation), and semantic entropy (vocabulary diversity). AI-generated content scores abnormally on all three. HumanifyLab corrects all three simultaneously.' },
    { q: 'How do I fix an AI detection flag on my essay?', a: 'Paste your flagged essay into HumanifyLab, click Humanize, and get a transformed version in under 10 seconds. The output achieves a 99.9% bypass rate across Turnitin, GPTZero, and Originality.AI.' },
    { q: 'Can I appeal an AI detection result?', a: 'Yes. If you believe the AI detection was a false positive, you can appeal to your institution. HumanifyLab can help you produce a humanized version that demonstrates your writing ability while you prepare your appeal.' },
    { q: 'Will HumanifyLab fix a 100% AI score?', a: 'Yes. HumanifyLab is specifically designed to reduce AI scores to 0-3% regardless of the starting score. Even content that scores 100% AI can be transformed to pass every detector.' },
    { q: 'Is it safe to use HumanifyLab to fix AI detection issues?', a: 'HumanifyLab has a strict zero data retention policy. Your content is processed in memory and immediately deleted. Nothing is stored or shared. Your privacy is completely protected.' },
  ],
  [
    { q: 'Why does my writing get flagged as AI even when I wrote it myself?', a: 'AI detectors sometimes produce false positives — flagging human writing as AI-generated. This happens because some human writers naturally use patterns that overlap with AI writing. HumanifyLab can help you transform your writing to avoid these false flags.' },
    { q: 'How do I lower my Turnitin AI score?', a: 'Paste your content into HumanifyLab and click Humanize. The tool transforms the statistical patterns that Turnitin measures, reducing your AI score to 0-3% in under 10 seconds.' },
    { q: 'How do I lower my GPTZero score?', a: 'HumanifyLab specifically targets the perplexity and burstiness metrics that GPTZero measures. After humanization, your content will score 0-3% on GPTZero consistently.' },
    { q: 'What should I do if my professor accuses me of using AI?', a: 'Stay calm and gather evidence of your writing process. HumanifyLab can help you produce a humanized version of your work that demonstrates natural writing patterns. Consider also keeping drafts and notes as evidence of your process.' },
    { q: 'Does HumanifyLab work for all AI detectors?', a: 'Yes. HumanifyLab achieves a 99.9% bypass rate across all major AI detectors including Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks, Winston AI, and Sapling.' },
  ],
  [
    { q: 'How do I prove my writing is not AI-generated?', a: 'Keep your drafts, notes, and research materials as evidence of your writing process. HumanifyLab can also help you produce a version of your work that scores 0% on AI detectors, supporting your case.' },
    { q: 'What is the fastest way to fix an AI detection problem?', a: 'HumanifyLab is the fastest solution — paste your content, click Humanize, and get a 0% AI score in under 10 seconds. No sign-up required, free to use.' },
    { q: 'Can AI detectors be wrong?', a: 'Yes. AI detectors have false positive rates of 1-10% depending on the tool. If you believe you have been falsely flagged, document your writing process and consider appealing the result.' },
    { q: 'Will humanizing my content change its meaning?', a: 'No. HumanifyLab preserves 100% of your original meaning, arguments, and facts. Only the linguistic patterns are transformed to eliminate AI detection flags.' },
    { q: 'How do I avoid AI detection in future submissions?', a: 'Use HumanifyLab as a final step before every submission. Paste your content, humanize it, and submit the transformed version. This ensures a 0-3% AI score every time.' },
  ],
  [
    { q: 'Does HumanifyLab work on all types of AI-generated content?', a: 'Yes. HumanifyLab works on content generated by any AI tool — ChatGPT, Claude, Gemini, Jasper, Copy.ai, and any other AI writing assistant. The transformation targets the statistical patterns, not the source.' },
    { q: 'How many times can I use HumanifyLab for free?', a: 'The free plan includes 5 runs per day with up to 500 words per run. This is sufficient for most students and casual users. Paid plans offer higher limits and unlimited processing.' },
    { q: 'Does HumanifyLab work for non-English content?', a: 'Yes. HumanifyLab supports 50+ languages and achieves the same 99.9% bypass rate for non-English content. Students writing in French, German, Spanish, Arabic, and other languages get the same results.' },
    { q: 'What if HumanifyLab doesn\'t fix my AI score?', a: 'In the rare case that a single pass doesn\'t achieve the target score, try reprocessing with Maximum intensity. If the issue persists, contact support — we offer a satisfaction guarantee.' },
    { q: 'Is HumanifyLab better than manually rewriting my content?', a: 'Yes. Manual rewriting takes 30-60 minutes and often misses the statistical patterns AI detectors measure. HumanifyLab does it in under 10 seconds with a 99.9% bypass rate — far more reliable and efficient.' },
  ],
];

const FINAL_CTA_TITLES = [
  (kw: string) => `Fix Your AI Detection Problem Now`,
  (kw: string) => `Solve ${kw} in Under 10 Seconds`,
  (kw: string) => `Stop Getting Flagged — Start Free`,
  (kw: string) => `Get 0% AI Score Today`,
  (kw: string) => `Fix ${kw} — Free, Instant, No Sign-up`,
  (kw: string) => `The Solution to ${kw} Is Here`,
];

const FINAL_CTA_SUBTITLES = [
  'Free plan available. No sign-up required. Results in under 10 seconds.',
  'Join 450,000+ users who trust HumanifyLab. Start free — no credit card needed.',
  '99.9% bypass rate. Zero data stored. Instant results. Try free today.',
  'No account needed. Paste your content and get 0% AI score in seconds.',
  'Free plan, instant results, meaning preserved. Fix your AI detection problem now.',
  'Trusted by students and professionals worldwide. Free to start, no commitment.',
];

export function generateProblemContent(entry: KeywordEntryV3): ProblemContentData {
  const { keyword, seed } = entry;

  const combo = buildPageStrings(keyword, seed, '', 'problem');
  const ppi = uniqueIdx(seed, keyword, PROBLEM_POINT_SETS.length, 4);
  const ssi = uniqueIdx(seed, keyword, SOLUTION_STEP_SETS.length, 5);
  const rpi = uniqueIdx(seed, keyword, REASSURANCE_POINT_SETS.length, 6);
  const fi = uniqueIdx(seed, keyword, FAQ_SETS.length, 7);

  const stats = buildStats(keyword, seed);

  const problemTitles = ['Understanding the Problem', 'Why AI Detection Flags Your Content', 'The Root Cause of AI Detection Issues', 'What\'s Triggering the AI Flag'];
  const solutionTitles = ['The Solution: HumanifyLab', 'How to Fix It with HumanifyLab', 'Your Step-by-Step Fix', 'The Proven Solution'];
  const reassuranceTitles = ['Why HumanifyLab Works', 'What Makes HumanifyLab Different', 'Why 450,000+ Users Trust HumanifyLab', 'The HumanifyLab Advantage'];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats,
    problemTitle: problemTitles[uniqueIdx(seed, keyword, problemTitles.length, 12)]!,
    problemPoints: PROBLEM_POINT_SETS[ppi]!,
    solutionTitle: solutionTitles[uniqueIdx(seed, keyword, solutionTitles.length, 13)]!,
    solutionSteps: SOLUTION_STEP_SETS[ssi]!,
    reassuranceTitle: reassuranceTitles[uniqueIdx(seed, keyword, reassuranceTitles.length, 14)]!,
    reassurancePoints: REASSURANCE_POINT_SETS[rpi]!,
    faqTitle: combo.faqTitle,
    faqs: FAQ_SETS[fi]!,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
