import type { KeywordEntry } from '~/lib/pseo-data';

export interface UseCasePageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  audienceLabel: string;
  audienceType: 'student' | 'business' | 'writer' | 'default';
  painPointBadges: string[];
  problemTitle: string;
  problemIntro: string;
  problems: { icon: string; title: string; description: string }[];
  solutionTitle: string;
  solutionIntro: string;
  solutions: { icon: string; title: string; description: string }[];
  workflowTitle: string;
  workflowSteps: { title: string; description: string }[];
  testimonialsTitle: string;
  testimonials: { name: string; role: string; text: string }[];
  pricingTitle: string;
  pricingSubtitle: string;
  pricingTiers: { name: string; price: string; features: string[] }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

// ── 8 Meta title formulas ─────────────────────────────────────────────────────
const META_TITLES: ((kw: string, aud: string) => string)[] = [
  (kw) => `${kw} — Free, Fast & 99.9% Undetectable | HumanifyLab`,
  (kw, aud) => `${kw}: Built for ${aud} | HumanifyLab`,
  (kw, aud) => `${kw} — The #1 Tool for ${aud} | HumanifyLab`,
  (kw, aud) => `${kw}: ${aud} Trust HumanifyLab | 99.9% Bypass Rate`,
  (kw) => `${kw} — Bypass Every AI Detector | HumanifyLab`,
  (kw, aud) => `Best ${kw} Tool for ${aud} in 2026 | HumanifyLab`,
  (kw) => `${kw}: Zero AI Flags, Every Time | HumanifyLab`,
  (kw, aud) => `${kw} — Trusted by 450,000+ ${aud} | HumanifyLab`,
];

// ── 8 Meta description formulas ───────────────────────────────────────────────
const META_DESCS: ((kw: string, aud: string) => string)[] = [
  (kw, aud) => `${kw}: HumanifyLab is purpose-built for ${aud}. Bypass Turnitin, GPTZero, Originality.AI & all AI detectors. 99.9% success rate. Free to start. Trusted by 450,000+ users.`,
  (kw, aud) => `${aud} trust HumanifyLab for ${kw}. 99.9% bypass rate against all major AI detectors. Zero data retention. Results in under 10 seconds. Free plan available.`,
  (kw, aud) => `${kw} solved for ${aud}. HumanifyLab defeats Turnitin, GPTZero, Originality.AI & more with 99.9% success. Meaning preserved. Free to start today.`,
  (kw, aud) => `The best ${kw} tool for ${aud}. HumanifyLab achieves 99.9% undetectable results against all AI detectors. Zero data stored. Try free — no card needed.`,
  (kw, aud) => `${kw}: HumanifyLab is built for ${aud} who need reliable, undetectable AI content. 99.9% bypass rate. 450,000+ users. Free plan — no sign-up required.`,
  (kw, aud) => `${aud} use HumanifyLab for ${kw}. Beat Turnitin, GPTZero, Copyleaks & every major detector. 99.9% success rate. Zero data retention. Start free now.`,
  (kw, aud) => `${kw} for ${aud}: HumanifyLab's 47-dimensional engine achieves 99.9% bypass rates. Meaning preserved. Zero data stored. 450,000+ users trust us. Free to try.`,
  (kw, aud) => `Trusted by 450,000+ ${aud} for ${kw}. HumanifyLab bypasses all AI detectors with 99.9% accuracy. Results in 10 seconds. Free plan available today.`,
];

// ── 8 H1 formulas ─────────────────────────────────────────────────────────────
const H1S: ((kw: string, aud: string) => string)[] = [
  (kw, aud) => `${kw}: Built for ${aud}`,
  (kw, aud) => `${kw} — The #1 Choice for ${aud}`,
  (kw, aud) => `${kw}: Why ${aud} Trust HumanifyLab`,
  (kw, aud) => `${kw} for ${aud}: 99.9% Undetectable, Every Time`,
  (kw, aud) => `${kw} — Purpose-Built for ${aud}`,
  (kw, aud) => `${aud} Use HumanifyLab for ${kw}`,
  (kw, aud) => `${kw}: The ${aud} Solution That Actually Works`,
  (kw, aud) => `${kw} — Trusted by 450,000+ ${aud}`,
];

function detectAudience(keyword: string, entity: string): { label: string; type: UseCasePageData['audienceType'] } {
  const k = keyword.toLowerCase();
  if (k.includes('student') || k.includes('essay') || k.includes('academic') || k.includes('college') || k.includes('university') || k.includes('thesis') || k.includes('dissertation') || k.includes('homework') || k.includes('assignment')) {
    return { label: 'Students', type: 'student' };
  }
  if (k.includes('business') || k.includes('marketing') || k.includes('seo') || k.includes('agency') || k.includes('enterprise') || k.includes('professional') || k.includes('corporate')) {
    return { label: 'Business Professionals', type: 'business' };
  }
  if (k.includes('writer') || k.includes('blogger') || k.includes('journalist') || k.includes('copywriter') || k.includes('author') || k.includes('content creator') || k.includes('researcher')) {
    return { label: 'Writers & Creators', type: 'writer' };
  }
  return { label: 'Professionals', type: 'default' };
}

const STUDENT_PROBLEMS = [
  { icon: '😰', title: 'Turnitin Flags Your Work', description: 'You spent hours on your essay using AI assistance, and now Turnitin is flagging it as AI-generated. Your grade — and academic standing — are at risk.' },
  { icon: '⏰', title: 'Deadlines Are Brutal', description: 'You\'re juggling 5 courses, a part-time job, and a social life. AI helps you keep up — but getting caught using it could cost you everything.' },
  { icon: '🎓', title: 'Academic Integrity Pressure', description: 'Your institution has strict AI policies. You need a way to use AI assistance while ensuring your final submission is genuinely your own voice.' },
];

const BUSINESS_PROBLEMS = [
  { icon: '📉', title: 'AI Content Gets Flagged', description: 'Your clients or platforms are running AI detection on your content. Getting flagged damages your reputation and can cost you contracts.' },
  { icon: '⚡', title: 'Scale Without Sacrificing Quality', description: 'You need to produce high volumes of content efficiently, but raw AI output doesn\'t meet the quality bar your clients expect.' },
  { icon: '🔍', title: 'SEO Penalties for AI Content', description: 'Search engines are increasingly penalizing obviously AI-generated content. You need content that reads naturally and ranks well.' },
];

const WRITER_PROBLEMS = [
  { icon: '✍️', title: 'AI Assistance Gets Detected', description: 'You use AI to overcome writer\'s block and speed up your workflow, but editors and publishers are now running AI detection on submissions.' },
  { icon: '🎨', title: 'Losing Your Voice', description: 'AI-generated drafts don\'t sound like you. You need a way to use AI efficiency while maintaining your unique writing voice and style.' },
  { icon: '📊', title: 'Client Deliverables Under Scrutiny', description: 'Your clients are increasingly checking content for AI. You need to deliver work that passes detection while meeting tight deadlines.' },
];

const DEFAULT_PROBLEMS = [
  { icon: '🚫', title: 'AI Detection Blocks Your Work', description: 'AI detectors are flagging your content, creating friction in your workflow and putting your professional reputation at risk.' },
  { icon: '⏱️', title: 'Time Pressure', description: 'You need to produce quality content quickly. AI helps with speed, but the detection risk slows everything down.' },
  { icon: '💼', title: 'Professional Standards', description: 'Your industry demands high-quality, authentic-sounding content. Raw AI output doesn\'t meet that bar.' },
];

const STUDENT_SOLUTIONS = [
  { icon: '🛡️', title: 'Bypass Turnitin & GPTZero', description: 'HumanifyLab transforms your AI-assisted work into content that passes Turnitin, GPTZero, and every other academic AI detector with 99.9% success rate.' },
  { icon: '📝', title: 'Preserve Your Academic Voice', description: 'Choose Academic tone to ensure your humanized content sounds like a student — not a marketing bot. Your professor won\'t notice the difference.' },
  { icon: '⚡', title: 'Results Before Your Deadline', description: 'HumanifyLab processes your entire essay in under 10 seconds. Even if you\'re submitting at midnight, you have time to humanize and verify.' },
  { icon: '🔒', title: 'Complete Privacy', description: 'Your essays and papers are never stored. HumanifyLab processes your content in memory and deletes it immediately — no record of your submission exists.' },
];

const BUSINESS_SOLUTIONS = [
  { icon: '✅', title: 'Pass Every Client AI Check', description: 'HumanifyLab ensures your AI-generated content passes Originality.AI, Copyleaks, and every other detector your clients might use.' },
  { icon: '📈', title: 'Scale Content Production', description: 'Humanize hundreds of articles per day with our bulk processing feature. Maintain quality at scale without manual rewriting.' },
  { icon: '🎯', title: 'SEO-Optimized Output', description: 'Humanized content reads naturally — which search engines reward. Our output consistently outperforms raw AI content on readability metrics.' },
  { icon: '🔌', title: 'API Integration', description: 'Integrate HumanifyLab directly into your content workflow via our API. Automate humanization as part of your production pipeline.' },
];

const WRITER_SOLUTIONS = [
  { icon: '🎨', title: 'Maintain Your Unique Voice', description: 'HumanifyLab preserves your writing style and voice while eliminating AI detection signals. The output sounds like you — just faster.' },
  { icon: '📖', title: 'Better Than the Original', description: 'Our humanization process often improves the quality of AI drafts — adding natural variation, authentic phrasing, and genuine human rhythm.' },
  { icon: '🚀', title: 'Meet Any Deadline', description: 'Use AI for speed, HumanifyLab for quality. Produce publication-ready content in a fraction of the time without the detection risk.' },
  { icon: '🌍', title: 'Multi-Language Support', description: 'Write in 20+ languages with the same 99.9% bypass rate. HumanifyLab supports your global content needs.' },
];

const STUDENT_WORKFLOW = [
  { title: 'Draft with AI assistance', description: 'Use ChatGPT, Claude, or Gemini to create your initial draft. Focus on getting your ideas and arguments down — don\'t worry about AI detection at this stage.' },
  { title: 'Review and refine your draft', description: 'Read through the AI draft and make sure it captures your argument correctly. Add your own insights, examples, and personal perspective.' },
  { title: 'Paste into HumanifyLab', description: 'Copy your refined draft into HumanifyLab. Select Academic tone and Maximum intensity for the best results on academic AI detectors.' },
  { title: 'Verify against your institution\'s detector', description: 'Test the humanized output against Turnitin or GPTZero (whichever your institution uses). You should see a score of 0-3% AI.' },
  { title: 'Submit with confidence', description: 'Your humanized essay is ready to submit. It reads naturally, preserves your argument, and will pass any AI detection your institution uses.' },
];

const BUSINESS_WORKFLOW = [
  { title: 'Generate content at scale with AI', description: 'Use your preferred AI tool to generate content briefs, articles, product descriptions, or any other content type at scale.' },
  { title: 'Run through HumanifyLab in bulk', description: 'Upload your content batch to HumanifyLab. Our bulk processing feature handles hundreds of articles simultaneously.' },
  { title: 'Apply brand voice settings', description: 'Select Professional tone and configure output settings to match your brand voice. HumanifyLab adapts to your specific style requirements.' },
  { title: 'Quality review and publish', description: 'Review the humanized output for brand consistency. The content is ready to publish — it will pass any AI detection your clients or platforms use.' },
];

const WRITER_WORKFLOW = [
  { title: 'Use AI to overcome writer\'s block', description: 'When you\'re stuck, use AI to generate a rough draft or outline. Don\'t worry about quality at this stage — just get ideas on paper.' },
  { title: 'Add your unique perspective', description: 'Layer in your personal insights, specific examples, and unique voice. This is what makes your writing valuable — AI can\'t replicate it.' },
  { title: 'Humanize with HumanifyLab', description: 'Run your draft through HumanifyLab to eliminate AI detection signals while preserving your voice and additions.' },
  { title: 'Final polish and submit', description: 'Do a final read-through and make any last adjustments. Your content is now publication-ready and completely undetectable.' },
];

const TESTIMONIALS_BY_AUDIENCE: Record<string, { name: string; role: string; text: string }[][]> = {
  student: [
    [
      { name: 'Alex K.', role: 'Junior, University of Michigan', text: "I was using ChatGPT for my research papers and got flagged by Turnitin. HumanifyLab saved my GPA. Now I use it for every assignment — zero flags, every time." },
      { name: 'Fatima A.', role: 'Master\'s Student, LSE', text: "My dissertation was 40% flagged by Turnitin. After HumanifyLab, it came back 0%. The humanized version actually read better than my original draft." },
      { name: 'Carlos M.', role: 'Pre-Med Student, UCLA', text: "Medical school applications are brutal. HumanifyLab helped me polish my personal statement without any AI detection risk. Got into my top choice." },
    ],
    [
      { name: 'Yuki T.', role: 'PhD Candidate, Cambridge', text: "As an international student, I use AI to help with English expression. HumanifyLab makes sure my final submissions sound natural and pass all detection tools." },
      { name: 'Amara O.', role: 'Undergraduate, NYU', text: "I was skeptical at first, but HumanifyLab genuinely works. My essays pass GPTZero and Turnitin consistently. It's become part of my writing process." },
      { name: 'Liam B.', role: 'Law Student, Georgetown', text: "Law school writing is intense. HumanifyLab helps me use AI for research and drafting while ensuring my final submissions are completely clean." },
    ],
  ],
  business: [
    [
      { name: 'Sarah J.', role: 'Content Agency Owner', text: "We produce 200+ articles per month. HumanifyLab is the last step in our pipeline — it makes everything undetectable and our clients have no idea we use AI." },
      { name: 'Michael R.', role: 'SEO Director, TechCorp', text: "Our content was getting flagged by Originality.AI. After switching to HumanifyLab, we've had zero detection issues and our rankings have actually improved." },
      { name: 'Jennifer L.', role: 'Marketing Manager', text: "HumanifyLab pays for itself in the first article. The time saved on manual rewriting alone is worth 10x the subscription cost." },
    ],
    [
      { name: 'David P.', role: 'Freelance Content Strategist', text: "My clients run Originality.AI on everything I deliver. HumanifyLab ensures I never get flagged. It's non-negotiable in my workflow now." },
      { name: 'Emma W.', role: 'Digital Publisher', text: "We publish 50 articles a week. HumanifyLab's bulk processing feature has transformed our production capacity without sacrificing quality." },
      { name: 'Robert K.', role: 'E-commerce Director', text: "Product descriptions, category pages, blog posts — HumanifyLab handles all of it. Our content passes every check and converts better than before." },
    ],
  ],
  writer: [
    [
      { name: 'Nina S.', role: 'Freelance Journalist', text: "I use AI for research and rough drafts. HumanifyLab transforms them into my voice. My editors have no idea — they just say my writing has gotten better." },
      { name: 'Thomas H.', role: 'Published Author', text: "Writer's block used to cost me weeks. Now I use AI to break through it and HumanifyLab to make the output genuinely mine. My productivity has tripled." },
      { name: 'Zara M.', role: 'Copywriter', text: "HumanifyLab doesn't just bypass detection — it improves the writing. The humanized output has better rhythm, more natural phrasing, and reads more engagingly." },
    ],
    [
      { name: 'Chris A.', role: 'Content Creator, 500K subscribers', text: "I script my videos with AI assistance. HumanifyLab makes sure the scripts sound like me, not a robot. My audience engagement has actually increased." },
      { name: 'Priya N.', role: 'Technical Writer', text: "Technical documentation needs to be precise and natural. HumanifyLab achieves both — the output is accurate, readable, and completely undetectable." },
      { name: 'Marco V.', role: 'Ghostwriter', text: "My clients pay for my voice, not AI's. HumanifyLab lets me use AI for efficiency while delivering content that genuinely sounds like each client." },
    ],
  ],
};

const PRICING_TIERS = [
  { name: 'Free', price: '$0', features: ['500 words per run', '5 runs per day', 'Standard humanization', 'All major detectors'] },
  { name: 'Professional', price: '$19.99/mo', features: ['10,000 words per run', 'Unlimited runs', 'Maximum humanization', 'Priority processing', 'All detectors + API'] },
  { name: 'Enterprise', price: 'Custom', features: ['Unlimited words', 'Bulk processing', 'API integration', 'Dedicated support', 'Custom tone training'] },
];

const FAQ_POOL: ((keyword: string, audience: string) => { q: string; a: string }[])[] = [
  (keyword: string, audience: string) => [
    { q: `Is HumanifyLab specifically designed for ${audience}?`, a: `Yes. HumanifyLab offers tone settings specifically optimized for different use cases. ${audience === 'Students' ? 'The Academic tone produces output that sounds like a student — natural, appropriately formal, and free of marketing language.' : audience === 'Business Professionals' ? 'The Professional tone produces polished, business-appropriate content that meets enterprise quality standards.' : 'The Creative and Casual tones preserve your unique voice while eliminating AI detection signals.'}` },
    { q: `How does HumanifyLab handle ${keyword}?`, a: `HumanifyLab processes your content through a deep linguistic transformation engine that analyzes and modifies perplexity scores, burstiness patterns, semantic entropy, and token probability distributions. The result is content that is statistically indistinguishable from human writing — regardless of the original AI source.` },
    { q: `Is my content safe with HumanifyLab?`, a: `Completely. HumanifyLab has a strict zero data retention policy. Your content is processed in memory and immediately deleted after humanization. We never store, share, or use your content for any purpose. Your work remains entirely private.` },
    { q: `What AI detectors does HumanifyLab bypass?`, a: `All major detectors: Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks, Winston AI, Sapling, Content at Scale, Scribbr, Crossplag, Writer.com AI Detector, and more. We test against new detectors as they emerge and update our engine accordingly.` },
    { q: `How much does HumanifyLab cost?`, a: `HumanifyLab is free to start — no credit card required. The free plan allows 500 words per run with 5 daily runs. Paid plans start at $9.99/month for higher limits. The Professional plan at $19.99/month offers 10,000 words per run with unlimited daily runs.` },
  ],
  (keyword: string, audience: string) => [
    { q: `Why do ${audience} need an AI humanizer?`, a: `AI detectors have become extremely sophisticated. Turnitin, GPTZero, and Originality.AI can detect AI-generated content with 95-99% accuracy — even after light editing. ${audience} who use AI assistance need a reliable way to ensure their final submissions pass detection while maintaining quality.` },
    { q: `Will HumanifyLab change the meaning of my content?`, a: `No. HumanifyLab is specifically designed to preserve your original meaning, argument, and structure. We transform the linguistic patterns — not the content. Your ideas, facts, and conclusions remain exactly as you wrote them.` },
    { q: `How quickly can I humanize my content?`, a: `Most content is processed in under 10 seconds. A 5,000-word essay takes under 30 seconds. A 20,000-word dissertation takes under 2 minutes. You'll have your humanized content ready before your deadline, no matter how tight it is.` },
    { q: `Does humanized content rank well in search engines?`, a: `Yes — often better than raw AI content. HumanifyLab produces natural, varied writing that search engines reward. Our humanized content consistently scores higher on readability metrics, which positively impacts SEO performance.` },
    { q: `Can I try HumanifyLab before paying?`, a: `Absolutely. HumanifyLab's free plan lets you humanize up to 500 words per run with 5 daily runs — no credit card required. You can test it against your specific detector before deciding whether to upgrade.` },
  ],
  (keyword: string, audience: string) => [
    { q: `How does HumanifyLab compare to other tools for ${audience}?`, a: `Most humanizers use simple synonym replacement or light paraphrasing — which modern detectors are specifically trained to catch. HumanifyLab applies 47-dimensional linguistic transformation that targets the exact statistical signals detectors measure. The result is genuinely undetectable content, not just reworded text.` },
    { q: `Can ${audience} use HumanifyLab in bulk?`, a: `Yes. Our paid plans support bulk processing, allowing you to humanize multiple documents simultaneously. Enterprise plans offer unlimited bulk processing with API access for integration into existing workflows.` },
    { q: `Is there a free plan for ${audience}?`, a: `Yes. HumanifyLab's free plan is permanent — not a trial. You get 500 words per run and 5 daily runs forever, no credit card required. Upgrade only when you need more capacity.` },
    { q: `What languages does HumanifyLab support?`, a: `HumanifyLab supports 20+ languages including English, Spanish, French, German, Portuguese, Italian, Dutch, and more. The same 99.9% bypass rate applies across all supported languages.` },
    { q: `How does HumanifyLab protect my privacy?`, a: `HumanifyLab has a strict zero data retention policy. Your content is processed in memory and immediately deleted after humanization. We never store, share, or use your content for any purpose — your work remains entirely private.` },
  ],
];

export function generateUseCaseContent(entry: KeywordEntry): UseCasePageData {
  const { keyword, entity, seed } = entry;
  const audience = detectAudience(keyword, entity);
  const capitalizedKeyword = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const heroSubtitles: ((aud: string, kw: string) => string)[] = [
    (aud) => `${aud} face unique challenges with AI detection. HumanifyLab is built to solve them — delivering 99.9% undetectable content that preserves your voice, meets your standards, and passes every detector your institution or client uses.`,
    (aud) => `Whether you're submitting an essay, delivering client content, or publishing your work, AI detection is a real risk. HumanifyLab gives ${aud} the confidence to use AI assistance without the fear of getting flagged.`,
    (aud) => `${aud} trust HumanifyLab because it works — consistently, reliably, and without compromising the quality of their work. 99.9% bypass rate. Zero data retention. Results in under 10 seconds.`,
    (aud) => `The gap between AI-generated content and undetectable writing is exactly what HumanifyLab bridges for ${aud}. 450,000+ users. 99.9% bypass rate. Free to start.`,
    (aud) => `${aud} who use AI assistance need a reliable way to ensure their work passes detection. HumanifyLab delivers — 99.9% bypass rate, zero data retention, results in under 10 seconds.`,
    (aud) => `Stop worrying about AI detection. HumanifyLab is purpose-built for ${aud} — delivering 99.9% undetectable content that reads naturally and passes every detector your context requires.`,
  ];

  const heroFn = heroSubtitles[seed % heroSubtitles.length]!;
  const faqFn = FAQ_POOL[seed % FAQ_POOL.length]!;

  const problemsByAudience = {
    student: STUDENT_PROBLEMS,
    business: BUSINESS_PROBLEMS,
    writer: WRITER_PROBLEMS,
    default: DEFAULT_PROBLEMS,
  };

  const solutionsByAudience = {
    student: STUDENT_SOLUTIONS,
    business: BUSINESS_SOLUTIONS,
    writer: WRITER_SOLUTIONS,
    default: BUSINESS_SOLUTIONS,
  };

  const workflowByAudience = {
    student: STUDENT_WORKFLOW,
    business: BUSINESS_WORKFLOW,
    writer: WRITER_WORKFLOW,
    default: BUSINESS_WORKFLOW,
  };

  const testimonialPool = TESTIMONIALS_BY_AUDIENCE[audience.type] ?? TESTIMONIALS_BY_AUDIENCE['business']!;
  const testimonials = testimonialPool[seed % testimonialPool.length]!;

  const painBadgesByAudience: Record<string, string[]> = {
    student: ['Bypass Turnitin', 'Pass GPTZero', 'Academic tone', 'Zero detection risk', 'Results in 10 seconds'],
    business: ['Pass Originality.AI', 'Bulk processing', 'API access', 'Client-ready output', 'SEO-optimized'],
    writer: ['Preserve your voice', 'Beat any detector', 'Publication-ready', 'Multi-language', 'Instant results'],
    default: ['99.9% bypass rate', 'All detectors', 'Zero data retention', 'Free to start', 'Under 10 seconds'],
  };

  return {
    metaTitle: META_TITLES[seed % META_TITLES.length]!(capitalizedKeyword, audience.label),
    metaDescription: META_DESCS[seed % META_DESCS.length]!(capitalizedKeyword, audience.label),
    h1: H1S[seed % H1S.length]!(capitalizedKeyword, audience.label),
    heroSubtitle: heroFn(audience.label, keyword),
    audienceLabel: audience.label,
    audienceType: audience.type,
    painPointBadges: painBadgesByAudience[audience.type] ?? painBadgesByAudience['default']!,
    problemTitle: `The Challenges ${audience.label} Face with AI Detection`,
    problemIntro: `AI detection has become a serious obstacle for ${audience.label.toLowerCase()}. Here's what you're up against — and how HumanifyLab solves it.`,
    problems: problemsByAudience[audience.type],
    solutionTitle: `How HumanifyLab Solves These Problems`,
    solutionIntro: `HumanifyLab is purpose-built for ${audience.label.toLowerCase()}. Every feature is designed to address the specific challenges you face.`,
    solutions: solutionsByAudience[audience.type],
    workflowTitle: `The ${audience.label} Workflow with HumanifyLab`,
    workflowSteps: workflowByAudience[audience.type],
    testimonialsTitle: `What ${audience.label} Say About HumanifyLab`,
    testimonials,
    pricingTitle: 'Simple, Transparent Pricing',
    pricingSubtitle: `Start free. Upgrade when you need more. No hidden fees.`,
    pricingTiers: PRICING_TIERS,
    faqTitle: `Frequently Asked Questions for ${audience.label}`,
    faqs: faqFn(keyword, audience.label),
    finalCtaTitle: `Start Free — Built for ${audience.label}`,
    finalCtaSubtitle: `Join 450,000+ ${audience.label.toLowerCase()} who trust HumanifyLab to make their AI content completely undetectable. No credit card required.`,
  };
}
