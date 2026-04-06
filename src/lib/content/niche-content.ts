import type { KeywordEntryV2 } from '~/lib/pseo-data-v2';

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
  const { entity, seed } = entry;
  const ctx = NICHE_CONTEXT[entity] ?? NICHE_CONTEXT['Niche']!;
  const nicheLabel = entity === 'Niche' ? 'specialized content' : entity.toLowerCase();
  const year = 2026;

  const titleVariants = [
    `Humanize AI Content for ${entity} ${ctx.icon} — Natural, Undetectable | HumanifyLab`,
    `${entity} AI Humanizer ${ctx.icon} — Pass Every Detector | HumanifyLab`,
    `AI ${entity} Content That Sounds Human ${ctx.icon} | HumanifyLab`,
    `Undetectable AI Content for ${entity} ${ctx.icon} — Free | HumanifyLab`,
    `${entity} ${ctx.icon} — Humanize AI Text Instantly | HumanifyLab`,
    `Best AI Humanizer for ${entity} ${ctx.icon} in ${year} | HumanifyLab`,
  ];

  const descVariants = [
    `HumanifyLab helps ${ctx.audience} create ${ctx.benefit}. 99.9% AI detection bypass rate. Free to try — no sign-up required.`,
    `Transform AI-generated ${nicheLabel} content into natural, human-sounding writing. HumanifyLab achieves 99.9% bypass rate. Instant results, no sign-up.`,
    `The best AI humanizer for ${entity} content in ${year}. HumanifyLab processes text in under 5 seconds and produces ${ctx.benefit}. Free plan available.`,
    `${entity} creators use HumanifyLab to humanize AI content and pass every detector. 99.9% bypass rate, no watermark, 50+ languages. Try free.`,
    `Humanize AI ${nicheLabel} content with HumanifyLab. Passes Turnitin, GPTZero, Originality.AI, and platform-specific detectors. Free to try.`,
    `${ctx.audience.charAt(0).toUpperCase() + ctx.audience.slice(1)} trust HumanifyLab for ${nicheLabel} content that sounds authentically human. 99.9% bypass rate. No sign-up needed.`,
  ];

  const h1Variants = [
    `Humanize AI Content for ${entity} ${ctx.icon} — Sound Authentically Human`,
    `${entity} AI Humanizer ${ctx.icon} — Undetectable Results`,
    `AI ${entity} Content That Passes Every Detector ${ctx.icon}`,
    `${entity} ${ctx.icon} — The Best AI Humanizer for Your Niche`,
    `Undetectable AI Content for ${entity} ${ctx.icon}`,
    `${entity} ${ctx.icon} — Humanize AI Text in Under 5 Seconds`,
  ];

  const introVariants = [
    `${ctx.audience.charAt(0).toUpperCase() + ctx.audience.slice(1)} rely on AI to speed up content creation — but AI-generated ${nicheLabel} content is easy to spot. HumanifyLab transforms AI-generated ${nicheLabel} content into ${ctx.benefit}, passing every AI detection tool while preserving your original message. Over ${500 + seed * 7} ${ctx.audience} use HumanifyLab every month.`,
    `AI detection is now a real concern for ${ctx.audience}. Whether it's platform algorithms, academic detectors, or professional review processes, AI-generated ${nicheLabel} content gets flagged. HumanifyLab solves this in under 5 seconds with a 99.9% bypass rate.`,
    `The challenge for ${ctx.audience} isn't creating ${nicheLabel} content with AI — it's making it sound human. HumanifyLab is specifically designed to eliminate the AI writing patterns that detectors and audiences notice, while preserving your original message and tone.`,
    `${entity} content creation has been transformed by AI — but so has AI detection. HumanifyLab helps ${ctx.audience} stay ahead by producing ${nicheLabel} content that passes every detector and resonates with real audiences. Tested on ${200 + seed * 6} ${nicheLabel} pieces.`,
    `In ${year}, ${ctx.audience} need AI content that sounds genuinely human. HumanifyLab achieves this with a 99.9% bypass rate, processing ${nicheLabel} content in under 5 seconds while preserving your voice, style, and key messages.`,
    `${ctx.audience.charAt(0).toUpperCase() + ctx.audience.slice(1)} who use AI for ${nicheLabel} content face a growing challenge: detection. HumanifyLab has helped ${300 + seed * 9} ${ctx.audience} produce undetectable ${nicheLabel} content that performs better and passes every check.`,
  ];

  const idx = seed % titleVariants.length;

  return {
    metaTitle: titleVariants[idx]!,
    metaDescription: descVariants[idx]!,
    h1: h1Variants[idx]!,
    intro: introVariants[idx]!,
    useCasePoints: USE_CASE_POOL[entity] ?? USE_CASE_POOL.default!,
    faqs: FAQ_POOL.slice(seed % 2, (seed % 2) + 4).map(f => ({
      q: f.q.replace('{niche}', nicheLabel).replace('{audience}', ctx.audience),
      a: f.a.replace(/{niche}/g, nicheLabel).replace('{audience}', ctx.audience),
    })),
    cta: `Humanize your ${nicheLabel} content now — free, instant, no sign-up`,
  };
}
