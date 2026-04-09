import type { KeywordEntryV3 } from '~/lib/pseo-data-v3';
import { uniqueIdx, uniqueNum } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildSteps, buildFeaturePoints, buildStats } from '~/lib/content/content-combinator';

export interface IndustryContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  stats: { value: string; label: string }[];
  useCasesTitle: string;
  useCases: { icon: string; title: string; description: string }[];
  howItWorksTitle: string;
  steps: { number: string; title: string; description: string }[];
  benefitsTitle: string;
  benefits: { icon: string; title: string; description: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const INDUSTRY_CONTEXT: Record<string, { icon: string; role: string; content: string; pain: string }> = {
  healthcare:      { icon: '🏥', role: 'healthcare professionals', content: 'clinical documentation and medical reports', pain: 'strict compliance and peer review standards' },
  medical:         { icon: '⚕️', role: 'medical writers', content: 'medical content and clinical notes', pain: 'regulatory scrutiny and AI detection in journals' },
  legal:           { icon: '⚖️', role: 'legal professionals', content: 'legal briefs and contracts', pain: 'court submission standards and client confidentiality' },
  law:             { icon: '📜', role: 'lawyers and paralegals', content: 'legal documents and case summaries', pain: 'bar association standards and AI detection' },
  finance:         { icon: '💹', role: 'finance professionals', content: 'financial reports and analysis', pain: 'regulatory compliance and investor scrutiny' },
  banking:         { icon: '🏦', role: 'banking professionals', content: 'banking reports and client communications', pain: 'compliance requirements and audit trails' },
  'real estate':   { icon: '🏠', role: 'real estate agents', content: 'property listings and market reports', pain: 'MLS standards and buyer trust' },
  insurance:       { icon: '🛡️', role: 'insurance professionals', content: 'policy documents and claims reports', pain: 'regulatory requirements and fraud detection' },
  pharmaceutical:  { icon: '💊', role: 'pharma writers', content: 'drug documentation and clinical trial reports', pain: 'FDA compliance and peer review' },
  consulting:      { icon: '💼', role: 'consultants', content: 'strategy reports and client deliverables', pain: 'client expectations and professional credibility' },
  accounting:      { icon: '📊', role: 'accountants', content: 'financial statements and audit reports', pain: 'GAAP compliance and regulatory review' },
  hr:              { icon: '👥', role: 'HR professionals', content: 'job descriptions and HR policies', pain: 'ATS systems and candidate screening' },
  recruitment:     { icon: '🎯', role: 'recruiters', content: 'job postings and candidate assessments', pain: 'ATS detection and candidate trust' },
  government:      { icon: '🏛️', role: 'government writers', content: 'policy documents and public reports', pain: 'public scrutiny and transparency requirements' },
  nonprofit:       { icon: '❤️', role: 'nonprofit professionals', content: 'grant proposals and impact reports', pain: 'donor trust and grant committee review' },
  education:       { icon: '🎓', role: 'educators', content: 'course materials and academic content', pain: 'academic integrity standards and student trust' },
  retail:          { icon: '🛍️', role: 'retail marketers', content: 'product descriptions and promotional content', pain: 'platform AI detection and SEO requirements' },
  ecommerce:       { icon: '🛒', role: 'ecommerce sellers', content: 'product listings and store content', pain: 'marketplace AI detection and conversion optimization' },
  hospitality:     { icon: '🏨', role: 'hospitality marketers', content: 'hotel descriptions and travel content', pain: 'OTA platform standards and guest trust' },
  travel:          { icon: '✈️', role: 'travel content creators', content: 'destination guides and travel articles', pain: 'platform detection and reader authenticity' },
  tech:            { icon: '💻', role: 'tech writers', content: 'technical documentation and blog content', pain: 'developer community standards and SEO' },
  software:        { icon: '⚙️', role: 'software companies', content: 'product documentation and marketing copy', pain: 'developer trust and technical accuracy' },
  cybersecurity:   { icon: '🔐', role: 'cybersecurity professionals', content: 'security reports and threat analyses', pain: 'technical credibility and client trust' },
  engineering:     { icon: '🔧', role: 'engineers', content: 'technical reports and project documentation', pain: 'peer review and technical standards' },
  architecture:    { icon: '🏗️', role: 'architects', content: 'project proposals and design documentation', pain: 'client presentations and planning submissions' },
  construction:    { icon: '🏚️', role: 'construction professionals', content: 'project reports and bid documents', pain: 'contractor standards and client review' },
  manufacturing:   { icon: '🏭', role: 'manufacturing teams', content: 'process documentation and quality reports', pain: 'ISO standards and audit requirements' },
  logistics:       { icon: '🚚', role: 'logistics professionals', content: 'supply chain reports and operational docs', pain: 'partner standards and compliance requirements' },
  agriculture:     { icon: '🌾', role: 'agricultural professionals', content: 'research reports and grant applications', pain: 'academic and government review standards' },
  energy:          { icon: '⚡', role: 'energy sector professionals', content: 'environmental reports and regulatory filings', pain: 'regulatory compliance and public scrutiny' },
  media:           { icon: '📰', role: 'media professionals', content: 'articles and editorial content', pain: 'editorial standards and AI detection by publishers' },
  publishing:      { icon: '📚', role: 'publishers and authors', content: 'manuscripts and editorial content', pain: 'publisher AI detection and reader authenticity' },
  journalism:      { icon: '🗞️', role: 'journalists', content: 'news articles and investigative reports', pain: 'editorial standards and publication AI policies' },
  advertising:     { icon: '📣', role: 'advertising professionals', content: 'ad copy and campaign content', pain: 'platform AI detection and brand authenticity' },
  pr:              { icon: '📢', role: 'PR professionals', content: 'press releases and media pitches', pain: 'journalist scrutiny and media credibility' },
  entertainment:   { icon: '🎬', role: 'entertainment creators', content: 'scripts and creative content', pain: 'studio standards and audience authenticity' },
  sports:          { icon: '⚽', role: 'sports content creators', content: 'sports articles and analysis', pain: 'fan authenticity and platform standards' },
  fitness:         { icon: '💪', role: 'fitness professionals', content: 'workout guides and health content', pain: 'platform detection and client trust' },
  beauty:          { icon: '💄', role: 'beauty brands', content: 'product descriptions and beauty content', pain: 'influencer authenticity and platform standards' },
  fashion:         { icon: '👗', role: 'fashion brands', content: 'product copy and fashion content', pain: 'brand voice consistency and platform detection' },
  food:            { icon: '🍽️', role: 'food content creators', content: 'recipes and food articles', pain: 'reader authenticity and platform standards' },
  restaurant:      { icon: '🍴', role: 'restaurant marketers', content: 'menu descriptions and promotional content', pain: 'review platform standards and customer trust' },
  automotive:      { icon: '🚗', role: 'automotive professionals', content: 'vehicle descriptions and technical content', pain: 'dealer standards and buyer trust' },
  aerospace:       { icon: '🚀', role: 'aerospace professionals', content: 'technical reports and project documentation', pain: 'regulatory compliance and peer review' },
  defense:         { icon: '🛡️', role: 'defense professionals', content: 'technical reports and briefings', pain: 'security clearance standards and review' },
  telecommunications: { icon: '📡', role: 'telecom professionals', content: 'technical documentation and customer content', pain: 'regulatory standards and customer trust' },
};

const DEFAULT_CTX = { icon: '🏢', role: 'industry professionals', content: 'business content and reports', pain: 'professional standards and AI detection' };

const TITLES = [
  (kw: string, icon: string) => `${icon} ${kw} — AI Humanizer for Professionals | HumanifyLab`,
  (kw: string, icon: string) => `${kw}: Undetectable AI Content ${icon} | HumanifyLab`,
  (kw: string, icon: string) => `${icon} ${kw} — Bypass AI Detection | HumanifyLab 2026`,
  (kw: string, icon: string) => `${kw} ${icon} — Professional AI Humanizer | HumanifyLab`,
  (kw: string, icon: string) => `${icon} Best AI Humanizer for ${kw} | HumanifyLab`,
  (kw: string, icon: string) => `${kw}: AI Content That Passes Every Check ${icon} | HumanifyLab`,
];

const DESCRIPTIONS = [
  (kw: string, role: string, content: string) => `HumanifyLab helps ${role} humanize AI-generated ${content}. 99.9% bypass rate, zero data retention, results in under 10 seconds. Free to try.`,
  (kw: string, role: string, content: string) => `${kw}: Transform AI-generated ${content} into undetectable human writing. Trusted by ${role} worldwide. Free plan available — no sign-up required.`,
  (kw: string, role: string, content: string) => `The best AI humanizer for ${kw}. HumanifyLab helps ${role} produce ${content} that passes every AI detector. 99.9% bypass rate. Try free.`,
  (kw: string, role: string, content: string) => `${role.charAt(0).toUpperCase() + role.slice(1)} use HumanifyLab to humanize ${content} and bypass AI detection. 99.9% success rate, zero data stored. Start free today.`,
  (kw: string, role: string, content: string) => `Need ${kw}? HumanifyLab delivers undetectable AI ${content} for ${role}. Instant results, 50+ languages, no watermark. Free plan available.`,
  (kw: string, role: string, content: string) => `${kw} — HumanifyLab is the trusted AI humanizer for ${role}. Bypass AI detection in ${content} with 99.9% accuracy. No sign-up needed.`,
];

const H1S = [
  (kw: string, icon: string) => `${icon} ${kw}: AI Humanizer Built for Professionals`,
  (kw: string, icon: string) => `${kw} ${icon} — Undetectable AI Content`,
  (kw: string, icon: string) => `${icon} The Best AI Humanizer for ${kw}`,
  (kw: string, icon: string) => `${kw}: Bypass AI Detection ${icon}`,
  (kw: string, icon: string) => `${icon} ${kw} — Professional AI Humanization`,
  (kw: string, icon: string) => `${kw} ${icon} — AI Content That Passes Every Check`,
];

const FAQ_SETS = [
  [
    { q: 'Does HumanifyLab work for professional industry content?', a: 'Yes. HumanifyLab is used by professionals across every major industry to humanize AI-generated content. The tool preserves technical accuracy and professional tone while making the writing undetectable to AI detectors.' },
    { q: 'Will humanized industry content pass AI detection?', a: 'Yes. HumanifyLab achieves a 99.9% bypass rate across all major AI detectors including Turnitin, GPTZero, Originality.AI, Copyleaks, and Winston AI. Your professional content will pass every check.' },
    { q: 'Is my industry content kept private?', a: 'Absolutely. HumanifyLab has a strict zero data retention policy. Your content is processed in memory and immediately deleted. It is never stored, shared, or used for training.' },
    { q: 'How fast does HumanifyLab process professional documents?', a: 'HumanifyLab processes text in under 10 seconds. A full professional report or document is humanized in under a minute, making it ideal for tight deadlines.' },
    { q: 'Is HumanifyLab free for industry professionals?', a: 'Yes. HumanifyLab offers a free plan with no sign-up required. Professionals who need higher volume can upgrade to a paid plan for unlimited words and bulk processing.' },
  ],
  [
    { q: 'Can HumanifyLab handle technical industry terminology?', a: 'Yes. HumanifyLab preserves all technical terms, industry jargon, and specialized vocabulary during humanization. Only the AI writing patterns are transformed — your content remains accurate and professional.' },
    { q: 'Does humanized content maintain professional tone?', a: 'Yes. HumanifyLab offers professional tone presets specifically designed for business and industry content. Your output maintains the formal, authoritative tone expected in professional settings.' },
    { q: 'Can I process multiple documents at once?', a: 'Yes. Bulk processing is available on paid plans, allowing you to humanize multiple documents simultaneously. This is ideal for agencies and teams with high-volume content needs.' },
    { q: 'Does HumanifyLab support industry-specific formats?', a: 'HumanifyLab works with any text format — reports, briefs, proposals, documentation, and more. Simply paste your content and the tool handles the rest.' },
    { q: 'Is there an API for enterprise integration?', a: 'Yes. HumanifyLab offers API access on paid plans, allowing you to integrate AI humanization directly into your existing workflows and content management systems.' },
  ],
  [
    { q: 'Why do industry professionals need AI humanization?', a: 'AI-generated content is increasingly flagged by detection tools used by publishers, academic institutions, compliance systems, and professional review boards. HumanifyLab ensures your content passes every check while maintaining quality.' },
    { q: 'What industries use HumanifyLab most?', a: 'HumanifyLab is used across healthcare, legal, finance, education, marketing, technology, and many other industries. Any professional who uses AI to draft content benefits from humanization.' },
    { q: 'Does HumanifyLab work for regulated industries?', a: 'Yes. HumanifyLab is particularly valuable in regulated industries where content must pass strict review. The tool preserves compliance language and technical accuracy while eliminating AI detection flags.' },
    { q: 'Can I use HumanifyLab for client-facing content?', a: 'Absolutely. HumanifyLab produces professional-quality output that is suitable for client presentations, reports, and communications. The humanized content reads as genuinely authored by a professional.' },
    { q: 'How does HumanifyLab protect confidential industry content?', a: 'HumanifyLab processes all content with zero data retention. Nothing is stored after processing. For enterprise clients, additional security measures including private deployment are available.' },
  ],
];

export function generateIndustryContent(entry: KeywordEntryV3): IndustryContentData {
  const { keyword, entity, seed } = entry;
  const entityKey = Object.keys(INDUSTRY_CONTEXT).find(k => keyword.toLowerCase().includes(k)) ?? '';
  const ctx = INDUSTRY_CONTEXT[entityKey] ?? DEFAULT_CTX;

  const combo = buildPageStrings(keyword, seed, entityKey, 'industry');
  const faqs = buildFaqs(keyword, seed, entityKey, 'industry');
  const stats = buildStats(keyword, seed);

  const useCaseSets = [
    [
      { icon: ctx.icon, title: `Humanize ${ctx.content}`, description: `Transform AI-drafted ${ctx.content} into natural, professional writing that passes every AI detector and review process.` },
      { icon: '🎯', title: 'Bypass AI Detection', description: `Eliminate AI flags from your content with a 99.9% bypass rate across Turnitin, GPTZero, Originality.AI, and all major detectors.` },
      { icon: '⚡', title: 'Instant Processing', description: `Get humanized content in under 10 seconds. No waiting, no queues — results are immediate regardless of document length.` },
      { icon: '🔒', title: 'Complete Privacy', description: `Zero data retention policy. Your ${ctx.content} is processed in memory and immediately deleted. Never stored or shared.` },
      { icon: '🌍', title: '50+ Languages', description: `Humanize content in over 50 languages. Ideal for global ${ctx.role} working across international markets.` },
      { icon: '📦', title: 'Bulk Processing', description: `Process multiple documents simultaneously on paid plans. Perfect for ${ctx.role} with high-volume content needs.` },
    ],
    [
      { icon: '🏆', title: '99.9% Bypass Rate', description: `HumanifyLab achieves the highest bypass rate in the industry — verified weekly against live detection systems used by ${ctx.role}.` },
      { icon: ctx.icon, title: `Built for ${entityKey ? entityKey.charAt(0).toUpperCase() + entityKey.slice(1) : 'Industry'} Professionals`, description: `HumanifyLab is trusted by ${ctx.role} worldwide to humanize ${ctx.content} and pass every AI detector.` },
      { icon: '🔬', title: 'Deep Transformation', description: `Unlike basic paraphrasers, HumanifyLab targets the statistical patterns AI detectors actually measure — perplexity, burstiness, and semantic entropy.` },
      { icon: '💼', title: 'Professional Output', description: `HumanifyLab's Professional tone preset delivers polished, industry-appropriate writing that passes client review and professional standards.` },
      { icon: '⚙️', title: 'API Integration', description: `Integrate HumanifyLab into your ${entityKey || 'industry'} workflow via REST API. Automate humanization for high-volume content operations.` },
      { icon: '🛡️', title: 'Enterprise Security', description: `Zero data retention, private processing, and enterprise-grade security for ${ctx.role} handling sensitive ${ctx.content}.` },
    ],
  ];
  const useCases = useCaseSets[uniqueIdx(seed, keyword, useCaseSets.length, 20)]!;

  const stepSets = [
    [
      { number: '01', title: 'Paste Your Content', description: `Copy your AI-generated ${ctx.content} and paste it into HumanifyLab. Any length is supported.` },
      { number: '02', title: 'Select Professional Tone', description: `Choose the Professional tone preset for ${ctx.role}. Adjust intensity based on your target detector.` },
      { number: '03', title: 'Humanize in Seconds', description: `Click Humanize. HumanifyLab transforms your content in under 10 seconds, preserving all technical accuracy.` },
      { number: '04', title: 'Review and Submit', description: `Your humanized ${ctx.content} is ready. Test against your target detector — you will see 0-3% AI score.` },
    ],
    [
      { number: '01', title: 'Generate Your Draft', description: `Use any AI tool to draft your ${ctx.content}. Focus on getting the content right — HumanifyLab handles the detection.` },
      { number: '02', title: 'Open HumanifyLab', description: `Visit HumanifyLab.com — no account needed. Paste your ${ctx.content} directly into the editor.` },
      { number: '03', title: 'Apply Deep Humanization', description: `Select Maximum intensity for strict detectors. HumanifyLab transforms the statistical fingerprint of your content.` },
      { number: '04', title: 'Deliver with Confidence', description: `Your humanized ${ctx.content} passes every AI detector. Ready to submit, publish, or deliver to clients.` },
    ],
  ];
  const steps = stepSets[uniqueIdx(seed, keyword, stepSets.length, 21)]!;

  const benefitSets = [
    [
      { icon: '✅', title: 'Passes Professional Review', description: `Humanized content passes AI detection tools used by publishers, compliance systems, and professional review boards.` },
      { icon: '🎯', title: 'Preserves Technical Accuracy', description: `All industry terminology, technical details, and specialized vocabulary are preserved during humanization.` },
      { icon: '⚡', title: 'Saves Hours of Rewriting', description: `Instead of manually rewriting AI content, HumanifyLab does it in seconds — saving ${ctx.role} hours of work.` },
      { icon: '🔒', title: 'Enterprise-Grade Privacy', description: `Zero data retention means your confidential ${ctx.content} is never at risk. Complete privacy guaranteed.` },
    ],
    [
      { icon: '🏆', title: 'Industry-Leading Bypass Rate', description: `99.9% bypass rate across all major AI detectors — the highest in the industry, verified weekly.` },
      { icon: '💼', title: 'Professional-Grade Output', description: `HumanifyLab produces polished, professional writing that meets the standards expected in ${entityKey || 'your industry'}.` },
      { icon: '🌍', title: 'Global Language Support', description: `Humanize ${ctx.content} in 50+ languages. Ideal for ${ctx.role} working across international markets.` },
      { icon: '📊', title: 'Scalable for Teams', description: `Bulk processing and API access allow ${ctx.role} to humanize content at any scale — from single documents to thousands.` },
    ],
  ];
  const benefits = benefitSets[uniqueIdx(seed, keyword, benefitSets.length, 22)]!;

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats,
    useCasesTitle: `How ${ctx.role.charAt(0).toUpperCase() + ctx.role.slice(1)} Use HumanifyLab`,
    useCases,
    howItWorksTitle: 'How It Works',
    steps,
    benefitsTitle: `Why ${ctx.role.charAt(0).toUpperCase() + ctx.role.slice(1)} Choose HumanifyLab`,
    benefits,
    faqTitle: combo.faqTitle,
    faqs,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
