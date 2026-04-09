import type { KeywordEntryV3 } from '~/lib/pseo-data-v3';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildSteps, buildStats } from '~/lib/content/content-combinator';

export interface SpeedContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  stats: { value: string; label: string }[];
  speedPoints: { icon: string; title: string; description: string }[];
  stepsTitle: string;
  steps: { number: string; title: string; description: string }[];
  benchmarkTitle: string;
  benchmarks: { tool: string; time: string; highlight: boolean }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const TITLES = [
  (kw: string) => `${kw} — Instant AI Humanizer | HumanifyLab`,
  (kw: string) => `${kw}: Results in Under 10 Seconds | HumanifyLab`,
  (kw: string) => `${kw} ⚡ — Fastest AI Humanizer 2026 | HumanifyLab`,
  (kw: string) => `${kw}: No Waiting, No Queues | HumanifyLab`,
  (kw: string) => `${kw} — Real-Time AI Humanization | HumanifyLab`,
  (kw: string) => `${kw}: Lightning-Fast AI Detection Bypass | HumanifyLab`,
];

const DESCRIPTIONS = [
  (kw: string) => `${kw} with HumanifyLab. Get humanized, undetectable AI text in under 10 seconds. 99.9% bypass rate, no sign-up required. The fastest AI humanizer in 2026.`,
  (kw: string) => `Need ${kw}? HumanifyLab processes your text in real time — results in under 10 seconds. 99.9% bypass rate, free plan available. No waiting.`,
  (kw: string) => `${kw}: HumanifyLab is the fastest AI humanizer available. Bypass Turnitin, GPTZero, and Originality.AI in under 10 seconds. Free to try, no sign-up.`,
  (kw: string) => `${kw} — HumanifyLab delivers instant AI humanization with a 99.9% bypass rate. No queues, no delays. Start free today.`,
  (kw: string) => `Looking for ${kw}? HumanifyLab humanizes AI text in real time. Faster than any competitor, with a 99.9% bypass rate. Free plan available.`,
  (kw: string) => `${kw}: HumanifyLab processes thousands of words in under 10 seconds. The fastest way to bypass AI detection. Free, no sign-up required.`,
];

const H1S = [
  (kw: string) => `⚡ ${kw}: The Fastest AI Humanizer`,
  (kw: string) => `${kw} — Results in Under 10 Seconds`,
  (kw: string) => `⚡ ${kw}: Real-Time AI Humanization`,
  (kw: string) => `${kw} — No Waiting, Instant Results`,
  (kw: string) => `⚡ The Fastest ${kw} Available`,
  (kw: string) => `${kw}: Lightning-Fast AI Detection Bypass`,
];

const FAQ_SETS = [
  [
    { q: 'How fast does HumanifyLab process text?', a: 'HumanifyLab processes text in under 10 seconds for most documents. A 5,000-word essay is humanized in under 30 seconds. This makes it the fastest AI humanizer available in 2026.' },
    { q: 'Is there a queue or waiting time?', a: 'No. HumanifyLab processes your text in real time with no queue. Results are delivered instantly regardless of server load. There is no waiting time on any plan.' },
    { q: 'Does speed affect quality?', a: 'No. HumanifyLab achieves a 99.9% bypass rate regardless of processing speed. The fast processing is a result of our optimized infrastructure, not a compromise on quality.' },
    { q: 'Can I process large documents quickly?', a: 'Yes. HumanifyLab handles documents of any length. A 10,000-word document is processed in under a minute. Bulk processing on paid plans allows multiple documents simultaneously.' },
    { q: 'Is HumanifyLab faster than competitors?', a: 'Yes. Independent tests show HumanifyLab processes text 3-5x faster than most competitors. While others take 30-120 seconds, HumanifyLab delivers results in under 10 seconds.' },
  ],
  [
    { q: 'Why is speed important for AI humanization?', a: 'Speed matters when you have deadlines. HumanifyLab is designed for students, writers, and professionals who need results immediately — not after waiting a minute or more for processing.' },
    { q: 'Does HumanifyLab have a rate limit?', a: 'Free plan users can process multiple texts per day. Paid plans have higher or unlimited rate limits. Enterprise plans offer custom rate limits for high-volume use cases.' },
    { q: 'Can I use HumanifyLab for real-time content workflows?', a: 'Yes. HumanifyLab is fast enough for real-time content workflows. With API access on paid plans, you can integrate instant humanization directly into your content pipeline.' },
    { q: 'How does HumanifyLab achieve such fast processing?', a: 'HumanifyLab uses optimized neural processing infrastructure with edge deployment. This allows real-time transformation of text without the latency of traditional cloud processing.' },
    { q: 'Is the API also fast?', a: 'Yes. The HumanifyLab API delivers results in under 10 seconds, making it suitable for real-time integrations and automated content workflows.' },
  ],
  [
    { q: 'What is the fastest way to bypass AI detection?', a: 'HumanifyLab is the fastest way to bypass AI detection. Simply paste your text, click Humanize, and get undetectable content in under 10 seconds. No sign-up required.' },
    { q: 'Can I humanize content for a deadline?', a: 'Absolutely. HumanifyLab is specifically designed for tight deadlines. Even a full dissertation can be humanized in under 2 minutes, giving you time to review before submission.' },
    { q: 'Does HumanifyLab work on mobile for quick access?', a: 'Yes. HumanifyLab is fully responsive and works on any device. You can humanize content on your phone in under 10 seconds — perfect for last-minute needs.' },
    { q: 'Is there a batch processing speed advantage?', a: 'Yes. Bulk processing on paid plans allows you to humanize multiple documents simultaneously, dramatically reducing total processing time for large content volumes.' },
    { q: 'How does HumanifyLab compare to manual rewriting for speed?', a: 'Manual rewriting of a 1,000-word essay takes 30-60 minutes. HumanifyLab does it in under 10 seconds — making it over 200x faster while achieving a higher bypass rate.' },
  ],
];

export function generateSpeedContent(entry: KeywordEntryV3): SpeedContentData {
  const { keyword, seed } = entry;

  const combo = buildPageStrings(keyword, seed, '', 'speed');
  const faqs = buildFaqs(keyword, seed, '', 'speed');
  const stats = buildStats(keyword, seed);

  const speedPoints = [
    { icon: '⚡', title: 'Under 10 Seconds', description: 'HumanifyLab processes any text in under 10 seconds. No waiting, no queues — instant results every time.' },
    { icon: '🚀', title: 'Real-Time Processing', description: 'Text is processed in real time as you submit. No batch delays or scheduled processing windows.' },
    { icon: '📦', title: 'Bulk Speed', description: 'Process multiple documents simultaneously on paid plans. Humanize 100 articles in the time it takes competitors to do one.' },
    { icon: '🔌', title: 'Fast API', description: 'The HumanifyLab API delivers results in under 10 seconds, enabling real-time integration into any content workflow.' },
    { icon: '📱', title: 'Fast on Any Device', description: 'HumanifyLab is optimized for speed on desktop, tablet, and mobile. Get instant results wherever you are.' },
    { icon: '🎯', title: 'Speed + Quality', description: 'Fast processing never compromises quality. HumanifyLab maintains a 99.9% bypass rate regardless of processing speed.' },
  ];

  const benchmarkSets = [
    [
      { tool: 'HumanifyLab', time: '< 10 seconds', highlight: true },
      { tool: 'Undetectable.AI', time: '~30 seconds', highlight: false },
      { tool: 'BypassGPT', time: '~45 seconds', highlight: false },
      { tool: 'StealthGPT', time: '~60 seconds', highlight: false },
      { tool: 'Manual Rewriting', time: '30-60 minutes', highlight: false },
    ],
    [
      { tool: 'HumanifyLab', time: '< 10 seconds', highlight: true },
      { tool: 'WriteHuman', time: '~25 seconds', highlight: false },
      { tool: 'HIX AI', time: '~20 seconds', highlight: false },
      { tool: 'QuillBot', time: '~15 seconds', highlight: false },
      { tool: 'Manual Editing', time: '20-45 minutes', highlight: false },
    ],
    [
      { tool: 'HumanifyLab', time: 'Real-time', highlight: true },
      { tool: 'Competitor A', time: '30-60s', highlight: false },
      { tool: 'Competitor B', time: '45-90s', highlight: false },
      { tool: 'Competitor C', time: '60-120s', highlight: false },
      { tool: 'Manual Rewrite', time: '30+ minutes', highlight: false },
    ],
  ];
  const benchmarks = benchmarkSets[uniqueIdx(seed, keyword, benchmarkSets.length, 20)]!;

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats,
    speedPoints,
    stepsTitle: 'How It Works',
    steps: buildSteps(keyword, seed, 'speed'),
    benchmarkTitle: 'Speed Comparison',
    benchmarks,
    faqTitle: combo.faqTitle,
    faqs,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
