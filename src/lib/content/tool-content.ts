import type { KeywordEntryV3 } from '~/lib/pseo-data-v3';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildSteps, buildFeaturePoints, buildStats } from '~/lib/content/content-combinator';

export interface ToolContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  stats: { value: string; label: string }[];
  integrationTitle: string;
  integrations: { icon: string; title: string; description: string }[];
  stepsTitle: string;
  steps: { number: string; title: string; description: string }[];
  featuresTitle: string;
  features: { icon: string; title: string; description: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const PLATFORM_CONTEXT: Record<string, { icon: string; audience: string; workflow: string }> = {
  'google docs':        { icon: '📄', audience: 'Google Docs users', workflow: 'paste directly from Google Docs' },
  'microsoft word':     { icon: '📝', audience: 'Microsoft Word users', workflow: 'copy from Word and paste into HumanifyLab' },
  'notion':             { icon: '🗒️', audience: 'Notion users', workflow: 'copy from Notion pages and humanize instantly' },
  'grammarly':          { icon: '✅', audience: 'Grammarly users', workflow: 'humanize first, then run Grammarly for final polish' },
  'quillbot':           { icon: '🔄', audience: 'QuillBot users', workflow: 'use HumanifyLab for deeper humanization than QuillBot offers' },
  'chatgpt':            { icon: '🤖', audience: 'ChatGPT users', workflow: 'paste ChatGPT output directly into HumanifyLab' },
  'claude':             { icon: '🧠', audience: 'Claude users', workflow: 'paste Claude output and humanize in one click' },
  'gemini':             { icon: '✨', audience: 'Gemini users', workflow: 'copy Gemini output and transform it instantly' },
  'wordpress':          { icon: '🌐', audience: 'WordPress bloggers', workflow: 'humanize before publishing to WordPress' },
  'shopify':            { icon: '🛒', audience: 'Shopify store owners', workflow: 'humanize product descriptions before adding to Shopify' },
  'chrome extension':   { icon: '🔌', audience: 'Chrome users', workflow: 'humanize directly in your browser with the Chrome extension' },
  'api':                { icon: '⚙️', audience: 'developers and technical teams', workflow: 'integrate humanization directly into your pipeline via API' },
  'mobile app':         { icon: '📱', audience: 'mobile users', workflow: 'humanize on the go from any mobile device' },
  'zapier':             { icon: '⚡', audience: 'automation users', workflow: 'automate humanization workflows with Zapier' },
};

const DEFAULT_PLATFORM: { icon: string; audience: string; workflow: string } = {
  icon: '🤖',
  audience: 'content creators and writers',
  workflow: 'paste your AI-generated content and get human-sounding output instantly',
};

const HERO_SUBTITLES = [
  `Works with any tool. 99.9% bypass rate, instant results, no sign-up required.`,
  `Seamless integration with your existing workflow. 99.9% bypass rate, zero data stored.`,
  `HumanifyLab fits into any content workflow. Instant results, free plan, no sign-up needed.`,
  `The AI humanizer that works with every tool you already use. 99.9% bypass rate.`,
  `Integrate HumanifyLab into your workflow in minutes. Free plan, instant results.`,
  `Works with any platform, any tool, any workflow. 99.9% bypass rate, free to start.`,
  `Your existing tools + HumanifyLab = undetectable AI content. Free plan available.`,
  `No workflow disruption. HumanifyLab fits in as a final step before publishing or submitting.`,
];

const INTEGRATION_SETS = [
  [
    { icon: '🔌', title: 'Chrome Extension', description: 'Humanize content directly in your browser without switching tabs. Works on any website or web app.' },
    { icon: '⚙️', title: 'REST API', description: 'Integrate HumanifyLab into any platform or workflow with our simple REST API. Full documentation available.' },
    { icon: '⚡', title: 'Zapier Integration', description: 'Automate humanization workflows with Zapier. Connect HumanifyLab to 5,000+ apps without writing code.' },
    { icon: '📦', title: 'Bulk Processing', description: 'Process multiple documents simultaneously on paid plans. Ideal for content teams and agencies.' },
    { icon: '📱', title: 'Mobile Ready', description: 'HumanifyLab works on any device. Humanize content from your phone, tablet, or desktop.' },
    { icon: '🌐', title: 'Web App', description: 'Access HumanifyLab from any browser, any device, anywhere in the world. No installation required.' },
  ],
  [
    { icon: '📄', title: 'Google Docs Compatible', description: 'Copy from Google Docs, paste into HumanifyLab, copy back. The entire process takes under 30 seconds.' },
    { icon: '📝', title: 'Microsoft Word Compatible', description: 'Works seamlessly with Word documents. Copy, humanize, paste back — no formatting lost.' },
    { icon: '🗒️', title: 'Notion Compatible', description: 'Humanize Notion pages and database content. Copy from Notion, humanize, paste back instantly.' },
    { icon: '🌐', title: 'WordPress Integration', description: 'Humanize before publishing to WordPress. Works with Gutenberg, Classic Editor, and page builders.' },
    { icon: '🛒', title: 'Shopify Compatible', description: 'Humanize product descriptions and store content before adding to Shopify. Passes marketplace AI detection.' },
    { icon: '⚙️', title: 'API Integration', description: 'Integrate HumanifyLab directly into your tech stack. REST API with full documentation and SDKs.' },
  ],
  [
    { icon: '🤖', title: 'ChatGPT Output', description: 'Paste ChatGPT output directly into HumanifyLab. Transform it into undetectable human writing in seconds.' },
    { icon: '🧠', title: 'Claude Output', description: 'Humanize Claude-generated content instantly. Passes all major AI detectors with a 99.9% bypass rate.' },
    { icon: '✨', title: 'Gemini Output', description: 'Transform Gemini output into natural human writing. Works with any Gemini model output.' },
    { icon: '🔄', title: 'Any AI Tool', description: 'HumanifyLab works with output from any AI writing tool — Jasper, Copy.ai, Writesonic, and more.' },
    { icon: '⚡', title: 'Zapier Automation', description: 'Automate humanization with Zapier. Connect your AI tool output directly to HumanifyLab.' },
    { icon: '📱', title: 'Mobile Workflow', description: 'Humanize on the go from any mobile device. Full functionality on iOS and Android browsers.' },
  ],
];

const STEP_SETS = [
  [
    { number: '01', title: `Generate Content in Your Tool`, description: `Create your AI-generated content using your preferred tool. Focus on getting the content right.` },
    { number: '02', title: 'Paste into HumanifyLab', description: 'Copy your content and paste it into HumanifyLab. No formatting required — plain text works perfectly.' },
    { number: '03', title: 'Humanize in Seconds', description: 'Click Humanize. Deep linguistic transformation produces undetectable content in under 10 seconds.' },
    { number: '04', title: 'Return to Your Tool', description: `Copy the humanized output and paste it back into your tool. Ready to publish, submit, or send.` },
  ],
  [
    { number: '01', title: 'Generate with AI', description: 'Use ChatGPT, Claude, Gemini, or any AI tool to draft your content. Don\'t worry about detection yet.' },
    { number: '02', title: 'Open HumanifyLab', description: 'Visit HumanifyLab.com — no account needed. Paste your AI-generated content directly.' },
    { number: '03', title: 'One-Click Humanize', description: 'Click Humanize. HumanifyLab transforms your content in under 10 seconds with a 99.9% bypass rate.' },
    { number: '04', title: 'Publish or Submit', description: 'Copy the humanized output back to your tool or platform. Ready to publish, submit, or deliver.' },
  ],
  [
    { number: '01', title: 'Connect Your Workflow', description: 'Integrate HumanifyLab via API or Zapier. Your content flows automatically from generation to humanization.' },
    { number: '02', title: 'Automatic Processing', description: 'New AI-generated content is humanized automatically as it enters your pipeline. No manual steps.' },
    { number: '03', title: 'Review and Approve', description: 'Review humanized content in your dashboard. Approve and push to your CMS or delivery system.' },
    { number: '04', title: 'Scale Effortlessly', description: 'Process 1 or 10,000 documents per day. HumanifyLab scales with your content operation.' },
  ],
];

const FEATURE_SETS = [
  [
    { icon: '🎯', title: '99.9% Bypass Rate', description: 'The highest bypass rate in the industry. Passes Turnitin, GPTZero, Originality.AI, and all major detectors.' },
    { icon: '⚡', title: 'Under 10 Seconds', description: 'Faster than any competitor. Get humanized content before your workflow loses momentum.' },
    { icon: '🔒', title: 'Zero Data Retention', description: 'Your content is never stored. Complete privacy for sensitive documents and confidential content.' },
    { icon: '🌍', title: '50+ Languages', description: 'Humanize content in any language. Ideal for global teams and multilingual content workflows.' },
  ],
  [
    { icon: '🔌', title: 'Chrome Extension', description: 'Humanize directly in your browser. Works on any website, CMS, or web app without switching tabs.' },
    { icon: '⚙️', title: 'REST API', description: 'Full API access on paid plans. Integrate humanization into any platform or automation workflow.' },
    { icon: '📦', title: 'Bulk Processing', description: 'Process hundreds of documents simultaneously. Ideal for agencies and high-volume content teams.' },
    { icon: '📊', title: 'Usage Analytics', description: 'Track words processed, bypass rates, and team usage. Optimize your workflow with real data.' },
  ],
  [
    { icon: '🚀', title: 'Instant Results', description: 'No waiting, no queues. HumanifyLab processes content in real time — results in under 10 seconds.' },
    { icon: '✅', title: 'Meaning Preserved', description: '100% of your original meaning is preserved. Only the AI writing patterns are transformed.' },
    { icon: '🌐', title: 'Works Everywhere', description: 'Web app, Chrome extension, API, mobile — HumanifyLab works wherever your workflow takes you.' },
    { icon: '💰', title: 'Free Plan Available', description: 'Start free with no sign-up required. Upgrade for unlimited words, bulk processing, and API access.' },
  ],
];

const FAQ_SETS = [
  [
    { q: 'Does HumanifyLab work with my existing tools?', a: 'Yes. HumanifyLab works with any tool or platform. Simply copy your AI-generated content from your tool, paste it into HumanifyLab, and get humanized output in under 10 seconds.' },
    { q: 'Is there a native integration or plugin?', a: 'HumanifyLab offers a Chrome extension for browser-based integration, an API for developer integration, and Zapier support for no-code automation. Direct plugins for specific platforms are in development.' },
    { q: 'Can I use HumanifyLab in my content workflow?', a: 'Yes. HumanifyLab is designed to fit into any content workflow. Use it as a final step before publishing, submitting, or sending — it takes under 10 seconds and requires no configuration.' },
    { q: 'Does the API work with my platform?', a: 'Yes. The HumanifyLab API is a standard REST API that works with any platform, programming language, or content management system. Full documentation is available for developers.' },
    { q: 'Is HumanifyLab free to use with my tools?', a: 'Yes. HumanifyLab offers a free plan with no sign-up required. You can integrate it into your workflow immediately and upgrade to a paid plan for unlimited words and API access.' },
  ],
  [
    { q: 'How do I use HumanifyLab with my writing tool?', a: 'Simply copy your AI-generated text from your writing tool, paste it into HumanifyLab, click Humanize, and copy the output back. The entire process takes under 30 seconds.' },
    { q: 'Does HumanifyLab preserve formatting from my tool?', a: 'HumanifyLab preserves the text content and structure. For tools with rich formatting, paste as plain text and reapply formatting after humanization.' },
    { q: 'Can I automate humanization in my workflow?', a: 'Yes. With the HumanifyLab API and Zapier integration, you can automate humanization as part of your content pipeline. Content can be humanized automatically before publishing or submission.' },
    { q: 'Is there a bulk option for processing multiple documents?', a: 'Yes. Bulk processing is available on paid plans, allowing you to humanize multiple documents simultaneously. This is ideal for content teams using CMS platforms or document management systems.' },
    { q: 'Does HumanifyLab work on mobile devices?', a: 'Yes. HumanifyLab is fully responsive and works on any device. You can use it on your phone or tablet to humanize content from any mobile app or platform.' },
  ],
  [
    { q: 'Why should I use HumanifyLab instead of my tool\'s built-in humanizer?', a: 'Most writing tools offer basic paraphrasing that does not address the statistical patterns AI detectors measure. HumanifyLab performs deep linguistic transformation with a 99.9% bypass rate — far superior to built-in options.' },
    { q: 'Does HumanifyLab work with AI writing assistants?', a: 'Yes. HumanifyLab is specifically designed to humanize output from AI writing assistants including ChatGPT, Claude, Gemini, Jasper, Copy.ai, and any other AI tool.' },
    { q: 'Can I use HumanifyLab for content I generate in my CMS?', a: 'Yes. HumanifyLab works with content from any CMS including WordPress, Webflow, Shopify, HubSpot, and more. Copy the content, humanize it, and paste it back.' },
    { q: 'Is there a team plan for collaborative workflows?', a: 'Yes. HumanifyLab offers team and enterprise plans with shared dashboards, team billing, and collaborative features for content teams working across multiple tools and platforms.' },
    { q: 'How does HumanifyLab handle different content types from my tool?', a: 'HumanifyLab handles any text content — blog posts, emails, reports, scripts, product descriptions, and more. The tool automatically adapts to the content type and applies appropriate humanization.' },
  ],
  [
    { q: 'Does HumanifyLab integrate with Google Docs?', a: 'Yes. Copy your content from Google Docs, paste it into HumanifyLab, humanize it, and paste the output back. The process takes under 30 seconds. API integration enables automated Google Docs workflows.' },
    { q: 'Can I use HumanifyLab with WordPress?', a: 'Yes. HumanifyLab works with WordPress content. Copy from the editor, humanize, and paste back. The Chrome extension makes this even faster. API integration enables automated WordPress publishing workflows.' },
    { q: 'Does HumanifyLab work with Shopify product descriptions?', a: 'Yes. HumanifyLab is widely used by Shopify sellers to humanize AI-generated product descriptions. The humanized content passes marketplace AI detection and reads more naturally to buyers.' },
    { q: 'Can I integrate HumanifyLab with my email marketing platform?', a: 'Yes. HumanifyLab integrates with email marketing platforms via API or Zapier. Humanize email campaigns automatically before sending to ensure they pass spam filters and AI detection.' },
    { q: 'Is there a HumanifyLab plugin for my CMS?', a: 'HumanifyLab offers a Chrome extension that works with any web-based CMS. Native plugins for WordPress, Webflow, and other platforms are in development. The API enables custom integrations today.' },
  ],
];

const FINAL_CTA_TITLES = [
  (kw: string, platform: string) => `Start Using HumanifyLab with ${platform || 'Your Tool'}`,
  (kw: string) => `Integrate HumanifyLab Into Your Workflow`,
  (kw: string) => `Start Free — Works with Any Tool`,
  (kw: string) => `Add HumanifyLab to Your Workflow Today`,
  (kw: string) => `Get Started — No Setup Required`,
  (kw: string) => `Try HumanifyLab Free with Your Tools`,
];

const FINAL_CTA_SUBTITLES = [
  'Free plan available. No sign-up required. Works with any tool or platform.',
  'Join 450,000+ users who trust HumanifyLab. Start free — no credit card needed.',
  '99.9% bypass rate. Works with any tool. Instant results. Try free today.',
  'No account needed. Paste your content and get undetectable output in seconds.',
  'Free plan, instant results, works everywhere. Add HumanifyLab to your workflow now.',
  'Trusted by content teams worldwide. Free to start, scales to any volume.',
];

export function generateToolContent(entry: KeywordEntryV3): ToolContentData {
  const { keyword, seed } = entry;
  const platformKey = Object.keys(PLATFORM_CONTEXT).find(k => keyword.toLowerCase().includes(k)) ?? '';
  const ctx = PLATFORM_CONTEXT[platformKey] ?? DEFAULT_PLATFORM;

  const combo = buildPageStrings(keyword, seed, platformKey, 'tool');
  const isi = uniqueIdx(seed, keyword, INTEGRATION_SETS.length, 4);
  const ssi = uniqueIdx(seed, keyword, STEP_SETS.length, 5);
  const fsi = uniqueIdx(seed, keyword, FEATURE_SETS.length, 6);
  // fi removed — FAQs now use keyword-specific buildFaqs

  const stats = buildStats(keyword, seed);

  // Build platform-specific integration card as first item
  const integrations = [
    { icon: ctx.icon, title: `Works with ${platformKey || 'Your Tool'}`, description: `HumanifyLab integrates seamlessly with ${platformKey || 'any platform'}. ${ctx.audience.charAt(0).toUpperCase() + ctx.audience.slice(1)} can ${ctx.workflow}.` },
    ...INTEGRATION_SETS[isi]!.slice(0, 5),
  ];

  const integrationTitles = ['Seamless Integration', 'Works with Your Stack', 'Fits Into Any Workflow', 'Integration Options'];
  const featuresTitles = ['Why HumanifyLab', 'Key Features', 'What You Get', 'The HumanifyLab Advantage'];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats,
    integrationTitle: integrationTitles[uniqueIdx(seed, keyword, integrationTitles.length, 12)]!,
    integrations,
    stepsTitle: ['How It Works', 'Get Started in 4 Steps', 'Your Integration Workflow', 'How to Use HumanifyLab'][uniqueIdx(seed, keyword, 4, 13)]!,
    steps: STEP_SETS[ssi]!,
    featuresTitle: featuresTitles[uniqueIdx(seed, keyword, featuresTitles.length, 14)]!,
    features: FEATURE_SETS[fsi]!,
    faqTitle: combo.faqTitle,
    faqs: buildFaqs(keyword, seed, entry.entity ?? '', 'tool'),
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
