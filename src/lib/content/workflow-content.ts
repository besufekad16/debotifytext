import type { KeywordEntryV3 } from '~/lib/pseo-data-v3';
import { uniqueIdx, uniqueNum } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildSteps, buildFeaturePoints, buildStats } from '~/lib/content/content-combinator';

export interface WorkflowContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  stats: { value: string; label: string }[];
  workflowTitle: string;
  workflowSteps: { number: string; title: string; description: string }[];
  rolesTitle: string;
  roles: { icon: string; title: string; description: string }[];
  featuresTitle: string;
  features: { icon: string; title: string; description: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const TITLES = [
  (kw: string) => `${kw} — AI Humanizer for Teams | HumanifyLab`,
  (kw: string) => `${kw}: Scale AI Content Production | HumanifyLab 2026`,
  (kw: string) => `${kw} — Streamline Your Content Workflow | HumanifyLab`,
  (kw: string) => `${kw}: Bulk AI Humanization for Teams | HumanifyLab`,
  (kw: string) => `${kw} — Enterprise AI Humanizer | HumanifyLab`,
  (kw: string) => `${kw}: Automate AI Detection Bypass | HumanifyLab`,
  (kw: string) => `${kw} — Built for Content Operations | HumanifyLab`,
  (kw: string) => `${kw}: High-Volume AI Humanization | HumanifyLab`,
  (kw: string) => `${kw} — Agency-Grade AI Humanizer | HumanifyLab`,
  (kw: string) => `${kw}: The Professional Content Workflow | HumanifyLab`,
  (kw: string) => `${kw} — Scale Without Limits | HumanifyLab`,
  (kw: string) => `${kw}: API-First AI Humanization | HumanifyLab`,
];

const DESCRIPTIONS = [
  (kw: string) => `${kw} with HumanifyLab. Scale AI content production with bulk processing, API access, and team collaboration. 99.9% bypass rate. Free to try.`,
  (kw: string) => `${kw}: HumanifyLab helps content teams humanize AI content at scale. Bulk processing, API integration, and team dashboards. Start free today.`,
  (kw: string) => `Streamline ${kw} with HumanifyLab. Process hundreds of documents simultaneously, integrate via API, and manage team workflows. 99.9% bypass rate.`,
  (kw: string) => `${kw} — HumanifyLab is built for content teams and agencies. Bulk processing, white-label options, and enterprise pricing. Free plan available.`,
  (kw: string) => `Need ${kw}? HumanifyLab scales with your content operation. From solo freelancers to enterprise teams — 99.9% bypass rate, instant results.`,
  (kw: string) => `${kw}: HumanifyLab automates AI detection bypass for content workflows. API access, Zapier integration, bulk processing. Try free today.`,
  (kw: string) => `${kw} — HumanifyLab handles high-volume AI humanization for agencies and enterprises. Bulk processing, REST API, team dashboards. Free plan.`,
  (kw: string) => `${kw}: Scale your content operation with HumanifyLab. Process 100+ documents simultaneously, integrate via API, automate with Zapier. 99.9% bypass rate.`,
  (kw: string) => `${kw} — HumanifyLab is the enterprise AI humanizer trusted by agencies worldwide. White-label options, bulk processing, dedicated support. Try free.`,
  (kw: string) => `${kw}: HumanifyLab's workflow tools let content teams humanize AI content at any scale. API, bulk upload, team analytics. Free plan available.`,
  (kw: string) => `${kw} — HumanifyLab scales from 1 to 10,000 documents per day. Bulk processing, API integration, Zapier automation. 99.9% bypass rate.`,
  (kw: string) => `${kw}: HumanifyLab's REST API enables seamless AI humanization at scale. Integrate into any CMS, workflow, or automation platform. Free to start.`,
];

const H1S = [
  (kw: string) => `${kw}: Scale AI Humanization Across Your Team`,
  (kw: string) => `${kw} — Bulk AI Humanization Made Simple`,
  (kw: string) => `${kw}: The Enterprise AI Humanizer`,
  (kw: string) => `${kw} — Automate AI Detection Bypass`,
  (kw: string) => `${kw}: AI Humanization at Scale`,
  (kw: string) => `${kw} — Built for Content Teams`,
  (kw: string) => `${kw}: High-Volume AI Humanization`,
  (kw: string) => `${kw} — Agency-Grade AI Humanizer`,
  (kw: string) => `${kw}: The Professional Content Workflow`,
  (kw: string) => `${kw} — Scale Without Limits`,
  (kw: string) => `${kw}: API-First AI Humanization`,
  (kw: string) => `${kw} — Built for Content Operations`,
];

const HERO_SUBTITLES = [
  'Built for content teams, agencies, and enterprises. Bulk processing, API access, and team collaboration included.',
  'Scale AI humanization from 1 to 10,000 documents per day. REST API, Zapier integration, team dashboards.',
  'The enterprise AI humanizer trusted by agencies worldwide. 99.9% bypass rate, white-label options, dedicated support.',
  'HumanifyLab handles high-volume AI humanization so your team can focus on strategy, not manual processing.',
  'From solo freelancers to enterprise teams — HumanifyLab scales with your content operation. Free to start.',
  'Automate AI detection bypass across your entire content workflow. API, bulk processing, Zapier — all included.',
  'Content teams use HumanifyLab to humanize AI content at scale. 99.9% bypass rate, instant results, free plan.',
  'The professional AI humanizer for content operations. Bulk processing, API access, team analytics. Try free today.',
];

const WORKFLOW_STEP_SETS = [
  [
    { number: '01', title: 'Generate Content at Scale', description: 'Use your AI tools to generate content in bulk. HumanifyLab handles any volume — from single documents to thousands.' },
    { number: '02', title: 'Upload or Paste in Bulk', description: 'Upload multiple documents via CSV or paste content directly. Bulk processing handles everything simultaneously.' },
    { number: '03', title: 'Humanize Automatically', description: 'HumanifyLab processes all documents in parallel. A batch of 100 documents is humanized in under 5 minutes.' },
    { number: '04', title: 'Publish or Deliver', description: 'Download humanized content or push directly to your CMS via API. Ready to publish, submit, or deliver to clients.' },
  ],
  [
    { number: '01', title: 'Connect via API or Zapier', description: 'Integrate HumanifyLab into your existing workflow using the REST API or Zapier. No manual steps required.' },
    { number: '02', title: 'Feed Content Automatically', description: 'Your content pipeline feeds directly into HumanifyLab. New AI-generated content is humanized automatically.' },
    { number: '03', title: 'Process in Real Time', description: 'HumanifyLab processes content in real time as it arrives. No batching delays — results in under 10 seconds per document.' },
    { number: '04', title: 'Deliver to Your Platform', description: 'Humanized content is automatically delivered to your CMS, client portal, or storage system. Zero manual intervention.' },
  ],
  [
    { number: '01', title: 'Set Up Your Team Account', description: 'Create a team account and invite your content team. Each member gets individual access with shared billing.' },
    { number: '02', title: 'Assign Content to Team Members', description: 'Distribute content across your team. Each member can humanize independently with their own usage tracked.' },
    { number: '03', title: 'Humanize and Review', description: 'Team members humanize content and review output. The team dashboard shows all activity in real time.' },
    { number: '04', title: 'Publish at Scale', description: 'Approved content goes live. Your entire team operates at maximum efficiency with HumanifyLab handling detection bypass.' },
  ],
];

const ROLE_SETS = [
  [
    { icon: '🏢', title: 'Content Agencies', description: 'Process client content at scale with bulk processing, white-label options, and team dashboards.' },
    { icon: '💼', title: 'Freelancers', description: 'Handle more clients simultaneously with bulk processing and API integration. Scale your business without scaling your time.' },
    { icon: '📈', title: 'SEO Teams', description: 'Humanize AI-generated SEO content at scale. Passes Google\'s AI detection and ranks well in organic search.' },
    { icon: '🎓', title: 'EdTech Platforms', description: 'Integrate AI humanization into educational platforms via API. Help students produce authentic-sounding content.' },
    { icon: '📰', title: 'Publishers', description: 'Humanize AI-assisted editorial content before publication. Passes editorial AI detection standards.' },
    { icon: '🚀', title: 'Startups', description: 'Scale content production from day one with affordable bulk pricing and API access.' },
  ],
  [
    { icon: '📊', title: 'Marketing Teams', description: 'Humanize AI-generated marketing copy at scale. Passes platform AI detection and resonates with real audiences.' },
    { icon: '🛒', title: 'Ecommerce Teams', description: 'Humanize product descriptions, category pages, and marketing content in bulk. Passes marketplace AI detection.' },
    { icon: '🔍', title: 'SEO Agencies', description: 'Process hundreds of AI-generated articles per day. HumanifyLab\'s bulk processing handles any volume.' },
    { icon: '📱', title: 'Social Media Teams', description: 'Humanize AI-generated social content at scale. Passes platform detection and drives authentic engagement.' },
    { icon: '✉️', title: 'Email Marketing Teams', description: 'Humanize AI-generated email campaigns. Passes spam filters and AI detection used by email platforms.' },
    { icon: '🎬', title: 'Content Studios', description: 'Process scripts, articles, and creative content in bulk. HumanifyLab handles any content type at any volume.' },
  ],
  [
    { icon: '🏦', title: 'Financial Services', description: 'Humanize AI-generated financial reports and client communications. Passes compliance review and regulatory standards.' },
    { icon: '⚕️', title: 'Healthcare Teams', description: 'Humanize AI-generated clinical documentation and patient communications. Passes compliance and peer review.' },
    { icon: '⚖️', title: 'Legal Teams', description: 'Humanize AI-generated legal documents and briefs. Passes bar association standards and client review.' },
    { icon: '🎓', title: 'Academic Institutions', description: 'Integrate AI humanization into academic platforms. Help faculty produce authentic-sounding course materials.' },
    { icon: '🌐', title: 'Global Enterprises', description: 'Humanize AI content in 50+ languages at scale. HumanifyLab\'s multilingual engine handles global content operations.' },
    { icon: '🤝', title: 'Consulting Firms', description: 'Humanize AI-generated strategy reports and client deliverables. Passes client review and professional standards.' },
  ],
];

const FEATURE_SETS = [
  [
    { icon: '📦', title: 'Bulk Processing', description: 'Process hundreds of documents simultaneously. Results delivered in under a minute for most batch sizes.' },
    { icon: '⚙️', title: 'REST API', description: 'Integrate humanization into any workflow. Full documentation, SDKs, and webhook support available.' },
    { icon: '⚡', title: 'Zapier Integration', description: 'Connect HumanifyLab to 5,000+ apps without code. Automate your entire content humanization workflow.' },
    { icon: '👥', title: 'Team Dashboard', description: 'Manage team access, track usage, and monitor bypass rates across your entire content operation.' },
  ],
  [
    { icon: '🔌', title: 'API-First Architecture', description: 'HumanifyLab\'s REST API is designed for high-volume integration. Handles thousands of requests per day with sub-10-second response times.' },
    { icon: '📊', title: 'Usage Analytics', description: 'Track words processed, bypass rates, and team usage in real time. Optimize your content workflow with data.' },
    { icon: '🏷️', title: 'White-Label Option', description: 'Offer AI humanization under your own brand. HumanifyLab\'s white-label option is available for agencies and platforms.' },
    { icon: '🔒', title: 'Enterprise Security', description: 'Zero data retention, SOC 2 compliance, and private deployment options for enterprise clients.' },
  ],
  [
    { icon: '🚀', title: 'Unlimited Scale', description: 'Enterprise plans offer unlimited words per month. Scale from 100 to 100,000 documents per day without limits.' },
    { icon: '🌍', title: 'Multilingual Bulk', description: 'Process content in 50+ languages simultaneously. HumanifyLab\'s multilingual engine handles global content operations.' },
    { icon: '📋', title: 'CSV Upload', description: 'Upload batches of content via CSV for bulk processing. Results are delivered as a downloadable CSV file.' },
    { icon: '🤝', title: 'Dedicated Support', description: 'Enterprise clients get a dedicated account manager and priority support with guaranteed response times.' },
  ],
];

const FAQ_SETS = [
  [
    { q: 'Can HumanifyLab handle high-volume content workflows?', a: 'Yes. HumanifyLab is built for scale. Bulk processing on paid plans allows you to humanize hundreds of documents simultaneously. Enterprise plans offer custom volume limits and dedicated infrastructure.' },
    { q: 'Is there an API for workflow automation?', a: 'Yes. HumanifyLab offers a REST API on paid plans. You can integrate AI humanization directly into your content pipeline, CMS, or automation workflow. Full API documentation is available.' },
    { q: 'Does HumanifyLab support team collaboration?', a: 'Yes. Team and enterprise plans include shared dashboards, team billing, usage analytics, and collaborative features. Multiple team members can access the same account with individual usage tracking.' },
    { q: 'Can I white-label HumanifyLab for my agency?', a: 'Yes. HumanifyLab offers white-label options for agencies and resellers. Contact the sales team to discuss white-label pricing and customization options.' },
    { q: 'How does bulk processing work?', a: 'On paid plans, you can upload multiple documents simultaneously and process them all at once. Results are delivered in under a minute for most batch sizes. CSV upload is supported for large batches.' },
  ],
  [
    { q: 'What is the best plan for a content agency?', a: 'Content agencies typically benefit most from the Professional or Enterprise plan, which includes unlimited words, bulk processing, API access, team collaboration, and priority support.' },
    { q: 'Can I integrate HumanifyLab with my CMS?', a: 'Yes. The HumanifyLab API integrates with any CMS including WordPress, Webflow, HubSpot, and custom platforms. You can automate humanization as part of your publishing workflow.' },
    { q: 'Does HumanifyLab work with Zapier for automation?', a: 'Yes. HumanifyLab integrates with Zapier, allowing you to connect it to 5,000+ apps and automate humanization workflows without writing code.' },
    { q: 'Is there usage analytics for team accounts?', a: 'Yes. Team and enterprise accounts include usage analytics showing words processed, bypass rates, and usage by team member. This helps you optimize your content workflow.' },
    { q: 'What is the turnaround time for bulk processing?', a: 'Bulk processing delivers results in under a minute for most batch sizes. A batch of 100 documents is typically processed in under 5 minutes, making it suitable for high-volume content operations.' },
  ],
  [
    { q: 'How does HumanifyLab help freelancers scale their business?', a: 'Freelancers use HumanifyLab to humanize AI-generated content for multiple clients simultaneously. Bulk processing and API access allow freelancers to handle 10x more work without sacrificing quality.' },
    { q: 'Can I use HumanifyLab for SEO content at scale?', a: 'Yes. HumanifyLab is widely used by SEO agencies to humanize AI-generated content at scale. The tool produces content that passes Google\'s AI detection and ranks well in organic search.' },
    { q: 'Does HumanifyLab maintain quality at scale?', a: 'Yes. HumanifyLab maintains a 99.9% bypass rate and consistent output quality regardless of volume. Bulk processing uses the same deep linguistic transformation as individual processing.' },
    { q: 'Is there a reseller program?', a: 'Yes. HumanifyLab offers a reseller program for agencies and platforms that want to offer AI humanization as a service. Contact the sales team for reseller pricing and terms.' },
    { q: 'How does enterprise pricing work?', a: 'Enterprise pricing is custom-quoted based on your team size, monthly volume, and specific requirements. Enterprise plans include dedicated support, SLA guarantees, custom API limits, and white-label options.' },
  ],
  [
    { q: 'How many documents can I process per day?', a: 'Free plan: 5 runs per day. Starter: 50 runs per day. Professional: 500 runs per day. Enterprise: unlimited. Bulk processing on paid plans allows multiple documents per run.' },
    { q: 'Does HumanifyLab integrate with Google Docs or Microsoft Word?', a: 'HumanifyLab works with any text source. Copy content from Google Docs, Word, or any other tool, paste it into HumanifyLab, and copy the humanized output back. API integration enables automated workflows.' },
    { q: 'Can I track which team members are using HumanifyLab?', a: 'Yes. Team accounts include individual usage tracking. You can see how many words each team member has processed, their bypass rates, and their activity history.' },
    { q: 'Is there a minimum commitment for enterprise plans?', a: 'Enterprise plans are typically annual contracts with custom pricing. Contact the sales team to discuss your specific requirements and get a custom quote.' },
    { q: 'Does HumanifyLab offer SLA guarantees for enterprise clients?', a: 'Yes. Enterprise plans include SLA guarantees for uptime, response time, and support. Contact the sales team for specific SLA terms.' },
  ],
];

const FINAL_CTA_TITLES = [
  (kw: string) => `Scale Your Content Workflow Today`,
  (kw: string) => `Start Humanizing at Scale`,
  (kw: string) => `${kw} — Get Started Free`,
  (kw: string) => `Build Your Content Workflow`,
  (kw: string) => `Scale AI Humanization Now`,
  (kw: string) => `Start Your Team Workflow Today`,
];

const FINAL_CTA_SUBTITLES = [
  'Free plan available. Bulk processing and API access on paid plans. No sign-up required to start.',
  'Join 450,000+ users who trust HumanifyLab. Start free — no credit card needed.',
  '99.9% bypass rate. Bulk processing. REST API. Team dashboards. Try free today.',
  'No account needed to start. Upgrade for bulk processing, API access, and team features.',
  'Free plan, instant results, enterprise-ready. Scale your content workflow with HumanifyLab.',
  'Trusted by agencies and enterprises worldwide. Free to start, scales to any volume.',
];

export function generateWorkflowContent(entry: KeywordEntryV3): WorkflowContentData {
  const { keyword, seed } = entry;

  const combo = buildPageStrings(keyword, seed, '', 'workflow');
  const wsi = uniqueIdx(seed, keyword, WORKFLOW_STEP_SETS.length, 4);
  const rsi = uniqueIdx(seed, keyword, ROLE_SETS.length, 5);
  const fsi = uniqueIdx(seed, keyword, FEATURE_SETS.length, 6);
  // fi removed — FAQs now use keyword-specific buildFaqs

  const stats = buildStats(keyword, seed);

  const workflowTitles = ['Your Content Workflow, Supercharged', 'Scale AI Humanization Across Your Operation', 'The Professional Content Workflow', 'How HumanifyLab Powers Your Workflow'];
  const rolesTitles = ['Built for Every Content Team', 'Who Uses HumanifyLab at Scale', 'Teams That Trust HumanifyLab', 'Built for Your Industry'];
  const featuresTitles = ['Enterprise Features', 'Built for Scale', 'Workflow Features', 'What\'s Included'];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats,
    workflowTitle: workflowTitles[uniqueIdx(seed, keyword, workflowTitles.length, 12)]!,
    workflowSteps: WORKFLOW_STEP_SETS[wsi]!,
    rolesTitle: rolesTitles[uniqueIdx(seed, keyword, rolesTitles.length, 13)]!,
    roles: ROLE_SETS[rsi]!,
    featuresTitle: featuresTitles[uniqueIdx(seed, keyword, featuresTitles.length, 14)]!,
    features: FEATURE_SETS[fsi]!,
    faqTitle: combo.faqTitle,
    faqs: buildFaqs(keyword, seed, entry.entity ?? '', 'workflow'),
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
