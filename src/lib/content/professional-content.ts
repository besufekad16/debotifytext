import type { KeywordEntryV2 } from '~/lib/pseo-data-v2';

export interface ProfessionalContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  stats: { value: string; label: string }[];
  benefits: string[];
  faqs: { q: string; a: string }[];
  cta: string;
}

const STATS_POOL = [
  { value: '99.9%', label: 'AI detection bypass rate' },
  { value: '< 5s', label: 'Average processing time' },
  { value: '50+', label: 'Languages supported' },
  { value: '10M+', label: 'Words humanized monthly' },
  { value: '500K+', label: 'Active users' },
  { value: '4.9/5', label: 'Average user rating' },
  { value: '0%', label: 'Data retention' },
  { value: '24/7', label: 'Availability' },
];

const BENEFITS_POOL = [
  'Scale content production without sacrificing quality or authenticity',
  'Pass Google\'s Helpful Content system — humanized content ranks better',
  'Reduce content production costs by up to 80% while maintaining quality',
  'Produce 10x more content in the same time with AI + humanization',
  'Eliminate AI detection flags that hurt SEO rankings and credibility',
  'Maintain consistent brand voice across all AI-assisted content',
  'Support 50+ languages for global content strategies',
  'API access for seamless integration into your content workflow',
  'Bulk processing for high-volume content teams',
  'No watermark — your content looks 100% original',
];

const FAQ_POOL: { q: string; a: string }[] = [
  { q: 'Will humanized content rank on Google?', a: 'Yes. HumanifyLab produces content that passes Google\'s Helpful Content system. Humanized content reads naturally and avoids the AI writing patterns that Google penalizes.' },
  { q: 'Can I use HumanifyLab for {entity}?', a: 'Absolutely. HumanifyLab is used by thousands of professionals for {entity}. The tool preserves your brand voice, key messages, and calls to action while making the content sound authentically human.' },
  { q: 'Does HumanifyLab have an API for bulk processing?', a: 'Yes. HumanifyLab offers API access on the Ultra plan, allowing you to integrate humanization directly into your content workflow and process thousands of pieces at scale.' },
  { q: 'How does HumanifyLab handle brand voice?', a: 'HumanifyLab preserves your original tone, style, and messaging while humanizing the text. You can also use presets (Professional, Casual, Formal) to match your brand voice.' },
  { q: 'Is HumanifyLab suitable for {entity} at scale?', a: 'Yes. HumanifyLab supports bulk processing and API integration, making it ideal for agencies and content teams producing high volumes of {entity} content.' },
];

export function generateProfessionalContent(entry: KeywordEntryV2): ProfessionalContentData {
  const { keyword, entity, seed } = entry;
  const useCase = entity === 'Professional' ? 'professional content' : entity.toLowerCase();
  const year = 2026;

  const titleVariants = [
    `Humanize AI for ${entity} — Scale Content Without Detection | HumanifyLab`,
    `${entity} AI Humanizer — Pass Google & AI Detectors | HumanifyLab`,
    `AI Content for ${entity} That Ranks — HumanifyLab`,
    `Humanize AI ${entity} Content — 99.9% Bypass Rate | HumanifyLab`,
    `${entity} Content That Passes Every AI Detector | HumanifyLab`,
    `Scale ${entity} Content With AI — Undetectable Results | HumanifyLab`,
  ];

  const descVariants = [
    `Use HumanifyLab to humanize AI-generated ${useCase}. Pass AI detection, rank on Google, and scale your content production. 99.9% bypass rate. Free to try.`,
    `AI-generated ${useCase} that passes Google's Helpful Content system and all AI detectors. HumanifyLab processes text in under 5 seconds. No sign-up required.`,
    `Scale your ${useCase} production with AI + HumanifyLab. 99.9% bypass rate, 50+ languages, API access. Used by ${1000 + seed * 3} content teams worldwide.`,
    `Transform AI-generated ${useCase} into content that ranks and converts. HumanifyLab eliminates AI detection flags that hurt SEO and credibility. Free plan available.`,
    `The professional AI humanizer for ${useCase}. Passes Turnitin, GPTZero, Originality.AI, and Google's algorithms. Bulk processing and API available.`,
    `${entity} teams use HumanifyLab to produce ${useCase} at scale without AI detection issues. 99.9% bypass rate, no watermark, instant results.`,
  ];

  const h1Variants = [
    `Humanize AI for ${entity}: Scale Content That Passes Every Detector`,
    `${entity} AI Humanizer — Rank Higher, Convert Better`,
    `AI ${entity} Content That Passes Google & Every Detector`,
    `Scale Your ${entity} Content With HumanifyLab`,
    `The Professional AI Humanizer for ${entity}`,
    `${entity} Content That's Undetectable — HumanifyLab`,
  ];

  const introVariants = [
    `AI-generated ${useCase} is everywhere — but AI detection tools and Google's algorithms are getting better at spotting it. HumanifyLab transforms AI content into natural, human-sounding ${useCase} that passes every detector and ranks on Google. Used by ${1000 + seed * 3} content teams, agencies, and marketers worldwide.`,
    `In ${year}, AI detection is a real threat to ${useCase} performance. Google's Helpful Content system, Originality.AI, and GPTZero can all flag AI-generated content — hurting your rankings and credibility. HumanifyLab solves this in under 5 seconds.`,
    `Content teams producing ${useCase} at scale face a growing challenge: AI detection. HumanifyLab is the only tool that consistently achieves a 99.9% bypass rate while preserving your brand voice, key messages, and calls to action.`,
    `The ROI of AI-assisted ${useCase} production is clear — but only if the content passes detection. HumanifyLab ensures your ${useCase} reads as genuinely human-written, passing every detector while maintaining the quality your audience expects.`,
    `${entity} professionals use HumanifyLab to produce ${useCase} that ranks, converts, and passes every AI detection check. With support for 50+ languages and bulk processing, it's the tool of choice for serious content teams in ${year}.`,
    `Scaling ${useCase} production with AI is smart — but getting flagged by detectors is costly. HumanifyLab has helped ${500 + seed * 5} ${entity} teams produce undetectable, high-quality content at scale without compromising on authenticity.`,
  ];

  const idx = seed % titleVariants.length;

  return {
    metaTitle: titleVariants[idx]!,
    metaDescription: descVariants[idx]!,
    h1: h1Variants[idx]!,
    intro: introVariants[idx]!,
    stats: STATS_POOL.slice(seed % 4, (seed % 4) + 4),
    benefits: BENEFITS_POOL.slice(seed % 3, (seed % 3) + 6),
    faqs: FAQ_POOL.slice(seed % 2, (seed % 2) + 4).map(f => ({
      q: f.q.replace('{entity}', entity),
      a: f.a.replace('{entity}', useCase),
    })),
    cta: `Start humanizing your ${useCase} — free plan, no sign-up required`,
  };
}
