import type { KeywordEntryV5 } from '~/lib/pseo-data-v5';
import type { V4PageData } from '~/components/templates/V4Template';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildFeaturePoints, buildStats } from '~/lib/content/content-combinator';

// Short, direct answers for featured-snippet capture — question pages lead
// with a concise verdict before the longer explanation, since Google tends
// to pull the first clear sentence-length answer for the snippet box.
const ANSWERS: ((topic: string) => string)[] = [
  (t) => `Yes — when used correctly, ${t} is safe, effective, and does not distort your original meaning.`,
  (t) => `Generally yes, but results vary by tool. HumanifyLab is verified weekly at a 99.9% bypass rate for ${t}-related queries.`,
  (t) => `It depends on the specific detector and tool — but HumanifyLab's approach to ${t} is tested against all major AI detectors.`,
  (t) => `Most reputable tools handle ${t} well, though quality varies significantly between providers.`,
  (t) => `Yes, with the right tool. HumanifyLab targets the exact statistical signals detectors measure for ${t}.`,
];

export function generateQuestionContent(entry: KeywordEntryV5): V4PageData {
  const { keyword, entity, seed } = entry;
  const combo = buildPageStrings(keyword, seed, entity, 'question');
  const ai = uniqueIdx(seed, keyword, ANSWERS.length, 20);

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    answer: ANSWERS[ai]!(entity),
    stats: buildStats(keyword, seed),
    features: buildFeaturePoints(keyword, seed, 'question'),
    faqs: buildFaqs(keyword, seed, entity, 'question'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
