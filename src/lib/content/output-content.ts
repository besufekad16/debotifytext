import type { KeywordEntryV4 } from '~/lib/pseo-data-v4';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildStats } from '~/lib/content/content-combinator';

export interface OutputPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  aiTool: string;
  features: { icon: string; title: string; description: string }[];
  steps: { number: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const META_TITLES: ((kw: string, tool: string) => string)[] = [
  (kw, tool) => `${kw} — Make ${tool} Text 99.9% Undetectable | HumanifyLab`,
  (kw, tool) => `${kw}: Best ${tool} Humanizer in 2026 | HumanifyLab`,
  (kw, tool) => `${kw} — ${tool} to Human Text Converter | HumanifyLab`,
  (kw, tool) => `${kw}: Bypass AI Detection for ${tool} Output | HumanifyLab`,
  (kw, tool) => `${kw} — Free ${tool} Text Humanizer | HumanifyLab`,
  (kw, tool) => `${kw}: Make ${tool} Sound Human | HumanifyLab`,
  (kw, tool) => `${kw} — ${tool} Undetectable AI Tool | HumanifyLab`,
  (kw, tool) => `${kw}: Convert ${tool} to Human Writing | HumanifyLab`,
];

const META_DESCS: ((kw: string, tool: string) => string)[] = [
  (kw, tool) => `${kw}: HumanifyLab makes ${tool} text undetectable with 99.9% bypass rate. Free plan, no sign-up, results in under 10 seconds.`,
  (kw, tool) => `${kw} — humanize ${tool} output with HumanifyLab. 99.9% bypass rate against Turnitin, GPTZero, and Originality.AI. Free to start.`,
  (kw, tool) => `${kw}: the best ${tool} humanizer in 2026. 99.9% bypass rate, meaning preserved, zero data stored. Try free today.`,
  (kw, tool) => `${kw} — make ${tool} text pass every AI detector. HumanifyLab: 99.9% bypass rate, free plan, no card needed.`,
  (kw, tool) => `${kw}: HumanifyLab converts ${tool} output to undetectable human writing in under 10 seconds. 99.9% bypass rate. Free plan available.`,
  (kw, tool) => `${kw} — bypass AI detection for ${tool} output with HumanifyLab. 99.9% success rate, zero data stored, free to start.`,
  (kw, tool) => `${kw}: undetectable ${tool} text with HumanifyLab. 99.9% bypass rate, meaning preserved, instant results. No sign-up required.`,
  (kw, tool) => `${kw} — convert ${tool} to human writing with HumanifyLab. 99.9% bypass rate, free plan, no credit card needed.`,
];

const H1S: ((kw: string, tool: string) => string)[] = [
  (kw, tool) => `${kw}: Make ${tool} Text 99.9% Undetectable`,
  (kw, tool) => `${kw} — The Best ${tool} Humanizer`,
  (kw, tool) => `${kw}: ${tool} to Human Text Converter`,
  (kw, tool) => `${kw} — Bypass AI Detection for ${tool} Output`,
  (kw, tool) => `${kw}: Make ${tool} Sound Human`,
  (kw, tool) => `${kw} — Free ${tool} Text Humanizer`,
  (kw, tool) => `${kw}: Convert ${tool} to Undetectable Writing`,
  (kw, tool) => `${kw} — ${tool} Humanizer with 99.9% Bypass Rate`,
];

const HERO_SUBTITLES: ((tool: string) => string)[] = [
  (tool) => `${tool} produces clean, structured text — but AI detectors spot it instantly. HumanifyLab transforms ${tool} output into authentic, natural writing that reads like a human wrote every word. 99.9% undetectable. Meaning preserved. Results in under 10 seconds.`,
  (tool) => `The problem with ${tool} isn't the ideas — it's the patterns. Every AI model leaves a statistical fingerprint. HumanifyLab erases that fingerprint completely, transforming your ${tool} content into writing that passes every AI detector.`,
  (tool) => `${tool} is a powerful writing tool. HumanifyLab makes it undetectable. Our 47-dimensional transformation strips the AI signature from your ${tool} output and replaces it with the natural variation of genuine human writing.`,
  (tool) => `Stop worrying about ${tool} detection. HumanifyLab's linguistic transformation engine takes your ${tool} content and rebuilds it — same ideas, same structure, zero AI detection. 99.9% bypass rate, free plan available.`,
];

const FEATURES_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '🤖', title: 'Optimized for AI Output', description: 'HumanifyLab is specifically built to transform AI-generated text into undetectable human writing.' },
    { icon: '🎯', title: '99.9% Bypass Rate', description: 'Verified against Turnitin, GPTZero, Originality.AI, and all major detectors. Tested weekly.' },
    { icon: '✅', title: 'Meaning Preserved', description: 'Your original ideas, facts, and structure remain intact. Only the AI signature is removed.' },
    { icon: '⚡', title: 'Results in Under 10 Seconds', description: 'No waiting. HumanifyLab processes AI output faster than any competitor.' },
  ],
  [
    { icon: '🧬', title: '47-Dimensional Transformation', description: 'Targets perplexity, burstiness, semantic entropy, and 44 other signals that detectors measure.' },
    { icon: '🔒', title: 'Zero Data Retention', description: 'Your AI output is deleted immediately after processing. Complete privacy.' },
    { icon: '🆓', title: 'Free Plan Available', description: '500 words per run, no credit card, no sign-up. Start humanizing AI output immediately.' },
    { icon: '🌍', title: '50+ Languages', description: 'Humanize AI output in 50+ languages with the same 99.9% bypass rate.' },
  ],
];

const STEPS_POOL: { number: string; title: string; description: string }[][] = [
  [
    { number: '1', title: 'Copy your AI output', description: 'Copy your text from your AI tool and paste it into HumanifyLab. Works with any AI output.' },
    { number: '2', title: 'Select your tone', description: 'Choose Academic, Professional, or Casual tone to match your context.' },
    { number: '3', title: 'Humanize in seconds', description: 'Click Humanize and get 0% AI score in under 10 seconds. Meaning preserved.' },
    { number: '4', title: 'Use with confidence', description: 'Your humanized content passes every detector permanently. Ready to submit or publish.' },
  ],
];

const FAQ_POOL: ((kw: string, tool: string) => { q: string; a: string }[])[] = [
  (kw, tool) => [
    { q: `Does HumanifyLab make ${tool} text undetectable?`, a: `Yes. HumanifyLab achieves a 99.9% bypass rate for ${tool} output against all major AI detectors including Turnitin, GPTZero, and Originality.AI. Verified weekly against live systems.` },
    { q: `How does HumanifyLab humanize ${tool} text?`, a: `HumanifyLab analyzes your ${tool} output across 47 linguistic dimensions — including perplexity, burstiness, and semantic entropy — then transforms each dimension to match natural human writing profiles.` },
    { q: `Is HumanifyLab free for ${tool} text?`, a: `Yes. The free plan handles up to 500 words per run with no credit card or sign-up required. The same 99.9% bypass rate applies on the free plan.` },
    { q: `Will my ${tool} content still make sense after humanization?`, a: `Yes. HumanifyLab preserves 100% of your original meaning, facts, and structure. Only the AI signature is removed. Your ${tool} content will read naturally and professionally.` },
    { q: `How long does it take to humanize ${tool} text?`, a: `Under 10 seconds for most ${tool} output. Long-form documents take under 60 seconds. Results appear in real time.` },
    { q: `Does HumanifyLab work for all ${tool} output types?`, a: `Yes. HumanifyLab handles all ${tool} output types — essays, blog posts, emails, reports, and more — with the same 99.9% bypass rate.` },
  ],
];

export function generateOutputContent(entry: KeywordEntryV4): OutputPageData {
  const { keyword, entity, seed } = entry;
  const aiTool = entity !== 'AI Tool' ? entity : 'ChatGPT';
  const capitalizedKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const combo = buildPageStrings(capitalizedKeyword, seed, entity, 'output');

  return {
    metaTitle: META_TITLES[uniqueIdx(seed, keyword, META_TITLES.length, 0)]!(capitalizedKeyword, aiTool),
    metaDescription: META_DESCS[uniqueIdx(seed, keyword, META_DESCS.length, 1)]!(capitalizedKeyword, aiTool),
    h1: H1S[uniqueIdx(seed, keyword, H1S.length, 2)]!(capitalizedKeyword, aiTool),
    heroSubtitle: HERO_SUBTITLES[uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3)]!(aiTool),
    badge: combo.badge,
    aiTool,
    features: FEATURES_POOL[uniqueIdx(seed, keyword, FEATURES_POOL.length, 4)]!,
    steps: STEPS_POOL[uniqueIdx(seed, keyword, STEPS_POOL.length, 5)]!,
    stats: buildStats(keyword, seed),
    faqs: FAQ_POOL[uniqueIdx(seed, keyword, FAQ_POOL.length, 6)]!(keyword, aiTool),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
