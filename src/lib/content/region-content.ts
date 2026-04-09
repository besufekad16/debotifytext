import type { KeywordEntryV3 } from '~/lib/pseo-data-v3';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildSteps, buildStats } from '~/lib/content/content-combinator';

export interface RegionContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  stats: { value: string; label: string }[];
  regionTitle: string;
  regionPoints: { icon: string; title: string; description: string }[];
  stepsTitle: string;
  steps: { number: string; title: string; description: string }[];
  institutionsTitle: string;
  institutions: { name: string; country: string; detectorUsed: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const REGION_CONTEXT: Record<string, { flag: string; institutions: string; detector: string; note: string }> = {
  uk:              { flag: '🇬🇧', institutions: 'UK universities and Russell Group institutions', detector: 'Turnitin (widely used across UK HE)', note: 'UK universities are among the most aggressive adopters of AI detection' },
  'united kingdom':{ flag: '🇬🇧', institutions: 'UK universities and Russell Group institutions', detector: 'Turnitin', note: 'UK universities are among the most aggressive adopters of AI detection' },
  us:              { flag: '🇺🇸', institutions: 'US colleges and universities', detector: 'Turnitin and GPTZero', note: 'US institutions use multiple AI detectors simultaneously' },
  usa:             { flag: '🇺🇸', institutions: 'US colleges and universities', detector: 'Turnitin and GPTZero', note: 'US institutions use multiple AI detectors simultaneously' },
  'united states': { flag: '🇺🇸', institutions: 'US colleges and universities', detector: 'Turnitin and GPTZero', note: 'US institutions use multiple AI detectors simultaneously' },
  canada:          { flag: '🇨🇦', institutions: 'Canadian universities', detector: 'Turnitin', note: 'Canadian universities follow similar AI policies to US institutions' },
  australia:       { flag: '🇦🇺', institutions: 'Australian universities', detector: 'Turnitin and Copyleaks', note: 'Australian universities have strict AI integrity policies' },
  india:           { flag: '🇮🇳', institutions: 'Indian universities and IITs', detector: 'Turnitin and Originality.AI', note: 'Indian institutions are rapidly adopting AI detection tools' },
  nigeria:         { flag: '🇳🇬', institutions: 'Nigerian universities', detector: 'Turnitin', note: 'Nigerian universities increasingly use AI detection for submissions' },
  germany:         { flag: '🇩🇪', institutions: 'German universities', detector: 'Turnitin and Compilatio', note: 'German institutions have strict academic integrity standards' },
  france:          { flag: '🇫🇷', institutions: 'French universities', detector: 'Compilatio and Turnitin', note: 'French institutions use Compilatio alongside international tools' },
  singapore:       { flag: '🇸🇬', institutions: 'Singapore universities including NUS and NTU', detector: 'Turnitin', note: 'Singapore universities are highly competitive with strict AI policies' },
  philippines:     { flag: '🇵🇭', institutions: 'Philippine universities', detector: 'Turnitin and GPTZero', note: 'Philippine institutions are rapidly adopting AI detection' },
  pakistan:        { flag: '🇵🇰', institutions: 'Pakistani universities', detector: 'Turnitin', note: 'Pakistani universities use Turnitin for academic submissions' },
  kenya:           { flag: '🇰🇪', institutions: 'Kenyan universities', detector: 'Turnitin', note: 'Kenyan institutions are adopting AI detection tools' },
  'south africa':  { flag: '🇿🇦', institutions: 'South African universities', detector: 'Turnitin', note: 'South African universities use Turnitin widely' },
  uae:             { flag: '🇦🇪', institutions: 'UAE universities', detector: 'Turnitin', note: 'UAE institutions have strict academic integrity policies' },
  ireland:         { flag: '🇮🇪', institutions: 'Irish universities', detector: 'Turnitin', note: 'Irish universities follow UK-style AI detection policies' },
  'new zealand':   { flag: '🇳🇿', institutions: 'New Zealand universities', detector: 'Turnitin', note: 'NZ universities follow Australian-style AI detection policies' },
};

const HERO_SUBTITLES = [
  (institutions: string) => `Trusted by students at ${institutions}. 99.9% bypass rate, 50+ languages, free plan available.`,
  (institutions: string) => `Students at ${institutions} use HumanifyLab to pass every AI detector. Free plan, instant results.`,
  (institutions: string) => `The AI humanizer trusted by ${institutions}. 99.9% bypass rate, zero data stored, no sign-up needed.`,
  (institutions: string) => `${institutions} students rely on HumanifyLab to bypass AI detection. Free to start, results in 10 seconds.`,
  (institutions: string) => `Bypass AI detection at ${institutions} with a 99.9% success rate. Free plan, 50+ languages, instant results.`,
  (institutions: string) => `HumanifyLab is the #1 AI humanizer for students at ${institutions}. Free plan, no sign-up, instant results.`,
];

const REGION_POINT_SETS = [
  (ctx: { flag: string; institutions: string; detector: string; note: string }, regionKey: string) => [
    { icon: ctx.flag, title: `Built for ${regionKey ? regionKey.charAt(0).toUpperCase() + regionKey.slice(1) : 'Global'} Students`, description: `HumanifyLab is trusted by students at ${ctx.institutions}. Bypass ${ctx.detector} with a 99.9% success rate.` },
    { icon: '🎓', title: 'University-Grade Bypass', description: `${ctx.note}. HumanifyLab stays ahead of every update with weekly testing against live systems.` },
    { icon: '🌍', title: '50+ Languages Supported', description: 'Humanize content in your native language. The same 99.9% bypass rate applies across all 50+ supported languages.' },
    { icon: '⚡', title: 'Instant Results', description: 'Get humanized, undetectable content in under 10 seconds. Fast enough for any deadline, any time zone.' },
    { icon: '🔒', title: 'Complete Privacy', description: 'Zero data retention. Your academic content is never stored or shared. Complete privacy for sensitive submissions.' },
    { icon: '💰', title: 'Free Plan Available', description: 'No sign-up required. Start bypassing AI detection immediately with the free plan. Upgrade for unlimited words.' },
  ],
  (ctx: { flag: string; institutions: string; detector: string; note: string }, regionKey: string) => [
    { icon: '🎯', title: `Bypass ${ctx.detector}`, description: `${ctx.detector} is used by ${ctx.institutions}. HumanifyLab achieves a 99.9% bypass rate — tested weekly against live systems.` },
    { icon: ctx.flag, title: `Trusted by ${regionKey ? regionKey.charAt(0).toUpperCase() + regionKey.slice(1) : 'Global'} Students`, description: `Students at ${ctx.institutions} trust HumanifyLab to pass AI detection. Free plan, instant results, no sign-up.` },
    { icon: '📝', title: 'Academic Writing Optimized', description: 'HumanifyLab\'s Academic tone is specifically designed for university submissions. Formal, scholarly, and undetectable.' },
    { icon: '⚡', title: 'Results Before Your Deadline', description: 'HumanifyLab processes any text in under 10 seconds. Fast enough for last-minute submissions.' },
    { icon: '🌍', title: 'Multilingual Support', description: 'Write in your native language. HumanifyLab supports 50+ languages with the same 99.9% bypass rate.' },
    { icon: '🛡️', title: 'Zero Data Retention', description: 'Your academic content is never stored. Complete privacy for sensitive submissions and research.' },
  ],
  (ctx: { flag: string; institutions: string; detector: string; note: string }, regionKey: string) => [
    { icon: '🏆', title: '99.9% Bypass Rate', description: `HumanifyLab achieves a 99.9% bypass rate against ${ctx.detector} used by ${ctx.institutions}. Verified weekly.` },
    { icon: ctx.flag, title: `${regionKey ? regionKey.charAt(0).toUpperCase() + regionKey.slice(1) : 'Global'} University Coverage`, description: `${ctx.note}. HumanifyLab is the most reliable solution for students at ${ctx.institutions}.` },
    { icon: '🔬', title: 'Deep Linguistic Transformation', description: 'HumanifyLab targets perplexity, burstiness, and semantic entropy — the exact signals AI detectors measure.' },
    { icon: '📱', title: 'Works on Any Device', description: 'Access HumanifyLab from your phone, tablet, or laptop. No app download required — works in any browser.' },
    { icon: '💡', title: 'No Technical Knowledge Needed', description: 'Paste your content, click Humanize, get results. HumanifyLab is designed for students, not developers.' },
    { icon: '🎓', title: 'Academic Tone Preset', description: 'Choose the Academic tone for university submissions. Formal, scholarly writing that passes every detector.' },
  ],
];

const STEP_SETS = [
  (ctx: { detector: string }) => [
    { number: '01', title: 'Paste Your Content', description: 'Copy your AI-generated essay, assignment, or thesis and paste it into HumanifyLab. Any language, any length.' },
    { number: '02', title: 'Select Academic Tone', description: `Choose the Academic tone preset for university submissions. Select Maximum intensity for ${ctx.detector}.` },
    { number: '03', title: 'Humanize in Seconds', description: 'Click Humanize. Your content is transformed in under 10 seconds with a 99.9% bypass rate.' },
    { number: '04', title: 'Submit with Confidence', description: `Test against ${ctx.detector} — you will see 0-3% AI. Submit to your university with complete confidence.` },
  ],
  (ctx: { detector: string }) => [
    { number: '01', title: 'Copy Your AI Text', description: 'Take your AI-generated assignment and copy it. HumanifyLab works with any AI tool output — ChatGPT, Claude, Gemini.' },
    { number: '02', title: 'Open HumanifyLab Free', description: 'Visit HumanifyLab.com — no account needed. Paste your content. Free plan handles up to 500 words per run.' },
    { number: '03', title: 'Click Humanize', description: `Select Maximum intensity for ${ctx.detector}. Click Humanize. Deep transformation begins immediately.` },
    { number: '04', title: 'Get 0% AI Score', description: `Your content is ready in under 10 seconds. Test it on ${ctx.detector} — you'll see 0-3% AI. Safe to submit.` },
  ],
  (ctx: { detector: string }) => [
    { number: '01', title: 'Generate Your Draft', description: 'Use any AI tool to draft your essay or assignment. Focus on the content — HumanifyLab handles the detection.' },
    { number: '02', title: 'Paste into HumanifyLab', description: 'Copy your draft and paste it into HumanifyLab. Choose Academic tone and Maximum intensity.' },
    { number: '03', title: 'Transform in Real Time', description: `HumanifyLab processes your content in real time. ${ctx.detector} will see 0-3% AI after transformation.` },
    { number: '04', title: 'Review and Submit', description: 'Read through the humanized output to confirm quality. Then submit with complete confidence.' },
  ],
];

const INSTITUTION_SETS = [
  [
    { name: 'Oxford University', country: 'UK', detectorUsed: 'Turnitin' },
    { name: 'Harvard University', country: 'USA', detectorUsed: 'Turnitin + GPTZero' },
    { name: 'University of Toronto', country: 'Canada', detectorUsed: 'Turnitin' },
    { name: 'University of Melbourne', country: 'Australia', detectorUsed: 'Turnitin + Copyleaks' },
    { name: 'IIT Delhi', country: 'India', detectorUsed: 'Turnitin' },
    { name: 'NUS Singapore', country: 'Singapore', detectorUsed: 'Turnitin' },
  ],
  [
    { name: 'Cambridge University', country: 'UK', detectorUsed: 'Turnitin' },
    { name: 'MIT', country: 'USA', detectorUsed: 'Turnitin + GPTZero' },
    { name: 'McGill University', country: 'Canada', detectorUsed: 'Turnitin' },
    { name: 'University of Sydney', country: 'Australia', detectorUsed: 'Turnitin' },
    { name: 'University of Lagos', country: 'Nigeria', detectorUsed: 'Turnitin' },
    { name: 'University of Cape Town', country: 'South Africa', detectorUsed: 'Turnitin' },
  ],
  [
    { name: 'Imperial College London', country: 'UK', detectorUsed: 'Turnitin' },
    { name: 'Stanford University', country: 'USA', detectorUsed: 'Turnitin + Originality.AI' },
    { name: 'University of British Columbia', country: 'Canada', detectorUsed: 'Turnitin' },
    { name: 'Monash University', country: 'Australia', detectorUsed: 'Turnitin + Copyleaks' },
    { name: 'University of Nairobi', country: 'Kenya', detectorUsed: 'Turnitin' },
    { name: 'American University of Dubai', country: 'UAE', detectorUsed: 'Turnitin' },
  ],
];

const FAQ_SETS = [
  [
    { q: 'Does HumanifyLab work for students in my country?', a: 'Yes. HumanifyLab is used by students in over 100 countries worldwide. The tool bypasses all major AI detectors used by universities globally, including Turnitin, GPTZero, Originality.AI, and Copyleaks.' },
    { q: 'Does HumanifyLab bypass Turnitin used by my university?', a: 'Yes. HumanifyLab achieves a 99.9% bypass rate on Turnitin. We test against live Turnitin systems weekly and update our algorithms to maintain this rate as Turnitin evolves.' },
    { q: 'Is HumanifyLab available in my country?', a: 'Yes. HumanifyLab is a web-based tool available globally. You can access it from any country with an internet connection. No VPN or special setup required.' },
    { q: 'Does HumanifyLab support my language?', a: 'Yes. HumanifyLab supports 50+ languages including English, Spanish, French, German, Arabic, Chinese, Portuguese, Hindi, and many more. The same 99.9% bypass rate applies across all supported languages.' },
    { q: 'Is HumanifyLab free for international students?', a: 'Yes. HumanifyLab offers a free plan with no sign-up required. International students can use it immediately without any payment or registration.' },
  ],
  [
    { q: 'Which AI detectors do universities in my region use?', a: 'Most universities worldwide use Turnitin as their primary AI detector. Many also use GPTZero, Originality.AI, and Copyleaks. HumanifyLab bypasses all of these with a 99.9% success rate.' },
    { q: 'Does HumanifyLab work for non-English academic writing?', a: 'Yes. HumanifyLab supports 50+ languages and achieves the same bypass rate for non-English content. Students writing in French, German, Spanish, Arabic, Chinese, and other languages get the same results.' },
    { q: 'Can I use HumanifyLab for university assignments in my country?', a: 'HumanifyLab is used by students at universities worldwide for assignments, essays, theses, and dissertations. Always review your institution\'s AI policy before submitting.' },
    { q: 'Is HumanifyLab legal to use in my country?', a: 'HumanifyLab is a legal tool available worldwide. Whether using AI assistance is permitted at your institution depends on your university\'s specific AI policy. Always check your institution\'s guidelines.' },
    { q: 'How do I access HumanifyLab from my country?', a: 'Simply visit humanifylab.com from any device with an internet connection. No VPN, no special setup, no registration required. The free plan is available immediately.' },
  ],
  [
    { q: 'Does HumanifyLab work for students at top universities?', a: 'Yes. HumanifyLab is used by students at top universities worldwide including Ivy League, Russell Group, and other leading institutions. The tool bypasses the same Turnitin and GPTZero systems used by these universities.' },
    { q: 'Is there a student discount for international students?', a: 'Yes. HumanifyLab offers student discounts on paid plans. International students can apply for a discount with a valid student email address. Contact support for details.' },
    { q: 'Does HumanifyLab work for online courses and distance learning?', a: 'Yes. HumanifyLab works for any submission format — online courses, distance learning, in-person classes, and hybrid programs. The tool bypasses AI detection regardless of how the submission is made.' },
    { q: 'Can I use HumanifyLab on my phone while studying abroad?', a: 'Yes. HumanifyLab is fully mobile-responsive and works on any device. Students studying abroad can use it on their phone or tablet from anywhere in the world.' },
    { q: 'Does HumanifyLab preserve academic writing style for my region?', a: 'Yes. HumanifyLab\'s Academic tone preset is designed for formal academic writing appropriate for universities worldwide. The output maintains the scholarly style expected by institutions in any country.' },
  ],
  [
    { q: 'How does HumanifyLab handle different academic writing styles?', a: 'HumanifyLab offers multiple tone presets including Academic, Professional, and Casual. The Academic preset is specifically optimized for university writing styles across different regions and disciplines.' },
    { q: 'Can I use HumanifyLab for my thesis or dissertation?', a: 'Yes. HumanifyLab handles documents of any length. A full thesis or dissertation can be processed in sections, with each section achieving 0-3% AI score. The Academic tone preserves scholarly writing conventions.' },
    { q: 'Does HumanifyLab work for postgraduate students?', a: 'Yes. HumanifyLab is widely used by postgraduate students including Masters and PhD candidates. The tool handles complex academic writing and preserves technical terminology and citations.' },
    { q: 'What if my university uses a detector I haven\'t heard of?', a: 'HumanifyLab bypasses all major AI detectors and many lesser-known ones. If you\'re unsure which detector your university uses, contact support — we can advise on the best settings for your specific situation.' },
    { q: 'Is HumanifyLab better than manually rewriting my assignment?', a: 'Yes. Manual rewriting takes hours and often misses the statistical patterns AI detectors measure. HumanifyLab does it in under 10 seconds with a 99.9% bypass rate — far more reliable and efficient.' },
  ],
];

const FINAL_CTA_TITLES = [
  (regionKey: string) => `Start Bypassing AI Detection Today`,
  (regionKey: string) => `Get 0% AI Score at Your University`,
  (regionKey: string) => `${regionKey ? regionKey.charAt(0).toUpperCase() + regionKey.slice(1) + ' Students' : 'Students'} — Start Free`,
  (regionKey: string) => `Bypass AI Detection at Your University`,
  (regionKey: string) => `Join Students Worldwide — Start Free`,
  (regionKey: string) => `Fix Your AI Detection Problem Now`,
];

const FINAL_CTA_SUBTITLES = [
  'Free plan available. No sign-up required. Works at universities worldwide.',
  'Join 450,000+ students who trust HumanifyLab. Start free — no credit card needed.',
  '99.9% bypass rate. 50+ languages. Zero data stored. Try free today.',
  'No account needed. Paste your essay and get 0% AI score in seconds.',
  'Free plan, instant results, academic tone preset. Start bypassing AI detection now.',
  'Trusted by students at universities worldwide. Free to start, no commitment.',
];

export export function generateRegionContent(entry: KeywordEntryV3): RegionContentData {
  const { keyword, seed } = entry;
  const regionKey = Object.keys(REGION_CONTEXT).find(k => keyword.toLowerCase().includes(k)) ?? '';
  const ctx = REGION_CONTEXT[regionKey] ?? DEFAULT_REGION;

  const combo = buildPageStrings(keyword, seed, regionKey, 'region');
  const rpi = uniqueIdx(seed, keyword, REGION_POINT_SETS.length, 4);
  const ssi = uniqueIdx(seed, keyword, STEP_SETS.length, 5);
  const isi = uniqueIdx(seed, keyword, INSTITUTION_SETS.length, 6);
  const fi = uniqueIdx(seed, keyword, FAQ_SETS.length, 7);

  const stats = buildStats(keyword, seed);

  const regionTitles = [
    `AI Detection at ${regionKey ? regionKey.charAt(0).toUpperCase() + regionKey.slice(1) : 'Global'} Universities`,
    `How ${regionKey ? regionKey.charAt(0).toUpperCase() + regionKey.slice(1) : 'Global'} Universities Use AI Detection`,
    `AI Detection Policies at ${regionKey ? regionKey.charAt(0).toUpperCase() + regionKey.slice(1) : 'Global'} Institutions`,
    `Bypassing AI Detection at ${regionKey ? regionKey.charAt(0).toUpperCase() + regionKey.slice(1) : 'Global'} Universities`,
  ];
  const stepsTitles = [
    'How to Bypass AI Detection at Your University',
    'Your 4-Step Guide to 0% AI Score',
    'How to Pass AI Detection in 4 Steps',
    'Get 0% AI Score at Your University',
  ];
  const institutionsTitles = [
    'Universities Where HumanifyLab Works',
    'Institutions That Use AI Detection',
    'Universities Bypassed by HumanifyLab',
    'Where HumanifyLab Students Study',
  ];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats,
    regionTitle: regionTitles[uniqueIdx(seed, keyword, regionTitles.length, 12)]!,
    regionPoints: REGION_POINT_SETS[rpi]!(ctx, regionKey),
    stepsTitle: stepsTitles[uniqueIdx(seed, keyword, stepsTitles.length, 13)]!,
    steps: STEP_SETS[ssi]!(ctx),
    institutionsTitle: institutionsTitles[uniqueIdx(seed, keyword, institutionsTitles.length, 14)]!,
    institutions: INSTITUTION_SETS[isi]!,
    faqTitle: combo.faqTitle,
    faqs: FAQ_SETS[fi]!,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
