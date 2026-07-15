import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getKeywordBySlug } from "~/lib/pseo-data";
import { getAllV2Slugs, getV2KeywordBySlug } from "~/lib/pseo-data-v2";
import { getAllV3Slugs, getV3KeywordBySlug } from "~/lib/pseo-data-v3";
import { getAllV4Slugs, getV4KeywordBySlug } from "~/lib/pseo-data-v4";
import { getAllGeoSlugs, getGeoKeywordBySlug } from "~/lib/pseo-data-geo";
import { generateGeoContent } from "~/lib/content/geo-content";
import GeoTemplate from "~/components/templates/GeoTemplate";
import { generateBypassContent } from "~/lib/content/bypass-content";
import { generateHumanizerContent } from "~/lib/content/humanizer-content";
import { generateHowToContent } from "~/lib/content/howto-content";
import { generateUseCaseContent } from "~/lib/content/usecase-content";
import { generateCompetitorContent } from "~/lib/content/competitor-content";
import { generateAcademicContent } from "~/lib/content/academic-content";
import { generateProfessionalContent } from "~/lib/content/professional-content";
import { generateDetectorContent } from "~/lib/content/detector-content";
import { generateLanguageContent } from "~/lib/content/language-content";
import { generateNicheContent } from "~/lib/content/niche-content";
import { generatePricingContent } from "~/lib/content/pricing-content";
import { generateIndustryContent } from "~/lib/content/industry-content";
import { generateFormatContent } from "~/lib/content/format-content";
import { generateSpeedContent } from "~/lib/content/speed-content";
import { generateQualityContent } from "~/lib/content/quality-content";
import { generateToolContent } from "~/lib/content/tool-content";
import { generateProblemContent } from "~/lib/content/problem-content";
import { generateWorkflowContent } from "~/lib/content/workflow-content";
import { generateScoreContent } from "~/lib/content/score-content";
import { generateRegionContent } from "~/lib/content/region-content";
// V4 content generators
import { generateComparisonContent } from "~/lib/content/comparison-content";
import { generateAlternativeContent } from "~/lib/content/alternative-content";
import { generateReviewContent } from "~/lib/content/review-content";
import { generateFreeContent } from "~/lib/content/free-content";
import { generateDetectionContent } from "~/lib/content/detection-content";
import { generateWritingContent } from "~/lib/content/writing-content";
import { generateEducationContent } from "~/lib/content/education-content";
import { generatePlatformV4Content } from "~/lib/content/platform-content-v4";
import { generateOutputContent } from "~/lib/content/output-content";
import { generateBulkContent } from "~/lib/content/bulk-content";
import BypassTemplate from "~/components/templates/BypassTemplate";
import HumanizerTemplate from "~/components/templates/HumanizerTemplate";
import HowToTemplate from "~/components/templates/HowToTemplate";
import UseCaseTemplate from "~/components/templates/UseCaseTemplate";
import CompetitorTemplate from "~/components/templates/CompetitorTemplate";
import AcademicTemplate from "~/components/templates/AcademicTemplate";
import ProfessionalTemplate from "~/components/templates/ProfessionalTemplate";
import DetectorTemplate from "~/components/templates/DetectorTemplate";
import LanguageTemplate from "~/components/templates/LanguageTemplate";
import NicheTemplate from "~/components/templates/NicheTemplate";
import PricingTemplate from "~/components/templates/PricingTemplate";
import IndustryTemplate from "~/components/templates/IndustryTemplate";
import FormatTemplate from "~/components/templates/FormatTemplate";
import SpeedTemplate from "~/components/templates/SpeedTemplate";
import QualityTemplate from "~/components/templates/QualityTemplate";
import ToolTemplate from "~/components/templates/ToolTemplate";
import ProblemTemplate from "~/components/templates/ProblemTemplate";
import WorkflowTemplate from "~/components/templates/WorkflowTemplate";
import ScoreTemplate from "~/components/templates/ScoreTemplate";
import RegionTemplate from "~/components/templates/RegionTemplate";
import V4Template from "~/components/templates/V4Template";
import SEOPageWrapper from "~/components/templates/SEOPageWrapper";

interface PageProps {
  params: Promise<{ keyword: string }>;
}

// dynamicParams = true: unknown slugs are rendered on-demand (ISR)
// Pages in generateStaticParams are pre-built; others are built on first request
export const dynamicParams = true;
// revalidate = 86400: pages are cached for 24 hours, then regenerated
export const revalidate = 86400;

const BASE_URL = "https://www.humanifylab.com";

// Deterministic publish dates spread across the trailing ~10 months from
// whenever the page is (re)generated. Anchoring the window to Date.now()
// instead of a hardcoded past window means dates never go stale as ISR
// revalidates or the site gets rebuilt — they always look current.
// Seed is normalized with modulo so large v3/v4 seeds stay inside the window.
function getPublishDate(seed: number): string {
  const end = Date.now();
  const start = end - 300 * 24 * 60 * 60 * 1000; // ~10 months back
  const normalized = (seed % 500) / 500;
  const ts = start + normalized * (end - start);
  return new Date(ts).toISOString().split("T")[0]!;
}

// "Updated" is not shown in the UI (by design), only in the Article/WebPage
// JSON-LD — so it always reflects the current date whenever the page is
// (re)generated, per product decision.
function getModifiedDate(_seed: number, _publishDate: string): string {
  return new Date().toISOString().split("T")[0]!;
}

// Per-page keyword set: core brand + cluster-specific + keyword-specific
// CRITICAL: keyword must appear first and multiple times for Google to understand page topic
function buildKeywords(keyword: string, cluster: string, entity: string): string[] {
  const core = ["humanifylab", "ai humanizer", "bypass ai detection", "undetectable ai", "humanize ai text"];
  const clusterKws: Record<string, string[]> = {
    bypass: ["bypass turnitin", "bypass gptzero", "bypass originality ai", "ai detector bypass", "undetectable ai writing", "beat ai detectors"],
    humanizer: ["free ai humanizer", "best ai humanizer", "ai text humanizer", "chatgpt humanizer", "humanize chatgpt"],
    howto: ["how to humanize ai text", "how to bypass ai detection", "ai humanizer guide", "ai detection bypass tutorial"],
    usecase: ["ai humanizer for students", "essay humanizer", "academic ai humanizer", "ai humanizer for business"],
    competitor: ["ai humanizer alternative", "best ai humanizer", "ai humanizer comparison", "undetectable ai alternative"],
    academic: ["humanize ai essay", "bypass turnitin academic", "ai humanizer for students", "academic ai writing"],
    professional: ["humanize ai content", "ai content humanizer", "professional ai humanizer", "seo ai humanizer"],
    detector: ["bypass ai detector", "ai detector bypass", "beat ai detection", "pass ai detector"],
    language: ["multilingual ai humanizer", "ai humanizer languages", "humanize ai text language"],
    niche: ["ai humanizer niche", "humanize ai content", "ai writing humanizer"],
    pricing: ["ai humanizer pricing", "free ai humanizer", "ai humanizer cost", "ai humanizer plans"],
    industry: ["ai humanizer for professionals", "industry ai humanizer", "professional ai content"],
    format: ["ai humanizer for content", "format ai humanizer", "humanize ai format"],
    speed: ["instant ai humanizer", "fast ai humanizer", "ai humanizer speed"],
    quality: ["best quality ai humanizer", "natural ai humanizer", "human-like ai text"],
    tool: ["ai humanizer integration", "ai humanizer tool", "ai humanizer platform"],
    problem: ["fix ai detection", "ai detection problem", "ai flagged content fix"],
    workflow: ["ai humanizer bulk", "ai humanizer workflow", "ai humanizer for teams"],
    score: ["reduce ai score", "ai score reducer", "get 0 ai score"],
    region: ["ai humanizer for students", "bypass turnitin university", "ai humanizer global"],
    // V4 clusters
    comparison: ["humanifylab vs", "ai humanizer comparison", "best ai humanizer alternative", "undetectable ai comparison"],
    alternative: ["ai humanizer alternative", "best alternative", "switch to humanifylab", "ai humanizer replacement"],
    review: ["ai humanizer review", "does it work", "is it worth it", "honest review 2026"],
    free: ["free ai humanizer", "no sign up ai humanizer", "free bypass ai detection", "free undetectable ai"],
    detection: ["does turnitin detect", "can gptzero detect", "ai detection bypass", "bypass ai detector"],
    writing: ["ai humanizer for writing", "content type humanizer", "undetectable ai writing", "bypass ai detection writing"],
    education: ["student ai humanizer", "essay humanizer", "bypass turnitin essay", "academic ai bypass"],
    platform: ["ai humanizer for platform", "platform ai humanizer", "bypass ai detection platform"],
    output: ["make ai sound human", "make ai undetectable", "ai to human converter", "humanize ai output"],
    bulk: ["bulk ai humanizer", "mass humanize", "batch ai humanizer", "enterprise ai humanizer"],
  };
  const entityKw = entity && !["AI Humanizer", "Guide", "Use Case", "Academic", "Professional", "AI Detector", "Multilingual", "Niche", "Competitor", "Pricing", "Speed", "Quality", "Problem", "Workflow", "Score", "HumanifyLab"].includes(entity)
    ? [entity.toLowerCase(), `${entity.toLowerCase()} bypass`, `humanize ${entity.toLowerCase()}`, `${entity.toLowerCase()} ai humanizer`]
    : [];
  // keyword appears first — signals to Google this is the primary topic
  return [keyword, ...core, ...(clusterKws[cluster] ?? []), ...entityKw];
}

export async function generateStaticParams() {
  const v1 = getAllSlugs().map((slug) => ({ keyword: slug }));
  const v2 = getAllV2Slugs().map((slug) => ({ keyword: slug }));
  const v3 = getAllV3Slugs().map((slug) => ({ keyword: slug }));
  const v4 = getAllV4Slugs().map((slug) => ({ keyword: slug }));
  const geo = getAllGeoSlugs().map((slug) => ({ keyword: slug }));
  return [...v1, ...v2, ...v3, ...v4, ...geo];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { keyword } = await params;
  const entry = getKeywordBySlug(keyword);
  const entryV2 = entry ? null : getV2KeywordBySlug(keyword);
  const entryV3 = entry || entryV2 ? null : getV3KeywordBySlug(keyword);
  const entryV4 = entry || entryV2 || entryV3 ? null : getV4KeywordBySlug(keyword);
  const entryGeo = entry || entryV2 || entryV3 || entryV4 ? null : getGeoKeywordBySlug(keyword);
  if (!entry && !entryV2 && !entryV3 && !entryV4 && !entryGeo) return { title: "Not Found" };

  if (entryGeo) {
    const geoData = generateGeoContent(entryGeo);
    const url = `${BASE_URL}/${keyword}`;
    return {
      title: { absolute: geoData.metaTitle },
      description: geoData.metaDescription,
      keywords: [entryGeo.keyword, "ai humanizer", "bypass ai detection", "undetectable ai", entryGeo.entity.toLowerCase()],
      authors: [{ name: "HumanifyLab", url: BASE_URL }],
      creator: "HumanifyLab",
      publisher: "HumanifyLab",
      alternates: { canonical: url },
      openGraph: {
        title: geoData.metaTitle,
        description: geoData.metaDescription,
        url,
        siteName: "HumanifyLab",
        locale: "en_US",
        type: "article",
        images: [{ url: `${BASE_URL}/forOpenGraph.png`, width: 1200, height: 630, alt: geoData.h1 }],
      },
      twitter: {
        card: "summary_large_image",
        title: geoData.metaTitle,
        description: geoData.metaDescription,
        images: [`${BASE_URL}/forOpenGraph.png`],
        site: "@humanifylab",
        creator: "@humanifylab",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
      },
    };
  }

  const url = `${BASE_URL}/${keyword}`;
  let metaTitle = "";
  let metaDescription = "";

  if (entry) {
    switch (entry.cluster) {
      case "bypass": { const d = generateBypassContent(entry); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "humanizer": { const d = generateHumanizerContent(entry); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "howto": { const d = generateHowToContent(entry); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "usecase": { const d = generateUseCaseContent(entry); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
    }
  } else if (entryV2) {
    switch (entryV2.cluster) {
      case "competitor": { const d = generateCompetitorContent(entryV2); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "academic": { const d = generateAcademicContent(entryV2); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "professional": { const d = generateProfessionalContent(entryV2); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "detector": { const d = generateDetectorContent(entryV2); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "language": { const d = generateLanguageContent(entryV2); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "niche": { const d = generateNicheContent(entryV2); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
    }
  } else if (entryV3) {
    const e3 = entryV3;
    switch (e3.cluster) {
      case "pricing": { const d = generatePricingContent(e3); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "industry": { const d = generateIndustryContent(e3); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "format": { const d = generateFormatContent(e3); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "speed": { const d = generateSpeedContent(e3); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "quality": { const d = generateQualityContent(e3); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "tool": { const d = generateToolContent(e3); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "problem": { const d = generateProblemContent(e3); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "workflow": { const d = generateWorkflowContent(e3); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "score": { const d = generateScoreContent(e3); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "region": { const d = generateRegionContent(e3); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
    }
  } else {
    const e4 = entryV4!;
    switch (e4.cluster) {
      case "comparison": { const d = generateComparisonContent(e4); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "alternative": { const d = generateAlternativeContent(e4); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "review": { const d = generateReviewContent(e4); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "free": { const d = generateFreeContent(e4); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "detection": { const d = generateDetectionContent(e4); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "writing": { const d = generateWritingContent(e4); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "education": { const d = generateEducationContent(e4); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "platform": { const d = generatePlatformV4Content(e4); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "output": { const d = generateOutputContent(e4); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
      case "bulk": { const d = generateBulkContent(e4); metaTitle = d.metaTitle; metaDescription = d.metaDescription; break; }
    }
  }

  const clusterForKeywords = entry?.cluster ?? entryV2?.cluster ?? entryV3?.cluster ?? entryV4?.cluster ?? 'bypass';
  const entityForKeywords = entry?.entity ?? entryV2?.entity ?? entryV3?.entity ?? entryV4?.entity ?? '';
  const keywordStr = entry?.keyword ?? entryV2?.keyword ?? entryV3?.keyword ?? entryV4?.keyword ?? keyword;
  const seedVal = entry?.seed ?? entryV2?.seed ?? entryV3?.seed ?? entryV4?.seed ?? 0;

  return {
    // Generated titles already include the brand suffix — absolute avoids
    // the layout template appending "| HumanifyLab" a second time.
    title: { absolute: metaTitle },
    description: metaDescription,
    keywords: buildKeywords(keywordStr, clusterForKeywords, entityForKeywords),
    authors: [{ name: "HumanifyLab", url: BASE_URL }],
    creator: "HumanifyLab",
    publisher: "HumanifyLab",
    alternates: { canonical: url },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      siteName: "HumanifyLab",
      locale: "en_US",
      type: "article",
      publishedTime: getPublishDate(seedVal),
      modifiedTime: getModifiedDate(seedVal, getPublishDate(seedVal)),
      authors: [BASE_URL],
      images: [{
        url: `${BASE_URL}/forOpenGraph.png`,
        width: 1200,
        height: 630,
        alt: `${keywordStr} — HumanifyLab AI Humanizer`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [`${BASE_URL}/forOpenGraph.png`],
      site: "@humanifylab",
      creator: "@humanifylab",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function KeywordPage({ params }: PageProps) {
  const { keyword } = await params;
  const entry = getKeywordBySlug(keyword);
  const entryV2 = entry ? null : getV2KeywordBySlug(keyword);
  const entryV3 = entry || entryV2 ? null : getV3KeywordBySlug(keyword);
  const entryV4 = entry || entryV2 || entryV3 ? null : getV4KeywordBySlug(keyword);
  const entryGeo = entry || entryV2 || entryV3 || entryV4 ? null : getGeoKeywordBySlug(keyword);
  if (!entry && !entryV2 && !entryV3 && !entryV4 && !entryGeo) notFound();

  if (entryGeo) {
    const geoData = generateGeoContent(entryGeo);
    const geoJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": `${BASE_URL}/${keyword}#article`,
          headline: geoData.h1,
          description: geoData.metaDescription,
          inLanguage: "en-US",
          author: { "@type": "Organization", name: "HumanifyLab", url: BASE_URL },
          publisher: {
            "@type": "Organization", name: "HumanifyLab", url: BASE_URL,
            logo: { "@type": "ImageObject", url: `${BASE_URL}/humanify.png`, width: 512, height: 512 },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/${keyword}` },
        },
        {
          "@type": "FAQPage",
          "@id": `${BASE_URL}/${keyword}#faq`,
          mainEntity: geoData.faqs.map((f) => ({
            "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${BASE_URL}/${keyword}#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Countries & Regions", item: `${BASE_URL}/topics/geo` },
            { "@type": "ListItem", position: 3, name: entryGeo.entity, item: `${BASE_URL}/${keyword}` },
          ],
        },
      ],
    };
    return (
      <SEOPageWrapper keyword={entryGeo.keyword} cluster="geo">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(geoJsonLd) }} />
        <GeoTemplate data={geoData} />
      </SEOPageWrapper>
    );
  }

  const seed = entry?.seed ?? entryV2?.seed ?? entryV3?.seed ?? entryV4?.seed ?? 0;
  const kw = entry?.keyword ?? entryV2?.keyword ?? entryV3?.keyword ?? entryV4?.keyword ?? keyword;
  const publishDate = getPublishDate(seed);
  const modifiedDate = getModifiedDate(seed, publishDate);

  // Deterministic per-page feature subset for the SoftwareApplication schema
  const ALL_FEATURES = [
    "Bypasses Turnitin, GPTZero and Originality.ai",
    "Results in under 10 seconds",
    "Zero data retention",
    "50+ language support",
    "Bulk processing available",
    "API access on paid plans",
    "Academic writing optimized",
    "Professional tone presets",
    "No sign-up required for free plan",
    "Meaning-preserving rewriting",
    "Bypasses Copyleaks, Winston AI and Sapling",
  ];

  function pickFeatures(keyword: string, seed: number): string[] {
    let hash = 0;
    for (let i = 0; i < keyword.length; i++) {
      hash = ((hash << 5) - hash + keyword.charCodeAt(i)) | 0;
    }
    const start = Math.abs(hash + seed) % (ALL_FEATURES.length - 5);
    return ALL_FEATURES.slice(start, start + 5);
  }

  const pageFeatures = pickFeatures(kw, seed);

  function buildJsonLd(
    title: string,
    description: string,
    faqs: { q: string; a: string }[],
    breadcrumbName: string,
  ) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        // Article — unique datePublished per page
        {
          "@type": "Article",
          "@id": `${BASE_URL}/${keyword}#article`,
          headline: title,
          description,
          datePublished: publishDate,
          dateModified: modifiedDate,
          inLanguage: "en-US",
          author: {
            "@type": "Organization",
            name: "HumanifyLab",
            url: BASE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "HumanifyLab",
            url: BASE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${BASE_URL}/humanify.png`,
              width: 512,
              height: 512,
            },
          },
          image: {
            "@type": "ImageObject",
            url: `${BASE_URL}/forOpenGraph.png`,
            width: 1200,
            height: 630,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${BASE_URL}/${keyword}`,
          },
        },
        // FAQPage — unique questions per page via content generator
        {
          "@type": "FAQPage",
          "@id": `${BASE_URL}/${keyword}#faq`,
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        },
        // SoftwareApplication — the product this page is about
        {
          "@type": "SoftwareApplication",
          "@id": `${BASE_URL}/${keyword}#app`,
          name: "HumanifyLab",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web",
          url: BASE_URL,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Free plan available — no credit card required",
          },
          featureList: pageFeatures,
        },
        // BreadcrumbList
        {
          "@type": "BreadcrumbList",
          "@id": `${BASE_URL}/${keyword}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: BASE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: breadcrumbName,
              item: `${BASE_URL}/${keyword}`,
            },
          ],
        },
        // WebPage
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}/${keyword}`,
          url: `${BASE_URL}/${keyword}`,
          name: title,
          description,
          inLanguage: "en-US",
          isPartOf: {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            name: "HumanifyLab",
            url: BASE_URL,
          },
          datePublished: publishDate,
          dateModified: modifiedDate,
          breadcrumb: { "@id": `${BASE_URL}/${keyword}#breadcrumb` },
        },
      ],
    };
  }

  switch (entry?.cluster) {
    case "bypass": {
      const data = generateBypassContent(entry!);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, entry!.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="bypass" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><BypassTemplate data={data} /></SEOPageWrapper>);
    }
    case "humanizer": {
      const data = generateHumanizerContent(entry!);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, entry!.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="humanizer" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><HumanizerTemplate data={data} /></SEOPageWrapper>);
    }
    case "howto": {
      const data = generateHowToContent(entry!);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, entry!.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="howto" publishDate={publishDate} updatedDate={modifiedDate} readTime={data.readTime}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><HowToTemplate data={data} /></SEOPageWrapper>);
    }
    case "usecase": {
      const data = generateUseCaseContent(entry!);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, entry!.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="usecase" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><UseCaseTemplate data={data} /></SEOPageWrapper>);
    }
  }

  // V2 clusters
  if (entryV2) {
    const e2 = entryV2;
    switch (e2.cluster) {
      case "competitor": {
        const data = generateCompetitorContent(e2);
        const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
        return (<SEOPageWrapper keyword={kw} cluster="competitor" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><CompetitorTemplate data={data} /></SEOPageWrapper>);
      }
      case "academic": {
        const data = generateAcademicContent(e2);
        const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
        return (<SEOPageWrapper keyword={kw} cluster="academic" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><AcademicTemplate data={data} /></SEOPageWrapper>);
      }
      case "professional": {
        const data = generateProfessionalContent(e2);
        const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
        return (<SEOPageWrapper keyword={kw} cluster="professional" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><ProfessionalTemplate data={data} /></SEOPageWrapper>);
      }
      case "detector": {
        const data = generateDetectorContent(e2);
        const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
        return (<SEOPageWrapper keyword={kw} cluster="detector" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><DetectorTemplate data={data} /></SEOPageWrapper>);
      }
      case "language": {
        const data = generateLanguageContent(e2);
        const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
        return (<SEOPageWrapper keyword={kw} cluster="language" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><LanguageTemplate data={data} /></SEOPageWrapper>);
      }
      case "niche": {
        const data = generateNicheContent(e2);
        const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
        return (<SEOPageWrapper keyword={kw} cluster="niche" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><NicheTemplate data={data} /></SEOPageWrapper>);
      }
    }
  }

  // V3 clusters
  if (entryV3) {
  const e3 = entryV3;
  switch (e3.cluster) {
    case "pricing": {
      const data = generatePricingContent(e3);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e3.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="pricing" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><PricingTemplate data={data} /></SEOPageWrapper>);
    }
    case "industry": {
      const data = generateIndustryContent(e3);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e3.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="industry" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><IndustryTemplate data={data} /></SEOPageWrapper>);
    }
    case "format": {
      const data = generateFormatContent(e3);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e3.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="format" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><FormatTemplate data={data} /></SEOPageWrapper>);
    }
    case "speed": {
      const data = generateSpeedContent(e3);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e3.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="speed" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><SpeedTemplate data={data} /></SEOPageWrapper>);
    }
    case "quality": {
      const data = generateQualityContent(e3);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e3.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="quality" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><QualityTemplate data={data} /></SEOPageWrapper>);
    }
    case "tool": {
      const data = generateToolContent(e3);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e3.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="tool" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><ToolTemplate data={data} /></SEOPageWrapper>);
    }
    case "problem": {
      const data = generateProblemContent(e3);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e3.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="problem" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><ProblemTemplate data={data} /></SEOPageWrapper>);
    }
    case "workflow": {
      const data = generateWorkflowContent(e3);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e3.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="workflow" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><WorkflowTemplate data={data} /></SEOPageWrapper>);
    }
    case "score": {
      const data = generateScoreContent(e3);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e3.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="score" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><ScoreTemplate data={data} /></SEOPageWrapper>);
    }
    case "region": {
      const data = generateRegionContent(e3);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e3.keyword);
      return (<SEOPageWrapper keyword={kw} cluster="region" publishDate={publishDate} updatedDate={modifiedDate}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><RegionTemplate data={data} /></SEOPageWrapper>);
    }
  }
  } // end if (entryV3)
  // V4 clusters — all use V4Template
  if (entryV4) {
    const e4 = entryV4;
    let v4Data;
    switch (e4.cluster) {
      case "comparison":  v4Data = generateComparisonContent(e4); break;
      case "alternative": v4Data = generateAlternativeContent(e4); break;
      case "review":      v4Data = generateReviewContent(e4); break;
      case "free":        v4Data = generateFreeContent(e4); break;
      case "detection":   v4Data = generateDetectionContent(e4); break;
      case "writing":     v4Data = generateWritingContent(e4); break;
      case "education":   v4Data = generateEducationContent(e4); break;
      case "platform":    v4Data = generatePlatformV4Content(e4); break;
      case "output":      v4Data = generateOutputContent(e4); break;
      case "bulk":        v4Data = generateBulkContent(e4); break;
      default: notFound();
    }
    if (!v4Data) notFound();
    const jsonLd = buildJsonLd(v4Data.h1, v4Data.metaDescription, v4Data.faqs, e4.keyword);
    return (
      <SEOPageWrapper keyword={kw} cluster={e4.cluster} publishDate={publishDate} updatedDate={modifiedDate}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <V4Template data={v4Data} cluster={e4.cluster} />
      </SEOPageWrapper>
    );
  }
}
