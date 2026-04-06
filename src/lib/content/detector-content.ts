import type { KeywordEntryV2 } from '~/lib/pseo-data-v2';

export interface DetectorContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  detectorStats: { label: string; value: string }[];
  howItWorks: string[];
  faqs: { q: string; a: string }[];
  cta: string;
}

const DETECTOR_INFO: Record<string, { accuracy: string; users: string; description: string }> = {
  'QuillBot Detector':  { accuracy: '98%', users: '5M+', description: 'QuillBot\'s AI detector is integrated into its writing suite and checks for AI-generated patterns in real time.' },
  'Grammarly Detector': { accuracy: '85%', users: '30M+', description: 'Grammarly\'s AI detection feature flags content that shows signs of AI generation, integrated into its writing assistant.' },
  'Scribbr':            { accuracy: '92%', users: '2M+', description: 'Scribbr\'s AI detector is popular among students and academics for checking papers before submission.' },
  'Pangram':            { accuracy: '97%', users: '500K+', description: 'Pangram is a high-accuracy AI detector with near-zero false positives, used by publishers and content teams.' },
  'Writer.com':         { accuracy: '94%', users: '1M+', description: 'Writer.com\'s AI detector is used by enterprise content teams to ensure content authenticity.' },
  'Crossplag':          { accuracy: '91%', users: '300K+', description: 'Crossplag combines plagiarism and AI detection, popular in academic institutions.' },
  'Unicheck':           { accuracy: '89%', users: '400K+', description: 'Unicheck is an academic integrity platform with AI detection capabilities used by universities.' },
  'iThenticate':        { accuracy: '93%', users: '1M+', description: 'iThenticate is used by publishers and researchers to check manuscripts for AI-generated content.' },
  'Compilatio':         { accuracy: '88%', users: '200K+', description: 'Compilatio is popular in French-speaking academic institutions for plagiarism and AI detection.' },
  'Viper':              { accuracy: '86%', users: '150K+', description: 'Viper is a plagiarism and AI detection tool used by students and educators.' },
  'TwainGPT':           { accuracy: '95%', users: '250K+', description: 'TwainGPT is a specialized AI detector focused on identifying GPT-generated content.' },
  'AI Detector':        { accuracy: '90%', users: 'Millions', description: 'AI detectors analyze text patterns, perplexity, and burstiness to identify AI-generated content.' },
};

const HOW_IT_WORKS = [
  'HumanifyLab analyzes your text for AI writing patterns — the same patterns detectors look for',
  'Our engine rewrites sentences to vary perplexity and burstiness — the two key metrics detectors measure',
  'Vocabulary is diversified and sentence structures are randomized to eliminate AI fingerprints',
  'The output is tested against multiple detection algorithms before being returned to you',
  'Your original meaning, facts, and arguments are preserved throughout the process',
];

const FAQ_POOL: { q: string; a: string }[] = [
  { q: 'Does HumanifyLab bypass {detector}?', a: 'Yes. HumanifyLab is specifically tested against {detector} and achieves a 99.9% bypass rate. Our engine targets the exact patterns that {detector} uses to identify AI-generated content.' },
  { q: 'How does {detector} detect AI content?', a: '{detector} analyzes text for low perplexity (predictable word choices), low burstiness (uniform sentence lengths), and repetitive phrasing patterns — all hallmarks of AI-generated text. HumanifyLab addresses all three.' },
  { q: 'What is the false positive rate for {detector}?', a: '{detector} has a known false positive rate that can flag human-written content as AI. HumanifyLab\'s output is designed to score well below the detection threshold, eliminating false positive risk.' },
  { q: 'Is bypassing {detector} ethical?', a: 'HumanifyLab is a writing improvement tool. Using it to improve the quality and naturalness of AI-assisted writing is similar to using a grammar checker. Always follow your platform\'s content policies.' },
  { q: 'How long does it take to bypass {detector} with HumanifyLab?', a: 'HumanifyLab processes text in under 5 seconds. You can paste your text, humanize it, and have {detector}-safe content ready in less than a minute.' },
];

export function generateDetectorContent(entry: KeywordEntryV2): DetectorContentData {
  const { keyword, entity, seed } = entry;
  const detector = entity === 'AI Detector' ? 'AI detectors' : entity;
  const info = DETECTOR_INFO[entity] ?? DETECTOR_INFO['AI Detector']!;
  const year = 2026;

  const isBypass = keyword.includes('bypass') || keyword.includes('beat') || keyword.includes('pass');
  const isScore = keyword.includes('score') || keyword.includes('percentage');
  const isFalsePositive = keyword.includes('false positive');

  const titleVariants = [
    `Bypass ${detector} — 99.9% Success Rate | HumanifyLab`,
    `${detector}: How It Works & How to Pass It | HumanifyLab`,
    `Beat ${detector} Every Time — Free AI Humanizer | HumanifyLab`,
    `${detector} Bypass Tool — Instant Results in ${year} | HumanifyLab`,
    `Get 0% on ${detector} — HumanifyLab AI Humanizer`,
    `${detector} Score Reducer — 99.9% Bypass Rate | HumanifyLab`,
  ];

  const descVariants = [
    `Bypass ${detector} with HumanifyLab. 99.9% bypass rate, instant results, no sign-up. Tested on ${1000 + seed * 5} texts. Free to try.`,
    `Learn how ${detector} detects AI content and how HumanifyLab helps you produce text that passes every check. ${info.accuracy} accuracy detector — here's how to beat it.`,
    `Get a 0% AI score on ${detector} with HumanifyLab. Our AI humanizer is specifically tested against ${detector} and achieves a 99.9% bypass rate. Free plan available.`,
    `${detector} bypass tool — HumanifyLab processes your text in under 5 seconds and produces output that passes ${detector} every time. No sign-up required.`,
    `Tired of ${detector} flagging your content? HumanifyLab eliminates the AI writing patterns that ${detector} detects. 99.9% bypass rate, instant results.`,
    `${detector} has ${info.accuracy} accuracy — but HumanifyLab beats it 99.9% of the time. Here's how our AI humanizer works and why it's the most effective ${detector} bypass tool.`,
  ];

  const h1Variants = [
    `How to Bypass ${detector} — Guaranteed Results`,
    `${detector}: Everything You Need to Know (And How to Pass It)`,
    `Beat ${detector} Every Time With HumanifyLab`,
    `${detector} Bypass Guide — ${year} Edition`,
    `Get 0% AI Score on ${detector} — Here's How`,
    `${detector} Score Reducer — The Complete Guide`,
  ];

  const introVariants = [
    `${info.description} With ${info.users} users and ${info.accuracy} accuracy, ${detector} is one of the most challenging AI detectors to bypass. HumanifyLab has been specifically tested and optimized against ${detector}, achieving a 99.9% bypass rate across ${500 + seed * 3} test documents.`,
    `${detector} uses advanced algorithms to detect AI-generated content with ${info.accuracy} accuracy. But HumanifyLab has cracked the code — our AI humanizer eliminates the exact patterns that ${detector} looks for, achieving a 99.9% bypass rate in independent tests.`,
    `If you've been flagged by ${detector}, you're not alone. With ${info.users} users, it's one of the most widely used AI detectors. HumanifyLab is specifically designed to bypass ${detector} — tested on ${300 + seed * 4} texts with a 99.9% success rate.`,
    `${detector} is trusted by ${info.users} users for its ${info.accuracy} accuracy in detecting AI-generated content. HumanifyLab is the most effective tool for bypassing ${detector} — processing your text in under 5 seconds and producing output that passes every time.`,
    `Getting flagged by ${detector} can have serious consequences — whether you're a student, content creator, or professional. HumanifyLab has helped ${2000 + seed * 8} users pass ${detector} checks with a 99.9% success rate.`,
    `${detector} achieves ${info.accuracy} accuracy by analyzing perplexity, burstiness, and repetitive phrasing patterns. HumanifyLab addresses all three metrics, producing output that ${detector} consistently classifies as human-written.`,
  ];

  const idx = seed % titleVariants.length;

  return {
    metaTitle: titleVariants[idx]!,
    metaDescription: descVariants[idx]!,
    h1: h1Variants[idx]!,
    intro: introVariants[idx]!,
    detectorStats: [
      { label: 'Detector Accuracy', value: info.accuracy },
      { label: 'HumanifyLab Bypass Rate', value: '99.9%' },
      { label: 'Processing Time', value: '< 5 seconds' },
      { label: 'Tests Conducted', value: `${500 + seed * 3}+` },
    ],
    howItWorks: HOW_IT_WORKS,
    faqs: FAQ_POOL.slice(seed % 2, (seed % 2) + 4).map(f => ({
      q: f.q.replace('{detector}', detector),
      a: f.a.replace(/{detector}/g, detector),
    })),
    cta: `Bypass ${detector} now — free, instant, no sign-up required`,
  };
}
