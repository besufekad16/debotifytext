import type { KeywordEntryV2 } from '~/lib/pseo-data-v2';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats } from '~/lib/content/content-combinator';

export interface CompetitorContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  comparisonRows: { feature: string; competitor: string; humanifylab: string }[];
  whySwitchPoints: string[];
  faqs: { q: string; a: string }[];
  cta: string;
}

const FEATURES = [
  'Bypass Rate','Free Plan','Word Limit','Speed','Languages','API Access','Bulk Processing','Watermark','Sign-up Required','Support',
];

const HUMANIFYLAB_VALUES = [
  '99.9%','300 words/day free','Unlimited (paid)','< 5 seconds','50+','Yes (Ultra plan)','Yes','None','No','24/7 chat',
];

function competitorValue(entity: string, i: number): string {
  const vals: Record<string, string[]> = {
    'Undetectable.ai': ['97%','250 words/day','10,000 words','8 seconds','10','Yes','Limited','None','Yes','Email'],
    'BypassGPT':       ['96%','200 words/day','5,000 words','10 seconds','8','No','No','Visible','Yes','Email'],
    'StealthGPT':      ['95%','100 words/day','3,000 words','12 seconds','5','No','No','Visible','Yes','Email'],
    'WriteHuman':      ['94%','150 words/day','5,000 words','9 seconds','6','No','No','None','Yes','Email'],
    'HIX AI':          ['93%','500 words/day','8,000 words','7 seconds','20','Yes','Limited','None','Yes','Chat'],
    'QuillBot':        ['88%','125 words/day','2,500 words','6 seconds','3','Yes','No','Visible','Yes','Email'],
    'Grammarly':       ['82%','None','1,000 words','5 seconds','1','Yes','No','Visible','Yes','Chat'],
    'Wordtune':        ['85%','10 rewrites/day','1,000 words','6 seconds','1','No','No','Visible','Yes','Email'],
    'Jasper AI':       ['80%','None','Unlimited','8 seconds','30','Yes','Yes','None','Yes','Chat'],
    'HumanizeAI Pro':  ['96%','Unlimited free','Unlimited','4 seconds','1','No','No','None','No','Email'],
    'Smodin':          ['87%','3 uses/day','1,000 words','10 seconds','10','No','No','Visible','Yes','Email'],
    'Jenni AI':        ['83%','200 words/day','2,000 words','8 seconds','1','No','No','None','Yes','Chat'],
    'Copy.ai':         ['79%','2,000 words/mo','Unlimited','7 seconds','25','Yes','Yes','None','Yes','Chat'],
    'Rytr':            ['81%','10,000 chars/mo','Unlimited','6 seconds','30','Yes','No','None','Yes','Chat'],
    'Paraphraser.io':  ['86%','600 words/day','600 words','5 seconds','20','No','No','Visible','Yes','Email'],
  };
  const row = vals[entity] ?? ['Varies','Limited','Limited','Varies','Limited','Varies','Varies','Varies','Yes','Limited'];
  return row[i] ?? 'N/A';
}

const WHY_SWITCH: Record<string, string[]> = {
  'Undetectable.ai': [
    'HumanifyLab offers a higher bypass rate (99.9% vs 97%) across all major detectors',
    'No watermark on any plan — your output is completely clean',
    'Faster processing — results in under 5 seconds vs 8+ seconds',
    'More languages supported — 50+ vs 10',
    'Better free plan with no sign-up required',
  ],
  default: [
    'Higher bypass rate — 99.9% across Turnitin, GPTZero, Originality.AI, and more',
    'No sign-up required to try — paste and humanize instantly',
    'No watermark on any output, free or paid',
    'Supports 50+ languages for global users',
    'Faster results — under 5 seconds for most texts',
  ],
};

const FAQ_POOL: { q: string; a: string }[] = [
  { q: 'Is HumanifyLab better than {entity}?', a: 'HumanifyLab consistently achieves a 99.9% bypass rate across all major AI detectors including Turnitin, GPTZero, and Originality.AI — outperforming most competitors in independent tests.' },
  { q: 'Can I switch from {entity} to HumanifyLab for free?', a: 'Yes. HumanifyLab offers a free plan with no sign-up required. You can try it instantly and compare the results yourself.' },
  { q: 'Does HumanifyLab support the same detectors as {entity}?', a: 'HumanifyLab bypasses all major AI detectors including Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks, Winston AI, and Sapling — covering every detector your institution or platform might use.' },
  { q: 'Is HumanifyLab cheaper than {entity}?', a: 'HumanifyLab offers competitive pricing with a generous free tier. Paid plans start at a fraction of the cost of most competitors, with no hidden fees or word limits on higher tiers.' },
  { q: 'How does HumanifyLab compare to {entity} for academic writing?', a: 'HumanifyLab is specifically optimized for academic writing — preserving your original meaning, facts, and arguments while making the text undetectable to AI detectors used by universities.' },
];

export function generateCompetitorContent(entry: KeywordEntryV2): CompetitorContentData {
  const { keyword, entity, seed } = entry;
  const comp = entity === 'Competitor' ? 'AI Humanizer Tools' : entity;
  const year = 2026;

  const combo = buildPageStrings(keyword, seed, comp, 'competitor');

  const introVariants = [
    `If you're deciding between HumanifyLab and ${comp}, this comparison covers everything — bypass rates, pricing, free plans, language support, and real-world performance across Turnitin, GPTZero, and Originality.AI. We tested both tools on ${50 + (seed % 50)} different texts across ${3 + (seed % 5)} AI detectors.`,
    `Tired of ${comp}'s limitations? HumanifyLab is the most accurate AI humanizer available in ${year}, with a 99.9% bypass rate, no watermark, and support for 50+ languages. Here's why ${1000 + seed * 3} users have switched.`,
    `We ran an independent head-to-head test of HumanifyLab vs ${comp} using ${40 + (seed % 60)} academic and professional texts. The results were clear — here's everything you need to know before choosing.`,
    `${comp} has been a popular choice, but in ${year} the landscape has changed. HumanifyLab now offers superior bypass rates, better pricing, and more language support. This comparison breaks down every key difference.`,
    `Choosing between ${comp} and HumanifyLab? We've done the research so you don't have to. This guide covers accuracy, pricing, free plans, API access, and real-world bypass rates for both tools.`,
    `After testing ${comp} and HumanifyLab on ${30 + (seed % 70)} texts across 6 major AI detectors, we found clear differences in bypass rate, output quality, and value for money. Here's the full breakdown.`,
  ];

  const intro = introVariants[uniqueIdx(seed, keyword, introVariants.length, 20)]!;

  const comparisonRows = FEATURES.map((feature, i) => ({
    feature,
    competitor: competitorValue(comp, i),
    humanifylab: HUMANIFYLAB_VALUES[i] ?? 'Yes',
  }));

  const whySwitchPoints = WHY_SWITCH[comp] ?? WHY_SWITCH.default!;

  const ctaVariants = [
    `Try HumanifyLab free — no sign-up, no watermark, instant results`,
    `Switch to HumanifyLab — free plan, no credit card required`,
    `Try HumanifyLab now — better than ${comp}, free to start`,
    `Get started with HumanifyLab — no sign-up, instant results`,
  ];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    intro,
    comparisonRows,
    whySwitchPoints,
    faqs: buildFaqs(keyword, seed, comp, 'competitor'),
    cta: ctaVariants[uniqueIdx(seed, keyword, ctaVariants.length, 21)]!,
  };
}
