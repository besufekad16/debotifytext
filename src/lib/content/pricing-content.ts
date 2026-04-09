import type { KeywordEntryV3 } from '~/lib/pseo-data-v3';
import { uniqueIdx, uniqueNum } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats } from '~/lib/content/content-combinator';

export interface PricingPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  stats: { value: string; label: string }[];
  plansTitle: string;
  plans: { name: string; price: string; period: string; description: string; features: string[]; cta: string; highlighted: boolean }[];
  valueTitle: string;
  valueProps: { icon: string; title: string; description: string }[];
  comparisonTitle: string;
  comparisonRows: { feature: string; humanifylab: string; others: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

const TITLES = [
  (kw: string) => `${kw} — Complete Pricing Guide 2026`,
  (kw: string) => `${kw}: Plans, Costs & Free Options`,
  (kw: string) => `${kw} | HumanifyLab Pricing Breakdown`,
  (kw: string) => `${kw} — Is It Worth It? Full Review`,
  (kw: string) => `${kw}: Best Value AI Humanizer Plans`,
  (kw: string) => `${kw} — Free vs Paid Comparison 2026`,
  (kw: string) => `${kw} | Affordable AI Humanizer Options`,
  (kw: string) => `${kw} — Save Money on AI Humanization`,
];

const DESCRIPTIONS = [
  (kw: string) => `Looking for ${kw}? HumanifyLab offers a free plan with no credit card required, plus affordable paid plans starting from just a few dollars. Compare all options here.`,
  (kw: string) => `${kw} — HumanifyLab gives you the best value AI humanizer with a generous free tier and premium plans for power users. See full pricing breakdown.`,
  (kw: string) => `Searching for ${kw}? Get HumanifyLab free today — no sign-up required. Upgrade anytime for unlimited words, bulk processing, and API access.`,
  (kw: string) => `${kw}: HumanifyLab's transparent pricing means no hidden fees. Start free, upgrade when you need more. Full plan comparison inside.`,
  (kw: string) => `Find the best ${kw} with HumanifyLab. Free plan available, student discounts, bulk pricing, and enterprise options. 99.9% bypass rate guaranteed.`,
  (kw: string) => `${kw} — Compare HumanifyLab's free and paid plans. Get unlimited AI humanization, bypass Turnitin and GPTZero, starting at $0/month.`,
  (kw: string) => `Need ${kw}? HumanifyLab offers the most affordable AI humanizer with a free tier, monthly plans, and annual discounts. No credit card needed to start.`,
  (kw: string) => `${kw}: HumanifyLab pricing is designed for students, freelancers, and enterprises alike. Start free, scale as you grow. Full breakdown here.`,
];

const H1S = [
  (kw: string) => `${kw}: Every Plan Explained`,
  (kw: string) => `${kw} — HumanifyLab's Full Pricing`,
  (kw: string) => `${kw}: Free & Paid Options`,
  (kw: string) => `${kw} — What You Actually Pay`,
  (kw: string) => `${kw}: Best Value in 2026`,
  (kw: string) => `${kw} — Compare All Plans`,
  (kw: string) => `${kw}: Transparent Pricing`,
  (kw: string) => `${kw} — No Hidden Fees`,
];

const SUBTITLES = [
  'Start free, upgrade when you need more. No credit card required.',
  'Transparent pricing with no hidden fees. Cancel anytime.',
  'The most affordable AI humanizer with a 99.9% bypass rate.',
  'Free plan available. Paid plans start at just a few dollars per month.',
  'Student discounts, bulk pricing, and enterprise options available.',
  'Get unlimited AI humanization without breaking the bank.',
  'Compare plans and find the perfect fit for your needs.',
  'No contracts, no commitments. Pay only for what you use.',
];

const FAQ_SETS = [
  [
    { q: 'Is HumanifyLab free to use?', a: 'Yes, HumanifyLab offers a free plan with no credit card required. You can humanize AI text and bypass detection tools without paying anything. The free plan includes a daily word limit, which is enough for most students and casual users.' },
    { q: 'What does the paid plan include?', a: 'Paid plans unlock unlimited words per month, priority processing, bulk humanization, API access, and advanced tone controls. You also get access to all detector bypass modes including Turnitin, GPTZero, Originality.AI, and more.' },
    { q: 'Is there a student discount?', a: 'Yes, HumanifyLab offers special student pricing. Students can get up to 40% off paid plans with a valid .edu email address. Contact support to apply your student discount.' },
    { q: 'Can I cancel my subscription anytime?', a: 'Absolutely. HumanifyLab subscriptions are month-to-month with no long-term contracts. You can cancel anytime from your account dashboard and you will not be charged again.' },
    { q: 'Is there a money-back guarantee?', a: 'Yes, HumanifyLab offers a 7-day money-back guarantee on all paid plans. If you are not satisfied, contact support within 7 days of purchase for a full refund.' },
    { q: 'What is the annual plan discount?', a: 'Choosing an annual plan saves you up to 40% compared to monthly billing. You pay for 12 months upfront and get 2 months free effectively.' },
  ],
  [
    { q: 'How much does HumanifyLab cost per month?', a: 'HumanifyLab has a free plan at $0/month. Paid plans start at a low monthly rate for individuals, with higher tiers for professionals and enterprises. Check the pricing page for current rates.' },
    { q: 'Does the free plan have a word limit?', a: 'The free plan includes a generous daily word limit. For users who need more, paid plans offer significantly higher or unlimited word counts per month.' },
    { q: 'Is there bulk pricing for agencies?', a: 'Yes, HumanifyLab offers bulk and enterprise pricing for agencies and teams that need to humanize large volumes of content. Contact the sales team for a custom quote.' },
    { q: 'Can I use HumanifyLab without signing up?', a: 'Yes, you can try HumanifyLab without creating an account. Simply visit the homepage and start humanizing text immediately. Sign up to save your history and access more features.' },
    { q: 'What payment methods are accepted?', a: 'HumanifyLab accepts all major credit cards, debit cards, and PayPal. Enterprise customers can also pay by invoice.' },
    { q: 'Is there a lifetime deal available?', a: 'HumanifyLab occasionally offers lifetime deals during special promotions. Check the pricing page or subscribe to the newsletter to be notified of upcoming deals.' },
  ],
  [
    { q: 'What is the difference between free and paid plans?', a: 'The free plan gives you access to core AI humanization features with a daily word limit. Paid plans remove word limits, add bulk processing, API access, priority support, and advanced bypass modes for all major AI detectors.' },
    { q: 'Does HumanifyLab offer a free trial of paid features?', a: 'Yes, new users can access a free trial of premium features for a limited period. No credit card is required to start the trial.' },
    { q: 'How does enterprise pricing work?', a: 'Enterprise pricing is custom-quoted based on your team size, monthly volume, and specific requirements. Enterprise plans include dedicated support, SLA guarantees, custom API limits, and white-label options.' },
    { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change your plan at any time. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period.' },
    { q: 'Are there any hidden fees?', a: 'No. HumanifyLab pricing is completely transparent. The price you see is the price you pay. No setup fees, no overage charges on standard plans.' },
    { q: 'Is there a referral or affiliate program?', a: 'Yes, HumanifyLab has an affiliate program where you can earn commissions by referring new users. Visit the affiliate page to sign up and get your referral link.' },
  ],
  [
    { q: 'What is the cheapest AI humanizer available?', a: 'HumanifyLab offers one of the most affordable AI humanizers on the market, with a free plan and paid plans starting at a very low monthly rate. It is significantly cheaper than most competitors while offering a higher bypass rate.' },
    { q: 'Is HumanifyLab worth paying for?', a: 'For students, writers, and professionals who regularly need to bypass AI detection, the paid plan pays for itself quickly. The 99.9% bypass rate, unlimited words, and bulk processing make it extremely cost-effective.' },
    { q: 'Can I share my account with others?', a: 'Individual plans are for single users. If you need multiple users, consider the team or enterprise plan which allows multiple seats under one billing account.' },
    { q: 'What happens if I exceed my word limit?', a: 'On the free plan, you will need to wait until the next day or upgrade to a paid plan. On paid plans with word limits, you can purchase additional word packs or upgrade to a higher tier.' },
    { q: 'Does HumanifyLab offer educational institution pricing?', a: 'Yes, HumanifyLab works with educational institutions to provide bulk licensing for students and faculty. Contact the sales team for institutional pricing.' },
    { q: 'How does pay-per-use pricing work?', a: 'Some plans offer pay-per-use pricing where you purchase word credits that never expire. This is ideal for users who need AI humanization occasionally rather than on a regular basis.' },
  ],
  [
    { q: 'Is there a promo code for HumanifyLab?', a: 'HumanifyLab occasionally releases promo codes and discount coupons. Check the pricing page, subscribe to the newsletter, or follow on social media to get the latest deals.' },
    { q: 'What is included in the professional plan?', a: 'The professional plan includes unlimited words, all bypass modes, bulk processing, API access, priority support, advanced analytics, and team collaboration features.' },
    { q: 'Can I use HumanifyLab for commercial purposes?', a: 'Yes, all paid plans allow commercial use. You can use HumanifyLab to humanize content for clients, agencies, and businesses without any additional licensing fees.' },
    { q: 'How does the API pricing work?', a: 'API access is available on paid plans. Pricing is based on the number of API calls or words processed per month. Enterprise customers get custom API pricing with higher rate limits.' },
    { q: 'Is there a free plan for non-profits?', a: 'HumanifyLab offers special pricing for registered non-profit organizations. Contact support with proof of non-profit status to apply for discounted or free access.' },
    { q: 'What currencies does HumanifyLab accept?', a: 'HumanifyLab accepts payments in USD, EUR, GBP, and other major currencies. Prices are displayed in your local currency at checkout.' },
  ],
  [
    { q: 'How does HumanifyLab compare to competitors on price?', a: 'HumanifyLab is one of the most competitively priced AI humanizers available. It offers a free plan that most competitors charge for, and paid plans that are significantly cheaper than alternatives like Undetectable.AI or BypassGPT.' },
    { q: 'What is the word limit on the free plan?', a: 'The free plan includes a daily word limit that resets every 24 hours. This is sufficient for occasional use. For heavy users, paid plans offer much higher or unlimited word counts.' },
    { q: 'Can I get a refund if the tool does not work?', a: 'Yes, HumanifyLab offers a satisfaction guarantee. If the tool fails to bypass AI detection on a supported detector, contact support for a refund or credit.' },
    { q: 'Is there a discount for paying annually?', a: 'Yes, annual plans are discounted compared to monthly billing. You save up to 40% by paying for a full year upfront.' },
    { q: 'Does HumanifyLab have a free Chrome extension?', a: 'HumanifyLab offers a browser extension that integrates with your workflow. The extension is free to install and uses your existing plan credits.' },
    { q: 'What is the best plan for a student?', a: 'For most students, the free plan or the basic paid plan is sufficient. Students who write frequently or need bulk processing should consider the student-discounted professional plan.' },
  ],
];

export function generatePricingContent(entry: KeywordEntryV3): PricingPageData {
  const { keyword, seed } = entry;
  const combo = buildPageStrings(keyword, seed, '', 'pricing');
  const faqs = buildFaqs(keyword, seed, '', 'pricing');
  const stats = buildStats(keyword, seed);

  const fi = uniqueIdx(seed, keyword, FAQ_SETS.length, 4);

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats,
    plansTitle: ['Choose Your Plan', 'Pick the Right Plan', 'Plans & Pricing', 'Find Your Plan'][uniqueIdx(seed, keyword, 4, 20)]!,
    plans: [
      {
        name: 'Free',
        price: '$0',
        period: '/month',
        description: 'Perfect for students and casual users',
        features: ['500 words/day', 'Core AI humanization', 'Bypass GPTZero & ZeroGPT', 'No credit card required', 'Web app access'],
        cta: 'Start Free',
        highlighted: false,
      },
      {
        name: 'Pro',
        price: '$9.99',
        period: '/month',
        description: 'For writers and professionals',
        features: ['Unlimited words', 'All detector bypass modes', 'Bulk processing', 'Priority processing', 'API access', 'Email support'],
        cta: 'Get Pro',
        highlighted: true,
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For teams and agencies',
        features: ['Custom word limits', 'Team dashboard', 'White-label option', 'Dedicated support', 'SLA guarantee', 'Custom API limits'],
        cta: 'Contact Sales',
        highlighted: false,
      },
    ],
    valueTitle: ['Why HumanifyLab Is Worth Every Penny', 'The Value of HumanifyLab', 'What You Get with HumanifyLab', 'Why Choose HumanifyLab'][uniqueIdx(seed, keyword, 4, 21)]!,
    valueProps: [
      { icon: '🎯', title: '99.9% Bypass Rate', description: 'The highest bypass rate in the industry. Your content passes Turnitin, GPTZero, Originality.AI, and more — guaranteed.' },
      { icon: '⚡', title: 'Results in Seconds', description: 'No waiting. Humanize thousands of words in under 10 seconds. Faster than any competitor.' },
      { icon: '🔒', title: 'Zero Data Retention', description: 'Your content is never stored or used for training. Complete privacy guaranteed.' },
      { icon: '💰', title: 'Best Value', description: 'Free plan available. Paid plans are 50-70% cheaper than competitors with a higher bypass rate.' },
    ],
    comparisonTitle: ['HumanifyLab vs Competitors', 'How We Compare', 'Why HumanifyLab Wins', 'The Comparison'][uniqueIdx(seed, keyword, 4, 22)]!,
    comparisonRows: [
      { feature: 'Free Plan', humanifylab: '✅ Yes', others: '❌ No or very limited' },
      { feature: 'Bypass Rate', humanifylab: '✅ 99.9%', others: '⚠️ 85-95%' },
      { feature: 'Processing Speed', humanifylab: '✅ <10 seconds', others: '⚠️ 30-60 seconds' },
      { feature: 'Data Privacy', humanifylab: '✅ Zero retention', others: '⚠️ May store data' },
      { feature: 'Languages', humanifylab: '✅ 50+', others: '⚠️ 10-20' },
      { feature: 'API Access', humanifylab: '✅ All paid plans', others: '⚠️ Enterprise only' },
    ],
    faqTitle: combo.faqTitle,
    faqs,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
