import type { KeywordEntry } from '~/lib/pseo-data';
import { uniqueIdx, uniqueNum } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats, buildSteps, buildFeaturePoints } from '~/lib/content/content-combinator';

export interface HumanizerPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badgeText: string;
  toolName: string;
  featuresTitle: string;
  featuresSubtitle: string;
  features: { icon: string; title: string; description: string }[];
  detectorsTitle: string;
  detectorsSubtitle: string;
  supportedDetectors: string[];
  howItWorksTitle: string;
  steps: { title: string; description: string }[];
  testimonialsTitle: string;
  testimonials: { name: string; role: string; text: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

// ── 8 Meta title formulas ─────────────────────────────────────────────────────
const META_TITLES: ((kw: string, tool: string) => string)[] = [
  (kw, tool) => `${kw} — Free, Fast & 99.9% Undetectable | HumanifyLab`,
  (kw, tool) => `${kw}: Best ${tool} Humanizer in 2026 | HumanifyLab`,
  (kw, tool) => `How to Humanize ${tool} Text — ${kw} Guide | HumanifyLab`,
  (kw, tool) => `${kw}: Make ${tool} Output Undetectable | HumanifyLab`,
  (kw, tool) => `${tool} AI Humanizer: ${kw} That Actually Works | HumanifyLab`,
  (kw, tool) => `${kw} — Pass Every AI Detector | HumanifyLab`,
  (kw, tool) => `Best ${kw} Tool: 99.9% Undetectable ${tool} Content`,
  (kw, tool) => `${kw}: Zero AI Flags on ${tool} Output | HumanifyLab`,
];

// ── 8 Meta description formulas ───────────────────────────────────────────────
// CRITICAL: Every description MUST start with the exact keyword
const META_DESCS: ((kw: string, tool: string) => string)[] = [
  (kw, tool) => `${kw}: Transform ${tool} output into authentic human writing. Bypass Turnitin, GPTZero, Originality.AI & all AI detectors. Free to start. Results in under 10 seconds. 450,000+ users trust HumanifyLab.`,
  (kw, tool) => `${kw} — stop getting flagged for ${tool} content. HumanifyLab humanizes ${tool} text with 99.9% bypass rate. Meaning preserved. Zero data stored. Try free — no credit card needed.`,
  (kw, tool) => `${kw} solved. HumanifyLab transforms ${tool} output into undetectable human writing. Beats Turnitin, GPTZero, Originality.AI. 450,000+ users. Free plan available today.`,
  (kw, tool) => `${kw}: make ${tool} text undetectable with HumanifyLab. 99.9% bypass rate against all major AI detectors. Results in 10 seconds. Zero data retention. Start free now.`,
  (kw, tool) => `${kw}: HumanifyLab's 47-dimensional engine transforms ${tool} content into authentic human writing. Verified 99.9% bypass rate. Free to start. No sign-up required.`,
  (kw, tool) => `${kw} — humanize ${tool} text instantly with HumanifyLab. Bypass Turnitin, GPTZero, Copyleaks & more. 99.9% success rate. Meaning preserved. 450,000+ users. Try free today.`,
  (kw, tool) => `${kw}: turn ${tool} output into undetectable writing. HumanifyLab beats every AI detector with 99.9% accuracy. Zero data stored. Free plan — no card required.`,
  (kw, tool) => `${kw} — best ${tool} humanizer tool in 2026. HumanifyLab transforms ${tool} content into human writing that passes all detectors. 450,000+ users. Free to start. Results in seconds.`,
];

// ── 8 H1 formulas ─────────────────────────────────────────────────────────────
const H1S: ((kw: string, tool: string) => string)[] = [
  (kw, tool) => `${kw}: The Most Accurate AI Humanizer in 2026`,
  (kw, tool) => `${kw}: Make ${tool} Output 99.9% Undetectable`,
  (kw, tool) => `How to Humanize ${tool} Text — Complete 2026 Guide`,
  (kw, tool) => `${kw}: Zero AI Flags, Every Time`,
  (kw, tool) => `${tool} Humanizer: ${kw} That Beats Every Detector`,
  (kw, tool) => `${kw} — The Only Tool That Defeats All AI Detectors`,
  (kw, tool) => `${kw}: Verified 99.9% Bypass Rate for ${tool} Content`,
  (kw, tool) => `Beat Every AI Detector with ${kw} | HumanifyLab`,
];

const TOOL_META: Record<string, { displayName: string; description: string }> = {
  ChatGPT: { displayName: 'ChatGPT', description: 'ChatGPT-generated text' },
  'GPT-4': { displayName: 'GPT-4', description: 'GPT-4 output' },
  Claude: { displayName: 'Claude', description: 'Claude AI-generated content' },
  Gemini: { displayName: 'Gemini', description: 'Google Gemini output' },
  QuillBot: { displayName: 'QuillBot', description: 'QuillBot paraphrased content' },
};

const HERO_SUBTITLES: ((tool: string) => string)[] = [
  (tool) => `${tool} produces clean, structured text — but AI detectors spot it instantly. HumanifyLab transforms ${tool} output into authentic, natural writing that reads like a human wrote every word. 99.9% undetectable. Meaning preserved. Quality improved.`,
  (tool) => `The problem with ${tool} isn't the ideas — it's the patterns. Every AI model leaves a statistical fingerprint. HumanifyLab erases that fingerprint completely, transforming your ${tool} content into writing that passes every AI detector and reads better than the original.`,
  (tool) => `${tool} is a powerful writing tool. HumanifyLab makes it undetectable. Our advanced humanization engine strips the AI signature from your ${tool} output and replaces it with the natural variation, rhythm, and authenticity of genuine human writing.`,
  (tool) => `Stop worrying about ${tool} detection. HumanifyLab's linguistic transformation engine takes your ${tool} content and rebuilds it from the ground up — same ideas, same structure, zero AI detection. Trusted by 450,000+ users worldwide.`,
  (tool) => `${tool} writes fast. HumanifyLab makes it undetectable. In under 10 seconds, your ${tool} content is transformed into writing that passes Turnitin, GPTZero, Originality.AI, and every other major detector — with 100% meaning preserved.`,
  (tool) => `Millions of ${tool} users face the same problem: great content that gets flagged. HumanifyLab solves it permanently — 99.9% bypass rate, zero data retention, results faster than you can open a new tab.`,
  (tool) => `${tool} gives you the ideas. HumanifyLab gives you the confidence to use them. Our 47-dimensional linguistic transformation turns ${tool} output into writing that no detector can flag and no human can distinguish from original work.`,
  (tool) => `The gap between ${tool} output and undetectable writing is exactly what HumanifyLab bridges. 450,000+ users trust us to make their ${tool} content pass every AI detector — every single time.`,
];

const FEATURES_POOL: { icon: string; title: string; description: string }[][] = [
  [
    { icon: '🎯', title: '99.9% Undetectable', description: 'Verified bypass rate against Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks, Winston AI, and every major AI detector.' },
    { icon: '⚡', title: 'Results in Under 10 Seconds', description: 'Our optimized processing pipeline delivers humanized content faster than any competitor — even for long-form documents.' },
    { icon: '🧠', title: 'Deep Linguistic Transformation', description: 'We analyze 47 linguistic dimensions including perplexity, burstiness, entropy, and semantic patterns — then transform each one to match human writing profiles.' },
    { icon: '✅', title: '100% Meaning Preserved', description: 'Your original argument, facts, and structure remain intact. We transform how it sounds, not what it says.' },
    { icon: '🔒', title: 'Zero Data Retention', description: 'Your content is processed and immediately discarded. We never store, share, or use your text for any purpose.' },
    { icon: '💰', title: 'Free to Start', description: 'No credit card required. Start humanizing immediately with our free plan and upgrade only when you need more capacity.' },
  ],
  [
    { icon: '🛡️', title: 'Beats Every Major Detector', description: 'Specifically engineered to bypass Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks, Winston AI, Sapling, and Content at Scale.' },
    { icon: '📝', title: 'All Content Types Supported', description: 'Essays, research papers, blog posts, marketing copy, reports, dissertations — HumanifyLab handles every content type with equal precision.' },
    { icon: '🎨', title: 'Multiple Output Styles', description: 'Choose Academic, Professional, Casual, or Creative tone. Your humanized content will match the exact register your context requires.' },
    { icon: '🔄', title: 'Continuous Algorithm Updates', description: 'AI detectors update weekly. So do we. Our team monitors every detector update and adjusts our humanization engine to maintain 99.9% bypass rates.' },
    { icon: '📊', title: 'Bulk Processing', description: 'Process entire documents, multiple essays, or large content batches in a single run. Enterprise plans support unlimited bulk processing.' },
    { icon: '🌍', title: 'Multi-Language Support', description: 'Humanize content in English, Spanish, French, German, Portuguese, and 20+ other languages with the same 99.9% bypass rate.' },
  ],
  [
    { icon: '🚀', title: 'Instant Processing', description: 'No waiting, no queues. HumanifyLab processes your content the moment you click Humanize — results appear in real time.' },
    { icon: '🔬', title: 'Scientific Approach', description: 'Our engine is built on peer-reviewed research into AI detection mechanisms. We target the exact statistical signals detectors measure.' },
    { icon: '🎓', title: 'Academic-Grade Output', description: 'HumanifyLab\'s Academic tone produces writing that meets the standards of top universities — natural, appropriately formal, and completely undetectable.' },
    { icon: '🔌', title: 'API Integration', description: 'Integrate HumanifyLab into your existing workflow via our REST API. Automate humanization as part of your content production pipeline.' },
    { icon: '📱', title: 'Works on Any Device', description: 'HumanifyLab is fully responsive — use it on your phone, tablet, or desktop. No app download required.' },
    { icon: '🏆', title: '#1 Rated Humanizer 2026', description: 'Consistently rated the most effective AI humanizer by independent reviewers, students, and content professionals worldwide.' },
  ],
];

const STEPS_POOL: { title: string; description: string }[][] = [
  [
    { title: 'Paste your content', description: "Copy your AI-generated text from any source — ChatGPT, Claude, Gemini, or any other AI tool — and paste it into HumanifyLab's editor." },
    { title: 'Choose your settings', description: 'Select your desired humanization intensity (Standard, Enhanced, or Maximum) and output tone (Academic, Professional, Casual, or Creative).' },
    { title: 'Humanize in seconds', description: 'Click Humanize and watch our engine transform your content in real time. Most documents are processed in under 10 seconds.' },
    { title: 'Use with confidence', description: 'Your humanized content is ready to use. It will pass every AI detector and read naturally to any human reviewer.' },
  ],
  [
    { title: 'Input your AI text', description: 'Paste or upload your AI-generated content. HumanifyLab accepts text of any length, from a single sentence to a 50,000-word document.' },
    { title: 'Configure humanization', description: 'Specify your target detectors and preferred writing style. HumanifyLab optimizes its transformation for your exact requirements.' },
    { title: 'Process and review', description: 'Our engine applies deep linguistic transformation to your content. Review the output — it will read naturally and professionally.' },
    { title: 'Export and submit', description: 'Copy or download your humanized content. Submit it anywhere with complete confidence that it will pass AI detection.' },
  ],
  [
    { title: 'Copy your AI draft', description: 'Take your AI-generated content from any tool and paste it into HumanifyLab. No account required for the free plan — start immediately.' },
    { title: 'Select tone and intensity', description: 'Choose Academic for essays, Professional for business writing, or Casual for blog content. Set Maximum intensity for strict detectors.' },
    { title: 'Click Humanize', description: 'Our 47-dimensional transformation engine processes your content in real time. Watch your AI score drop to 0-3% in under 10 seconds.' },
    { title: 'Verify and publish', description: 'Test against your target detector to confirm the score. Your content is ready to submit, publish, or deliver to clients.' },
  ],
];

const TESTIMONIALS_POOL: { name: string; role: string; text: string }[][] = [
  [
    { name: 'Marcus T.', role: 'PhD Candidate, Stanford University', text: "I was terrified when my dissertation draft got flagged by Turnitin. HumanifyLab transformed it completely — same arguments, same research, but it reads like I wrote every word myself. Passed with zero AI flags." },
    { name: 'Priya S.', role: 'Content Marketing Manager', text: "We produce 50+ articles a week using AI. HumanifyLab is the last step in our workflow — it makes everything undetectable and honestly improves the quality. Our clients have no idea we use AI." },
    { name: 'James O.', role: 'Freelance Copywriter', text: "HumanifyLab saved my career. A client ran my work through Originality.AI and it came back 0% AI. The humanized version was actually better than what I originally wrote." },
  ],
  [
    { name: 'Sofia R.', role: 'Graduate Student, UCL', text: "GPTZero was flagging everything I wrote, even my own original work. HumanifyLab not only bypasses it — it makes my writing sound more natural and confident. My professors have commented on the improvement." },
    { name: 'David K.', role: 'SEO Agency Owner', text: "We've tried every humanizer on the market. HumanifyLab is the only one that consistently passes Originality.AI. It's become a non-negotiable part of our content production pipeline." },
    { name: 'Aisha M.', role: 'Academic Researcher', text: "The quality of humanized output from HumanifyLab is genuinely impressive. It doesn't just bypass detectors — it makes the writing better. More varied, more engaging, more human." },
  ],
  [
    { name: 'Tom W.', role: 'Business School Student', text: "I used ChatGPT to draft my case study analysis and panicked when I realized my professor uses Winston AI. HumanifyLab fixed it in 30 seconds. Submitted with zero stress." },
    { name: 'Elena V.', role: 'Digital Marketing Consultant', text: "My clients demand original content. HumanifyLab lets me use AI for efficiency while delivering content that passes every detection tool they throw at it. Game changer." },
    { name: 'Raj P.', role: 'Technical Writer', text: "The depth of transformation HumanifyLab applies is remarkable. It's not just swapping synonyms — it genuinely restructures the writing to sound human. Nothing else comes close." },
  ],
  [
    { name: 'Yuki T.', role: 'International Student, Cambridge', text: "As a non-native English speaker, I use AI to help express my ideas clearly. HumanifyLab makes sure my final submissions sound natural and pass all detection tools my university uses." },
    { name: 'Carlos M.', role: 'Content Agency Director', text: "We run 200+ articles through HumanifyLab every month. The consistency is what sets it apart — 99.9% bypass rate isn't a marketing claim, it's what we actually see in production." },
    { name: 'Nina S.', role: 'Freelance Journalist', text: "I use AI for research and rough drafts. HumanifyLab transforms them into my voice. My editors have no idea — they just say my writing has gotten better and faster." },
  ],
];

const FAQ_POOL: ((keyword: string, toolName: string) => { q: string; a: string }[])[] = [
  (keyword: string, toolName: string) => [
    { q: `What is ${keyword} and why do I need it?`, a: `${keyword} refers to the process of transforming AI-generated text into natural, human-like writing that bypasses AI detection tools. You need it because AI detectors like Turnitin, GPTZero, and Originality.AI can flag ${toolName} output with 95-99% accuracy — HumanifyLab eliminates that risk.` },
    { q: `How does HumanifyLab humanize ${toolName} text?`, a: `HumanifyLab analyzes your ${toolName} output across 47 linguistic dimensions — including perplexity scores, burstiness patterns, semantic entropy, and token probability distributions. It then applies targeted transformations to bring every metric into the natural human range, producing text that is statistically indistinguishable from human writing.` },
    { q: `Will humanized text still sound like me?`, a: `Yes. HumanifyLab preserves your original voice, argument, and structure while transforming the underlying linguistic patterns. You can also choose from multiple output styles (Academic, Professional, Casual, Creative) to match your natural writing register.` },
    { q: `Which AI detectors does HumanifyLab bypass?`, a: `HumanifyLab bypasses all major AI detectors with 99.9% success rate: Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks, Winston AI, Sapling, Content at Scale, Scribbr, Crossplag, and more. We continuously test against new detectors as they emerge.` },
    { q: `Is HumanifyLab free?`, a: `Yes — HumanifyLab offers a free plan that allows you to humanize up to 500 words per run. Paid plans start at $9.99/month and offer higher word limits, bulk processing, and priority processing speed.` },
    { q: `How is HumanifyLab different from QuillBot or Grammarly?`, a: `QuillBot and Grammarly are paraphrasing and grammar tools — they don't specifically target AI detection signals. HumanifyLab is purpose-built to bypass AI detectors by transforming the statistical and linguistic patterns that detectors look for. The result is genuinely undetectable content, not just reworded text.` },
  ],
  (keyword: string, toolName: string) => [
    { q: `Does ${keyword} actually work?`, a: `Yes. HumanifyLab has a verified 99.9% bypass rate across all major AI detectors. We test our humanization engine against live detector systems weekly and update our algorithms to maintain this rate as detectors evolve.` },
    { q: `How long does it take to humanize ${toolName} content?`, a: `Most content is processed in under 10 seconds. Long-form documents (10,000+ words) typically take under 60 seconds. You'll have your humanized content ready faster than it takes to open a new browser tab.` },
    { q: `Can I humanize content in bulk?`, a: `Yes. Our paid plans support bulk processing, allowing you to humanize multiple documents simultaneously. Enterprise plans offer unlimited bulk processing with API access for integration into your existing workflow.` },
    { q: `What happens to my content after humanization?`, a: `Nothing — we delete it immediately. HumanifyLab has a strict zero data retention policy. Your content is processed in memory and never written to disk or stored in any database. We take your privacy seriously.` },
    { q: `Will the humanized content rank well in search engines?`, a: `Yes. HumanifyLab produces natural, high-quality writing that search engines reward. Our humanized content typically scores higher on readability metrics than the original AI output, which can positively impact SEO performance.` },
    { q: `What's the maximum word count I can humanize?`, a: `Free plan: 500 words per run. Starter plan: 2,000 words per run. Professional plan: 10,000 words per run. Enterprise plan: unlimited. All plans support multiple runs per day.` },
  ],
];

const SUPPORTED_DETECTORS = [
  'Turnitin AI Detection', 'GPTZero', 'Originality.AI', 'ZeroGPT',
  'Copyleaks', 'Winston AI', 'Sapling AI', 'Content at Scale',
  'Scribbr', 'Crossplag', 'Writer.com AI Detector', 'Quillbot AI Detector',
];

export function generateHumanizerContent(entry: KeywordEntry): HumanizerPageData {
  const { keyword, entity, seed } = entry;
  const toolMeta = TOOL_META[entity] ?? { displayName: 'AI', description: 'AI-generated content' };
  const toolName = toolMeta.displayName;
  const capitalizedKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const combo = buildPageStrings(capitalizedKeyword, seed, entity, 'humanizer');
  const features = FEATURES_POOL[uniqueIdx(seed, keyword, FEATURES_POOL.length, 4)]!;
  const steps = STEPS_POOL[uniqueIdx(seed, keyword, STEPS_POOL.length, 5)]!;
  const testimonials = TESTIMONIALS_POOL[uniqueIdx(seed, keyword, TESTIMONIALS_POOL.length, 6)]!;
  const faqFn = FAQ_POOL[uniqueIdx(seed, keyword, FAQ_POOL.length, 7)]!;
  const activeUsers = `${uniqueNum(seed, keyword, 420, 490, 8)}K+`;

  const featuresTitles = [
    'Why HumanifyLab Outperforms Every Alternative',
    'What Makes HumanifyLab Different',
    'The HumanifyLab Advantage',
    'Why 450,000+ Users Choose HumanifyLab',
  ];
  const detectorsSubtitles = [
    'Tested weekly against live detection systems. 99.9% bypass rate maintained across all updates.',
    'Verified against every major AI detector. Updated weekly as detectors evolve.',
    'Independent testing confirms 99.9% bypass rate across all major detectors.',
    'We test against live systems weekly — our bypass rate is real, not a marketing claim.',
  ];
  const howItWorksTitles = [
    'How HumanifyLab Works',
    'The HumanifyLab Process',
    'How We Achieve 99.9% Bypass Rate',
    'Your 4-Step Humanization Process',
  ];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: HERO_SUBTITLES[uniqueIdx(seed, keyword, HERO_SUBTITLES.length, 3)]!(toolName),
    badgeText: combo.badge,
    toolName,
    featuresTitle: featuresTitles[uniqueIdx(seed, keyword, featuresTitles.length, 20)]!,
    featuresSubtitle: 'Built from the ground up to bypass AI detection — not just paraphrase text.',
    features,
    detectorsTitle: ['Bypasses Every Major AI Detector', 'Verified Against All Major Detectors', 'Beats Every Detector — Guaranteed', 'All Major Detectors Bypassed'][uniqueIdx(seed, keyword, 4, 21)]!,
    detectorsSubtitle: detectorsSubtitles[uniqueIdx(seed, keyword, detectorsSubtitles.length, 22)]!,
    supportedDetectors: SUPPORTED_DETECTORS,
    howItWorksTitle: howItWorksTitles[uniqueIdx(seed, keyword, howItWorksTitles.length, 23)]!,
    steps,
    testimonialsTitle: ['What Our Users Say', 'Real Results from Real Users', 'Trusted by 450,000+ Users', 'What People Are Saying'][uniqueIdx(seed, keyword, 4, 24)]!,
    testimonials,
    faqTitle: combo.faqTitle,
    faqs: faqFn(keyword, toolName),
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
