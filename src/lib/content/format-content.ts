import type { KeywordEntryV3 } from '~/lib/pseo-data-v3';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildSteps, buildStats } from '~/lib/content/content-combinator';

export interface FormatContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  stats: { value: string; label: string }[];
  formatTitle: string;
  formatPoints: { icon: string; title: string; description: string }[];
  stepsTitle: string;
  steps: { number: string; title: string; description: string }[];
  beforeAfter: { label: string; before: string; after: string };
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const FORMAT_CONTEXT: Record<string, { icon: string; audience: string; purpose: string; detector: string }> = {
  email:                { icon: '📧', audience: 'email marketers and professionals', purpose: 'email campaigns and outreach', detector: 'spam filters and AI detection' },
  'linkedin post':      { icon: '💼', audience: 'LinkedIn users and professionals', purpose: 'LinkedIn content and thought leadership', detector: 'LinkedIn AI detection' },
  resume:               { icon: '📄', audience: 'job seekers', purpose: 'resumes and CVs', detector: 'ATS systems and recruiter AI tools' },
  cv:                   { icon: '📋', audience: 'job seekers', purpose: 'CVs and professional profiles', detector: 'ATS systems and recruiter AI tools' },
  'cover letter':       { icon: '✉️', audience: 'job seekers', purpose: 'cover letters and job applications', detector: 'ATS systems and recruiter review' },
  'youtube script':     { icon: '🎬', audience: 'YouTubers and video creators', purpose: 'YouTube scripts and video content', detector: 'YouTube AI detection and audience authenticity' },
  'podcast script':     { icon: '🎙️', audience: 'podcasters', purpose: 'podcast scripts and show notes', detector: 'platform AI detection and listener authenticity' },
  'product description':{ icon: '🛍️', audience: 'ecommerce sellers and marketers', purpose: 'product descriptions and listings', detector: 'marketplace AI detection and SEO algorithms' },
  'blog post':          { icon: '📝', audience: 'bloggers and content creators', purpose: 'blog posts and articles', detector: 'Google AI detection and publisher standards' },
  tweet:                { icon: '🐦', audience: 'Twitter/X users', purpose: 'tweets and social media posts', detector: 'Twitter AI detection and engagement algorithms' },
  'instagram caption':  { icon: '📸', audience: 'Instagram creators', purpose: 'Instagram captions and social content', detector: 'Instagram AI detection and engagement algorithms' },
  'facebook post':      { icon: '👍', audience: 'Facebook marketers', purpose: 'Facebook posts and social content', detector: 'Facebook AI detection and reach algorithms' },
  'tiktok script':      { icon: '📱', audience: 'TikTok creators', purpose: 'TikTok scripts and video content', detector: 'TikTok AI detection and FYP algorithms' },
  'press release':      { icon: '📰', audience: 'PR professionals and marketers', purpose: 'press releases and media pitches', detector: 'journalist AI detection and media credibility' },
  newsletter:           { icon: '📬', audience: 'newsletter writers and marketers', purpose: 'newsletters and email campaigns', detector: 'email platform AI detection and spam filters' },
  'landing page':       { icon: '🖥️', audience: 'marketers and web designers', purpose: 'landing pages and conversion copy', detector: 'Google AI detection and conversion algorithms' },
  'sales page':         { icon: '💰', audience: 'sales teams and marketers', purpose: 'sales pages and conversion content', detector: 'platform AI detection and buyer trust' },
  'ad copy':            { icon: '📣', audience: 'advertisers and marketers', purpose: 'ad copy and promotional content', detector: 'ad platform AI detection and policy review' },
  'google ad':          { icon: '🔍', audience: 'Google Ads specialists', purpose: 'Google Ads copy and search ads', detector: 'Google Ads policy review and AI detection' },
  'facebook ad':        { icon: '📊', audience: 'Facebook Ads specialists', purpose: 'Facebook ad copy and campaigns', detector: 'Meta Ads policy review and AI detection' },
  'pitch deck':         { icon: '📊', audience: 'entrepreneurs and sales teams', purpose: 'pitch decks and investor presentations', detector: 'investor scrutiny and AI detection' },
  'business proposal':  { icon: '📑', audience: 'business professionals', purpose: 'business proposals and RFP responses', detector: 'client review and AI detection' },
  'executive summary':  { icon: '📋', audience: 'executives and consultants', purpose: 'executive summaries and board reports', detector: 'board review and AI detection' },
  'annual report':      { icon: '📈', audience: 'corporate communications teams', purpose: 'annual reports and investor communications', detector: 'regulatory review and investor scrutiny' },
  'case study':         { icon: '🔬', audience: 'marketers and consultants', purpose: 'case studies and success stories', detector: 'client review and publication standards' },
  'white paper':        { icon: '📃', audience: 'thought leaders and marketers', purpose: 'white papers and research reports', detector: 'industry publication standards and AI detection' },
  'technical documentation': { icon: '⚙️', audience: 'technical writers and developers', purpose: 'technical docs and API documentation', detector: 'developer community standards and AI detection' },
  'job description':    { icon: '💼', audience: 'HR professionals and recruiters', purpose: 'job descriptions and hiring content', detector: 'job board AI detection and candidate trust' },
  'cold email':         { icon: '📨', audience: 'sales professionals and marketers', purpose: 'cold emails and outreach campaigns', detector: 'spam filters and AI detection' },
};

const DEFAULT_FMT = { icon: '📝', audience: 'content creators', purpose: 'written content', detector: 'AI detection tools' };

const TITLES = [
  (kw: string, icon: string) => `${icon} ${kw} — AI Humanizer | HumanifyLab`,
  (kw: string, icon: string) => `${kw}: Undetectable AI Content ${icon} | HumanifyLab`,
  (kw: string, icon: string) => `${icon} Humanize AI ${kw} — Pass Every Detector | HumanifyLab`,
  (kw: string, icon: string) => `${kw} ${icon} — Best AI Humanizer 2026 | HumanifyLab`,
  (kw: string, icon: string) => `${icon} ${kw}: AI Content That Sounds Human | HumanifyLab`,
  (kw: string, icon: string) => `${kw} — Bypass AI Detection ${icon} | HumanifyLab`,
];

const DESCRIPTIONS = [
  (kw: string, audience: string, purpose: string) => `HumanifyLab helps ${audience} humanize AI-generated ${purpose}. 99.9% bypass rate, instant results, no sign-up required. Free to try.`,
  (kw: string, audience: string, purpose: string) => `${kw}: Transform AI-generated ${purpose} into natural, undetectable writing. Trusted by ${audience}. Free plan available.`,
  (kw: string, audience: string, purpose: string) => `The best AI humanizer for ${kw}. HumanifyLab produces ${purpose} that passes every AI detector. 99.9% bypass rate. Try free today.`,
  (kw: string, audience: string, purpose: string) => `${audience.charAt(0).toUpperCase() + audience.slice(1)} use HumanifyLab to humanize ${purpose} and bypass AI detection. Instant results, zero data stored.`,
  (kw: string, audience: string, purpose: string) => `Need ${kw}? HumanifyLab delivers undetectable AI ${purpose} in under 10 seconds. No watermark, 50+ languages, free plan available.`,
  (kw: string, audience: string, purpose: string) => `${kw} — HumanifyLab is the trusted AI humanizer for ${audience}. Bypass AI detection in ${purpose} with 99.9% accuracy.`,
];

const H1S = [
  (kw: string, icon: string) => `${icon} ${kw}: AI Humanizer for Perfect Results`,
  (kw: string, icon: string) => `${kw} ${icon} — Undetectable AI Content`,
  (kw: string, icon: string) => `${icon} Humanize AI ${kw} Instantly`,
  (kw: string, icon: string) => `${kw}: Bypass AI Detection ${icon}`,
  (kw: string, icon: string) => `${icon} The Best AI Humanizer for ${kw}`,
  (kw: string, icon: string) => `${kw} ${icon} — AI Content That Passes Every Check`,
];

const FAQ_SETS = [
  [
    { q: 'Can HumanifyLab humanize AI content for this format?', a: 'Yes. HumanifyLab works with any text format — emails, blog posts, scripts, reports, and more. Simply paste your AI-generated content and get humanized output in under 10 seconds.' },
    { q: 'Will the humanized content pass AI detection?', a: 'Yes. HumanifyLab achieves a 99.9% bypass rate across all major AI detectors. Your content will pass Turnitin, GPTZero, Originality.AI, and platform-specific detection systems.' },
    { q: 'Does humanization preserve the original message?', a: 'Absolutely. HumanifyLab transforms the linguistic patterns of your content without changing the meaning, facts, or key messages. Your original intent is fully preserved.' },
    { q: 'How long does it take to humanize content?', a: 'HumanifyLab processes text in under 10 seconds. Even long-form content like white papers or reports is humanized in under a minute.' },
    { q: 'Is HumanifyLab free to use?', a: 'Yes. HumanifyLab offers a free plan with no sign-up required. You can humanize content instantly and upgrade to a paid plan for unlimited words and advanced features.' },
  ],
  [
    { q: 'Does HumanifyLab preserve formatting and structure?', a: 'Yes. HumanifyLab preserves the structure of your content including headings, bullet points, and paragraphs. Only the linguistic patterns are transformed to eliminate AI detection flags.' },
    { q: 'Can I humanize multiple pieces of content at once?', a: 'Yes. Bulk processing is available on paid plans, allowing you to humanize multiple documents simultaneously. This is ideal for content teams and agencies.' },
    { q: 'Does HumanifyLab work for short-form content?', a: 'Yes. HumanifyLab works equally well for short-form content like social media posts, ad copy, and email subject lines as it does for long-form content.' },
    { q: 'Will the tone be appropriate for my format?', a: 'Yes. HumanifyLab offers multiple tone presets including Professional, Academic, Casual, and Creative. Choose the tone that matches your content format for optimal results.' },
    { q: 'Is my content kept private?', a: 'Absolutely. HumanifyLab has a strict zero data retention policy. Your content is processed in memory and immediately deleted after humanization. Nothing is stored or shared.' },
  ],
  [
    { q: 'Why does AI-generated content get flagged in this format?', a: 'AI detectors analyze statistical patterns in text — including sentence structure, vocabulary distribution, and writing rhythm. AI-generated content scores abnormally on these metrics. HumanifyLab corrects all of them simultaneously.' },
    { q: 'What makes HumanifyLab better than manual rewriting?', a: 'Manual rewriting is time-consuming and often misses the subtle statistical patterns that AI detectors measure. HumanifyLab performs deep linguistic transformation that targets the exact signals detectors use — in under 10 seconds.' },
    { q: 'Does HumanifyLab support all languages for this format?', a: 'Yes. HumanifyLab supports 50+ languages, making it ideal for global content creators and professionals working in multiple markets.' },
    { q: 'Can I use HumanifyLab for commercial content?', a: 'Yes. All paid plans allow commercial use. You can humanize content for clients, campaigns, and business purposes without any additional licensing fees.' },
    { q: 'How does HumanifyLab compare to other humanizers for this format?', a: 'HumanifyLab consistently outperforms competitors with a 99.9% bypass rate, faster processing, better meaning preservation, and a more generous free plan. Independent tests confirm these results.' },
  ],
];

export function generateFormatContent(entry: KeywordEntryV3): FormatContentData {
  const { keyword, seed } = entry;
  const fmtKey = Object.keys(FORMAT_CONTEXT).find(k => keyword.toLowerCase().includes(k)) ?? '';
  const ctx = FORMAT_CONTEXT[fmtKey] ?? DEFAULT_FMT;

  const combo = buildPageStrings(keyword, seed, fmtKey, 'format');
  const faqs = buildFaqs(keyword, seed, fmtKey, 'format');
  const stats = buildStats(keyword, seed);

  const formatPoints = [
    { icon: ctx.icon, title: `Humanize AI ${fmtKey || 'Content'}`, description: `Transform AI-generated ${ctx.purpose} into natural, human-sounding writing that passes every AI detector.` },
    { icon: '🎯', title: '99.9% Bypass Rate', description: `Bypass all major AI detectors including ${ctx.detector}. Verified weekly against live detection systems.` },
    { icon: '⚡', title: 'Results in Seconds', description: `Get humanized ${ctx.purpose} in under 10 seconds. No waiting, no queues — instant results every time.` },
    { icon: '🔒', title: 'Zero Data Retention', description: `Your ${ctx.purpose} is processed in memory and immediately deleted. Complete privacy guaranteed.` },
    { icon: '✅', title: 'Meaning Preserved', description: `All key messages, facts, and tone are preserved. Only the AI writing patterns are transformed.` },
    { icon: '🌍', title: '50+ Languages', description: `Humanize ${ctx.purpose} in over 50 languages for global audiences and international markets.` },
  ];

  const steps = buildSteps(keyword, seed, 'format');

  const beforeAfterSets = [
    {
      label: `${fmtKey || 'Content'} Example`,
      before: 'The implementation of this solution demonstrates significant potential for enhanced outcomes across multiple dimensions of the operational framework.',
      after: `This approach works well and could genuinely improve how things run — especially for ${ctx.audience} dealing with ${ctx.detector}.`,
    },
    {
      label: `${fmtKey || 'Content'} Transformation`,
      before: 'In today\'s rapidly evolving landscape, leveraging cutting-edge solutions is paramount for maintaining competitive advantages.',
      after: `Staying ahead matters — and for ${ctx.audience}, using the right tools makes all the difference when it comes to ${ctx.purpose}.`,
    },
    {
      label: `Real ${fmtKey || 'Content'} Example`,
      before: 'The utilization of advanced methodologies enables the generation of contextually appropriate content across diverse domains.',
      after: `Good ${ctx.purpose} doesn't have to sound robotic. HumanifyLab makes it sound like a real person wrote it — because that's what ${ctx.audience} need.`,
    },
  ];
  const beforeAfter = beforeAfterSets[uniqueIdx(seed, keyword, beforeAfterSets.length, 20)]!;

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats,
    formatTitle: `Why ${ctx.audience.charAt(0).toUpperCase() + ctx.audience.slice(1)} Use HumanifyLab`,
    formatPoints,
    stepsTitle: 'How It Works',
    steps,
    beforeAfter,
    faqTitle: combo.faqTitle,
    faqs,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
