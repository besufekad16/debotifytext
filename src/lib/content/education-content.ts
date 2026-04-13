import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats } from '~/lib/content/content-combinator';

export interface EducationPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  subject: string;
  features: { icon: string; title: string; description: string }[];
  steps: { number: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const META_TITLES: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${kw} — Pass Turnitin with 99.9% Success | HumanifyLab`,
  (kw, subj) => `${kw}: Best AI Humanizer for ${subj} Students | HumanifyLab`,
  (kw, subj) => `${kw} — Undetectable AI ${subj} Writing | HumanifyLab`,
  (kw, subj) => `${kw}: Bypass AI Detection in ${subj} Essays | HumanifyLab`,
  (kw, subj) => `${kw} — Free ${subj} Essay AI Humanizer | HumanifyLab`,
  (kw, subj) => `${kw}: Get 0% AI Score on ${subj} Papers | HumanifyLab`,
  (kw, subj) => `${kw} — ${subj} Essay Humanizer That Works | HumanifyLab`,
  (kw, subj) => `${kw}: Humanize ${subj} AI Writing in Seconds | HumanifyLab`,
];

const META_DESCS: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${kw}: HumanifyLab makes your AI ${subj.toLowerCase()} writing undetectable with 99.9% bypass rate. Free plan, no sign-up, results in under 10 seconds.`,
  (kw, subj) => `${kw} — humanize your AI ${subj.toLowerCase()} essays with HumanifyLab. 99.9% bypass rate against Turnitin and GPTZero. Free to start, no card needed.`,
  (kw, subj) => `${kw}: the best tool for ${subj.toLowerCase()} students. 99.9% Turnitin bypass rate, meaning preserved, zero data stored. Try free today.`,
  (kw, subj) => `${kw} — bypass AI detection in your ${subj.toLowerCase()} papers with HumanifyLab. 99.9% success rate, free plan, no credit card needed.`,
  (kw, subj) => `${kw}: HumanifyLab humanizes AI ${subj.toLowerCase()} writing in under 10 seconds. 99.9% bypass rate, 450,000+ students trust HumanifyLab.`,
  (kw, subj) => `${kw} — get 0% AI score on your ${subj.toLowerCase()} essays with HumanifyLab. 99.9% bypass rate, free plan, no sign-up required.`,
  (kw, subj) => `${kw}: undetectable AI ${subj.toLowerCase()} writing with HumanifyLab. 99.9% bypass rate, meaning preserved, instant results. Free plan available.`,
  (kw, subj) => `${kw} — ${subj.toLowerCase()} essay AI humanizer with 99.9% bypass rate. Free plan, no credit card, instant results. Start now.`,
];

const H1S: ((kw: string, subj: string) => string)[] = [
  (kw, subj) => `${kw}: Pass Turnitin with 99.9% Success`,
  (kw, subj) => `${kw} — The Best AI Humanizer for ${subj} Students`,
  (kw, subj) => `${kw}: Bypass AI Detection in ${subj} Essays`,
  (kw, subj) => `${kw} — Undetectable AI ${subj} Writing`,
  (kw, subj) => `${kw}: Get 0% AI Score on ${subj} Papers`,
  (kw, subj) => `${kw} — Free ${subj} Essay AI Humanizer`,
  (kw, subj) => `${kw}: Humanize ${subj} AI Writing in Seconds`,
  (kw, subj) => `${kw} — ${subj} Essay Humanizer That Actually Works`,
];

const HERO_SUBTITLES: ((subj: string) => string)[] = [
  (subj) => `${subj} students use AI to draft essays, research papers, and assignments. But Turnitin and GPTZero flag AI content instantly. HumanifyLab transforms your AI ${subj.toLowerCase()} writing into authentic human text that passes every detector — 99.9% bypass rate, meaning preserved, free plan available.`,
  (subj) => `Writing ${subj.toLowerCase()} papers with AI is efficient. Getting caught is not. HumanifyLab makes your AI ${subj.toLowerCase()} writing undetectable — 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. Free plan, no sign-up required.`,
  (subj) => `${subj} professors use Turnitin and GPTZero to detect AI writing. HumanifyLab defeats both with a 99.9% bypass rate. Your ${subj.toLowerCase()} essays will read naturally, preserve your arguments, and pass every detector. Free to start.`,
  (subj) => `Thousands of ${subj.toLowerCase()} students trust HumanifyLab to make their AI writing undetectable. 99.9% bypass rate, results in under 10 seconds, free plan with no sign-up. Your ${subj.toLowerCase()} papers will pass Turnitin every time.`,
];

const FEATURES_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '🎓', title: 'Academic Tone Preset', description: 'Specifically tuned for university-level writing. Passes Turnitin with 0-3% AI scores consistently.' },
    { icon: '🎯', title: '99.9% Turnitin Bypass', description: 'Verified weekly against live Turnitin systems. The most reliable academic AI humanizer available.' },
    { icon: '✅', title: 'Meaning Preserved', description: 'Your original arguments, citations, and structure remain intact. Only the AI signature is removed.' },
    { icon: '🔒', title: 'Zero Data Retention', description: 'Your academic work is never stored or shared. Complete privacy on every plan.' },
  ],
  [
    { icon: '📚', title: 'Works for All Academic Content', description: 'Essays, research papers, theses, dissertations, assignments — HumanifyLab handles all academic content types.' },
    { icon: '⚡', title: 'Results in Under 10 Seconds', description: 'No waiting before deadlines. HumanifyLab processes academic content faster than any competitor.' },
    { icon: '🆓', title: 'Free Plan for Students', description: '500 words per run, no credit card, no sign-up. Perfect for individual assignments.' },
    { icon: '🌍', title: '50+ Languages', description: 'International students can humanize academic writing in their language with the same 99.9% bypass rate.' },
  ],
];

const STEPS_POOL: { number: string; title: string; description: string }[][] = [
  [
    { number: '1', title: 'Paste your AI essay', description: 'Copy your AI-generated academic content and paste it into HumanifyLab. Works with any length.' },
    { number: '2', title: 'Select Academic tone', description: 'Choose the Academic tone preset — specifically tuned for university-level writing standards.' },
    { number: '3', title: 'Humanize in seconds', description: 'Click Humanize and get 0-3% AI score in under 10 seconds. Your arguments are preserved.' },
    { number: '4', title: 'Submit with confidence', description: 'Your humanized essay passes Turnitin and GPTZero permanently. Ready to submit.' },
  ],
];

const FAQ_POOL: ((kw: string, subj: string) => { q: string; a: string }[])[] = [
  (kw, subj) => [
    { q: `Does HumanifyLab work for ${subj.toLowerCase()} essays?`, a: `Yes. HumanifyLab is used by thousands of ${subj.toLowerCase()} students to make their AI writing undetectable. It achieves a 99.9% bypass rate against Turnitin and GPTZero for academic content.` },
    { q: `Will my ${subj.toLowerCase()} essay still make sense after humanization?`, a: `Yes. HumanifyLab preserves 100% of your original arguments, citations, and structure. Only the AI signature is removed. Your ${subj.toLowerCase()} essay will read naturally and academically.` },
    { q: `Is HumanifyLab free for ${subj.toLowerCase()} students?`, a: `Yes. The free plan handles up to 500 words per run with no credit card or sign-up required. Perfect for individual ${subj.toLowerCase()} assignments.` },
    { q: `Does HumanifyLab bypass Turnitin for ${subj.toLowerCase()} papers?`, a: `Yes. HumanifyLab achieves a 99.9% Turnitin bypass rate for academic content, verified weekly against live Turnitin systems. The Academic tone preset is specifically tuned for university-level writing.` },
    { q: `Is it safe to use HumanifyLab for academic work?`, a: `HumanifyLab has zero data retention — your academic work is processed and immediately deleted. We never store, share, or use your content. Always review your institution's AI policy before submitting.` },
    { q: `How long does it take to humanize a ${subj.toLowerCase()} essay?`, a: `Under 10 seconds for most essays. A 5,000-word ${subj.toLowerCase()} research paper takes under 30 seconds. Results appear in real time.` },
  ],
];

export function generateEducationContent(entry: KeywordEntryV4): EducationPageData {
  const { keyword, entity, seed } = entry;
  const subject = entity !== 'Academic' ? entity : 'Academic';
  const capitalizedKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const combo = buildPageStrings(capitalizedKeyword, seed, entity, 'education');

  return {
    metaTitle: META_TITLES[uniqueIdx(seed, keyword, META_TITLES.length, 0)]!(capitalizedKeyword, subject),
    metaDescription: META_DESCS[uniqueIdx(seed, keyword, META_DESCS.length, 1)]!(capitalizedKeyword, subject),
    h1: H1S[uniqueIdx(seed, keyword, H1S.length, 2)]!(capitalizedKeyword, subject),
    heroSubtitle: HERO_SUBTITLES[uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3)]!(subject),
    badge: combo.badge,
    subject,
    features: FEATURES_POOL[uniqueIdx(seed, keyword, FEATURES_POOL.length, 4)]!,
    steps: STEPS_POOL[uniqueIdx(seed, keyword, STEPS_POOL.length, 5)]!,
    stats: buildStats(keyword, seed),
    faqs: FAQ_POOL[uniqueIdx(seed, keyword, FAQ_POOL.length, 6)]!(keyword, subject),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
