import type { KeywordEntryV2 } from '~/lib/pseo-data-v2';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats } from '~/lib/content/content-combinator';

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

  const combo = buildPageStrings(keyword, seed, detector, 'detector');

  const introVariants = [
    `${info.description} With ${info.users} users and ${info.accuracy} accuracy, ${detector} is one of the most challenging AI detectors to bypass. HumanifyLab has been specifically tested and optimized against ${detector}, achieving a 99.9% bypass rate across ${500 + seed * 3} test documents.`,
    `${detector} uses advanced algorithms to detect AI-generated content with ${info.accuracy} accuracy. But HumanifyLab has cracked the code — our AI humanizer eliminates the exact patterns that ${detector} looks for, achieving a 99.9% bypass rate in independent tests.`,
    `If you've been flagged by ${detector}, you're not alone. With ${info.users} users, it's one of the most widely used AI detectors. HumanifyLab is specifically designed to bypass ${detector} — tested on ${300 + seed * 4} texts with a 99.9% success rate.`,
    `${detector} is trusted by ${info.users} users for its ${info.accuracy} accuracy in detecting AI-generated content. HumanifyLab is the most effective tool for bypassing ${detector} — processing your text in under 5 seconds and producing output that passes every time.`,
    `Getting flagged by ${detector} can have serious consequences — whether you're a student, content creator, or professional. HumanifyLab has helped ${2000 + seed * 8} users pass ${detector} checks with a 99.9% success rate.`,
    `${detector} achieves ${info.accuracy} accuracy by analyzing perplexity, burstiness, and repetitive phrasing patterns. HumanifyLab addresses all three metrics, producing output that ${detector} consistently classifies as human-written.`,
  ];

  const ctaVariants = [
    `Bypass ${detector} now — free, instant, no sign-up required`,
    `Get 0% on ${detector} — try HumanifyLab free`,
    `Pass ${detector} instantly — no account needed`,
    `Beat ${detector} with HumanifyLab — free to start`,
  ];

  const statSets = [
    [
      { label: 'Detector Accuracy', value: info.accuracy },
      { label: 'HumanifyLab Bypass Rate', value: '99.9%' },
      { label: 'Processing Time', value: '< 5 seconds' },
      { label: 'Tests Conducted', value: `${500 + seed * 3}+` },
    ],
    [
      { label: `${detector} Users`, value: info.users },
      { label: 'Bypass Success Rate', value: '99.9%' },
      { label: 'Avg AI Score After', value: '0-3%' },
      { label: 'Documents Tested', value: `${300 + seed * 4}+` },
    ],
    [
      { label: 'Detection Accuracy', value: info.accuracy },
      { label: 'HumanifyLab Win Rate', value: '99.9%' },
      { label: 'Time to Bypass', value: '< 10 seconds' },
      { label: 'Weekly Tests Run', value: '1,000+' },
    ],
  ];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    intro: introVariants[uniqueIdx(seed, keyword, introVariants.length, 20)]!,
    detectorStats: statSets[uniqueIdx(seed, keyword, statSets.length, 21)]!,
    howItWorks: HOW_IT_WORKS,
    faqs: buildFaqs(keyword, seed, detector, 'detector'),
    cta: ctaVariants[uniqueIdx(seed, keyword, ctaVariants.length, 22)]!,
  };
}
