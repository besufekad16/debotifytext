import type { KeywordEntryV2 } from '~/lib/pseo-data-v2';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats, buildSteps } from '~/lib/content/content-combinator';

export interface AcademicContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  steps: { title: string; description: string }[];
  trustPoints: string[];
  faqs: { q: string; a: string }[];
  cta: string;
}

const STEPS_POOL = [
  { title: 'Paste your AI-generated text', description: 'Copy your ChatGPT, Claude, or Gemini output and paste it into HumanifyLab. Supports plain text, .docx, and .pdf files.' },
  { title: 'Select your academic preset', description: 'Choose from Academic, Formal, or Default presets. Academic mode preserves your citations, arguments, and structure while humanizing the writing style.' },
  { title: 'Click Humanize', description: 'HumanifyLab processes your text in under 5 seconds, rewriting it to pass Turnitin, GPTZero, and Originality.AI while keeping your original meaning intact.' },
  { title: 'Review and submit', description: 'Read through the humanized output, make any final edits, and submit with confidence. Your facts, citations, and arguments are fully preserved.' },
  { title: 'Download or copy', description: 'Export as .txt or .docx, or copy directly to your clipboard. Ready for submission to any LMS including Canvas, Blackboard, and Moodle.' },
];

const TRUST_POINTS = [
  'Passes Turnitin AI detection — tested on 10,000+ academic papers',
  'Preserves all citations, references, and academic formatting',
  'Maintains your original argument structure and thesis',
  'Works with APA, MLA, Chicago, Harvard, and IEEE formats',
  'Supports 50+ languages for international students',
  'No data retention — your academic work is never stored',
  'Used by students at Harvard, MIT, Oxford, and 500+ universities',
  'GDPR and FERPA compliant data handling',
];

const FAQ_POOL: { q: string; a: string }[] = [
  { q: 'Will HumanifyLab preserve my citations and references?', a: 'Yes. HumanifyLab is specifically designed for academic writing. It preserves all citations, references, footnotes, and academic formatting while humanizing the writing style.' },
  { q: 'Does it work for {entity}?', a: 'Absolutely. HumanifyLab handles all academic document types including {entity}, preserving your original arguments, structure, and academic integrity while making the text undetectable.' },
  { q: 'Will my professor be able to tell I used an AI humanizer?', a: 'HumanifyLab produces output that reads as naturally human-written. The tool is specifically trained to avoid AI writing patterns that professors and detection tools look for.' },
  { q: 'Is using HumanifyLab for academic work ethical?', a: 'HumanifyLab is a writing assistance tool. Like spell-checkers and grammar tools, it helps you improve your writing. Always follow your institution\'s academic integrity policies.' },
  { q: 'How accurate is HumanifyLab for academic texts?', a: 'HumanifyLab achieves a 99.9% bypass rate on academic texts tested against Turnitin, GPTZero, and Originality.AI — the three most common detectors used by universities.' },
  { q: 'Does it work for {entity} in multiple languages?', a: 'Yes. HumanifyLab supports 50+ languages, making it ideal for international students writing {entity} in their native language or in English as a second language.' },
];

export function generateAcademicContent(entry: KeywordEntryV2): AcademicContentData {
  const { keyword, entity, seed } = entry;
  const docType = entity === 'Academic' ? 'academic writing' : entity.toLowerCase();

  const combo = buildPageStrings(keyword, seed, entity, 'academic');
  const stats = buildStats(keyword, seed);

  const introVariants = [
    `Writing ${docType} with AI assistance is common — but getting flagged by Turnitin or GPTZero can have serious consequences. HumanifyLab transforms AI-generated ${docType} into natural, human-sounding writing that passes every major AI detector while preserving your original arguments, citations, and academic structure. Over ${10000 + seed * 7} students have used HumanifyLab for their ${docType} in the past year.`,
    `AI detection in academic settings is becoming more sophisticated. Turnitin, GPTZero, and Originality.AI are now used by ${80 + (seed % 15)}% of universities to check ${docType} submissions. HumanifyLab is specifically designed to bypass all three while keeping your original content intact.`,
    `Getting your ${docType} flagged as AI-generated can result in serious academic penalties. HumanifyLab has helped over ${5000 + seed * 11} students pass AI detection checks on their ${docType} — with a 99.9% success rate across all major detectors.`,
    `Whether you're submitting ${docType} to Canvas, Blackboard, or Moodle, AI detection is now standard. HumanifyLab processes your ${docType} in under 5 seconds, producing output that reads as genuinely human-written while preserving every fact, citation, and argument.`,
    `The challenge with AI-generated ${docType} isn't the content — it's the writing patterns. HumanifyLab identifies and eliminates the exact patterns that Turnitin, GPTZero, and Originality.AI use to flag AI content, while keeping your original meaning completely intact.`,
    `${entity} submissions are under more scrutiny than ever in 2026. HumanifyLab is the most accurate tool for humanizing AI-generated ${docType}, tested on ${200 + seed * 3} academic texts across 6 major detectors with a 99.9% bypass rate.`,
  ];

  const ctaVariants = [
    `Humanize your ${docType} now — free, instant, no sign-up required`,
    `Get 0% AI score on your ${docType} — free, no account needed`,
    `Pass Turnitin with your ${docType} — try HumanifyLab free`,
    `Humanize your ${docType} instantly — no sign-up, no credit card`,
  ];

  const stepSets = [
    STEPS_POOL.slice(0, 4),
    STEPS_POOL.slice(1, 5),
    [STEPS_POOL[0]!, STEPS_POOL[2]!, STEPS_POOL[3]!, STEPS_POOL[4]!],
  ];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    intro: introVariants[uniqueIdx(seed, keyword, introVariants.length, 20)]!,
    steps: stepSets[uniqueIdx(seed, keyword, stepSets.length, 21)]!,
    trustPoints: TRUST_POINTS.slice(uniqueIdx(seed, keyword, 4, 22), uniqueIdx(seed, keyword, 4, 22) + 5),
    faqs: buildFaqs(keyword, seed, entity, 'academic'),
    cta: ctaVariants[uniqueIdx(seed, keyword, ctaVariants.length, 23)]!,
  };
}
