import type { KeywordEntryV5 } from '~/lib/pseo-data-v5';
import type { V4PageData } from '~/components/templates/V4Template';
import { buildPageStrings, buildFaqs, buildFeaturePoints, buildStats, buildDeepGuide, buildSteps } from '~/lib/content/content-combinator';

export function generateCityContent(entry: KeywordEntryV5): V4PageData {
  const { keyword, seed } = entry;
  const combo = buildPageStrings(keyword, seed, entry.entity, 'city');
  const deep = buildDeepGuide(keyword, seed);

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    stats: buildStats(keyword, seed),
    features: buildFeaturePoints(keyword, seed, 'city'),
    steps: buildSteps(keyword, seed, 'city'),
    guideIntro: deep.guideIntro,
    guideSections: deep.guideSections,
    faqs: buildFaqs(keyword, seed, entry.entity, 'city'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
