import type { KeywordEntryV5 } from '~/lib/pseo-data-v5';
import type { V4PageData } from '~/components/templates/V4Template';
import { buildPageStrings, buildFaqs, buildStats, buildSteps, buildDeepGuide } from '~/lib/content/content-combinator';

export function generateLengthContent(entry: KeywordEntryV5): V4PageData {
  const { keyword, seed } = entry;
  const combo = buildPageStrings(keyword, seed, entry.entity, 'length');
  const deep = buildDeepGuide(keyword, seed);

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats: buildStats(keyword, seed),
    steps: buildSteps(keyword, seed, 'length'),
    guideIntro: deep.guideIntro,
    guideSections: deep.guideSections,
    faqs: buildFaqs(keyword, seed, entry.entity, 'length'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
