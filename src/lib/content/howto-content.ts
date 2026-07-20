import type { KeywordEntry } from '~/lib/pseo-data';
import { uniqueIdx, uniqueNum, smartTitleCase } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats, buildSteps } from '~/lib/content/content-combinator';

export interface HowToPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  category: string;
  readTime: number;
  updatedDate: string;
  intro: string;
  tocItems: string[];
  keyTakeaways: string[];
  stepsTitle: string;
  steps: { title: string; description: string; tip?: string }[];
  importantNote: string;
  whyHumanifyLabTitle: string;
  whyPoints: { title: string; description: string }[];
  inlineCtaTitle: string;
  inlineCtaSubtitle: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  relatedGuides: { title: string; slug: string; description: string }[];
}

// ── 8 Meta title formulas ─────────────────────────────────────────────────────
const META_TITLES: ((kw: string) => string)[] = [
  (kw) => `${kw} — Complete 2026 Guide | HumanifyLab`,
  (kw) => `How to ${kw}: Step-by-Step 2026 Tutorial | HumanifyLab`,
  (kw) => `${kw}: The Only Method That Works in 2026 | HumanifyLab`,
  (kw) => `${kw} Guide — Proven Techniques & Free Tool | HumanifyLab`,
  (kw) => `${kw}: Expert 2026 Walkthrough | HumanifyLab`,
  (kw) => `${kw} — Everything You Need to Know | HumanifyLab`,
  (kw) => `${kw}: 99.9% Success Rate Method | HumanifyLab`,
  (kw) => `The Definitive ${kw} Guide for 2026 | HumanifyLab`,
];

// ── 8 Meta description formulas ───────────────────────────────────────────────
const META_DESCS: ((kw: string) => string)[] = [
  (kw) => `${kw}: Step-by-step guide with proven techniques. Learn how to bypass AI detectors, humanize AI content, and achieve 99.9% undetectable results. Free tool included.`,
  (kw) => `Complete guide to ${kw}. Understand how AI detectors work, what actually bypasses them, and how to get 99.9% undetectable results every time. Free to try.`,
  (kw) => `${kw} explained. This 2026 guide covers every technique that works — from understanding detection signals to achieving 0% AI scores. Free tool included.`,
  (kw) => `Learn ${kw} with our expert 2026 guide. Step-by-step instructions, pro tips, and a free tool that achieves 99.9% bypass rates against all major detectors.`,
  (kw) => `${kw}: The complete 2026 tutorial. Discover why simple paraphrasing fails and what actually works. HumanifyLab achieves 99.9% bypass rates. Free to start.`,
  (kw) => `Master ${kw} with this comprehensive guide. Covers detection mechanisms, proven bypass methods, and step-by-step instructions. 99.9% success rate. Free tool.`,
  (kw) => `${kw} — updated for 2026. This guide explains exactly how AI detectors work and how to beat them with 99.9% reliability. Includes a free humanization tool.`,
  (kw) => `The definitive guide to ${kw}. Learn the science behind AI detection, the methods that work, and how to achieve 0% AI scores consistently. Free to try.`,
];

// ── 8 H1 formulas ─────────────────────────────────────────────────────────────
const H1S: ((kw: string) => string)[] = [
  (kw) => `${kw}: The Complete 2026 Guide`,
  (kw) => `How to ${kw} — Step-by-Step Tutorial`,
  (kw) => `${kw}: The Only Method That Works in 2026`,
  (kw) => `${kw} — Expert Guide with Proven Techniques`,
  (kw) => `${kw}: Everything You Need to Know`,
  (kw) => `The Definitive Guide to ${kw}`,
  (kw) => `${kw}: 99.9% Success Rate Method Explained`,
  (kw) => `${kw} — Complete Walkthrough for 2026`,
];

const CATEGORIES = ['AI Detection Guide', 'Humanization Tutorial', 'Academic Writing', 'Content Strategy', 'AI Tools Guide'];

const INTROS: ((keyword: string) => string)[] = [
  (keyword) => `If you've landed here, you're probably dealing with a frustrating problem: your AI-generated content keeps getting flagged, and you're not sure how to fix it. This guide covers everything you need to know about ${keyword} — from understanding why AI detectors flag content to the most effective methods for making your writing completely undetectable.`,
  (keyword) => `${keyword} is one of the most searched topics in the AI writing space right now — and for good reason. As AI detectors become more sophisticated, the gap between "good enough" and "actually undetectable" has widened dramatically. This guide gives you a complete, practical roadmap.`,
  (keyword) => `The short answer to ${keyword} is: use the right tool with the right approach. The long answer involves understanding how AI detectors actually work, what signals they look for, and how to systematically eliminate those signals from your content. That's exactly what this guide covers.`,
  (keyword) => `Most guides on ${keyword} give you surface-level advice that doesn't actually work against modern AI detectors. This one is different. We'll go deep on the technical mechanisms, show you what actually works in 2026, and give you a step-by-step process you can follow right now.`,
  (keyword) => `${keyword} sounds simple — but most people get it wrong. They try paraphrasing tools, manual rewrites, or basic synonym swaps. None of these work against modern detectors. This guide explains why, and shows you the only approach that consistently achieves 0% AI scores.`,
  (keyword) => `In 2026, ${keyword} requires more than a quick rewrite. AI detectors have become sophisticated enough to catch paraphrased content, lightly edited drafts, and even content that's been run through basic humanizers. This guide shows you what actually works — and why.`,
];

const STEPS_POOL: { title: string; description: string; tip?: string }[][] = [
  [
    { title: 'Understand what AI detectors actually measure', description: 'Before you can bypass AI detection, you need to understand what detectors look for. The three main signals are: (1) Perplexity — how predictable your word choices are. (2) Burstiness — how uniform your sentence lengths are. (3) Semantic entropy — how varied your vocabulary and phrasing patterns are. AI text scores low on all three.', tip: 'Run your original AI text through GPTZero or ZeroGPT first to see your baseline score. This helps you understand how much transformation is needed.' },
    { title: 'Choose the right humanization approach', description: 'There are three approaches: manual rewriting (time-consuming, inconsistent), paraphrasing tools (ineffective against modern detectors), and purpose-built AI humanizers like HumanifyLab (fast, reliable, 99.9% bypass rate). For consistent results, a purpose-built humanizer is the only approach that works reliably at scale.', tip: 'Avoid paraphrasing tools like QuillBot for bypassing AI detection — they only change surface-level wording, which modern detectors are specifically trained to catch.' },
    { title: 'Paste your content into HumanifyLab', description: 'Go to HumanifyLab.com and paste your AI-generated content into the editor. You can paste text directly or upload a document. HumanifyLab accepts any length — from a single paragraph to a full dissertation.', tip: 'For academic content, use the Academic tone setting. For marketing or blog content, Professional or Casual will produce more natural-sounding output.' },
    { title: 'Select Maximum humanization intensity', description: 'For bypassing strict detectors like Turnitin and Originality.AI, always use Maximum intensity. This applies the deepest linguistic transformation, targeting all three detection signals simultaneously. Standard intensity is sufficient for less strict detectors.', tip: 'If you\'re submitting to an institution that uses Turnitin, always use Maximum intensity. Turnitin\'s detection is among the most sophisticated available.' },
    { title: 'Verify before submitting', description: 'After humanization, test your content against the specific detector you need to bypass. HumanifyLab\'s output consistently scores 0-3% AI on all major detectors. If you see a higher score, run the content through HumanifyLab one more time.', tip: 'Use the free version of the target detector to verify. GPTZero, ZeroGPT, and Copyleaks all offer free detection — use them to confirm your content is clean before submitting.' },
  ],
  [
    { title: 'Identify the specific detector you need to bypass', description: 'Different detectors use different algorithms. Turnitin focuses on perplexity and burstiness. GPTZero uses dual-metric analysis. Originality.AI uses multi-model ensemble detection. Knowing your target detector helps you choose the right humanization settings.', tip: 'Ask your professor or employer which AI detector they use. This information is often in the assignment guidelines or company policy documents.' },
    { title: 'Prepare your AI-generated content', description: 'Before humanizing, do a quick review of your AI content. Remove any obvious AI tells — phrases like "certainly," "absolutely," "it\'s worth noting," or "in conclusion." These won\'t affect detection scores but will make the humanized output read more naturally.', tip: 'Common AI filler phrases to remove: "Certainly!", "Of course!", "It\'s important to note that", "In today\'s digital landscape", "In conclusion, it\'s clear that".' },
    { title: 'Run through HumanifyLab with appropriate settings', description: 'Paste your cleaned content into HumanifyLab. Select your tone (Academic for essays, Professional for business content, Casual for blog posts) and intensity (Maximum for strict detectors, Standard for general use). Click Humanize.', tip: 'For content over 2,000 words, consider humanizing in sections. This gives you more control over the output and allows you to review each section before moving to the next.' },
    { title: 'Review the humanized output', description: 'Read through the humanized content carefully. HumanifyLab preserves your meaning and structure, but you should always do a final review to ensure the output matches your voice and context. Make any personal adjustments needed.', tip: 'Add 2-3 personal anecdotes, specific examples, or unique insights after humanization. This further differentiates your content and makes it genuinely yours.' },
    { title: 'Test and submit with confidence', description: 'Run your final content through the target detector one more time. With HumanifyLab\'s 99.9% bypass rate, you should see a score of 0-3% AI. Submit your content with complete confidence.', tip: 'Keep a copy of both the original AI content and the humanized version. If questions arise later, you can demonstrate the transformation process.' },
  ],
];

const KEY_TAKEAWAYS_POOL: string[][] = [
  [
    'AI detectors measure perplexity, burstiness, and semantic entropy — not just word choice',
    'Simple paraphrasing tools do not bypass modern AI detectors like Turnitin and Originality.AI',
    'HumanifyLab achieves 99.9% bypass rates by targeting all three detection signals simultaneously',
    'Always verify your humanized content against the specific detector before submitting',
    'Maximum intensity is recommended for academic submissions and strict professional contexts',
  ],
  [
    'Understanding how AI detectors work is the foundation of bypassing them effectively',
    'The most reliable bypass method in 2026 is purpose-built AI humanization, not paraphrasing',
    'HumanifyLab processes content in under 10 seconds with zero data retention',
    'Testing against the target detector before submission eliminates all risk',
    'Humanized content from HumanifyLab typically reads better than the original AI output',
  ],
  [
    'Modern AI detectors use ensemble methods — multiple models running simultaneously — making simple rewrites ineffective',
    'Perplexity, burstiness, and semantic entropy are the three core signals every major detector measures',
    'HumanifyLab\'s 47-dimensional transformation targets all detection signals in a single pass',
    'Zero data retention means your content is never stored — complete privacy guaranteed',
    'The free plan is permanent — not a trial — giving you 500 words per run with no credit card required',
  ],
];

const WHY_POINTS_POOL: { title: string; description: string }[][] = [
  [
    { title: '99.9% Bypass Rate', description: 'Verified against all major AI detectors including Turnitin, GPTZero, and Originality.AI. Tested weekly against live detection systems.' },
    { title: 'Deep Linguistic Transformation', description: 'Targets perplexity, burstiness, entropy, and semantic patterns simultaneously — not just surface-level word swapping.' },
    { title: 'Results in Under 10 Seconds', description: 'Faster than any competitor. Even 10,000-word documents are processed in under 60 seconds.' },
    { title: 'Zero Data Retention', description: 'Your content is processed and immediately deleted. We never store, share, or use your text.' },
  ],
  [
    { title: 'Meaning Preserved 100%', description: 'Your original argument, facts, and structure remain completely intact. We transform how it sounds, not what it says.' },
    { title: 'All Detectors Supported', description: 'Bypasses Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks, Winston AI, Sapling, Content at Scale, and more.' },
    { title: 'Continuous Updates', description: 'Our team monitors every detector algorithm update and adjusts HumanifyLab to maintain 99.9% bypass rates.' },
    { title: 'Free to Start', description: 'No credit card required. Start humanizing immediately with our free plan.' },
  ],
  [
    { title: 'Scientific Foundation', description: 'Built on peer-reviewed research into AI detection mechanisms. We target the exact statistical signals every major detector measures.' },
    { title: 'Trusted by 450,000+ Users', description: 'Students, professionals, and content creators worldwide rely on HumanifyLab for consistent, reliable results.' },
    { title: 'Multi-Language Support', description: 'Humanize content in 20+ languages with the same 99.9% bypass rate. English, Spanish, French, German, and more.' },
    { title: 'API Available', description: 'Integrate HumanifyLab into your workflow via REST API. Automate humanization as part of your content pipeline.' },
  ],
];

const FAQ_POOL: ((keyword: string) => { q: string; a: string }[])[] = [
  (keyword: string) => [
    { q: `Does ${keyword} actually work in 2026?`, a: `Yes — when done correctly. Simple paraphrasing no longer works against modern detectors. Purpose-built AI humanizers like HumanifyLab, which target the specific statistical signals detectors measure, achieve 99.9% bypass rates consistently.` },
    { q: `How long does the process take?`, a: `With HumanifyLab, the entire process takes under 2 minutes: paste your content (30 seconds), click Humanize (under 10 seconds processing), review the output (1-2 minutes), verify against the detector (30 seconds). Total: under 3 minutes for most documents.` },
    { q: `Will the humanized content still be high quality?`, a: `Yes — and often better than the original. HumanifyLab's transformation process introduces natural variation, authentic phrasing, and human-like rhythm that makes the content more engaging and readable than typical AI output.` },
    { q: `Is this process detectable by human reviewers?`, a: `No. HumanifyLab produces genuinely natural writing that reads authentically to human reviewers. The transformation goes beyond surface-level changes to produce content with the natural variation and authenticity of human writing.` },
    { q: `What if I need to humanize content regularly?`, a: `HumanifyLab's paid plans are designed for regular use. The Professional plan ($19.99/month) offers 10,000 words per run with unlimited daily runs — ideal for students, content creators, and professionals who need consistent humanization.` },
  ],
  (keyword: string) => [
    { q: `What's the most common mistake people make with ${keyword}?`, a: `Using paraphrasing tools. QuillBot, Grammarly, and similar tools only change surface-level wording — they don't address the underlying statistical patterns that AI detectors measure. Modern detectors are specifically trained to catch paraphrased AI content.` },
    { q: `Does this work for all types of AI-generated content?`, a: `Yes. HumanifyLab handles essays, research papers, blog posts, marketing copy, reports, dissertations, and any other content type. The humanization approach adapts based on the content type and your selected tone settings.` },
    { q: `How do I know if my content has been successfully humanized?`, a: `Test it against the target detector. With HumanifyLab, you should consistently see scores of 0-3% AI on all major detectors. If you see a higher score, run the content through HumanifyLab one more time using Maximum intensity.` },
    { q: `Can I humanize content in languages other than English?`, a: `Yes. HumanifyLab supports 20+ languages including Spanish, French, German, Portuguese, Italian, Dutch, and more. The same 99.9% bypass rate applies across all supported languages.` },
    { q: `Is there a word limit?`, a: `Free plan: 500 words per run. Starter: 2,000 words. Professional: 10,000 words. Enterprise: unlimited. All plans support multiple runs per day.` },
  ],
  (keyword) => [
    { q: `How is ${keyword} different from just editing AI text manually?`, a: `Manual editing is time-consuming and inconsistent — most people don't know which specific patterns detectors look for. HumanifyLab targets the exact statistical signals (perplexity, burstiness, semantic entropy) that detectors measure, achieving 99.9% bypass rates in under 10 seconds.` },
    { q: `Will my content still be original after humanization?`, a: `Yes. HumanifyLab transforms the linguistic patterns of your content, not the ideas or arguments. The output is your original content expressed in a more natural, human-like way — not a copy of someone else's work.` },
    { q: `Can professors or employers tell if content has been humanized?`, a: `No. HumanifyLab produces genuinely natural writing that reads authentically to human reviewers. The transformation goes beyond surface-level changes to produce content with the natural variation and rhythm of human writing.` },
    { q: `Does HumanifyLab work on mobile devices?`, a: `Yes. HumanifyLab is fully responsive and works on any device — phone, tablet, or desktop. No app download required. You can humanize content anywhere, anytime.` },
    { q: `How do I get started with HumanifyLab?`, a: `Go to HumanifyLab.com, paste your content, and click Humanize. No account required for the free plan. You'll have your humanized content in under 10 seconds — no credit card, no sign-up.` },
  ],
  (keyword) => [
    { q: `What's the success rate for ${keyword}?`, a: `HumanifyLab achieves a 99.9% bypass rate across all major AI detectors. This rate is verified weekly against live detection systems and maintained through continuous algorithm updates as detectors evolve.` },
    { q: `Is it safe to use HumanifyLab for academic work?`, a: `HumanifyLab is widely used by students and researchers. Always review your institution's AI policy before submitting. Our Academic tone is specifically optimized for academic writing contexts and produces output that meets university standards.` },
    { q: `What happens if my content still gets flagged after humanization?`, a: `This is extremely rare with HumanifyLab's 99.9% bypass rate. If it happens, run the content through HumanifyLab one more time using Maximum intensity. Our support team is also available to help with any edge cases.` },
    { q: `Can I use HumanifyLab for content in multiple languages?`, a: `Yes. HumanifyLab supports 20+ languages including Spanish, French, German, Portuguese, Italian, Dutch, Japanese, and more. The same 99.9% bypass rate applies across all supported languages.` },
    { q: `Is there an API for integrating HumanifyLab into my workflow?`, a: `Yes. HumanifyLab offers a REST API on Professional and Enterprise plans. You can integrate humanization directly into your content production pipeline for automated, at-scale processing.` },
  ],
];

const RELATED_GUIDES = [
  { title: 'How to Bypass Turnitin AI Detection', slug: 'bypass-turnitin-ai-detection', description: 'Complete guide to bypassing Turnitin\'s AI detection with 99.9% success rate.' },
  { title: 'How to Bypass GPTZero', slug: 'bypass-gptzero', description: 'Step-by-step guide to making your content undetectable by GPTZero.' },
  { title: 'Best AI Humanizer Tools 2026', slug: 'best-ai-humanizer', description: 'Comprehensive comparison of the top AI humanizer tools available in 2026.' },
  { title: 'How to Humanize ChatGPT Text', slug: 'how-to-humanize-chatgpt', description: 'Detailed guide to transforming ChatGPT output into undetectable human writing.' },
  { title: 'Bypass Originality.AI — Complete Guide', slug: 'bypass-originality-ai', description: 'Everything you need to know about bypassing Originality.AI detection.' },
  { title: 'AI Humanizer for Students', slug: 'ai-humanizer-for-students', description: 'The complete student guide to using AI humanizers for academic writing.' },
];

export function generateHowToContent(entry: KeywordEntry): HowToPageData {
  const { keyword, seed } = entry;
  const capitalizedKeyword = smartTitleCase(keyword);

  const combo = buildPageStrings(capitalizedKeyword, seed, '', 'howto');
  const introFn = INTROS[uniqueIdx(seed, keyword, INTROS.length, 0)]!;
  const steps = STEPS_POOL[uniqueIdx(seed, keyword, STEPS_POOL.length, 1)]!;
  const keyTakeaways = KEY_TAKEAWAYS_POOL[uniqueIdx(seed, keyword, KEY_TAKEAWAYS_POOL.length, 2)]!;
  const whyPoints = WHY_POINTS_POOL[uniqueIdx(seed, keyword, WHY_POINTS_POOL.length, 3)]!;
  // faqFn removed — FAQs now use keyword-specific buildFaqs
  const category = CATEGORIES[uniqueIdx(seed, keyword, CATEGORIES.length, 5)]!;

  const tocSets = [
    ['What AI detectors actually measure', 'Why simple paraphrasing fails', `Step-by-step guide to ${keyword}`, 'Why HumanifyLab is the most reliable solution', 'Verification and testing', 'Frequently asked questions'],
    ['How AI detection works in 2026', 'The methods that actually work', `How to ${keyword} step by step`, 'Choosing the right tool', 'Testing your results', 'Common questions answered'],
    ['Understanding AI detection signals', 'Why most bypass methods fail', `The complete ${keyword} process`, 'HumanifyLab: the proven solution', 'Verifying your score', 'FAQs'],
  ];
  const tocItems = tocSets[uniqueIdx(seed, keyword, tocSets.length, 20)]!;

  const inlineCtas = [
    { title: 'Ready to Try It Yourself?', subtitle: 'Stop reading about it — start humanizing. HumanifyLab is free to use and takes under 10 seconds.' },
    { title: 'See the Results for Yourself', subtitle: 'Paste your AI content into HumanifyLab right now and watch it become completely undetectable.' },
    { title: 'Put This Guide Into Practice', subtitle: 'HumanifyLab makes everything in this guide automatic. Try it free — no credit card required.' },
    { title: 'Try HumanifyLab Free Now', subtitle: 'No sign-up, no credit card. Paste your content and get 0% AI score in under 10 seconds.' },
  ];
  const inlineCta = inlineCtas[uniqueIdx(seed, keyword, inlineCtas.length, 6)]!;

  const importantNotes = [
    'HumanifyLab is a writing enhancement tool designed to improve the quality and naturalness of AI-generated content. Always review your institution\'s or employer\'s policies regarding AI use before submitting humanized content.',
    'While HumanifyLab achieves a 99.9% bypass rate, no tool can guarantee 100% results in every situation. We recommend always testing your humanized content against the target detector before submitting.',
    'The techniques described in this guide are intended for legitimate use cases including content marketing, professional writing, and improving AI-generated drafts. Always use AI tools responsibly.',
    'HumanifyLab is used by content creators, marketers, and professionals worldwide. Always ensure your use complies with applicable guidelines and policies at your institution or workplace.',
  ];

  const whyTitles = [
    'Why HumanifyLab is the Most Reliable Solution',
    'Why 450,000+ Users Choose HumanifyLab',
    'The HumanifyLab Advantage',
    'Why HumanifyLab Outperforms Every Alternative',
  ];

  const relatedSets = [
    RELATED_GUIDES.slice(0, 4),
    RELATED_GUIDES.slice(1, 5),
    RELATED_GUIDES.slice(2, 6),
  ];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    category,
    readTime: uniqueNum(seed, keyword, 6, 12, 10),
    updatedDate: ['April 2026', 'March 2026', 'May 2026', 'February 2026'][uniqueIdx(seed, keyword, 4, 25)]!,
    intro: introFn(keyword),
    tocItems,
    keyTakeaways,
    stepsTitle: [`Step-by-Step: ${capitalizedKeyword}`, `How to ${capitalizedKeyword}`, `The ${capitalizedKeyword} Process`, `Your Guide to ${capitalizedKeyword}`][uniqueIdx(seed, keyword, 4, 26)]!,
    steps,
    importantNote: importantNotes[uniqueIdx(seed, keyword, importantNotes.length, 11)]!,
    whyHumanifyLabTitle: whyTitles[uniqueIdx(seed, keyword, whyTitles.length, 27)]!,
    whyPoints,
    inlineCtaTitle: inlineCta.title,
    inlineCtaSubtitle: inlineCta.subtitle,
    faqTitle: combo.faqTitle,
    faqs: buildFaqs(keyword, seed, '', 'howto'),
    relatedGuides: relatedSets[uniqueIdx(seed, keyword, relatedSets.length, 12)]!,
  };
}
