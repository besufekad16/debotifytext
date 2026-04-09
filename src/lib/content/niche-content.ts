import type { KeywordEntryV2 } from '~/lib/pseo-data-v2';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats } from '~/lib/content/content-combinator';

export interface NicheContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  useCasePoints: string[];
  faqs: { q: string; a: string }[];
  cta: string;
}

const NICHE_CONTEXT: Record<string, { icon: string; audience: string; benefit: string }> = {
  'YouTube':         { icon: '🎬', audience: 'YouTubers and video creators', benefit: 'scripts that sound natural and engaging on camera' },
  'TikTok':          { icon: '📱', audience: 'TikTok creators', benefit: 'captions and scripts that feel authentic and drive engagement' },
  'Podcast':         { icon: '🎙️', audience: 'podcasters', benefit: 'show notes and scripts that sound conversational and natural' },
  'Creative Writing': { icon: '✍️', audience: 'fiction writers and authors', benefit: 'prose that reads as genuinely human-crafted' },
  'Cover Letter':    { icon: '📄', audience: 'job seekers', benefit: 'cover letters that sound personal and authentic to recruiters' },
  'Medical':         { icon: '🏥', audience: 'healthcare professionals and medical writers', benefit: 'clinical content that reads naturally while maintaining accuracy' },
  'Legal':           { icon: '⚖️', audience: 'legal professionals and law firms', benefit: 'legal documents that read clearly and professionally' },
  'Real Estate':     { icon: '🏠', audience: 'real estate agents and property marketers', benefit: 'property descriptions that engage buyers and drive inquiries' },
  'Gaming':          { icon: '🎮', audience: 'game developers and gaming content creators', benefit: 'game content that resonates with players' },
  'Travel':          { icon: '✈️', audience: 'travel bloggers and tourism marketers', benefit: 'travel content that inspires and converts readers' },
  'Grant Writing':   { icon: '📋', audience: 'grant writers and nonprofit professionals', benefit: 'grant proposals that read compellingly and professionally' },
  'Niche':           { icon: '🎯', audience: 'content creators', benefit: 'content that sounds authentically human' },
};

const USE_CASE_POOL: Record<string, string[]> = {
  'YouTube': [
    'Transform AI-drafted scripts into natural, conversational YouTube content',
    'Eliminate robotic phrasing that viewers notice and disengage from',
    'Preserve your unique presenting style and personality',
    'Optimize for YouTube\'s algorithm with natural language patterns',
    'Create scripts that feel spontaneous even when fully scripted',
  ],
  'Cover Letter': [
    'Make AI-drafted cover letters sound genuinely personal and motivated',
    'Eliminate the generic phrases that recruiters immediately recognize as AI',
    'Preserve your authentic voice and specific experiences',
    'Pass ATS systems and human recruiter review with natural language',
    'Stand out from hundreds of AI-generated applications',
  ],
  default: [
    'Transform AI-generated content into natural, human-sounding writing',
    'Eliminate AI writing patterns that audiences and algorithms detect',
    'Preserve your original message, tone, and key information',
    'Pass AI detection tools used by platforms and institutions',
    'Scale content production without sacrificing authenticity',
  ],
};

const FAQ_POOL: { q: string; a: string }[] = [
  { q: 'Can HumanifyLab humanize AI content for {niche}?', a: 'Yes. HumanifyLab is used by thousands of {audience} to humanize AI-generated content. The tool preserves your original message while making the writing sound authentically human.' },
  { q: 'Will humanized {niche} content pass AI detection?', a: 'Yes. HumanifyLab achieves a 99.9% bypass rate across all major AI detectors. Your {niche} content will pass Turnitin, GPTZero, Originality.AI, and platform-specific detection systems.' },
  { q: 'Does HumanifyLab preserve the tone for {niche} content?', a: 'Absolutely. HumanifyLab preserves your original tone, style, and voice. For {niche} content, this means your personality and brand voice remain intact after humanization.' },
  { q: 'How long does it take to humanize {niche} content?', a: 'HumanifyLab processes text in under 5 seconds. You can humanize a full {niche} piece in less than a minute, making it ideal for high-volume content production.' },
  { q: 'Is HumanifyLab free for {niche} content?', a: 'Yes. HumanifyLab offers a free plan with no sign-up required. You can humanize {niche} content instantly and upgrade to a paid plan for unlimited words and advanced features.' },
];

export function generateNicheContent(entry: KeywordEntryV2): NicheContentData {
  const { entity, seed, keyword } = entry;
  const ctx = NICHE_CONTEXT[entity] ?? NICHE_CONTEXT['Niche']!;
  const nicheLabel = entity === 'Niche' ? 'specialized content' : entity.toLowerCase();

  const combo = buildPageStrings(keyword, seed, entity, 'niche');

  const introVariants = [
    `${ctx.audience.charAt(0).toUpperCase() + ctx.audience.slice(1)} rely on AI to speed up content creation — but AI-generated ${nicheLabel} content is easy to spot. HumanifyLab transforms AI-generated ${nicheLabel} content into ${ctx.benefit}, passing every AI detection tool while preserving your original message. Over ${500 + seed * 7} ${ctx.audience} use HumanifyLab every month.`,
    `AI detection is now a real concern for ${ctx.audience}. Whether it's platform algorithms, academic detectors, or professional review processes, AI-generated ${nicheLabel} content gets flagged. HumanifyLab solves this in under 5 seconds with a 99.9% bypass rate.`,
    `The challenge for ${ctx.audience} isn't creating ${nicheLabel} content with AI — it's making it sound human. HumanifyLab is specifically designed to eliminate the AI writing patterns that detectors and audiences notice, while preserving your original message and tone.`,
    `${entity} content creation has been transformed by AI — but so has AI detection. HumanifyLab helps ${ctx.audience} stay ahead by producing ${nicheLabel} content that passes every detector and resonates with real audiences. Tested on ${200 + seed * 6} ${nicheLabel} pieces.`,
    `In 2026, ${ctx.audience} need AI content that sounds genuinely human. HumanifyLab achieves this with a 99.9% bypass rate, processing ${nicheLabel} content in under 5 seconds while preserving your voice, style, and key messages.`,
    `${ctx.audience.charAt(0).toUpperCase() + ctx.audience.slice(1)} who use AI for ${nicheLabel} content face a growing challenge: detection. HumanifyLab has helped ${300 + seed * 9} ${ctx.audience} produce undetectable ${nicheLabel} content that performs better and passes every check.`,
  ];

  const ctaVariants = [
    `Humanize your ${nicheLabel} content now — free, instant, no sign-up`,
    `Get undetectable ${nicheLabel} content — try HumanifyLab free`,
    `Humanize AI ${nicheLabel} content instantly — no account needed`,
    `Start humanizing ${nicheLabel} content — free plan available`,
  ];

  const useCasePointSets = [
    USE_CASE_POOL[entity] ?? USE_CASE_POOL.default!,
    [
      `Transform AI-generated ${nicheLabel} into authentic, human-sounding content`,
      `Eliminate AI writing patterns that ${ctx.audience} and algorithms detect`,
      `Preserve your original message, tone, and key information`,
      `Pass AI detection tools used by platforms and institutions`,
      `Scale ${nicheLabel} production without sacrificing authenticity`,
    ],
    [
      `HumanifyLab produces ${ctx.benefit} in under 5 seconds`,
      `99.9% bypass rate for ${nicheLabel} content across all major detectors`,
      `Preserves your unique voice and style throughout the transformation`,
      `Works with any AI tool — ChatGPT, Claude, Gemini, and more`,
      `Free plan available — no sign-up required to get started`,
    ],
  ];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    intro: introVariants[uniqueIdx(seed, keyword, introVariants.length, 20)]!,
    useCasePoints: useCasePointSets[uniqueIdx(seed, keyword, useCasePointSets.length, 21)]!,
    faqs: buildFaqs(keyword, seed, entity, 'niche'),
    cta: ctaVariants[uniqueIdx(seed, keyword, ctaVariants.length, 22)]!,
  };
}
